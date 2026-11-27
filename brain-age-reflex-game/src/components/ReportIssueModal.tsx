import { useMemo, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  formatReportTemplate,
  getIssueReportTranslations,
  type AppLocale,
} from '../i18n/translations';
import type { GameLevelConfig, MiniGameId } from '../types/levels';

export interface ReportIssueModalProps {
  open: boolean;
  locale: AppLocale;
  view: string;
  selectedGame: MiniGameId | null;
  activeLevel: GameLevelConfig | null;
  supportEmail?: string;
  onClose: () => void;
}

export function ReportIssueModal({
  open,
  locale,
  view,
  selectedGame,
  activeLevel,
  supportEmail = '',
  onClose,
}: ReportIssueModalProps) {
  const [description, setDescription] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const rt = useMemo(() => getIssueReportTranslations(locale), [locale]);

  const reportText = useMemo(() => {
    const platform = Capacitor.isNativePlatform()
      ? Capacitor.getPlatform()
      : 'web';

    const levelInfo = activeLevel
      ? formatReportTemplate(rt.reportIssueLevelFormat, {
          game: activeLevel.gameId,
          level: activeLevel.levelNumber,
        })
      : selectedGame ?? rt.reportIssueNone;

    return [
      rt.reportIssueHeader,
      `${rt.reportIssueMetaLocale}: ${locale}`,
      `${rt.reportIssueMetaPlatform}: ${platform}`,
      `${rt.reportIssueMetaView}: ${view}`,
      `${rt.reportIssueMetaContext}: ${levelInfo}`,
      `${rt.reportIssueMetaTimestamp}: ${new Date().toISOString()}`,
      '',
      `${rt.reportIssueDescriptionLabel}:`,
      description.trim() || rt.reportIssueNoDescription,
    ].join('\n');
  }, [rt, locale, view, selectedGame, activeLevel, description]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleMailto = () => {
    if (!supportEmail) return;
    const subject = encodeURIComponent(`${rt.reportIssueTitle} [${view}]`);
    const body = encodeURIComponent(reportText);
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={rt.reportIssueTitle}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.78)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 50,
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '18px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
            {rt.reportIssueTitle}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={rt.reportIssueCloseButton}
            title={rt.reportIssueCloseButton}
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

        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={rt.reportIssueDescriptionPlaceholder}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            padding: '10px 12px',
            fontSize: '0.9rem',
            resize: 'vertical',
          }}
        />

        <pre
          style={{
            margin: 0,
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(148, 163, 184, 0.14)',
            color: '#94a3b8',
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {reportText}
        </pre>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleCopy}
            style={{ flex: 1 }}
          >
            {copied ? rt.reportIssueCopiedButton : rt.reportIssueCopyButton}
          </button>

          {supportEmail && (
            <button
              type="button"
              onClick={handleMailto}
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
              {rt.reportIssueEmailButton}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}