import { Attempt, Score } from "./types";


export interface QuestionAttempt {
  id: number;
  type: "cp" | "dsa" | "aptitude" | "dev";
  timeSpent: number; // in minutes
  solved: boolean;
  attempts: number;
}

export interface SectionScore {
  section: "CP" | "DSA" | "Aptitude" | "Dev";
  score: number; // percentage
}

export const analyzeContest = (
  attempts: Attempt[],
  scores: Score[]
) => {
  const strengths = [];
  const weaknesses = [];
  const mistakePatterns = [];

  scores.forEach((s) => {
    if (s.score >= 80) {
      strengths.push({
        skill: s.section,
        score: `${s.score}%`,
        detail: "Strong performance in this area",
      });
    } else if (s.score <= 60) {
      weaknesses.push({
        skill: s.section,
        score: `${s.score}%`,
        detail: "Needs more focused practice",
      });
    }
  });

  attempts.forEach((a) => {
    if (!a.solved && a.timeSpent > 15) {
      mistakePatterns.push({
        pattern: `Spent ${a.timeSpent} mins on ${a.type.toUpperCase()} question`,
        impact: "High",
        suggestion: "Move on earlier and return later",
      });
    }
  });

  return { strengths, weaknesses, mistakePatterns };
};
