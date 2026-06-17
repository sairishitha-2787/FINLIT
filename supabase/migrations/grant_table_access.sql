-- THE REAL FIX for the 403 "permission denied for table" errors.
-- Raw CREATE TABLE in the SQL editor does NOT grant the API roles
-- (anon / authenticated) access to the table, so PostgREST returns 403
-- BEFORE row-level security is even evaluated. RLS still protects rows
-- (auth.uid() = user_id), so granting here is safe — users only ever see
-- their own data. Run this in the Supabase SQL Editor.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.defeated_bosses  TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications    TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_challenges TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_badges      TO anon, authenticated;

-- Make sure RLS stays ON (so the grants above can't expose other users' rows)
ALTER TABLE public.defeated_bosses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges      ENABLE ROW LEVEL SECURITY;
