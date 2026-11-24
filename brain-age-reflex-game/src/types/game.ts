export type GameStage =
  | 'welcome'
  | 'reaction'
  | 'memory'
  | 'number-hunt'
  | 'stroop'
  | 'result';

export interface ReactionMetrics {
  medianMs: number;
  attemptsMs: number[];
}

export interface MemoryMetrics {
  accuracy: number;      // from 0 to 1 (examp. 0.85 = 85%)
  avgRoundSeconds: number;
}

export interface NumberHuntMetrics {
  totalSeconds: number;  // total time for sorting grid
}

export interface StroopMetrics {
  accuracy: number;      // from 0 to 1
  avgAnswerMs: number;   // avarage time for answer in ms
}

export interface SessionMetrics {
  reaction: ReactionMetrics;
  memory: MemoryMetrics;
  numberHunt: NumberHuntMetrics;
  stroop: StroopMetrics;
}

export interface NormalizedScores {
  reactionScore: number;   // 0 - 100
  memoryScore: number;     // 0 - 100
  numberHuntScore: number; // 0 - 100
  stroopScore: number;     // 0 - 100
  overallScore: number;    // 0 - 100
  brainAge: number;        // 18 - 65 years
  title: string;           // small label for map
}