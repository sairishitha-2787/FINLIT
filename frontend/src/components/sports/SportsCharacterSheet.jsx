import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Target, Flame, TrendingUp, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sportsTheme, getDivision, getDivisionName } from '../../styles/sportsTheme';

const CHAR_EMOJI = { striker: '⚡', playmaker: '🎯', captain: '🏆' };

function StatBar({ label, value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginBottom: '4px',
      }}>
        <span style={{
          fontFamily: sportsTheme.fontSub,
          fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: sportsTheme.textMuted,
        }}>{label}</span>
        <span style={{
          fontFamily: sportsTheme.fontHeading,
          fontSize: '13px', letterSpacing: '0.5px',
          color,
        }}>{value}</span>
      </div>
      <div style={{
        height: '4px', borderRadius: '2px',
        background: 'rgba(255,255,255,0.07)',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: '2px', background: color }}
        />
      </div>
    </div>
  );
}

export default function SportsCharacterSheet({
  isOpen, onClose, character, xp, level, streak, completedTopics, badges,
}) {
  const navigate = useNavigate();
  const C   = character?.color || '#E8457A';
  const div = getDivision(level);
  const divName = getDivisionName(div);
  const emoji   = CHAR_EMOJI[character?.id] || '⚡';

  const avgScore = 75; // placeholder; could be passed as prop

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.60)',
              backdropFilter: 'blur(3px)',
              zIndex: 800,
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(400px, 100vw)',
              background: sportsTheme.bgSecondary,
              borderLeft: `3px solid ${C}`,
              boxShadow: `-8px 0 40px rgba(0,0,0,0.7)`,
              zIndex: 801,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px',
              borderBottom: sportsTheme.borderFaint,
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              {/* Avatar */}
              <div style={{
                width: '56px', height: '56px', borderRadius: '12px',
                background: character?.dim || 'rgba(232,69,122,0.12)',
                border: `2px solid ${C}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', flexShrink: 0,
                boxShadow: `0 0 12px ${character?.glow || 'rgba(232,69,122,0.4)'}`,
              }}>
                {emoji}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: sportsTheme.fontSub,
                  fontSize: '9px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: C, marginBottom: '2px',
                }}>
                  {character?.role || 'Archetype'}
                </div>
                <div style={{
                  fontFamily: sportsTheme.fontHeading,
                  fontSize: '24px', letterSpacing: '1.5px',
                  color: sportsTheme.textPrimary,
                }}>
                  {character?.name || 'Unknown'}
                </div>
                <div style={{
                  fontFamily: sportsTheme.fontBody,
                  fontSize: '12px',
                  color: sportsTheme.textMuted,
                }}>
                  {divName} · Division {div}
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: '36px', height: '36px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  border: sportsTheme.borderFaint,
                  borderRadius: '8px', cursor: 'pointer',
                  color: sportsTheme.textMuted,
                }}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

              {/* Points + streak row */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{
                  flex: 1, background: sportsTheme.bgCard,
                  borderLeft: `3px solid ${C}`,
                  borderRadius: '8px', padding: '12px',
                  boxShadow: sportsTheme.cardShadow,
                }}>
                  <div style={{
                    fontFamily: sportsTheme.fontSub,
                    fontSize: '9px', fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: sportsTheme.textMuted, marginBottom: '2px',
                  }}>MATCH POINTS</div>
                  <div style={{
                    fontFamily: sportsTheme.fontHeading,
                    fontSize: '28px', letterSpacing: '1px', color: C,
                  }}>{xp?.toLocaleString()}</div>
                </div>

                <div style={{
                  flex: 1, background: sportsTheme.bgCard,
                  borderLeft: '3px solid #fb923c',
                  borderRadius: '8px', padding: '12px',
                  boxShadow: sportsTheme.cardShadow,
                }}>
                  <div style={{
                    fontFamily: sportsTheme.fontSub,
                    fontSize: '9px', fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: sportsTheme.textMuted, marginBottom: '2px',
                  }}>WIN STREAK</div>
                  <div style={{
                    fontFamily: sportsTheme.fontHeading,
                    fontSize: '28px', letterSpacing: '1px', color: '#fb923c',
                  }}>{streak}</div>
                </div>
              </div>

              {/* Performance stats */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  fontFamily: sportsTheme.fontSub,
                  fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: sportsTheme.textMuted, marginBottom: '12px',
                }}>PERFORMANCE</div>
                <StatBar label="Drills Completed" value={completedTopics?.length || 0} max={30} color={C} />
                <StatBar label="Average Score"    value={avgScore}                       max={100} color="#a78bfa" />
                <StatBar label="Level Progress"   value={level}                          max={10}  color="#4ecdc4" />
              </div>

              {/* Recent badges */}
              {badges && badges.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    fontFamily: sportsTheme.fontSub,
                    fontSize: '10px', fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: sportsTheme.textMuted, marginBottom: '10px',
                  }}>RECENT TROPHIES</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {badges.filter(b => b.unlocked).slice(0, 4).map((badge) => (
                      <div
                        key={badge.id}
                        title={badge.desc}
                        style={{
                          width: '44px', height: '44px',
                          background: `${C}18`,
                          border: `1px solid ${C}40`,
                          borderRadius: '8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '22px',
                        }}
                      >
                        {badge.icon || '🏅'}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View all trophies */}
              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { navigate('/sports/achievements'); onClose(); }}
                style={{
                  width: '100%', padding: '12px',
                  background: sportsTheme.bgCard,
                  borderLeft: `3px solid ${C}`,
                  borderRadius: '8px',
                  border: sportsTheme.borderFaint,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: sportsTheme.textSecondary,
                }}
              >
                <Trophy size={14} color={C} strokeWidth={1.8} />
                <span style={{
                  fontFamily: sportsTheme.fontSub,
                  fontSize: '13px', fontWeight: 700,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  View Trophy Case
                </span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
