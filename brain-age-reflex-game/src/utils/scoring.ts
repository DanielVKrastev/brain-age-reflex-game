import type { NormalizedScores, SessionMetrics } from '../types/game';

// Calibration limits (easy to adjust after actual tests)
const SCORING_CONFIG = {
  reaction: {
    bestMs: 180,
    worstMs: 500,
    weight: 0.30,
  },
  memory: {
    targetRoundSec: 2.0,
    maxTimePenalty: 20,
    weight: 0.25,
  },
  numberHunt: {
    bestSec: 6.0,
    worstSec: 22.0,
    weight: 0.20,
  },
  stroop: {
    bestAnswerMs: 550,
    worstAnswerMs: 1800,
    weight: 0.25,
  },
  age: {
    minAge: 18,
    maxAge: 65,
    baseAge: 62,
    slope: 0.44,
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export function scoreReaction(medianMs: number): number {
  const { bestMs, worstMs } = SCORING_CONFIG.reaction;
  const raw = (100 * (worstMs - medianMs)) / (worstMs - bestMs);
  return Math.round(clamp(raw, 0, 100));
}

export function scoreMemory(accuracy: number, avgRoundSeconds: number): number {
  const { targetRoundSec, maxTimePenalty } = SCORING_CONFIG.memory;
  const extraSec = Math.max(0, avgRoundSeconds - targetRoundSec);
  const timePenalty = Math.min(maxTimePenalty, extraSec * 4);
  const raw = 100 * clamp(accuracy, 0, 1) - timePenalty;
  return Math.round(clamp(raw, 0, 100));
}

export function scoreNumberHunt(totalSeconds: number): number {
  const { bestSec, worstSec } = SCORING_CONFIG.numberHunt;
  const raw = (100 * (worstSec - totalSeconds)) / (worstSec - bestSec);
  return Math.round(clamp(raw, 0, 100));
}

export function scoreStroop(accuracy: number, avgAnswerMs: number): number {
  const { bestAnswerMs, worstAnswerMs } = SCORING_CONFIG.stroop;
  const speedRatio = clamp(
    (worstAnswerMs - avgAnswerMs) / (worstAnswerMs - bestAnswerMs),
    0,
    1
  );
  const raw = 100 * (0.75 * clamp(accuracy, 0, 1) + 0.25 * speedRatio);
  return Math.round(clamp(raw, 0, 100));
}

function getRankTitle(brainAge: number): string {
  if (brainAge <= 21) return 'Светкавичен ум';
  if (brainAge <= 27) return 'Остър фокус';
  if (brainAge <= 35) return 'Стабилен ритъм';
  if (brainAge <= 45) return 'Спокоен стратег';
  return 'Нужда от кафе';
}

export function calculateSessionResult(metrics: SessionMetrics): NormalizedScores {
  const reactionScore = scoreReaction(metrics.reaction.medianMs);
  const memoryScore = scoreMemory(
    metrics.memory.accuracy,
    metrics.memory.avgRoundSeconds
  );
  const numberHuntScore = scoreNumberHunt(metrics.numberHunt.totalSeconds);
  const stroopScore = scoreStroop(
    metrics.stroop.accuracy,
    metrics.stroop.avgAnswerMs
  );

  const overallScore = Math.round(
    reactionScore * SCORING_CONFIG.reaction.weight +
      memoryScore * SCORING_CONFIG.memory.weight +
      numberHuntScore * SCORING_CONFIG.numberHunt.weight +
      stroopScore * SCORING_CONFIG.stroop.weight
  );

  const { minAge, maxAge, baseAge, slope } = SCORING_CONFIG.age;
  const brainAge = Math.round(
    clamp(baseAge - slope * overallScore, minAge, maxAge)
  );

  return {
    reactionScore,
    memoryScore,
    numberHuntScore,
    stroopScore,
    overallScore,
    brainAge,
    title: getRankTitle(brainAge),
  };
}