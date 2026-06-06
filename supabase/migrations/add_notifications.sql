-- In-app notification center storage.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
--
-- NOTE: this powers the IN-APP notification center only. Email digests, browser
-- push, and scheduled reminders are NOT included — they require a backend
-- server / cron / email service that this app does not have.

CREATE TABLE IF NOT EXISTS notifications (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL,            -- 'quiz_complete' | 'badge_earned' | 'streak_milestone' | 'daily_challenge' | 'level_up' | ...
  category      TEXT,                     -- 'learning' | 'gamification' | 'reminder'
  title         TEXT NOT NULL,
  description   TEXT,
  icon          TEXT,                     -- emoji
  domain        TEXT,                     -- 'gaming'|'fashion'|'sports'|'music'|null
  action_type   TEXT,                     -- 'review_quiz'|'view_badge'|'start_challenge'|null
  action_target TEXT,                     -- topic name / badge id / etc.
  read          BOOLEAN DEFAULT FALSE,
  archived      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user
  ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON notifications(user_id, read);

-- Row-level security: each user only sees/edits their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);
