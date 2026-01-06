import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ArrowLeft,
  Brain,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  MessageCircle,
  Code,
  Lightbulb,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Question {
  id: string;
  section: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  statement: string;
  type: "code" | "text" | "mcq";
}

interface AnalysisState {
  answers: Record<string, string>;
  questions: Question[];
  totalTimeSpent: number;
  attemptedCount?: number;
  accuracy?: number;
}

interface AnalysisData {
  overallScore: number;
  strengths: Array<{
    skill: string;
    score: number;
    detail: string;
  }>;
  weaknesses: Array<{
    skill: string;
    score: number;
    detail: string;
  }>;
  mistakePatterns: Array<{
    pattern: string;
    impact: "High" | "Medium" | "Low";
    suggestion: string;
  }>;
  tutorAdvice: string[];
  improvementPlan: string[];
}

const AIAnalysis = () => {
  const { state } = useLocation();
  const { answers = {}, questions = [], totalTimeSpent = 0 } =
    (state as AnalysisState) || {};

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch AI analysis on mount (single call)
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        // Compute metrics from answers and questions
        const totalQuestions = questions.length;
        const attemptedCount = Object.values(answers).filter(
          (ans: any) => ans && String(ans).trim() !== ""
        ).length;
        const accuracy = Math.round((attemptedCount / totalQuestions) * 100);

        // Build contest context for AI
        const contestData = {
          totalQuestions,
          attemptedCount,
          accuracy,
          timeSpentSeconds: totalTimeSpent,
          questions: questions.map((q) => ({
            id: q.id,
            title: q.title,
            difficulty: q.difficulty,
            tags: q.tags,
            answered: !!answers[q.id],
          })),
        };

        // Call OpenRouter API
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
            "HTTP-Referer": import.meta.env.VITE_APP_URL || "http://localhost:5173",
            "X-Title": "Project109 - Competitive Programming Analysis",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct" ,
            messages: [
              {
                role: "user",
                content: generateAnalysisPrompt(contestData),
              },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content;

        if (!aiResponse) {
          throw new Error("No response from AI");
        }

        // Parse AI response
        const parsedAnalysis = parseAnalysisResponse(aiResponse, accuracy);
        setAnalysis(parsedAnalysis);
      } catch (err) {
        console.error("Analysis error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to generate analysis"
        );
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have questions and answers
    if (questions.length > 0) {
      fetchAnalysis();
    } else {
      setError("No contest data available");
      setLoading(false);
    }
  }, []); // Empty dependency array - call once on mount

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">Project109</span>
            </Link>
            <Link to="/submission">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8 max-w-5xl">
        {/* AI Header */}
        <div className="glass rounded-2xl p-6 mb-6 animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">AI Tutor Analysis</h1>
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              </div>
              <p className="text-muted-foreground">Personalized insights from your contest</p>
            </div>
            {analysis && (
              <div className="text-right hidden sm:block">
                <p className="text-2xl font-bold text-primary">{analysis.overallScore}%</p>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Analyzing your performance...</p>
            <p className="text-xs text-muted-foreground">This may take a few seconds</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass rounded-2xl p-6 bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive mb-1">Analysis Failed</h3>
                <p className="text-sm text-destructive/80">{error}</p>
                <p className="text-xs text-destructive/60 mt-2">
                  Check API key in .env.local: VITE_OPENROUTER_API_KEY
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content (when analysis available) */}
        {analysis && !loading && (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <div
                className="glass rounded-2xl p-6 animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Your Strengths</h2>
                    <p className="text-sm text-muted-foreground">Areas where you excel</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {analysis.strengths.map((item) => (
                    <div
                      key={item.skill}
                      className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{item.skill}</span>
                        <span className="text-green-400 font-bold">{item.score}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div
                className="glass rounded-2xl p-6 animate-slide-up"
                style={{ animationDelay: "0.15s" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Needs Improvement</h2>
                    <p className="text-sm text-muted-foreground">Focus areas for growth</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {analysis.weaknesses.map((item) => (
                    <div
                      key={item.skill}
                      className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{item.skill}</span>
                        <span className="text-destructive font-bold">{item.score}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mistake Patterns */}
            <div
              className="glass rounded-2xl p-6 mt-6 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Mistake Patterns</h2>
                  <p className="text-sm text-muted-foreground">
                    Common issues that affected your score
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {analysis.mistakePatterns.map((item) => (
                  <div key={item.pattern} className="p-4 rounded-xl bg-secondary flex items-start gap-4">
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                        item.impact === "High"
                          ? "bg-destructive/20 text-destructive"
                          : item.impact === "Medium"
                          ? "bg-accent/20 text-accent"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {item.impact}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">{item.pattern}</p>
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Lightbulb className="w-4 h-4" />
                        <span>{item.suggestion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tutor Says */}
            <div
              className="glass rounded-2xl p-6 mt-6 animate-slide-up"
              style={{ animationDelay: "0.25s" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">AI Tutor Says</h2>
                  <p className="text-sm text-muted-foreground">Personalized advice for you</p>
                </div>
              </div>

              <div className="space-y-4">
                {analysis.tutorAdvice.map((advice, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 p-4 rounded-2xl rounded-tl-none bg-primary/10 border border-primary/20">
                      <p className="text-foreground text-sm">{advice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Plan */}
            <div
              className="glass rounded-2xl p-6 mt-6 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Your Improvement Plan</h2>
                  <p className="text-sm text-muted-foreground">Action items to boost your score</p>
                </div>
              </div>

              <ul className="space-y-2">
                {analysis.improvementPlan.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="text-primary font-bold flex-shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div
              className="mt-6 animate-slide-up"
              style={{ animationDelay: "0.35s" }}
            >
              <Link
  to="/Upsolve"
  state={{
    answers,
    questions,
    totalTimeSpent,
  }}
>
  <Button variant="glow" size="lg" className="w-full h-14 text-lg group">
    <Code className="w-5 h-5" />
    Go to Upsolve
    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </Button>
</Link>

            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AIAnalysis;

// ============ HELPER FUNCTIONS ============

function generateAnalysisPrompt(contestData: any): string {
  return `You are an expert competitive programming mentor. Analyze this contest performance data and provide actionable feedback.

CONTEST DATA:
- Total Questions: ${contestData.totalQuestions}
- Questions Attempted: ${contestData.attemptedCount}
- Accuracy: ${contestData.accuracy}%
- Time Spent: ${Math.floor(contestData.timeSpentSeconds / 60)} minutes

QUESTIONS:
${contestData.questions
  .map(
    (q: any) =>
      `- ${q.title} (${q.difficulty}) [${q.answered ? "✓ Answered" : "✗ Skipped"}] - Tags: ${q.tags.join(", ")}`
  )
  .join("\n")}

ANALYZE AND PROVIDE (in JSON format):

{
  "overallScore": <accuracy percentage>,
  "strengths": [
    {
      "skill": "Topic/Skill name",
      "score": <percentage>,
      "detail": "Why they're good at this"
    }
  ],
  "weaknesses": [
    {
      "skill": "Topic/Skill name",
      "score": <percentage>,
      "detail": "Why they struggle here"
    }
  ],
  "mistakePatterns": [
    {
      "pattern": "Common mistake",
      "impact": "High|Medium|Low",
      "suggestion": "How to fix it"
    }
  ],
  "tutorAdvice": [
    "First advice sentence",
    "Second advice sentence"
  ],
  "improvementPlan": [
    "Action item 1",
    "Action item 2",
    "Action item 3"
  ]
}

RETURN ONLY VALID JSON, NO MARKDOWN CODE BLOCKS.`;
}

function parseAnalysisResponse(response: string, fallbackScore: number): AnalysisData {
  try {
    // Remove markdown code blocks if present
    let cleanedResponse = response;
    if (cleanedResponse.includes("```json")) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedResponse.includes("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(cleanedResponse.trim());

    // Validate and provide fallbacks
    return {
      overallScore: parsed.overallScore || fallbackScore,
      strengths: parsed.strengths || [
        {
          skill: "Problem Solving",
          score: fallbackScore,
          detail: "You attempted most questions",
        },
      ],
      weaknesses: parsed.weaknesses || [
        {
          skill: "Time Management",
          score: 50,
          detail: "Could optimize time allocation",
        },
      ],
      mistakePatterns: parsed.mistakePatterns || [
        {
          pattern: "Rushing through problems",
          impact: "Medium",
          suggestion: "Take time to understand problem constraints fully",
        },
      ],
      tutorAdvice: parsed.tutorAdvice || [
        "Great effort on the contest! Keep practicing and refining your approach.",
      ],
      improvementPlan: parsed.improvementPlan || [
        "Practice one topic daily for 30 minutes",
        "Review failed problems after each contest",
        "Time yourself on easy problems",
      ],
    };
  } catch (error) {
    console.error("Parse error:", error);
    // Return safe fallback
    return {
      overallScore: fallbackScore,
      strengths: [
        {
          skill: "Attempt Rate",
          score: fallbackScore,
          detail: "You attempted the majority of questions",
        },
      ],
      weaknesses: [
        {
          skill: "Optimization",
          score: 50,
          detail: "Could improve solution efficiency",
        },
      ],
      mistakePatterns: [
        {
          pattern: "Time allocation",
          impact: "Medium",
          suggestion: "Practice with time constraints",
        },
      ],
      tutorAdvice: [
        "Keep grinding! Every contest teaches you something new.",
      ],
      improvementPlan: [
        "Practice 1-2 problems daily",
        "Review contest problems",
        "Focus on weak topics",
      ],
    };
  }
}
