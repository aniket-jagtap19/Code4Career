import { Code2, Bell, Settings, User } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">CodeArena</h1>
            <p className="text-xs text-muted-foreground">Intra College Contest Platform</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {["Dashboard", "Contests", "Practice", "Leaderboard"].map((item) => (
            <Button 
              key={item} 
              variant="ghost" 
              size="sm"
              className={item === "Dashboard" ? "text-primary" : ""}
            >
              {item}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ml-2">
            <User className="w-4 h-4 text-background" />
          </div>
        </div>
      </div>
    </header>
  );
};
