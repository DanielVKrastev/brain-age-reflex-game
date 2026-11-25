import { useEffect, useMemo, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { MathBlitzGame } from './components/games/MathBlitzGame';
import { MemoryGame } from './components/games/MemoryGame';
import { NumberHuntGame } from './components/games/NumberHuntGame';
import { ReactionGame } from './components/games/ReactionGame';
import { StroopGame } from './components/games/StroopGame';
import { ResultCard } from './components/ResultCard';
import {
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
import {
  appendSessionHistory,
  clearSessionHistory,
  formatHistoryDate,
  loadSessionHistory,
} from './utils/historyStorage';
import { loadSavedLocale, saveLocale } from './utils/localeStorage';
import { calculateSessionResult } from './utils/scoring';

interface PartialSessionMetrics {
  reaction?: ReactionMetrics;
  memory?: MemoryMetrics;
  numberHunt?: NumberHuntMetrics;
  stroop?: StroopMetrics;
  mathBlitz?: MathBlitzMetrics;
}

const GAME_STAGES: GameStage[] = [
  'reaction',
  'memory',
  'number-hunt',
  'stroop',
  'math-blitz',
];

export function App() {
  const [stage, setStage] = useState<GameStage>('welcome');
  const [sessionId, setSessionId] = useState<number>(0);
  const [metrics, setMetrics] = useState<PartialSessionMetrics>({});
  const [history, setHistory] = useState<SessionHistoryEntry[]>(() =>
    loadSessionHistory()
  );
  const [locale, setLocale] = useState<AppLocale>(() => loadSavedLocale());

  const t = useMemo(() => getTranslations(locale), [locale]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listenerHandle: { remove: () => Promise<void> } | undefined;

    const registerBackListener = async () => {
      listenerHandle = await CapacitorApp.addListener(
        'backButton',
        ({ canGoBack }) => {
          if (stage === 'welcome') {
            if (!canGoBack) {
              void CapacitorApp.exitApp();
            }
            return;
          }

          setMetrics({});
          setStage('welcome');
        }
      );
    };

    void registerBackListener();

    return () => {
      if (listenerHandle) {
        void listenerHandle.remove();
      }
    };
  }, [stage]);

  const handleLocaleChange = (nextLocale: AppLocale) => {
    setLocale(nextLocale);
    saveLocale(nextLocale);
  };

  const startNewSession = () => {
    setMetrics({});
    setSessionId((prev) => prev + 1);
    setStage('reaction');
  };

  const handleReactionComplete = (reaction: ReactionMetrics) => {
    setMetrics((prev) => ({ ...prev, reaction }));
    setStage('memory');
  };

  const handleMemoryComplete = (memory: MemoryMetrics) => {
    setMetrics((prev) => ({ ...prev, memory }));
    setStage('number-hunt');
  };

  const handleNumberHuntComplete = (numberHunt: NumberHuntMetrics) => {
    setMetrics((prev) => ({ ...prev, numberHunt }));
    setStage('stroop');
  };

  const handleStroopComplete = (stroop: StroopMetrics) => {
    setMetrics((prev) => ({ ...prev, stroop }));
    setStage('math-blitz');
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

    setStage('result');
  };

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

  const currentGameIndex = GAME_STAGES.indexOf(stage);
  const showProgressBar = currentGameIndex !== -1;

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

            {stage === 'welcome' ? (
              <select
                aria-label="Language"
                value={locale}
                onChange={(e) => handleLocaleChange(e.target.value as AppLocale)}
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
                onClick={() => setStage('welcome')}
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
        </header>

        {stage === 'welcome' && (
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
          </section>
        )}

        {stage === 'reaction' && (
          <ReactionGame
            key={`reaction-${sessionId}`}
            onComplete={handleReactionComplete}
            locale={locale}
          />
        )}

        {stage === 'memory' && (
          <MemoryGame
            key={`memory-${sessionId}`}
            onComplete={handleMemoryComplete}
            locale={locale}
          />
        )}

        {stage === 'number-hunt' && (
          <NumberHuntGame
            key={`number-hunt-${sessionId}`}
            onComplete={handleNumberHuntComplete}
            locale={locale}
          />
        )}

        {stage === 'stroop' && (
          <StroopGame
            key={`stroop-${sessionId}`}
            onComplete={handleStroopComplete}
            locale={locale}
          />
        )}

        {stage === 'math-blitz' && (
          <MathBlitzGame
            key={`math-blitz-${sessionId}`}
            onComplete={handleMathBlitzComplete}
            locale={locale}
          />
        )}

        {stage === 'result' && scores && completedSession && (
          <ResultCard
            locale={locale}
            scores={scores}
            metrics={completedSession}
            history={history}
            onPlayAgain={startNewSession}
          />
        )}
      </main>
    </div>
  );
}

export default App;