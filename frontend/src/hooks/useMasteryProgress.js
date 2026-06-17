// useMasteryProgress — best score per topic, for mastery-gate UI.
// The unlock mechanism itself is unchanged (a topic only completes/unlocks the
// next on a passing quiz). This just surfaces, on locked cards, WHY a topic is
// locked and the user's best score on its prerequisite.

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProgress } from '../services/progressService';

export const MASTERY_THRESHOLD = 70; // % shown as the unlock requirement

export function useMasteryProgress() {
  const { user } = useAuth();
  const [bestByTopic, setBestByTopic] = useState({});

  useEffect(() => {
    if (!user) { setBestByTopic({}); return; }
    let cancelled = false;
    fetchUserProgress(user.id).then(({ data }) => {
      if (cancelled) return;
      const m = {};
      (data || []).forEach((r) => {
        if (r.score == null || !r.total_questions) return;
        const pct = Math.round((r.score / r.total_questions) * 100);
        if (m[r.topic] == null || pct > m[r.topic]) m[r.topic] = pct;
      });
      setBestByTopic(m);
    });
    return () => { cancelled = true; };
  }, [user]);

  // best % for a topic, or null if never attempted
  const bestScore = (topicName) => (topicName in bestByTopic ? bestByTopic[topicName] : null);

  return { bestByTopic, bestScore, threshold: MASTERY_THRESHOLD };
}
