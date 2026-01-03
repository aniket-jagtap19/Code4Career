import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { analyzeContest } from "@/ai/analyzeContest";
import { Attempt, Score } from "@/ai/types";



import { 
  Zap, ArrowLeft, Brain, CheckCircle, XCircle, AlertTriangle,
  TrendingUp, Clock, Target, ArrowRight, Sparkles, MessageCircle,
  Code, Calculator, Lightbulb
} from "lucide-react";

const attempts: Attempt[] = [
  { id: 1, type: "cp", timeSpent: 18, solved: false, attempts: 2 },
  { id: 2, type: "dsa", timeSpent: 12, solved: true, attempts: 1 },
  { id: 3, type: "aptitude", timeSpent: 3, solved: true, attempts: 1 },
];

const scores: Score[] = [
  { section: "CP", score: 62 },
  { section: "DSA", score: 85 },
  { section: "Aptitude", score: 91 },
  { section: "Dev", score: 70 },
];

const AIAnalysis = () => {
 

  // ---------------- AI ANALYSIS (THIS IS THE BRAIN) ----------------
  const { strengths, weaknesses, mistakePatterns } =
    analyzeContest(attempts, scores);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: "3s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">SkillSprint</span>
            </Link>
            <Link to="/dashboard">
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
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <p className="text-muted-foreground">Personalized insights from Weekly Div 3 Contest</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-2xl font-bold text-primary">76%</p>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
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
              {strengths.map((item, index) => (
                <div 
                  key={item.skill}
                  className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{item.skill}</span>
                    <span className="text-green-400 font-bold">{item.score}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
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
              {weaknesses.map((item, index) => (
                <div 
                  key={item.skill}
                  className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{item.skill}</span>
                    <span className="text-destructive font-bold">{item.score}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mistake Patterns */}
        <div className="glass rounded-2xl p-6 mt-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Mistake Patterns Detected</h2>
              <p className="text-sm text-muted-foreground">Common issues that affected your score</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {mistakePatterns.map((item, index) => (
              <div 
                key={item.pattern}
                className="p-4 rounded-xl bg-secondary flex items-start gap-4"
              >
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  item.impact === "High" ? "bg-destructive/20 text-destructive" : "bg-accent/20 text-accent"
                }`}>
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

        {/* AI Chat Bubbles Preview */}
        <div className="glass rounded-2xl p-6 mt-6 animate-slide-up" style={{ animationDelay: "0.25s" }}>
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
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 p-4 rounded-2xl rounded-tl-none bg-primary/10 border border-primary/20">
                <p className="text-foreground">
                  "Great job on Aptitude! Your logical reasoning is strong. But I noticed you spent too much time on CP Q2 - 
                  the Maximum Subarray problem. Let me help you understand the optimal approach..."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 p-4 rounded-2xl rounded-tl-none bg-primary/10 border border-primary/20">
                <p className="text-foreground">
                  "For Arrays & Sliding Window problems, I recommend starting with the 'Two Pointers' technique. 
                  Here's a practice path I've created just for you..."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/upsolve">
            <Button variant="glow" size="lg" className="w-full h-14 text-lg group">
              <Code className="w-5 h-5" />
              Upsolve with AI Tutor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AIAnalysis;
