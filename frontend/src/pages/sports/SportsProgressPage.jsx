import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame, BookOpen, Target, TrendingUp,
  CheckCircle2, Lock, Trophy, Dumbbell, Building2, Medal, Flag, ArrowRight,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useSports } from '../../contexts/SportsContext';
import { useGamification } from '../../hooks/useGamification';
import { sportsTheme } from '../../styles/sportsTheme';

// ── Season structure (mirrors SportsMap data) ─────────────────────────────────
const SEASON_STRUCTURE = [
  {
    id: 0,
    label: 'PRE-SEASON',
    subtitle: 'Foundations',
    SeasonIcon: Dumbbell,
    topicIds: ['s0t0', 's0t1', 's0t2', 's0t3'],
    topicNames: ['Budgeting Basics', 'Saving 101', 'Income Tracking', 'Emergency Funds'],
    bossId: 'boss_s0',
    bossName: 'Pre-Season Challenge',
    BossIcon: Flag,
  },
  {
    id: 1,
    label: 'REGULAR SEASON',
    subtitle: 'Building Strategy',
    SeasonIcon: Building2,
    topicIds: ['s1t0', 's1t1', 's1t2', 's1t3'],
    topicNames: ['Investment Basics', 'Debt Management', 'Credit Scores', 'Tax Fundamentals'],
    bossId: 'boss_s1',
    bossName: 'Mid-Season Match',
    BossIcon: Trophy,
  },
  {
    id: 2,
    label: 'CHAMPIONSHIP',
    subtitle: 'Elite Play',
    SeasonIcon: Medal,
    topicIds: ['s2t0', 's2t1', 's2t2', 's2t3'],
    topicNames: ['Portfolio Building', 'Retirement Planning', 'Real Estate', 'Wealth Building'],
    bossId: 'boss_s2',
    bossName: 'Championship Final',
    BossIcon: Medal,
  },
];

const DIVISION_NAMES = {
  1: 'Premier League', 2: 'Championship', 3: 'League One',
  4: 'League Two', 5: 'National', 6: 'Regional',
  7: 'County A', 8: 'County B', 9: 'County C', 10: 'Amateur',
};

// ── Stat panel card ───────────────────────────────────────────────────────────
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
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} color={color} strokeWidth={1.8} />
      </div>
      <div>
        <div style={{
          fontFamily: sportsTheme.fontSub,
          fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)', marginBottom: '2px',
        }}>{label}</div>
        <div style={{
          fontFamily: sportsTheme.fontHeading,
          fontSize: '28px', letterSpacing: '1.5px',
          color, lineHeight: 1,
        }}>{value}</div>
        {sub && (
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px',
          }}>{sub}</div>
        )}
      </div>
    </motion.div>
  );
}

// ── Season row card ───────────────────────────────────────────────────────────
function SeasonRow({ season, completedTopics, defeatedBosses, C, delay }) {
  const topicsDone = season.topicIds.filter(id => completedTopics.includes(id)).length;
  const total      = season.topicIds.length;
  const bossDefeated = defeatedBosses.includes(season.bossId);
  const allTopicsDone = topicsDone === total;
  const bossUnlocked  = allTopicsDone;
  const isComplete    = bossDefeated;
  const pct = Math.round((topicsDone / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{
        background: isComplete ? 'rgba(26,26,26,0.95)' : 'rgba(20,20,20,0.95)',
        borderLeft: `3px solid ${isComplete ? C : 'rgba(255,255,255,0.1)'}`,
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '8px',
        padding: '14px 16px',
        boxShadow: isComplete ? `0 0 20px ${C}20` : 'none',
      }}
    >
      {/* Season header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: isComplete ? `${C}18` : 'rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <season.SeasonIcon size={16} color={isComplete ? C : 'rgba(255,255,255,0.25)'} strokeWidth={1.8} />
          </div>
          <div>
            <div style={{
              fontFamily: sportsTheme.fontSub, fontSize: 9, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: isComplete ? C : 'rgba(255,255,255,0.3)',
            }}>
              {season.label}
            </div>
            <div style={{
              fontFamily: sportsTheme.fontHeading,
              fontSize: 16, letterSpacing: '1px',
              color: isComplete ? '#fff' : 'rgba(255,255,255,0.5)',
            }}>
              {season.subtitle}
            </div>
          </div>
        </div>
        {isComplete && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 4,
            background: `${C}18`,
            border: `1px solid ${C}40`,
            fontFamily: sportsTheme.fontSub, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: C,
          }}>
            <CheckCircle2 size={10} /> COMPLETE
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{
            fontFamily: sportsTheme.fontSub, fontSize: 9, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
          }}>
            DRILLS
          </span>
          <span style={{
            fontFamily: sportsTheme.fontHeading, fontSize: 12, letterSpacing: '1px',
            color: isComplete ? C : 'rgba(255,255,255,0.4)',
          }}>
            {topicsDone}/{total}
          </span>
        </div>
        <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, delay: delay + 0.1 }}
            style={{ height: '100%', borderRadius: 99, background: pct === 100 ? C : 'rgba(255,255,255,0.2)' }}
          />
        </div>
      </div>

      {/* Boss status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px', borderRadius: 6,
        background: bossDefeated
          ? `${C}10`
          : bossUnlocked
            ? 'rgba(255,255,255,0.04)'
            : 'rgba(0,0,0,0.2)',
        border: `1px solid ${bossDefeated ? C + '40' : 'rgba(255,255,255,0.06)'}`,
      }}>
        {bossDefeated
          ? <Trophy size={13} color={C} />
          : bossUnlocked
            ? <season.BossIcon size={13} color="rgba(255,255,255,0.45)" />
            : <Lock size={13} color="rgba(255,255,255,0.2)" />}
        <span style={{
          fontFamily: sportsTheme.fontSub, fontSize: 10, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: bossDefeated ? C : bossUnlocked ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)',
        }}>
          {season.bossName}
        </span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: sportsTheme.fontSub, fontSize: 9, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: bossDefeated ? C : bossUnlocked ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
        }}>
          {bossDefeated ? 'DEFEATED' : bossUnlocked ? 'READY' : 'LOCKED'}
        </span>
      </div>
    </motion.div>
  );
}

function LoadingSpinner({ C }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 14 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: C }}
      />
      <div style={{ fontFamily: sportsTheme.fontSub, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
        LOADING...
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SportsProgressPage() {
  const navigate = useNavigate();
  const { completedTopics, stats, loading: userLoading } = useUser();
  const { defeatedBosses } = useSports();
  const { streak } = useGamification();
  const {
    sportsColor: C, sportsCharacter,
    xp, level, division, levelProgress, getXPForNextLevel,
  } = useOutletContext();

  const xpToNext = getXPForNextLevel?.() ?? 500;
  const divName  = DIVISION_NAMES[division] || 'Amateur';
  const avgScore = stats?.avgScore ?? 0;

  if (userLoading) return <LoadingSpinner C={C} />;

  const totalTopics = SEASON_STRUCTURE.reduce((acc, s) => acc + s.topicIds.length, 0);
  const bossesDone  = (defeatedBosses || []).length;
  const milestones = [
    { label: 'First Whistle',  pts: 0    },
    { label: 'Hat Trick',      pts: 300  },
    { label: 'Clean Sheet',    pts: 600  },
    { label: 'Golden Boot',    pts: 900  },
    { label: 'Champions',      pts: 1200 },
    { label: 'The Treble',     pts: 1500 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* ── Character + Division summary ── */}
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
              fontFamily: sportsTheme.fontSub, fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C, marginBottom: '4px',
            }}>
              {sportsCharacter.name} · ACTIVE
            </div>
            <div style={{
              fontFamily: sportsTheme.fontHeading,
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
            fontFamily: sportsTheme.fontHeading,
            fontSize: '52px', color: C,
            letterSpacing: '2px', lineHeight: 1,
            textShadow: `0 0 24px ${sportsCharacter.glow}`,
          }}>
            {division}
          </div>
        </motion.div>
      )}

      {/* ── XP Progress bar ── */}
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
            fontFamily: sportsTheme.fontSub, fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}>
            MATCH PROGRESS · LEVEL {level} → {level + 1}
          </span>
          <span style={{
            fontFamily: sportsTheme.fontHeading,
            fontSize: '13px', letterSpacing: '1px', color: C,
          }}>
            {xp} / {xp + xpToNext}
          </span>
        </div>
        <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            style={{ height: '100%', borderRadius: '4px', background: C, boxShadow: `0 0 10px ${C}80` }}
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

      {/* ── Day-1 encouragement ── */}
      {completedTopics.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: `${C}10`,
            border: `1px solid ${C}30`,
            borderRadius: '8px',
            padding: '18px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}
        >
          <div>
            <div style={{
              fontFamily: sportsTheme.fontSub, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: C, marginBottom: 4,
            }}>
              FIRST WHISTLE
            </div>
            <div style={{ fontFamily: sportsTheme.fontHeading, fontSize: 20, letterSpacing: '1.5px', color: '#fff', lineHeight: 1, marginBottom: 4 }}>
              Begin Your Journey
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Complete your first training session to see your stats.
            </p>
          </div>
          <motion.button
            whileHover={{ filter: 'brightness(1.12)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/sports/playbook')}
            style={{
              background: C, color: '#000',
              padding: '9px 16px', borderRadius: '8px',
              fontFamily: sportsTheme.fontHeading,
              fontSize: '16px', letterSpacing: '1.5px',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              flexShrink: 0,
            }}
          >
            TRAIN <ArrowRight size={14} strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      )}

      {/* ── Stat grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <StatPanel label="Match Points"  value={xp}                          sub={`${xpToNext} to next level`}    color={C}          Icon={TrendingUp} delay={0.15} />
        <StatPanel label="Win Streak"    value={streak}                       sub={streak > 0 ? 'Keep going!' : 'Start a run!'} color="#fb923c"    Icon={Flame}      delay={0.20} />
        <StatPanel label="Drills Done"   value={completedTopics.length}       sub={`of ${totalTopics} total`}      color="#4ecdc4"    Icon={BookOpen}   delay={0.25} />
        <StatPanel label="Avg Score"     value={`${Math.round(avgScore)}%`}   sub="Accuracy rate"                  color="#a78bfa"    Icon={Target}     delay={0.30} />
      </div>

      {/* ── Season Breakdown ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div style={{
          fontFamily: sportsTheme.fontSub, fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)', marginBottom: 10,
        }}>
          SEASON BREAKDOWN
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SEASON_STRUCTURE.map((s, i) => (
            <SeasonRow
              key={s.id}
              season={s}
              completedTopics={completedTopics}
              defeatedBosses={defeatedBosses || []}
              C={C}
              delay={0.4 + i * 0.08}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Championship count ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          background: 'rgba(26,26,26,0.95)',
          borderLeft: `3px solid ${C}`,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: `${C}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Trophy size={18} color={C} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: sportsTheme.fontSub, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', marginBottom: 4,
          }}>
            CHAMPIONSHIPS WON
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {SEASON_STRUCTURE.map(s => {
              const won = (defeatedBosses || []).includes(s.bossId);
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', borderRadius: 4,
                  background: won ? `${C}15` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${won ? C + '40' : 'rgba(255,255,255,0.07)'}`,
                  fontFamily: sportsTheme.fontSub, fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: won ? C : 'rgba(255,255,255,0.2)',
                }}>
                  {won ? <Trophy size={9} /> : <Lock size={9} />} {s.label}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{
          fontFamily: sportsTheme.fontHeading,
          fontSize: 40, letterSpacing: '2px',
          color: C, lineHeight: 1,
          textShadow: `0 0 20px ${sportsCharacter?.glow || C}`,
        }}>
          {bossesDone}/3
        </div>
      </motion.div>

      {/* ── Division Ladder ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
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
          fontFamily: sportsTheme.fontSub, fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)', marginBottom: '14px',
        }}>
          DIVISION LADDER
        </div>
        {milestones.map((m, i) => {
          const reached = xp >= m.pts;
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
                fontFamily: sportsTheme.fontSub, fontSize: '13px', fontWeight: 600,
                color: reached ? '#fff' : 'rgba(255,255,255,0.3)', flex: 1,
              }}>
                {m.label}
              </span>
              <span style={{
                fontFamily: sportsTheme.fontHeading, fontSize: '13px', letterSpacing: '0.5px',
                color: reached ? C : 'rgba(255,255,255,0.2)',
              }}>
                {m.pts} PTS
              </span>
              {reached && (
                <span style={{
                  fontFamily: sportsTheme.fontSub, fontSize: '9px', fontWeight: 600,
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
