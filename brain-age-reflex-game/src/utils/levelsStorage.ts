import { getLevelsForGame } from '../data/levelsConfig.ts';

import type {
  GameLevelConfig,
  LevelsProgressMap,
  MiniGameId,
  StarRating,
} from '../types/levels';

const STORAGE_KEY = 'brain_age_reflex_game_levels_v1';

export function loadLevelsProgress(): LevelsProgressMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as LevelsProgressMap;
  } catch {
    return {};
  }
}

export function saveLevelsProgress(progress: LevelsProgressMap): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Игнорирай грешки при недостъпен storage
  }
}

export function clearLevelsProgress(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Игнорирай грешки при недостъпен storage
  }
}

// Ниво 1 на всяка игра е винаги отключено; всяко следващо се отключва при поне 1 звезда на предходното
export function isLevelUnlocked(
  level: GameLevelConfig,
  progress: LevelsProgressMap
): boolean {
  if (level.levelNumber <= 1) return true;

  const gameLevels = getLevelsForGame(level.gameId);
  const previousLevel = gameLevels.find(
    (item) => item.levelNumber === level.levelNumber - 1
  );
  if (!previousLevel) return true;

  const prevProgress = progress[previousLevel.id];
  return Boolean(prevProgress && prevProgress.stars >= 1);
}

export function recordLevelResult(
  currentProgress: LevelsProgressMap,
  levelId: string,
  earnedStars: StarRating
): { updatedProgress: LevelsProgressMap; bestStars: StarRating } {
  const existing = currentProgress[levelId];
  const bestStars: StarRating = existing
    ? (Math.max(existing.stars, earnedStars) as StarRating)
    : earnedStars;

  const updatedProgress: LevelsProgressMap = {
    ...currentProgress,
    [levelId]: {
      stars: bestStars,
      completed: bestStars >= 1 || Boolean(existing?.completed),
      bestAttemptAt: Date.now(),
    },
  };

  saveLevelsProgress(updatedProgress);
  return { updatedProgress, bestStars };
}

export function getGameStarsSummary(
  gameId: MiniGameId,
  progress: LevelsProgressMap
): { earnedStars: number; maxStars: number; completedLevels: number; totalLevels: number } {
  const levels = getLevelsForGame(gameId);
  const maxStars = levels.length * 3;
  let earnedStars = 0;
  let completedLevels = 0;

  for (const lvl of levels) {
    const entry = progress[lvl.id];
    if (entry) {
      earnedStars += entry.stars;
      if (entry.stars >= 1 || entry.completed) {
        completedLevels += 1;
      }
    }
  }

  return {
    earnedStars,
    maxStars,
    completedLevels,
    totalLevels: levels.length,
  };
}