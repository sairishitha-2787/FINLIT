import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, WifiOff } from 'lucide-react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { useIsMobile } from '../hooks/useIsMobile';

import { useDomain } from '../contexts/DomainContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useGamification } from '../hooks/useGamification';

import CharacterSelection from '../components/gaming/CharacterSelection';
import XPBar from '../components/gaming/XPBar';
import GamingSidebar from '../components/gaming/GamingSidebar';
import GamingSettings from '../components/gaming/GamingSettings';
import CharacterSheet from '../components/gaming/CharacterSheet';

import { gamingTheme, getElementColors } from '../styles/gamingTheme';
import { preloadCharacterImages } from '../utils/preloadImages';
import LogoutConfirmModal from '../components/shared/LogoutConfirmModal';

export default function GamingLayout() {
  const navigate  = useNavigate();
  const { character, characterLoaded, updateCharacter, clearCharacter } = useDomain();
  const { logout } = useAuth();
  const { completedTopics } = useUser();
  const {
    xp, level, streak, badges,
    getLevelProgress, getXPForNextLevel,
    awardXP, dismissLevelUp, levelUpNotification,
  } = useGamification();

  const { isMobile } = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSheet, setShowSheet]       = useState(false);

  // Auto-close sidebar when viewport shrinks to mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const handleReconnect = useCallback(() => {}, []);
  const { isOnline } = useOfflineSync(handleReconnect);

  useEffect(() => { preloadCharacterImages(); }, []);

  const showCharSel = characterLoaded && !character;
  const colors      = getElementColors(character);
  const levelProgress = getLevelProgress();
  const xpToNext    = getXPForNextLevel();

  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = async () => { await logout(); navigate('/login', { replace: true }); };

  const handleChangeCharacter = () => {
    clearCharacter();
    setShowSettings(false);
  };

  // Pass gamification + layout callbacks to child pages via outlet context.
  const outletContext = {
    xp, level, streak, badges,
    getLevelProgress, getXPForNextLevel, awardXP,
    colors,
    onOpenSheet: () => setShowSheet(true),
  };

  return (
    <div style={{
      display: 'flex', height: '100vh',
      background: gamingTheme.bgDark,
      overflow: 'hidden',
    }}>
      {/* Character selection overlay */}
      <CharacterSelection isOpen={showCharSel} onSelect={updateCharacter} />

      <LogoutConfirmModal
        open={showLogoutConfirm}
        domain="gaming"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(10,14,30,0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 490,
            }}
          />
        )}
      </AnimatePresence>

      {/* Collapsible sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <GamingSidebar
            key="sidebar"
            character={character}
            onOpenSettings={() => setShowSettings(true)}
            isMobile={isMobile}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <XPBar
          level={level}
          xp={xp}
          levelProgress={levelProgress}
          xpToNextLevel={xpToNext}
          streak={streak}
          character={character}
          onOpenCharacterSheet={() => setShowSheet(true)}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        {/* Scrollable content area */}
        <div style={{
          flex: 1, overflowY: 'auto',
          background: gamingTheme.bgDark,
          position: 'relative',
        }}>
          {/* Cyber grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            backgroundImage: `
              linear-gradient(rgba(139,184,233,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,184,233,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }} />
          {/* Radial vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, ${gamingTheme.bgDark} 100%)`,
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Outlet context={outletContext} />
          </div>
        </div>
      </div>

      {/* Settings drawer */}
      <GamingSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        character={character}
        onChangeCharacter={handleChangeCharacter}
      />

      {/* Character sheet drawer */}
      <CharacterSheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        character={character}
        completedTopics={completedTopics}
        badges={badges}
        level={level}
        xp={xp}
        streak={streak}
      />

      {/* Level-up banner */}
      <AnimatePresence>
        {levelUpNotification && (
          <LevelUpBanner
            newLevel={levelUpNotification.newLevel}
            colors={colors}
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
              position: 'fixed', top: 72, right: 20,
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '10px',
              background: 'rgba(251,146,60,0.15)',
              border: '1px solid rgba(251,146,60,0.45)',
              fontFamily: gamingTheme.fontLabel,
              fontSize: '11px', letterSpacing: '1px',
              color: '#fb923c',
              zIndex: 9000,
              backdropFilter: 'blur(8px)',
            }}
          >
            <WifiOff size={13} />
            Offline — progress saves locally
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LevelUpBanner({ newLevel, colors, onDismiss }) {
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
        padding: '16px 32px',
        borderRadius: '999px',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        boxShadow: `0 0 48px ${colors.glow}, 0 8px 32px rgba(0,0,0,0.4)`,
        display: 'flex', alignItems: 'center', gap: '12px',
      }}
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.2, 0],
            x: Math.cos((i / 6) * Math.PI * 2) * 60,
            y: Math.sin((i / 6) * Math.PI * 2) * 60,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{
            position: 'absolute',
            width: 8, height: 8, borderRadius: '50%',
            background: gamingTheme.stellarWhite,
            pointerEvents: 'none',
          }}
        />
      ))}
      <Zap size={20} color={gamingTheme.bgDark} />
      <span style={{
        fontFamily: gamingTheme.fontHeading,
        fontSize: '18px', fontWeight: 800,
        color: gamingTheme.bgDark, letterSpacing: '2px',
      }}>
        LEVEL UP! → {newLevel}
      </span>
      <Zap size={20} color={gamingTheme.bgDark} />
    </motion.div>
  );
}
