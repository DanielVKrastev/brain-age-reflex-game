/* eslint-disable no-useless-assignment */
import { useEffect, useRef, useState } from 'react';
import type { MathBlitzMetrics } from '../../types/game';

interface MathBlitzGameProps {
  totalRounds?: number;
  onComplete: (metrics: MathBlitzMetrics) => void;
}

interface MathProblem {
  expression: string;
  answer: number;
  options: number[];
}

const DEFAULT_ROUNDS = 7;

// Read elapsed milliseconds from a start timestamp outside React purity checks
function readElapsedMs(startMs: number): number {
  return Math.max(150, Math.round(performance.now() - startMs));
}

// Pick a random integer in [min, max] inclusive
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate an arithmetic prompt with four distinct plausible choices
function createMathProblem(roundIndex: number): MathProblem {
  const operatorPool: Array<'+' | '-' | '×'> =
    roundIndex >= 3 ? ['+', '-', '×'] : ['+', '-'];
  const op = operatorPool[randomInt(0, operatorPool.length - 1)];

  let expression = '';
  let answer = 0;

  if (op === '+') {
    const a = randomInt(8, 38);
    const b = randomInt(6, 29);
    expression = `${a} + ${b}`;
    answer = a + b;
  } else if (op === '-') {
    const a = randomInt(18, 55);
    const b = randomInt(5, a - 3);
    expression = `${a} - ${b}`;
    answer = a - b;
  } else {
    const a = randomInt(3, 9);
    const b = randomInt(2, 8);
    expression = `${a} × ${b}`;
    answer = a * b;
  }

  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const offset = randomInt(-6, 6);
    const candidate = answer + offset;
    if (candidate !== answer && candidate >= 0) {
      distractors.add(candidate);
    }
  }

  const combined = [answer, ...Array.from(distractors)];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return {
    expression,
    answer,
    options: combined,
  };
}

export function MathBlitzGame({
  totalRounds = DEFAULT_ROUNDS,
  onComplete,
}: MathBlitzGameProps) {
  const [started, setStarted] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const [problem, setProblem] = useState<MathProblem>(() => createMathProblem(1));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const correctCountRef = useRef<number>(0);
  const answerTimesRef = useRef<number[]>([]);
  const promptStartRef = useRef<number>(0);
  const nextTimerRef = useRef<number | null>(null);
  const lockedRef = useRef<boolean>(false);

  const clearNextTimer = () => {
    if (nextTimerRef.current !== null) {
      window.clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearNextTimer();
  }, []);

  const handleStart = () => {
    clearNextTimer();
    correctCountRef.current = 0;
    answerTimesRef.current = [];
    lockedRef.current = false;

    const firstProblem = createMathProblem(1);
    setRound(1);
    setProblem(firstProblem);
    setFeedback(null);
    setStarted(true);
    promptStartRef.current = performance.now();
  };

  const handleSelectOption = (chosenValue: number) => {
    if (!started || lockedRef.current) return;
    lockedRef.current = true;

    const elapsedMs = readElapsedMs(promptStartRef.current);
    answerTimesRef.current = [...answerTimesRef.current, elapsedMs];

    const isCorrect = chosenValue === problem.answer;
    if (isCorrect) {
      correctCountRef.current += 1;
    }

    setFeedback(isCorrect ? 'correct' : 'wrong');

    nextTimerRef.current = window.setTimeout(() => {
      if (round >= totalRounds) {
        const accuracy = Number((correctCountRef.current / totalRounds).toFixed(3));
        const totalMs = answerTimesRef.current.reduce((sum, val) => sum + val, 0);
        const avgAnswerMs = Math.round(
          totalMs / Math.max(1, answerTimesRef.current.length)
        );

        onComplete({
          accuracy,
          avgAnswerMs,
        });
        return;
      }

      const nextRoundNumber = round + 1;
      setRound(nextRoundNumber);
      setProblem(createMathProblem(nextRoundNumber));
      setFeedback(null);
      lockedRef.current = false;
      promptStartRef.current = performance.now();
    }, 280);
  };

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
          5 / 5 · Бърза математика
        </span>
        <span style={{ fontWeight: 700, color: '#38bdf8' }}>
          Рунд {round} от {totalRounds}
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
          <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            Готов за бърза математика?
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '290px' }}>
            Реши {totalRounds} кратки сметки с `+`, `-` и `×` възможно най-точно и бързо.
          </span>
          <button
            type="button"
            className="btn-primary"
            style={{ maxWidth: '240px' }}
            onClick={handleStart}
          >
            Започни теста
          </button>
        </div>
      ) : (
        <>
          <p
            style={{
              margin: 0,
              color: '#cbd5e1',
              fontSize: '0.92rem',
              textAlign: 'center',
            }}
          >
            Избери верния резултат:
          </p>

          <div
            className="card"
            style={{
              flex: 1,
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              borderColor:
                feedback === 'correct'
                  ? 'rgba(16, 185, 129, 0.55)'
                  : feedback === 'wrong'
                  ? 'rgba(239, 68, 68, 0.55)'
                  : 'rgba(148, 163, 184, 0.16)',
            }}
          >
            <span
              style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                color: '#f8fafc',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {problem.expression} = ?
            </span>

            <span style={{ fontSize: '0.84rem', color: '#94a3b8', minHeight: '18px' }}>
              {feedback === 'correct' && 'Верен отговор!'}
              {feedback === 'wrong' && `Грешно — верният отговор е ${problem.answer}`}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
            }}
          >
            {problem.options.map((option) => (
              <button
                key={option}
                type="button"
                onPointerDown={() => handleSelectOption(option)}
                style={{
                  padding: '16px 12px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(148, 163, 184, 0.22)',
                  backgroundColor: '#172033',
                  color: '#f8fafc',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  fontVariantNumeric: 'tabular-nums',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}