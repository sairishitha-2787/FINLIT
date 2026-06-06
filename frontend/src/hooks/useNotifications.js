// useNotifications — read + mutate the in-app notification center.
// Powers the bell (unread count + dropdown) and the full center page.
// Graceful: if the `notifications` table doesn't exist yet, returns empty.

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { loadNotifPrefs, saveNotifPrefs } from '../services/notificationsService';

export function useNotifications() {
  const { user } = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefsState] = useState(loadNotifPrefs);
  const channelRef = useRef(null);

  const unread = items.filter((n) => !n.read).length;

  const load = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('archived', false)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setItems(data || []);
    } catch {
      setItems([]); // table missing → empty center
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // Realtime: prepend new notifications as they're inserted
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`notifications_${user.id}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setItems((prev) => (prev.some((n) => n.id === payload.new.id) ? prev : [payload.new, ...prev]));
        })
      .subscribe();
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markRead = useCallback(async (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try { await supabase.from('notifications').update({ read: true }).eq('id', id); } catch { /* ignore */ }
  }, []);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try { await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false); } catch { /* ignore */ }
  }, [user]);

  const archive = useCallback(async (id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    try { await supabase.from('notifications').update({ archived: true }).eq('id', id); } catch { /* ignore */ }
  }, []);

  const remove = useCallback(async (id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    try { await supabase.from('notifications').delete().eq('id', id); } catch { /* ignore */ }
  }, []);

  const setPref = useCallback((key, value) => {
    setPrefsState((prev) => {
      const next = { ...prev, [key]: value };
      saveNotifPrefs(next);
      return next;
    });
  }, []);

  return { items, unread, loading, markRead, markAllRead, archive, remove, refresh: load, prefs, setPref };
}
