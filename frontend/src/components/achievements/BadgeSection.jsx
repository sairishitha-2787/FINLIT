// frontend/src/components/achievements/BadgeSection.jsx
// Collapsible section for a category of badges.
// Shows header with icon + title + earned count, animates expand/collapse.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import BadgeCard from './BadgeCard';
import { hexW } from './hexUtils';

// ── Tier sort order (higher = better) ────────────────────────────────────────
const TIER_ORDER = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };

// ── Sort badges: unlocked first (newest first), then locked ──────────────────
function sortBadges(badges) {
  const unlocked = badges
    .filter((b) => b.isUnlocked)
    .sort((a, b) => {
      const da = a.dateEarned ? new Date(a.dateEarned).getTime() : 0;
      const db = b.dateEarned ? new Date(b.dateEarned).getTime() : 0;
      return db - da; // newest first
    });
  const locked = badges.filter((b) => !b.isUnlocked);
  return [...unlocked, ...locked];
}

export default function BadgeSection({
  title,
  icon,
  badges,
  domain,
  defaultExpanded = true,
  earnedCount,
  theme,
  columns = 6,
  glowColor,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!badges || badges.length === 0) return null;

  const isGaming = domain === 'gaming';
  const isSports = domain === 'sports';
  const isMusic  = domain === 'music';
  const isDark   = isGaming || isSports || isMusic;
  const allEarned = earnedCount === badges.length && badges.length > 0;

  const sorted = sortBadges(badges);

  // The accent color (glowColor for sports, theme mint for gaming, theme rose for fashion)
  const accentColor = isSports
    ? (glowColor || '#E8457A')
    : isGaming
      ? (theme.mint || '#9FE0D3')
    : isMusic
      ? (glowColor || '#D798A3')
      : (theme.midRose || '#d4537e');

  // Theme-specific styles
  const headerBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.18)';
  const headerBorder = isDark
    ? '1px solid rgba(255,255,255,0.08)'
    : '1px solid rgba(247,160,184,0.20)';
  const titleColor = isDark ? '#ffffff' : (theme.deepRose || '#9d1f4a');
  const titleFont = isSports
    ? (theme.fontSub || "'Barlow Condensed', sans-serif")
    : isMusic
      ? (theme.fontHeading || "'Cormorant Garamond', serif")
    : theme.fontHeading || (isGaming ? '"Orbitron", sans-serif' : "'Playfair Display', serif");
  const countColor = isDark ? 'rgba(255,255,255,0.40)' : (theme.body || '#b0627a');
  const countFont = isSports
    ? (theme.fontSub || "'Barlow Condensed', sans-serif")
    : isMusic
      ? (theme.fontSub || "'DM Sans', sans-serif")
    : isGaming
      ? (theme.fontLabel || '"Michroma", sans-serif')
      : (theme.fontUI || "'DM Sans', sans-serif");
  const chevronColor = accentColor;
  const iconColor = accentColor;
  const contentBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)';

  const badgeSize = 100;
  const badgeW = hexW(badgeSize);

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: headerBorder,
        background: contentBg,
        marginBottom: 4,
      }}
    >
      {/* Section header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 18px',
          background: headerBg,
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          outline: 'none',
          borderBottom: expanded ? headerBorder : 'none',
          transition: 'background 0.15s',
        }}
      >
        {/* Chevron */}
        <motion.span
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{ display: 'flex', alignItems: 'center', color: chevronColor, flexShrink: 0 }}
        >
          <ChevronRight size={16} />
        </motion.span>

        {/* Icon */}
        <span style={{ display: 'flex', alignItems: 'center', color: iconColor, flexShrink: 0 }}>
          {icon}
        </span>

        {/* Title */}
        <span
          style={{
            fontFamily: titleFont,
            fontSize: isSports ? 13 : isGaming ? 11 : 13,
            fontWeight: isDark ? 700 : 600,
            color: titleColor,
            letterSpacing: isSports ? '0.08em' : isGaming ? '1.5px' : '0.2px',
            textTransform: isDark ? 'uppercase' : 'none',
            flex: 1,
          }}
        >
          {title}
        </span>

        {/* Earned count */}
        <span
          style={{
            fontFamily: countFont,
            fontSize: 11,
            color: allEarned ? accentColor : countColor,
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
          }}
        >
          {allEarned && (
            <span style={{ fontSize: 12 }}>✓</span>
          )}
          {earnedCount} earned
        </span>
      </button>

      {/* Collapsible badge grid */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '20px 18px 24px',
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, ${badgeW}px)`,
                gap: '12px 16px',
                justifyContent: 'start',
              }}
            >
              {sorted.map((badge, idx) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.22, ease: 'easeOut' }}
                >
                  <BadgeCard badge={badge} domain={domain} size={badgeSize} glowColor={glowColor} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
