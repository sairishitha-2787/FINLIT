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

export default function GamingAchievementsPage() {
  const { colors } = useOutletContext();
  const { completedTopics, profile } = useUser();
  const { earnedMap, newlyEarned } = useBadgeTracker();

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
