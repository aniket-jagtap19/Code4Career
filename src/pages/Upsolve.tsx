import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ArrowLeft,
  Brain,
  Send,
  Code,
  Lightbulb,
  CheckCircle,
  Loader,
  Copy,
  AlertCircle,
  Clock,
} from "lucide-react";
import { rateLimitService } from "../services/rateLimitService";

interface Message {
  id: number;
  type: "ai" | "user";
  content: string;
  code?: string;
  codeLanguage?: string;
  timestamp?: Date;
}

interface ProblemData {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  problemStatement: string;
}

interface RateLimitState {
  remaining: number;
  resetTime: number;
  isLimited: boolean;
}

const problemsDatabase: Record<string, ProblemData> = {
  "cp-q2": {
    id: "cp-q2",
    title: "Maximum Subarray Sum (Kadane's Algorithm)",
    topic: "Arrays & Dynamic Programming",
    difficulty: "Medium",
    problemStatement: `Given an integer array nums, find the contiguous subarray with the maximum sum and return that sum.

Example:
Input: [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.

Constraints:
- 1 ≤ n ≤ 10^5
- -10^4 ≤ nums[i] ≤ 10^4`,
  },
  "cp-q1": {
    id: "cp-q1",
    title: "Two Sum",
    topic: "Arrays & Hashing",
    difficulty: "Easy",
    problemStatement: `Given an array nums and an integer target, return the indices of the two numbers that add up to target.
You may assume each input has exactly one solution, and you cannot use the same element twice.`,
  },
  "dsa-q1": {
    id: "dsa-q1",
    title: "Reverse Linked List",
    topic: "Linked Lists",
    difficulty: "Easy",
    problemStatement: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
  },
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

console.log("GEMINI_API_KEY in Upsolve:", GEMINI_API_KEY ? "SET" : "NOT SET");


function extractCodeBlocks(text: string): {
  content: string;
  code?: string;
} {
 
  const codeRegex = /``````/;
  const match = text.match(codeRegex);

  if (match && match[1]) {
    const code = match[1].trim();
    const content = text.replace(match[0], "\n\n[👇 CODE BELOW]\n\n").trim();
    return { content, code };
  }

  return { content: text };
}


async function callGeminiAI(
  userMessage: string,
  problemContext: string
): Promise<{ response: string; fromCache: boolean }> {
  console.log("🔵 callGeminiAI (OpenRouter)");

  if (!GEMINI_API_KEY) {
    return { response: "❌ API key not set", fromCache: false };
  }

  const requestKey = rateLimitService.generateRequestKey(
    userMessage,
    problemContext.substring(0, 100)
  );

  const { allowed, waitMs } = rateLimitService.canMakeRequest(requestKey);

  if (!allowed) {
    const seconds = Math.ceil(waitMs / 1000);
    return {
      response: `⏱️ Rate limit: Wait ${seconds}s`,
      fromCache: false,
    };
  }

  rateLimitService.markInFlight(requestKey);

  try {
    const fullPrompt = `You are an expert competitive programming tutor.

PROBLEM:
${problemContext}

QUESTION:
"${userMessage}"

Provide explanation, code examples, and complexity analysis.
Answer clearly and concisely.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    console.log("OpenRouter payload:", {
      model: "meta-llama/llama-3-8b-instruct:free",
      promptLength: fullPrompt.length,
      apiKeySet: !!GEMINI_API_KEY,
    });

    const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GEMINI_API_KEY}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "AI Upsolve",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct", 
      messages: [
        {
          role: "user",
          content: fullPrompt,
        },
      ],
      max_tokens: 500,
    }),
  }
);


    clearTimeout(timeoutId);

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers));

    if (!response.ok) {
      rateLimitService.removeInflight(requestKey);

      const errorText = await response.text();
      console.error("API Error Response:", errorText);

      if (response.status === 429) {
        return {
          response: `⏱️ Rate Limited (429)\n\nPlease wait a moment.`,
          fromCache: false,
        };
      }

      if (response.status === 404) {
        return {
          response: `❌ 404 Not Found\n\nCheck:\n1. API key is valid (test at openrouter.ai)\n2. Model name: meta-llama/llama-3-8b-instruct:free\n3. .env.local has VITE_GEMINI_API_KEY set\n\nDebug: ${errorText}`,
          fromCache: false,
        };
      }

      if (response.status === 401) {
        return {
          response: `❌ 401 Unauthorized\n\nYour API key is invalid or expired.\nGet new key: https://openrouter.ai/keys`,
          fromCache: false,
        };
      }

      return {
        response: `⚠️ API Error (${response.status}): ${errorText}`,
        fromCache: false,
      };
    }

    const data = await response.json();
    console.log("OpenRouter response:", data);

    if (data?.choices?.[0]?.message?.content) {
      rateLimitService.removeInflight(requestKey);
      return {
        response: data.choices[0].message.content,
        fromCache: false,
      };
    }

    rateLimitService.removeInflight(requestKey);
    return { response: "⚠️ Empty response from AI", fromCache: false };
  } catch (err) {
    rateLimitService.removeInflight(requestKey);

    if (err instanceof Error && err.name === "AbortError") {
      return {
        response: "⏱️ Request timeout (30s). Try a simpler question.",
        fromCache: false,
      };
    }

    return {
      response: `⚠️ Error: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      fromCache: false,
    };
  }
}





const Upsolve = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [problemId] = useState("cp-q2");
  const [apiStatus, setApiStatus] = useState<
    "ready" | "loading" | "rate-limited" | "error" | "no-key"
  >(GEMINI_API_KEY ? "ready" : "no-key");
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitState>({
    remaining: 12,
    resetTime: 0,
    isLimited: false,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const problem = problemsDatabase[problemId];

  useEffect(() => {
    if (messages.length === 0 && problem) {
      const greeting: Message = {
        id: 1,
        type: "ai",
        content: `👋 Hi! I'm your AI tutor powered by Google Gemini. I'm here to help you understand "${problem.title}"**.

**Problem:**
${problem.problemStatement}

You can ask me about:
- 📚 How to approach this problem
- 💡 Algorithm explanations
- 🔍 Step-by-step examples
- 💻 Code implementations
- ⏱️ Complexity analysis
- 🎯 Similar problems
- 🐛 Edge cases & debugging

${
  !GEMINI_API_KEY
    ? "\n⚠️ **Note:** API key not detected. Using demo mode.\n\nTo enable real AI:\n1. Visit: https://aistudio.google.com/app/apikey\n2. Create free key\n3. Add to .env.local: VITE_GEMINI_API_KEY=your_key\n4. Restart dev server"
    : ""
}

⚡ Pro Tips:
- Ask detailed questions to get better responses
- Wait between requests (max 12/minute to stay safe)
- Similar questions use cache (instant!)

What would you like to know?`,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [problem, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ UPDATE RATE LIMIT INFO from centralized service
  useEffect(() => {
    const interval = setInterval(() => {
      const status = rateLimitService.getStatus();
      setRateLimitInfo({
        remaining: status.remaining,
        resetTime: status.resetMs,
        isLimited: status.resetMs > 0,
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: messages.length + 1,
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setApiStatus("loading");

    try {
      const problemContext = `
PROBLEM: ${problem?.title}
DIFFICULTY: ${problem?.difficulty}
TOPIC: ${problem?.topic}

STATEMENT:
${problem?.problemStatement}
`;

      const { response: aiResponse, fromCache } = await callGeminiAI(
        input,
        problemContext
      );
      const { content, code } = extractCodeBlocks(aiResponse);

      const aiMsg: Message = {
        id: messages.length + 2,
        type: "ai",
        content: fromCache ? `✓ [From Cache]\n\n${content}` : content,
        code: code,
        codeLanguage: code ? "javascript" : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      
      // Update API status based on rate limit
      const status = rateLimitService.getStatus();
      setApiStatus(status.resetMs > 0 ? "rate-limited" : "ready");
    } catch (err) {
      console.error("Error:", err);
      setApiStatus("error");

      const errorMsg: Message = {
        id: messages.length + 2,
        type: "ai",
        content: `❌ Error: ${
          err instanceof Error ? err.message : "Failed to get response"
        }`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [input, messages.length, problem, loading]);

  const suggestions = [
    "Explain the optimal approach",
    "Show me the code solution",
    "What's the time complexity?",
    "Walk me through an example",
    "Similar problems to practice",
    "How do I optimize this?",
  ];

  const copyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[60px]" />
      </div>

      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/ai-analysis" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
              </Link>
              <div>
                <h1 className="font-bold text-foreground">
                  AI Upsolving Session
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {problem?.title} ({problem?.difficulty})
                  </p>
                  {apiStatus === "ready" && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      ✓ Connected
                    </span>
                  )}
                  {apiStatus === "no-key" && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                      ⚠ Demo Mode
                    </span>
                  )}
                  {apiStatus === "rate-limited" && (
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Waiting: {Math.ceil(rateLimitInfo.resetTime / 1000)}s
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Link to="/ai-analysis">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative z-10 overflow-hidden">
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="max-w-3xl mx-auto w-full space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 animate-slide-up ${
                    message.type === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      message.type === "ai"
                        ? "bg-primary/20"
                        : "bg-accent/20"
                    }`}
                  >
                    {message.type === "ai" ? (
                      <Brain className="w-5 h-5 text-primary" />
                    ) : (
                      <span className="text-sm font-bold text-accent">U</span>
                    )}
                  </div>

                  <div
                    className={`flex-1 ${
                      message.type === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl max-w-2xl ${
                        message.type === "ai"
                          ? "bg-card border border-border rounded-tl-none text-left"
                          : "bg-primary/20 border border-primary/30 rounded-tr-none"
                      }`}
                    >
                      <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>

                      {message.code && (
                        <div className="mt-4 p-4 rounded-lg bg-background border border-border overflow-x-auto">
                          <div className="flex items-center justify-between mb-2 sticky left-0 bg-background">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Code className="w-3 h-3" />
                              {message.codeLanguage || "Code"}
                            </div>
                            <button
                              onClick={() =>
                                copyCode(message.code!, message.id)
                              }
                              className="p-1 hover:bg-secondary rounded transition flex items-center gap-1"
                              title="Copy code"
                            >
                              {copiedId === message.id ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  <span className="text-xs text-green-400">
                                    Copied
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-xs">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="text-xs font-mono text-foreground overflow-x-auto">
                            {message.code}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Loader className="w-5 h-5 text-primary animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground">
                      AI Tutor is thinking... ✨
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {!loading && (
            <div className="px-6 py-3 border-t border-border bg-card/30">
              <div className="max-w-3xl mx-auto">
                <p className="text-xs text-muted-foreground mb-2">
                  Quick suggestions:
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      disabled={loading || rateLimitInfo.isLimited}
                      className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="px-6 py-4 border-t border-border bg-card/50 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto w-full">
              <div className="flex gap-3 mb-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                  placeholder={
                    rateLimitInfo.isLimited
                      ? `Wait ${Math.ceil(rateLimitInfo.resetTime / 1000)}s...`
                      : "Ask your AI tutor..."
                  }
                  disabled={loading || rateLimitInfo.isLimited}
                  className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-sm"
                />
                <Button
                  variant="glow"
                  onClick={handleSend}
                  disabled={loading || !input.trim() || rateLimitInfo.isLimited}
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {apiStatus === "no-key" && (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      Demo mode. Add VITE_GEMINI_API_KEY to .env.local for real AI.
                    </>
                  )}
                  {GEMINI_API_KEY && (
                    <>
                      <span
                        className={
                          rateLimitInfo.isLimited
                            ? "text-orange-400"
                            : "text-green-400"
                        }
                      >
                        {rateLimitInfo.remaining}/{12}
                      </span>
                      <span>requests available</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className="w-80 border-l border-border bg-card/30 hidden lg:block p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground text-sm">
                  Rate Limit Info
                </h3>
              </div>
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-xs text-foreground leading-relaxed">
                  <strong>Requests Left:</strong> {rateLimitInfo.remaining}/12
                  <br />
                  <strong>Status:</strong>{" "}
                  {rateLimitInfo.isLimited ? (
                    <span className="text-orange-400">
                      Waiting {Math.ceil(rateLimitInfo.resetTime / 1000)}s
                    </span>
                  ) : (
                    <span className="text-green-400">Ready</span>
                  )}
                  <br />
                  <br />
                  <strong>Tip:</strong> Ask detailed questions to get better
                  answers and use fewer requests!
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground text-sm">
                  Key Insight
                </h3>
              </div>
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-xs text-foreground leading-relaxed">
                  Kadane's Algorithm: At each position, decide whether to extend
                  the current sum or start fresh. Keep track of maximum seen.
                  Time: O(n), Space: O(1)
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">
                  Practice Similar
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Best Time to Buy Stock", level: "Easy" },
                  { name: "Maximum Product Subarray", level: "Medium" },
                  { name: "Subarray Sum Equals K", level: "Medium" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
                    <p className="text-xs font-medium text-foreground">
                      {p.name}
                    </p>
                    <span
                      className={`text-[10px] ${
                        p.level === "Easy"
                          ? "text-green-400"
                          : "text-amber-400"
                      }`}
                    >
                      {p.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-foreground text-sm">
                  Your Progress
                </h3>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    Understanding
                  </span>
                  <span className="text-xs font-medium text-green-400">
                    {Math.min(Math.floor((messages.length / 10) * 100), 100)}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all"
                    style={{
                      width: `${Math.min((messages.length / 10) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Keep learning! 🎯
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Upsolve;
