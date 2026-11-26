import { getTranslations, type AppLocale } from '../i18n/translations';

export type HelpContextKey =
  | 'home'
  | 'reaction'
  | 'memory'
  | 'number-hunt'
  | 'stroop'
  | 'math-blitz';

interface HelpModalProps {
  open: boolean;
  locale: AppLocale;
  context: HelpContextKey;
  onClose: () => void;
}

export function HelpModal({
  open,
  locale,
  context,
  onClose,
}: HelpModalProps) {
  if (!open) return null;

  const t = getTranslations(locale);

  const titleByContext: Record<HelpContextKey, string> = {
    home: t.helpHomeTitle,
    reaction: t.reactionTitle,
    memory: t.memoryTitle,
    'number-hunt': t.numberHuntTitle,
    stroop: t.stroopTitle,
    'math-blitz': t.mathBlitzTitle,
  };

  const bodyByContext: Record<HelpContextKey, string> = {
    home: t.helpHomeBody,
    reaction: t.helpReactionBody,
    memory: t.helpMemoryBody,
    'number-hunt': t.helpNumberHuntBody,
    stroop: t.helpStroopBody,
    'math-blitz': t.helpMathBlitzBody,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(2, 6, 23, 0.78)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          border: '1px solid rgba(56, 189, 248, 0.35)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <h3
            id="help-modal-title"
            style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}
          >
            {titleByContext[context]}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.helpClose}
            style={{
              background: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              color: '#cbd5e1',
              borderRadius: '10px',
              width: '32px',
              height: '32px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <p
          style={{
            margin: 0,
            color: '#cbd5e1',
            fontSize: '0.94rem',
            lineHeight: 1.5,
          }}
        >
          {bodyByContext[context]}
        </p>

        {context === 'stroop' && (
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {t.helpStroopExampleLabel}
            </span>
            <span
              style={{
                fontSize: '1.65rem',
                fontWeight: 900,
                color: '#ef4444',
                letterSpacing: '0.04em',
              }}
            >
              {t.colorBlue}
            </span>
            <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
              {t.helpStroopExampleHint}
            </span>
          </div>
        )}

        <button type="button" className="btn-primary" onClick={onClose}>
          {t.helpClose}
        </button>
      </div>
    </div>
  );
}