export type Attempt = {
  id: number;
  type: "cp" | "dsa" | "aptitude" | "dev";
  timeSpent: number; // minutes
  solved: boolean;
  attempts: number;
};

export type Score = {
  section: string;
  score: number;
};

// Automated maintenance update - 2026-08-28 22:40:50
