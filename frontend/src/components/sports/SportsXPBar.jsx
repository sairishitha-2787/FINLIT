import React from 'react';
import { motion } from 'framer-motion';
import { Menu, LogOut, User, Flame } from 'lucide-react';
import { sportsTheme, getDivision, getDivisionName } from '../../styles/sportsTheme';

export default function SportsXPBar({
  character,
  level,
  xp,
  levelProgress,
  xpToNext,
  streak,
  onToggleSidebar,
  onLogout,
  onOpenSheet,
}) {
  const C   = character?.color || '#E8457A';
  const div = getDivision(level);
  const divName = getDivisionName(div);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      height: '60px',
      padding: '0 16px',
      background: 'rgba(15,15,15,0.98)',
      backdropFilter: sportsTheme.backdropBlur,
      WebkitBackdropFilter: sportsTheme.backdropBlur,
      borderBottom: sportsTheme.borderThin,
      flexShrink: 0,
      zIndex: 20,
      position: 'relative',
    }}>
      {/* Hamburger — mobile */}
      <button
        onClick={onToggleSidebar}
        style={{
          width: '40px', height: '40px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', cursor: 'pointer',
          borderRadius: '8px',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        <Menu size={20} strokeWidth={2} />
      </button>

      {/* Character avatar button */}
      <button
        onClick={onOpenSheet}
        style={{
          width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
          background: character?.dim || 'rgba(232,69,122,0.12)',
          border: `2px solid ${C}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: `0 0 8px ${character?.glow || 'rgba(232,69,122,0.4)'}`,
        }}
      >
        <User size={16} color={C} strokeWidth={2} />
      </button>

      {/* Division chip */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${C}`,
        color: C,
        padding: '3px 10px', borderRadius: '6px',
        fontFamily: sportsTheme.fontHeading,
        fontSize: '14px', letterSpacing: '1px',
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>
        DIV {div}
      </div>

      {/* Points chip */}
      <div style={{
        background: C, color: '#000',
        padding: '3px 10px', borderRadius: '6px',
        fontFamily: sportsTheme.fontHeading,
        fontSize: '14px', letterSpacing: '1px',
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>
        {xp?.toLocaleString()} PTS
      </div>

      {/* Progress bar — flex 1 */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{
          height: '5px', borderRadius: '3px',
          background: 'rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: '100%', borderRadius: '3px',
              background: C,
              boxShadow: `0 0 6px ${C}80`,
            }}
          />
        </div>
        <div style={{
          fontFamily: sportsTheme.fontSub,
          fontSize: '9px', fontWeight: 600,
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.3)',
          textAlign: 'right',
        }}>
          {xpToNext} TO PROMOTION
        </div>
      </div>

      {/* Streak chip */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.13)',
        color: streak > 0 ? '#fb923c' : 'rgba(255,255,255,0.3)',
        padding: '3px 10px', borderRadius: '6px',
        display: 'flex', alignItems: 'center', gap: '4px',
        fontFamily: sportsTheme.fontSub,
        fontSize: '13px', fontWeight: 700,
        letterSpacing: '0.04em',
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>
        <Flame size={12} fill={streak > 0 ? '#fb923c' : 'none'} strokeWidth={streak > 0 ? 0 : 1.5} color={streak > 0 ? '#fb923c' : 'rgba(255,255,255,0.3)'} />
        {streak} STREAK
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        style={{
          width: '40px', height: '40px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', cursor: 'pointer',
          borderRadius: '8px',
          color: 'rgba(255,255,255,0.35)',
        }}
      >
        <LogOut size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}
