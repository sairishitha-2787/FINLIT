// QuizHistoryModal — "Quiz History" score log.
// Retroactive history built from the existing `progress` table (one row per
// attempt). Shows past attempts (topic, score, X/Y, date) with filter/sort and
// a Retry action. Themed per host domain via the `theme` prop.
//
// NOTE: the `progress` table stores score+date only (no per-question answers),
// so this is a score log — not a per-question review.

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Clock, TrendingUp, Award, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProgress } from '../services/progressService';

const DEFAULT_THEME = {
  surface:     'rgba(20,20,24,0.98)',
  border:      'rgba(255,255,255,0.10)',
  textPrimary: '#ffffff',
  textMuted:   'rgba(255,255,255,0.5)',
  radius:      16,
  fontHeading: "'Inter', sans-serif",
  fontBody:    "'Inter', sans-serif",
};

const pct = (s, t) => (t ? Math.round((s / t) * 100) : 0);
const scoreColor = (p) => (p >= 80 ? '#22C55E' : p >= 60 ? '#F59E0B' : '#EF4444');

function relTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d === 1) return 'yesterday';
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function QuizHistoryModal({ open, onClose, topicNames = null, accent = '#a78bfa', theme: themeProp, onRetry }) {
  const t = { ...DEFAULT_THEME, ...(themeProp || {}) };
  const C = accent;
  const { user } = useAuth();

  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicFilter, setTopicFilter] = useState('all');
  const [sort, setSort]       = useState('newest');

  useEffect(() => {
    if (!open || !user) return;
    let cancelled = false;
    setLoading(true);
    fetchUserProgress(user.id).then(({ data }) => {
      if (cancelled) return;
      let list = (data || []).filter(r => r.score != null && r.total_questions);
      if (topicNames) list = list.filter(r => topicNames.includes(r.topic));
      setRows(list);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [open, user, topicNames]);

  // distinct topics for the filter dropdown
  const topics = useMemo(() => [...new Set(rows.map(r => r.topic))].sort(), [rows]);

  const view = useMemo(() => {
    let list = topicFilter === 'all' ? rows : rows.filter(r => r.topic === topicFilter);
    const byDate = (a, b) => new Date(b.completed_at) - new Date(a.completed_at);
    const byScore = (a, b) => pct(b.score, b.total_questions) - pct(a.score, a.total_questions);
    if (sort === 'newest')  list = [...list].sort(byDate);
    if (sort === 'oldest')  list = [...list].sort((a, b) => -byDate(a, b));
    if (sort === 'highest') list = [...list].sort(byScore);
    if (sort === 'lowest')  list = [...list].sort((a, b) => -byScore(a, b));
    return list;
  }, [rows, topicFilter, sort]);

  const summary = useMemo(() => {
    if (!rows.length) return null;
    const scores = rows.map(r => pct(r.score, r.total_questions));
    return {
      total: rows.length,
      avg: Math.round(scores.reduce((a, n) => a + n, 0) / scores.length),
      best: Math.max(...scores),
    };
  }, [rows]);

  const selectStyle = {
    background: 'rgba(255,255,255,0.06)', color: t.textPrimary,
    border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 10px',
    fontFamily: t.fontBody, fontSize: 12, cursor: 'pointer', outline: 'none',
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <motion.div
            initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 560, maxHeight: '88vh', display: 'flex', flexDirection: 'column',
              background: t.surface, border: `1px solid ${t.border}`, borderTop: `3px solid ${C}`,
              borderRadius: t.radius, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '18px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <BarChart2 size={20} color={C} />
                <span style={{ fontFamily: t.fontHeading, fontSize: 20, letterSpacing: '0.5px', color: t.textPrimary }}>Quiz History</span>
              </div>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={15} color={t.textMuted} />
              </button>
            </div>

            {/* Summary */}
            {summary && (
              <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: `1px solid ${t.border}` }}>
                {[
                  { Icon: Clock,      label: 'Attempts', val: summary.total },
                  { Icon: TrendingUp, label: 'Avg Score', val: `${summary.avg}%` },
                  { Icon: Award,      label: 'Best', val: `${summary.best}%` },
                ].map(({ Icon, label, val }) => (
                  <div key={label} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: 10, background: `${C}10`, border: `1px solid ${C}25` }}>
                    <Icon size={14} color={C} style={{ marginBottom: 2 }} />
                    <div style={{ fontFamily: t.fontHeading, fontSize: 18, color: C, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontFamily: t.fontBody, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textMuted, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Filters */}
            {!loading && rows.length > 0 && (
              <div style={{ display: 'flex', gap: 8, padding: '12px 20px', borderBottom: `1px solid ${t.border}`, flexWrap: 'wrap' }}>
                <select value={topicFilter} onChange={e => setTopicFilter(e.target.value)} style={selectStyle}>
                  <option value="all">All topics</option>
                  {topics.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                </select>
                <select value={sort} onChange={e => setSort(e.target.value)} style={selectStyle}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest score</option>
                  <option value="lowest">Lowest score</option>
                </select>
              </div>
            )}

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 28, height: 28, borderRadius: '50%', border: `3px solid ${t.border}`, borderTopColor: C }} />
                </div>
              ) : view.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', fontFamily: t.fontBody, fontSize: 14, color: t.textMuted }}>
                  No quiz attempts yet. Complete a quiz to start your history.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {view.map((r, i) => {
                    const p = pct(r.score, r.total_questions);
                    const sc = scoreColor(p);
                    return (
                      <motion.div key={r.id || i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: `1px solid ${t.border}` }}>
                        {/* score badge */}
                        <div style={{ width: 50, height: 50, borderRadius: 12, flexShrink: 0, background: `${sc}1f`, border: `1.5px solid ${sc}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: t.fontHeading, fontSize: 16, color: sc, lineHeight: 1 }}>{p}%</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: t.fontBody, fontSize: 14, fontWeight: 600, color: t.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.topic}</div>
                          <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                            {r.score}/{r.total_questions} correct · {relTime(r.completed_at)}
                          </div>
                        </div>
                        {onRetry && (
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => onRetry(r.topic)}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 11px', borderRadius: 8, background: `${C}18`, border: `1px solid ${C}45`, color: C, cursor: 'pointer', fontFamily: t.fontBody, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                            <RotateCcw size={12} /> Retry
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
