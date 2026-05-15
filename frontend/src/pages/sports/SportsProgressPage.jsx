import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useUser } from '../../context/UserContext';

function StatPanel({ label, value, sub, color, Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: 'rgba(26,26,26,0.95)',
        borderLeft: `3px solid ${color}`,
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        padding: '16px',
        display: 'flex', alignItems: 'flex-start', gap: '12px',
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '8px',
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} color={color} strokeWidth={1.8} />
      </div>
      <div>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)', marginBottom: '2px',
        }}>{label}</div>
        <div style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: '28px', letterSpacing: '1.5px',
          color, lineHeight: 1,
        }}>{value}</div>
        {sub && (
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px', color: 'rgba(255,255,255,0.4)',
            marginTop: '2px',
          }}>{sub}</div>
        )}
      </div>
    </motion.div>
  );
}

const DIVISION_NAMES = {
  1: 'Premier League', 2: 'Championship', 3: 'League One',
  4: 'League Two', 5: 'National', 6: 'Regional',
  7: 'County A', 8: 'County B', 9: 'County C', 10: 'Amateur',
};

export default function SportsProgressPage() {
  const { completedTopics, stats } = useUser();
  const {
    sportsColor: C, sportsCharacter,
    xp, level, streak, division, levelProgress, getXPForNextLevel,
  } = useOutletContext();

  const xpToNext = getXPForNextLevel?.() ?? 500;
  const divName = DIVISION_NAMES[division] || 'Amateur';
  const avgScore = stats?.avgScore ?? 0;

  const milestones = [
    { div: 10, label: 'First Whistle',  pts: 0   },
    { div: 8,  label: 'Hat Trick',      pts: 300 },
    { div: 6,  label: 'Clean Sheet',    pts: 600 },
    { div: 4,  label: 'Golden Boot',    pts: 900 },
    { div: 2,  label: 'Champions',      pts: 1200 },
    { div: 1,  label: 'The Treble',     pts: 1500 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '20px 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* Character + Division summary */}
      {sportsCharacter && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: sportsCharacter.dim,
            borderLeft: `3px solid ${C}`,
            borderTop: '1px solid rgba(255,255,255,0.07)',
            borderRight: '1px solid rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C, marginBottom: '4px',
            }}>
              {sportsCharacter.name} · ACTIVE
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: '28px', color: '#fff', letterSpacing: '1.5px',
            }}>
              {divName.toUpperCase()}
            </div>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px', color: 'rgba(255,255,255,0.45)',
            }}>
              Division {division} · Level {level}
            </div>
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: '52px', color: C,
            letterSpacing: '2px', lineHeight: 1,
            textShadow: `0 0 24px ${sportsCharacter.glow}`,
          }}>
            {division}
          </div>
        </motion.div>
      )}

      {/* XP Progress panel */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(26,26,26,0.95)',
          borderLeft: `3px solid ${C}`,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}>
            MATCH PROGRESS · LEVEL {level} → {level + 1}
          </span>
          <span style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: '13px', letterSpacing: '1px', color: C,
          }}>
            {xp} / {xp + xpToNext}
          </span>
        </div>
        <div style={{
          height: '8px', borderRadius: '4px',
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            style={{
              height: '100%', borderRadius: '4px',
              background: C,
              boxShadow: `0 0 10px ${C}80`,
            }}
          />
        </div>
        <p style={{
          marginTop: '8px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px', color: 'rgba(255,255,255,0.35)',
        }}>
          {xpToNext} points to promotion
        </p>
      </motion.div>

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <StatPanel label="Match Points"   value={xp}    sub={`${xpToNext} to next level`}          color={C}       Icon={TrendingUp} delay={0.15} />
        <StatPanel label="Win Streak"     value={streak} sub={streak > 0 ? 'Keep it going!' : 'Start a run!'} color="#fb923c" Icon={Flame}      delay={0.20} />
        <StatPanel label="Drills Done"    value={completedTopics.length} sub="Finance topics mastered" color="#4ecdc4" Icon={BookOpen}    delay={0.25} />
        <StatPanel label="Avg Score"      value={`${Math.round(avgScore)}%`} sub="Accuracy rate"      color="#a78bfa" Icon={Target}      delay={0.30} />
      </div>

      {/* Division Ladder */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{
          background: 'rgba(26,26,26,0.95)',
          borderLeft: `3px solid rgba(255,255,255,0.1)`,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          padding: '16px',
        }}
      >
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)', marginBottom: '14px',
        }}>
          DIVISION LADDER
        </div>
        {milestones.map((m, i) => {
          const reached = xp >= m.pts;
          const isCurrent = division <= m.div && (i === milestones.length - 1 || division > milestones[i + 1]?.div);
          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '8px 0',
                borderBottom: i < milestones.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                background: reached ? C : 'rgba(255,255,255,0.12)',
                boxShadow: reached ? `0 0 6px ${C}` : 'none',
              }} />
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '13px', fontWeight: 600,
                color: reached ? '#fff' : 'rgba(255,255,255,0.3)',
                flex: 1,
              }}>
                {m.label}
              </span>
              <span style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: '13px', letterSpacing: '0.5px',
                color: reached ? C : 'rgba(255,255,255,0.2)',
              }}>
                {m.pts} PTS
              </span>
              {reached && (
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '9px', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: C, background: `${C}18`,
                  padding: '2px 6px', borderRadius: '4px',
                }}>
                  DONE
                </span>
              )}
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
