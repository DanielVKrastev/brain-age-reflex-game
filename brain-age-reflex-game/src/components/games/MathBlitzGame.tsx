import { useCallback, useEffect, useRef, useState } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import {
  formatText,
  getTranslations,
  type AppLocale,
} from '../../i18n/translations';
import type { MathBlitzMetrics } from '../../types/game';

interface MathBlitzGameProps {
  locale?: AppLocale;
  onComplete: (metrics: MathBlitzMetrics) => void;
  totalRounds?: number;
}

interface MathQuestion {
  prompt: string;
  answer: number;
  options: number[];
}

type Phase = 'intro' | 'playing' | 'done';

const DEFAULT_ROUNDS = 7;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildQuestion(roundIndex: number): MathQuestion {
  const ops: Array<'+' | '-' | '×'> =
    roundIndex < 3 ? ['+', '-'] : ['+', '-', '×'];
  const op = ops[randomInt(0, ops.length - 1)];

  // eslint-disable-next-line no-useless-assignment
  let prompt = '';
  // eslint-disable-next-line no-useless-assignment
  let answer = 0;

  if (op === '+') {
    const a = randomInt(12, 58);
    const b = randomInt(8, 45);
    answer = a + b;
    prompt = `${a} + ${b}`;
  } else if (op === '-') {
    const a = randomInt(25, 85);
    const b = randomInt(7, Math.min(35, a - 5));
    answer = a - b;
    prompt = `${a} - ${b}`;
  } else {
    const a = randomInt(3, 11);
    const b = randomInt(3, 9);
    answer = a * b;
    prompt = `${a} × ${b}`;
  }

  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const offset = randomInt(-9, 9);
    const candidate = answer + offset;
    if (candidate !== answer && candidate >= 0) {
      distractors.add(candidate);
    }
  }

  const options = [answer, ...Array.from(distractors)].sort(
    () => Math.random() - 0.5
  );

  return { prompt, answer, options };
}

async function triggerMathHaptic(
  style: ImpactStyle = ImpactStyle.Light
): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await Haptics.impact({ style });
  } catch {
    // Ignore haptic errors on unsupported devices
  }
}

export function MathBlitzGame({
  locale = 'bg',
  totalRounds,
  onComplete,
}: MathBlitzGameProps) {

  const roundsCount = totalRounds ?? DEFAULT_ROUNDS;
  const t = getTranslations(locale);

  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState<number>(1);
  const [question, setQuestion] = useState<MathQuestion>(() => buildQuestion(0));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [reactionTimesMs, setReactionTimesMs] = useState<number[]>([]);
  const [locked, setLocked] = useState<boolean>(false);

  const questionStartRef = useRef<number>(0);
  const advanceTimerRef = useRef<number | null>(null);
  const completedRef = useRef<boolean>(false);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  const presentQuestion = useCallback((roundNum: number) => {
    const nextQ = buildQuestion(roundNum - 1);
    setQuestion(nextQ);
    setFeedback(null);
    setLocked(false);
    questionStartRef.current = performance.now();
  }, []);

  useEffect(() => {
    return () => {
      clearAdvanceTimer();
    };
  }, [clearAdvanceTimer]);

  useEffect(() => {
    if (phase !== 'done' || completedRef.current) return;
    completedRef.current = true;

    const finishTimer = window.setTimeout(() => {
      const accuracy = correctCount / roundsCount;
      const avgAnswerMs =
        reactionTimesMs.length > 0
          ? Math.round(
              reactionTimesMs.reduce((sum, item) => sum + item, 0) /
                reactionTimesMs.length
            )
          : 0;

      onComplete({
        accuracy,
        avgAnswerMs,
      });
    }, 350);

    return () => {
      window.clearTimeout(finishTimer);
    };
  }, [phase, correctCount, reactionTimesMs, onComplete]);

  const handleStart = () => {
    completedRef.current = false;
    setCorrectCount(0);
    setReactionTimesMs([]);
    setRound(1);
    setPhase('playing');
    void triggerMathHaptic(ImpactStyle.Light);
    presentQuestion(1);
  };

  const handleSelectOption = (selected: number) => {
    if (phase !== 'playing' || locked) return;
    setLocked(true);

    const elapsedMs = Math.max(
      1,
      Math.round(performance.now() - questionStartRef.current)
    );
    const nextTimes = [...reactionTimesMs, elapsedMs];
    setReactionTimesMs(nextTimes);

    const isCorrect = selected === question.answer;
    const nextCorrect = isCorrect ? correctCount + 1 : correctCount;
    if (isCorrect) {
      setCorrectCount(nextCorrect);
      setFeedback(t.correctAnswer);
      void triggerMathHaptic(ImpactStyle.Light);
    } else {
      setFeedback(
        formatText(t.wrongAnswerWithSolution, { answer: question.answer })
      );
      void triggerMathHaptic(ImpactStyle.Heavy);
    }

    advanceTimerRef.current = window.setTimeout(() => {
      if (round >= roundsCount) {
        setPhase('done');
      } else {
        const nextRound = round + 1;
        setRound(nextRound);
        presentQuestion(nextRound);
      }
    }, 420);
  };

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
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
          {t.mathBlitzTitle}
        </span>
        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          {formatText(t.roundOf, { round, total: roundsCount })}
        </span>
      </div>

      {phase === 'intro' && (
        <div
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.35rem' }}>{t.readyForMath}</h2>
          <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.5 }}>
            {formatText(t.mathInstructions, { total: roundsCount })}
          </p>
          <button type="button" className="btn-primary" onClick={handleStart}>
            {t.startTest}
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flex: 1,
          }}
        >
          <div
            className="card"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textAlign: 'center',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              {t.chooseCorrectAnswer}
            </span>
            <div
              style={{
                fontSize: '2.35rem',
                fontWeight: 900,
                letterSpacing: '0.02em',
              }}
            >
              {question.prompt}
            </div>
            <div
              style={{
                minHeight: '22px',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: feedback === t.correctAnswer ? '#34d399' : '#fbbf24',
              }}
            >
              {feedback ?? ''}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
            }}
          >
            {question.options.map((opt) => (
              <button
                key={opt}
                type="button"
                disabled={locked}
                onClick={() => handleSelectOption(opt)}
                className="btn-secondary"
                style={{
                  padding: '16px',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div
          className="card"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#94a3b8' }}>{t.calculatingResult}</span>
        </div>
      )}
    </section>
  );
}