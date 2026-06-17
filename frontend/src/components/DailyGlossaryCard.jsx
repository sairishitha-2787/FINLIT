// DailyGlossaryCard — "Word of the Day" glossary teaser for dashboards.
// Random term per session, dismissible for the day, gated by a settings pref.
// Themed per host domain via the `theme` prop; "Learn More" opens GlossaryModal.

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ArrowRight } from 'lucide-react';
import { GLOSSARY_TERMS, GLOSSARY_DOMAIN_COLORS } from '../data/glossaryTerms';
import { useTheme } from '../context/ThemeContext';
import GlossaryModal from './GlossaryModal';

const PREF_KEY      = 'finlit_daily_glossary_enabled';
const DISMISS_KEY   = 'finlit_glossary_dismissed_date';
const DIFF_COLOR    = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };

const todayStr = () => new Date().toISOString().slice(0, 10);

// ── Preference (localStorage, default ON) — shared with the settings toggle ──
export function loadGlossaryCardPref() {
  try { const v = localStorage.getItem(PREF_KEY); return v === null ? true : v === 'true'; } catch { return true; }
}
export function saveGlossaryCardPref(on) {
  try { localStorage.setItem(PREF_KEY, on ? 'true' : 'false'); } catch { /* ignore */ }
}
function dismissedToday() {
  try { return localStorage.getItem(DISMISS_KEY) === todayStr(); } catch { return false; }
}

const DEFAULT_THEME = {
  surface: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)',
  textPrimary: '#fff', textMuted: 'rgba(255,255,255,0.55)',
  radius: 16, fontHeading: "'Inter', sans-serif", fontBody: "'Inter', sans-serif",
};

// Maps the normalized useTheme() shape ({ fonts:{heading,body}, … }) onto this
// component's flat theme shape ({ fontHeading, fontBody, … }).
function fromContext(ctx) {
  if (!ctx) return null;
  return {
    surface:     ctx.surface,
    border:      ctx.border,
    textPrimary: ctx.textPrimary,
    textMuted:   ctx.textMuted || ctx.textSecondary,
    radius:      ctx.radius,
    fontHeading: ctx.fonts?.heading,
    fontBody:    ctx.fonts?.body,
  };
}

// `accent` / `theme` props override the context — for shared pages that render
// outside a ThemeProvider, or callers that want a custom look. Inside a domain
// layout, just render <DailyGlossaryCard /> and it auto-themes via useTheme().
export default function DailyGlossaryCard({ accent: accentProp, theme: themeProp }) {
  const ctx = useTheme();
  const t = { ...DEFAULT_THEME, ...(fromContext(ctx) || {}), ...(themeProp || {}) };
  const C = accentProp || ctx?.accent || '#a78bfa';

  // pick a random term once per mount (new each session/reload)
  const term = useMemo(() => GLOSSARY_TERMS[Math.floor(Math.random() * GLOSSARY_TERMS.length)], []);
  const [hidden, setHidden]   = useState(!loadGlossaryCardPref() || dismissedToday());
  const [showModal, setShowModal] = useState(false);

  if (hidden || !term) return null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, todayStr()); } catch { /* ignore */ }
    setHidden(true);
  };
  const termColor = GLOSSARY_DOMAIN_COLORS[term.domain] || C;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'relative', borderRadius: t.radius, padding: '16px 18px',
            background: t.surface,
            // Side-specific shorthands only (mixing `border` + `borderLeft`
            // triggers React's style-conflict warning on rerender).
            borderTop: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}`,
            borderBottom: `1px solid ${t.border}`, borderLeft: `3px solid ${C}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.22)',
          }}
        >
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <BookOpen size={13} color={C} />
            <span style={{ fontFamily: t.fontBody, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C }}>
              Today's Term
            </span>
            <button onClick={dismiss} aria-label="Dismiss"
              style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={14} color={t.textMuted} />
            </button>
          </div>

          {/* term + badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ fontFamily: t.fontHeading, fontSize: 19, color: t.textPrimary, lineHeight: 1.1 }}>{term.term}</span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: termColor, background: `${termColor}1f`, border: `1px solid ${termColor}50`, padding: '2px 7px', borderRadius: 99 }}>{term.domain}</span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: DIFF_COLOR[term.difficulty] }}>{term.difficulty}</span>
          </div>

          {/* short def */}
          <p style={{ fontFamily: t.fontBody, fontSize: 13, color: t.textMuted, margin: '0 0 12px', lineHeight: 1.55 }}>{term.short}</p>

          {/* learn more */}
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: t.fontHeading, fontSize: 13, fontWeight: 700, color: C }}>
            Learn More <ArrowRight size={14} strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {showModal && <GlossaryModal term={term} onClose={() => setShowModal(false)} />}
    </>
  );
}
