-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Enables Row Level Security on all user-data tables.
-- The backend uses the service_role key (bypasses RLS).
-- The frontend uses the anon key + user JWT (subject to RLS via auth.uid()).
-- defeated_bosses already has RLS — skip it here.

-- ─────────────────────────────────────────────
-- user_profiles
-- ─────────────────────────────────────────────
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- progress
-- ─────────────────────────────────────────────
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON progress FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- mentor_conversations
-- Backend inserts/reads via service_role (bypasses RLS).
-- Policies here guard any future direct frontend access.
-- ─────────────────────────────────────────────
ALTER TABLE mentor_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own mentor conversations"
  ON mentor_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mentor conversations"
  ON mentor_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- user_streaks
-- Frontend reads/writes directly via authenticated Supabase client.
-- ─────────────────────────────────────────────
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own streaks"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
  ON user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- user_badges
-- Frontend reads, inserts, and upserts directly.
-- ─────────────────────────────────────────────
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own badges"
  ON user_badges FOR UPDATE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- quiz_results
-- Frontend inserts; reads happen via backend (service_role).
-- ─────────────────────────────────────────────
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quiz results"
  ON quiz_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);
