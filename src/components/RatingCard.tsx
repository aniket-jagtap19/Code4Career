import { TrendingUp, Award } from "lucide-react";

interface RatingCardProps {
  rating: number;
  rank: number;
  totalParticipants: number;
  trend: number;
}

export const RatingCard = ({ rating, rank, totalParticipants, trend }: RatingCardProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 2000) return "text-accent";
    if (rating >= 1600) return "text-primary";
    if (rating >= 1200) return "text-blue-400";
    return "text-muted-foreground";
  };

  const getRatingTitle = (rating: number) => {
    if (rating >= 2000) return "Expert";
    if (rating >= 1600) return "Specialist";
    if (rating >= 1200) return "Apprentice";
    return "Newbie";
  };

  return (
    <div className="glass rounded-2xl p-6 glow-primary animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Your Rating</h3>
        <Award className="w-5 h-5 text-accent" />
      </div>
      
      <div className="flex items-end gap-3 mb-4">
        <span className={`text-5xl font-bold font-mono ${getRatingColor(rating)}`}>
          {rating}
        </span>
        <div className={`flex items-center gap-1 mb-2 ${trend >= 0 ? 'text-green-400' : 'text-destructive'}`}>
          <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
          <span className="text-sm font-medium">{trend >= 0 ? '+' : ''}{trend}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${getRatingColor(rating)}`}>
          {getRatingTitle(rating)}
        </span>
        <span className="text-muted-foreground text-sm">
          Rank #{rank} of {totalParticipants}
        </span>
      </div>

      <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000"
          style={{ 
            width: `${Math.min((rating / 2400) * 100, 100)}%`,
            background: 'var(--gradient-primary)'
          }}
        />
      </div>
    </div>
  );
};
