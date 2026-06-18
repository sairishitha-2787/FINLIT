// eventsService — fire-and-forget analytics logging.
//
// Every meaningful user action writes one row to the `events` table so we can
// later answer: which topics are hard, where users drop off, which domains are
// popular, does the daily challenge drive retention, etc.
//
// Design rules:
//   • NEVER throw — analytics must not break the product. All failures are
//     swallowed (table missing, offline, RLS) and logged to console only.
//   • Fire-and-forget — callers do not await. We don't block the UI on a write.
//   • Flat snake_case metadata. No sensitive data (no emails, names, answers).
//
// This intentionally does NOT gate on notification prefs — events are internal
// analytics, not user-facing notifications.

import { supabase } from '../config/supabase';
import { updateLastActivity } from '../utils/activityTracker';

// Known event types (documentation + a guard against typos at call sites).
export const EVENT_TYPES = {
  // onboarding
  ONBOARDING_STARTED:   'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_SKIPPED:   'onboarding_skipped',
  // domain
  DOMAIN_SELECTED:      'domain_selected',
  DOMAIN_SWITCHED:      'domain_switched',
  // learning
  QUIZ_STARTED:         'quiz_started',
  QUIZ_SUBMITTED:       'quiz_submitted',
  TOPIC_UNLOCKED:       'topic_unlocked',
  // gamification
  BADGE_EARNED:             'badge_earned',
  DAILY_CHALLENGE_STARTED:  'daily_challenge_started',
  DAILY_CHALLENGE_COMPLETED:'daily_challenge_completed',
  STREAK_MILESTONE:         'streak_milestone',
  // engagement
  SESSION_STARTED:      'session_started',
};

// ── Core logger ───────────────────────────────────────────────────────────────
// logEvent(userId, eventType, domain?, metadata?)
export async function logEvent(userId, eventType, domain = null, metadata = {}) {
  if (!userId || !eventType) return null;
  // Any logged event counts as activity for the inactivity auto-logout.
  updateLastActivity();
  const row = {
    user_id:    userId,
    event_type: eventType,
    domain:     domain || null,
    metadata:   metadata && typeof metadata === 'object' ? metadata : {},
  };
  try {
    const { error } = await supabase.from('events').insert(row);
    if (error) {
      // Don't spam the console for an absent table (expected before the
      // migration is run) — surface everything else for debugging.
      if (!error.message?.includes('schema cache') && error.code !== '42P01') {
        console.error('[events] log failed:', error.message);
      }
      return null;
    }
    return true;
  } catch (err) {
    console.error('[events] log threw:', err?.message || err);
    return null;
  }
}

// ── Typed helpers (keep metadata shapes consistent across call sites) ─────────
export const logQuizSubmitted = (userId, domain, { topicName, score, total, percent, difficulty }) =>
  logEvent(userId, EVENT_TYPES.QUIZ_SUBMITTED, domain, {
    topic_name: topicName, score, total, percent, difficulty,
  });

export const logTopicUnlocked = (userId, domain, { topicName, percent }) =>
  logEvent(userId, EVENT_TYPES.TOPIC_UNLOCKED, domain, {
    topic_name: topicName, percent,
  });

export const logBadgeEarned = (userId, domain, { badgeId, badgeName, tier, category }) =>
  logEvent(userId, EVENT_TYPES.BADGE_EARNED, domain, {
    badge_id: badgeId, badge_name: badgeName, tier, category,
  });

export const logDailyChallengeCompleted = (userId, domain, { topicName, xpEarned, streakCount }) =>
  logEvent(userId, EVENT_TYPES.DAILY_CHALLENGE_COMPLETED, domain, {
    topic_name: topicName, xp_earned: xpEarned, streak_count: streakCount,
  });

export const logStreakMilestone = (userId, domain, { streakCount }) =>
  logEvent(userId, EVENT_TYPES.STREAK_MILESTONE, domain, { streak_count: streakCount });

export const logOnboardingCompleted = (userId, domain) =>
  logEvent(userId, EVENT_TYPES.ONBOARDING_COMPLETED, domain, {});

export const logDomainSelected = (userId, domain) =>
  logEvent(userId, EVENT_TYPES.DOMAIN_SELECTED, domain, {});

export const logSessionStarted = (userId) =>
  logEvent(userId, EVENT_TYPES.SESSION_STARTED, null, {});
