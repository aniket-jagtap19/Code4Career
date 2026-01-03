import { Header } from "@/components/Header";
import { RatingCard } from "@/components/RatingCard";
import { ContestCard } from "@/components/ContestCard";
import { AITutorPanel } from "@/components/AITutorPanel";
import { Leaderboard } from "@/components/Leaderboard";
import { StatsGrid } from "@/components/StatsGrid";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const contests = [
    { title: "January Monthly Challenge", date: "Jan 28, 2025", time: "7:00 PM", participants: 234, isUpcoming: true, difficulty: "Medium" as const },
    { title: "Algorithm Sprint #15", date: "Jan 15, 2025", time: "6:00 PM", participants: 189, isUpcoming: false, difficulty: "Hard" as const },
    { title: "Beginner Friendly #8", date: "Jan 10, 2025", time: "5:00 PM", participants: 312, isUpcoming: false, difficulty: "Easy" as const },
  ];

  const skills = [
    { name: "Dynamic Programming", level: 45, status: "weak" as const },
    { name: "Graph Algorithms", level: 72, status: "improving" as const },
    { name: "Data Structures", level: 88, status: "strong" as const },
    { name: "String Manipulation", level: 65, status: "improving" as const },
  ];

  const leaderboard = [
    { rank: 1, name: "Arjun Sharma", rating: 2156, solved: 342, avatar: "AS" },
    { rank: 2, name: "Priya Patel", rating: 2089, solved: 298, avatar: "PP" },
    { rank: 3, name: "Rahul Kumar", rating: 1987, solved: 276, avatar: "RK" },
    { rank: 4, name: "Sneha Gupta", rating: 1834, solved: 234, avatar: "SG" },
    { rank: 5, name: "Vikram Singh", rating: 1756, solved: 212, avatar: "VS" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <Header />

      <main className="container mx-auto px-6 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm text-accent font-medium">Welcome back, Rahul!</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Ready to level up your <span className="gradient-text">coding skills</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Track your progress, compete in monthly contests, and get personalized guidance from your AI tutor.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <StatsGrid />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rating Card */}
            <RatingCard 
              rating={1756}
              rank={47}
              totalParticipants={523}
              trend={+45}
            />

            {/* Contests Section */}
            <div className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Contests</h3>
                <Button variant="ghost" size="sm" className="text-primary group">
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {contests.slice(0, 2).map((contest) => (
                  <ContestCard key={contest.title} {...contest} />
                ))}
              </div>
            </div>

            {/* AI Tutor Panel */}
            <AITutorPanel 
              skills={skills}
              recommendation="Focus on Dynamic Programming patterns this week. Start with the 'House Robber' series to build intuition for state transitions. Your graph skills are improving—practice 2-3 more BFS/DFS problems to solidify."
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Leaderboard entries={leaderboard} />

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.25s" }}>
              <h3 className="font-semibold text-foreground mb-4">Quick Practice</h3>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Easy Problems
                  <span className="text-xs text-muted-foreground ml-auto">42 new</span>
                </Button>
                <Button variant="secondary" className="w-full justify-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Medium Problems
                  <span className="text-xs text-muted-foreground ml-auto">28 new</span>
                </Button>
                <Button variant="secondary" className="w-full justify-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  Hard Problems
                  <span className="text-xs text-muted-foreground ml-auto">15 new</span>
                </Button>
              </div>
            </div>

            {/* Next Contest CTA */}
            <div 
              className="rounded-2xl p-6 relative overflow-hidden animate-slide-up"
              style={{ 
                background: 'var(--gradient-primary)',
                animationDelay: "0.3s"
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <h4 className="font-bold text-background text-lg mb-1">January Challenge</h4>
                <p className="text-background/80 text-sm mb-4">Starts in 5 days</p>
                <Button variant="secondary" size="sm" className="bg-background/90 hover:bg-background text-foreground">
                  Set Reminder
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
