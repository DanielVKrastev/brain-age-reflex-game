import { useState } from 'react';
import type { NormalizedScores, SessionMetrics } from '../types/game';

interface ResultCardProps {
  scores: NormalizedScores;
  metrics: SessionMetrics;
  onPlayAgain: () => void;
}

// Build a compact shareable summary text for social apps and messaging
function buildShareText(scores: NormalizedScores, metrics: SessionMetrics): string {
  return [
    `Мозъчна възраст: ${scores.brainAge} г. (${scores.title})`,
    `Общ индекс: ${scores.overallScore}/100`,
    `Реакция: ${metrics.reaction.medianMs} ms (${scores.reactionScore})`,
    `Памет: ${Math.round(metrics.memory.accuracy * 100)}% (${scores.memoryScore})`,
    `Числа: ${metrics.numberHunt.totalSeconds} s (${scores.numberHuntScore})`,
    `Струп: ${Math.round(metrics.stroop.accuracy * 100)}% (${scores.stroopScore})`,
  ].join('\n');
}

export function ResultCard({ scores, metrics, onPlayAgain }: ResultCardProps) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleShare = async () => {
    const shareText = buildShareText(scores, metrics);

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Brain Age & Reflex',
          text: shareText,
        });
        setShareStatus('Споделено!');
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setShareStatus('Резултатът е копиран!');
        return;
      }

      setShareStatus('Копирането не се поддържа в този браузър.');
    } catch {
      // User cancelled share sheet or clipboard permission was denied
      setShareStatus('Споделянето е отменено.');
    }
  };

  const breakdownRows = [
    {
      label: 'Скорост на реакция',
      raw: `${metrics.reaction.medianMs} ms`,
      score: scores.reactionScore,
    },
    {
      label: 'Визуална памет',
      raw: `${Math.round(metrics.memory.accuracy * 100)}% · ${metrics.memory.avgRoundSeconds} s`,
      score: scores.memoryScore,
    },
    {
      label: 'Търсене на числа',
      raw: `${metrics.numberHunt.totalSeconds} s`,
      score: scores.numberHuntScore,
    },
    {
      label: 'Ефект на Струп',
      raw: `${Math.round(metrics.stroop.accuracy * 100)}% · ${metrics.stroop.avgAnswerMs} ms`,
      score: scores.stroopScore,
    },
  ];

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '6px',
          padding: '20px 16px',
        }}
      >
        <span style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700 }}>
          ОЦЕНКА НА СЕСИЯТА · {scores.title.toUpperCase()}
        </span>
        <div style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 1.05, color: '#34d399' }}>
          {scores.brainAge} г.
        </div>
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Мозъчна възраст · Общ индекс <strong>{scores.overallScore} / 100</strong>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {breakdownRows.map((row) => (
          <div
            key={row.label}
            className="card"
            style={{
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{row.label}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{row.raw}</div>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#38bdf8' }}>
              {row.score}
            </span>
          </div>
        ))}
      </div>

      {shareStatus && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#6ee7b7',
          }}
        >
          {shareStatus}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
        <button type="button" className="btn-secondary" onClick={handleShare}>
          Сподели резултата
        </button>
        <button type="button" className="btn-primary" onClick={onPlayAgain}>
          Нов тест
        </button>
      </div>
    </section>
  );
}