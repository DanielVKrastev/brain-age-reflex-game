import type { AppLocale } from '../i18n/translations';
import type { NormalizedScores, SessionHistoryEntry } from '../types/game';

const STORAGE_KEY = 'brain_age_reflex_history_v1';
const MAX_ENTRIES = 20;

export function loadSessionHistory(): SessionHistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as SessionHistoryEntry[];
  } catch {
    return [];
  }
}

export function appendSessionHistory(
  scores: NormalizedScores
): SessionHistoryEntry[] {
  const existing = loadSessionHistory();
  const entry: SessionHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    playedAt: new Date().toISOString(),
    brainAge: scores.brainAge,
    overallScore: scores.overallScore,
    title: scores.title,
    scores: {
      reactionScore: scores.reactionScore,
      memoryScore: scores.memoryScore,
      numberHuntScore: scores.numberHuntScore,
      stroopScore: scores.stroopScore,
      mathBlitzScore: scores.mathBlitzScore,
    },
  };

  const updated = [entry, ...existing].slice(0, MAX_ENTRIES);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
  return updated;
}

export function clearSessionHistory(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function formatHistoryDate(
  isoDate: string,
  locale: AppLocale = 'bg'
): string {
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '';
  }
}