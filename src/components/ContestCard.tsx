import { Calendar, Clock, Users, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface ContestCardProps {
  title: string;
  date: string;
  time: string;
  participants: number;
  isUpcoming: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const ContestCard = ({ title, date, time, participants, isUpcoming, difficulty }: ContestCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-400 bg-green-400/10";
      case "Medium": return "text-accent bg-accent/10";
      case "Hard": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="glass rounded-xl p-5 hover:border-primary/50 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h4>
          <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
        {isUpcoming && (
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium animate-pulse-glow">
            Upcoming
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{participants}</span>
        </div>
      </div>

      <Button 
        variant={isUpcoming ? "glow" : "outline"} 
        size="sm" 
        className="w-full group/btn"
      >
        {isUpcoming ? "Register Now" : "View Results"}
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};
