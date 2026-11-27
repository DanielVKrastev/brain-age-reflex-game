import { useEffect, useState } from 'react';
import { getLevelsForGame, MINI_GAME_ORDER } from '../data/levelsConfig';
import {
  formatText,
  getTranslations,
  type AppLocale,
} from '../i18n/translations';
import type {
  GameLevelConfig,
  LevelsProgressMap,
  MiniGameId,
  StarRating,
} from '../types/levels';
import { getGameStarsSummary, isLevelUnlocked } from '../utils/levelsStorage';

interface LevelsScreenProps {
  locale: AppLocale;
  progress: LevelsProgressMap;
  initialGameId?: MiniGameId | null;
  onSelectGame?: (gameId: MiniGameId | null) => void;
  onSelectLevel: (level: GameLevelConfig) => void;
  onBackHome: () => void;
}

function renderStars(stars: StarRating): string {
  const filled = '★'.repeat(stars);
  const empty = '☆'.repeat(3 - stars);
  return `${filled}${empty}`;
}

export function LevelsScreen({
  locale,
  progress,
  initialGameId = null,
  onSelectGame,
  onSelectLevel,
  onBackHome,
}: LevelsScreenProps) {
  const [selectedGame, setSelectedGame] = useState<MiniGameId | null>(
    initialGameId
  );
  const t = getTranslations(locale);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedGame(initialGameId ?? null);
  }, [initialGameId]);

  const handleSelectGame = (gameId: MiniGameId | null) => {
    setSelectedGame(gameId);
    onSelectGame?.(gameId);
  };

  const gameTitleById: Record<MiniGameId, string> = {
    reaction: t.reactionTitle,
    memory: t.memoryTitle,
    'number-hunt': t.numberHuntTitle,
    stroop: t.stroopTitle,
    'math-blitz': t.mathBlitzTitle,
  };

  if (!selectedGame) {
    return (
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
        }}
      >
        <div
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <h2 style={{ margin: 0, fontSize: '1.35rem' }}>{t.levelsHubTitle}</h2>
          <p
            style={{
              margin: 0,
              color: '#94a3b8',
              fontSize: '0.9rem',
              lineHeight: 1.45,
            }}
          >
            {t.levelsHubSubtitle}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flex: 1,
          }}
        >
          {MINI_GAME_ORDER.map((gameId) => {
            const summary = getGameStarsSummary(gameId, progress);
            return (
              <button
                key={gameId}
                type="button"
                className="card"
                onClick={() => handleSelectGame(gameId)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  padding: '14px 16px',
                  color: '#f8fafc',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {gameTitleById[gameId]}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {summary.completedLevels} / {summary.totalLevels}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 700,
                    color: '#fbbf24',
                    fontSize: '0.95rem',
                  }}
                >
                  <span>
                    {summary.earnedStars}/{summary.maxStars} ★
                  </span>
                  <span style={{ color: '#64748b' }}>›</span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onBackHome}
          style={{
            background: 'transparent',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            color: '#cbd5e1',
            borderRadius: '14px',
            padding: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t.homeButton}
        </button>
      </section>
    );
  }

  const levels = getLevelsForGame(selectedGame);

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <button
          type="button"
          onClick={() => handleSelectGame(null)}
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            color: '#cbd5e1',
            borderRadius: '10px',
            padding: '6px 10px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t.levelsBackToGames}
        </button>

        <span
          style={{
            fontWeight: 800,
            fontSize: '1rem',
            color: '#38bdf8',
          }}
        >
          {gameTitleById[selectedGame]}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1,
        }}
      >
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level, progress);
          const earnedStars: StarRating = progress[level.id]?.stars ?? 0;

          return (
            <button
              key={level.id}
              type="button"
              className="card"
              disabled={!unlocked}
              onClick={() => {
                if (unlocked) onSelectLevel(level);
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                padding: '16px',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                opacity: unlocked ? 1 : 0.55,
                border: unlocked
                  ? '1px solid rgba(56, 189, 248, 0.35)'
                  : '1px solid rgba(148, 163, 184, 0.15)',
                color: '#f8fafc',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                  {formatText(t.levelLabel, { level: level.levelNumber })}
                </span>
                {!unlocked && (
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {t.levelsLockedHint}
                  </span>
                )}
              </div>

              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: unlocked ? '#fbbf24' : '#64748b',
                }}
              >
                {unlocked ? renderStars(earnedStars) : '🔒'}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}