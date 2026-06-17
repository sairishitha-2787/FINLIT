// GlossaryModal — reusable term-definition popup.
// Used by the Glossary page and the GlossaryText linkifier. Pass a term object
// (or termId) and onClose. Navigating related terms swaps the active term.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { GLOSSARY_DOMAIN_COLORS, getTermById } from '../data/glossaryTerms';

const DIFF_COLOR = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };

export default function GlossaryModal({ term: termProp, termId, onClose }) {
  const [active, setActive] = useState(termProp || (termId ? getTermById(termId) : null));
  useEffect(() => { if (termProp) setActive(termProp); else if (termId) setActive(getTermById(termId)); }, [termProp, termId]);
  if (!active) return null;

  const C = GLOSSARY_DOMAIN_COLORS[active.domain] || '#a78bfa';
  const related = (active.related || []).map(getTermById).filter(Boolean);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 9500, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      >
        <motion.div
          initial={{ scale: 0.94, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 18 }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 500, maxHeight: '88vh', overflowY: 'auto',
            background: '#14141c', border: `1px solid rgba(255,255,255,0.12)`, borderTop: `3px solid ${C}`,
            borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
        >
          {/* header */}
          <div style={{ padding: '20px 22px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={15} color="rgba(255,255,255,0.6)" />
            </button>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 8px', paddingRight: 36 }}>{active.term}</h2>
            <div style={{ display: 'flex', gap: 7 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C, background: `${C}1f`, border: `1px solid ${C}50`, padding: '2px 9px', borderRadius: 99 }}>
                {active.domain}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: DIFF_COLOR[active.difficulty], background: `${DIFF_COLOR[active.difficulty]}1f`, border: `1px solid ${DIFF_COLOR[active.difficulty]}50`, padding: '2px 9px', borderRadius: 99 }}>
                {active.difficulty}
              </span>
            </div>
          </div>

          {/* body */}
          <div style={{ padding: '18px 22px 22px' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.5, margin: '0 0 14px' }}>{active.short}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, margin: 0 }}>{active.long}</p>

            {active.example && (
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: `${C}10`, border: `1px solid ${C}25` }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C }}>Example</span>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: '4px 0 0', fontStyle: 'italic' }}>{active.example}</p>
              </div>
            )}

            {related.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Related</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {related.map((r) => (
                    <button key={r.id} onClick={() => setActive(r)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600 }}>
                      {r.term} <ArrowRight size={12} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
