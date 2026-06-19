// Glossary — global financial-term reference (no domain filtering).
//   • Standalone at /glossary → neutral cosmic theme.
//   • Per-domain at /gaming/glossary etc. → same global terms, themed to that
//     domain via useTheme().
// Search + pagination into "sets" of SET_SIZE keep the list digestible.

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, ArrowRight, Search, X } from 'lucide-react';
import { GLOSSARY_TERMS, GLOSSARY_DOMAIN_COLORS } from '../data/glossaryTerms';
import { useTheme } from '../context/ThemeContext';
import GlossaryModal from '../components/GlossaryModal';

const NEUTRAL_ACCENT = '#a78bfa';
const DIFF_COLOR = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };
const SET_SIZE = 20;

export default function Glossary() {
  const navigate = useNavigate();
  const theme = useTheme(); // normalized domain theme when inside a layout, else null

  // Resolve palette: domain theme when available, neutral cosmic otherwise.
  const accent      = theme?.accent       || NEUTRAL_ACCENT;
  const surface     = theme?.surface      || 'rgba(255,255,255,0.03)';
  const border      = theme?.border       || 'rgba(255,255,255,0.08)';
  const textPrimary = theme?.textPrimary  || '#ffffff';
  const textMuted   = theme?.textMuted    || theme?.textSecondary || 'rgba(255,255,255,0.55)';
  const fontHeading = theme?.fonts?.heading || "'Inter', sans-serif";
  const fontBody    = theme?.fonts?.body    || "'Inter', sans-serif";
  // Standalone paints its own cosmic backdrop; inside a layout we stay
  // transparent so the domain background shows through.
  const pageBg = theme ? 'transparent' : '#0b0b14';

  const [query, setQuery]     = useState('');
  const [active, setActive]   = useState(null);
  const [currentSet, setSet]  = useState(1);

  // Global financial-term glossary (no domain filtering).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY_TERMS
      .filter((t) => t.domain === 'global')
      .filter((t) => !q || t.term.toLowerCase().includes(q) || t.short.toLowerCase().includes(q) || t.long.toLowerCase().includes(q))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [query]);

  const totalSets = Math.max(1, Math.ceil(filtered.length / SET_SIZE));
  const pageSet   = Math.min(currentSet, totalSets);
  const pageTerms = filtered.slice((pageSet - 1) * SET_SIZE, pageSet * SET_SIZE);

  // Reset to the first set whenever the search changes.
  useEffect(() => { setSet(1); }, [query]);

  const title = 'Glossary';

  return (
    <div style={{ minHeight: theme ? 'auto' : '100vh', background: pageBg, color: textPrimary }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(-1)}
            style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={17} color={accent} />
          </motion.button>
          <BookOpen size={22} color={accent} />
          <h1 style={{ fontFamily: fontHeading, fontSize: 24, fontWeight: 800, margin: 0, color: textPrimary }}>{title}</h1>
          <span style={{ fontFamily: fontBody, fontSize: 12, color: textMuted, marginLeft: 'auto' }}>
            Financial terms explained
          </span>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={16} color={textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search terms…"
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px 38px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: `1px solid ${border}`, color: textPrimary, fontFamily: fontBody, fontSize: 14, outline: 'none' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={15} color={textMuted} />
            </button>
          )}
        </div>

        {/* Set indicator */}
        <div style={{ fontFamily: fontBody, fontSize: 12, color: textMuted, marginBottom: 12 }}>
          Set {pageSet} of {totalSets} • {filtered.length} term{filtered.length === 1 ? '' : 's'}
        </div>

        {/* List */}
        {pageTerms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', fontFamily: fontBody, color: textMuted }}>
            No terms match. Try a different search.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pageTerms.map((t, i) => {
              const C = GLOSSARY_DOMAIN_COLORS[t.domain] || accent;
              return (
                <motion.button key={t.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.015, 0.3) }}
                  onClick={() => setActive(t)}
                  style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 12, background: surface, borderTop: `1px solid ${border}`, borderRight: `1px solid ${border}`, borderBottom: `1px solid ${border}`, borderLeft: `3px solid ${C}`, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: fontHeading, fontSize: 15, fontWeight: 700, color: textPrimary }}>{t.term}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C, background: `${C}1f`, padding: '2px 7px', borderRadius: 99 }}>{t.domain}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: DIFF_COLOR[t.difficulty] }}>{t.difficulty}</span>
                  </div>
                  <p style={{ fontFamily: fontBody, fontSize: 13, color: textMuted, margin: 0, lineHeight: 1.5 }}>{t.short}</p>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Set navigation */}
        {totalSets > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 22 }}>
            <button
              onClick={() => setSet((s) => Math.max(1, s - 1))}
              disabled={pageSet <= 1}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 8, border: `1px solid ${border}`, background: 'transparent', color: pageSet <= 1 ? textMuted : textPrimary, cursor: pageSet <= 1 ? 'not-allowed' : 'pointer', opacity: pageSet <= 1 ? 0.5 : 1, fontFamily: fontBody, fontSize: 13, fontWeight: 600 }}>
              <ArrowLeft size={15} /> Previous
            </button>
            <button
              onClick={() => setSet((s) => Math.min(totalSets, s + 1))}
              disabled={pageSet >= totalSets}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 8, border: 'none', background: accent, color: '#000', cursor: pageSet >= totalSets ? 'not-allowed' : 'pointer', opacity: pageSet >= totalSets ? 0.5 : 1, fontFamily: fontHeading, fontSize: 13, fontWeight: 700 }}>
              Next Set <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      {active && <GlossaryModal term={active} onClose={() => setActive(null)} />}
    </div>
  );
}
