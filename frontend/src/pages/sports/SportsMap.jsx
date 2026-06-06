import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, CheckCircle2, Trophy, ChevronRight, Star, Zap,
  Dumbbell, Building2, Medal,
  BarChart2, PiggyBank, TrendingUp, Shield, Target,
  FileText, Scale, Briefcase, Clock, Home as HomeIcon, Gem,
  Flag,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useSports } from '../../contexts/SportsContext';
import BossMatchModal from '../../components/sports/BossMatchModal';
import { sportsTheme } from '../../styles/sportsTheme';
import SuggestedForReview from '../../components/SuggestedForReview';

// ─── Season data ──────────────────────────────────────────────────────────────
const SEASONS = [
  {
    id: 0,
    season: 'PRE-SEASON',
    title: 'Foundations',
    desc: 'Master the fundamentals before the first whistle.',
    SeasonIcon: Dumbbell,
    topics: [
      { id: 's0t0', name: 'Budgeting Basics',   xp: 50,  Icon: BarChart2  },
      { id: 's0t1', name: 'Saving 101',          xp: 50,  Icon: PiggyBank  },
      { id: 's0t2', name: 'Income Tracking',     xp: 50,  Icon: TrendingUp },
      { id: 's0t3', name: 'Emergency Funds',     xp: 50,  Icon: Shield     },
    ],
    boss: { id: 'boss_s0', name: 'The Pre-Season Challenge', xp: 150, Icon: Flag },
  },
  {
    id: 1,
    season: 'REGULAR SEASON',
    title: 'Building Strategy',
    desc: 'Develop your playbook for long-term financial success.',
    SeasonIcon: Building2,
    topics: [
      { id: 's1t0', name: 'Investment Basics',   xp: 75,  Icon: TrendingUp },
      { id: 's1t1', name: 'Debt Management',      xp: 75,  Icon: Scale      },
      { id: 's1t2', name: 'Credit Scores',        xp: 75,  Icon: Target     },
      { id: 's1t3', name: 'Tax Fundamentals',     xp: 75,  Icon: FileText   },
    ],
    boss: { id: 'boss_s1', name: 'The Mid-Season Match', xp: 150, Icon: Trophy },
  },
  {
    id: 2,
    season: 'CHAMPIONSHIP',
    title: 'Elite Play',
    desc: 'The final stage. Prove you are the financial champion.',
    SeasonIcon: Medal,
    topics: [
      { id: 's2t0', name: 'Portfolio Building',  xp: 100, Icon: Briefcase  },
      { id: 's2t1', name: 'Retirement Planning', xp: 100, Icon: Clock      },
      { id: 's2t2', name: 'Real Estate',          xp: 100, Icon: HomeIcon   },
      { id: 's2t3', name: 'Wealth Building',      xp: 100, Icon: Gem        },
    ],
    boss: { id: 'boss_s2', name: 'The Championship Final', xp: 300, Icon: Medal },
  },
];

// ─── Unlock logic ─────────────────────────────────────────────────────────────
function isTopicUnlocked(seasonIdx, topicIdx, completedTopics, defeatedBosses) {
  if (seasonIdx === 0 && topicIdx === 0) return true;
  if (seasonIdx > 0 && !defeatedBosses.includes(`boss_s${seasonIdx - 1}`)) return false;
  if (topicIdx > 0) return completedTopics.includes(SEASONS[seasonIdx].topics[topicIdx - 1].name);
  return true;
}

function isBossUnlocked(seasonIdx, completedTopics) {
  return SEASONS[seasonIdx].topics.every(t => completedTopics.includes(t.name));
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function PathLine({ color, complete, pulse }) {
  return (
    <div style={{
      width: 2, height: 32, margin: '0 auto',
      background: complete
        ? color
        : 'rgba(255,255,255,0.1)',
      boxShadow: complete ? `0 0 8px ${color}` : 'none',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {pulse && (
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }}
          style={{
            position: 'absolute', width: '100%', height: '40%',
            background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
          }}
        />
      )}
    </div>
  );
}

function TopicNode({ topic, state, color, glow, onClick }) {
  // state: 'locked' | 'unlocked' | 'current' | 'complete'
  const isLocked   = state === 'locked';
  const isComplete = state === 'complete';
  const isCurrent  = state === 'current';

  return (
    <motion.button
      whileHover={!isLocked ? { x: 4, scale: 1.01 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      style={{
        width: '100%', textAlign: 'left',
        background: isComplete
          ? `${color}18`
          : isCurrent
            ? 'rgba(26,26,26,0.95)'
            : 'rgba(18,18,18,0.8)',
        border: isComplete
          ? `1px solid ${color}55`
          : isCurrent
            ? `1px solid ${color}35`
            : '1px solid rgba(255,255,255,0.07)',
        borderLeft: `3px solid ${isLocked ? 'rgba(255,255,255,0.1)' : isComplete ? color : isCurrent ? color : 'rgba(255,255,255,0.2)'}`,
        borderRadius: 10,
        padding: '13px 14px',
        cursor: isLocked ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: isComplete ? `0 0 20px ${color}15` : isCurrent ? `0 4px 16px rgba(0,0,0,0.5)` : 'none',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Emoji / icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isLocked
          ? 'rgba(255,255,255,0.04)'
          : isComplete
            ? `${color}22`
            : `${color}12`,
        border: isLocked
          ? '1px solid rgba(255,255,255,0.08)'
          : `1px solid ${color}35`,
        fontSize: isLocked ? 14 : 17,
      }}>
        {isLocked
          ? <Lock size={13} color="rgba(255,255,255,0.2)" strokeWidth={1.8} />
          : isComplete
            ? <CheckCircle2 size={16} color={color} strokeWidth={1.8} />
            : <topic.Icon size={16} color={color} strokeWidth={1.8} />
        }
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: sportsTheme.fontSub,
          fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
          color: isLocked ? 'rgba(255,255,255,0.22)' : isComplete ? color : '#fff',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {topic.name}
        </div>
        <div style={{
          fontFamily: sportsTheme.fontSub, fontWeight: 600,
          fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: isLocked ? 'rgba(255,255,255,0.12)' : isComplete ? color : 'rgba(255,255,255,0.4)',
          marginTop: 2,
        }}>
          {isComplete ? 'FULL TIME' : isLocked ? 'LOCKED' : `+${topic.xp} XP`}
        </div>
      </div>

      {/* Right badge */}
      {!isLocked && (
        isComplete ? (
          <div style={{
            fontFamily: sportsTheme.fontHeading,
            fontSize: 11, letterSpacing: '0.5px',
            color: color, opacity: 0.7,
          }}>
            ✓
          </div>
        ) : (
          <ChevronRight size={14} color="rgba(255,255,255,0.25)" />
        )
      )}
    </motion.button>
  );
}

function BossNode({ boss, state, color, glow, onClick }) {
  // state: 'locked' | 'unlocked' | 'defeated'
  const isLocked   = state === 'locked';
  const isDefeated = state === 'defeated';
  const isReady    = state === 'unlocked';

  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.015 } : {}}
      whileTap={!isLocked ? { scale: 0.975 } : {}}
      onClick={!isLocked ? onClick : undefined}
      style={{
        width: '100%', textAlign: 'center',
        background: isDefeated
          ? `${color}20`
          : isReady
            ? 'rgba(20,20,20,0.98)'
            : 'rgba(14,14,14,0.85)',
        border: isDefeated
          ? `1.5px solid ${color}70`
          : isReady
            ? `1.5px solid ${color}55`
            : '1.5px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '18px 16px',
        cursor: isLocked ? 'default' : 'pointer',
        boxShadow: isDefeated
          ? `0 0 32px ${color}22, 0 8px 24px rgba(0,0,0,0.4)`
          : isReady
            ? `0 0 24px ${glow}30, 0 8px 24px rgba(0,0,0,0.5)`
            : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Animated pulse ring when ready */}
      {isReady && (
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute', inset: 0,
            border: `2px solid ${color}`,
            borderRadius: 14, pointerEvents: 'none',
          }}
        />
      )}

      {/* Boss icon */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%', margin: '0 auto 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isLocked
          ? 'rgba(255,255,255,0.05)'
          : isDefeated
            ? color
            : `${color}20`,
        border: isLocked
          ? '2px solid rgba(255,255,255,0.1)'
          : `2px solid ${color}`,
        boxShadow: !isLocked ? `0 0 24px ${glow}` : 'none',
        fontSize: 28,
      }}>
        {isLocked
          ? <Lock size={20} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
          : isDefeated
            ? <Trophy size={28} color="#000" strokeWidth={1.5} />
            : <boss.Icon size={28} color={color} strokeWidth={1.5} />
        }
      </div>

      {/* Label */}
      <div style={{
        fontFamily: sportsTheme.fontSub, fontWeight: 600,
        fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: isLocked ? 'rgba(255,255,255,0.2)' : color,
        marginBottom: 5,
      }}>
        {isDefeated ? 'DEFEATED' : isReady ? 'CHALLENGE READY' : 'LOCKED'}
      </div>

      <div style={{
        fontFamily: sportsTheme.fontHeading,
        fontSize: 20, letterSpacing: '1.5px',
        color: isLocked ? 'rgba(255,255,255,0.25)' : '#fff',
        marginBottom: 6,
        textShadow: !isLocked ? `0 0 16px ${glow}` : 'none',
      }}>
        {boss.name}
      </div>

      {!isLocked && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {isDefeated ? (
            <span style={{
              fontFamily: sportsTheme.fontSub, fontWeight: 700,
              fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
              color, opacity: 0.8,
            }}>
              ✓ Season Cleared
            </span>
          ) : (
            <>
              <Zap size={11} color={color} />
              <span style={{
                fontFamily: sportsTheme.fontSub, fontWeight: 700,
                fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                color,
              }}>
                +{boss.xp} XP · Tap to Challenge
              </span>
            </>
          )}
        </div>
      )}
    </motion.button>
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function SportsMap() {
  const navigate = useNavigate();
  const { completedTopics = [], loading: userLoading } = useUser();
  const { defeatedBosses = [], addDefeatedBoss } = useSports();
  const { sportsColor: C, sportsGlow: G, awardXP } = useOutletContext();

  const color = C || '#E8457A';
  const glow  = G || 'rgba(232,69,122,0.5)';

  const [activeBoss, setActiveBoss] = useState(null); // { boss, seasonIdx }

  // Summary stats
  const totalTopics   = SEASONS.reduce((acc, s) => acc + s.topics.length, 0);
  const doneTopics    = completedTopics.filter(name =>
    SEASONS.some(s => s.topics.some(t => t.name === name))
  ).length;
  const doneBosses    = defeatedBosses.filter(id =>
    SEASONS.some(s => s.boss.id === id)
  ).length;

  function handleTopicClick(topic) {
    const flat = SEASONS.flatMap(s => s.topics);
    const idx  = flat.findIndex(t => t.id === topic.id);
    const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
    navigate('/sports/learn', { state: {
      topic: topic.name, topicId: topic.id,
      nextTopic: next?.name || null, nextTopicId: next?.id || null,
    }});
  }

  function handleBossVictory() {
    if (!activeBoss) return;
    addDefeatedBoss(activeBoss.boss.id);
    awardXP?.(activeBoss.boss.xp);
  }

  function handleBossClose() {
    setActiveBoss(null);
  }

  if (userLoading) return <LoadingSpinner C={color} />;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ padding: '18px 16px 40px', maxWidth: 560, margin: '0 auto' }}
      >
        {/* ── Progress summary card ──────────────────────────────────── */}
        <div style={{
          background: 'rgba(20,20,20,0.9)',
          border: `1px solid ${color}30`,
          borderRadius: 14, padding: '16px 18px',
          marginBottom: 28,
          boxShadow: `0 0 24px ${color}10`,
        }}>
          <div style={{
            fontFamily: sportsTheme.fontSub, fontWeight: 600,
            fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
            color, marginBottom: 10,
          }}>
            Season Progress
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            {[
              { label: 'Training Sessions', value: `${doneTopics}/${totalTopics}`, icon: <Star size={12} color={color} /> },
              { label: 'Championships',     value: `${doneBosses}/3`,              icon: <Trophy size={12} color={color} /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                flex: 1, padding: '10px 12px', borderRadius: 10, textAlign: 'center',
                background: `${color}0C`, border: `1px solid ${color}25`,
              }}>
                <div style={{
                  fontFamily: sportsTheme.fontHeading,
                  fontSize: 22, letterSpacing: '1px', color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}>
                  {icon} {value}
                </div>
                <div style={{
                  fontFamily: sportsTheme.fontSub, fontWeight: 600,
                  fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)', marginTop: 3,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginBottom: 5,
            }}>
              <span style={{
                fontFamily: sportsTheme.fontSub, fontWeight: 600,
                fontSize: 10, letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.35)',
              }}>Overall Progress</span>
              <span style={{
                fontFamily: sportsTheme.fontHeading,
                fontSize: 12, letterSpacing: '0.5px', color,
              }}>
                {Math.round((doneTopics / totalTopics) * 100)}%
              </span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(doneTopics / totalTopics) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 3, background: color, boxShadow: `0 0 6px ${glow}` }}
              />
            </div>
          </div>
        </div>

        {/* ── Suggested for Review (spaced repetition) ── */}
        <SuggestedForReview
          domain="sports"
          accent={color}
          theme={{ surface: sportsTheme.bgCard, border: 'rgba(255,255,255,0.10)', textPrimary: sportsTheme.textPrimary, textMuted: sportsTheme.textMuted, radius: 12, fontHeading: sportsTheme.fontHeading, fontBody: sportsTheme.fontBody }}
        />

        {/* ── Seasons ───────────────────────────────────────────────── */}
        {SEASONS.map((season, si) => {
          const seasonUnlocked = si === 0 || defeatedBosses.includes(`boss_s${si - 1}`);
          const bossReady      = isBossUnlocked(si, completedTopics);
          const bossDefeated   = defeatedBosses.includes(season.boss.id);

          const bossState = !seasonUnlocked || !bossReady
            ? 'locked'
            : bossDefeated
              ? 'defeated'
              : 'unlocked';

          return (
            <div key={season.id} style={{ marginBottom: 32 }}>
              {/* Season header */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: seasonUnlocked ? 1 : 0.4, x: 0 }}
                transition={{ duration: 0.3, delay: si * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  marginBottom: 16,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: seasonUnlocked ? `${color}18` : 'rgba(255,255,255,0.04)',
                  border: seasonUnlocked ? `1.5px solid ${color}50` : '1.5px solid rgba(255,255,255,0.1)',
                }}>
                  {seasonUnlocked
                    ? <season.SeasonIcon size={20} color={color} strokeWidth={1.8} />
                    : <Lock size={16} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: sportsTheme.fontSub, fontWeight: 600,
                    fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: seasonUnlocked ? color : 'rgba(255,255,255,0.2)',
                    marginBottom: 2,
                  }}>
                    {season.season}
                  </div>
                  <div style={{
                    fontFamily: sportsTheme.fontHeading,
                    fontSize: 22, letterSpacing: '1.5px',
                    color: seasonUnlocked ? '#fff' : 'rgba(255,255,255,0.2)',
                  }}>
                    {season.title}
                  </div>
                </div>
                {seasonUnlocked && (
                  <div style={{
                    fontFamily: sportsTheme.fontHeading,
                    fontSize: 13, letterSpacing: '0.5px', color,
                    opacity: 0.7,
                  }}>
                    {season.topics.filter(t => completedTopics.includes(t.name)).length}/{season.topics.length}
                  </div>
                )}
              </motion.div>

              {/* Topic nodes with connecting lines */}
              <div style={{ paddingLeft: 8, paddingRight: 8 }}>
                {season.topics.map((topic, ti) => {
                  const unlocked = isTopicUnlocked(si, ti, completedTopics, defeatedBosses);
                  const complete  = completedTopics.includes(topic.name);
                  const prevDone  = ti === 0 || completedTopics.includes(season.topics[ti - 1].name);

                  const topicState = !unlocked
                    ? 'locked'
                    : complete
                      ? 'complete'
                      : 'current';

                  return (
                    <React.Fragment key={topic.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: si * 0.06 + ti * 0.05 }}
                      >
                        <TopicNode
                          topic={topic}
                          state={topicState}
                          color={color}
                          glow={glow}
                          onClick={() => handleTopicClick(topic)}
                        />
                      </motion.div>
                      {/* Path line between topics */}
                      {ti < season.topics.length - 1 && (
                        <PathLine
                          color={color}
                          complete={complete}
                          pulse={unlocked && !complete && prevDone}
                        />
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Path line from last topic to boss */}
                <PathLine
                  color={color}
                  complete={bossReady && seasonUnlocked}
                  pulse={bossReady && !bossDefeated && seasonUnlocked}
                />

                {/* Boss node */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: si * 0.06 + 0.25 }}
                >
                  <BossNode
                    boss={season.boss}
                    state={bossState}
                    color={color}
                    glow={glow}
                    onClick={() => setActiveBoss({ boss: season.boss, seasonIdx: si })}
                  />
                </motion.div>
              </div>

              {/* Season divider */}
              {si < SEASONS.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                  <div style={{
                    fontFamily: sportsTheme.fontSub, fontWeight: 600,
                    fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.2)',
                    padding: '4px 10px', borderRadius: 20,
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    Next Season
                  </div>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                </div>
              )}
            </div>
          );
        })}

        {/* ── Champion state ─────────────────────────────────────────── */}
        {defeatedBosses.length === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              textAlign: 'center', padding: '28px 20px',
              background: `${color}12`,
              border: `1.5px solid ${color}60`,
              borderRadius: 16,
              boxShadow: `0 0 40px ${color}20`,
              marginTop: 8,
            }}
          >
            <Trophy size={52} color={color} strokeWidth={1.2} style={{ marginBottom: 12 }} />
            <div style={{
              fontFamily: sportsTheme.fontHeading,
              fontSize: 30, letterSpacing: '2.5px', color, marginBottom: 6,
              textShadow: `0 0 24px ${glow}`,
            }}>
              CHAMPION
            </div>
            <div style={{
              fontFamily: sportsTheme.fontBody,
              fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
            }}>
              You have conquered all three seasons.<br />
              Financial mastery achieved.
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Boss Match Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {activeBoss && (
          <BossMatchModal
            boss={activeBoss.boss}
            color={color}
            glow={glow}
            onVictory={handleBossVictory}
            onDefeat={() => {}}
            onClose={handleBossClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}
