import { useMemo, useState } from 'react';
import { MathBlitzGame } from './components/games/MathBlitzGame';
import { MemoryGame } from './components/games/MemoryGame';
import { NumberHuntGame } from './components/games/NumberHuntGame';
import { ReactionGame } from './components/games/ReactionGame';
import { StroopGame } from './components/games/StroopGame';
import { ResultCard } from './components/ResultCard';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import type {
  GameStage,
  MathBlitzMetrics,
  MemoryMetrics,
  NumberHuntMetrics,
  ReactionMetrics,
  SessionMetrics,
  StroopMetrics,
} from './types/game';
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
    setMetrics((prev) => ({ ...prev, mathBlitz }));
    setStage('result');
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
            }}
          >
            <span
              style={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontSize: '1.05rem',
              }}
            >
              Brain Age & Reflex
            </span>

            {stage !== 'welcome' && (
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
                Начало
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
              gap: '18px',
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
                5 МИНИ-ИГРИ · КОГНИТИВЕН ТЕСТ
              </span>
              <h1 style={{ margin: 0, fontSize: '1.75rem', lineHeight: 1.15 }}>
                На колко години е мозъкът ти?
              </h1>
              <p
                style={{
                  margin: 0,
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  fontSize: '0.94rem',
                }}
              >
                Премини през реакция, визуална памет, търсене на числа, ефект
                на Струп и бърза математика, за да изчислим относителната ти
                мозъчна възраст.
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={startNewSession}
            >
              Започни теста
            </button>
          </section>
        )}

        {stage === 'reaction' && (
          <ReactionGame
            key={`reaction-${sessionId}`}
            onComplete={handleReactionComplete}
          />
        )}

        {stage === 'memory' && (
          <MemoryGame
            key={`memory-${sessionId}`}
            onComplete={handleMemoryComplete}
          />
        )}

        {stage === 'number-hunt' && (
          <NumberHuntGame
            key={`number-hunt-${sessionId}`}
            onComplete={handleNumberHuntComplete}
          />
        )}

        {stage === 'stroop' && (
          <StroopGame
            key={`stroop-${sessionId}`}
            onComplete={handleStroopComplete}
          />
        )}

        {stage === 'math-blitz' && (
          <MathBlitzGame
            key={`math-blitz-${sessionId}`}
            onComplete={handleMathBlitzComplete}
          />
        )}

        {stage === 'result' && scores && completedSession && (
          <ResultCard
            scores={scores}
            metrics={completedSession}
            onPlayAgain={startNewSession}
          />
        )}
      </main>
    </div>
  );
}

export default App;