-- Run in Supabase SQL Editor to clear the console REST errors:
--   404 defeated_bosses  → table missing
--   403 notifications / daily_challenges → RLS policies missing or not effective
--   400 user_badges → query referenced a column that didn't exist
-- Safe to run multiple times (idempotent).

-- ── 404: create defeated_bosses ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.defeated_bosses (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  boss_id     text NOT NULL,
  defeated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, boss_id)
);
ALTER TABLE public.defeated_bosses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own defeated bosses" ON public.defeated_bosses;
CREATE POLICY "Users manage own defeated bosses" ON public.defeated_bosses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── 403: re-assert RLS policies on notifications ──────────────────────────────
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own notifications"   ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"   ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- ── 403: re-assert RLS policies on daily_challenges ───────────────────────────
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own daily challenges"   ON public.daily_challenges;
DROP POLICY IF EXISTS "Users can insert own daily challenges" ON public.daily_challenges;
DROP POLICY IF EXISTS "Users can update own daily challenges" ON public.daily_challenges;
CREATE POLICY "Users can read own daily challenges"   ON public.daily_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily challenges" ON public.daily_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily challenges" ON public.daily_challenges FOR UPDATE USING (auth.uid() = user_id);

-- ── 400: ensure user_badges has the timestamp columns the app reads ───────────
ALTER TABLE public.user_badges ADD COLUMN IF NOT EXISTS earned_at  timestamptz DEFAULT now();
ALTER TABLE public.user_badges ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
