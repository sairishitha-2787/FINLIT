import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BarChart2, Trophy, Map, Settings, Flame, Snowflake, Leaf, X } from 'lucide-react';
import { gamingTheme, getElementColors } from '../../styles/gamingTheme';

const NAV_ITEMS = [
  { icon: Home,      label: 'Base Camp',    path: '/gaming'               },
  { icon: Map,       label: 'Island Map',   path: '/gaming/map'           },
  { icon: BarChart2, label: 'Progress',     path: '/gaming/progress'      },
  { icon: Trophy,    label: 'Achievements', path: '/gaming/achievements'  },
];

const ELEMENT_ICON = { Fire: Flame, Frost: Snowflake, Nature: Leaf };

export default function GamingSidebar({ character, onOpenSettings, isMobile, onClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const colors    = getElementColors(character);
  const ElemIcon  = ELEMENT_ICON[character?.element] || Flame;

  const isActive = (item) => {
    if (item.path === '/gaming') return location.pathname === '/gaming';
    return location.pathname.startsWith(item.path);
  };

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
      {/* Ambient glow line on right edge */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '1px', height: '100%',
        background: `linear-gradient(180deg, transparent 0%, ${colors.primary}44 30%, ${colors.primary}22 70%, transparent 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Logo row */}
      <div style={{
        padding: '0 20px 22px 20px',
        borderBottom: `1px solid rgba(139,184,233,0.1)`,
        marginBottom: '8px',
      }}>
        <div style={{
          fontFamily: gamingTheme.fontHeading,
          fontSize: '22px', fontWeight: 900,
          color: gamingTheme.stellarWhite,
          letterSpacing: '4px',
        }}>
          FIN<span style={{ color: colors.primary, textShadow: `0 0 12px ${colors.glow}` }}>LIT</span>
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

      {/* Section label */}
      <div style={{
        padding: '0 20px 6px',
        fontFamily: gamingTheme.fontLabel, fontSize: '8px',
        letterSpacing: '2px', color: 'rgba(139,184,233,0.4)',
        textTransform: 'uppercase',
      }}>Navigate</div>

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
              style={{
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
              }}
            >
              <Icon size={15} strokeWidth={2}
                style={{ color: active ? colors.primary : gamingTheme.mutedBlue, flexShrink: 0 }} />
              {label}
              {active && (
                <motion.div
                  layoutId={`activeIndicator-${label}`}
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
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Settings */}
      <div style={{ padding: '0 8px 4px' }}>
        <div style={{ height: '1px', background: 'rgba(139,184,233,0.08)', marginBottom: '8px' }} />
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenSettings}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px',
            borderRadius: '10px',
            fontFamily: gamingTheme.fontBody, fontSize: '13px',
            color: gamingTheme.mutedBlue,
            background: 'transparent',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.18s ease', textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = gamingTheme.seafoam;
            e.currentTarget.style.background = 'rgba(139,184,233,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = gamingTheme.mutedBlue;
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <Settings size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
          Settings
        </motion.button>
      </div>

      {/* Guardian card */}
      {character && (
        <div style={{
          margin: '8px 12px 16px',
          padding: '12px 14px',
          borderRadius: '12px',
          background: `rgba(${hexToRgbStr(colors.primary)},0.07)`,
          border: `1px solid rgba(${hexToRgbStr(colors.primary)},0.2)`,
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '8px', flexShrink: 0,
            background: `linear-gradient(135deg, rgba(${hexToRgbStr(colors.primary)},0.2) 0%, ${gamingTheme.bgSecondary} 100%)`,
            border: `1.5px solid ${colors.primary}`,
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
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
            >Active</motion.div>
            <div style={{
              fontFamily: gamingTheme.fontHeading, fontSize: '13px',
              fontWeight: 600, color: gamingTheme.stellarWhite,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{character.name}</div>
            <div style={{
              fontFamily: gamingTheme.fontLabel, fontSize: '9px',
              color: gamingTheme.mutedBlue, letterSpacing: '1px',
            }}>{character.element}</div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}
