// NotificationCenter — full in-app notification list + preferences.
// Global route (/notifications). Neutral cosmic styling since it's cross-domain.

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ArrowLeft, Check, Archive, Trash2, Settings } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationIcon from '../components/NotificationIcon';

const ACCENT = '#a78bfa';

const FILTERS = [
  { key: 'all',          label: 'All' },
  { key: 'learning',     label: 'Learning' },
  { key: 'gamification', label: 'Gamification' },
  { key: 'reminder',     label: 'Reminders' },
];

const PREF_ROWS = [
  { key: 'quiz_complete',    label: 'Quiz completion',  desc: 'When you finish a quiz' },
  { key: 'badge_earned',     label: 'Badge earned',     desc: 'When you unlock a badge' },
  { key: 'streak_milestone', label: 'Streak milestones', desc: 'Every streak milestone reached' },
  { key: 'daily_challenge',  label: 'Daily challenge',  desc: 'When you complete the Daily Cipher' },
  { key: 'level_up',         label: 'Level up',         desc: 'When you reach a new level' },
];

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

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} role="switch" aria-checked={on}
      style={{ width: 42, height: 24, borderRadius: 99, flexShrink: 0, cursor: 'pointer', position: 'relative',
        border: `1px solid ${on ? ACCENT : 'rgba(255,255,255,0.18)'}`, background: on ? `${ACCENT}cc` : 'rgba(255,255,255,0.08)', transition: 'all 0.2s' }}>
      <motion.div animate={{ x: on ? 19 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{ position: 'absolute', top: 2, left: 0, width: 18, height: 18, borderRadius: '50%', background: on ? '#000' : '#fff' }} />
    </button>
  );
}

export default function NotificationCenter() {
  const navigate = useNavigate();
  const { items, unread, loading, markRead, markAllRead, archive, remove, prefs, setPref } = useNotifications();
  const [filter, setFilter] = useState('all');
  const [sort, setSort]     = useState('newest');
  const [showPrefs, setShowPrefs] = useState(false);

  const view = useMemo(() => {
    let list = filter === 'all' ? items : items.filter((n) => n.category === filter);
    list = [...list].sort((a, b) =>
      sort === 'newest' ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at));
    return list;
  }, [items, filter, sort]);

  const tabStyle = (active) => ({
    padding: '7px 14px', borderRadius: 99, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
    background: active ? ACCENT : 'rgba(255,255,255,0.05)',
    color: active ? '#000' : 'rgba(255,255,255,0.6)',
    border: `1px solid ${active ? ACCENT : 'rgba(255,255,255,0.1)'}`,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b14', color: '#fff' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(-1)}
            style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={17} color={ACCENT} />
          </motion.button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={22} color={ACCENT} />
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, margin: 0 }}>Notifications</h1>
            {unread > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, background: `${ACCENT}1f`, padding: '2px 8px', borderRadius: 99 }}>{unread} new</span>}
          </div>
          <button onClick={() => setShowPrefs((s) => !s)} title="Preferences"
            style={{ width: 38, height: 38, borderRadius: 10, background: showPrefs ? `${ACCENT}20` : 'rgba(255,255,255,0.06)', border: `1px solid ${showPrefs ? ACCENT : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Settings size={16} color={showPrefs ? ACCENT : 'rgba(255,255,255,0.6)'} />
          </button>
        </div>

        {/* Preferences panel */}
        <AnimatePresence>
          {showPrefs && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '8px 16px' }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', padding: '10px 0 6px' }}>
                  Notify me about
                </div>
                {PREF_ROWS.map((p, i) => (
                  <div key={p.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderTop: i ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#fff' }}>{p.label}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{p.desc}</div>
                    </div>
                    <Toggle on={!!prefs[p.key]} onToggle={() => setPref(p.key, !prefs[p.key])} />
                  </div>
                ))}
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', padding: '4px 0 12px', margin: 0 }}>
                  Email digests and push reminders aren't available yet — they need server infrastructure.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters + sort + mark all */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={tabStyle(filter === f.key)}>{f.label}</button>
          ))}
          <div style={{ flex: 1 }} />
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', fontFamily: "'Inter', sans-serif", fontSize: 12, cursor: 'pointer' }}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: 12, color: ACCENT }}>
              <Check size={13} /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              style={{ width: 30, height: 30, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: ACCENT }} />
          </div>
        ) : view.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Bell size={40} color="rgba(255,255,255,0.2)" style={{ marginBottom: 12 }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>
              No notifications here yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {view.map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                onClick={() => !n.read && markRead(n.id)}
                style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', borderRadius: 14,
                  background: n.read ? 'rgba(255,255,255,0.03)' : `${ACCENT}10`,
                  border: `1px solid ${n.read ? 'rgba(255,255,255,0.08)' : `${ACCENT}30`}`, cursor: n.read ? 'default' : 'pointer' }}>
                <span style={{ flexShrink: 0, marginTop: 1, display: 'inline-flex' }}><NotificationIcon type={n.type} size={20} color={ACCENT} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>{n.title}</span>
                    {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT }} />}
                  </div>
                  {n.description && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2, lineHeight: 1.45 }}>{n.description}</div>}
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{relTime(n.created_at)}</div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={(e) => { e.stopPropagation(); archive(n.id); }} title="Archive"
                    style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Archive size={13} color="rgba(255,255,255,0.5)" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); remove(n.id); }} title="Delete"
                    style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Trash2 size={13} color="rgba(248,113,113,0.7)" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
