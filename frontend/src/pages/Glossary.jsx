// Glossary page — /glossary. Searchable, filterable list of financial terms.
// Standalone (global route); neutral cosmic styling like the notification center.

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Search, X } from 'lucide-react';
import { GLOSSARY_TERMS, GLOSSARY_DOMAIN_COLORS } from '../data/glossaryTerms';
import GlossaryModal from '../components/GlossaryModal';

const ACCENT = '#a78bfa';
const DIFF_COLOR = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'global', label: 'Global' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'fashion', label: 'Fashion' },
  { key: 'sports', label: 'Sports' },
  { key: 'music', label: 'Music' },
];

export default function Glossary() {
  const navigate = useNavigate();
  const [query, setQuery]   = useState('');
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY_TERMS
      .filter((t) => filter === 'all' || t.domain === filter)
      .filter((t) => !q || t.term.toLowerCase().includes(q) || t.short.toLowerCase().includes(q) || t.long.toLowerCase().includes(q))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [query, filter]);

  const tabStyle = (on) => ({
    padding: '7px 14px', borderRadius: 99, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
    background: on ? ACCENT : 'rgba(255,255,255,0.05)',
    color: on ? '#000' : 'rgba(255,255,255,0.6)',
    border: `1px solid ${on ? ACCENT : 'rgba(255,255,255,0.1)'}`,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b14', color: '#fff' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(-1)}
            style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={17} color={ACCENT} />
          </motion.button>
          <BookOpen size={22} color={ACCENT} />
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, margin: 0 }}>Glossary</h1>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>
            Financial terms explained
          </span>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search terms…"
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px 38px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: 14, outline: 'none' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={15} color="rgba(255,255,255,0.4)" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {FILTERS.map((f) => <button key={f.key} onClick={() => setFilter(f.key)} style={tabStyle(filter === f.key)}>{f.label}</button>)}
        </div>

        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
          Showing {results.length} of {GLOSSARY_TERMS.length} terms
        </div>

        {/* List */}
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.45)' }}>
            No terms match. Try a different search.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.map((t, i) => {
              const C = GLOSSARY_DOMAIN_COLORS[t.domain] || ACCENT;
              return (
                <motion.button key={t.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.015, 0.3) }}
                  onClick={() => setActive(t)}
                  style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', borderLeft: `3px solid ${C}`, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700, color: '#fff' }}>{t.term}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C, background: `${C}1f`, padding: '2px 7px', borderRadius: 99 }}>{t.domain}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: DIFF_COLOR[t.difficulty] }}>{t.difficulty}</span>
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>{t.short}</p>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {active && <GlossaryModal term={active} onClose={() => setActive(null)} />}
    </div>
  );
}
