// frontend/src/hooks/useBadgeTracker.js
// Loads all earned badges for the current user from Supabase.
// Exposes:
//   earnedMap  { badge_id → earned_at ISO string }
//   loading    boolean
//   awardBadge(id, name) — awards badge if not already earned, updates state
//   newlyEarned  { id, name, tier, category, secret } | null  — cleared after 5s

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { logNotification } from '../services/notificationsService';
import { logBadgeEarned } from '../services/eventsService';

export function useBadgeTracker() {
  const { user } = useAuth();
  const [earnedMap, setEarnedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [newlyEarned, setNewlyEarned] = useState(null);
  const clearTimerRef = useRef(null);

  // ── Load all earned badges on mount / user change ───────────────────────────
  useEffect(() => {
    if (!user) {
      setEarnedMap({});
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('[useBadgeTracker] load error:', error.message);
          if (!cancelled) setLoading(false);
          return;
        }

        if (!cancelled) {
          const dbMap = {};
          (data || []).forEach((row) => {
            dbMap[row.badge_id] = row.earned_at || row.created_at || null;
          });
          // Merge: DB values win for their keys, but keep any optimistic entries
          // that were set while the load was in flight (e.g. badge just earned).
          setEarnedMap(prev => ({ ...prev, ...dbMap }));
          setLoading(false);
        }
      } catch (err) {
        console.error('[useBadgeTracker] unexpected error:', err);
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // ── Real-time subscription: listen for new rows from other tabs ─────────────
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`user_badges_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_badges',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const { badge_id, badge_name, earned_at } = payload.new;
          setEarnedMap((prev) => {
            if (prev[badge_id]) return prev;
            return { ...prev, [badge_id]: earned_at };
          });
          // Also fire the toast notification so AchievementsPage shows it
          setNewlyEarned((prev) => {
            if (prev?.id === badge_id) return prev;
            return { id: badge_id, name: badge_name || badge_id, tier: 'common', category: 'special', secret: false, earnedAt: earned_at };
          });
          // Auto-clear after 5s
          setTimeout(() => setNewlyEarned(null), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // ── awardBadge ──────────────────────────────────────────────────────────────
  const awardBadge = useCallback(
    async (id, name, extra = {}) => {
      if (!user) return;
      if (earnedMap[id]) return; // already earned

      const earnedAt = new Date().toISOString();

      // Optimistic update
      setEarnedMap((prev) => ({ ...prev, [id]: earnedAt }));

      // Set newlyEarned for toast display
      const badgeInfo = {
        id,
        name,
        tier: extra.tier || 'common',
        category: extra.category || 'special',
        secret: extra.secret || false,
        earnedAt,
      };

      setNewlyEarned(badgeInfo);

      // Log an in-app notification (gated by prefs; silent if table missing)
      logNotification(user.id, {
        type: 'badge_earned',
        title: 'Badge Unlocked',
        description: `You earned "${name}"`,
        actionType: 'view_badge',
        actionTarget: id,
      });

      // Analytics (fire-and-forget). Domain is optional — callers pass it via extra.
      logBadgeEarned(user.id, extra.domain || null, {
        badgeId: id, badgeName: name, tier: badgeInfo.tier, category: badgeInfo.category,
      });

      // Auto-clear newlyEarned after 5s (6s for secrets)
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      const delay = extra.secret ? 6000 : 5000;
      clearTimerRef.current = setTimeout(() => {
        setNewlyEarned(null);
      }, delay);

      // Persist to Supabase
      try {
        const { error } = await supabase.from('user_badges').upsert(
          {
            user_id: user.id,
            badge_id: id,
            badge_name: name,
            earned_at: earnedAt,
          },
          { onConflict: 'user_id,badge_id', ignoreDuplicates: true }
        );

        if (error) {
          console.error('[useBadgeTracker] awardBadge error:', error.message);
          // Roll back optimistic update on conflict-free error
          if (error.code !== '23505') {
            setEarnedMap((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
          }
        }
      } catch (err) {
        console.error('[useBadgeTracker] awardBadge unexpected error:', err);
      }
    },
    [user, earnedMap]
  );

  // ── Cleanup timer on unmount ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  return { earnedMap, loading, awardBadge, newlyEarned };
}
