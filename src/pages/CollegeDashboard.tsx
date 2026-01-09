import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Zap, ArrowLeft, Users, Trophy, TrendingUp, Download,
  BarChart3, PieChart, Calendar, Target, Medal, Award
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line } from "recharts";
import logo from "@/assests/logo.png" ;
const CollegeDashboard = () => {
  const skillData = [
    { skill: "CP", score: 72, fill: "hsl(174, 72%, 56%)" },
    { skill: "DSA", score: 78, fill: "hsl(142, 76%, 50%)" },
    { skill: "Dev", score: 65, fill: "hsl(38, 92%, 50%)" },
    { skill: "Aptitude", score: 82, fill: "hsl(270, 76%, 60%)" },
  ];

  const yearData = [
    { year: "1st Year", students: 145, avgRating: 1200 },
    { year: "2nd Year", students: 132, avgRating: 1450 },
    { year: "3rd Year", students: 118, avgRating: 1680 },
    { year: "Final Year", students: 98, avgRating: 1920 },
  ];

  const consistencyData = [
    { week: "W1", participation: 85 },
    { week: "W2", participation: 82 },
    { week: "W3", participation: 88 },
    { week: "W4", participation: 91 },
    { week: "W5", participation: 87 },
    { week: "W6", participation: 93 },
  ];

  const topPerformers = [
    { name: "Arjun Sharma", year: "Final", skill: "CP", score: 2156 },
    { name: "Priya Patel", year: "Final", skill: "DSA", score: 2089 },
    { name: "Rahul Kumar", year: "3rd", skill: "Aptitude", score: 1987 },
    { name: "Sneha Gupta", year: "3rd", skill: "Dev", score: 1834 },
    { name: "Vikram Singh", year: "2nd", skill: "CP", score: 1756 },
  ];

  const placementReady = [
    { name: "Arjun Sharma", rating: 2156, skills: ["CP", "DSA"], year: "Final" },
    { name: "Priya Patel", rating: 2089, skills: ["DSA", "Aptitude"], year: "Final" },
    { name: "Rahul Kumar", rating: 1987, skills: ["Aptitude", "Dev"], year: "3rd" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px]" />
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

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                Placement Cell
              </span>
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">College Dashboard</h1>
            <p className="text-muted-foreground">Placement Cell Analytics • Updated in real-time</p>
          </div>
          <Button variant="glow" className="gap-2">
            <Download className="w-4 h-4" />
            Export Shortlist
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Students", value: "493", icon: Users, change: "+23 this month" },
            { label: "Active Participants", value: "412", icon: Target, change: "83.6% rate" },
            { label: "Avg Rating", value: "1,562", icon: TrendingUp, change: "+128 avg" },
            { label: "Placement Ready", value: "47", icon: Award, change: "Top performers" },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="glass rounded-2xl p-5 animate-slide-up"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <stat.icon className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skill Distribution */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Skill-wise Performance</h2>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="skill" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                      {skillData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Year-wise Performance */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">Year-wise Distribution</h2>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {yearData.map((item) => (
                  <div key={item.year} className="p-4 rounded-xl bg-secondary text-center">
                    <p className="text-2xl font-bold text-foreground">{item.students}</p>
                    <p className="text-xs text-muted-foreground mb-2">{item.year}</p>
                    <p className="text-sm text-primary font-medium">{item.avgRating} avg</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Consistency Index */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold text-foreground">Participation Consistency</h2>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consistencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[70, 100]} />
                    <Line 
                      type="monotone" 
                      dataKey="participation" 
                      stroke="hsl(174, 72%, 56%)" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(174, 72%, 56%)", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Performers */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.25s" }}>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-5 h-5 text-accent" />
                <h2 className="font-bold text-foreground">Top Performers</h2>
              </div>
              <div className="space-y-3">
                {topPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        {index === 0 ? (
                          <Medal className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <span className="text-xs font-bold text-primary">#{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{performer.name}</p>
                        <p className="text-xs text-muted-foreground">{performer.year} • {performer.skill}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">{performer.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Ready List */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-green-400" />
                  <h2 className="font-bold text-foreground">Placement Ready</h2>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">47 students</span>
              </div>
              <div className="space-y-3">
                {placementReady.map((student) => (
                  <div key={student.name} className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">{student.name}</p>
                      <span className="text-sm text-green-400">{student.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {student.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-secondary text-xs text-muted-foreground">
                          {skill}
                        </span>
                      ))}
                      <span className="text-xs text-muted-foreground ml-auto">{student.year} Year</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All 47 Students
              </Button>
            </div>

            {/* Export Section */}
            <div 
              className="rounded-2xl p-6 relative overflow-hidden animate-slide-up"
              style={{ 
                background: 'var(--gradient-primary)',
                animationDelay: "0.35s"
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <h3 className="font-bold text-background text-lg mb-2">Export Shortlist</h3>
                <p className="text-background/80 text-sm mb-4">
                  Download placement-ready candidates with detailed performance reports.
                </p>
                <Button variant="secondary" size="sm" className="bg-background/90 hover:bg-background text-foreground">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollegeDashboard;
