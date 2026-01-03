import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import {
  Clock,
  Code,
  TrendingUp,
  Brain,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  Circle,
  AlertTriangle,
} from "lucide-react";

type Language = "cpp" | "python" | "java" | "javascript";
type Difficulty = "Easy" | "Medium" | "Hard";
type QuestionType = "code" | "text" | "mcq";

interface MCQOption {
  id: string; // "a" | "b" | "c" | "d"
  text: string;
}

interface TestCase {
  id: string;
  input: string;
  output: string;
  hidden?: boolean;
}

interface Question {
  id: string;
  section: number; // 0: CP, 1: DSA, 2: Dev, 3: Aptitude
  title: string;
  difficulty: Difficulty;
  tags: string[];
  statement: string;
  type: QuestionType;
  options?: MCQOption[];
  correctOptionId?: string;
  testCases?: TestCase[]; // for CP/DSA
}

interface PistonResult {
  run?: {
    stdout?: string;
    stderr?: string;
    code?: number | null;
    signal?: string | null;
  };
  compile?: {
    stdout?: string;
    stderr?: string;
  };
}

interface ExecutionSummary {
  status: string;
  stdout: string;
  stderr: string;
  passed: number;
  total: number;
}

const PISTON_URL = "https://emkc.org/api/v2/piston/execute"; // public, free[web:24][web:63]

const languageRuntime: Record<Language, { language: string; version: string }> =
  {
    cpp: { language: "c++", version: "*" },
    python: { language: "python", version: "*" },
    java: { language: "java", version: "*" },
    javascript: { language: "javascript", version: "*" },
  };

const sections = [
  { name: "CP", icon: Code, color: "text-primary", questions: 3 },
  { name: "DSA", icon: TrendingUp, color: "text-green-400", questions: 4 },
  { name: "Dev", icon: Brain, color: "text-accent", questions: 5 },
  { name: "Aptitude", icon: Calculator, color: "text-purple-400", questions: 6 },
];

const questions: Question[] = [
  // ---------- CP (code, with testcases) ----------
  {
    id: "cp-1",
    section: 0,
    title: "Maximum Subarray Sum (Kadane)",
    difficulty: "Medium",
    tags: ["Arrays", "Dynamic Programming"],
    statement: `You are given an integer array nums. Your task is to find a contiguous non-empty subarray which has the largest sum and return its sum.

Example:
Input:
8
-2 1 -3 4 -1 2 1 -5 4

Output:
6

Explanation:
The subarray [4, -1, 2, 1] has the largest sum = 6.

Constraints:
1 ≤ n ≤ 10^5
-10^4 ≤ nums[i] ≤ 10^4
`,
    type: "code",
    testCases: [
      {
        id: "1",
        input: "8\n-2 1 -3 4 -1 2 1 -5 4\n",
        output: "6\n",
      },
      {
        id: "2",
        input: "1\n5\n",
        output: "5\n",
      },
    ],
  },
  {
    id: "cp-2",
    section: 0,
    title: "Two Sum Indices",
    difficulty: "Easy",
    tags: ["Arrays", "Hashing"],
    statement: `Given an array nums of n integers and an integer target, return the indices (0-based) of the two numbers such that they add up to target.

Exactly one valid solution exists.
Print the indices in increasing order separated by a space.

Example:
Input:
4
2 7 11 15
9

Output:
0 1
`,
    type: "code",
    testCases: [
      {
        id: "1",
        input: "4\n2 7 11 15\n9\n",
        output: "0 1\n",
      },
      {
        id: "2",
        input: "3\n3 2 4\n6\n",
        output: "1 2\n",
      },
    ],
  },
  {
    id: "cp-3",
    section: 0,
    title: "Longest Palindromic Substring",
    difficulty: "Hard",
    tags: ["String", "DP"],
    statement: `Given a string s, return the longest palindromic substring in s.

You can print any one longest palindrome if there are multiple.

Example:
Input:
babad

Possible Output:
bab

Note:
Do NOT print extra spaces or lines.`,
    type: "code",
    testCases: [
      { id: "1", input: "babad\n", output: "bab\n" },
      { id: "2", input: "cbbd\n", output: "bb\n" },
    ],
  },

  // ---------- DSA (code, elaborated) ----------
  {
    id: "dsa-1",
    section: 1,
    title: "Reverse Singly Linked List",
    difficulty: "Easy",
    tags: ["Linked List"],
    statement: `You are given the head of a singly linked list. Your task is to reverse the list and print the elements of the reversed list.

Input format (for this contest):
- First line: integer n (number of nodes).
- Second line: n space-separated integers (values of nodes in order).

Output:
- Print the values of the reversed linked list in a single line, space-separated.

Example:
Input:
5
1 2 3 4 5

Output:
5 4 3 2 1
`,
    type: "code",
    testCases: [
      {
        id: "1",
        input: "5\n1 2 3 4 5\n",
        output: "5 4 3 2 1\n",
      },
      {
        id: "2",
        input: "3\n10 20 30\n",
        output: "30 20 10\n",
      },
    ],
  },
  {
    id: "dsa-2",
    section: 1,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    tags: ["Tree", "BFS"],
    statement: `You are given a binary tree in level order form (array representation using -1 as NULL).
Print the level order traversal of the tree.

Input format:
- First line: integer n (number of array elements).
- Second line: n space-separated integers, where -1 represents a null node.

Output:
- Print the values level-by-level (BFS order) in a single line, space-separated, skipping nulls.

Example:
Input:
7
3 9 20 -1 -1 15 7

Output:
3 9 20 15 7
`,
    type: "code",
    testCases: [
      {
        id: "1",
        input: "7\n3 9 20 -1 -1 15 7\n",
        output: "3 9 20 15 7\n",
      },
    ],
  },
  {
    id: "dsa-3",
    section: 1,
    title: "Merge K Sorted Lists (Values)",
    difficulty: "Hard",
    tags: ["Heap", "Linked List"],
    statement: `You are given k sorted linked lists. For simplicity in this contest, each list is provided as:

Input format:
- First line: integer k (number of lists).
- For each of the k lists:
  - First an integer n_i (length of list).
  - Then n_i space-separated integers (sorted).

Task:
Merge all the lists into one sorted list and print the merged list.

Example:
Input:
3
3 1 4 5
2 1 3
1 2

Output:
1 1 2 3 4 5
`,
    type: "code",
    testCases: [
      {
        id: "1",
        input: "3\n3 1 4 5\n2 1 3\n1 2\n",
        output: "1 1 2 3 4 5\n",
      },
    ],
  },
  {
    id: "dsa-4",
    section: 1,
    title: "LCA in BST (Values)",
    difficulty: "Hard",
    tags: ["Tree", "BST"],
    statement: `You are given a Binary Search Tree (BST) in level order (array representation, -1 as NULL),
and two distinct values p and q that exist in the tree.
Print the value of their Lowest Common Ancestor (LCA).

Input:
- First line: integer n (size of array).
- Second line: n space-separated integers (BST in level order, -1 as null).
- Third line: two integers p and q.

Output:
- Single integer: the value of LCA.

Example:
Input:
7
6 2 8 0 4 7 9
2 8

Output:
6
`,
    type: "code",
    testCases: [
      {
        id: "1",
        input: "7\n6 2 8 0 4 7 9\n2 8\n",
        output: "6\n",
      },
    ],
  },

  // ---------- DEV (MCQ) ----------
  {
    id: "dev-1",
    section: 2,
    title: "What is REST?",
    difficulty: "Easy",
    tags: ["API", "Basics"],
    statement:
      "Which of the following best describes REST (Representational State Transfer)?",
    type: "mcq",
    options: [
      { id: "a", text: "A protocol for real-time messaging between browsers" },
      { id: "b", text: "An architectural style for designing networked APIs" },
      { id: "c", text: "A database query language" },
      { id: "d", text: "A front-end JavaScript framework" },
    ],
    correctOptionId: "b",
  },
  {
    id: "dev-2",
    section: 2,
    title: "HTTP Methods",
    difficulty: "Easy",
    tags: ["API", "HTTP"],
    statement: "Which HTTP method is IDEALLY used to update an existing resource?",
    type: "mcq",
    options: [
      { id: "a", text: "GET" },
      { id: "b", text: "POST" },
      { id: "c", text: "PUT" },
      { id: "d", text: "TRACE" },
    ],
    correctOptionId: "c",
  },
  {
    id: "dev-3",
    section: 2,
    title: "Status Code 201",
    difficulty: "Easy",
    tags: ["HTTP", "Status Codes"],
    statement:
      "What does HTTP status code 201 (Created) MOST commonly indicate in a REST API?",
    type: "mcq",
    options: [
      { id: "a", text: "The request body is invalid" },
      { id: "b", text: "The resource was created successfully" },
      { id: "c", text: "The resource was deleted successfully" },
      { id: "d", text: "The server is temporarily unavailable" },
    ],
    correctOptionId: "b",
  },
  {
    id: "dev-4",
    section: 2,
    title: "Database Normalization",
    difficulty: "Medium",
    tags: ["Database", "Design"],
    statement:
      "What is the MAIN goal of database normalization in backend systems?",
    type: "mcq",
    options: [
      { id: "a", text: "To make queries slower" },
      { id: "b", text: "To reduce data redundancy and anomalies" },
      { id: "c", text: "To increase the number of tables as much as possible" },
      { id: "d", text: "To avoid using primary keys" },
    ],
    correctOptionId: "b",
  },
  {
    id: "dev-5",
    section: 2,
    title: "JWT Usage",
    difficulty: "Medium",
    tags: ["Auth", "Security"],
    statement:
      "Where is a JSON Web Token (JWT) MOST commonly used in a typical web application?",
    type: "mcq",
    options: [
      { id: "a", text: "As a database primary key" },
      { id: "b", text: "As a front-end styling token" },
      { id: "c", text: "As an access token for authentication/authorization" },
      { id: "d", text: "As a replacement for HTML" },
    ],
    correctOptionId: "c",
  },

  // ---------- APTITUDE (MCQ) ----------
  {
    id: "apt-1",
    section: 3,
    title: "Probability - Balls",
    difficulty: "Easy",
    tags: ["Probability"],
    statement:
      "A bag has 5 red and 3 blue balls. One ball is drawn at random. What is the probability that it is red?",
    type: "mcq",
    options: [
      { id: "a", text: "3/8" },
      { id: "b", text: "5/8" },
      { id: "c", text: "1/3" },
      { id: "d", text: "2/3" },
    ],
    correctOptionId: "b",
  },
  {
    id: "apt-2",
    section: 3,
    title: "Percent Change",
    difficulty: "Easy",
    tags: ["Percentages"],
    statement:
      "A number is increased by 20% and then decreased by 20%. What is the net change?",
    type: "mcq",
    options: [
      { id: "a", text: "No change" },
      { id: "b", text: "4% increase" },
      { id: "c", text: "4% decrease" },
      { id: "d", text: "8% decrease" },
    ],
    correctOptionId: "c",
  },
  {
    id: "apt-3",
    section: 3,
    title: "Series",
    difficulty: "Medium",
    tags: ["Series"],
    statement: "Find the next term in the series: 2, 6, 12, 20, 30, ?",
    type: "mcq",
    options: [
      { id: "a", text: "36" },
      { id: "b", text: "40" },
      { id: "c", text: "42" },
      { id: "d", text: "44" },
    ],
    correctOptionId: "b",
  },
  {
    id: "apt-4",
    section: 3,
    title: "Time & Work",
    difficulty: "Medium",
    tags: ["Time & Work"],
    statement:
      "A can do a work in 12 days and B in 18 days. Working together, in how many days will they finish the work?",
    type: "mcq",
    options: [
      { id: "a", text: "6 days" },
      { id: "b", text: "7.2 days" },
      { id: "c", text: "7.5 days" },
      { id: "d", text: "8 days" },
    ],
    correctOptionId: "c",
  },
  {
    id: "apt-5",
    section: 3,
    title: "Simple Interest",
    difficulty: "Easy",
    tags: ["Interest"],
    statement:
      "On a principal of ₹10,000 at 10% simple interest per annum, what is the interest in 2 years?",
    type: "mcq",
    options: [
      { id: "a", text: "₹1,000" },
      { id: "b", text: "₹2,000" },
      { id: "c", text: "₹4,000" },
      { id: "d", text: "₹5,000" },
    ],
    correctOptionId: "b",
  },
  {
    id: "apt-6",
    section: 3,
    title: "Ratio",
    difficulty: "Easy",
    tags: ["Ratio"],
    statement:
      "The ratio of boys to girls in a class is 3:2. If there are 30 students, how many girls are there?",
    type: "mcq",
    options: [
      { id: "a", text: "10" },
      { id: "b", text: "12" },
      { id: "c", text: "15" },
      { id: "d", text: "18" },
    ],
    correctOptionId: "b",
  },
];

const getDifficultyColor = (difficulty: Difficulty | string) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-400 bg-green-500/20";
    case "Medium":
      return "text-accent bg-accent/20";
    case "Hard":
      return "text-destructive bg-destructive/20";
    default:
      return "text-muted-foreground bg-secondary";
  }
};

async function runWithPiston(
  language: Language,
  source: string,
  input: string
): Promise<PistonResult> {
  const runtime = languageRuntime[language];
  const body = {
    language: runtime.language,
    version: runtime.version,
    files: [{ name: "Main", content: source }],
    stdin: input,
    args: [] as string[],
    compile_timeout: 10000,
    run_timeout: 5000,
    compile_memory_limit: -1,
    run_memory_limit: -1,
  };

  const res = await fetch(PISTON_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error("Piston API error");
  }
  return (await res.json()) as PistonResult;
}

function summarizeExecution(
  piston: PistonResult,
  testCases: TestCase[]
): ExecutionSummary {
  const stdout = (piston.run?.stdout || "").trim();
  const stderr = (piston.run?.stderr || piston.compile?.stderr || "").trim();

  let passed = 0;
  for (const tc of testCases) {
    if (!tc.output) continue;
    if (stdout.includes(tc.output.trim())) passed++;
  }

  let status = "Accepted";
  if (stderr) status = "Runtime / Compile Error";
  else if (passed < testCases.length) status = "Wrong Answer";

  return {
    status,
    stdout,
    stderr,
    passed,
    total: testCases.length,
  };
}

const Contest = () => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState<Language>("cpp");
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<ExecutionSummary | null>(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(120 * 60);

  const sectionQuestions = useMemo(
    () => questions.filter((q) => q.section === currentSection),
    [currentSection]
  );
  const currentQ = sectionQuestions[currentQuestion];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    navigate("/submission", { state: { answers } });
  };

  const handleRunCode = useCallback(async () => {
    if (!currentQ || currentQ.type !== "code") return;
    if (!answers[currentQ.id]?.trim()) return;
    const tcs = currentQ.testCases || [];

    setRunning(true);
    setRunResult(null);

    try {
      const firstInput = tcs[0]?.input || "";
      const pistonResult = await runWithPiston(
        language,
        answers[currentQ.id],
        firstInput
      );
      const summary = summarizeExecution(pistonResult, tcs);
      setRunResult(summary);
    } catch (err) {
      console.error(err);
      // fallback simple mock if Piston fails
      setRunResult({
        status: "Mock Result (Piston failed)",
        stdout: "Executed locally (mock). Cannot verify test cases.",
        stderr: "",
        passed: 0,
        total: (currentQ.testCases || []).length,
      });
    } finally {
      setRunning(false);
    }
  }, [answers, currentQ, language]);

  const totalAnswered = useMemo(
    () => Object.keys(answers).filter((k) => answers[k]?.trim()).length,
    [answers]
  );

  const goPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
    } else if (currentSection > 0) {
      const prevSec = currentSection - 1;
      const prevQs = questions.filter((q) => q.section === prevSec).length;
      setCurrentSection(prevSec);
      setCurrentQuestion(prevQs - 1);
    }
  };

  const goNext = () => {
    if (currentQuestion < sectionQuestions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection((s) => s + 1);
      setCurrentQuestion(0);
    }
  };

  const isFirst = currentSection === 0 && currentQuestion === 0;
  const isLast =
    currentSection === sections.length - 1 &&
    currentQuestion === sectionQuestions.length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-foreground hidden sm:block">
                Weekly Div 3 Contest
              </h1>
              <div className="flex items-center gap-1">
                {sections.map((section, idx) => (
                  <button
                    key={section.name}
                    onClick={() => {
                      setCurrentSection(idx);
                      setCurrentQuestion(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentSection === idx
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <section.icon className={`w-4 h-4 ${section.color}`} />
                    <span className="hidden sm:inline">{section.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold text-foreground">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Button variant="glow" size="sm" onClick={handleSubmit}>
                <Send className="w-4 h-4" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card/50 hidden lg:block">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">
                {sections[currentSection].name} Questions
              </h3>
              <span className="text-sm text-muted-foreground">
                {
                  sectionQuestions.filter(
                    (q) => answers[q.id] && answers[q.id].trim()
                  ).length
                }
                /{sectionQuestions.length}
              </span>
            </div>
            <div className="space-y-2">
              {sectionQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    currentQuestion === idx
                      ? "bg-primary/20 border border-primary/30"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      Q{idx + 1}
                    </span>
                    {answers[q.id] && answers[q.id].trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {q.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Section Progress
            </h4>
            <div className="space-y-2">
              {sections.map((section, idx) => {
                const sectionQs = questions.filter((q) => q.section === idx);
                const answered = sectionQs.filter(
                  (q) => answers[q.id] && answers[q.id].trim()
                ).length;
                return (
                  <div key={section.name} className="flex items-center gap-2">
                    <section.icon className={`w-4 h-4 ${section.color}`} />
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${
                            sectionQs.length
                              ? (answered / sectionQs.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {answered}/{sectionQs.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-auto">
            {currentQ && (
              <div className="max-w-3xl mx-auto animate-slide-up">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(
                          currentQ.difficulty
                        )}`}
                      >
                        {currentQ.difficulty}
                      </span>
                      {currentQ.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-secondary text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {currentQ.title}
                    </h2>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Q{currentQuestion + 1} of {sectionQuestions.length}
                  </span>
                </div>

                <div className="glass rounded-xl p-6 mb-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
                    {currentQ.statement}
                  </pre>
                </div>

                <div className="glass rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Your Answer
                  </h3>

                  {currentQ.type === "code" && (
                    <>
                      <div className="mb-3">
                        <label className="block text-sm text-muted-foreground mb-1">
                          Select Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) =>
                            setLanguage(e.target.value as Language)
                          }
                          className="p-2 rounded bg-secondary border border-border text-foreground"
                        >
                          <option value="cpp">C++</option>
                          <option value="java">Java</option>
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                        </select>
                      </div>

                      <CodeEditor
                        language={language}
                        value={answers[currentQ.id] || ""}
                        onChange={(val: string) =>
                          setAnswers((prev) => ({ ...prev, [currentQ.id]: val }))
                        }
                      />

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {answers[currentQ.id] &&
                          answers[currentQ.id].trim() ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              Answer saved
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 text-accent" />
                              Not answered yet
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleRunCode}
                            disabled={
                              running ||
                              !answers[currentQ.id] ||
                              !answers[currentQ.id].trim()
                            }
                          >
                            {running ? "Running..." : "Run Code (Piston)"}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [currentQ.id]:
                                  answers[currentQ.id] || "",
                              }))
                            }
                          >
                            Save
                          </Button>
                        </div>
                      </div>

                      {runResult && (
                        <div className="mt-6 glass rounded-xl p-4">
                          <p className="text-sm font-semibold mb-2">
                            Status: {runResult.status}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            Tests passed: {runResult.passed}/{runResult.total}
                          </p>
                          {runResult.stdout && (
                            <>
                              <p className="text-xs font-semibold mb-1">
                                Output
                              </p>
                              <pre className="text-sm whitespace-pre-wrap font-mono bg-background/60 p-3 rounded">
                                {runResult.stdout}
                              </pre>
                            </>
                          )}
                          {runResult.stderr && (
                            <>
                              <p className="text-xs font-semibold mt-3 mb-1 text-destructive">
                                Error
                              </p>
                              <pre className="text-sm whitespace-pre-wrap font-mono bg-destructive/10 p-3 rounded text-destructive">
                                {runResult.stderr}
                              </pre>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {currentQ.type === "mcq" && currentQ.options && (
                    <>
                      <div className="space-y-2">
                        {currentQ.options.map((opt) => {
                          const selected = answers[currentQ.id] === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() =>
                                setAnswers((prev) => ({
                                  ...prev,
                                  [currentQ.id]: opt.id,
                                }))
                              }
                              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition ${
                                selected
                                  ? "border-primary bg-primary/10 text-foreground"
                                  : "border-border bg-secondary hover:bg-secondary/80 text-foreground"
                              }`}
                            >
                              <span className="font-mono mr-2 uppercase">
                                {opt.id}.
                              </span>
                              {opt.text}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                        {answers[currentQ.id] ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Option selected
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-accent" />
                            Not answered yet
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {currentQ.type === "text" && (
                    <>
                      <textarea
                        className="w-full h-48 p-4 rounded-lg bg-secondary border border-border text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Type your answer here..."
                        value={answers[currentQ.id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [currentQ.id]: e.target.value,
                          }))
                        }
                      />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                        {answers[currentQ.id] &&
                        answers[currentQ.id].trim() ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Answer saved
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-accent" />
                            Not answered yet
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <footer className="border-t border-border bg-card/80 backdrop-blur-xl p-4">
            <div className="container mx-auto flex items-center justify-between">
              <Button variant="outline" onClick={goPrev} disabled={isFirst}>
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  {totalAnswered} of {questions.length} answered
                </span>
              </div>

              <Button variant="outline" onClick={goNext} disabled={isLast}>
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Contest;
