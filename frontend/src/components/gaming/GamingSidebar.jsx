import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BarChart2, Trophy, Map, Settings, Flame, Snowflake, Leaf, X, FileText, LogOut, Library } from 'lucide-react';
import { gamingTheme, getElementColors } from '../../styles/gamingTheme';

const NAV_ITEMS = [
  { icon: Home,      label: 'Base Camp',    path: '/gaming'               },
  { icon: Map,       label: 'Island Map',   path: '/gaming/map'           },
  { icon: BarChart2, label: 'Progress',     path: '/gaming/progress'      },
  { icon: Trophy,    label: 'Achievements', path: '/gaming/achievements'  },
  { icon: Library,   label: 'Glossary',     path: '/glossary'             },
];

const ELEMENT_ICON = { Fire: Flame, Frost: Snowflake, Nature: Leaf };

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

export default function GamingSidebar({ character, onOpenSheet, isMobile, onClose, xp, levelProgress, onLogout }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const colors    = getElementColors(character);
  const ElemIcon  = ELEMENT_ICON[character?.element] || Flame;

  const isActive = (item) => {
    if (item.path === '/gaming') return location.pathname === '/gaming';
    return location.pathname.startsWith(item.path);
  };

  const navBtnBase = (active) => ({
    width: '100%',
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '11px 16px',
    marginBottom: '2px',
    borderRadius: '10px',
    fontFamily: gamingTheme.fontBody, fontSize: '14px',
    color: active ? colors.primary : gamingTheme.seafoam,
    background: active ? `rgba(${hexToRgbStr(colors.primary)},0.12)` : 'transparent',
    border: 'none',
    borderLeft: `2.5px solid ${active ? colors.primary : 'transparent'}`,
    boxShadow: active ? `0 0 16px rgba(${hexToRgbStr(colors.primary)},0.15)` : 'none',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    textAlign: 'left',
  });

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      style={{
        width: '220px', flexShrink: 0,
        height: isMobile ? '100vh' : '100%',
        background: `linear-gradient(180deg, ${gamingTheme.bgMid} 0%, rgba(30,42,69,0.98) 100%)`,
        borderRight: `1px solid rgba(${hexToRgbStr(colors.primary)},0.15)`,
        display: 'flex', flexDirection: 'column',
        paddingTop: '20px',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: isMobile ? 'fixed' : 'relative',
        top: isMobile ? 0 : 'auto',
        left: isMobile ? 0 : 'auto',
        zIndex: isMobile ? 500 : 200,
      }}
    >
      {/* Mobile close button */}
      {isMobile && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 36, height: 36, borderRadius: '8px',
            background: 'rgba(61,78,122,0.5)',
            border: '1px solid rgba(139,184,233,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 1,
          }}
        >
          <X size={16} color={gamingTheme.seafoam} />
        </button>
      )}

      {/* Right-edge glow line */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '1px', height: '100%',
        background: `linear-gradient(180deg, transparent 0%, ${colors.primary}44 30%, ${colors.primary}22 70%, transparent 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Wordmark */}
      <div style={{
        padding: '0 20px 18px',
        borderBottom: `1px solid rgba(139,184,233,0.1)`,
        marginBottom: '8px',
      }}>
        <div style={{
          fontFamily: gamingTheme.fontHeading,
          fontSize: '22px', fontWeight: 900, letterSpacing: '4px',
        }}>
          <span style={{ color: gamingTheme.stellarWhite }}>FIN</span>
          <span style={{ color: colors.primary, textShadow: `0 0 12px ${colors.glow}` }}>LIT</span>
        </div>
        {character && (
          <div style={{
            fontFamily: gamingTheme.fontLabel,
            fontSize: '9px', letterSpacing: '2px',
            color: gamingTheme.mutedBlue,
            textTransform: 'uppercase', marginTop: '4px',
          }}>
            {character.name} · {character.element}
          </div>
        )}
      </div>

      {/* Character mini-card */}
      {character && (
        <motion.div
          whileHover={{ x: 2 }}
          onClick={onOpenSheet}
          style={{
            margin: '0 12px 12px', padding: '10px 12px',
            borderRadius: 10, cursor: 'pointer',
            background: `rgba(${hexToRgbStr(colors.primary)},0.07)`,
            border: `1px solid rgba(${hexToRgbStr(colors.primary)},0.20)`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: '8px', flexShrink: 0,
            background: `linear-gradient(135deg, rgba(${hexToRgbStr(colors.primary)},0.2) 0%, ${gamingTheme.bgSecondary} 100%)`,
            border: `1.5px solid ${colors.primary}`,
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 10px ${colors.glow}`,
          }}>
            {character.chibiImage ? (
              <img src={character.chibiImage} alt={character.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <ElemIcon size={17} color={colors.primary} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <motion.div
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              style={{
                fontFamily: gamingTheme.fontLabel, fontSize: '8px',
                letterSpacing: '1.5px', color: colors.primary,
                textTransform: 'uppercase', marginBottom: '2px',
              }}
            >
              Active
            </motion.div>
            <div style={{
              fontFamily: gamingTheme.fontHeading, fontSize: '13px',
              fontWeight: 600, color: gamingTheme.stellarWhite,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {character.name}
            </div>
            <div style={{
              fontFamily: gamingTheme.fontLabel, fontSize: '9px',
              color: gamingTheme.mutedBlue, letterSpacing: '1px',
            }}>
              {character.element}
            </div>
          </div>
        </motion.div>
      )}

      {/* Nav section label */}
      <div style={{
        padding: '0 20px 6px',
        fontFamily: gamingTheme.fontLabel, fontSize: '8px',
        letterSpacing: '2px', color: 'rgba(139,184,233,0.4)',
        textTransform: 'uppercase',
      }}>
        Navigate
      </div>

      {/* Navigation */}
      <nav style={{ padding: '0 8px' }}>
        {NAV_ITEMS.map((item) => {
          const { icon: Icon, label, path } = item;
          const active = isActive(item);
          return (
            <motion.button
              key={label}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { navigate(path); if (isMobile) onClose?.(); }}
              style={navBtnBase(active)}
            >
              <Icon size={15} strokeWidth={2}
                style={{ color: active ? colors.primary : gamingTheme.mutedBlue, flexShrink: 0 }} />
              {label}
              {active && (
                <motion.div
                  layoutId="gaming-nav-dot"
                  style={{
                    marginLeft: 'auto',
                    width: 5, height: 5, borderRadius: '50%',
                    background: colors.primary,
                    boxShadow: `0 0 8px ${colors.primary}`,
                  }}
                />
              )}
            </motion.button>
          );
        })}

        {/* Character Sheet */}
        {character && (
          <motion.button
            whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
            onClick={onOpenSheet}
            style={navBtnBase(false)}
          >
            <FileText size={15} strokeWidth={2}
              style={{ color: gamingTheme.mutedBlue, flexShrink: 0 }} />
            Character Sheet
          </motion.button>
        )}

        {/* Settings */}
        <motion.button
          whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
          onClick={() => { navigate('/gaming/settings'); if (isMobile) onClose?.(); }}
          style={navBtnBase(location.pathname === '/gaming/settings')}
        >
          <Settings size={15} strokeWidth={2}
            style={{ color: location.pathname === '/gaming/settings' ? colors.primary : gamingTheme.mutedBlue, flexShrink: 0 }} />
          Control Panel
        </motion.button>
      </nav>

      <div style={{ flex: 1 }} />

      {/* XP Points mini bar */}
      <div style={{
        margin: '0 14px 12px', padding: '14px 16px',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid rgba(${hexToRgbStr(colors.primary)},0.12)`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{
            fontFamily: gamingTheme.fontLabel,
            fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: gamingTheme.mutedBlue,
          }}>
            XP Points
          </span>
          <span style={{
            fontFamily: gamingTheme.fontHeading,
            fontSize: 14, letterSpacing: '1px', color: colors.primary,
          }}>
            {xp?.toLocaleString() ?? 0}
          </span>
        </div>
        <div style={{
          height: 8, borderRadius: 99,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.10)',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress ?? 0}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              height: '100%', borderRadius: 99,
              background: colors.primary,
              boxShadow: `0 0 10px ${colors.glow}`,
            }}
          />
        </div>
      </div>

      {/* Sign out */}
      <div style={{ padding: '0 10px 20px' }}>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
        <motion.button
          whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
          onClick={onLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 8,
            fontFamily: gamingTheme.fontBody,
            fontSize: 13, color: gamingTheme.mutedBlue,
            background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <LogOut size={14} strokeWidth={2} style={{ color: 'rgba(139,184,233,0.35)', flexShrink: 0 }} />
          Sign out
        </motion.button>
      </div>
    </motion.div>
  );
}
