import { useEffect, useRef, useState } from 'react';
import type { ReactionMetrics } from '../../types/game';
import { calculateMedian } from '../../utils/scoring';

interface ReactionGameProps {
  totalRounds?: number;
  onComplete: (metrics: ReactionMetrics) => void;
}

type Phase = 'waiting' | 'ready' | 'too-early' | 'round-done';

const TOTAL_ROUNDS_DEFAULT = 3;

export function ReactionGame({
  totalRounds = TOTAL_ROUNDS_DEFAULT,
  onComplete,
}: ReactionGameProps) {
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<Phase>('waiting');
  const [lastMs, setLastMs] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);

  const timeoutRef = useRef<number | null>(null);
  const greenStartRef = useRef<number>(0);

  // Clear pending timeout safely
  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Schedule the green signal for the current round
  const scheduleGreenSignal = () => {
    clearTimer();
    const delayMs = 1200 + Math.floor(Math.random() * 2300); // 1200 - 3500 ms
    timeoutRef.current = window.setTimeout(() => {
      greenStartRef.current = performance.now();
      setPhase('ready');
    }, delayMs);
  };

  // Start the first round on mount and clean up timers on unmount
  useEffect(() => {
    scheduleGreenSignal();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePadClick = () => {
    if (phase === 'waiting') {
      clearTimer();
      setPhase('too-early');
      return;
    }

    if (phase === 'too-early') {
      // Restart the same round cleanly inside the event handler
      setPhase('waiting');
      setLastMs(null);
      scheduleGreenSignal();
      return;
    }

    if (phase === 'ready') {
      const reactionMs = Math.max(
        50,
        Math.round(performance.now() - greenStartRef.current)
      );
      const updated = [...attempts, reactionMs];
      setAttempts(updated);
      setLastMs(reactionMs);

      if (round >= totalRounds) {
        const medianMs = calculateMedian(updated);
        window.setTimeout(() => {
          onComplete({ medianMs, attemptsMs: updated });
        }, 450);
      } else {
        setPhase('round-done');
      }
    }
  };

  const handleNextRound = () => {
    // Advance round state and schedule next signal directly in event handler
    setRound((prev) => prev + 1);
    setPhase('waiting');
    setLastMs(null);
    scheduleGreenSignal();
  };

  const getPadStyle = () => {
    if (phase === 'ready') {
      return {
        backgroundColor: '#059669',
        borderColor: '#34d399',
      };
    }
    if (phase === 'too-early') {
      return {
        backgroundColor: '#991b1b',
        borderColor: '#f87171',
      };
    }
    return {
      backgroundColor: '#172033',
      borderColor: 'rgba(148, 163, 184, 0.22)',
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>1 / 4 · Реакция</span>
        <span style={{ fontWeight: 700, color: '#38bdf8' }}>
          Опит {round} от {totalRounds}
        </span>
      </div>

      <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.45 }}>
        Изчакай екрана да стане <strong>зелен</strong> и натисни възможно най-бързо.
      </p>

      <button
        type="button"
        onPointerDown={handlePadClick}
        style={{
          ...getPadStyle(),
          flex: 1,
          minHeight: '300px',
          width: '100%',
          borderRadius: '22px',
          borderWidth: '2px',
          borderStyle: 'solid',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: 'pointer',
          userSelect: 'none',
          touchAction: 'manipulation',
        }}
      >
        {phase === 'waiting' && (
          <>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Изчакай зеленото...</span>
            <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Не натискай твърде рано</span>
          </>
        )}

        {phase === 'ready' && (
          <>
            <span style={{ fontSize: '2rem', fontWeight: 900 }}>НАТИСНИ СЕГА!</span>
            <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>Максимална скорост</span>
          </>
        )}

        {phase === 'too-early' && (
          <>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Твърде рано!</span>
            <span style={{ fontSize: '0.92rem' }}>Натисни тук, за да опиташ отново</span>
          </>
        )}

        {phase === 'round-done' && (
          <>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#6ee7b7' }}>
              {lastMs} ms
            </span>
            <span style={{ fontSize: '0.92rem', color: '#e2e8f0' }}>
              Записан опит {attempts.length}
            </span>
          </>
        )}
      </button>

      {phase === 'round-done' && round < totalRounds ? (
        <button type="button" className="btn-primary" onClick={handleNextRound}>
          Следващ опит ({round + 1}/{totalRounds})
        </button>
      ) : (
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
          <span style={{ color: '#94a3b8' }}>Записани опити:</span>
          <strong>{attempts.length > 0 ? `${attempts.join(' ms · ')} ms` : '—'}</strong>
        </div>
      )}
    </div>
  );
}