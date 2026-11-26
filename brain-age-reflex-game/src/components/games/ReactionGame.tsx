import { useCallback, useEffect, useRef, useState } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import {
  formatText,
  getTranslations,
  type AppLocale,
} from '../../i18n/translations';
import type { ReactionMetrics } from '../../types/game';

interface ReactionGameProps {
  locale?: AppLocale;
  onComplete: (metrics: ReactionMetrics) => void;
  totalRounds?: number;
}


type Phase = 'intro' | 'waiting' | 'ready' | 'too-early' | 'done';

const DEFAULT_ROUNDS = 5;
const MIN_DELAY_MS = 1100;
const MAX_DELAY_MS = 2800;

function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return Math.round(sorted[mid]);
}

async function triggerReactionHaptic(
  style: ImpactStyle = ImpactStyle.Light
): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await Haptics.impact({ style });
  } catch {
    // Ignore haptic errors on unsupported devices
  }
}

export function ReactionGame({
  locale = 'bg',
  onComplete,
  totalRounds
}: ReactionGameProps) {
  const t = getTranslations(locale);
  const TOTAL_ROUNDS = totalRounds ?? DEFAULT_ROUNDS;


  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState<number>(1);
  const [samples, setSamples] = useState<number[]>([]);
  const [falseStarts, setFalseStarts] = useState<number>(0);
  const [lastReactionMs, setLastReactionMs] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const readyTimestampRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);

  const clearScheduledTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleGreenSignal = useCallback(() => {
    clearScheduledTimer();
    setPhase('waiting');
    setLastReactionMs(null);

    const delay =
      MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);

    timerRef.current = window.setTimeout(() => {
      readyTimestampRef.current = performance.now();
      setPhase('ready');
      void triggerReactionHaptic(ImpactStyle.Light);
    }, delay);
  }, [clearScheduledTimer]);

  useEffect(() => {
    return () => {
      clearScheduledTimer();
    };
  }, [clearScheduledTimer]);

  useEffect(() => {
    if (phase !== 'done' || completedRef.current) return;
    completedRef.current = true;

    const finishTimer = window.setTimeout(() => {
      const medianMs = computeMedian(samples);

      onComplete({
        medianMs,
        falseStarts,
      });
    }, 650);

    return () => {
      window.clearTimeout(finishTimer);
    };
  }, [phase, samples, falseStarts, onComplete]);

  const handleStartTest = () => {
    completedRef.current = false;
    setSamples([]);
    setFalseStarts(0);
    setRound(1);
    void triggerReactionHaptic(ImpactStyle.Light);
    scheduleGreenSignal();
  };

  const handlePadPress = () => {
    if (phase === 'waiting') {
      clearScheduledTimer();
      setFalseStarts((prev) => prev + 1);
      setPhase('too-early');
      void triggerReactionHaptic(ImpactStyle.Heavy);
      return;
    }

    if (phase === 'too-early') {
      void triggerReactionHaptic(ImpactStyle.Light);
      scheduleGreenSignal();
      return;
    }

    if (phase === 'ready') {
      const elapsed = Math.max(
        1,
        Math.round(performance.now() - readyTimestampRef.current)
      );
      const nextSamples = [...samples, elapsed];
      setSamples(nextSamples);
      setLastReactionMs(elapsed);
      void triggerReactionHaptic(ImpactStyle.Medium);

      if (round >= TOTAL_ROUNDS) {
        setPhase('done');
      } else {
        setRound((prev) => prev + 1);
        scheduleGreenSignal();
      }
    }
  };

  let padBackground = '#172033';
  let padBorder = '1px solid rgba(148, 163, 184, 0.22)';
  let statusTitle = t.waitForGreen;
  let statusSubtitle = t.doNotPressEarly;

  if (phase === 'ready') {
    padBackground = '#065f46';
    padBorder = '1px solid #34d399';
    statusTitle = t.pressNow;
    statusSubtitle = t.maxSpeed;
  } else if (phase === 'too-early') {
    padBackground = '#7f1d1d';
    padBorder = '1px solid #f87171';
    statusTitle = t.tooEarly;
    statusSubtitle = t.tapToRetryRound;
  } else if (phase === 'done') {
    padBackground = '#0f172a';
    padBorder = '1px solid rgba(56, 189, 248, 0.45)';
    statusTitle = t.calculatingResult;
    statusSubtitle = `${t.recordedAttempts} ${samples.map((s) => `${s} ms`).join(' · ')}`;
  } else if (lastReactionMs !== null) {
    statusSubtitle = `${lastReactionMs} ms · ${t.nextRound}`;
  }

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
          {t.reactionTitle}
        </span>
        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          {formatText(t.roundOf, { round, total: TOTAL_ROUNDS })}
        </span>
      </div>

      {phase === 'intro' ? (
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
          <h2 style={{ margin: 0, fontSize: '1.35rem' }}>
            {t.readyForReaction}
          </h2>
          <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.5 }}>
            {formatText(t.reactionInstructions, { total: TOTAL_ROUNDS })}
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={handleStartTest}
          >
            {t.startRounds}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handlePadPress}
          style={{
            flex: 1,
            width: '100%',
            borderRadius: '18px',
            backgroundColor: padBackground,
            border: padBorder,
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.12s ease, border-color 0.12s ease',
          }}
        >
          <span style={{ fontSize: '1.65rem', fontWeight: 800 }}>
            {statusTitle}
          </span>
          <span
            style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.4 }}
          >
            {statusSubtitle}
          </span>
        </button>
      )}
      {phase !== 'intro' && samples.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            fontSize: '0.8rem',
            color: '#94a3b8',
            paddingTop: '2px',
          }}
        >
          {samples.map((ms, index) => (
            <span
              key={`${index}-${ms}`}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(148, 163, 184, 0.12)',
                color: '#e2e8f0',
                fontWeight: 600,
              }}
            >
              #{index + 1}: {ms} ms
            </span>
          ))}
        </div>
      )}
    </section>
  );
}