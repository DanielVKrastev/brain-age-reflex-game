import { useState } from 'react';
import type {
  NormalizedScores,
  SessionHistoryEntry,
  SessionMetrics,
} from '../types/game';
import { formatHistoryDate } from '../utils/historyStorage';

interface ResultCardProps {
  scores: NormalizedScores;
  metrics: SessionMetrics;
  history: SessionHistoryEntry[];
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

export function ResultCard({
  scores,
  metrics,
  history,
  onPlayAgain,
}: ResultCardProps) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  // history[0] is the just-saved session; history[1] is the previous session
  const previousSession = history.length > 1 ? history[1] : null;
  const ageDelta = previousSession
    ? scores.brainAge - previousSession.brainAge
    : null;

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
    <section style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
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
        <span style={{ color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700 }}>
          ОЦЕНКА НА СЕСИЯТА · {scores.title.toUpperCase()}
        </span>
        <div style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1.05, color: '#34d399' }}>
          {scores.brainAge} г.
        </div>
        <span style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
          Мозъчна възраст · Общ индекс <strong>{scores.overallScore} / 100</strong>
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
            {ageDelta < 0 && `${Math.abs(ageDelta)} г. по-млад от предишния опит`}
            {ageDelta > 0 && `+${ageDelta} г. спрямо предишния опит`}
            {ageDelta === 0 && 'Същият резултат като предишния опит'}
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
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{row.label}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.76rem' }}>{row.raw}</div>
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#38bdf8' }}>
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
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>
            ПОСЛЕДНИ ОПИТИ ({history.length})
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
                <strong style={{ color: '#f8fafc' }}>{entry.brainAge} г.</strong>{' '}
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