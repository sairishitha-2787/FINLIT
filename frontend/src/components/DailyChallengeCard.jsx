// DailyChallengeCard — "The Daily Cipher" (per-domain)
// Each domain dashboard renders its OWN daily challenge, themed to match that
// UI. Pass `domain` (scopes the challenge) and a `theme` object so the card
// adopts the host domain's surface, text, and fonts.

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useDailyChallenge } from '../hooks/useDailyChallenge';

// hours until local midnight
function hoursToMidnight() {
  const now = new Date();
  const mid = new Date(now); mid.setHours(24, 0, 0, 0);
  return Math.max(1, Math.round((mid - now) / 3600000));
}

const DEFAULT_THEME = {
  surface:     'rgba(255,255,255,0.04)',
  border:      'rgba(255,255,255,0.08)',
  textPrimary: '#ffffff',
  textMuted:   'rgba(255,255,255,0.5)',
  overlayBg:   'rgba(10,10,12,0.92)',
  radius:      16,
  fontHeading: "'Inter', sans-serif",
  fontBody:    "'Inter', sans-serif",
};

export default function DailyChallengeCard({ domain, awardXP, accent, theme: themeProp }) {
  const navigate = useNavigate();
  const t = { ...DEFAULT_THEME, ...(themeProp || {}) };
  const C = accent || '#a78bfa';

  const {
    challenge, streak, loading, justCompleted,
    learnPath, learnState, baseXP, streakBonus,
  } = useDailyChallenge({ domain, awardXP });

  const hrs = useMemo(hoursToMidnight, [challenge?.completed]);

  if (loading || !challenge) {
    return (
      <div style={{
        borderRadius: t.radius, padding: 18, minHeight: 110,
        background: t.surface,
        borderTop: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}`,
        borderBottom: `1px solid ${t.border}`, borderLeft: `3px solid ${C}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          style={{ width: 22, height: 22, borderRadius: '50%', border: `3px solid ${t.border}`, borderTopColor: C }} />
      </div>
    );
  }

  const done = challenge.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: t.radius, padding: '18px 20px',
        background: t.surface,
        borderTop: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}`,
        borderBottom: `1px solid ${t.border}`, borderLeft: `3px solid ${C}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      {/* accent glow */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%',
        background: `radial-gradient(circle, ${C}2e 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, position: 'relative' }}>
        <span style={{ fontFamily: t.fontBody, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C }}>
          The Daily Cipher {done && '✓'}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: t.fontBody, fontWeight: 700,
          fontSize: 13, color: streak > 0 ? '#fb923c' : t.textMuted }}>
          <Flame size={15} fill={streak > 0 ? '#fb923c' : 'none'} color={streak > 0 ? '#fb923c' : t.textMuted} strokeWidth={streak > 0 ? 0 : 1.6} />
          {streak} day{streak === 1 ? '' : 's'}
        </span>
      </div>

      {done ? (
        /* ── Completed ── */
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <CheckCircle2 size={22} color={C} strokeWidth={2} style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: t.fontHeading, fontSize: 18, color: t.textPrimary, lineHeight: 1.1 }}>
              {challenge.topicName}
            </span>
          </div>
          <p style={{ fontFamily: t.fontBody, fontSize: 13, color: t.textMuted, margin: '0 0 4px' }}>
            Completed! You earned <b style={{ color: C }}>+{challenge.xpEarned} XP</b>.
          </p>
          <p style={{ fontFamily: t.fontBody, fontSize: 12, color: t.textMuted, margin: 0, opacity: 0.85 }}>
            Next cipher in {hrs} hour{hrs === 1 ? '' : 's'} · keep your {streak}-day streak alive 🔥
          </p>
        </div>
      ) : (
        /* ── Active ── */
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: t.fontBody, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: t.textMuted, marginBottom: 4 }}>
            Today's Challenge
          </div>
          <div style={{ fontFamily: t.fontHeading, fontSize: 20, color: t.textPrimary, lineHeight: 1.15, marginBottom: 12 }}>
            {challenge.topicName}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: t.fontBody, fontSize: 13, color: t.textMuted }}>
              <Zap size={15} color={C} fill={C} />
              <b style={{ color: t.textPrimary }}>+{baseXP} XP</b>
              {streakBonus > 0 && <span style={{ color: C }}>(+{streakBonus} streak bonus)</span>}
            </div>
            <motion.button
              onClick={() => learnPath && navigate(learnPath, { state: learnState })}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: C, color: '#0a0a0a',
                padding: '9px 16px', borderRadius: Math.min(t.radius, 12), border: 'none', cursor: 'pointer',
                fontFamily: t.fontHeading, fontSize: 13, fontWeight: 700, letterSpacing: '0.04em',
                boxShadow: `0 4px 18px ${C}55`,
              }}
            >
              Start Challenge <ArrowRight size={15} strokeWidth={2.5} />
            </motion.button>
          </div>

          {streak > 0 && (
            <p style={{ fontFamily: t.fontBody, fontSize: 11, color: t.textMuted, margin: '10px 0 0', opacity: 0.8 }}>
              Complete within {hrs}h to keep your {streak}-day streak alive.
            </p>
          )}
        </div>
      )}

      {/* completion toast */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4,
              background: t.overlayBg, borderRadius: t.radius, zIndex: 5,
            }}
          >
            <Sparkles size={28} color={C} />
            <div style={{ fontFamily: t.fontHeading, fontSize: 18, color: t.textPrimary }}>🔥 {justCompleted.streak}-day streak!</div>
            <div style={{ fontFamily: t.fontBody, fontSize: 13, color: C, fontWeight: 700 }}>+{justCompleted.xp} XP earned</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
