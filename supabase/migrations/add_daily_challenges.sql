-- Daily Cipher (daily challenge) storage.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
--
-- One row per user per day. The current streak is derived from the history of
-- completed rows (consecutive challenge_date values), so no extra streak table
-- is needed — this leaves the existing `user_streaks` (activity streak) untouched.

CREATE TABLE IF NOT EXISTS daily_challenges (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL,
  domain         TEXT NOT NULL,            -- 'gaming' | 'fashion' | 'sports' | 'music'
  topic_key      TEXT NOT NULL,            -- registry key, e.g. 'music:mt_0_0'
  topic_id       TEXT,                     -- domain topic id (null for gaming/fashion)
  topic_name     TEXT NOT NULL,            -- denormalized for display
  difficulty     TEXT,                     -- 'easy' | 'medium' | 'hard'
  completed      BOOLEAN DEFAULT FALSE,
  completed_at   TIMESTAMP,
  xp_earned      INTEGER DEFAULT 0,
  streak_count   INTEGER DEFAULT 0,        -- streak achieved when this day was completed
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, challenge_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_challenges_user
  ON daily_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_user_date
  ON daily_challenges(user_id, challenge_date DESC);

-- Row-level security: each user can only read/write their own rows
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily challenges"
  ON daily_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily challenges"
  ON daily_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily challenges"
  ON daily_challenges FOR UPDATE
  USING (auth.uid() = user_id);
