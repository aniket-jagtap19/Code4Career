import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Zap, ArrowLeft, Clock, Users, Trophy, Target,
  Code, TrendingUp, Brain, Calculator, ArrowRight,
  CheckCircle, AlertCircle
} from "lucide-react";
import logo from "@/assests/logo.png" ;
const ContestDetails = () => {
  const sections = [
    { 
      name: "Competitive Programming", 
      short: "CP",
      icon: Code, 
      questions: 3, 
      time: "30 min",
      color: "text-primary",
      bgColor: "bg-primary/20"
    },
    { 
      name: "Data Structures & Algorithms", 
      short: "DSA",
      icon: TrendingUp, 
      questions: 4, 
      time: "35 min",
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    { 
      name: "Developer Skills", 
      short: "Dev",
      icon: Brain, 
      questions: 2, 
      time: "25 min",
      color: "text-accent",
      bgColor: "bg-accent/20"
    },
    { 
      name: "Aptitude & Reasoning", 
      short: "Aptitude",
      icon: Calculator, 
      questions: 6, 
      time: "30 min",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
  ];

  const totalQuestions = sections.reduce((acc, s) => acc + s.questions, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden">
    <img
      src={logo}
      alt="Code4Career Logo"
      className="w-6 h-6 object-contain"
    />
  </div>
  <span className="text-xl font-bold text-foreground">
    Code4Career
  </span>
</Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8 max-w-4xl">
        {/* Contest Header */}
        <div className="glass rounded-2xl p-8 mb-6 animate-slide-up">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                  STARTS IN 2 DAYS
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm">
                  Div 3
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Weekly Div 3 Placement Contest</h1>
              <p className="text-muted-foreground">Sunday, January 28, 2025 • 7:00 PM IST</p>
            </div>
            <Trophy className="w-12 h-12 text-accent hidden sm:block" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-secondary flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <p className="text-lg font-bold text-foreground">2 Hours</p>
                <p className="text-xs text-muted-foreground">Total Duration</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary flex items-center gap-3">
              <Target className="w-6 h-6 text-accent" />
              <div>
                <p className="text-lg font-bold text-foreground">{totalQuestions} Questions</p>
                <p className="text-xs text-muted-foreground">Across 4 Sections</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary flex items-center gap-3">
              <Users className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-lg font-bold text-foreground">156 Registered</p>
                <p className="text-xs text-muted-foreground">Participants</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sections Breakdown */}
        <div className="glass rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-bold text-foreground mb-6">Contest Sections</h2>
          
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div 
                key={section.name} 
                className="p-4 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-colors"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${section.bgColor} flex items-center justify-center`}>
                      <section.icon className={`w-6 h-6 ${section.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{section.name}</h3>
                      <p className="text-sm text-muted-foreground">{section.short}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium text-foreground">{section.questions} Questions</p>
                      <p className="text-sm text-muted-foreground">~{section.time}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timer Preview */}
        <div className="glass rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-bold text-foreground mb-4">Contest Timer Preview</h2>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
                  <span className="text-3xl font-bold font-mono text-foreground">02</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">HOURS</p>
              </div>
              <span className="text-3xl font-bold text-muted-foreground">:</span>
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
                  <span className="text-3xl font-bold font-mono text-foreground">00</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">MINUTES</p>
              </div>
              <span className="text-3xl font-bold text-muted-foreground">:</span>
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
                  <span className="text-3xl font-bold font-mono text-foreground">00</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">SECONDS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="glass rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-xl font-bold text-foreground mb-4">Important Rules</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
              <p className="text-muted-foreground">You must complete all sections within the 2-hour time limit.</p>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
              <p className="text-muted-foreground">Switching between sections is allowed at any time.</p>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
              <p className="text-muted-foreground">Each question has partial marking for incomplete solutions.</p>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
              <p className="text-muted-foreground">AI Tutor analysis will be available immediately after submission.</p>
            </div>
          </div>
        </div>

        {/* Start Contest Button */}
        <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Link to="/contest">
            <Button variant="glow" size="lg" className="w-full text-lg h-14 group">
              <Target className="w-5 h-5" />
              Start Contest
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ContestDetails;
