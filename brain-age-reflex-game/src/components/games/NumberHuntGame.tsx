import { useEffect, useRef, useState } from 'react';
import type { NumberHuntMetrics } from '../../types/game';

interface NumberHuntGameProps {
  gridSize?: number; // 4 means 4x4 (1..16)
  onComplete: (metrics: NumberHuntMetrics) => void;
}

const DEFAULT_GRID_SIZE = 4;

// Create a shuffled array of numbers from 1 to count
function createShuffledBoard(count: number): number[] {
  const nums = Array.from({ length: count }, (_, idx) => idx + 1);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

// Compute elapsed seconds from a recorded start timestamp
function getElapsedSeconds(startMs: number): number {
  return Math.max(0.5, Number(((performance.now() - startMs) / 1000).toFixed(2)));
}

export function NumberHuntGame({
  gridSize = DEFAULT_GRID_SIZE,
  onComplete,
}: NumberHuntGameProps) {
  const totalNumbers = gridSize * gridSize;

  const [started, setStarted] = useState<boolean>(false);
  const [board, setBoard] = useState<number[]>(() => createShuffledBoard(totalNumbers));
  const [nextNumber, setNextNumber] = useState<number>(1);
  const [cleared, setCleared] = useState<number[]>([]);
  const [wrongNum, setWrongNum] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState<number>(0);

  const startTimeRef = useRef<number>(0);
  const finishedRef = useRef<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const wrongTimeoutRef = useRef<number | null>(null);

  // Clear active intervals and timeouts
  const clearTimers = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (wrongTimeoutRef.current !== null) {
      window.clearTimeout(wrongTimeoutRef.current);
      wrongTimeoutRef.current = null;
    }
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Start the hunt from user action
  const handleStartGame = () => {
    clearTimers();
    finishedRef.current = false;
    startTimeRef.current = performance.now();

    setBoard(createShuffledBoard(totalNumbers));
    setNextNumber(1);
    setCleared([]);
    setWrongNum(null);
    setElapsedSec(0);
    setStarted(true);

    intervalRef.current = window.setInterval(() => {
      if (!finishedRef.current) {
        setElapsedSec(getElapsedSeconds(startTimeRef.current));
      }
    }, 100);
  };

  const handleNumberPress = (num: number) => {
    if (!started || finishedRef.current || cleared.includes(num)) return;

    if (num !== nextNumber) {
      setWrongNum(num);
      if (wrongTimeoutRef.current !== null) {
        window.clearTimeout(wrongTimeoutRef.current);
      }
      wrongTimeoutRef.current = window.setTimeout(() => {
        setWrongNum(null);
      }, 220);
      return;
    }

    const updatedCleared = [...cleared, num];
    setCleared(updatedCleared);

    if (num === totalNumbers) {
      finishedRef.current = true;
      clearTimers();
      const finalSec = getElapsedSeconds(startTimeRef.current);
      setElapsedSec(finalSec);

      window.setTimeout(() => {
        onComplete({ totalSeconds: finalSec });
      }, 350);
    } else {
      setNextNumber(num + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>3 / 4 · Търсене на числа</span>
        <span style={{ fontWeight: 800, color: '#34d399', fontVariantNumeric: 'tabular-nums' }}>
          {elapsedSec.toFixed(1)} s
        </span>
      </div>

      {!started ? (
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
          <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Готов за търсене на числа?</span>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '280px' }}>
            Натисни числата от 1 до {totalNumbers} във възходящ ред възможно най-бързо.
          </span>
          <button
            type="button"
            className="btn-primary"
            style={{ maxWidth: '240px' }}
            onClick={handleStartGame}
          >
            Започни рунда
          </button>
        </div>
      ) : (
        <>
          <div
            className="card"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Натисни последователно:</span>
            <span
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#38bdf8',
              }}
            >
              {nextNumber <= totalNumbers ? `Число ${nextNumber}` : 'Готово!'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gap: '8px',
              flex: 1,
              alignContent: 'center',
            }}
          >
            {board.map((num) => {
              const isCleared = cleared.includes(num);
              const isWrong = wrongNum === num;

              return (
                <button
                  key={num}
                  type="button"
                  onPointerDown={() => handleNumberPress(num)}
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: '14px',
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    borderColor: isWrong
                      ? '#f87171'
                      : isCleared
                      ? 'rgba(16, 185, 129, 0.35)'
                      : 'rgba(148, 163, 184, 0.2)',
                    backgroundColor: isWrong
                      ? '#991b1b'
                      : isCleared
                      ? 'rgba(16, 185, 129, 0.16)'
                      : '#172033',
                    color: isCleared ? '#6ee7b7' : '#f8fafc',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    cursor: isCleared ? 'default' : 'pointer',
                    touchAction: 'manipulation',
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
              color: '#94a3b8',
            }}
          >
            <span>
              Прогрес: {cleared.length} / {totalNumbers}
            </span>
            <button
              type="button"
              onClick={() => setBoard(createShuffledBoard(totalNumbers))}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: 0,
                fontSize: '0.85rem',
              }}
            >
              Нова подредба
            </button>
          </div>
        </>
      )}
    </div>
  );
}