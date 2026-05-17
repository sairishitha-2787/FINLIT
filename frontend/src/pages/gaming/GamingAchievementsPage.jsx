// frontend/src/pages/gaming/GamingAchievementsPage.jsx
// Gaming achievements page — /gaming/achievements
// Merges GAMING_BADGES_CONFIG with live Supabase earned data from useBadgeTracker.

import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useBadgeTracker } from '../../hooks/useBadgeTracker';
import AchievementsPage from '../../components/achievements/AchievementsPage';
import { GAMING_BADGES_CONFIG } from '../../config/badgesConfig';
import { gamingTheme } from '../../styles/gamingTheme';

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

export default function GamingAchievementsPage() {
  const { colors } = useOutletContext();
  const { completedTopics, profile, loading } = useUser();
  const { earnedMap, newlyEarned } = useBadgeTracker();

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 14 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid rgba(${hexToRgbStr(colors?.primary || '#9FE0D3')},0.20)`, borderTop: `3px solid ${colors?.primary || '#9FE0D3'}`, animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 9, letterSpacing: '0.22em', color: '#8899bb', textTransform: 'uppercase' }}>Loading...</span>
    </div>
  );

  // Allow dev override: if user is lan or ray, mark all as unlocked
  const userName = profile?.name?.trim().toLowerCase() ?? '';
  const allUnlocked = userName === 'lan' || userName === 'ray';

  // domainComplete: user has completed all gaming topics (13 zones)
  const domainComplete = (completedTopics || []).length >= 13;

  // Merge config with live earned data
  const today = new Date().toISOString();
  const badges = GAMING_BADGES_CONFIG.map((cfg) => ({
    ...cfg,
    isUnlocked: allUnlocked || !!earnedMap[cfg.id],
    dateEarned: earnedMap[cfg.id] || (allUnlocked ? today : null),
  }));

  // Use the character's element color for badge glows
  const glowColor = colors?.primary || '#9FE0D3';

  return (
    <AchievementsPage
      domain="gaming"
      theme={gamingTheme}
      badges={badges}
      domainComplete={domainComplete}
      sectionLabel="HALL OF RECORDS"
      heading="Achievements"
      earnedLabel="{N} Unlocked"
      newlyEarned={allUnlocked ? null : newlyEarned}
      glowColor={glowColor}
    />
  );
}
