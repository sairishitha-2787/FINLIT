// badgeService — persist earned badges to user_badges. The achievements pages
// (useBadgeTracker) load + live-subscribe to this table, so an insert here makes
// the badge appear on the relevant domain's page. Idempotent: a unique
// (user_id, badge_id) row is ignored on conflict.

import { supabase } from '../config/supabase';

// badges: [{ id, name }]. Fire-and-forget; never throws. Inserts row-by-row and
// ignores unique-violation (23505 = already earned), matching how useGamification
// persists badges, so an already-earned badge can't fail the rest.
export async function awardBadges(userId, badges = []) {
  if (!userId || !badges.length) return;
  const now = new Date().toISOString();
  for (const b of badges) {
    try {
      const { error } = await supabase
        .from('user_badges')
        .insert([{ user_id: userId, badge_id: b.id, badge_name: b.name, earned_at: now }]);
      if (error && error.code !== '23505') {
        console.error('[badgeService] award failed:', error.message);
      }
    } catch (err) {
      console.error('[badgeService] award threw:', err?.message || err);
    }
  }
}
