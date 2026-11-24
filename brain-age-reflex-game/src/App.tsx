import { useState } from 'react';
import { ReactionGame } from './components/games/ReactionGame';
import type { GameStage, ReactionMetrics } from './types/game';
import { scoreReaction } from './utils/scoring';

export function App() {
  const [stage, setStage] = useState<GameStage>('welcome');
  const [reactionData, setReactionData] = useState<ReactionMetrics | null>(null);

  const handleReactionComplete = (metrics: ReactionMetrics) => {
    setReactionData(metrics);
    setStage('result');
  };

  const handleRestart = () => {
    setReactionData(null);
    setStage('reaction');
  };

  return (
    <div className="app-shell">
      <main className="phone-frame">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.05rem' }}>
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
        </header>

        {stage === 'welcome' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1, justifyContent: 'center' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem' }}>
                60-СЕКУНДЕН КОГНИТИВЕН ТЕСТ
              </span>
              <h1 style={{ margin: 0, fontSize: '1.75rem', lineHeight: 1.15 }}>
                На колко години е мозъкът ти?
              </h1>
              <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.5, fontSize: '0.95rem' }}>
                Четири кратки мини-игри за реакция, визуална памет, търсене на числа и фокус. Сравни резултата си с приятели.
              </p>
            </div>

            <button type="button" className="btn-primary" onClick={() => setStage('reaction')}>
              Започни теста
            </button>
          </section>
        )}

        {stage === 'reaction' && <ReactionGame onComplete={handleReactionComplete} />}

        {stage === 'result' && reactionData && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }}>
                МИНИ-ИГРА 1 ЗАВЪРШЕНА
              </span>
              <h2 style={{ margin: 0, fontSize: '1.6rem' }}>
                Медиана: {reactionData.medianMs} ms
              </h2>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.92rem' }}>
                Индекс за реакция: <strong>{scoreReaction(reactionData.medianMs)} / 100</strong>
              </p>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.88rem' }}>
                Опити: {reactionData.attemptsMs.join(' ms, ')} ms
              </p>
            </div>

            <button type="button" className="btn-primary" onClick={handleRestart}>
              Играй пак
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;