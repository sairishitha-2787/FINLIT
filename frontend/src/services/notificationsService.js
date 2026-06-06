// Notifications service — write/log + preferences.
// In-app only (no email/push/scheduled — those need a backend this app lacks).

import { supabase } from '../config/supabase';

// ── Preferences (localStorage; gate which events get logged) ──────────────────
const PREFS_KEY = 'finlit_notif_prefs';

export const NOTIF_PREF_DEFAULTS = {
  quiz_complete:    true,
  badge_earned:     true,
  streak_milestone: true,
  daily_challenge:  true,
  level_up:         true,
};

export function loadNotifPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...NOTIF_PREF_DEFAULTS, ...JSON.parse(raw) } : { ...NOTIF_PREF_DEFAULTS };
  } catch { return { ...NOTIF_PREF_DEFAULTS }; }
}

export function saveNotifPrefs(prefs) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
}

// Category for filtering in the center
const TYPE_CATEGORY = {
  quiz_complete:    'learning',
  badge_earned:     'gamification',
  streak_milestone: 'gamification',
  level_up:         'gamification',
  daily_challenge:  'reminder',
};

// ── Log a notification (gated by preferences) ─────────────────────────────────
// Safe to call from anywhere. Returns the inserted row or null.
export async function logNotification(userId, payload = {}) {
  if (!userId || !payload.type) return null;
  const prefs = loadNotifPrefs();
  // If a preference exists for this type and it's off, skip logging.
  if (payload.type in prefs && !prefs[payload.type]) return null;

  const row = {
    user_id:       userId,
    type:          payload.type,
    category:      payload.category || TYPE_CATEGORY[payload.type] || 'learning',
    title:         payload.title || '',
    description:   payload.description || null,
    icon:          payload.icon || null,
    domain:        payload.domain || null,
    action_type:   payload.actionType || null,
    action_target: payload.actionTarget || null,
    read:          false,
    archived:      false,
  };
  try {
    const { data, error } = await supabase.from('notifications').insert(row).select().single();
    if (error) return null;
    return data;
  } catch {
    return null; // table missing / offline — fail silently
  }
}
