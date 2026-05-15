import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';

import { useSports } from '../contexts/SportsContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useGamification } from '../hooks/useGamification';
import { useIsMobile } from '../hooks/useIsMobile';
import { useOfflineSync } from '../hooks/useOfflineSync';

import SportsCharacterSelection from '../components/sports/SportsCharacterSelection';
import SportsXPBar             from '../components/sports/SportsXPBar';
import SportsSidebar           from '../components/sports/SportsSidebar';
import SportsCharacterSheet    from '../components/sports/SportsCharacterSheet';
import LogoutConfirmModal      from '../components/shared/LogoutConfirmModal';

import { sportsTheme, getDivision } from '../styles/sportsTheme';

// ─── Font injection ───────────────────────────────────────────────────────────
let fontsInjected = false;
function useSportsFonts() {
  useEffect(() => {
    if (fontsInjected) return;
    fontsInjected = true;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@600;800&display=swap';
    document.head.appendChild(link);
  }, []);
}

// ─── Three-layer broadcast background ────────────────────────────────────────
function SportsBackground({ color }) {
  const streaks = useMemo(() =>
    [...Array(14)].map((_, i) => ({
      left: `${(i * 7.2) % 100}%`,
      top:  `${(i * 11.3 + 3) % 100}%`,
      width: `${70 + (i * 41) % 200}px`,
      opacity: 0.12 + (i % 4) * 0.04,
    })), []
  );

  const sparks = useMemo(() =>
    [...Array(30)].map((_, i) => ({
      left:     `${(i * 3.3 + 1) % 100}%`,
      top:      `${(i * 5.8 + 2) % 100}%`,
      size:     1.5 + (i % 3),
      opacity:  0.25 + (i % 3) * 0.15,
      duration: 1.6 + (i % 5) * 0.5,
      delay:    (i % 6) * 0.35,
    })), []
  );

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Layer 1: Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
      }} />

      {/* Layer 2: Speed streaks */}
      {streaks.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: s.left, top: s.top,
          width: s.width, height: '1.5px',
          background: color,
          opacity: s.opacity,
          transform: 'rotate(-25deg)',
          filter: 'blur(0.8px)',
        }} />
      ))}

      {/* Layer 3: Sparks */}
      {sparks.map((s, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [s.opacity * 0.35, s.opacity, s.opacity * 0.35] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: s.left, top: s.top,
            width: s.size, height: s.size,
            borderRadius: '50%', background: color,
          }}
        />
      ))}
    </div>
  );
}

// ─── Promotion banner (level-up equivalent) ───────────────────────────────────
function PromotionBanner({ color, glow, newDiv, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      onClick={onDismiss}
      style={{
        position: 'fixed', top: 72, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999, cursor: 'pointer',
        padding: '14px 28px',
        borderRadius: '8px',
        background: color, color: '#000',
        boxShadow: `0 0 40px ${glow}, 0 8px 32px rgba(0,0,0,0.5)`,
        fontFamily: sportsTheme.fontHeading,
        fontSize: '20px', letterSpacing: '2px',
        whiteSpace: 'nowrap',
      }}
    >
      PROMOTION! → DIVISION {newDiv}
    </motion.div>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────────────────
export default function SportsLayout() {
  useSportsFonts();
  const navigate = useNavigate();

  const { character, characterLoaded, updateCharacter, clearCharacter } = useSports();
  const { logout } = useAuth();
  const { completedTopics } = useUser();
  const {
    xp, level, streak, badges,
    getLevelProgress, getXPForNextLevel,
    awardXP, dismissLevelUp, levelUpNotification,
  } = useGamification();

  const { isMobile } = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [showSheet, setShowSheet]     = useState(false);
  const [showLogout, setShowLogout]   = useState(false);

  const handleReconnect = useCallback(() => {}, []);
  const { isOnline } = useOfflineSync(handleReconnect);

  // Auto-collapse sidebar on mobile viewport
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const showCharSel  = characterLoaded && !character;
  const C            = character?.color || '#E8457A';
  const levelProgress = getLevelProgress();
  const xpToNext     = getXPForNextLevel();
  const division     = getDivision(level);

  const outletContext = {
    sportsCharacter: character,
    sportsColor:  C,
    sportsGlow:   character?.glow  || 'rgba(232,69,122,0.5)',
    sportsDim:    character?.dim   || 'rgba(232,69,122,0.12)',
    sportsBorder: character?.border || 'rgba(232,69,122,0.3)',
    xp, level, streak, badges, division, levelProgress,
    getLevelProgress, getXPForNextLevel, awardXP,
    onOpenSheet: () => setShowSheet(true),
  };

  return (
    <div style={{
      display: 'flex', height: '100vh',
      background: sportsTheme.bgDark,
      overflow: 'hidden',
    }}>
      {/* Character selection overlay */}
      <SportsCharacterSelection isOpen={showCharSel} onSelect={updateCharacter} />

      <LogoutConfirmModal
        open={showLogout}
        domain="sports"
        onConfirm={async () => { await logout(); navigate('/login', { replace: true }); }}
        onCancel={() => setShowLogout(false)}
      />

      {/* Sidebar */}
      <SportsSidebar
        character={character}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => { clearCharacter(); }}
      />

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Persistent XP bar */}
        <SportsXPBar
          character={character}
          level={level}
          xp={xp}
          levelProgress={levelProgress}
          xpToNext={xpToNext}
          streak={streak}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onLogout={() => setShowLogout(true)}
          onOpenSheet={() => setShowSheet(true)}
        />

        {/* Scrollable content area */}
        <div style={{
          flex: 1, overflowY: 'auto',
          background: sportsTheme.bgDark,
          position: 'relative',
        }}>
          <SportsBackground color={C} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Outlet context={outletContext} />
          </div>
        </div>
      </div>

      {/* Character sheet drawer */}
      <SportsCharacterSheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        character={character}
        xp={xp}
        level={level}
        streak={streak}
        completedTopics={completedTopics}
        badges={badges}
      />

      {/* Promotion banner (reuses levelUpNotification) */}
      <AnimatePresence>
        {levelUpNotification && (
          <PromotionBanner
            color={C}
            glow={character?.glow || 'rgba(232,69,122,0.5)'}
            newDiv={getDivision(levelUpNotification.newLevel)}
            onDismiss={dismissLevelUp}
          />
        )}
      </AnimatePresence>

      {/* Offline indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            style={{
              position: 'fixed', top: 68, right: 16,
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '6px',
              background: 'rgba(251,146,60,0.12)',
              border: '1px solid rgba(251,146,60,0.35)',
              fontFamily: sportsTheme.fontSub,
              fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#fb923c', zIndex: 9000,
              backdropFilter: 'blur(8px)',
            }}
          >
            <WifiOff size={12} /> OFFLINE — SAVES LOCALLY
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
