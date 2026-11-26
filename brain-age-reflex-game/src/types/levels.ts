import type {
  MathBlitzMetrics,
  MemoryMetrics,
  NumberHuntMetrics,
  ReactionMetrics,
  StroopMetrics,
} from './game';

export type MiniGameId =
  | 'reaction'
  | 'memory'
  | 'number-hunt'
  | 'stroop'
  | 'math-blitz';

export type StarRating = 0 | 1 | 2 | 3;

export interface LevelParams {
  rounds?: number;
  previewMs?: number;
  conflictRatio?: number;
  gridSize?: number;
}

interface BaseLevelConfig<TGameId extends MiniGameId, TMetrics> {
  id: string;
  gameId: TGameId;
  levelNumber: number;
  params: LevelParams;
  evaluateStars: (metrics: TMetrics) => StarRating;
}

export type GameLevelConfig =
  | BaseLevelConfig<'reaction', ReactionMetrics>
  | BaseLevelConfig<'memory', MemoryMetrics>
  | BaseLevelConfig<'number-hunt', NumberHuntMetrics>
  | BaseLevelConfig<'stroop', StroopMetrics>
  | BaseLevelConfig<'math-blitz', MathBlitzMetrics>;

export type AnyMiniGameMetrics =
  | ReactionMetrics
  | MemoryMetrics
  | NumberHuntMetrics
  | StroopMetrics
  | MathBlitzMetrics;

export interface SingleLevelProgress {
  stars: StarRating;
  completed: boolean;
  bestAttemptAt?: number;
}

export type LevelsProgressMap = Record<string, SingleLevelProgress>;