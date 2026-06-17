// MasteryBanner — explicit "70% to unlock" rule + progress, for any playbook.
// Self-contained: pass the domain's ordered topic names + the user's completed
// (passed) topics + theme. It computes mastered count, the next gated topic,
// and the best score on its prerequisite (via useMasteryProgress).

import React, { useMemo } from 'react';
import { Lock, Target } from 'lucide-react';
import { useMasteryProgress, MASTERY_THRESHOLD } from '../hooks/useMasteryProgress';

const DEFAULT_THEME = {
  surface: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)',
  textPrimary: '#fff', textMuted: 'rgba(255,255,255,0.55)',
  radius: 12, fontHeading: "'Inter', sans-serif", fontBody: "'Inter', sans-serif",
};

export default function MasteryBanner({ topics = [], completed = [], accent = '#a78bfa', theme: themeProp }) {
  const t = { ...DEFAULT_THEME, ...(themeProp || {}) };
  const C = accent;
  const { bestScore } = useMasteryProgress();
  const done = new Set(completed);

  const { passed, total, nextTopic, prereq } = useMemo(() => {
    const total = topics.length;
    const passed = topics.filter((n) => done.has(n)).length;
    // First topic that's gated: previous topic not yet passed (topic 1 is free)
    let nextTopic = null, prereq = null;
    for (let i = 1; i < topics.length; i++) {
      if (!done.has(topics[i]) && !done.has(topics[i - 1])) { nextTopic = topics[i]; prereq = topics[i - 1]; break; }
    }
    return { passed, total, nextTopic, prereq };
  }, [topics, completed]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!total) return null;
  const pct = Math.round((passed / total) * 100);
  const prereqBest = prereq ? bestScore(prereq) : null;

  return (
    <div style={{
      marginBottom: 18, padding: '14px 16px', borderRadius: t.radius,
      background: t.surface, border: `1px solid ${t.border}`, borderLeft: `3px solid ${C}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Target size={15} color={C} />
        <span style={{ fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, color: t.textPrimary }}>
          Score {MASTERY_THRESHOLD}%+ to unlock the next topic
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: t.fontHeading, fontSize: 13, letterSpacing: 0.5, color: C }}>
          {passed} / {total} mastered
        </span>
      </div>

      {/* progress bar */}
      <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: C, transition: 'width 0.6s ease' }} />
      </div>

      {/* next gated topic + prerequisite best score */}
      {nextTopic && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 9, fontFamily: t.fontBody, fontSize: 11, color: t.textMuted }}>
          <Lock size={11} color={t.textMuted} />
          <span>
            Up next: <b style={{ color: t.textPrimary }}>{nextTopic}</b> — requires {MASTERY_THRESHOLD}% on {prereq}
            {prereqBest != null
              ? <> (your best: <b style={{ color: prereqBest >= MASTERY_THRESHOLD ? '#22C55E' : C }}>{prereqBest}%</b>)</>
              : ' (not attempted yet)'}
          </span>
        </div>
      )}
    </div>
  );
}
