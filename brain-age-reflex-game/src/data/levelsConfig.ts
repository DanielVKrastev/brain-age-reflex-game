import type {
  AnyMiniGameMetrics,
  GameLevelConfig,
  MiniGameId,
  StarRating,
} from '../types/levels';

export const MINI_GAME_ORDER: MiniGameId[] = [
  'reaction',
  'memory',
  'number-hunt',
  'stroop',
  'math-blitz',
];

export const GAME_LEVELS: GameLevelConfig[] = [
  // --- 1. REACTION SPEED (medianMs + falseStarts) ---
  {
    id: 'reaction-1',
    gameId: 'reaction',
    levelNumber: 1,
    params: { rounds: 4 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.medianMs <= 260 && metrics.falseStarts === 0) return 3;
      if (metrics.medianMs <= 340 && metrics.falseStarts <= 1) return 2;
      if (metrics.medianMs <= 460) return 1;
      return 0;
    },
  },
  {
    id: 'reaction-2',
    gameId: 'reaction',
    levelNumber: 2,
    params: { rounds: 5 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.medianMs <= 235 && metrics.falseStarts === 0) return 3;
      if (metrics.medianMs <= 305 && metrics.falseStarts <= 1) return 2;
      if (metrics.medianMs <= 410) return 1;
      return 0;
    },
  },
  {
    id: 'reaction-3',
    gameId: 'reaction',
    levelNumber: 3,
    params: { rounds: 6 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.medianMs <= 210 && metrics.falseStarts === 0) return 3;
      if (metrics.medianMs <= 275 && metrics.falseStarts === 0) return 2;
      if (metrics.medianMs <= 360) return 1;
      return 0;
    },
  },

  // --- 2. VISUAL MEMORY (accuracy) ---
  {
    id: 'memory-1',
    gameId: 'memory',
    levelNumber: 1,
    params: { rounds: 3, previewMs: 1650 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.accuracy >= 0.95) return 3;
      if (metrics.accuracy >= 0.75) return 2;
      if (metrics.accuracy >= 0.5) return 1;
      return 0;
    },
  },
  {
    id: 'memory-2',
    gameId: 'memory',
    levelNumber: 2,
    params: { rounds: 4, previewMs: 1400 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.accuracy >= 0.9) return 3;
      if (metrics.accuracy >= 0.75) return 2;
      if (metrics.accuracy >= 0.55) return 1;
      return 0;
    },
  },
  {
    id: 'memory-3',
    gameId: 'memory',
    levelNumber: 3,
    params: { rounds: 5, previewMs: 1150 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.accuracy >= 0.9) return 3;
      if (metrics.accuracy >= 0.7) return 2;
      if (metrics.accuracy >= 0.5) return 1;
      return 0;
    },
  },

  // --- 3. NUMBER SEARCH (totalSeconds) ---
  {
    id: 'number-hunt-1',
    gameId: 'number-hunt',
    levelNumber: 1,
    params: { maxNumber: 16 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.totalSeconds <= 14) return 3;
      if (metrics.totalSeconds <= 20) return 2;
      if (metrics.totalSeconds <= 28) return 1;
      return 0;
    },
  },
  {
    id: 'number-hunt-2',
    gameId: 'number-hunt',
    levelNumber: 2,
    params: { maxNumber: 16 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.totalSeconds <= 11.5) return 3;
      if (metrics.totalSeconds <= 16.5) return 2;
      if (metrics.totalSeconds <= 23) return 1;
      return 0;
    },
  },
  {
    id: 'number-hunt-3',
    gameId: 'number-hunt',
    levelNumber: 3,
    params: { maxNumber: 16 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.totalSeconds <= 9.5) return 3;
      if (metrics.totalSeconds <= 13.5) return 2;
      if (metrics.totalSeconds <= 19) return 1;
      return 0;
    },
  },

  // --- 4. STRUP EFFECT (accuracy + avgAnswerMs) ---
  {
    id: 'stroop-1',
    gameId: 'stroop',
    levelNumber: 1,
    params: { rounds: 8, conflictRatio: 0.7 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.accuracy >= 0.95 && metrics.avgAnswerMs <= 950) return 3;
      if (metrics.accuracy >= 0.8 && metrics.avgAnswerMs <= 1300) return 2;
      if (metrics.accuracy >= 0.65) return 1;
      return 0;
    },
  },
  {
    id: 'stroop-2',
    gameId: 'stroop',
    levelNumber: 2,
    params: { rounds: 10, conflictRatio: 0.8 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.accuracy >= 0.9 && metrics.avgAnswerMs <= 850) return 3;
      if (metrics.accuracy >= 0.78 && metrics.avgAnswerMs <= 1150) return 2;
      if (metrics.accuracy >= 0.65) return 1;
      return 0;
    },
  },
  {
    id: 'stroop-3',
    gameId: 'stroop',
    levelNumber: 3,
    params: { rounds: 12, conflictRatio: 0.9 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.accuracy >= 0.9 && metrics.avgAnswerMs <= 750) return 3;
      if (metrics.accuracy >= 0.75 && metrics.avgAnswerMs <= 1050) return 2;
      if (metrics.accuracy >= 0.6) return 1;
      return 0;
    },
  },

  // --- 5. FAST MATH (accuracy + avgAnswerMs) ---
  {
    id: 'math-blitz-1',
    gameId: 'math-blitz',
    levelNumber: 1,
    params: { rounds: 6 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.accuracy >= 0.95 && metrics.avgAnswerMs <= 1900) return 3;
      if (metrics.accuracy >= 0.8 && metrics.avgAnswerMs <= 2600) return 2;
      if (metrics.accuracy >= 0.65) return 1;
      return 0;
    },
  },
  {
    id: 'math-blitz-2',
    gameId: 'math-blitz',
    levelNumber: 2,
    params: { rounds: 8 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.accuracy >= 0.9 && metrics.avgAnswerMs <= 1650) return 3;
      if (metrics.accuracy >= 0.78 && metrics.avgAnswerMs <= 2300) return 2;
      if (metrics.accuracy >= 0.65) return 1;
      return 0;
    },
  },
  {
    id: 'math-blitz-3',
    gameId: 'math-blitz',
    levelNumber: 3,
    params: { rounds: 10 },
    evaluateStars: (metrics): StarRating => {
      if (metrics.accuracy >= 0.9 && metrics.avgAnswerMs <= 1450) return 3;
      if (metrics.accuracy >= 0.75 && metrics.avgAnswerMs <= 2000) return 2;
      if (metrics.accuracy >= 0.6) return 1;
      return 0;
    },
  },
];

export function getLevelsForGame(gameId: MiniGameId): GameLevelConfig[] {
  return GAME_LEVELS.filter((level) => level.gameId === gameId).sort(
    (a, b) => a.levelNumber - b.levelNumber
  );
}

export function getLevelById(levelId: string): GameLevelConfig | undefined {
  return GAME_LEVELS.find((level) => level.id === levelId);
}

export function evaluateStarsForLevel(
  level: GameLevelConfig,
  metrics: AnyMiniGameMetrics
): StarRating {
  return (level.evaluateStars as (m: AnyMiniGameMetrics) => StarRating)(metrics);
}