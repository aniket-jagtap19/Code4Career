import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Zap, ArrowLeft, TrendingUp, Calendar, Trophy, Target,
  ArrowUpRight, Star, Flame, Award
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";

const Growth = () => {
  const ratingHistory = [
    { week: "W1", rating: 1200, rank: 120 },
    { week: "W2", rating: 1280, rank: 105 },
    { week: "W3", rating: 1350, rank: 92 },
    { week: "W4", rating: 1420, rank: 78 },
    { week: "W5", rating: 1510, rank: 65 },
    { week: "W6", rating: 1580, rank: 58 },
    { week: "W7", rating: 1650, rank: 52 },
    { week: "W8", rating: 1756, rank: 47 },
  ];

  const skillProgress = [
    { week: "W1", cp: 45, dsa: 50, dev: 40, aptitude: 60 },
    { week: "W2", cp: 50, dsa: 55, dev: 42, aptitude: 65 },
    { week: "W3", cp: 55, dsa: 62, dev: 48, aptitude: 70 },
    { week: "W4", cp: 58, dsa: 68, dev: 50, aptitude: 75 },
    { week: "W5", cp: 62, dsa: 72, dev: 52, aptitude: 80 },
    { week: "W6", cp: 68, dsa: 78, dev: 55, aptitude: 85 },
    { week: "W7", cp: 70, dsa: 82, dev: 56, aptitude: 88 },
    { week: "W8", cp: 72, dsa: 85, dev: 58, aptitude: 91 },
  ];

  const milestones = [
    { week: "Week 2", title: "First Contest Completed", icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/20" },
    { week: "Week 4", title: "Promoted to Div 3", icon: ArrowUpRight, color: "text-green-400", bg: "bg-green-500/20" },
    { week: "Week 6", title: "7-Day Streak", icon: Flame, color: "text-orange-400", bg: "bg-orange-500/20" },
    { week: "Week 8", title: "Top 50 Rank", icon: Trophy, color: "text-primary", bg: "bg-primary/20" },
  ];

  const divisionHistory = [
    { division: "Div 4", period: "Week 1-2", status: "completed" },
    { division: "Div 3", period: "Week 3-8", status: "current" },
    { division: "Div 2", period: "Soon", status: "upcoming" },
    { division: "Div 1", period: "Goal", status: "goal" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] animate-float" style={{ animationDelay: "3s" }} />
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

      <main className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8 animate-slide-up">
          <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Growth Timeline</h1>
            <p className="text-muted-foreground">Your journey from Week 1 to now</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Starting Rating", value: "1,200", sub: "Week 1" },
            { label: "Current Rating", value: "1,756", sub: "+556 pts", highlight: true },
            { label: "Rank Improved", value: "73", sub: "120 → 47" },
            { label: "Contests Played", value: "8", sub: "8 weeks" },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className={`glass rounded-2xl p-5 animate-slide-up ${stat.highlight ? "border-green-500/30" : ""}`}
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.highlight ? "text-green-400" : "text-foreground"}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rating Progress */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold text-foreground">Rating Progress</h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ratingHistory}>
                    <defs>
                      <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[1000, 2000]} />
                    <Area 
                      type="monotone" 
                      dataKey="rating" 
                      stroke="hsl(174, 72%, 56%)" 
                      strokeWidth={3}
                      fill="url(#ratingGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skill Improvement */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Skill Improvement</h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={skillProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[30, 100]} />
                    <Line type="monotone" dataKey="cp" stroke="hsl(174, 72%, 56%)" strokeWidth={2} dot={false} name="CP" />
                    <Line type="monotone" dataKey="dsa" stroke="hsl(142, 76%, 50%)" strokeWidth={2} dot={false} name="DSA" />
                    <Line type="monotone" dataKey="dev" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} name="Dev" />
                    <Line type="monotone" dataKey="aptitude" stroke="hsl(270, 76%, 60%)" strokeWidth={2} dot={false} name="Aptitude" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">CP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-sm text-muted-foreground">DSA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm text-muted-foreground">Dev</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400" />
                  <span className="text-sm text-muted-foreground">Aptitude</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Milestones */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-accent" />
                <h2 className="font-bold text-foreground">Milestones</h2>
              </div>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.title} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${milestone.bg} flex items-center justify-center shrink-0`}>
                      <milestone.icon className={`w-5 h-5 ${milestone.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{milestone.title}</p>
                      <p className="text-sm text-muted-foreground">{milestone.week}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Division Progress */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.25s" }}>
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-foreground">Division Journey</h2>
              </div>
              <div className="space-y-3">
                {divisionHistory.map((div, index) => (
                  <div 
                    key={div.division}
                    className={`p-3 rounded-xl border ${
                      div.status === "current" 
                        ? "bg-primary/10 border-primary/30" 
                        : div.status === "completed"
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-secondary border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {div.status === "completed" && <span className="text-green-400">✓</span>}
                        {div.status === "current" && <span className="text-primary">●</span>}
                        {div.status === "upcoming" && <span className="text-muted-foreground">○</span>}
                        {div.status === "goal" && <span className="text-accent">★</span>}
                        <span className={`font-medium ${
                          div.status === "current" ? "text-primary" : "text-foreground"
                        }`}>
                          {div.division}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{div.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Goal */}
            <div 
              className="rounded-2xl p-6 relative overflow-hidden animate-slide-up"
              style={{ 
                background: 'var(--gradient-primary)',
                animationDelay: "0.3s"
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <p className="text-background/80 text-sm mb-1">Next Goal</p>
                <h3 className="font-bold text-background text-xl mb-2">Reach Division 2</h3>
                <p className="text-background/70 text-sm mb-3">
                  244 more rating points to unlock Div 2
                </p>
                <div className="h-2 bg-background/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-background rounded-full" />
                </div>
                <p className="text-xs text-background/60 mt-2">1,756 / 2,000</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Growth;
