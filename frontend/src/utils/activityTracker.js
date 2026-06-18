// activityTracker — lightweight inactivity-based auto-logout.
//
// Model: "activity" = an analytics event firing (see eventsService.logEvent,
// which calls updateLastActivity on every event). On app load, AuthContext
// checks whether more than INACTIVITY_MINUTES have passed since the last
// activity; if so it signs the user out. There is no background timer — the
// check runs once when the session is established.

const ACTIVITY_KEY = 'finlit_last_activity';
const EXPIRED_FLAG = 'finlit_session_expired';

export const DEFAULT_INACTIVITY_MINUTES = 180; // 3 hours

// Stamp "now" as the last activity time.
export const updateLastActivity = () => {
  try { localStorage.setItem(ACTIVITY_KEY, Date.now().toString()); } catch { /* ignore */ }
};

// True when more than `inactivityMinutes` have elapsed since the last activity.
// Returns false when there's no recorded activity (treated as a fresh session).
export const isUserInactive = (inactivityMinutes = DEFAULT_INACTIVITY_MINUTES) => {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (!raw) return false;
    const last = parseInt(raw, 10);
    if (!Number.isFinite(last)) return false;
    return Date.now() - last > inactivityMinutes * 60 * 1000;
  } catch {
    return false;
  }
};

// Clear the activity timestamp (on logout).
export const clearActivity = () => {
  try { localStorage.removeItem(ACTIVITY_KEY); } catch { /* ignore */ }
};

// One-shot flag so the Login page can show a "session expired" toast after an
// auto-logout (AuthContext runs outside the Router/ToastProvider, so it can't
// toast directly).
export const markSessionExpired = () => {
  try { localStorage.setItem(EXPIRED_FLAG, '1'); } catch { /* ignore */ }
};

export const consumeSessionExpired = () => {
  try {
    const v = localStorage.getItem(EXPIRED_FLAG) === '1';
    if (v) localStorage.removeItem(EXPIRED_FLAG);
    return v;
  } catch {
    return false;
  }
};
