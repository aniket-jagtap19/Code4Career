import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Brain, Code, Calculator, Users, TrendingUp, Sparkles, ArrowRight, Zap } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">SkillSprint</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/college-dashboard">
              <Button variant="outline" size="sm">College Dashboard</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Placement Preparation</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up leading-tight" style={{ animationDelay: "0.1s" }}>
            One Contest.<br />
            <span className="gradient-text">All Placement Skills.</span>
          </h1>

          {/* Subtitle with skill tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <span className="px-4 py-2 rounded-full bg-secondary border border-border text-foreground font-medium flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" /> CP
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="px-4 py-2 rounded-full bg-secondary border border-border text-foreground font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" /> DSA
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="px-4 py-2 rounded-full bg-secondary border border-border text-foreground font-medium flex items-center gap-2">
              <Brain className="w-4 h-4 text-accent" /> Developer
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="px-4 py-2 rounded-full bg-secondary border border-border text-foreground font-medium flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-400" /> Aptitude
            </span>
          </div>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            The only intra-college contest platform that combines all placement skills in one arena. 
            Compete, learn, and get personalized AI guidance to ace your interviews.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Link to="/login">
              <Button variant="glow" size="lg" className="text-lg px-8 group">
                <Users className="w-5 h-5" />
                Login as Student
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/college-dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Trophy className="w-5 h-5" />
                View College Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-6 text-center animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Monthly Contests</h3>
            <p className="text-sm text-muted-foreground">Compete with peers in structured placement-style contests covering all skill areas.</p>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">AI Tutor</h3>
            <p className="text-sm text-muted-foreground">Get personalized analysis of your strengths and weaknesses with guided learning paths.</p>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center animate-slide-up" style={{ animationDelay: "0.7s" }}>
            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Division System</h3>
            <p className="text-sm text-muted-foreground">Fair competition with automatic division placement based on your year and skill level.</p>
          </div>
        </div>

        {/* Illustration */}
        <div className="mt-24 flex justify-center animate-slide-up" style={{ animationDelay: "0.8s" }}>
          <div className="relative">
            <div className="glass rounded-3xl p-8 max-w-3xl">
              <div className="flex items-center gap-6 flex-wrap justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Contest</p>
                    <p className="text-xs text-muted-foreground">Multi-skill test</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-accent">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">AI Analysis</p>
                    <p className="text-xs text-muted-foreground">Instant feedback</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-green-400">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Upsolve</p>
                    <p className="text-xs text-muted-foreground">Learn & improve</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Placement Ready</p>
                    <p className="text-xs text-muted-foreground">Crack interviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
