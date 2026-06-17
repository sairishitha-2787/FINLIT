-- Analytics event log. One row per meaningful user action so we can later
-- measure retention, drop-off, topic difficulty, and domain popularity.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
--
-- Write-once: the app only ever INSERTs. There is no UPDATE/DELETE path for
-- users (events are an immutable audit trail).

CREATE TABLE IF NOT EXISTS events (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,   -- 'quiz_submitted' | 'badge_earned' | 'daily_challenge_completed' | 'onboarding_completed' | ...
  domain      TEXT,            -- 'gaming'|'fashion'|'sports'|'music'|null (global)
  metadata    JSONB DEFAULT '{}'::jsonb,  -- flat snake_case: { topic_name, score, percent, badge_id, streak_count, ... }
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Common query paths: per-user timeline, by type, and by domain.
CREATE INDEX IF NOT EXISTS idx_events_user_created ON events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type         ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_domain       ON events(domain);
-- GIN index so future analytics can filter on metadata (e.g. metadata->>'score').
CREATE INDEX IF NOT EXISTS idx_events_metadata     ON events USING GIN (metadata);

-- Row-level security: each user can only read and insert their own events.
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Table-level grants for the PostgREST API roles. Without these, the API
-- returns 403 "permission denied for table" BEFORE RLS is evaluated. Only
-- SELECT + INSERT are granted — no UPDATE/DELETE (events are immutable). RLS
-- still scopes every row to its owner.
GRANT SELECT, INSERT ON public.events TO anon, authenticated;
