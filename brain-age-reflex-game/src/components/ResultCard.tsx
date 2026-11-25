import { useState } from 'react';
import {
  formatText,
  getTranslations,
  type AppLocale,
  type TranslationDictionary,
} from '../i18n/translations';
import type {
  NormalizedScores,
  SessionHistoryEntry,
  SessionMetrics,
} from '../types/game';
import { formatHistoryDate } from '../utils/historyStorage';

interface ResultCardProps {
  locale?: AppLocale;
  scores: NormalizedScores;
  metrics: SessionMetrics;
  history: SessionHistoryEntry[];
  onPlayAgain: () => void;
}

function buildShareText(
  t: TranslationDictionary,
  scores: NormalizedScores,
  metrics: SessionMetrics
): string {
  return [
    `${t.brainAge}: ${scores.brainAge} ${t.yearsShort} (${scores.title})`,
    `${t.overallIndex}: ${scores.overallScore}/100`,
    `${t.reactionTitle}: ${metrics.reaction.medianMs} ms (${scores.reactionScore})`,
    `${t.memoryTitle}: ${Math.round(metrics.memory.accuracy * 100)}% (${scores.memoryScore})`,
    `${t.numberHuntTitle}: ${metrics.numberHunt.totalSeconds} s (${scores.numberHuntScore})`,
    `${t.stroopTitle}: ${Math.round(metrics.stroop.accuracy * 100)}% (${scores.stroopScore})`,
    `${t.mathBlitzTitle}: ${Math.round(metrics.mathBlitz.accuracy * 100)}% (${scores.mathBlitzScore})`,
  ].join('\n');
}

export function ResultCard({
  locale = 'bg',
  scores,
  metrics,
  history,
  onPlayAgain,
}: ResultCardProps) {
  const t = getTranslations(locale);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  // history[0] is the just-saved session; history[1] is the previous session
  const previousSession = history.length > 1 ? history[1] : null;
  const ageDelta = previousSession
    ? scores.brainAge - previousSession.brainAge
    : null;

  const handleShare = async () => {
    const shareText = buildShareText(t, scores, metrics);

    try {
      if (navigator.share) {
        await navigator.share({
          title: t.appTitle,
          text: shareText,
        });
        setShareStatus(t.sharedOk);
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setShareStatus(t.copiedOk);
        return;
      }

      setShareStatus(t.copyNotSupported);
    } catch {
      setShareStatus(t.shareCancelled);
    }
  };

  const breakdownRows = [
    {
      label: t.reactionTitle,
      raw: `${metrics.reaction.medianMs} ms`,
      score: scores.reactionScore,
    },
    {
      label: t.memoryTitle,
      raw: `${Math.round(metrics.memory.accuracy * 100)}% · ${metrics.memory.avgRoundSeconds} s`,
      score: scores.memoryScore,
    },
    {
      label: t.numberHuntTitle,
      raw: `${metrics.numberHunt.totalSeconds} s`,
      score: scores.numberHuntScore,
    },
    {
      label: t.stroopTitle,
      raw: `${Math.round(metrics.stroop.accuracy * 100)}% · ${metrics.stroop.avgAnswerMs} ms`,
      score: scores.stroopScore,
    },
    {
      label: t.mathBlitzTitle,
      raw: `${Math.round(metrics.mathBlitz.accuracy * 100)}% · ${metrics.mathBlitz.avgAnswerMs} ms`,
      score: scores.mathBlitzScore,
    },
  ];

  return (
    <section
      style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}
    >
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '4px',
          padding: '14px',
        }}
      >
        <span
          style={{ color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700 }}
        >
          {t.sessionEvaluation} · {scores.title.toUpperCase()}
        </span>
        <div
          style={{
            fontSize: '2.8rem',
            fontWeight: 900,
            lineHeight: 1.05,
            color: '#34d399',
          }}
        >
          {scores.brainAge} {t.yearsShort}
        </div>
        <span style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
          {t.brainAge} · {t.overallIndex}{' '}
          <strong>{scores.overallScore} / 100</strong>
        </span>

        {ageDelta !== null && (
          <span
            style={{
              marginTop: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color:
                ageDelta < 0 ? '#34d399' : ageDelta > 0 ? '#fbbf24' : '#94a3b8',
            }}
          >
            {ageDelta < 0 &&
              `${Math.abs(ageDelta)} ${t.yearsShort} ${t.betterThanPrevious}`}
            {ageDelta > 0 &&
              `+${ageDelta} ${t.yearsShort} ${t.worseThanPrevious}`}
            {ageDelta === 0 && t.sameAsPrevious}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {breakdownRows.map((row) => (
          <div
            key={row.label}
            className="card"
            style={{
              padding: '9px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                {row.label}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.76rem' }}>
                {row.raw}
              </div>
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: '0.98rem',
                color: '#38bdf8',
              }}
            >
              {row.score}
            </span>
          </div>
        ))}
      </div>

      {history.length > 1 && (
        <div
          className="card"
          style={{
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <span
            style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}
          >
            {formatText('{label} ({count})', {
              label: t.recentAttempts,
              count: history.length,
            })}
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {history.slice(0, 4).map((entry, idx) => (
              <div
                key={entry.id}
                style={{
                  padding: '5px 9px',
                  borderRadius: '10px',
                  backgroundColor:
                    idx === 0
                      ? 'rgba(56, 189, 248, 0.16)'
                      : 'rgba(148, 163, 184, 0.1)',
                  border:
                    idx === 0
                      ? '1px solid rgba(56, 189, 248, 0.45)'
                      : '1px solid transparent',
                  fontSize: '0.78rem',
                }}
              >
                <strong style={{ color: '#f8fafc' }}>
                  {entry.brainAge} {t.yearsShort}
                </strong>{' '}
                <span style={{ color: '#94a3b8' }}>
                  ({formatHistoryDate(entry.playedAt)})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {shareStatus && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.84rem',
            color: '#6ee7b7',
          }}
        >
          {shareStatus}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginTop: 'auto',
        }}
      >
        <button type="button" className="btn-secondary" onClick={handleShare}>
          {t.shareResult}
        </button>
        <button type="button" className="btn-primary" onClick={onPlayAgain}>
          {t.playAgain}
        </button>
      </div>
    </section>
  );
}