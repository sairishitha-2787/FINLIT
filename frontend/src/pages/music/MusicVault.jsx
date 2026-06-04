// Music domain trophy case — /music/vault
// Merges MUSIC_BADGES_CONFIG with live Supabase earned data from useBadgeTracker.
// Reuses the shared AchievementsPage + BadgeSection + BadgeCard infrastructure.

import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { useMusic } from '../../contexts/MusicContext';
import { useBadgeTracker } from '../../hooks/useBadgeTracker';
import AchievementsPage, { MUSIC_SECTIONS } from '../../components/achievements/AchievementsPage';
import { MUSIC_BADGES_CONFIG } from '../../data/musicBadges';
import { getClusterTheme, CLUSTER_MAP } from '../../styles/musicTheme';

function hexToRgbStr(hex = '#D798A3') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

export default function MusicVault() {
  const { musicColor: C, musicCharacter, musicCluster } = useOutletContext();
  const { completedTopics, profile, loading } = useUser();
  const { user } = useAuth();
  const { defeatedBosses } = useMusic();
  const { earnedMap, newlyEarned } = useBadgeTracker();

  const cluster = musicCluster || CLUSTER_MAP[musicCharacter?.id] || 'vinyl';
  const theme   = getClusterTheme(musicCharacter?.id);
  const color   = C || '#D798A3';

  const PREVIEW_EMAILS = ['hannie@gmail.com'];
  const PREVIEW_NAMES  = ['lan', 'ray'];

  const allUnlocked =
    PREVIEW_EMAILS.includes(user?.email?.toLowerCase()) ||
    PREVIEW_NAMES.includes(profile?.name?.trim().toLowerCase());

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 14 }}>
      <style>{`@keyframes vaultSpin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: `3px solid rgba(${hexToRgbStr(color)},0.18)`,
        borderTop: `3px solid ${color}`,
        animation: 'vaultSpin 0.8s linear infinite',
      }} />
      <span style={{
        fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
      }}>
        Loading…
      </span>
    </div>
  );

  // domainComplete: all 3 music bosses defeated
  const domainComplete = ['music_boss_0', 'music_boss_1', 'music_boss_2'].every(
    b => (defeatedBosses || []).includes(b)
  );

  // Merge static config with live earned data
  const badges = MUSIC_BADGES_CONFIG.map(cfg => ({
    ...cfg,
    isUnlocked: allUnlocked || !!earnedMap[cfg.id],
    dateEarned: earnedMap[cfg.id] || null,
  }));

  return (
    <AchievementsPage
      domain="music"
      theme={theme}
      badges={badges}
      domainComplete={domainComplete}
      sections={MUSIC_SECTIONS}
      sectionLabel="THE VAULT"
      heading="The Vault"
      earnedLabel="{N} Badges Earned"
      newlyEarned={allUnlocked ? null : newlyEarned}
      glowColor={color}
    />
  );
}
