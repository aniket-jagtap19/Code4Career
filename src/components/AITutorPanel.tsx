import { Brain, Target, TrendingUp, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface SkillAnalysis {
  name: string;
  level: number;
  status: "strong" | "improving" | "weak";
}

interface AITutorPanelProps {
  skills: SkillAnalysis[];
  recommendation: string;
}

export const AITutorPanel = ({ skills, recommendation }: AITutorPanelProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "strong": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "improving": return "text-accent bg-accent/10 border-accent/30";
      case "weak": return "text-destructive bg-destructive/10 border-destructive/30";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "strong": return "●";
      case "improving": return "◐";
      case "weak": return "○";
      default: return "○";
    }
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI Tutor Analysis</h3>
          <p className="text-xs text-muted-foreground">Personalized insights based on your performance</p>
        </div>
        <Sparkles className="w-5 h-5 text-accent ml-auto animate-pulse" />
      </div>

      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4" />
          Skill Assessment
        </h4>
        
        {skills.map((skill, index) => (
          <div key={skill.name} className="space-y-2" style={{ animationDelay: `${0.1 * index}s` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(skill.status)}`}>
                  {getStatusIcon(skill.status)} {skill.status}
                </span>
                <span className="text-sm font-medium text-foreground">{skill.name}</span>
              </div>
              <span className="text-sm font-mono text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  skill.status === "strong" ? "bg-green-400" :
                  skill.status === "improving" ? "bg-accent" : "bg-destructive"
                }`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-secondary/50 border border-border mb-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1">Recommended Focus</h5>
            <p className="text-sm text-muted-foreground leading-relaxed">{recommendation}</p>
          </div>
        </div>
      </div>

      <Button variant="glow" className="w-full group">
        <TrendingUp className="w-4 h-4" />
        Start Learning Path
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};
