import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, Brain, Trophy, Target, Clock, 
  ArrowRight, Sparkles, Loader2
} from "lucide-react";

const Submission = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: "Questions Attempted", value: "13/15", icon: Target },
    { label: "Accuracy", value: "76%", icon: CheckCircle },
    { label: "Time Taken", value: "1h 42m", icon: Clock },
    { label: "Predicted Rank", value: "#45-52", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Contest Submitted Successfully!</h1>
          <p className="text-muted-foreground">Great job completing the Weekly Div 3 Contest</p>
        </div>

        {/* Stats Grid */}
        <div className="glass rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="p-4 rounded-xl bg-secondary"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Loading */}
        <div 
          className="glass rounded-2xl p-6 mb-6 animate-slide-up" 
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center relative">
              <Brain className="w-7 h-7 text-primary" />
              {isAnalyzing && (
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/50 animate-pulse" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">AI Tutor Analysis</h3>
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              </div>
              {isAnalyzing ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing your performance...</span>
                </div>
              ) : (
                <p className="text-sm text-green-400">Analysis complete! View your personalized insights.</p>
              )}
            </div>
          </div>

          {isAnalyzing && (
            <div className="mt-4">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Evaluating answers...</span>
                <span>Finding patterns...</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/ai-analysis" className="block">
            <Button 
              variant="glow" 
              size="lg" 
              className="w-full h-14 text-lg group"
              disabled={isAnalyzing}
            >
              <Brain className="w-5 h-5" />
              View AI Tutor Analysis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/leaderboard">
              <Button variant="outline" className="w-full">
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" className="w-full">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <p className="text-sm text-muted-foreground italic">
            "Every contest is a step closer to your dream placement."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Submission;
