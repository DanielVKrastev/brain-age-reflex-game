import { useState } from 'react';
import type { NormalizedScores, SessionMetrics } from '../types/game';

interface ResultCardProps {
  scores: NormalizedScores;
  metrics: SessionMetrics;
  onPlayAgain: () => void;
}

function buildShareText(scores: NormalizedScores, metrics: SessionMetrics): string {
  return [
    `Мозъчна възраст: ${scores.brainAge} г. (${scores.title})`,
    `Общ индекс: ${scores.overallScore}/100`,
    `Реакция: ${metrics.reaction.medianMs} ms (${scores.reactionScore})`,
    `Памет: ${Math.round(metrics.memory.accuracy * 100)}% (${scores.memoryScore})`,
    `Числа: ${metrics.numberHunt.totalSeconds} s (${scores.numberHuntScore})`,
    `Струп: ${Math.round(metrics.stroop.accuracy * 100)}% (${scores.stroopScore})`,
    `Математика: ${Math.round(metrics.mathBlitz.accuracy * 100)}% (${scores.mathBlitzScore})`,
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
    {
      label: 'Бърза математика',
      raw: `${Math.round(metrics.mathBlitz.accuracy * 100)}% · ${metrics.mathBlitz.avgAnswerMs} ms`,
      score: scores.mathBlitzScore,
    },
  ];

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '4px',
          padding: '16px 14px',
        }}
      >
        <span style={{ color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700 }}>
          ОЦЕНКА НА СЕСИЯТА · {scores.title.toUpperCase()}
        </span>
        <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.05, color: '#34d399' }}>
          {scores.brainAge} г.
        </div>
        <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
          Мозъчна възраст · Общ индекс <strong>{scores.overallScore} / 100</strong>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {breakdownRows.map((row) => (
          <div
            key={row.label}
            className="card"
            style={{
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{row.label}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{row.raw}</div>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#38bdf8' }}>
              {row.score}
            </span>
          </div>
        ))}
      </div>

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
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