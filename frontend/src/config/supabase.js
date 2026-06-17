import { createClient, processLock } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Missing Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Use an in-memory lock instead of the Web Locks API. The default
    // navigatorLock triggers "lock not released within 5000ms" warnings when
    // React StrictMode double-mounts (or multiple tabs contend) on the auth
    // token. processLock serializes auth calls within this tab without timeouts.
    lock: processLock,
  },
});
