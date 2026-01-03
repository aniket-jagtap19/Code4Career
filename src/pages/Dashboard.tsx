import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Zap, Trophy, Calendar, Clock, Users, TrendingUp, 
  ArrowRight, Code, Brain, Calculator, Target, LogOut
} from "lucide-react";

const Dashboard = () => {
  const skills = [
    { name: "CP", level: 72, color: "bg-primary" },
    { name: "DSA", level: 85, color: "bg-green-400" },
    { name: "Dev", level: 58, color: "bg-accent" },
    { name: "Aptitude", level: 91, color: "bg-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">SkillSprint</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm text-primary font-medium">Div 3</span>
              </div>
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, <span className="gradient-text">Rahul!</span>
          </h1>
          <p className="text-muted-foreground">Ready for the next challenge?</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Contest Card */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                      UPCOMING
                    </span>
                    <span className="px-2 py-1 rounded-full bg-secondary text-muted-foreground text-xs">
                      Div 3
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Weekly Placement Contest #12</h2>
                  <p className="text-muted-foreground text-sm">CP • DSA • Developer • Aptitude</p>
                </div>
                <Trophy className="w-10 h-10 text-accent" />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-secondary">
                  <Calendar className="w-4 h-4 text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">Jan 28, 2025</p>
                  <p className="text-xs text-muted-foreground">Sunday</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary">
                  <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">2 Hours</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary">
                  <Users className="w-4 h-4 text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">156</p>
                  <p className="text-xs text-muted-foreground">Registered</p>
                </div>
              </div>

              <Link to="/contest-details">
                <Button variant="glow" className="w-full group">
                  <Target className="w-4 h-4" />
                  Enter Contest
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Your Current Rank */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-lg font-semibold text-foreground mb-4">Your Current Rank</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">#47</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">1,756</p>
                    <p className="text-sm text-muted-foreground">Rating Points</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">+45</span>
                </div>
              </div>
            </div>

            {/* Skill Radar */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-lg font-semibold text-foreground mb-6">Skill Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {skill.name === "CP" && <Code className="w-4 h-4 text-primary" />}
                        {skill.name === "DSA" && <TrendingUp className="w-4 h-4 text-green-400" />}
                        {skill.name === "Dev" && <Brain className="w-4 h-4 text-accent" />}
                        {skill.name === "Aptitude" && <Calculator className="w-4 h-4 text-purple-400" />}
                        <span className="font-medium text-foreground">{skill.name}</span>
                      </div>
                      <span className="text-sm font-mono text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${skill.color} transition-all duration-1000`}
                        style={{ width: `${skill.level}%`, animationDelay: `${0.1 * index}s` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/leaderboard">
                  <Button variant="secondary" className="w-full justify-start">
                    <Trophy className="w-4 h-4 text-accent" />
                    Leaderboard
                  </Button>
                </Link>
                <Link to="/ai-analysis">
                  <Button variant="secondary" className="w-full justify-start">
                    <Brain className="w-4 h-4 text-primary" />
                    AI Tutor Analysis
                  </Button>
                </Link>
                <Link to="/growth">
                  <Button variant="secondary" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    Growth Timeline
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Performance */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <h3 className="font-semibold text-foreground mb-4">Recent Contest</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Week #11</span>
                  <span className="text-sm font-medium text-foreground">Rank #52</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Problems Solved</span>
                  <span className="text-sm font-medium text-foreground">12/15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-sm font-medium text-green-400">80%</span>
                </div>
              </div>
              <Link to="/ai-analysis" className="block mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View AI Analysis
                </Button>
              </Link>
            </div>

            {/* Division Info */}
            <div 
              className="rounded-2xl p-6 relative overflow-hidden animate-slide-up"
              style={{ 
                background: 'var(--gradient-primary)',
                animationDelay: "0.6s"
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <p className="text-background/80 text-sm mb-1">Your Division</p>
                <h4 className="font-bold text-background text-2xl mb-2">Division 3</h4>
                <p className="text-background/70 text-sm">2nd Year Students</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-background animate-pulse" />
                  <span className="text-xs text-background/80">156 active members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
