import { useEffect, useMemo, useRef, useState } from 'react';
import {
  formatReportTemplate,
  getShareCardTranslations,
  resolveShareCardTier,
  type AppLocale,
} from '../i18n/translations';
import { downloadPngCard, sharePngCard } from '../utils/shareCardFile';

export interface SessionScoreSummary {
  brainAge: number;
  overallScore: number;
  reactionScore?: number;
  memoryScore?: number;
  numberHuntScore?: number;
  stroopScore?: number;
  mathBlitzScore?: number;
}

interface ResultShareCardModalProps {
  open: boolean;
  locale: AppLocale;
  scores: SessionScoreSummary;
  onClose: () => void;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function ResultShareCardModal({
  open,
  locale,
  scores,
  onClose,
}: ResultShareCardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [sharedStatus, setSharedStatus] = useState<string>('');

  const st = useMemo(() => getShareCardTranslations(locale), [locale]);
  const tier = useMemo(
    () => resolveShareCardTier(scores.overallScore, st),
    [scores.overallScore, st]
  );

  useEffect(() => {
    if (!open) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Тъмен градиентен фон в стил трейдинг PnL картичка
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#070b14');
    bgGrad.addColorStop(0.55, '#0f172a');
    bgGrad.addColorStop(1, '#111827');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Декоративни светещи кръгове
    const glowTop = ctx.createRadialGradient(860, 220, 20, 860, 220, 420);
    glowTop.addColorStop(0, 'rgba(56, 189, 248, 0.24)');
    glowTop.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = glowTop;
    ctx.fillRect(0, 0, width, height);

    const glowBottom = ctx.createRadialGradient(220, 1120, 20, 220, 1120, 380);
    glowBottom.addColorStop(0, 'rgba(52, 211, 153, 0.18)');
    glowBottom.addColorStop(1, 'rgba(52, 211, 153, 0)');
    ctx.fillStyle = glowBottom;
    ctx.fillRect(0, 0, width, height);

    // Рамка на картичката
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 44, 44, width - 88, height - 88, 32);
    ctx.stroke();

    // Горна лента / бранд + дата
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 28px system-ui, -apple-system, sans-serif';
    ctx.fillText(st.shareCardBrand, 96, 128);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(
      new Date().toLocaleDateString(st.shareCardDateLocale),
      width - 96,
      128
    );
    ctx.textAlign = 'left';

    // Заглавие + бадж за ранг вдясно
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '700 38px system-ui, -apple-system, sans-serif';
    ctx.fillText(st.shareCardHeading, 96, 240);

    const badgeW = 310;
    const badgeH = 84;
    const badgeX = width - 96 - badgeW;
    const badgeY = 188;

    ctx.fillStyle = tier.badgeBg;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 18);
    ctx.fill();

    ctx.strokeStyle = tier.accentColor;
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 18);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 18px system-ui, -apple-system, sans-serif';
    ctx.fillText(
      `${st.shareCardRankLabel} · ${tier.code}`,
      badgeX + 20,
      badgeY + 30
    );

    ctx.fillStyle = tier.accentColor;
    ctx.font = '800 28px system-ui, -apple-system, sans-serif';
    ctx.fillText(tier.label, badgeX + 20, badgeY + 64);

    // Главна метрика (Brain Age)
    ctx.fillStyle = '#34d399';
    ctx.font = '800 160px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${scores.brainAge} ${st.shareCardAgeSuffix}`, 96, 445);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 32px system-ui, -apple-system, sans-serif';
    ctx.fillText(
      formatReportTemplate(st.shareCardOverallScore, {
        score: scores.overallScore,
      }),
      96,
      515
    );

    // Разделителна линия
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(96, 585);
    ctx.lineTo(width - 96, 585);
    ctx.stroke();

    // Показатели по игри
    const rows: Array<{ label: string; value?: number }> = [
      { label: st.shareCardReaction, value: scores.reactionScore },
      { label: st.shareCardMemory, value: scores.memoryScore },
      { label: st.shareCardNumberHunt, value: scores.numberHuntScore },
      { label: st.shareCardStroop, value: scores.stroopScore },
      { label: st.shareCardMathBlitz, value: scores.mathBlitzScore },
    ].filter((r) => typeof r.value === 'number');

    let y = 665;
    for (const row of rows) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 32px system-ui, -apple-system, sans-serif';
      ctx.fillText(row.label, 96, y);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 32px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${row.value}/100`, width - 96, y);
      ctx.textAlign = 'left';

      y += 72;
    }

    // Долен колонтитул
    ctx.fillStyle = '#64748b';
    ctx.font = '500 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(st.shareCardFooter, 96, height - 92);

    const dataUrl = canvas.toDataURL('image/png');
    const rafId = requestAnimationFrame(() => {
      setPreviewUrl(dataUrl);
    });

    return () => cancelAnimationFrame(rafId);
  }, [open, scores, st, tier]);

  if (!open) return null;

  const handleCloseModal = () => {
    setSharedStatus('');
    onClose();
  };

  const fileName = `brain-age-${scores.brainAge}-${tier.code
    .toLowerCase()
    .replaceAll(' ', '-')}.png`;

  const handleDownloadPng = async () => {
    if (!previewUrl) return;
    try {
      const result = await downloadPngCard(previewUrl, fileName);
      if (result === 'downloaded') {
        setSharedStatus(st.shareCardDownloadedStatus);
      }
    } catch {
      setSharedStatus('');
    }
  };

  const handleNativeShare = async () => {
    if (!previewUrl) return;
    try {
      const result = await sharePngCard(
        previewUrl,
        fileName,
        st.shareCardModalTitle
      );
      if (result === 'shared') {
        setSharedStatus(st.shareCardSharedStatus);
      } else if (result === 'downloaded') {
        setSharedStatus(st.shareCardDownloadedStatus);
      }
    } catch {
      setSharedStatus('');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={st.shareCardModalTitle}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.82)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 60,
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '420px',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
            {st.shareCardModalTitle}
          </h3>
          <button
            type="button"
            onClick={handleCloseModal}
            aria-label={st.shareCardCloseButton}
            title={st.shareCardCloseButton}
            style={{
              background: 'transparent',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              color: '#cbd5e1',
              borderRadius: '8px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {previewUrl && (
          <img
            src={previewUrl}
            alt={st.shareCardModalTitle}
            style={{
              width: '100%',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }}
          />
        )}

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleNativeShare}
            style={{ flex: 1 }}
          >
            {st.shareCardShareAction}
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            style={{
              flex: 1,
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#e2e8f0',
              borderRadius: '14px',
              padding: '12px 14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {st.shareCardDownloadAction}
          </button>
        </div>

        {sharedStatus && (
          <span style={{ fontSize: '0.82rem', color: '#34d399' }}>
            {sharedStatus}
          </span>
        )}
      </div>
    </div>
  );
}