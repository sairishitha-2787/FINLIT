// NotificationBell — bell icon + unread badge + recent dropdown.
// Drop into any domain top bar: <NotificationBell accent={C} theme={...} />

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, ChevronRight } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

const DEFAULT_THEME = {
  surface:     'rgba(20,20,24,0.98)',
  border:      'rgba(255,255,255,0.12)',
  textPrimary: '#ffffff',
  textMuted:   'rgba(255,255,255,0.5)',
  fontHeading: "'Inter', sans-serif",
  fontBody:    "'Inter', sans-serif",
};

function relTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  if (h < 24) return `${h}h`;
  if (d === 1) return '1d';
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationBell({ accent = '#a78bfa', theme: themeProp, size = 36 }) {
  const t = { ...DEFAULT_THEME, ...(themeProp || {}) };
  const C = accent;
  const navigate = useNavigate();
  const { items, unread, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const recent = items.slice(0, 8);

  const handleItem = (n) => {
    if (!n.read) markRead(n.id);
    setOpen(false);
    if (n.action_type === 'review_quiz' && n.domain) navigate(`/${n.domain}`);
    else if (n.action_type === 'view_badge' && n.domain) navigate(`/${n.domain}/vault`);
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', flexShrink: 0 }}>
      {/* Bell button */}
      <motion.button
        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        style={{
          width: size, height: size, borderRadius: 8, position: 'relative',
          background: 'rgba(255,255,255,0.06)', border: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <Bell size={17} color={C} strokeWidth={1.8} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -5, right: -5, minWidth: 17, height: 17, padding: '0 4px',
            borderRadius: 99, background: '#EF4444', color: '#fff',
            fontFamily: t.fontBody, fontSize: 10, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 2px rgba(0,0,0,0.4)',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: size + 8, right: 0, width: 320, zIndex: 9000,
              background: t.surface, border: `1px solid ${t.border}`, borderTop: `2px solid ${C}`,
              borderRadius: 14, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontFamily: t.fontHeading, fontSize: 15, color: t.textPrimary }}>Notifications</span>
              {unread > 0 && (
                <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: t.fontBody, fontSize: 11, color: C }}>
                  <Check size={12} /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {recent.length === 0 ? (
                <div style={{ padding: '28px 16px', textAlign: 'center', fontFamily: t.fontBody, fontSize: 13, color: t.textMuted }}>
                  No notifications yet.
                </div>
              ) : recent.map((n) => (
                <button key={n.id} onClick={() => handleItem(n)}
                  style={{
                    width: '100%', textAlign: 'left', display: 'flex', gap: 10, alignItems: 'flex-start',
                    padding: '11px 14px', cursor: 'pointer',
                    background: n.read ? 'transparent' : `${C}0e`,
                    border: 'none', borderBottom: `1px solid ${t.border}`,
                  }}>
                  <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{n.icon || '🔔'}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, color: t.textPrimary }}>{n.title}</span>
                      {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: C, flexShrink: 0 }} />}
                    </span>
                    {n.description && <span style={{ display: 'block', fontFamily: t.fontBody, fontSize: 12, color: t.textMuted, marginTop: 1, lineHeight: 1.4 }}>{n.description}</span>}
                  </span>
                  <span style={{ fontFamily: t.fontBody, fontSize: 10, color: t.textMuted, flexShrink: 0 }}>{relTime(n.created_at)}</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <button onClick={() => { setOpen(false); navigate('/notifications'); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '11px', background: 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer', fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, color: C }}>
              View all <ChevronRight size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
