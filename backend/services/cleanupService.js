const supabase = require('../config/supabase');

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

// Deletes auth users who signed up more than 15 days ago but never completed onboarding
// (i.e. they have no row in user_profiles).
// Safe to run daily — only touches genuinely abandoned accounts.
async function deleteStaleUnonboardedUsers() {
  console.log('[Cleanup] Starting stale-user sweep...');

  const cutoffDate = new Date(Date.now() - FIFTEEN_DAYS_MS).toISOString();
  let deletedCount = 0;
  let page = 1;
  const perPage = 1000; // Supabase admin API max

  try {
    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) {
        console.error('[Cleanup] Failed to list auth users:', error.message);
        break;
      }

      const { users } = data;

      // Only look at accounts older than 15 days
      const stale = users.filter(u => u.created_at < cutoffDate);
      console.log(`[Cleanup] Page ${page}: ${users.length} total, ${stale.length} older than 15 days`);

      for (const u of stale) {
        // Check whether this user completed onboarding (has a profile row)
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', u.id)
          .maybeSingle(); // returns null (not error) when no row found

        if (profileError) {
          console.error(`[Cleanup] Profile lookup failed for ${u.id}:`, profileError.message);
          continue;
        }

        if (!profile) {
          // No profile = never finished onboarding — delete the account
          const { error: deleteError } = await supabase.auth.admin.deleteUser(u.id);
          if (deleteError) {
            console.error(`[Cleanup] Could not delete ${u.id}:`, deleteError.message);
          } else {
            console.log(`[Cleanup] Deleted stale user ${u.id} (signed up ${u.created_at})`);
            deletedCount++;
          }
        }
      }

      // Last page reached
      if (users.length < perPage) break;
      page++;
    }
  } catch (err) {
    console.error('[Cleanup] Unexpected error during sweep:', err.message);
  }

  console.log(`[Cleanup] Sweep complete — ${deletedCount} stale account(s) removed.`);
  return deletedCount;
}

module.exports = { deleteStaleUnonboardedUsers };
