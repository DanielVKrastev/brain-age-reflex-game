import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { MathBlitzGame } from './components/games/MathBlitzGame';
import { MemoryGame } from './components/games/MemoryGame';
import { NumberHuntGame } from './components/games/NumberHuntGame';
import { ReactionGame } from './components/games/ReactionGame';
import { StroopGame } from './components/games/StroopGame';
import { HelpModal, type HelpContextKey } from './components/HelpModal';
import { LevelsScreen } from './components/LevelsScreen';
import { ResultCard } from './components/ResultCard';
import {
  evaluateStarsForLevel,
  getLevelsForGame,
} from './data/levelsConfig';
import {
  formatText,
  getTranslations,
  SUPPORTED_LOCALES,
  type AppLocale,
} from './i18n/translations';
import type {
  GameStage,
  MathBlitzMetrics,
  MemoryMetrics,
  NumberHuntMetrics,
  ReactionMetrics,
  SessionHistoryEntry,
  SessionMetrics,
  StroopMetrics,
} from './types/game';
import type {
  AnyMiniGameMetrics,
  GameLevelConfig,
  LevelsProgressMap,
  MiniGameId,
  StarRating,
} from './types/levels';
import {
  appendSessionHistory,
  clearSessionHistory,
  formatHistoryDate,
  loadSessionHistory,
} from './utils/historyStorage';
import {
  loadLevelsProgress,
  recordLevelResult,
} from './utils/levelsStorage';
import { loadSavedLocale, saveLocale } from './utils/localeStorage';
import { calculateSessionResult } from './utils/scoring';

interface PartialSessionMetrics {
  reaction?: ReactionMetrics;
  memory?: MemoryMetrics;
  numberHunt?: NumberHuntMetrics;
  stroop?: StroopMetrics;
  mathBlitz?: MathBlitzMetrics;
}

type AppView =
  | GameStage
  | 'levels-hub'
  | 'level-play'
  | 'level-result';

interface CompletedLevelSummary {
  level: GameLevelConfig;
  earnedStars: StarRating;
  bestStars: StarRating;
}

const GAME_STAGES: GameStage[] = [
  'reaction',
  'memory',
  'number-hunt',
  'stroop',
  'math-blitz',
];

function mapViewToHelpContext(
  view: AppView,
  activeLevel: GameLevelConfig | null
): HelpContextKey {
  if (view === 'level-play' && activeLevel) {
    return activeLevel.gameId;
  }

  switch (view) {
    case 'reaction':
      return 'reaction';
    case 'memory':
      return 'memory';
    case 'number-hunt':
      return 'number-hunt';
    case 'stroop':
      return 'stroop';
    case 'math-blitz':
      return 'math-blitz';
    default:
      return 'home';
  }
}

export function App() {
  const [view, setView] = useState<AppView>('welcome');
  const [sessionId, setSessionId] = useState<number>(0);
  const [metrics, setMetrics] = useState<PartialSessionMetrics>({});
  const [history, setHistory] = useState<SessionHistoryEntry[]>(() =>
    loadSessionHistory()
  );
  const [locale, setLocale] = useState<AppLocale>(() => loadSavedLocale());
  const [helpOpen, setHelpOpen] = useState<boolean>(false);

  // Състояние за режима с нива по игри
  const [levelsProgress, setLevelsProgress] = useState<LevelsProgressMap>(() =>
    loadLevelsProgress()
  );
  const [selectedLevelsGame, setSelectedLevelsGame] =
    useState<MiniGameId | null>(null);
  const [activeLevel, setActiveLevel] = useState<GameLevelConfig | null>(null);
  const [levelAttemptId, setLevelAttemptId] = useState<number>(0);
  const [levelSummary, setLevelSummary] =
    useState<CompletedLevelSummary | null>(null);

  const t = useMemo(() => getTranslations(locale), [locale]);
  const helpContext = useMemo(
    () => mapViewToHelpContext(view, activeLevel),
    [view, activeLevel]
  );

  // Handle step-by-step back navigation across game views
  const handleBackNavigation = useCallback(
    (canGoBack = true) => {
      if (helpOpen) {
        setHelpOpen(false);
        return;
      }

      if (view === 'welcome') {
        if (!canGoBack && Capacitor.isNativePlatform()) {
          void CapacitorApp.exitApp();
        }
        return;
      }

      if (view === 'level-play' || view === 'level-result') {
        setView('levels-hub');
        return;
      }

      if (GAME_STAGES.includes(view as GameStage)) {
        setView('levels-hub');
        return;
      }

      if (view === 'levels-hub' && selectedLevelsGame) {
        setSelectedLevelsGame(null);
        return;
      }

      setMetrics({});
      setView('welcome');
    },
    [view, helpOpen, selectedLevelsGame]
  );

  const backHandlerRef = useRef<(canGoBack?: boolean) => void>(() => { });
  // eslint-disable-next-line react-hooks/refs
  backHandlerRef.current = handleBackNavigation;

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cancelled = false;
    let listenerHandle: { remove: () => Promise<void> } | undefined;

    // Register hardware back listener once and invoke the latest handler
    const registerBackListener = async () => {
      const handle = await CapacitorApp.addListener(
        'backButton',
        ({ canGoBack }) => {
          backHandlerRef.current(canGoBack);
        }
      );

      if (cancelled) {
        await handle.remove();
        return;
      }

      listenerHandle = handle;
    };

    void registerBackListener();

    return () => {
      cancelled = true;
      if (listenerHandle) {
        void listenerHandle.remove();
      }
    };
  }, []);

  const handleLocaleChange = (nextLocale: AppLocale) => {
    setLocale(nextLocale);
    saveLocale(nextLocale);
  };

  // --- Stream: Brain Age Test ---
  const startNewSession = () => {
    setHelpOpen(false);
    setActiveLevel(null);
    setMetrics({});
    setSessionId((prev) => prev + 1);
    setView('reaction');
  };

  const handleReactionComplete = (reaction: ReactionMetrics) => {
    setMetrics((prev) => ({ ...prev, reaction }));
    setView('memory');
  };

  const handleMemoryComplete = (memory: MemoryMetrics) => {
    setMetrics((prev) => ({ ...prev, memory }));
    setView('number-hunt');
  };

  const handleNumberHuntComplete = (numberHunt: NumberHuntMetrics) => {
    setMetrics((prev) => ({ ...prev, numberHunt }));
    setView('stroop');
  };

  const handleStroopComplete = (stroop: StroopMetrics) => {
    setMetrics((prev) => ({ ...prev, stroop }));
    setView('math-blitz');
  };

  const handleMathBlitzComplete = (mathBlitz: MathBlitzMetrics) => {
    const nextMetrics: PartialSessionMetrics = { ...metrics, mathBlitz };
    setMetrics(nextMetrics);

    if (
      nextMetrics.reaction &&
      nextMetrics.memory &&
      nextMetrics.numberHunt &&
      nextMetrics.stroop
    ) {
      const fullSession: SessionMetrics = {
        reaction: nextMetrics.reaction,
        memory: nextMetrics.memory,
        numberHunt: nextMetrics.numberHunt,
        stroop: nextMetrics.stroop,
        mathBlitz,
      };
      const calculated = calculateSessionResult(fullSession);
      const updatedHistory = appendSessionHistory(calculated);
      setHistory(updatedHistory);
    }

    setView('result');
  };

  // --- Stream: Levels in games ---
  const openLevelsHub = (gameId: MiniGameId | null = null) => {
    setHelpOpen(false);
    setSelectedLevelsGame(gameId);
    setView('levels-hub');
  };

  const startLevel = (level: GameLevelConfig) => {
    setHelpOpen(false);
    setSelectedLevelsGame(level.gameId);
    setActiveLevel(level);
    setLevelSummary(null);
    setLevelAttemptId((prev) => prev + 1);
    setView('level-play');
  };

  const handleLevelComplete = (gameMetrics: AnyMiniGameMetrics) => {
    if (!activeLevel) return;

    const earnedStars = evaluateStarsForLevel(activeLevel, gameMetrics);
    const { updatedProgress, bestStars } = recordLevelResult(
      levelsProgress,
      activeLevel.id,
      earnedStars
    );

    setLevelsProgress(updatedProgress);
    setLevelSummary({
      level: activeLevel,
      earnedStars,
      bestStars,
    });
    setView('level-result');
  };

  const nextLevelInGame: GameLevelConfig | null = useMemo(() => {
    if (!levelSummary) return null;
    const levels = getLevelsForGame(levelSummary.level.gameId);
    return (
      levels.find(
        (item) => item.levelNumber === levelSummary.level.levelNumber + 1
      ) ?? null
    );
  }, [levelSummary]);

  const handleClearHistory = () => {
    clearSessionHistory();
    setHistory([]);
  };

  const completedSession: SessionMetrics | null = useMemo(() => {
    if (
      !metrics.reaction ||
      !metrics.memory ||
      !metrics.numberHunt ||
      !metrics.stroop ||
      !metrics.mathBlitz
    ) {
      return null;
    }

    return {
      reaction: metrics.reaction,
      memory: metrics.memory,
      numberHunt: metrics.numberHunt,
      stroop: metrics.stroop,
      mathBlitz: metrics.mathBlitz,
    };
  }, [metrics]);

  const scores = useMemo(() => {
    if (!completedSession) return null;
    return calculateSessionResult(completedSession);
  }, [completedSession]);

  const bestBrainAge = useMemo(() => {
    if (history.length === 0) return null;
    return Math.min(...history.map((item) => item.brainAge));
  }, [history]);

  const currentGameIndex = GAME_STAGES.indexOf(view as GameStage);
  const showProgressBar = currentGameIndex !== -1;

  const gameTitleById: Record<MiniGameId, string> = {
    reaction: t.reactionTitle,
    memory: t.memoryTitle,
    'number-hunt': t.numberHuntTitle,
    stroop: t.stroopTitle,
    'math-blitz': t.mathBlitzTitle,
  };

  return (
    <div className="app-shell">
      <main className="phone-frame">
        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '14px',
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
            <span
              style={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontSize: '1.05rem',
              }}
            >
              {t.appTitle}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setHelpOpen(true)}
                aria-label={t.helpButtonLabel}
                title={t.helpButtonLabel}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  backgroundColor: '#172033',
                  color: '#38bdf8',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ?
              </button>

              {view === 'welcome' ? (
                <select
                  aria-label="Language"
                  value={locale}
                  onChange={(e) =>
                    handleLocaleChange(e.target.value as AppLocale)
                  }
                  style={{
                    backgroundColor: '#172033',
                    color: '#e2e8f0',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '10px',
                    padding: '6px 10px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {SUPPORTED_LOCALES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
              ) : (
                <button
                  type="button"
                  onClick={() => handleBackNavigation(true)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    color: '#cbd5e1',
                    borderRadius: '10px',
                    padding: '6px 10px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {t.homeButton}
                </button>
              )}
            </div>
          </div>

          {showProgressBar && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '6px',
              }}
            >
              {[0, 1, 2, 3, 4].map((stepIndex) => (
                <div
                  key={stepIndex}
                  style={{
                    height: '5px',
                    borderRadius: '999px',
                    backgroundColor:
                      stepIndex <= currentGameIndex
                        ? '#38bdf8'
                        : 'rgba(148, 163, 184, 0.18)',
                    transition: 'background-color 0.2s ease',
                  }}
                />
              ))}
            </div>
          )}

          {view === 'level-play' && activeLevel && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.82rem',
                color: '#38bdf8',
                fontWeight: 700,
              }}
            >
              <span>{gameTitleById[activeLevel.gameId]}</span>
              <span>
                {formatText(t.levelLabel, { level: activeLevel.levelNumber })}
              </span>
            </div>
          )}
        </header>

        {view === 'welcome' && (
          <section
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <div
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <span
                style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem' }}
              >
                {t.badgeFiveGames}
              </span>
              <h1 style={{ margin: 0, fontSize: '1.75rem', lineHeight: 1.15 }}>
                {t.heroHeading}
              </h1>
              <p
                style={{
                  margin: 0,
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  fontSize: '0.94rem',
                }}
              >
                {t.heroDescription}
              </p>
            </div>

            {history.length > 0 && bestBrainAge !== null && (
              <div
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '12px 14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {t.bestRecord}:{' '}
                    <strong style={{ color: '#34d399' }}>
                      {bestBrainAge} {t.yearsShort}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {t.clearHistory}
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {history.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.84rem',
                        paddingTop: '6px',
                        borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                      }}
                    >
                      <span style={{ color: '#cbd5e1' }}>
                        {formatHistoryDate(item.playedAt, locale)}
                      </span>
                      <span>
                        <strong style={{ color: '#38bdf8' }}>
                          {item.brainAge} {t.yearsShort}
                        </strong>{' '}
                        <span style={{ color: '#94a3b8' }}>
                          ({item.overallScore}/100)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="btn-primary"
              onClick={startNewSession}
            >
              {t.startTest}
            </button>

            <button
              type="button"
              onClick={() => openLevelsHub(null)}
              style={{
                background: 'rgba(30, 41, 59, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#e2e8f0',
                borderRadius: '14px',
                padding: '13px 16px',
                fontSize: '0.96rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {t.levelsModeButton}
            </button>
          </section>
        )}

        {/* --- Mode: Brain Age Test --- */}
        {view === 'reaction' && (
          <ReactionGame
            key={`reaction-${sessionId}`}
            onComplete={handleReactionComplete}
            locale={locale}
          />
        )}

        {view === 'memory' && (
          <MemoryGame
            key={`memory-${sessionId}`}
            onComplete={handleMemoryComplete}
            locale={locale}
          />
        )}

        {view === 'number-hunt' && (
          <NumberHuntGame
            key={`number-hunt-${sessionId}`}
            onComplete={handleNumberHuntComplete}
            locale={locale}
          />
        )}

        {view === 'stroop' && (
          <StroopGame
            key={`stroop-${sessionId}`}
            onComplete={handleStroopComplete}
            locale={locale}
          />
        )}

        {view === 'math-blitz' && (
          <MathBlitzGame
            key={`math-blitz-${sessionId}`}
            onComplete={handleMathBlitzComplete}
            locale={locale}
          />
        )}

        {view === 'result' && scores && completedSession && (
          <ResultCard
            locale={locale}
            scores={scores}
            metrics={completedSession}
            history={history}
            onPlayAgain={startNewSession}
          />
        )}

        {/* --- Mode: Levels games --- */}
        {view === 'levels-hub' && (
          <LevelsScreen
            locale={locale}
            progress={levelsProgress}
            initialGameId={selectedLevelsGame}
            onSelectGame={setSelectedLevelsGame}
            onSelectLevel={startLevel}
            onBackHome={() => {
              setSelectedLevelsGame(null);
              setMetrics({});
              setView('welcome');
            }}
          />
        )}

        {view === 'level-play' && activeLevel && (
          <>
            {activeLevel.gameId === 'reaction' && (
              <ReactionGame
                key={`lvl-${activeLevel.id}-${levelAttemptId}`}
                onComplete={handleLevelComplete}
                locale={locale}
                totalRounds={activeLevel.params.rounds}
              />
            )}

            {activeLevel.gameId === 'memory' && (
              <MemoryGame
                key={`lvl-${activeLevel.id}-${levelAttemptId}`}
                onComplete={handleLevelComplete}
                locale={locale}
                totalRounds={activeLevel.params.rounds}
                previewMs={activeLevel.params.previewMs}
              />
            )}

            {activeLevel.gameId === 'number-hunt' && (
              <NumberHuntGame
                key={`lvl-${activeLevel.id}-${levelAttemptId}`}
                onComplete={handleLevelComplete}
                locale={locale}
                gridSize={activeLevel.params.gridSize}
              />
            )}

            {activeLevel.gameId === 'stroop' && (
              <StroopGame
                key={`lvl-${activeLevel.id}-${levelAttemptId}`}
                onComplete={handleLevelComplete}
                locale={locale}
                totalRounds={activeLevel.params.rounds}
                conflictRatio={activeLevel.params.conflictRatio}
              />
            )}

            {activeLevel.gameId === 'math-blitz' && (
              <MathBlitzGame
                key={`lvl-${activeLevel.id}-${levelAttemptId}`}
                onComplete={handleLevelComplete}
                locale={locale}
                totalRounds={activeLevel.params.rounds}
              />
            )}
          </>
        )}

        {view === 'level-result' && levelSummary && (
          <section
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px',
                padding: '22px 18px',
              }}
            >
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#38bdf8',
                }}
              >
                {gameTitleById[levelSummary.level.gameId]} •{' '}
                {formatText(t.levelLabel, {
                  level: levelSummary.level.levelNumber,
                })}
              </span>

              <h2 style={{ margin: 0, fontSize: '1.45rem' }}>
                {levelSummary.earnedStars >= 1
                  ? t.levelCompletedTitle
                  : t.levelFailedTitle}
              </h2>

              <div
                style={{
                  fontSize: '2.2rem',
                  letterSpacing: '0.14em',
                  color: '#fbbf24',
                  fontWeight: 800,
                }}
              >
                {'★'.repeat(levelSummary.earnedStars)}
                {'☆'.repeat(3 - levelSummary.earnedStars)}
              </div>

              {levelSummary.earnedStars === 0 && (
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.86rem',
                    color: '#94a3b8',
                    lineHeight: 1.4,
                  }}
                >
                  {t.levelEarnStarHint}
                </p>
              )}
            </div>

            {levelSummary.bestStars >= 1 && nextLevelInGame && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => startLevel(nextLevelInGame)}
              >
                {t.levelNextButton}
              </button>
            )}

            <button
              type="button"
              className={
                levelSummary.bestStars >= 1 && nextLevelInGame
                  ? undefined
                  : 'btn-primary'
              }
              onClick={() => startLevel(levelSummary.level)}
              style={
                levelSummary.bestStars >= 1 && nextLevelInGame
                  ? {
                    background: 'rgba(30, 41, 59, 0.85)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    color: '#e2e8f0',
                    borderRadius: '14px',
                    padding: '13px 16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }
                  : undefined
              }
            >
              {t.levelRetryButton}
            </button>

            <button
              type="button"
              onClick={() => openLevelsHub(levelSummary.level.gameId)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                color: '#cbd5e1',
                borderRadius: '14px',
                padding: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t.levelBackToListButton}
            </button>
          </section>
        )}

        <HelpModal
          open={helpOpen}
          locale={locale}
          context={helpContext}
          onClose={() => setHelpOpen(false)}
        />
      </main>
    </div>
  );
}

export default App;