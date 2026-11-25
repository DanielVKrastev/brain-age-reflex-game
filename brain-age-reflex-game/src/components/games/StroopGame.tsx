import { useEffect, useRef, useState } from 'react';
import {
  formatText,
  getTranslations,
  type AppLocale,
} from '../../i18n/translations';
import type { StroopMetrics } from '../../types/game';
import { triggerErrorFeedback, triggerLightTap } from '../../utils/haptics';

interface StroopGameProps {
  locale?: AppLocale;
  totalRounds?: number;
  onComplete: (metrics: StroopMetrics) => void;
}

type ColorKey = 'red' | 'blue' | 'green' | 'amber';

interface ColorOption {
  key: ColorKey;
  label: string;
  hex: string;
}

interface StroopTrial {
  wordLabel: string;
  inkColor: ColorOption;
}

const COLOR_PALETTE: Array<{ key: ColorKey; hex: string }> = [
  { key: 'red', hex: '#ef4444' },
  { key: 'blue', hex: '#38bdf8' },
  { key: 'green', hex: '#10b981' },
  { key: 'amber', hex: '#f5f117' },
];

const DEFAULT_ROUNDS = 8;

// Read a timestamp outside React render/effect purity checks
function captureTimestampMs(): number {
  return performance.now();
}

// Generate a Stroop trial, favoring incongruent word/ink pairs to test cognitive control
function createStroopTrial(
  options: ColorOption[],
  previousInkKey?: ColorKey
): StroopTrial {
  const availableInks = options.filter((c) => c.key !== previousInkKey);
  const inkColor =
    availableInks[Math.floor(Math.random() * availableInks.length)];

  const shouldConflict = Math.random() < 0.75;
  const wordCandidates = shouldConflict
    ? options.filter((c) => c.key !== inkColor.key)
    : [inkColor];
  const wordSource =
    wordCandidates[Math.floor(Math.random() * wordCandidates.length)];

  return {
    wordLabel: wordSource.label,
    inkColor,
  };
}

export function StroopGame({
  locale = 'bg',
  totalRounds = DEFAULT_ROUNDS,
  onComplete,
}: StroopGameProps) {
  const t = getTranslations(locale);

  const colorOptions: ColorOption[] = COLOR_PALETTE.map((item) => {
    const labelMap: Record<ColorKey, string> = {
      red: t.colorRed,
      blue: t.colorBlue,
      green: t.colorGreen,
      amber: t.colorYellow,
    };
    return {
      key: item.key,
      label: labelMap[item.key],
      hex: item.hex,
    };
  });

  const [started, setStarted] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const [trial, setTrial] = useState<StroopTrial>(() =>
    createStroopTrial(colorOptions)
  );
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(
    null
  );

  const correctCountRef = useRef<number>(0);
  const reactionTimesRef = useRef<number[]>([]);
  const trialStartRef = useRef<number>(0);
  const advanceTimerRef = useRef<number | null>(null);
  const lockedRef = useRef<boolean>(false);

  // Clear pending transition timer on unmount or restart
  const clearAdvanceTimer = () => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearAdvanceTimer();
  }, []);

  // Begin the Stroop session from an explicit user action
  const handleStart = () => {
    clearAdvanceTimer();
    correctCountRef.current = 0;
    reactionTimesRef.current = [];
    lockedRef.current = false;

    const firstTrial = createStroopTrial(colorOptions);
    setRound(1);
    setTrial(firstTrial);
    setLastFeedback(null);
    setStarted(true);
    trialStartRef.current = captureTimestampMs();
  };

  const handleAnswer = (chosenKey: ColorKey) => {
    if (!started || lockedRef.current) return;
    lockedRef.current = true;

    const elapsedMs = Math.max(
      120,
      Math.round(captureTimestampMs() - trialStartRef.current)
    );
    reactionTimesRef.current = [...reactionTimesRef.current, elapsedMs];

    const isCorrect = chosenKey === trial.inkColor.key;
    if (isCorrect) {
      void triggerLightTap();
      correctCountRef.current += 1;
    } else {
      void triggerErrorFeedback();
    }

    setLastFeedback(isCorrect ? 'correct' : 'wrong');

    advanceTimerRef.current = window.setTimeout(() => {
      if (round >= totalRounds) {
        const accuracy = Number(
          (correctCountRef.current / totalRounds).toFixed(3)
        );
        const totalMs = reactionTimesRef.current.reduce(
          (sum, val) => sum + val,
          0
        );
        const avgAnswerMs = Math.round(
          totalMs / Math.max(1, reactionTimesRef.current.length)
        );

        onComplete({
          accuracy,
          avgAnswerMs,
        });
        return;
      }

      const nextTrial = createStroopTrial(colorOptions, trial.inkColor.key);
      setRound((prev) => prev + 1);
      setTrial(nextTrial);
      setLastFeedback(null);
      lockedRef.current = false;
      trialStartRef.current = captureTimestampMs();
    }, 320);
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
          4 / 5 · {t.stroopTitle}
        </span>
        <span style={{ fontWeight: 700, color: '#38bdf8' }}>
          {formatText(t.roundOf, { round, total: totalRounds })}
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
            {t.readyForStroop}
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '290px' }}>
            {t.stroopInstructions}
          </span>
          <button
            type="button"
            className="btn-primary"
            style={{ maxWidth: '240px' }}
            onClick={handleStart}
          >
            {t.startTest}
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
            {t.stroopPrompt}
          </p>

          <div
            className="card"
            style={{
              flex: 1,
              minHeight: '190px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              borderColor:
                lastFeedback === 'correct'
                  ? 'rgba(16, 185, 129, 0.55)'
                  : lastFeedback === 'wrong'
                  ? 'rgba(239, 68, 68, 0.55)'
                  : 'rgba(148, 163, 184, 0.16)',
            }}
          >
            <span
              style={{
                fontSize: '2.3rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: trial.inkColor.hex,
                userSelect: 'none',
              }}
            >
              {trial.wordLabel}
            </span>

            <span style={{ fontSize: '0.82rem', color: '#94a3b8', minHeight: '18px' }}>
              {lastFeedback === 'correct' && t.stroopCorrect}
              {lastFeedback === 'wrong' &&
                formatText(t.stroopWrong, { color: trial.inkColor.label })}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
            }}
          >
            {colorOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onPointerDown={() => handleAnswer(option.key)}
                style={{
                  padding: '15px 12px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(148, 163, 184, 0.22)',
                  backgroundColor: '#172033',
                  color: option.hex,
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}