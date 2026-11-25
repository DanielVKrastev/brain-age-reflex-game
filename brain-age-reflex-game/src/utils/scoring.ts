import type {
  MathBlitzMetrics,
  MemoryMetrics,
  NormalizedScores,
  NumberHuntMetrics,
  ReactionMetrics,
  SessionMetrics,
  StroopMetrics,
} from '../types/game';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function scoreReaction(metrics: ReactionMetrics): number {
  const speedScore = ((420 - metrics.medianMs) / (420 - 170)) * 100;
  const penalty = metrics.falseStarts * 8;
  return Math.round(clamp(speedScore - penalty, 0, 100));
}

export function scoreMemory(metrics: MemoryMetrics): number {
  const accuracyComponent = metrics.accuracy * 80;
  const speedBonus = clamp(((6.0 - metrics.avgRoundSeconds) / (6.0 - 1.5)) * 20, 0, 20);
  return Math.round(clamp(accuracyComponent + speedBonus, 0, 100));
}

export function scoreNumberHunt(metrics: NumberHuntMetrics): number {
  const raw = ((24.0 - metrics.totalSeconds) / (24.0 - 7.5)) * 100;
  return Math.round(clamp(raw, 0, 100));
}

export function scoreStroop(metrics: StroopMetrics): number {
  const accuracyComponent = metrics.accuracy * 75;
  const speedComponent = clamp(((1600 - metrics.avgAnswerMs) / (1600 - 450)) * 25, 0, 25);
  return Math.round(clamp(accuracyComponent + speedComponent, 0, 100));
}

export function scoreMathBlitz(metrics: MathBlitzMetrics): number {
  const accuracyComponent = metrics.accuracy * 75;
  const speedComponent = clamp(((2200 - metrics.avgAnswerMs) / (2200 - 550)) * 25, 0, 25);
  return Math.round(clamp(accuracyComponent + speedComponent, 0, 100));
}

export function getBrainAgeTitle(brainAge: number): string {
  if (brainAge <= 22) return 'Светкавичен ум';
  if (brainAge <= 30) return 'Остър фокус';
  if (brainAge <= 40) return 'Уравновесен ритъм';
  if (brainAge <= 52) return 'Спокоен темп';
  return 'Нуждае се от разгрявка';
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return Math.round(sorted[mid]);
}

export function calculateSessionResult(session: SessionMetrics): NormalizedScores {
  const reactionScore = scoreReaction(session.reaction);
  const memoryScore = scoreMemory(session.memory);
  const numberHuntScore = scoreNumberHunt(session.numberHunt);
  const stroopScore = scoreStroop(session.stroop);
  const mathBlitzScore = scoreMathBlitz(session.mathBlitz);

  const overallScore = Math.round(
    reactionScore * 0.22 +
      memoryScore * 0.22 +
      numberHuntScore * 0.18 +
      stroopScore * 0.19 +
      mathBlitzScore * 0.19
  );

  // Map 0..100 score to an estimated cognitive age between 65 (low) and 18 (high)
  const rawAge = 65 - (overallScore / 100) * (65 - 18);
  const brainAge = Math.round(clamp(rawAge, 18, 65));

  return {
    reactionScore,
    memoryScore,
    numberHuntScore,
    stroopScore,
    mathBlitzScore,
    overallScore,
    brainAge,
    title: getBrainAgeTitle(brainAge),
  };
}