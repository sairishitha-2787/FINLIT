// SuggestedForReview — "Suggested for Review" (spaced repetition).
// Drop into any playbook (section) or dashboard (compact card). Themed per
// domain. Renders nothing when SR is disabled or there's nothing to review.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';

const DEFAULT_THEME = {
  surface:     'rgba(255,255,255,0.04)',
  border:      'rgba(255,255,255,0.10)',
  textPrimary: '#ffffff',
  textMuted:   'rgba(255,255,255,0.5)',
  radius:      14,
  fontHeading: "'Inter', sans-serif",
  fontBody:    "'Inter', sans-serif",
};

const scoreColor = (p) => (p >= 80 ? '#22C55E' : p >= 60 ? '#FBBF24' : '#EF4444');

export default function SuggestedForReview({
  domain, accent = '#a78bfa', theme: themeProp,
  limit = 5, compact = false, title = 'Suggested for Review',
}) {
  const navigate = useNavigate();
  const t = { ...DEFAULT_THEME, ...(themeProp || {}) };
  const C = accent;
  const { enabled, suggestions, loading } = useSpacedRepetition({ domain, limit: compact ? 1 : limit });

  if (!enabled || loading || suggestions.length === 0) return null;

  const goReview = (s) => navigate(s.learnPath, { state: s.learnState });

  // ── Compact (dashboard) — single top suggestion ──
  if (compact) {
    const s = suggestions[0];
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: t.radius, padding: '16px 18px',
          background: t.surface, border: `1px solid ${t.border}`, borderLeft: `3px solid ${s.urgency.color}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Sparkles size={13} color={C} />
          <span style={{ fontFamily: t.fontBody, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C }}>
            Suggested for Review
          </span>
        </div>
        <div style={{ fontFamily: t.fontHeading, fontSize: 18, color: t.textPrimary, lineHeight: 1.15, marginBottom: 8 }}>{s.topic}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: t.fontBody, fontSize: 12, color: t.textMuted }}>
            <span style={{ color: scoreColor(s.lastScore), fontWeight: 700 }}>Last: {s.lastScore}%</span>
            · {s.daysSince === 0 ? 'today' : `${s.daysSince}d ago`}
            · <span style={{ color: s.urgency.color }}>{s.urgency.icon} {s.urgency.label}</span>
          </span>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => goReview(s)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: C, color: '#0a0a0a', padding: '8px 14px', borderRadius: Math.min(t.radius, 10), border: 'none', cursor: 'pointer', fontFamily: t.fontHeading, fontSize: 13, fontWeight: 700 }}>
            Review <ArrowRight size={14} strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ── Section (playbook) — top N cards ──
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Sparkles size={15} color={C} />
        <div>
          <div style={{ fontFamily: t.fontHeading, fontSize: 16, color: t.textPrimary, lineHeight: 1 }}>{title}</div>
          <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.textMuted, marginTop: 2 }}>Topics you could improve, based on past attempts.</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {suggestions.map((s, i) => (
          <motion.div key={s.key}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{
              flex: '0 0 220px', minWidth: 220,
              borderRadius: t.radius, padding: '14px 16px',
              background: t.surface, border: `1px solid ${t.border}`, borderLeft: `3px solid ${s.urgency.color}`,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, marginBottom: 8,
              background: `${s.urgency.color}1f`, border: `1px solid ${s.urgency.color}55`,
              fontFamily: t.fontBody, fontSize: 10, fontWeight: 700, color: s.urgency.color }}>
              {s.urgency.icon} {s.urgency.label}
            </span>
            <div style={{ fontFamily: t.fontHeading, fontSize: 16, color: t.textPrimary, lineHeight: 1.15, marginBottom: 6 }}>{s.topic}</div>
            <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.textMuted, marginBottom: 12 }}>
              <span style={{ color: scoreColor(s.lastScore), fontWeight: 700 }}>Last: {s.lastScore}%</span>
              {' · '}{s.daysSince === 0 ? 'today' : `${s.daysSince}d ago`}{' · '}{s.difficulty}
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => goReview(s)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: `${C}18`, color: C, padding: '9px', borderRadius: Math.min(t.radius, 10), border: `1px solid ${C}45`, cursor: 'pointer', fontFamily: t.fontHeading, fontSize: 13, fontWeight: 700 }}>
              <RotateCcw size={13} /> Review
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
