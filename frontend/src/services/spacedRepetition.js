// Spaced repetition — review-priority calculation + the enable/disable pref.
// Derives "suggested for review" topics from existing `progress` rows + the
// topic registry. Pure functions; no DB writes. Pref lives in localStorage.

import { getTopicsForDomain, buildLearnState } from '../data/dailyChallengeTopics';

const SR_PREF_KEY = 'finlit_spaced_rep_enabled';
const DIFF_WEIGHT = { easy: 1, medium: 2, hard: 3 };
const PRIORITY_THRESHOLD = 50;
const MASTERED_PCT = 90;

// ── Preference (localStorage; default ON) ─────────────────────────────────────
export function loadSRPref() {
  try {
    const raw = localStorage.getItem(SR_PREF_KEY);
    return raw === null ? true : raw === 'true';
  } catch { return true; }
}
export function saveSRPref(enabled) {
  try { localStorage.setItem(SR_PREF_KEY, enabled ? 'true' : 'false'); } catch { /* ignore */ }
}

const pct = (s, t) => (t ? Math.round((s / t) * 100) : 0);
const daysBetween = (iso) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));

// Urgency tier from score + recency
function urgency(scorePct, days) {
  if (scorePct < 70 && days <= 1)  return { key: 'now',   label: 'Review now',       icon: '🔥', color: '#EF4444' };
  if (scorePct < 75 && days <= 3)  return { key: 'soon',  label: 'Review soon',      icon: '⚡', color: '#FBBF24' };
  if (scorePct < 80 && days <= 7)  return { key: 'week',  label: 'Review this week', icon: '⏰', color: '#3B82F6' };
  if (scorePct < 85 && days <= 14) return { key: 'soon',  label: 'Refresh memory',   icon: '📚', color: '#FBBF24' };
  return { key: 'long', label: 'Long-term review', icon: '📚', color: '#9CA3AF' };
}

// ── Compute suggestions for one domain ────────────────────────────────────────
// progressRows: raw `progress` rows ({ topic, score, total_questions, completed_at })
// Returns sorted, filtered, capped list of suggestion objects.
export function computeSuggestions(progressRows, domain, limit = 5) {
  const domainTopics = getTopicsForDomain(domain);
  const byName = new Map(domainTopics.map((t) => [t.name, t]));

  // group attempts by topic name (only topics that belong to this domain)
  const groups = new Map();
  (progressRows || []).forEach((r) => {
    if (r.score == null || !r.total_questions) return;
    if (!byName.has(r.topic)) return;
    const g = groups.get(r.topic) || { attempts: 0, latest: null };
    g.attempts += 1;
    if (!g.latest || new Date(r.completed_at) > new Date(g.latest.completed_at)) g.latest = r;
    groups.set(r.topic, g);
  });

  const suggestions = [];
  groups.forEach((g, name) => {
    const meta      = byName.get(name);
    const scorePct  = pct(g.latest.score, g.latest.total_questions);
    if (scorePct >= MASTERED_PCT) return; // mastered — skip
    const days      = daysBetween(g.latest.completed_at);
    const diffW     = DIFF_WEIGHT[meta.difficulty] || 2;
    const priority  = (100 - scorePct) + (g.attempts * 10) + (days * 5) + (diffW * 2);
    if (priority <= PRIORITY_THRESHOLD) return;
    suggestions.push({
      key: meta.key,
      topic: name,
      topicId: meta.topicId,
      difficulty: meta.difficulty,
      learnPath: meta.learnPath,
      learnState: buildLearnState(meta),
      lastScore: scorePct,
      attempts: g.attempts,
      daysSince: days,
      priority,
      urgency: urgency(scorePct, days),
    });
  });

  suggestions.sort((a, b) => b.priority - a.priority);
  return suggestions.slice(0, limit);
}
