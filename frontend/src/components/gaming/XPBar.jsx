import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Menu, Flame, Snowflake, Leaf } from 'lucide-react';
import { gamingTheme, getElementColors } from '../../styles/gamingTheme';
import { useIsMobile } from '../../hooks/useIsMobile';
import NotificationBell from '../NotificationBell';

const ELEMENT_ICON = { Fire: Flame, Frost: Snowflake, Nature: Leaf };

export default function XPBar({
  level,
  xp,
  levelProgress,
  xpToNextLevel,
  streak,
  character,
  onOpenCharacterSheet,
  onLogout,
  onToggleSidebar,
}) {
  const colors = getElementColors(character);
  const { isMobile } = useIsMobile();
  const ElemIcon = ELEMENT_ICON[character?.element] || Flame;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '14px',
      padding: isMobile ? '8px 12px' : '10px 20px',
      background: `rgba(30,42,69,0.95)`,
      backdropFilter: 'blur(12px)',
      borderBottom: gamingTheme.borderThin,
      flexShrink: 0, minHeight: '60px',
      position: 'relative', zIndex: 10,
    }}>
      {/* Sidebar hamburger toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggleSidebar}
        title="Toggle sidebar"
        style={{
          width: isMobile ? 44 : 34, height: isMobile ? 44 : 34, borderRadius: '8px',
          background: `rgba(${hexToRgbStr(colors.primary)},0.1)`,
          border: `1px solid rgba(${hexToRgbStr(colors.primary)},0.25)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}
      >
        <Menu size={isMobile ? 20 : 16} color={colors.primary} />
      </motion.button>

      {/* Character avatar */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={onOpenCharacterSheet}
        style={{
          width: isMobile ? 34 : 40, height: isMobile ? 34 : 40,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary}, ${gamingTheme.bgSecondary})`,
          border: `2px solid ${colors.primary}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: `0 0 14px ${colors.glow}`,
          flexShrink: 0,
          overflow: 'hidden',
          padding: 0,
        }}
      >
        {character?.chibiImage ? (
          <img
            src={character.chibiImage}
            alt={character.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : character ? (
          <ElemIcon size={17} color={colors.primary} />
        ) : (
          <User size={16} color={gamingTheme.seafoam} />
        )}
      </motion.button>

      {/* Level badge */}
      {isMobile ? (
        <span style={{
          fontFamily: gamingTheme.fontHeading,
          fontSize: '13px', fontWeight: 700,
          color: colors.primary, flexShrink: 0,
          letterSpacing: '1px',
        }}>Lv.{level}</span>
      ) : (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: gamingTheme.fontLabel,
            fontSize: '9px', letterSpacing: '1.5px',
            color: gamingTheme.mutedBlue, textTransform: 'uppercase',
          }}>Level</span>
          <span style={{
            fontFamily: gamingTheme.fontHeading,
            fontSize: '18px', fontWeight: 700,
            color: colors.primary, lineHeight: 1,
          }}>{level}</span>
        </div>
      )}

      {/* XP Progress Bar */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Track */}
        <div style={{
          height: '20px',
          background: 'rgba(61,78,122,0.5)',
          borderRadius: '10px',
          border: gamingTheme.borderThin,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${colors.primary} 0%, ${gamingTheme.mint} 100%)`,
              borderRadius: '10px',
              boxShadow: `0 0 10px ${colors.glow}`,
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Animated chevron shimmer */}
            <motion.div
              animate={{ x: ['-20px', '20px'] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: 0,
                background: `repeating-linear-gradient(
                  90deg,
                  transparent, transparent 8px,
                  rgba(255,255,255,0.12) 8px, rgba(255,255,255,0.12) 10px
                )`,
              }}
            />
          </motion.div>

          {/* XP label */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: gamingTheme.fontLabel,
            fontSize: '10px', letterSpacing: '1px',
            color: gamingTheme.stellarWhite,
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          }}>
            {xpToNextLevel > 0 ? `${xpToNextLevel} XP to next level` : 'MAX LEVEL'}
          </div>
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '4px 10px',
          background: 'rgba(255,180,60,0.12)',
          border: '1px solid rgba(255,180,60,0.3)',
          borderRadius: '999px', flexShrink: 0,
        }}>
          <Flame size={14} color="#FFB43C" />
          <span style={{
            fontFamily: gamingTheme.fontLabel,
            fontSize: '11px', letterSpacing: '1px',
            color: '#FFB43C',
          }}>{streak}</span>
        </div>
      )}

      {/* Total XP chip — hidden on mobile */}
      {!isMobile && (
        <div style={{
          padding: '4px 12px',
          background: `rgba(${hexToRgbStr(colors.primary)},0.12)`,
          border: `1px solid rgba(${hexToRgbStr(colors.primary)},0.35)`,
          borderRadius: '999px', flexShrink: 0,
        }}>
          <span style={{
            fontFamily: gamingTheme.fontLabel, fontSize: '11px', letterSpacing: '1px',
            color: colors.primary,
          }}>{xp.toLocaleString()} XP</span>
        </div>
      )}

      {/* Notifications */}
      <NotificationBell
        accent={colors.primary}
        size={isMobile ? 44 : 34}
        theme={{ surface: 'rgba(30,42,69,0.99)', border: 'rgba(139,184,233,0.25)', textPrimary: gamingTheme.stellarWhite, textMuted: gamingTheme.mutedBlue, fontHeading: gamingTheme.fontHeading, fontBody: gamingTheme.fontBody }}
      />

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onLogout}
        style={{
          width: isMobile ? 44 : 34, height: isMobile ? 44 : 34, borderRadius: '8px',
          background: 'rgba(94,134,193,0.15)',
          border: gamingTheme.borderThin,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}
      >
        <LogOut size={15} color={gamingTheme.mutedBlue} />
      </motion.button>
    </div>
  );
}

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}
