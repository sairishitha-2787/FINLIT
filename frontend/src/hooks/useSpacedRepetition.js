// useSpacedRepetition — suggested-for-review topics for a domain.
// Reads existing `progress` rows + computes review priority. Respects the
// enable/disable pref (localStorage). Returns empty when disabled.

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProgress } from '../services/progressService';
import { computeSuggestions, loadSRPref, saveSRPref } from '../services/spacedRepetition';

export function useSpacedRepetition({ domain, limit = 5 } = {}) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [enabled, setEnabledState] = useState(loadSRPref);

  const load = useCallback(async () => {
    if (!user || !domain || !enabled) { setSuggestions([]); setLoading(false); return; }
    setLoading(true);
    try {
      const { data } = await fetchUserProgress(user.id);
      setSuggestions(computeSuggestions(data || [], domain, limit));
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  }, [user, domain, enabled, limit]);

  useEffect(() => { load(); }, [load]);

  const setEnabled = useCallback((val) => {
    saveSRPref(val);
    setEnabledState(val);
  }, []);

  return { enabled, setEnabled, suggestions, loading, refresh: load };
}
