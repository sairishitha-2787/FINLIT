// Toast — a single ephemeral notification. Presentational only; the queue,
// timers, and positioning live in ToastProvider. Domain-aware: each toast
// carries a `theme` snapshot (the normalized useTheme() shape, captured when the
// toast was fired) so it matches whatever domain the user was in. `theme` is
// null for toasts fired outside a domain (onboarding/login) → neutral styling.

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, Sparkles, X } from 'lucide-react';

// Universal status colors (error/warning/info don't change per domain).
const STATUS = {
  error:   '#EF4444',
  warning: '#F59E0B',
  info:    '#3B82F6',
};
const ICON = {
  success:     CheckCircle2,
  error:       XCircle,
  warning:     AlertTriangle,
  info:        Info,
  celebration: Sparkles,
};

const NEUTRAL = {
  surface:     'rgba(22,22,30,0.97)',
  border:      'rgba(255,255,255,0.12)',
  textPrimary: '#ffffff',
  textMuted:   'rgba(255,255,255,0.55)',
  accent:      '#a78bfa',
  fonts:       { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
};

export default function Toast({ type = 'info', message, theme, action, onClose, duration = 3000 }) {
  const t = theme || NEUTRAL;
  // success + celebration follow the domain accent; the rest use status colors.
  const accent = STATUS[type] || t.accent || NEUTRAL.accent;
  const Icon = ICON[type] || Info;
  const celebrate = type === 'celebration';

  useEffect(() => {
    if (!duration) return undefined;
    const id = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      role="status"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        width: '100%', maxWidth: 380, padding: '12px 14px',
        borderRadius: 12,
        background: t.surface || NEUTRAL.surface,
        // Side-specific shorthands only — avoid mixing `border` + `borderLeft`.
        borderTop: `1px solid ${t.border || NEUTRAL.border}`,
        borderRight: `1px solid ${t.border || NEUTRAL.border}`,
        borderBottom: `1px solid ${t.border || NEUTRAL.border}`,
        borderLeft: `4px solid ${accent}`,
        boxShadow: celebrate
          ? `0 8px 32px rgba(0,0,0,0.35), 0 0 18px ${accent}66`
          : '0 8px 28px rgba(0,0,0,0.30)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        pointerEvents: 'auto',
      }}
    >
      <motion.span
        initial={celebrate ? { scale: 0.4, rotate: -20 } : false}
        animate={celebrate ? { scale: 1, rotate: 0 } : {}}
        transition={{ type: 'spring', stiffness: 320, damping: 14 }}
        style={{ flexShrink: 0, marginTop: 1, color: accent, display: 'flex' }}
      >
        <Icon size={18} strokeWidth={2.4} />
      </motion.span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: t.fonts?.body || NEUTRAL.fonts.body,
          fontSize: 13.5, fontWeight: 600, lineHeight: 1.45,
          color: t.textPrimary || NEUTRAL.textPrimary,
          wordBreak: 'break-word',
        }}>
          {message}
        </div>
        {action && (
          <button
            onClick={() => { action.onClick?.(); onClose?.(); }}
            style={{
              marginTop: 6, padding: 0, background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: t.fonts?.body || NEUTRAL.fonts.body,
              fontSize: 12.5, fontWeight: 700, color: accent,
            }}
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onClose?.()}
        aria-label="Dismiss"
        style={{
          flexShrink: 0, width: 22, height: 22, borderRadius: 6,
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <X size={14} color={t.textMuted || NEUTRAL.textMuted} />
      </button>
    </motion.div>
  );
}
