// frontend/src/components/achievements/AchievementsPage.jsx
// Shared achievements page used by both gaming (/gaming/achievements)
// and fashion (/fashion/achievements) domains.
// Handles: filter bar, sort control, grouped collapsible sections,
// flat sorted view, secret badge section, toast for newly earned badges.

import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  Swords,
  Target,
  Flame,
  Trophy,
  Crown,
  Sparkles,
} from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import BadgeCard from './BadgeCard';
import BadgeSection from './BadgeSection';
import { hexW } from './hexUtils';

// ── Tier sort weight (higher = better) ───────────────────────────────────────
const TIER_WEIGHT = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };

// ── Default section definitions (gaming / fashion) ───────────────────────────
const DEFAULT_SECTIONS = [
  { key: 'progression',  label: 'Progression',           icon: <Map size={15} /> },
  { key: 'boss_battles', label: 'Boss Battles',           icon: <Swords size={15} /> },
  { key: 'mastery',      label: 'Mastery',                icon: <Target size={15} /> },
  { key: 'streaks',      label: 'Streaks & Milestones',   icon: <Flame size={15} /> },
  { key: 'special',      label: 'Special Achievements',   icon: <Trophy size={15} /> },
  { key: 'elite',        label: 'Elite',                  icon: <Crown size={15} /> },
  { key: 'secret',       label: 'Surprises',              icon: <Sparkles size={15} /> },
];

// ── Sports section definitions ────────────────────────────────────────────────
export const SPORTS_SECTIONS = [
  { key: 'progression', label: 'Milestones',   icon: <Trophy size={15} /> },
  { key: 'performance', label: 'Performance',  icon: <Target size={15} /> },
  { key: 'season',      label: 'Season',       icon: <Swords size={15} /> },
  { key: 'mastery',     label: 'Mastery',      icon: <Map size={15} /> },
  { key: 'streaks',     label: 'Streaks',      icon: <Flame size={15} /> },
  { key: 'special',     label: 'Special',      icon: <Sparkles size={15} /> },
  { key: 'elite',       label: 'Elite',        icon: <Crown size={15} /> },
  { key: 'secret',      label: 'Surprises',    icon: <Sparkles size={15} /> },
];

// ── Date formatter ─────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ── Badge NEW detection ──────────────────────────────────────────────────────
function withIsNew(badges) {
  const now = Date.now();
  return badges.map((b) => ({
    ...b,
    isNew: b.isUnlocked && b.dateEarned
      ? now - new Date(b.dateEarned).getTime() < 86400000
      : false,
  }));
}

// ── Toast notification ────────────────────────────────────────────────────────
function BadgeToast({ newlyEarned, domain, theme, onDismiss }) {
  const isGaming = domain === 'gaming';
  const isSports = domain === 'sports';
  const isDark   = isGaming || isSports;
  const isSecret = newlyEarned?.secret;

  useEffect(() => {
    if (!newlyEarned) return;
    const delay = isSecret ? 6000 : 4000;
    const t = setTimeout(onDismiss, delay);
    return () => clearTimeout(t);
  }, [newlyEarned, isSecret, onDismiss]);

  if (!newlyEarned) return null;

  const toastStyle = isDark
    ? {
        background: isSports ? 'rgba(15,15,15,0.97)' : 'rgba(30,42,69,0.97)',
        border: `1px solid ${isSecret ? '#F59E0B' : isGaming ? 'rgba(159,224,211,0.60)' : 'rgba(255,255,255,0.22)'}`,
        borderRadius: 16,
        padding: '18px 24px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.60)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        minWidth: 260,
        maxWidth: 340,
      }
    : {
        background: 'rgba(255,252,248,0.97)',
        border: `1px solid ${isSecret ? '#fde68a' : 'rgba(247,160,184,0.60)'}`,
        borderRadius: 16,
        padding: '18px 24px',
        boxShadow: '0 12px 48px rgba(157,31,74,0.20)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        minWidth: 260,
        maxWidth: 340,
      };

  const headerText = isSports
    ? 'TROPHY UNLOCKED'
    : isGaming
      ? 'ACHIEVEMENT UNLOCKED'
      : 'DESIGNER LABEL EARNED';
  const headerFont = isSports
    ? "'Barlow Condensed', sans-serif"
    : isGaming
      ? '"Orbitron", sans-serif'
      : "'Playfair Display', serif";
  const headerColor = isDark
    ? (isSecret ? '#F59E0B' : isGaming ? '#9FE0D3' : '#fff')
    : (isSecret ? '#fde68a' : '#9d1f4a');
  const nameColor = isDark ? '#fff' : '#9d1f4a';
  const nameFont = isSports
    ? (theme?.fontHeading || "'Bebas Neue', cursive")
    : isGaming
      ? '"Jura", sans-serif'
      : "'DM Sans', sans-serif";

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{
        position: 'fixed',
        bottom: 32,
        right: 24,
        zIndex: 999999,
        ...toastStyle,
      }}
    >
      {isSecret && (
        <div style={{
          fontFamily: headerFont,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '2px',
          color: isGaming ? '#F59E0B' : '#fde68a',
          marginBottom: 4,
          textTransform: 'uppercase',
        }}>
          ★ SECRET UNLOCKED ★
        </div>
      )}
      <div style={{
        fontFamily: headerFont,
        fontSize: isGaming ? 9 : 11,
        fontWeight: 700,
        letterSpacing: isGaming ? '2px' : '1px',
        color: headerColor,
        textTransform: isGaming ? 'uppercase' : 'none',
        marginBottom: 6,
      }}>
        {headerText}
      </div>
      <div style={{
        fontFamily: nameFont,
        fontSize: 15,
        fontWeight: 600,
        color: nameColor,
      }}>
        {newlyEarned.name}
      </div>
    </motion.div>,
    document.body
  );
}

// ── Main AchievementsPage component ──────────────────────────────────────────
export default function AchievementsPage({
  domain,
  theme,
  badges,
  domainComplete,
  sectionLabel,
  heading,
  earnedLabel,
  newlyEarned,
  glowColor,
  sections: sectionsProp,
}) {
  const { isMobile, isTablet } = useIsMobile();
  const [filter, setFilter] = useState('all');   // 'all' | 'earned' | 'locked'
  const [sort, setSort]     = useState('default'); // 'default' | 'recent' | 'oldest' | 'tier_high' | 'tier_low'
  const [toastVisible, setToastVisible] = useState(false);
  const [currentToast, setCurrentToast] = useState(null);
  const isGaming = domain === 'gaming';
  const isSports = domain === 'sports';
  const isDark   = isGaming || isSports;
  const SECTIONS = sectionsProp || DEFAULT_SECTIONS;

  // Responsive columns
  const columns = isMobile ? 3 : isTablet ? 4 : 6;

  // Show toast when newlyEarned changes
  useEffect(() => {
    if (newlyEarned) {
      setCurrentToast(newlyEarned);
      setToastVisible(true);
    }
  }, [newlyEarned]);

  const dismissToast = () => {
    setToastVisible(false);
    setCurrentToast(null);
  };

  // Annotate badges with isNew flag
  const annotated = useMemo(() => withIsNew(badges), [badges]);

  // Total earned count (including earned secrets)
  const totalEarned = useMemo(
    () => annotated.filter((b) => b.isUnlocked).length,
    [annotated]
  );

  // Apply filter
  const filtered = useMemo(() => {
    if (filter === 'all') {
      // Exclude locked secrets
      return annotated.filter((b) => !(b.secret && !b.isUnlocked));
    }
    if (filter === 'earned') {
      return annotated.filter((b) => b.isUnlocked);
    }
    if (filter === 'locked') {
      return annotated.filter((b) => !b.isUnlocked && !b.secret);
    }
    return annotated;
  }, [annotated, filter]);

  // Flat sorted badges (non-default sort modes)
  const flatSorted = useMemo(() => {
    if (sort === 'recent') {
      return filtered
        .filter((b) => b.isUnlocked)
        .sort((a, b) => {
          const da = a.dateEarned ? new Date(a.dateEarned).getTime() : 0;
          const db = b.dateEarned ? new Date(b.dateEarned).getTime() : 0;
          return db - da;
        });
    }
    if (sort === 'oldest') {
      return filtered
        .filter((b) => b.isUnlocked)
        .sort((a, b) => {
          const da = a.dateEarned ? new Date(a.dateEarned).getTime() : 0;
          const db = b.dateEarned ? new Date(b.dateEarned).getTime() : 0;
          return da - db;
        });
    }
    if (sort === 'tier_high') {
      return [...filtered].sort(
        (a, b) => (TIER_WEIGHT[b.tier] || 0) - (TIER_WEIGHT[a.tier] || 0)
      );
    }
    if (sort === 'tier_low') {
      return [...filtered].sort(
        (a, b) => (TIER_WEIGHT[a.tier] || 0) - (TIER_WEIGHT[b.tier] || 0)
      );
    }
    return filtered;
  }, [filtered, sort]);

  // Sections for default view
  const sectionsData = useMemo(() => {
    return SECTIONS
      .filter((sec) => {
        if (sec.key === 'elite' && !domainComplete) return false;
        if (sec.key === 'secret') {
          // Show Surprises only if at least 1 secret badge is earned
          const earnedSecrets = annotated.filter((b) => b.secret && b.isUnlocked);
          return earnedSecrets.length > 0;
        }
        return true;
      })
      .map((sec) => {
        let sectionBadges;
        if (sec.key === 'secret') {
          // Secret section always shows only earned secrets
          sectionBadges = annotated.filter((b) => b.secret && b.isUnlocked);
        } else {
          // Non-secret sections: apply filter, exclude secrets
          sectionBadges = filtered.filter(
            (b) => b.category === sec.key && !b.secret
          );
        }
        const earnedInSection = annotated.filter(
          (b) => b.category === sec.key && b.isUnlocked && (sec.key !== 'secret' || b.secret)
        ).length;
        return { ...sec, badges: sectionBadges, earnedCount: earnedInSection };
      })
      .filter((sec) => sec.badges.length > 0);
  }, [filtered, annotated, domainComplete]);

  // Earned label with {N} replaced
  const earnedLabelText = earnedLabel.replace('{N}', totalEarned);

  // ── Resolved glow for pills/accents (sports uses character color via glowColor) ─
  const accentColor = isSports
    ? (glowColor || '#E8457A')
    : isGaming
      ? (theme.mint || '#9FE0D3')
      : (theme.deepRose || '#9d1f4a');

  // ── Styles ──────────────────────────────────────────────────────────────────
  const pageBg = isDark ? (theme.bgDark || '#1E2A45') : (theme.bg || '#faf5ec');

  const filterPillBase = {
    padding: '7px 16px',
    borderRadius: 999,
    border: '1px solid',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 12,
    transition: 'all 0.15s',
    outline: 'none',
    letterSpacing: '0.3px',
  };

  const getFilterStyle = (key) => {
    const active = filter === key;
    if (isSports) {
      return {
        ...filterPillBase,
        background: active ? `${accentColor}22` : 'transparent',
        borderColor: active ? accentColor : 'rgba(255,255,255,0.18)',
        color: active ? accentColor : 'rgba(255,255,255,0.45)',
        fontFamily: theme.fontSub || "'Barlow Condensed', sans-serif",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      };
    }
    if (isGaming) {
      return {
        ...filterPillBase,
        background: active ? 'rgba(159,224,211,0.18)' : 'transparent',
        borderColor: active ? (theme.mint || '#9FE0D3') : 'rgba(139,184,233,0.30)',
        color: active ? (theme.mint || '#9FE0D3') : (theme.mutedBlue || '#8BB8E9'),
        fontFamily: theme.fontLabel || '"Michroma", sans-serif',
        fontSize: 10,
        letterSpacing: '1px',
      };
    }
    return {
      ...filterPillBase,
      background: active ? 'rgba(212,83,126,0.12)' : 'transparent',
      borderColor: active ? (theme.midRose || '#d4537e') : 'rgba(247,160,184,0.30)',
      color: active ? (theme.deepRose || '#9d1f4a') : (theme.body || '#b0627a'),
      fontFamily: theme.fontUI || "'DM Sans', sans-serif",
      fontSize: 12,
    };
  };

  const selectStyle = {
    padding: '7px 12px',
    borderRadius: 8,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(247,160,184,0.30)'}`,
    background: isDark ? 'rgba(20,20,20,0.80)' : 'rgba(255,255,255,0.50)',
    color: isDark ? '#fff' : (theme.deepRose || '#9d1f4a'),
    fontFamily: isSports
      ? (theme.fontSub || "'Barlow Condensed', sans-serif")
      : isGaming
        ? (theme.fontBody || '"Jura", sans-serif')
        : (theme.fontUI || "'DM Sans', sans-serif"),
    fontSize: 12,
    cursor: 'pointer',
    outline: 'none',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    appearance: 'none',
    WebkitAppearance: 'none',
    paddingRight: 28,
  };

  const sectionLabelStyle = {
    fontFamily: isSports
      ? (theme.fontSub || "'Barlow Condensed', sans-serif")
      : isGaming
        ? (theme.fontLabel || '"Michroma", sans-serif')
        : (theme.fontUI || "'DM Sans', sans-serif"),
    fontSize: 10,
    letterSpacing: isDark ? '3px' : '0.18em',
    color: isDark ? 'rgba(255,255,255,0.40)' : (theme.label || '#c98a9e'),
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: isSports ? 700 : 500,
  };

  const headingStyle = {
    fontFamily: theme.fontHeading || (isGaming ? '"Orbitron", sans-serif' : "'Playfair Display', serif"),
    fontSize: isMobile ? 22 : 28,
    fontWeight: isGaming ? 800 : 700,
    color: isDark ? '#ffffff' : (theme.deepRose || '#9d1f4a'),
    textTransform: isDark ? 'uppercase' : 'none',
    letterSpacing: isSports ? '3px' : isGaming ? '2px' : '-0.02em',
    margin: 0,
    marginBottom: 4,
  };

  const pillStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 18px',
    borderRadius: 999,
    background: isDark ? `${accentColor}14` : 'rgba(247,160,184,0.10)',
    border: `1px solid ${isDark ? `${accentColor}40` : 'rgba(247,160,184,0.30)'}`,
    fontFamily: isSports
      ? (theme.fontSub || "'Barlow Condensed', sans-serif")
      : isGaming
        ? (theme.fontLabel || '"Michroma", sans-serif')
        : (theme.fontUI || "'DM Sans', sans-serif"),
    fontSize: 12,
    fontWeight: 700,
    color: accentColor,
  };

  // Empty state messages
  const renderEmptyState = () => {
    let msg = '';
    if (filter === 'earned') msg = 'No badges earned yet — keep learning!';
    else if (filter === 'locked') msg = "You've earned every badge. Legendary.";
    else msg = 'No badges found.';

    return (
      <div style={{
        textAlign: 'center',
        padding: '48px 24px',
        fontFamily: isSports
          ? (theme.fontSub || "'Barlow Condensed', sans-serif")
          : isGaming
            ? (theme.fontBody || '"Jura", sans-serif')
            : (theme.fontUI || "'DM Sans', sans-serif"),
        fontSize: 14,
        color: isDark ? 'rgba(255,255,255,0.40)' : (theme.body || '#b0627a'),
      }}>
        {msg}
      </div>
    );
  };

  // Flat grid for non-default sort
  const renderFlatGrid = () => {
    if (flatSorted.length === 0) return renderEmptyState();
    const badgeSize = 100;
    const bw = isSports ? badgeSize : hexW(badgeSize);

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, ${bw}px)`,
        gap: '12px 16px',
        justifyContent: 'start',
        padding: '4px 0',
      }}>
        {flatSorted.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02, duration: 0.22 }}
          >
            <BadgeCard badge={badge} domain={domain} size={badgeSize} glowColor={glowColor} />
          </motion.div>
        ))}
      </div>
    );
  };

  // Grouped sections for default sort
  const renderSections = () => {
    if (sectionsData.length === 0) return renderEmptyState();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sectionsData.map((sec, idx) => {
          const isSecretSection = sec.key === 'secret';
          const sectionTitle = isSecretSection
            ? `Surprises — ${sec.earnedCount} discovered`
            : sec.label;
          return (
            <motion.div
              key={sec.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.25 }}
            >
              <BadgeSection
                title={sectionTitle}
                icon={sec.icon}
                badges={sec.badges}
                domain={domain}
                defaultExpanded={idx === 0}
                earnedCount={sec.earnedCount}
                theme={theme}
                columns={columns}
                glowColor={glowColor}
              />
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
      style={{
        padding: isMobile ? '20px 14px 80px' : '32px 28px 80px',
        maxWidth: '100%',
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <div style={sectionLabelStyle}>{sectionLabel}</div>
        <h1 style={headingStyle}>{heading}</h1>
        {isSports && (
          <div style={{
            fontFamily: theme.fontSub || "'Barlow Condensed', sans-serif",
            fontSize: 12, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: theme.textMuted || 'rgba(255,255,255,0.40)',
            marginTop: 2,
          }}>
            Track your trophies across all seasons
          </div>
        )}
        {isGaming && (
          <div style={{
            fontFamily: theme.fontBody || '"Jura", sans-serif',
            fontSize: 12,
            color: theme.mutedBlue || '#8BB8E9',
            marginTop: 2,
          }}>
            Track your progress across all zones
          </div>
        )}
        {!isGaming && !isSports && (
          <div style={{
            fontFamily: theme.fontScript || "'Sacramento', cursive",
            fontSize: 17,
            color: theme.midRose || '#d4537e',
            marginTop: 2,
          }}>
            Achievements earned on your style journey
          </div>
        )}
      </div>

      {/* Earned count pill */}
      <div style={{ marginBottom: 24 }}>
        <div style={pillStyle}>
          <Trophy size={13} color={accentColor} />
          {earnedLabelText}
        </div>
      </div>

      {/* Filter bar + Sort control */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}>
        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'earned', 'locked'].map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={getFilterStyle(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={selectStyle}
          >
            <option value="default">Default</option>
            <option value="recent">Recently earned</option>
            <option value="oldest">Oldest earned</option>
            <option value="tier_high">Tier: highest first</option>
            <option value="tier_low">Tier: lowest first</option>
          </select>
          <span style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            fontSize: 10,
            color: isDark ? 'rgba(255,255,255,0.40)' : (theme.body || '#b0627a'),
          }}>
            ▾
          </span>
        </div>
      </div>

      {/* Badge content */}
      <AnimatePresence mode="wait">
        {sort === 'default' ? (
          <motion.div
            key="sections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderSections()}
          </motion.div>
        ) : (
          <motion.div
            key="flat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderFlatGrid()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {toastVisible && currentToast && (
          <BadgeToast
            key={currentToast.id}
            newlyEarned={currentToast}
            domain={domain}
            theme={theme}
            onDismiss={dismissToast}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
