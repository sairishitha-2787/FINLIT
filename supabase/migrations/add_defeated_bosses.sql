-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

CREATE TABLE IF NOT EXISTS defeated_bosses (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  boss_id      TEXT NOT NULL,
  defeated_at  TIMESTAMP DEFAULT NOW(),
  score        DECIMAL(5,2),
  xp_earned    INTEGER,
  UNIQUE(user_id, boss_id)
);

CREATE INDEX IF NOT EXISTS idx_defeated_bosses_user
  ON defeated_bosses(user_id);

-- Row-level security: each user can only read/write their own rows
ALTER TABLE defeated_bosses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own defeated bosses"
  ON defeated_bosses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own defeated bosses"
  ON defeated_bosses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own defeated bosses"
  ON defeated_bosses FOR UPDATE
  USING (auth.uid() = user_id);
