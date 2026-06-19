// useDailyChallenge — the "Daily Cipher".
// One randomized topic per user per day across all 4 domains. Supabase-backed,
// with a localStorage fallback so the UI works even before the table exists.
//
// Streak is derived from completed-row history (consecutive challenge dates),
// so the existing `user_streaks` activity streak is left untouched.

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import {
  pickDailyTopic, getTopicByKey, buildLearnState,
} from '../data/dailyChallengeTopics';
import { logNotification } from '../services/notificationsService';
import { logDailyChallengeCompleted, logStreakMilestone } from '../services/eventsService';

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 365];

const BASE_XP        = 130;
const STREAK_BONUS   = 10;   // per day of streak
const LS_PREFIX      = 'finlit_daily_';

// ── Local date helpers (user's own midnight) ─────────────────────────────────
const ymd = (d) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
const todayStr = () => ymd(new Date());
const dayBefore = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  return ymd(d);
};
const challengeXP = (streakCount) => BASE_XP + streakCount * STREAK_BONUS;

// ── localStorage fallback store (per user + domain) ──────────────────────────
const lsKey = (uid, domain) => `${LS_PREFIX}${domain}_${uid}`;
function lsLoad(uid, domain) {
  try { return JSON.parse(localStorage.getItem(lsKey(uid, domain))) || {}; } catch { return {}; }
}
function lsSave(uid, domain, data) {
  try { localStorage.setItem(lsKey(uid, domain), JSON.stringify(data)); } catch { /* ignore */ }
}

export function useDailyChallenge({ domain, awardXP } = {}) {
  const { user } = useAuth();
  const { completedTopics = [] } = useUser();
  const awardRef = useRef(awardXP);
  useEffect(() => { awardRef.current = awardXP; }, [awardXP]);

  const [challenge, setChallenge] = useState(null); // { topicKey, topicName, domain, difficulty, completed, xpEarned, streakCount, challengeDate }
  const [streak, setStreak]       = useState(0);
  const [loading, setLoading]     = useState(true);
  const [justCompleted, setJustCompleted] = useState(null); // { xp, streak } | null
  const usingDbRef = useRef(true);
  const completedRef = useRef(completedTopics);
  useEffect(() => { completedRef.current = completedTopics; }, [completedTopics]);

  // ── Load or generate today's challenge (scoped to this domain) ──────────────
  const load = useCallback(async () => {
    if (!user || !domain) { setLoading(false); return; }
    setLoading(true);
    const today = todayStr();

    // Try Supabase first
    try {
      const { data: rows, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('domain', domain)
        .order('challenge_date', { ascending: false })
        .limit(40);
      if (error) throw error;
      usingDbRef.current = true;

      const history = rows || [];
      const todayRow = history.find((r) => r.challenge_date === today);

      // current streak from this domain's completed history
      setStreak(computeStreak(history, today));

      if (todayRow) {
        setChallenge(rowToChallenge(todayRow));
        setLoading(false);
        return;
      }

      // Generate: avoid yesterday's topic + already-completed names, within domain
      const yKey = history.find((r) => r.challenge_date === dayBefore(today))?.topic_key || null;
      const picked = pickDailyTopic({ domain, completedNames: completedRef.current, excludeKey: yKey });
      const insertRow = {
        user_id: user.id, challenge_date: today,
        domain: picked.domain, topic_key: picked.key, topic_id: picked.topicId,
        topic_name: picked.name, difficulty: picked.difficulty,
        completed: false, xp_earned: 0, streak_count: 0,
      };
      await supabase.from('daily_challenges')
        .upsert(insertRow, { onConflict: 'user_id,challenge_date,domain', ignoreDuplicates: true });
      // re-fetch to get the authoritative row (handles 2-tab races)
      const { data: fresh } = await supabase
        .from('daily_challenges').select('*')
        .eq('user_id', user.id).eq('domain', domain).eq('challenge_date', today).single();
      setChallenge(rowToChallenge(fresh || insertRow));
      setLoading(false);
      return;
    } catch (err) {
      // Table missing or offline → localStorage fallback (per domain)
      usingDbRef.current = false;
      const store = lsLoad(user.id, domain);
      const today2 = todayStr();
      let entry = store[today2];
      if (!entry) {
        const yKey = store[dayBefore(today2)]?.topicKey || null;
        const picked = pickDailyTopic({ domain, completedNames: completedRef.current, excludeKey: yKey });
        entry = {
          challengeDate: today2, domain: picked.domain, topicKey: picked.key,
          topicId: picked.topicId, topicName: picked.name, difficulty: picked.difficulty,
          completed: false, xpEarned: 0, streakCount: 0,
        };
        store[today2] = entry; lsSave(user.id, domain, store);
      }
      setChallenge(entry);
      setStreak(computeStreakLS(store, today2));
      setLoading(false);
    }
  }, [user, domain]);

  useEffect(() => { load(); }, [load]);

  // ── Auto-complete when the challenge topic shows up in completedTopics ───────
  useEffect(() => {
    if (!challenge || challenge.completed) return;
    if (completedTopics.includes(challenge.topicName)) {
      complete(); // award using internal streak calc
    }
  }, [completedTopics, challenge]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mark today's challenge complete + award XP ───────────────────────────────
  const complete = useCallback(async (awardXPArg) => {
    if (!user || !challenge || challenge.completed) return;
    const awardXP = awardXPArg || awardRef.current;
    const today = todayStr();
    const newStreak = streak + 1;            // completing today extends the streak
    const xp = challengeXP(newStreak);

    if (usingDbRef.current) {
      try {
        await supabase.from('daily_challenges')
          .update({ completed: true, completed_at: new Date().toISOString(), xp_earned: xp, streak_count: newStreak, updated_at: new Date().toISOString() })
          .eq('user_id', user.id).eq('domain', challenge.domain).eq('challenge_date', today);
      } catch { usingDbRef.current = false; }
    }
    if (!usingDbRef.current) {
      const store = lsLoad(user.id, challenge.domain);
      store[today] = { ...(store[today] || challenge), completed: true, xpEarned: xp, streakCount: newStreak };
      lsSave(user.id, challenge.domain, store);
    }

    if (typeof awardXP === 'function') awardXP(xp);
    setChallenge((c) => ({ ...c, completed: true, xpEarned: xp, streakCount: newStreak }));
    setStreak(newStreak);
    setJustCompleted({ xp, streak: newStreak });
    setTimeout(() => setJustCompleted(null), 5000);

    // Log an in-app notification (gated by prefs; silent if table missing)
    logNotification(user.id, {
      type: 'daily_challenge',
      title: 'Daily Cipher Complete',
      description: `${challenge.topicName} · +${xp} XP · ${newStreak}-day streak`,
      domain: challenge.domain,
    });

    // Analytics (fire-and-forget).
    logDailyChallengeCompleted(user.id, challenge.domain, {
      topicName: challenge.topicName, xpEarned: xp, streakCount: newStreak,
    });
    if (STREAK_MILESTONES.includes(newStreak)) {
      logStreakMilestone(user.id, challenge.domain, { streakCount: newStreak });
    }
  }, [user, challenge, streak]);

  const topicMeta = challenge ? getTopicByKey(challenge.topicKey) : null;
  const learnState = topicMeta ? buildLearnState(topicMeta) : {};

  return {
    challenge,            // today's challenge (or null)
    streak,               // current daily-challenge streak
    loading,
    justCompleted,        // { xp, streak } for ~5s after completing
    completeChallenge: complete,  // call with awardXP fn on quiz finish
    nextXP: challenge ? challengeXP(streak + (challenge.completed ? 0 : 1)) : BASE_XP,
    baseXP: BASE_XP,
    streakBonus: (challenge?.completed ? challenge.streakCount : streak + 1) * STREAK_BONUS,
    learnPath: topicMeta?.learnPath || null,
    learnState,
    topicMeta,
  };
}

// ── helpers ───────────────────────────────────────────────────────────────────
function rowToChallenge(r) {
  return {
    challengeDate: r.challenge_date, domain: r.domain, topicKey: r.topic_key,
    topicId: r.topic_id, topicName: r.topic_name, difficulty: r.difficulty,
    completed: !!r.completed, xpEarned: r.xp_earned || 0, streakCount: r.streak_count || 0,
  };
}

// Streak = consecutive completed days ending today or yesterday.
function computeStreak(history, today) {
  const completed = history.filter((r) => r.completed).map((r) => r.challenge_date);
  return walkStreak(completed, today);
}
function computeStreakLS(store, today) {
  const completed = Object.values(store).filter((e) => e.completed).map((e) => e.challengeDate);
  return walkStreak(completed, today);
}
function walkStreak(completedDates, today) {
  const set = new Set(completedDates);
  // streak is alive if today or yesterday is completed
  let cursor = set.has(today) ? today : (set.has(dayBefore(today)) ? dayBefore(today) : null);
  if (!cursor) return 0;
  let count = 0;
  while (set.has(cursor)) { count++; cursor = dayBefore(cursor); }
  return count;
}
