import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, BarChart2, Trophy,
  Menu, X, LogOut, WifiOff, FileText, Settings,
  Zap, Target, Library,
} from 'lucide-react';

import { useSports } from '../contexts/SportsContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useGamification } from '../hooks/useGamification';
import { useIsMobile } from '../hooks/useIsMobile';
import { useOfflineSync } from '../hooks/useOfflineSync';

import SportsCharacterSelection from '../components/sports/SportsCharacterSelection';
import SportsCharacterSheet     from '../components/sports/SportsCharacterSheet';
import NotificationBell         from '../components/NotificationBell';
import LogoutConfirmModal        from '../components/shared/LogoutConfirmModal';

import { sportsTheme, getDivision, getDivisionName } from '../styles/sportsTheme';
import { ThemeProvider } from '../context/ThemeContext';
import { normalizeSportsTheme } from '../styles/normalizeTheme';

// ─── Font injection ───────────────────────────────────────────────────────────
let fontsInjected = false;
function useSportsFonts() {
  useEffect(() => {
    if (fontsInjected) return;
    fontsInjected = true;
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@600;800&display=swap';
    document.head.appendChild(link);
  }, []);
}

// ─── Three-layer broadcast background (fixed, full-screen) ───────────────────
function SportsBackground({ color }) {
  const streaks = useMemo(() =>
    [...Array(14)].map((_, i) => ({
      left:  `${(i * 7.2)  % 100}%`,
      top:   `${(i * 11.3 + 3) % 100}%`,
      width: `${70 + (i * 41) % 200}px`,
      opacity: 0.12 + (i % 4) * 0.04,
    })), []);

  const sparks = useMemo(() =>
    [...Array(30)].map((_, i) => ({
      left:     `${(i * 3.3 + 1) % 100}%`,
      top:      `${(i * 5.8 + 2) % 100}%`,
      size:     1.5 + (i % 3),
      opacity:  0.25 + (i % 3) * 0.15,
      duration: 1.6 + (i % 5) * 0.5,
      delay:    (i % 6) * 0.35,
    })), []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>
      {/* Layer 1: Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: sportsTheme.bgDark,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
      }} />

      {/* Layer 2: Speed streaks */}
      {streaks.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: s.left, top: s.top,
          width: s.width, height: '1.5px',
          background: color, opacity: s.opacity,
          transform: 'rotate(-25deg)', filter: 'blur(0.8px)',
        }} />
      ))}

      {/* Layer 3: Sparks */}
      {sparks.map((s, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [s.opacity * 0.35, s.opacity, s.opacity * 0.35] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: s.left, top: s.top,
            width: s.size, height: s.size,
            borderRadius: '50%', background: color,
          }}
        />
      ))}
    </div>
  );
}

// ─── Match Points progress bar ────────────────────────────────────────────────
function MatchBar({ pct, color, width }) {
  return (
    <div style={{
      height: 8, borderRadius: 99,
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.12)',
      overflow: 'hidden', width,
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{
          height: '100%', borderRadius: 99,
          background: color,
          boxShadow: `0 0 10px ${color}70`,
        }}
      />
    </div>
  );
}

// ─── Navigation items ─────────────────────────────────────────────────────────
const NAV = [
  { icon: Home,      label: 'The Tunnel',    path: '/sports'              },
  { icon: BookOpen,  label: 'The Playbook',  path: '/sports/playbook'     },
  { icon: BarChart2, label: 'The Scoreboard',path: '/sports/progress'     },
  { icon: Trophy,    label: 'Trophy Case',   path: '/sports/achievements' },
  { icon: Library,   label: 'Glossary',      path: '/glossary'            },
];

const CHAR_ICON = { lyra: Zap, kael: Target, ian: Trophy };

// ─── Promotion banner (level-up) ──────────────────────────────────────────────
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
        padding: '14px 28px', borderRadius: 8,
        background: color, color: '#000',
        boxShadow: `0 0 40px ${glow}, 0 8px 32px rgba(0,0,0,0.5)`,
        fontFamily: sportsTheme.fontHeading,
        fontSize: 20, letterSpacing: '2px',
        whiteSpace: 'nowrap',
      }}
    >
      PROMOTION! → DIVISION {newDiv}
    </motion.div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function SportsLayout() {
  useSportsFonts();
  const navigate  = useNavigate();
  const location  = useLocation();

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

  useEffect(() => { if (isMobile) setSidebarOpen(false); }, [isMobile]);

  const showCharSel   = characterLoaded && !character;
  const C             = character?.color || '#E8457A';
  const levelProgress = getLevelProgress();
  const division      = getDivision(level);
  const divName       = getDivisionName(division);
  const CharIcon      = CHAR_ICON[character?.id] || Zap;
  const themeValue    = normalizeSportsTheme(C, character?.name || null);

  const isActive = (item) =>
    item.path === '/sports'
      ? location.pathname === '/sports'
      : location.pathname.startsWith(item.path);

  const outletContext = {
    sportsCharacter: character,
    sportsColor:     C,
    sportsGlow:      character?.glow   || 'rgba(232,69,122,0.5)',
    sportsDim:       character?.dim    || 'rgba(232,69,122,0.12)',
    sportsBorder:    character?.border || 'rgba(232,69,122,0.3)',
    xp, level, streak, badges, division, levelProgress,
    getLevelProgress, getXPForNextLevel, awardXP,
    onOpenSheet: () => setShowSheet(true),
  };

  return (
    <>
      {/* ── Fixed broadcast background ───────────────────────────────────── */}
      <SportsBackground color={C} />

      {/* ── Character selection overlay ──────────────────────────────────── */}
      <SportsCharacterSelection isOpen={showCharSel} onSelect={updateCharacter} />

      <LogoutConfirmModal
        open={showLogout}
        domain="sports"
        onConfirm={async () => { await logout(); navigate('/login', { replace: true }); }}
        onCancel={() => setShowLogout(false)}
      />

      {/* ── Layout shell ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', height: '100vh', position: 'relative', zIndex: 1 }}>

        {/* Mobile backdrop */}
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              key="sports-bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.72)',
                backdropFilter: 'blur(3px)',
                zIndex: 490,
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              key="sports-sidebar"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              style={{
                width: 240, flexShrink: 0,
                height: isMobile ? '100vh' : '100%',
                background: 'rgba(12,12,12,0.82)',
                backdropFilter: 'blur(20px) saturate(120%)',
                WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', flexDirection: 'column',
                paddingTop: 24,
                overflowY: 'auto', overflowX: 'hidden',
                position: isMobile ? 'fixed' : 'relative',
                top: 0, left: 0,
                zIndex: isMobile ? 500 : 'auto',
              }}
            >
              {isMobile && (
                <button onClick={() => setSidebarOpen(false)} style={{
                  position: 'absolute', top: 12, right: 12,
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <X size={13} color={C} />
                </button>
              )}

              {/* Right-edge color shimmer */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 1, height: '100%',
                background: `linear-gradient(180deg, transparent, ${C}55 40%, ${C}30 70%, transparent)`,
                pointerEvents: 'none',
              }} />

              {/* Wordmark */}
              <div style={{
                padding: '0 20px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                marginBottom: 8,
              }}>
                <div style={{
                  fontFamily: sportsTheme.fontHeading,
                  fontSize: 26, letterSpacing: '3px',
                }}>
                  <span style={{ color: '#fff' }}>FIN</span>
                  <span style={{ color: C, textShadow: `0 0 12px ${character?.glow || 'rgba(232,69,122,0.4)'}` }}>LIT</span>
                </div>
                <div style={{
                  fontFamily: sportsTheme.fontSub,
                  fontWeight: 600, fontSize: 10,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: sportsTheme.textMuted, marginTop: 2,
                }}>
                  {divName} · Division {division}
                </div>
              </div>

              {/* Character mini-card */}
              {character && (
                <motion.div
                  whileHover={{ x: 2 }}
                  onClick={() => setShowSheet(true)}
                  style={{
                    margin: '0 12px 12px', padding: '10px 12px',
                    borderRadius: 10, cursor: 'pointer',
                    background: character?.dim || 'rgba(232,69,122,0.08)',
                    border: `1px solid ${character?.border || 'rgba(232,69,122,0.22)'}`,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                    background: character?.dim,
                    border: `1.5px solid ${C}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 10px ${character?.glow}`,
                    overflow: 'hidden',
                  }}>
                    {character?.chibiImage
                      ? <img src={character.chibiImage} alt={character.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                          onError={(e) => { e.target.style.display = 'none'; }} />
                      : <CharIcon size={20} color={C} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <motion.div
                      animate={{ opacity: [0.55, 1, 0.55] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      style={{
                        fontFamily: sportsTheme.fontSub, fontWeight: 600,
                        fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
                        color: C, marginBottom: 1,
                      }}
                    >
                      Active
                    </motion.div>
                    <div style={{
                      fontFamily: sportsTheme.fontHeading,
                      fontSize: 17, letterSpacing: '1px',
                      color: sportsTheme.textPrimary,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {character.name}
                    </div>
                    <div style={{
                      fontFamily: sportsTheme.fontSub, fontWeight: 600,
                      fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: sportsTheme.textMuted,
                    }}>
                      {character.title || character.role}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Nav section label */}
              <div style={{
                padding: '0 20px 6px',
                fontFamily: sportsTheme.fontSub, fontWeight: 600,
                fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: sportsTheme.textMuted,
              }}>
                Navigate
              </div>

              {/* Nav items */}
              <nav style={{ padding: '0 10px' }}>
                {NAV.map((item) => {
                  const { icon: Icon, label, path } = item;
                  const active = isActive(item);
                  return (
                    <motion.button
                      key={label}
                      whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { navigate(path); if (isMobile) setSidebarOpen(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 14px', marginBottom: 3, borderRadius: 8,
                        fontFamily: sportsTheme.fontSub,
                        fontSize: 13, fontWeight: active ? 700 : 600,
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                        color: active ? '#fff' : sportsTheme.textMuted,
                        background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                        border: 'none',
                        borderLeft: `2.5px solid ${active ? C : 'transparent'}`,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <Icon
                        size={15} strokeWidth={2}
                        style={{ color: active ? C : 'rgba(255,255,255,0.35)', flexShrink: 0 }}
                      />
                      {label}
                      {active && (
                        <motion.div
                          layoutId="sports-nav-dot"
                          style={{
                            marginLeft: 'auto',
                            width: 5, height: 5, borderRadius: '50%',
                            background: C, boxShadow: `0 0 8px ${C}`,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}

                {/* Player Card */}
                {character && (
                  <motion.button
                    whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowSheet(true)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 14px', marginBottom: 3, borderRadius: 8,
                      fontFamily: sportsTheme.fontSub,
                      fontSize: 13, fontWeight: 600,
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      color: sportsTheme.textMuted, background: 'transparent',
                      border: 'none', borderLeft: '2.5px solid transparent',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <FileText size={15} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
                    Player Card
                  </motion.button>
                )}

                {/* The Locker Room (settings page) */}
                <motion.button
                  whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { navigate('/sports/settings'); if (isMobile) setSidebarOpen(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', marginBottom: 3, borderRadius: 8,
                    fontFamily: sportsTheme.fontSub,
                    fontSize: 13, fontWeight: 600,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    color: location.pathname === '/sports/settings' ? '#fff' : sportsTheme.textMuted,
                    background: location.pathname === '/sports/settings' ? 'rgba(255,255,255,0.05)' : 'transparent',
                    border: 'none',
                    borderLeft: `2.5px solid ${location.pathname === '/sports/settings' ? C : 'transparent'}`,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <Settings
                    size={15} strokeWidth={2}
                    style={{ color: location.pathname === '/sports/settings' ? C : 'rgba(255,255,255,0.25)', flexShrink: 0 }}
                  />
                  The Locker Room
                </motion.button>
              </nav>

              <div style={{ flex: 1 }} />

              {/* Match Points mini bar */}
              <div style={{
                margin: '0 14px 12px', padding: '14px 16px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{
                    fontFamily: sportsTheme.fontSub, fontWeight: 600,
                    fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: sportsTheme.textMuted,
                  }}>
                    Match Points
                  </span>
                  <span style={{
                    fontFamily: sportsTheme.fontHeading,
                    fontSize: 14, letterSpacing: '1px', color: C,
                  }}>
                    {xp?.toLocaleString()}
                  </span>
                </div>
                <MatchBar pct={levelProgress} color={C} />
              </div>

              {/* Sign out */}
              <div style={{ padding: '0 10px 20px' }}>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
                <motion.button
                  whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowLogout(true)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 8,
                    fontFamily: sportsTheme.fontSub, fontWeight: 600,
                    fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: sportsTheme.textMuted,
                    background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <LogOut size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
                  Sign out
                </motion.button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Main column ──────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Top bar */}
          <div style={{
            height: 56, flexShrink: 0,
            display: 'flex', alignItems: 'center',
            padding: '0 20px', gap: 16,
            background: 'rgba(12,12,12,0.78)',
            backdropFilter: 'blur(20px) saturate(120%)',
            WebkitBackdropFilter: 'blur(20px) saturate(120%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <button
              onClick={() => setSidebarOpen(p => !p)}
              style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Menu size={16} color={C} />
            </button>

            {(!sidebarOpen || isMobile) ? (
              <span style={{ fontFamily: sportsTheme.fontHeading, fontSize: 22, letterSpacing: '3px', flex: 1 }}>
                <span style={{ color: '#fff' }}>FIN</span>
                <span style={{ color: C }}>LIT</span>
              </span>
            ) : (
              <div style={{ flex: 1 }} />
            )}

            <NotificationBell accent={C} theme={{ surface: 'rgba(18,18,18,0.98)', border: 'rgba(255,255,255,0.12)', textPrimary: '#fff', textMuted: 'rgba(255,255,255,0.5)', fontHeading: sportsTheme.fontHeading, fontBody: sportsTheme.fontBody }} />

            {/* Character avatar chip */}
            {character && (
              <motion.button
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowSheet(true)}
                style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: character?.dim,
                  border: `1.5px solid ${C}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', padding: 0, overflow: 'hidden',
                  boxShadow: `0 0 10px ${character?.glow}`,
                }}
              >
                {character?.chibiImage
                  ? <img src={character.chibiImage} alt={character.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  : <CharIcon size={18} color={C} />}
              </motion.button>
            )}

            {/* Match Points strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: sportsTheme.fontHeading,
                fontSize: 14, letterSpacing: '1px',
                color: C, whiteSpace: 'nowrap',
              }}>
                {xp?.toLocaleString()} MP
              </span>
              <MatchBar pct={levelProgress} color={C} width={80} />
              <span style={{
                fontFamily: sportsTheme.fontSub, fontWeight: 600,
                fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: sportsTheme.textMuted, whiteSpace: 'nowrap',
              }}>
                D{division}
              </span>
            </div>
          </div>

          {/* Scrollable content — transparent so background shows through */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <ThemeProvider value={themeValue}>
              <Outlet context={outletContext} />
            </ThemeProvider>
          </div>
        </div>
      </div>

      {/* ── Character sheet drawer ──────────────────────────────────────── */}
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

      {/* ── Promotion banner ─────────────────────────────────────────────── */}
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

      {/* ── Offline indicator ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            style={{
              position: 'fixed', top: 68, right: 16,
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 99,
              background: 'rgba(251,146,60,0.12)',
              border: '1px solid rgba(251,146,60,0.35)',
              fontFamily: sportsTheme.fontSub,
              fontSize: 10, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#fb923c', zIndex: 9000,
              backdropFilter: 'blur(8px)',
            }}
          >
            <WifiOff size={12} /> OFFLINE — SAVES LOCALLY
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
