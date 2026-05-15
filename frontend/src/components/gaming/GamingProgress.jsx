import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, BookOpen, Star, CheckCircle, Lock, Skull } from 'lucide-react';
import { gamingTheme } from '../../styles/gamingTheme';
import { GAMING_ISLANDS } from './IslandMap';

export const ISLAND_COLORS = ['#4ECDC4', '#818CF8', '#F87171'];

export default function GamingProgress({
  colors,
  level,
  xp,
  streak,
  completedTopics,
  defeatedBosses,
  getLevelProgress,
  getXPForNextLevel,
}) {
  const levelProgress = getLevelProgress();
  const xpToNext = getXPForNextLevel();

  const statCards = [
    { label: 'Level',        value: level,                  icon: Zap,      color: colors.primary },
    { label: 'Total XP',     value: xp?.toLocaleString(),   icon: Star,     color: colors.primary },
    { label: 'Streak',       value: `${streak}d`,           icon: Flame,    color: '#FF8C42'      },
    { label: 'Topics Done',  value: completedTopics.length, icon: BookOpen, color: '#4ECDC4'      },
    { label: 'Bosses Slain', value: defeatedBosses.length,  icon: Skull,    color: '#F87171'      },
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header */}
      <div>
        <div style={{
          fontFamily: gamingTheme.fontLabel, fontSize: '10px',
          letterSpacing: '3px', color: gamingTheme.mutedBlue,
          textTransform: 'uppercase', marginBottom: '4px',
        }}>Mission Archives</div>
        <h1 style={{
          fontFamily: gamingTheme.fontHeading, fontSize: '28px', fontWeight: 800,
          color: gamingTheme.stellarWhite, textTransform: 'uppercase', letterSpacing: '2px',
          textShadow: `0 0 20px ${colors.glow}`, margin: 0,
        }}>Progress</h1>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {statCards.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '16px 12px', borderRadius: '16px', textAlign: 'center',
              background: `rgba(${hexToRgbStr(color)},0.07)`,
              border: `1px solid rgba(${hexToRgbStr(color)},0.22)`,
            }}
          >
            <Icon size={18} color={color} style={{ marginBottom: '8px' }} />
            <div style={{
              fontFamily: gamingTheme.fontHeading, fontSize: '22px', fontWeight: 700,
              color, marginBottom: '2px',
            }}>{value}</div>
            <div style={{
              fontFamily: gamingTheme.fontLabel, fontSize: '8px',
              letterSpacing: '1.5px', color: gamingTheme.mutedBlue, textTransform: 'uppercase',
            }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* XP Progress */}
      <Card title="Level Progress" colors={colors}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{
            fontFamily: gamingTheme.fontLabel, fontSize: '9px',
            letterSpacing: '2px', color: gamingTheme.mutedBlue, textTransform: 'uppercase',
          }}>Level {level} → {level + 1}</span>
          <span style={{
            fontFamily: gamingTheme.fontLabel, fontSize: '9px', color: colors.primary,
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
      </Card>

      {/* Zone Conquest */}
      <Card title="Zone Conquest" colors={colors}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '4px' }}>
          {GAMING_ISLANDS.map((island, idx) => {
            const color = ISLAND_COLORS[idx];
            const done = island.topics.filter(t => completedTopics.includes(t)).length;
            const pct = Math.round((done / island.topics.length) * 100);
            const bossDefeated = defeatedBosses.includes(island.bossId);
            return (
              <div key={island.id}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '6px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontFamily: gamingTheme.fontBody, fontSize: '13px',
                      fontWeight: 600, color: gamingTheme.seafoam,
                    }}>{island.name}</span>
                    {bossDefeated && (
                      <span style={{
                        padding: '1px 8px', borderRadius: '999px',
                        fontFamily: gamingTheme.fontLabel, fontSize: '8px',
                        letterSpacing: '1px',
                        color: gamingTheme.bgDark, background: color,
                      }}>CLEARED</span>
                    )}
                  </div>
                  <span style={{
                    fontFamily: gamingTheme.fontLabel, fontSize: '10px', color,
                  }}>{done}/{island.topics.length}</span>
                </div>
                <div style={{
                  height: '7px', borderRadius: '3.5px',
                  background: 'rgba(61,78,122,0.6)', overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: idx * 0.1 }}
                    style={{
                      height: '100%', borderRadius: '3.5px',
                      background: `linear-gradient(90deg, ${color}cc, ${color})`,
                      boxShadow: `0 0 8px ${color}44`,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {island.topics.map(t => {
                    const cleared = completedTopics.includes(t);
                    return (
                      <span key={t} style={{
                        padding: '2px 9px', borderRadius: '999px',
                        fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                        letterSpacing: '0.5px',
                        color: cleared ? gamingTheme.bgDark : gamingTheme.mutedBlue,
                        background: cleared ? color : 'rgba(61,78,122,0.4)',
                        border: `1px solid ${cleared ? color : 'rgba(139,184,233,0.15)'}`,
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                      }}>
                        {cleared ? <CheckCircle size={9} /> : <Lock size={9} />}
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Card({ title, colors, children }) {
  return (
    <div style={{
      padding: '20px', borderRadius: '16px',
      background: 'rgba(47,58,95,0.4)',
      border: gamingTheme.borderThin,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: colors.primary, flexShrink: 0 }} />
        <h3 style={{
          fontFamily: gamingTheme.fontHeading, fontSize: '12px', fontWeight: 600,
          color: gamingTheme.stellarWhite, textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0,
        }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}
