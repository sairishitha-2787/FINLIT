import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Star, Flame, BookOpen, Skull, FileText, Map, BarChart2, Snowflake, Leaf } from 'lucide-react';

import { useDomain } from '../../contexts/DomainContext';
import { useUser } from '../../context/UserContext';
import { gamingTheme, getElementColors } from '../../styles/gamingTheme';

const ELEMENT_ICON = { Fire: Flame, Frost: Snowflake, Nature: Leaf };

export default function GamingDashboard() {
  const navigate = useNavigate();
  const { character, defeatedBosses } = useDomain();
  const { completedTopics } = useUser();
  const { xp, level, streak, getLevelProgress, getXPForNextLevel, colors: layoutColors, onOpenSheet } = useOutletContext();

  const colors        = layoutColors || getElementColors(character);
  const levelProgress = getLevelProgress();
  const xpToNext      = getXPForNextLevel();
  const ElemIcon      = ELEMENT_ICON[character?.element] || Flame;

  const statCards = [
    { label: 'Level',        value: level,                  icon: Zap,      color: colors.primary },
    { label: 'Total XP',     value: xp?.toLocaleString(),   icon: Star,     color: colors.primary },
    { label: 'Day Streak',   value: `${streak}`,            icon: Flame,    color: '#FF8C42'      },
    { label: 'Topics Done',  value: completedTopics.length, icon: BookOpen, color: '#4ECDC4'      },
    { label: 'Bosses Slain', value: defeatedBosses.length,  icon: Skull,    color: '#F87171'      },
  ];

  const quickActions = [
    { label: 'Character Sheet',   icon: FileText,  action: onOpenSheet                            },
    { label: 'Island Map',        icon: Map,       action: () => navigate('/gaming/map')           },
    { label: 'Continue Learning', icon: BookOpen,  action: () => navigate('/gaming/learn')         },
    { label: 'My Progress',       icon: BarChart2, action: () => navigate('/gaming/progress')      },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}
    >
      {/* Header */}
      <div>
        <div style={{
          fontFamily: gamingTheme.fontLabel, fontSize: '10px',
          letterSpacing: '3px', color: gamingTheme.mutedBlue,
          textTransform: 'uppercase', marginBottom: '4px',
        }}>Home</div>
        <h1 style={{
          fontFamily: gamingTheme.fontHeading, fontSize: '28px', fontWeight: 800,
          color: gamingTheme.stellarWhite, textTransform: 'uppercase', letterSpacing: '2px',
          textShadow: `0 0 20px ${colors.glow}`, margin: 0,
        }}>Base Camp</h1>
      </div>

      {/* Hero row */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

        {/* Character portrait */}
        <motion.div
          animate={{ boxShadow: [`0 0 24px ${colors.glow}`, `0 0 48px ${colors.glow}`, `0 0 24px ${colors.glow}`] }}
          transition={{ duration: 2.8, repeat: Infinity }}
          style={{
            width: '220px', flexShrink: 0,
            borderRadius: '20px',
            background: `linear-gradient(160deg, rgba(${hexToRgbStr(colors.primary)},0.14) 0%, ${gamingTheme.bgSecondary} 100%)`,
            border: `2px solid rgba(${hexToRgbStr(colors.primary)},0.4)`,
            overflow: 'hidden', position: 'relative',
          }}
        >
          {character?.fullImage ? (
            <CharacterPortrait src={character.fullImage} alt={character?.name} ElemIcon={ElemIcon} colors={colors} />
          ) : (
            <div style={{
              height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ElemIcon size={80} color={colors.primary} />
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: `linear-gradient(0deg, rgba(15,20,40,0.95) 0%, transparent 100%)`,
            padding: '28px 16px 14px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: gamingTheme.fontHeading, fontSize: '17px', fontWeight: 700,
              color: gamingTheme.stellarWhite,
            }}>{character?.name || 'No Guardian'}</div>
            <div style={{
              fontFamily: gamingTheme.fontLabel, fontSize: '9px',
              letterSpacing: '2px', color: colors.primary, textTransform: 'uppercase',
            }}>{character?.element} Guardian</div>
          </div>
        </motion.div>

        {/* Right column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* XP progress */}
          <div style={{
            padding: '20px', borderRadius: '16px',
            background: 'rgba(47,58,95,0.4)', border: gamingTheme.borderThin,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{
                fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                letterSpacing: '2px', color: gamingTheme.mutedBlue, textTransform: 'uppercase',
              }}>Level {level} Progress</span>
              <span style={{
                fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                color: colors.primary, letterSpacing: '1px',
              }}>{xp?.toLocaleString()} / {xpToNext?.toLocaleString()} XP</span>
            </div>
            <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(61,78,122,0.6)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  height: '100%', borderRadius: '5px',
                  background: `linear-gradient(90deg, ${colors.primary}, ${gamingTheme.mint})`,
                  boxShadow: `0 0 10px ${colors.glow}`,
                }}
              />
            </div>
          </div>

          {/* Stat grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {statCards.slice(0, 3).map(({ label, value, icon: Icon, color }) => (
              <StatCard key={label} label={label} value={value} Icon={Icon} color={color} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {statCards.slice(3).map(({ label, value, icon: Icon, color }) => (
              <StatCard key={label} label={label} value={value} Icon={Icon} color={color} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div style={{
          fontFamily: gamingTheme.fontLabel, fontSize: '9px',
          letterSpacing: '2px', color: gamingTheme.mutedBlue,
          textTransform: 'uppercase', marginBottom: '12px',
        }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {quickActions.map(({ label, icon: Icon, action }) => (
            <motion.button
              key={label}
              whileHover={{ y: -2, boxShadow: `0 6px 24px ${colors.glow}` }}
              whileTap={{ scale: 0.96 }}
              onClick={action}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 20px', borderRadius: '12px',
                fontFamily: gamingTheme.fontHeading,
                fontSize: '12px', fontWeight: 600,
                letterSpacing: '1px', textTransform: 'uppercase',
                color: colors.primary,
                background: `rgba(${hexToRgbStr(colors.primary)},0.09)`,
                border: `1px solid rgba(${hexToRgbStr(colors.primary)},0.3)`,
                cursor: 'pointer', transition: 'all 0.18s ease',
              }}
            >
              <Icon size={15} />
              {label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, Icon, color }) {
  return (
    <div style={{
      padding: '14px 12px', borderRadius: '14px', textAlign: 'center',
      background: `rgba(${hexToRgbStr(color)},0.07)`,
      border: `1px solid rgba(${hexToRgbStr(color)},0.2)`,
    }}>
      <Icon size={18} color={color} style={{ marginBottom: '6px' }} />
      <div style={{
        fontFamily: gamingTheme.fontHeading, fontSize: '20px', fontWeight: 700,
        color, marginBottom: '2px',
      }}>{value}</div>
      <div style={{
        fontFamily: gamingTheme.fontLabel, fontSize: '8px',
        letterSpacing: '1.5px', color: gamingTheme.mutedBlue, textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );
}

function CharacterPortrait({ src, alt, ElemIcon, colors }) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div style={{ height: '280px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src={src} alt={alt}
        onLoad={() => setLoaded(true)}
        onError={(e) => { e.target.style.display = 'none'; }}
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain', objectPosition: 'center bottom',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
      {!loaded && (
        <div style={{ position: 'absolute' }}>
          <ElemIcon size={72} color={colors.primary} />
        </div>
      )}
    </div>
  );
}

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}
