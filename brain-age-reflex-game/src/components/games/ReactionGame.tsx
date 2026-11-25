import { useEffect, useRef, useState } from 'react';
import type { ReactionMetrics } from '../../types/game';
import { calculateMedian } from '../../utils/scoring';

interface ReactionGameProps {
  totalRounds?: number;
  onComplete: (metrics: ReactionMetrics) => void;
}

type Phase = 'idle' | 'waiting' | 'ready' | 'too-early' | 'round-done';

const TOTAL_ROUNDS_DEFAULT = 5;

function readNowMs(): number {
  return performance.now();
}

function pickDelayMs(): number {
  return 1100 + Math.floor(Math.random() * 1900);
}

export function ReactionGame({
  totalRounds = TOTAL_ROUNDS_DEFAULT,
  onComplete,
}: ReactionGameProps) {
  const [round, setRound] = useState<number>(1);
  const [phase, setPhase] = useState<Phase>('idle');
  const [lastReactionMs, setLastReactionMs] = useState<number | null>(null);
  const [attemptsMs, setAttemptsMs] = useState<number[]>([]);

  const attemptsRef = useRef<number[]>([]);
  const falseStartsRef = useRef<number>(0);
  const goTimestampRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const scheduleWaitingRound = (roundNumber: number) => {
    clearTimer();
    setRound(roundNumber);
    setLastReactionMs(null);
    setPhase('waiting');

    const delay = pickDelayMs();
    timerRef.current = window.setTimeout(() => {
      goTimestampRef.current = readNowMs();
      setPhase('ready');
    }, delay);
  };

  const handleStart = () => {
    attemptsRef.current = [];
    falseStartsRef.current = 0;
    setAttemptsMs([]);
    scheduleWaitingRound(1);
  };

  const handlePadPress = () => {
    if (phase === 'idle') return;

    if (phase === 'waiting') {
      clearTimer();
      falseStartsRef.current += 1;
      setPhase('too-early');
      return;
    }

    if (phase === 'too-early') {
      scheduleWaitingRound(round);
      return;
    }

    if (phase === 'ready') {
      const elapsed = Math.max(80, Math.round(readNowMs() - goTimestampRef.current));
      const updated = [...attemptsRef.current, elapsed];
      attemptsRef.current = updated;

      setAttemptsMs(updated);
      setLastReactionMs(elapsed);
      setPhase('round-done');

      clearTimer();
      timerRef.current = window.setTimeout(() => {
        if (round >= totalRounds) {
          const medianMs = calculateMedian(updated);
          onComplete({
            medianMs,
            falseStarts: falseStartsRef.current,
          });
        } else {
          scheduleWaitingRound(round + 1);
        }
      }, 750);
    }
  };

  const getVisualState = () => {
    switch (phase) {
      case 'waiting':
        return {
          bg: '#7f1d1d',
          border: '#f87171',
          heading: 'Изчакай зеления сигнал...',
          sub: 'Не натискай, докато екранът не светне в зелено.',
        };
      case 'ready':
        return {
          bg: '#065f46',
          border: '#34d399',
          heading: 'НАТИСНИ СЕГА!',
          sub: 'Максимална скорост!',
        };
      case 'too-early':
        return {
          bg: '#78350f',
          border: '#fbbf24',
          heading: 'Твърде рано!',
          sub: 'Натисни отново, за да повториш рунда.',
        };
      case 'round-done':
        return {
          bg: '#0c4a6e',
          border: '#38bdf8',
          heading: `${lastReactionMs ?? 0} ms`,
          sub: round >= totalRounds ? 'Изчисляване на резултата...' : 'Следващ рунд...',
        };
      default:
        return {
          bg: '#172033',
          border: 'rgba(148, 163, 184, 0.22)',
          heading: 'Тест за скорост на реакция',
          sub: `Изчакай зеления сигнал и натисни възможно най-бързо в ${totalRounds} рунда.`,
        };
    }
  };

  const visual = getVisualState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          1 / 5 · Скорост на реакция
        </span>
        <span style={{ fontWeight: 700, color: '#38bdf8' }}>
          Рунд {round} от {totalRounds}
        </span>
      </div>

      {phase === 'idle' ? (
        <div
          className="card"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {visual.heading}
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '290px' }}>
            {visual.sub}
          </span>
          <button
            type="button"
            className="btn-primary"
            style={{ maxWidth: '240px' }}
            onClick={handleStart}
          >
            Започни рундовете
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onPointerDown={handlePadPress}
            style={{
              flex: 1,
              minHeight: '260px',
              borderRadius: '22px',
              border: `2px solid ${visual.border}`,
              backgroundColor: visual.bg,
              color: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              touchAction: 'manipulation',
              transition: 'background-color 0.1s ease, border-color 0.1s ease',
            }}
          >
            <span style={{ fontSize: '1.85rem', fontWeight: 900 }}>
              {visual.heading}
            </span>
            <span style={{ color: '#e2e8f0', fontSize: '0.92rem', maxWidth: '280px' }}>
              {visual.sub}
            </span>
          </button>

          <div
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.88rem',
            }}
          >
            <span style={{ color: '#94a3b8' }}>Записани опити:</span>
            <strong>
              {attemptsMs.length > 0 ? `${attemptsMs.join(' ms · ')} ms` : '—'}
            </strong>
          </div>
        </>
      )}
    </div>
  );
}