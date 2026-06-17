import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, BarChart2, Award, Menu, X, LogOut, WifiOff, FileText, Settings, Heart, Library } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useGamification } from '../hooks/useGamification';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { useIsMobile } from '../hooks/useIsMobile';
import { useFashion } from '../contexts/FashionContext';
import CharacterSelection from '../components/fashion/CharacterSelection';
import CharacterSheet from '../components/fashion/CharacterSheet';
import LogoutConfirmModal from '../components/shared/LogoutConfirmModal';
import NotificationBell from '../components/NotificationBell';
import { ThemeProvider } from '../context/ThemeContext';
import { normalizeFashionTheme } from '../styles/normalizeTheme';

// ── Design tokens ─────────────────────────────────────────────────────────────
const F = {
  logo:    "'Petit Formal Script', cursive",
  heading: "'Playfair Display', serif",
  italic:  "'Playfair Display', serif",
  ui:      "'DM Sans', sans-serif",
};
const C = { deepRose: '#9d1f4a', midRose: '#d4537e', label: '#c98a9e', body: '#b0627a', pink: '#f7a0b8', purple: '#c084fc' };
const XP_GRADIENT = 'linear-gradient(90deg, #f7a0b8, #c084fc, #fbb6c4)';

function rgb(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

// ── Iridescent SVG accent objects (fixed layer, z-index 0) ────────────────────
const ACCENT_DEFS = [
  { paths: ['M28 28 Q40 16 52 28', 'M20 28 Q18 52 20 60 Q40 68 60 60 Q62 52 60 28 Z', 'M36 44 h8 v4 h-8 z'], vb: '0 0 80 80', sz: 90,  op: 0.44, pos: { top: '8%',    right: '3%'   }, delay: 0    },
  { paths: ['M30 8 L50 24 L30 20 L10 24 Z', 'M10 24 L30 20 L50 24 L30 52 Z'],                                vb: '0 0 60 60', sz: 65,  op: 0.38, pos: { top: '62%',   left: '2%'    }, delay: 1.2  },
  { paths: ['M8 52 L16 20 L32 36 L40 12 L48 36 L64 20 L72 52 Z', 'M8 52 h64 v4 h-64 z'],                    vb: '0 0 80 60', sz: 80,  op: 0.42, pos: { bottom: '10%',right: '4%'   }, delay: 2.1  },
  { paths: ['M18 32 Q16 60 18 72 Q30 78 42 72 Q44 60 42 32 Z', 'M24 20 h12 v12 h-12 z', 'M20 16 h20 v4 h-20 z'], vb: '0 0 60 80', sz: 70, op: 0.36, pos: { top: '33%', right: '1.5%' }, delay: 0.7  },
  { paths: ['M10 44 Q20 20 52 24 Q68 26 70 36 Q70 44 60 44 Z', 'M10 44 Q8 50 12 54 Q16 56 18 52 Q16 48 14 44 Z'], vb: '0 0 80 60', sz: 78, op: 0.40, pos: { top: '48%', left: '0.5%' }, delay: 1.8  },
  { paths: ['M14 50 h12 v24 h-12 z', 'M14 20 Q14 8 20 6 Q26 8 26 20 L26 50 h-12 z'],                        vb: '0 0 40 80', sz: 58,  op: 0.38, pos: { top: '78%',   right: '7%'   }, delay: 3.0  },
];

let _gradSeed = 0;
function AccentSVG({ paths, vb, sz, op, pos, delay }) {
  const gid = `irid-lay-${_gradSeed++}`;
  return (
    <motion.div
      style={{ position: 'fixed', pointerEvents: 'none', zIndex: 0, opacity: op, ...pos }}
      animate={{ y: [0, -8, 0], rotate: [0, 1, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <svg width={sz} height={sz} viewBox={vb} style={{ filter: 'blur(0.8px)', display: 'block' }}>
        <defs>
          <radialGradient id={gid} cx="30%" cy="25%" r="75%">
            <stop offset="0%"   stopColor="#fff"    />
            <stop offset="25%"  stopColor="#fde68a" />
            <stop offset="55%"  stopColor="#d8b4fe" />
            <stop offset="80%"  stopColor="#f7a0b8" />
            <stop offset="100%" stopColor="#9d1f4a" />
          </radialGradient>
        </defs>
        {paths.map((d, i) => (
          <path key={i} d={d} fill={`url(#${gid})`} stroke="rgba(255,255,255,0.80)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        ))}
        <ellipse cx="28%" cy="22%" rx="14%" ry="9%" fill="rgba(255,255,255,0.50)" />
      </svg>
    </motion.div>
  );
}

// ── Style Points bar ───────────────────────────────────────────────────────────
function StyleBar({ pct, width }) {
  return (
    <div style={{ height: 10, borderRadius: 99, background: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.55)', overflow: 'hidden', width }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: 99, background: XP_GRADIENT, boxShadow: '0 0 10px rgba(247,160,184,0.55)' }}
      />
    </div>
  );
}

// ── Chibi avatar (sidebar + topbar) ───────────────────────────────────────────
function ChibiAvatar({ char, size = 48, onClick }) {
  const [loaded, setLoaded] = React.useState(false);
  if (!char) return null;
  return (
    <motion.div
      whileHover={onClick ? { scale: 1.06 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: `radial-gradient(circle at 40% 35%, rgba(${rgb(char.colors.primary)},0.40), rgba(${rgb(char.colors.secondary)},0.20) 70%, transparent)`,
        border: `2px solid rgba(${rgb(char.colors.primary)},0.50)`,
        boxShadow: `0 0 16px ${char.colors.glow}`,
        overflow: 'hidden', cursor: onClick ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}
    >
      <img
        src={char.chibiImage}
        alt={char.name}
        onLoad={() => setLoaded(true)}
        onError={(e) => { e.target.style.display = 'none'; }}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top',
          opacity: loaded ? 1 : 0, transition: 'opacity 0.3s',
          mixBlendMode: 'screen',
        }}
      />
      {!loaded && <Heart size={size * 0.45} color={char.colors?.primary || '#d4537e'} strokeWidth={1.5} />}
    </motion.div>
  );
}

// ── Navigation items ───────────────────────────────────────────────────────────
const NAV = [
  { icon: Home,      label: 'Studio',          path: '/fashion'              },
  { icon: Map,       label: 'Runway Map',       path: '/fashion/map'         },
  { icon: BarChart2, label: 'Style Progress',   path: '/fashion/progress'    },
  { icon: Award,     label: 'Designer Labels',  path: '/fashion/achievements' },
  { icon: Library,   label: 'Glossary',         path: '/glossary'            },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function FashionLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { xp, level, streak, getLevelProgress, awardXP } = useGamification();
  const { isMobile } = useIsMobile();
  const [sidebarOpen, setSidebarOpen]       = useState(() => window.innerWidth >= 768);
  const [sheetOpen, setSheetOpen]           = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isOnline } = useOfflineSync(() => {});
  const { fashionCharacter, fashionCharacterLoaded, updateFashionCharacter } = useFashion();

  useEffect(() => { if (isMobile) setSidebarOpen(false); }, [isMobile]);

  const levelPct = getLevelProgress();

  const handleLogout  = () => setShowLogoutConfirm(true);
  const confirmLogout = async () => { await logout(); navigate('/login', { replace: true }); };

  const isActive = (item) =>
    item.path === '/fashion'
      ? location.pathname === '/fashion'
      : location.pathname.startsWith(item.path);

  const showCharSel = fashionCharacterLoaded && !fashionCharacter;

  // Derive per-character accent colors — fall back to default rose theme if no character yet
  const fashionColor     = fashionCharacter?.colors?.primary   || '#f7a0b8';
  const fashionSecondary = fashionCharacter?.colors?.secondary || '#c084fc';
  const fashionGlow      = fashionCharacter?.colors?.glow      || 'rgba(247,160,184,0.35)';
  const fashionGradient  = fashionCharacter?.colors?.gradient  || 'linear-gradient(135deg,#f7a0b8,#c084fc,#fbb6c4)';

  const outletContext = { xp, level, streak, getLevelProgress, awardXP, fashionCharacter, fashionColor, fashionSecondary, fashionGlow, fashionGradient, onOpenSheet: () => setSheetOpen(true) };
  const themeValue = normalizeFashionTheme(fashionColor, fashionCharacter?.name || null);

  return (
    <>
      {/* ── Layer -1: fixed background with blobs ─────────────────────────── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        backgroundColor: '#faf5ec',
        backgroundImage: `
          radial-gradient(circle 380px at 95% 8%,  rgba(247,160,184,0.50) 0%, transparent 70%),
          radial-gradient(circle 240px at 3%  85%, rgba(192,132,252,0.40) 0%, transparent 70%),
          radial-gradient(circle 100px at 60% 45%, rgba(251,182,196,0.55) 0%, transparent 70%)
        `,
      }} />

      {/* ── Layer 0: iridescent accent objects ───────────────────────────── */}
      {ACCENT_DEFS.map((a, i) => <AccentSVG key={i} {...a} />)}

      {/* ── Character selection overlay ──────────────────────────────────── */}
      {showCharSel && (
        <CharacterSelection
          isOpen={true}
          onSelect={(char) => updateFashionCharacter(char)}
        />
      )}

      <LogoutConfirmModal
        open={showLogoutConfirm}
        domain="fashion"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      {/* ── Layout shell (z-index 1+) ────────────────────────────────────── */}
      <div style={{ display: 'flex', height: '100vh', position: 'relative', zIndex: 1 }}>

        {/* Mobile backdrop */}
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              key="fashion-bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(157,31,74,0.15)', backdropFilter: 'blur(3px)', zIndex: 490 }}
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              key="fashion-sidebar"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              style={{
                width: 240, flexShrink: 0,
                height: isMobile ? '100vh' : '100%',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRight: '1px solid rgba(255,255,255,0.30)',
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
                  background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                  <X size={13} color={C.deepRose} />
                </button>
              )}

              {/* Right-edge shimmer */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: 1, height: '100%', background: 'linear-gradient(180deg, transparent, rgba(247,160,184,0.50) 40%, rgba(192,132,252,0.30) 70%, transparent)', pointerEvents: 'none' }} />

              {/* Wordmark */}
              <div style={{ padding: '0 20px 18px', borderBottom: '1px solid rgba(247,160,184,0.18)', marginBottom: 8 }}>
                <div style={{ fontFamily: F.logo, fontSize: 24, color: C.deepRose }}>
                  Fin<span style={{ color: C.pink }}>Lit</span>
                </div>
                <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label, marginTop: 4 }}>
                  Fashion Tier {level}
                </div>
              </div>

              {/* Character mini-card in sidebar */}
              {fashionCharacter && (
                <motion.div
                  whileHover={{ x: 2 }}
                  onClick={() => setSheetOpen(true)}
                  style={{
                    margin: '0 12px 12px', padding: '10px 12px', borderRadius: 14, cursor: 'pointer',
                    background: `rgba(${rgb(fashionCharacter.colors.primary)},0.08)`,
                    border: `1px solid rgba(${rgb(fashionCharacter.colors.primary)},0.22)`,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <ChibiAvatar char={fashionCharacter} size={44} />
                  <div style={{ minWidth: 0 }}>
                    <motion.div
                      animate={{ opacity: [0.55, 1, 0.55] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: fashionCharacter.colors.primary, marginBottom: 1 }}
                    >
                      Active
                    </motion.div>
                    <div style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 14, color: C.deepRose, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fashionCharacter.name}
                    </div>
                    <div style={{ fontFamily: F.italic, fontStyle: 'italic', fontSize: 14, color: C.midRose, lineHeight: 1.2 }}>
                      {fashionCharacter.archetype}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Nav label */}
              <div style={{ padding: '0 20px 6px', fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label }}>
                Navigate
              </div>

              {/* Nav items */}
              <nav style={{ padding: '0 10px' }}>
                {NAV.map((item) => {
                  const { icon: Icon, label, path } = item;
                  const active = isActive(item);
                  return (
                    <motion.button key={label} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { navigate(path); if (isMobile) setSidebarOpen(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 14px', marginBottom: 3, borderRadius: 12,
                        fontFamily: F.ui, fontSize: 13.5, fontWeight: active ? 600 : 400,
                        color: active ? C.deepRose : C.midRose,
                        background: active ? 'rgba(247,160,184,0.14)' : 'transparent',
                        border: 'none', borderLeft: `2.5px solid ${active ? C.pink : 'transparent'}`,
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s ease',
                      }}
                    >
                      <Icon size={15} strokeWidth={2} style={{ color: active ? C.pink : C.label, flexShrink: 0 }} />
                      {label}
                      {active && (
                        <motion.div layoutId="fashion-nav-dot" style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: C.pink, boxShadow: `0 0 8px ${C.pink}` }} />
                      )}
                    </motion.button>
                  );
                })}

                {/* Character sheet link */}
                {fashionCharacter && (
                  <motion.button whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setSheetOpen(true)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 14px', marginBottom: 3, borderRadius: 12,
                      fontFamily: F.ui, fontSize: 13.5, fontWeight: 400,
                      color: C.midRose, background: 'transparent',
                      border: 'none', borderLeft: '2.5px solid transparent',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s ease',
                    }}
                  >
                    <FileText size={15} strokeWidth={2} style={{ color: C.label, flexShrink: 0 }} />
                    Style Card
                  </motion.button>
                )}

                {/* Settings */}
                {(() => {
                  const settingsActive = location.pathname === '/fashion/settings';
                  return (
                    <motion.button whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { navigate('/fashion/settings'); if (isMobile) setSidebarOpen(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 14px', marginBottom: 3, borderRadius: 12,
                        fontFamily: F.ui, fontSize: 13.5, fontWeight: settingsActive ? 600 : 400,
                        color: settingsActive ? C.deepRose : C.midRose,
                        background: settingsActive ? 'rgba(247,160,184,0.14)' : 'transparent',
                        border: 'none', borderLeft: `2.5px solid ${settingsActive ? C.pink : 'transparent'}`,
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s ease',
                      }}
                    >
                      <Settings size={15} strokeWidth={2} style={{ color: settingsActive ? C.pink : C.label, flexShrink: 0 }} />
                      The Dressing Room
                      {settingsActive && (
                        <motion.div layoutId="fashion-nav-dot" style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: C.pink, boxShadow: `0 0 8px ${C.pink}` }} />
                      )}
                    </motion.button>
                  );
                })()}
              </nav>

              <div style={{ flex: 1 }} />

              {/* Style Points mini bar */}
              <div style={{ margin: '0 14px 12px', padding: '14px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.45)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label }}>Style Points</span>
                  <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.midRose }}>{xp?.toLocaleString()}</span>
                </div>
                <StyleBar pct={levelPct} />
              </div>

              {/* Sign out */}
              <div style={{ padding: '0 10px 20px' }}>
                <div style={{ height: 1, background: 'rgba(247,160,184,0.18)', marginBottom: 8 }} />
                <motion.button whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, fontFamily: F.ui, fontSize: 13, color: C.label, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <LogOut size={14} strokeWidth={2} style={{ color: C.label, flexShrink: 0 }} />
                  Sign out
                </motion.button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Main column ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Top bar */}
          <div style={{
            height: 56, flexShrink: 0, display: 'flex', alignItems: 'center',
            padding: '0 20px', gap: 16,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid rgba(255,255,255,0.45)',
          }}>
            <button onClick={() => setSidebarOpen(p => !p)} style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.60)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <Menu size={16} color={C.deepRose} />
            </button>

            {(!sidebarOpen || isMobile) ? (
              <span style={{ fontFamily: F.logo, fontSize: 20, color: C.deepRose, flex: 1 }}>
                Fin<span style={{ color: C.pink }}>Lit</span>
              </span>
            ) : (
              <div style={{ flex: 1 }} />
            )}

            <NotificationBell accent={fashionColor || '#e85d75'} theme={{ surface: 'rgba(255,255,255,0.94)', border: 'rgba(247,160,184,0.4)', textPrimary: '#9d1f4a', textMuted: '#b0627a', fontHeading: "'Playfair Display', serif", fontBody: "'DM Sans', sans-serif" }} />

            {/* Chibi in top bar (click → character sheet) */}
            {fashionCharacter && (
              <ChibiAvatar char={fashionCharacter} size={36} onClick={() => setSheetOpen(true)} />
            )}

            {/* XP strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.midRose, whiteSpace: 'nowrap' }}>
                {xp?.toLocaleString()} SP
              </span>
              <StyleBar pct={levelPct} width={80} />
              <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.deepRose, whiteSpace: 'nowrap' }}>
                T{level}
              </span>
            </div>
          </div>

          {/* Scrollable content — transparent so blobs show through */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <ThemeProvider value={themeValue}>
              <Outlet context={outletContext} />
            </ThemeProvider>
          </div>
        </div>
      </div>

      {/* ── Character sheet drawer ──────────────────────────────────────── */}
      <CharacterSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        character={fashionCharacter}
        level={level}
        xp={xp}
        streak={0}
      />

      {/* Offline toast */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            style={{
              position: 'fixed', top: 68, right: 20, zIndex: 9999,
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 99,
              background: 'rgba(240,192,96,0.15)', border: '1px solid rgba(240,192,96,0.45)',
              backdropFilter: 'blur(8px)',
              fontFamily: F.ui, fontWeight: 500, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b07d10',
            }}
          >
            <WifiOff size={12} /> Offline — saves locally
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
