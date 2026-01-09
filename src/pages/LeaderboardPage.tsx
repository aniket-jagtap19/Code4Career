import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Zap, ArrowLeft, Trophy, Medal, TrendingUp, Filter,
  Code, Brain, Calculator, Crown
} from "lucide-react";
import logo from "@/assests/logo.png" ;
const LeaderboardPage = () => {
  const [division, setDivision] = useState("all");
  const [skill, setSkill] = useState("overall");

  const leaderboard = [
    { rank: 1, name: "Arjun Sharma", division: "Div 1", rating: 2156, cp: 92, dsa: 88, dev: 75, aptitude: 85, change: +12 },
    { rank: 2, name: "Priya Patel", division: "Div 1", rating: 2089, cp: 85, dsa: 91, dev: 80, aptitude: 90, change: +8 },
    { rank: 3, name: "Rahul Kumar", division: "Div 2", rating: 1987, cp: 78, dsa: 85, dev: 82, aptitude: 88, change: +15 },
    { rank: 4, name: "Sneha Gupta", division: "Div 2", rating: 1834, cp: 72, dsa: 80, dev: 88, aptitude: 82, change: -3 },
    { rank: 5, name: "Vikram Singh", division: "Div 3", rating: 1756, cp: 70, dsa: 78, dev: 72, aptitude: 85, change: +5 },
    { rank: 6, name: "Anita Reddy", division: "Div 3", rating: 1698, cp: 68, dsa: 75, dev: 70, aptitude: 80, change: +10 },
    { rank: 7, name: "Karan Mehta", division: "Div 3", rating: 1645, cp: 65, dsa: 72, dev: 68, aptitude: 78, change: +2 },
    { rank: 8, name: "Divya Sharma", division: "Div 4", rating: 1589, cp: 60, dsa: 68, dev: 65, aptitude: 75, change: +18 },
    { rank: 9, name: "Amit Patel", division: "Div 4", rating: 1534, cp: 58, dsa: 65, dev: 62, aptitude: 72, change: -5 },
    { rank: 10, name: "Neha Singh", division: "Div 4", rating: 1478, cp: 55, dsa: 62, dev: 58, aptitude: 70, change: +7 },
  ];

  const filteredLeaderboard = leaderboard.filter(entry => {
    if (division !== "all" && entry.division !== division) return false;
    return true;
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-muted-foreground font-mono">#{rank}</span>;
    }
  };

  const getSkillValue = (entry: typeof leaderboard[0]) => {
    switch (skill) {
      case "cp": return entry.cp;
      case "dsa": return entry.dsa;
      case "dev": return entry.dev;
      case "aptitude": return entry.aptitude;
      default: return entry.rating;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: "3s" }} />
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
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-accent" />
              <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
            </div>
            <p className="text-muted-foreground">College-wide rankings • Updated after each contest</p>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger className="w-32 bg-secondary">
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                <SelectItem value="Div 1">Div 1</SelectItem>
                <SelectItem value="Div 2">Div 2</SelectItem>
                <SelectItem value="Div 3">Div 3</SelectItem>
                <SelectItem value="Div 4">Div 4</SelectItem>
              </SelectContent>
            </Select>
            <Select value={skill} onValueChange={setSkill}>
              <SelectTrigger className="w-32 bg-secondary">
                <SelectValue placeholder="Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall</SelectItem>
                <SelectItem value="cp">CP</SelectItem>
                <SelectItem value="dsa">DSA</SelectItem>
                <SelectItem value="dev">Developer</SelectItem>
                <SelectItem value="aptitude">Aptitude</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="glass rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-secondary/50 border-b border-border text-sm font-medium text-muted-foreground">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-3">Student</div>
            <div className="col-span-1 text-center">Division</div>
            <div className="col-span-1 text-center hidden md:block">
              <Code className="w-4 h-4 mx-auto text-primary" />
            </div>
            <div className="col-span-1 text-center hidden md:block">
              <TrendingUp className="w-4 h-4 mx-auto text-green-400" />
            </div>
            <div className="col-span-1 text-center hidden md:block">
              <Brain className="w-4 h-4 mx-auto text-accent" />
            </div>
            <div className="col-span-1 text-center hidden md:block">
              <Calculator className="w-4 h-4 mx-auto text-purple-400" />
            </div>
            <div className="col-span-2 text-center">Rating</div>
            <div className="col-span-1 text-center">Change</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {filteredLeaderboard.map((entry, index) => (
              <div 
                key={entry.rank}
                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/30 transition-colors ${
                  entry.rank <= 3 ? "bg-accent/5" : ""
                }`}
              >
                <div className="col-span-1 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {entry.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">{entry.name}</span>
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <span className="px-2 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
                    {entry.division}
                  </span>
                </div>
                <div className="col-span-1 text-center hidden md:block text-sm text-muted-foreground">{entry.cp}%</div>
                <div className="col-span-1 text-center hidden md:block text-sm text-muted-foreground">{entry.dsa}%</div>
                <div className="col-span-1 text-center hidden md:block text-sm text-muted-foreground">{entry.dev}%</div>
                <div className="col-span-1 text-center hidden md:block text-sm text-muted-foreground">{entry.aptitude}%</div>
                <div className="col-span-2 text-center">
                  <span className="text-lg font-bold text-foreground">{getSkillValue(entry)}</span>
                  {skill === "overall" && <span className="text-xs text-muted-foreground ml-1">pts</span>}
                  {skill !== "overall" && <span className="text-xs text-muted-foreground ml-1">%</span>}
                </div>
                <div className="col-span-1 text-center">
                  <span className={`text-sm font-medium ${entry.change >= 0 ? "text-green-400" : "text-destructive"}`}>
                    {entry.change >= 0 ? "+" : ""}{entry.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Rank Highlight */}
        <div className="glass rounded-2xl p-6 mt-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">#47</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Your Current Rank</p>
                <p className="text-sm text-muted-foreground">Division 3 • 2nd Year</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">1,756</p>
              <div className="flex items-center gap-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+45 this week</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
