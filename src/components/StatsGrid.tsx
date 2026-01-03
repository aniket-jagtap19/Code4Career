import { Trophy, Target, Flame, Clock } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
}

const StatCard = ({ icon, label, value, subtext, trend }: StatCardProps) => (
  <div className="glass rounded-xl p-4 hover:border-primary/30 transition-all duration-300">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <span className="text-2xl font-bold text-foreground font-mono">{value}</span>
        {subtext && <span className="text-xs text-muted-foreground ml-2">{subtext}</span>}
      </div>
      {trend && (
        <span className="text-xs text-green-400 font-medium">{trend}</span>
      )}
    </div>
  </div>
);

export const StatsGrid = () => {
  const stats = [
    { icon: <Trophy className="w-4 h-4 text-accent" />, label: "Contests", value: 12, subtext: "participated", trend: "+3 this month" },
    { icon: <Target className="w-4 h-4 text-primary" />, label: "Problems", value: 156, subtext: "solved", trend: "+24 this week" },
    { icon: <Flame className="w-4 h-4 text-orange-400" />, label: "Streak", value: 7, subtext: "days", trend: "Best: 14 days" },
    { icon: <Clock className="w-4 h-4 text-blue-400" />, label: "Avg Time", value: "18m", subtext: "per problem" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={stat.label} className="animate-slide-up" style={{ animationDelay: `${0.1 * index}s` }}>
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
};
