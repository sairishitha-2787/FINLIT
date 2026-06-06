-- Make the Daily Cipher per-domain: one challenge per user per DAY per DOMAIN.
-- Run this in the Supabase SQL Editor AFTER add_daily_challenges.sql.
--
-- Replaces the UNIQUE(user_id, challenge_date) constraint with one that also
-- includes domain, so each domain gets its own daily challenge.

ALTER TABLE daily_challenges
  DROP CONSTRAINT IF EXISTS daily_challenges_user_id_challenge_date_key;

ALTER TABLE daily_challenges
  ADD CONSTRAINT daily_challenges_user_date_domain_key
  UNIQUE (user_id, challenge_date, domain);
