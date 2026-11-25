export type GameStage =
  | 'welcome'
  | 'reaction'
  | 'memory'
  | 'number-hunt'
  | 'stroop'
  | 'math-blitz'
  | 'result';

export interface ReactionMetrics {
  medianMs: number;
  falseStarts: number;
}

export interface MemoryMetrics {
  accuracy: number; // 0..1
  avgRoundSeconds: number;
}

export interface NumberHuntMetrics {
  totalSeconds: number;
}

export interface StroopMetrics {
  accuracy: number; // 0..1
  avgAnswerMs: number;
}

export interface MathBlitzMetrics {
  accuracy: number; // 0..1
  avgAnswerMs: number;
}

export interface SessionMetrics {
  reaction: ReactionMetrics;
  memory: MemoryMetrics;
  numberHunt: NumberHuntMetrics;
  stroop: StroopMetrics;
  mathBlitz: MathBlitzMetrics;
}

export interface NormalizedScores {
  reactionScore: number; // 0..100
  memoryScore: number; // 0..100
  numberHuntScore: number; // 0..100
  stroopScore: number; // 0..100
  mathBlitzScore: number; // 0..100
  overallScore: number; // 0..100
  brainAge: number; // 18..65
  title: string;
}

export interface SessionHistoryEntry {
  id: string;
  playedAt: string; // ISO date string
  brainAge: number;
  overallScore: number;
  title: string;
  scores: {
    reactionScore: number;
    memoryScore: number;
    numberHuntScore: number;
    stroopScore: number;
    mathBlitzScore: number;
  };
}