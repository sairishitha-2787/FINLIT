// GlossaryText — wraps plain text and turns known glossary terms into clickable
// links that open the definition modal. Smart longest-match (so "Compound
// Interest" wins over "Interest"), each term linked at most once per block.
//
// Ready to drop into lessons/quizzes later, e.g.:
//   <GlossaryText accent={C}>{question.text}</GlossaryText>
// It only linkifies plain strings — it never parses HTML, so it's safe.

import React, { useMemo, useState } from 'react';
import { GLOSSARY_TERMS } from '../data/glossaryTerms';
import GlossaryModal from './GlossaryModal';

// terms sorted longest-first for greedy matching
const SORTED = [...GLOSSARY_TERMS].sort((a, b) => b.term.length - a.term.length);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PATTERN = new RegExp(`\\b(${SORTED.map((t) => escapeRe(t.term)).join('|')})\\b`, 'gi');
const BY_LOWER = Object.fromEntries(GLOSSARY_TERMS.map((t) => [t.term.toLowerCase(), t]));

export default function GlossaryText({ children, accent = '#a78bfa', once = true }) {
  const text = typeof children === 'string' ? children : '';
  const [active, setActive] = useState(null);

  const parts = useMemo(() => {
    if (!text) return [children];
    const out = [];
    const seen = new Set();
    let last = 0;
    let m;
    PATTERN.lastIndex = 0;
    while ((m = PATTERN.exec(text)) !== null) {
      const matched = m[0];
      const key = matched.toLowerCase();
      const term = BY_LOWER[key];
      if (!term || (once && seen.has(key))) continue;
      seen.add(key);
      if (m.index > last) out.push(text.slice(last, m.index));
      out.push({ term, text: matched });
      last = m.index + matched.length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  if (typeof children !== 'string') return <>{children}</>;

  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <React.Fragment key={i}>{p}</React.Fragment>
        ) : (
          <button key={i} onClick={() => setActive(p.term)}
            style={{ display: 'inline', padding: 0, margin: 0, background: 'none', border: 'none',
              color: accent, textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 2,
              cursor: 'pointer', font: 'inherit' }}>
            {p.text}
          </button>
        )
      )}
      {active && <GlossaryModal term={active} onClose={() => setActive(null)} />}
    </>
  );
}
