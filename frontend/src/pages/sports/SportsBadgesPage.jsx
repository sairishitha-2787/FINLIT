// frontend/src/pages/sports/SportsBadgesPage.jsx
// Sports Trophy Case — /sports/achievements
// Merges SPORTS_BADGES_CONFIG with live Supabase earned data from useBadgeTracker.

import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useSports } from '../../contexts/SportsContext';
import { useBadgeTracker } from '../../hooks/useBadgeTracker';
import AchievementsPage, { SPORTS_SECTIONS } from '../../components/achievements/AchievementsPage';
import { SPORTS_BADGES_CONFIG } from '../../config/badgesConfig';
import { sportsTheme } from '../../styles/sportsTheme';

function hexToRgbStr(hex = '#E8457A') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const spinnerStyle = (color) => ({
  width: 36, height: 36, borderRadius: '50%',
  border: `3px solid rgba(${hexToRgbStr(color)},0.18)`,
  borderTop: `3px solid ${color}`,
  animation: 'spin 0.8s linear infinite',
});

export default function SportsBadgesPage() {
  const { sportsColor: C } = useOutletContext();
  const { completedTopics, profile, loading } = useUser();
  const { defeatedBosses } = useSports();
  const { earnedMap, newlyEarned } = useBadgeTracker();

  const userName = profile?.name?.trim().toLowerCase() ?? '';
  const allUnlocked = userName === 'lan' || userName === 'ray' || userName === 'reo';

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 14 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={spinnerStyle(C || '#E8457A')} />
      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.40)', textTransform: 'uppercase' }}>Loading...</span>
    </div>
  );

  // domainComplete: all 3 season bosses defeated
  const domainComplete = ['boss_s0', 'boss_s1', 'boss_s2'].every(
    (b) => (defeatedBosses || []).includes(b)
  );

  const badges = SPORTS_BADGES_CONFIG.map((cfg) => ({
    ...cfg,
    isUnlocked: allUnlocked || !!earnedMap[cfg.id],
    dateEarned: earnedMap[cfg.id] || null,
  }));

  return (
    <AchievementsPage
      domain="sports"
      theme={sportsTheme}
      badges={badges}
      domainComplete={domainComplete}
      sections={SPORTS_SECTIONS}
      sectionLabel="TROPHY CASE"
      heading="Trophy Case"
      earnedLabel="{N} Trophies Earned"
      newlyEarned={allUnlocked ? null : newlyEarned}
      glowColor={C || '#E8457A'}
    />
  );
}
