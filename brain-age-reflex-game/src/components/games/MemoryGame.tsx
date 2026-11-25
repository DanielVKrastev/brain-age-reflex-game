import { useEffect, useRef, useState } from 'react';
import {
  formatText,
  getTranslations,
  type AppLocale,
} from '../../i18n/translations';
import type { MemoryMetrics } from '../../types/game';
import { triggerErrorFeedback, triggerLightTap } from '../../utils/haptics';

interface MemoryGameProps {
  locale?: AppLocale;
  totalRounds?: number;
  onComplete: (metrics: MemoryMetrics) => void;
}

type Phase = 'ready-to-start' | 'showing' | 'input' | 'feedback';

const GRID_SIZE = 9; // 3x3 grid
const TOTAL_ROUNDS_DEFAULT = 3;

// Read current timestamp outside React component purity checks
function getCurrentTimestampMs(): number {
  return performance.now();
}

// Pick unique random tile indices using Fisher-Yates shuffle
function pickRandomIndices(count: number, maxExclusive: number): number[] {
  const pool = Array.from({ length: maxExclusive }, (_, idx) => idx);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function MemoryGame({
  locale = 'bg',
  totalRounds = TOTAL_ROUNDS_DEFAULT,
  onComplete,
}: MemoryGameProps) {
  const t = getTranslations(locale);

  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<Phase>('ready-to-start');
  const [targets, setTargets] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);

  const roundScoresRef = useRef<number[]>([]);
  const roundTimesSecRef = useRef<number[]>([]);
  const inputStartRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  // Clear any active round timer
  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Clean up timers on unmount only
  useEffect(() => {
    return () => clearTimer();
  }, []);

  // Start a specific round from a button click or round transition
  const startRound = (roundNumber: number) => {
    clearTimer();
    const patternLength = Math.min(3 + roundNumber, 6);
    const nextTargets = pickRandomIndices(patternLength, GRID_SIZE);

    setRound(roundNumber);
    setTargets(nextTargets);
    setSelected([]);
    setWrongIndex(null);
    setPhase('showing');

    timerRef.current = window.setTimeout(() => {
      inputStartRef.current = getCurrentTimestampMs();
      setPhase('input');
    }, 1500);
  };

  // Record round metrics and either advance or finish the mini-game
  const finishRound = (
    hitsCount: number,
    totalCount: number,
    elapsedSec: number
  ) => {
    const roundAccuracy = hitsCount / totalCount;

    const updatedScores = [...roundScoresRef.current, roundAccuracy];
    const updatedTimes = [...roundTimesSecRef.current, elapsedSec];

    roundScoresRef.current = updatedScores;
    roundTimesSecRef.current = updatedTimes;

    setPhase('feedback');

    timerRef.current = window.setTimeout(() => {
      if (round >= totalRounds) {
        const avgAccuracy =
          updatedScores.reduce((sum, val) => sum + val, 0) / updatedScores.length;
        const avgRoundSeconds = Number(
          (
            updatedTimes.reduce((sum, val) => sum + val, 0) / updatedTimes.length
          ).toFixed(2)
        );
        onComplete({
          accuracy: Number(avgAccuracy.toFixed(3)),
          avgRoundSeconds,
        });
      } else {
        startRound(round + 1);
      }
    }, 600);
  };

  const handleTilePress = (index: number) => {
    if (phase !== 'input') return;
    if (selected.includes(index) || wrongIndex !== null) return;

    const elapsedSec = Math.max(
      0.3,
      (getCurrentTimestampMs() - inputStartRef.current) / 1000
    );

    if (!targets.includes(index)) {
      // End current round early on a wrong tile and record partial hits
      void triggerErrorFeedback();
      setWrongIndex(index);
      finishRound(selected.length, targets.length, elapsedSec);
      return;
    }

    const nextSelected = [...selected, index];
    setSelected(nextSelected);

    if (nextSelected.length === targets.length) {
      void triggerLightTap();
      finishRound(targets.length, targets.length, elapsedSec);
    }
  };

  const getTileStyle = (index: number) => {
    const isTarget = targets.includes(index);
    const isSelected = selected.includes(index);
    const isWrong = wrongIndex === index;

    if (phase === 'showing' && isTarget) {
      return {
        backgroundColor: '#0284c7',
        borderColor: '#7dd3fc',
      };
    }

    if (isWrong) {
      return {
        backgroundColor: '#991b1b',
        borderColor: '#f87171',
      };
    }

    if (isSelected) {
      return {
        backgroundColor: '#059669',
        borderColor: '#34d399',
      };
    }

    if (phase === 'feedback' && isTarget) {
      return {
        backgroundColor: 'rgba(56, 189, 248, 0.25)',
        borderColor: '#38bdf8',
      };
    }

    return {
      backgroundColor: '#172033',
      borderColor: 'rgba(148, 163, 184, 0.2)',
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          2 / 5 · {t.memoryTitle}
        </span>
        <span style={{ fontWeight: 700, color: '#38bdf8' }}>
          {formatText(t.roundOf, { round, total: totalRounds })}
        </span>
      </div>

      <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.45 }}>
        {phase === 'ready-to-start' && t.memoryIntroHint}
        {phase === 'showing' && t.memorizeHighlighted} 
        {phase === 'input' &&
          formatText(t.memoryRepeatCount, { count: targets.length })}
        {phase === 'feedback' && t.memoryNextRound}
      </p>

      {phase === 'ready-to-start' ? (
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
            {t.readyForMemory}
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '280px' }}>
            {t.memoryPreviewHint}
          </span>
          <button
            type="button"
            className="btn-primary"
            style={{ maxWidth: '240px' }}
            onClick={() => startRound(1)}
          >
            {formatText(t.startRoundN, { round: 1 })}
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              flex: 1,
              alignContent: 'center',
            }}
          >
            {Array.from({ length: GRID_SIZE }, (_, idx) => (
              <button
                key={idx}
                type="button"
                onPointerDown={() => handleTilePress(idx)}
                style={{
                  ...getTileStyle(idx),
                  aspectRatio: '1 / 1',
                  borderRadius: '18px',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  cursor: phase === 'input' ? 'pointer' : 'default',
                  touchAction: 'manipulation',
                  transition: 'background-color 0.12s ease, border-color 0.12s ease',
                }}
              />
            ))}
          </div>

          <div
            className="card"
            style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}
          >
            <span style={{ color: '#94a3b8' }}>{t.foundInRound}:</span>
            <strong>
              {selected.length} / {targets.length}
            </strong>
          </div>
        </>
      )}
    </div>
  );
}