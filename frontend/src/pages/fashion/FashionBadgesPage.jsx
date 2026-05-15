// frontend/src/pages/fashion/FashionBadgesPage.jsx
// Fashion badges page — /fashion/achievements
// Merges FASHION_BADGES_CONFIG with live Supabase earned data from useBadgeTracker.

import React from 'react';
import { useFashion } from '../../contexts/FashionContext';
import { useUser } from '../../context/UserContext';
import { useBadgeTracker } from '../../hooks/useBadgeTracker';
import AchievementsPage from '../../components/achievements/AchievementsPage';
import { FASHION_BADGES_CONFIG } from '../../config/badgesConfig';

// ── Fashion theme tokens ──────────────────────────────────────────────────────
const fashionTheme = {
  bg:          '#faf5ec',
  deepRose:    '#9d1f4a',
  midRose:     '#d4537e',
  body:        '#b0627a',
  label:       '#c98a9e',
  gold:        '#fde68a',
  fontHeading: "'Playfair Display', serif",
  fontScript:  "'Sacramento', cursive",
  fontUI:      "'DM Sans', sans-serif",
  cardBg:      'rgba(255,255,255,0.22)',
  glassBorder: 'rgba(247,160,184,0.30)',
  glassBlur:   '24px',
};

export default function FashionBadgesPage() {
  const { defeatedBosses } = useFashion();
  const { completedTopics, profile } = useUser();
  const { earnedMap, newlyEarned } = useBadgeTracker();

  // Allow dev override: if user is lan or ray, mark all as unlocked
  const userName = profile?.name?.trim().toLowerCase() ?? '';
  const allUnlocked = userName === 'lan' || userName === 'ray';

  // domainComplete: all 3 fashion bosses defeated
  const domainComplete = ['boss_boutique', 'boss_atelier', 'boss_runway'].every(
    (b) => (defeatedBosses || []).includes(b)
  );

  // Merge config with live earned data
  const today = new Date().toISOString();
  const badges = FASHION_BADGES_CONFIG.map((cfg) => ({
    ...cfg,
    isUnlocked: allUnlocked || !!earnedMap[cfg.id],
    dateEarned: earnedMap[cfg.id] || (allUnlocked ? today : null),
  }));

  return (
    <AchievementsPage
      domain="fashion"
      theme={fashionTheme}
      badges={badges}
      domainComplete={domainComplete}
      sectionLabel="YOUR COLLECTION"
      heading="Designer Labels"
      earnedLabel="{N} earned"
      newlyEarned={allUnlocked ? null : newlyEarned}
      glowColor="#f7a0b8"
    />
  );
}
