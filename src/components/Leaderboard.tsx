import { Crown, Medal, Trophy } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  rating: number;
  solved: number;
  avatar: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export const Leaderboard = ({ entries }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-muted-foreground font-mono text-sm w-5 text-center">#{rank}</span>;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 2000) return "text-accent";
    if (rating >= 1600) return "text-primary";
    if (rating >= 1200) return "text-blue-400";
    return "text-muted-foreground";
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Top Performers</h3>
        </div>
        <span className="text-xs text-muted-foreground">This Month</span>
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div 
            key={entry.rank}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-secondary/50 ${
              entry.rank <= 3 ? 'bg-secondary/30' : ''
            }`}
            style={{ animationDelay: `${0.05 * index}s` }}
          >
            <div className="w-8 flex justify-center">
              {getRankIcon(entry.rank)}
            </div>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-semibold">
              {entry.avatar}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{entry.name}</p>
              <p className="text-xs text-muted-foreground">{entry.solved} problems solved</p>
            </div>
            
            <span className={`font-mono font-semibold ${getRatingColor(entry.rating)}`}>
              {entry.rating}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
