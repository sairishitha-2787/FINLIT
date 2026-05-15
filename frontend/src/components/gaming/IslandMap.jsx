import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock, CheckCircle, Zap, Skull, ChevronDown,
  Sun, Building2, Globe, Bot, AlertTriangle, Play,
} from 'lucide-react';
import { gamingTheme, getElementColors } from '../../styles/gamingTheme';
import { useIsMobile } from '../../hooks/useIsMobile';

export const GAMING_ISLANDS = [
  {
    id: 'tutorial',
    name: 'Tutorial Island',
    subtitle: 'THE BEGINNING',
    icon: Sun,
    topics: ['Budgeting Basics', 'Saving Money', 'Emergency Funds', 'Simple Interest'],
    bossId: 'boss_tutorial',
    bossName: 'The Budget Beast',
    bossIcon: Skull,
    bossXP: 150,
    zoneImage: '/ZONES/GAMING_ZONE-1.png',
  },
  {
    id: 'citadel',
    name: 'Neon Citadel',
    subtitle: 'THE PROVING GROUNDS',
    icon: Building2,
    topics: ['Compound Interest', 'Credit Scores', 'Investing Basics', 'Stocks & Bonds'],
    bossId: 'boss_citadel',
    bossName: 'The Market Titan',
    bossIcon: Bot,
    bossXP: 150,
    zoneImage: '/ZONES/GAMING_ZONE-2.png',
  },
  {
    id: 'rift',
    name: 'Astral Rift',
    subtitle: 'THE ENDGAME',
    icon: Globe,
    topics: ['Retirement Accounts', 'Tax Fundamentals', 'Debt Management', 'Portfolio Diversification'],
    bossId: 'boss_rift',
    bossName: 'The Final Override',
    bossIcon: Zap,
    bossXP: 150,
    zoneImage: '/ZONES/GAMING_ZONE-3.png',
  },
];

const ISLAND_THEMES = {
  tutorial: { color: '#4ECDC4', glow: 'rgba(78,205,196,0.22)',  bg: 'rgba(78,205,196,0.05)',  zone: 'ZONE I'   },
  citadel:  { color: '#818CF8', glow: 'rgba(129,140,248,0.22)', bg: 'rgba(129,140,248,0.05)', zone: 'ZONE II'  },
  rift:     { color: '#F87171', glow: 'rgba(248,113,113,0.22)', bg: 'rgba(248,113,113,0.05)', zone: 'ZONE III' },
};

const getTopicStatus = (topicName, islandTopics, completedTopics, islandUnlocked) => {
  if (!islandUnlocked) return 'locked';
  if (completedTopics.includes(topicName)) return 'completed';
  const idx = islandTopics.indexOf(topicName);
  const allPrevDone = islandTopics.slice(0, idx).every(t => completedTopics.includes(t));
  return allPrevDone ? 'current' : 'locked';
};

const isIslandUnlocked = (idx, defeatedBosses) =>
  idx === 0 || defeatedBosses.includes(GAMING_ISLANDS[idx - 1].bossId);

const isBossAvailable = (island, completedTopics) =>
  island.topics.every(t => completedTopics.includes(t));

// Build a precise per-segment gradient for the connector line
function buildConnectorGradient(topics, completedTopics, theme, unlocked) {
  if (!unlocked) return 'rgba(139,184,233,0.08)';
  const n = topics.length;
  const glow = `${theme.color}bb`;
  const dim  = 'rgba(139,184,233,0.15)';
  const stops = [];

  for (let i = 0; i < n; i++) {
    const startPct = (i / n * 100).toFixed(1);
    const endPct   = ((i + 1) / n * 100).toFixed(1);
    const color = completedTopics.includes(topics[i]) ? glow : dim;
    stops.push(`${color} ${startPct}%`, `${color} ${endPct}%`);
    if (i < n - 1) {
      const nextColor = completedTopics.includes(topics[i + 1]) ? glow : dim;
      if (nextColor !== color) {
        stops.push(`${nextColor} ${endPct}%`);
      }
    }
  }

  return `linear-gradient(180deg, ${stops.join(', ')})`;
}

export default function IslandMap({ character, completedTopics = [], defeatedBosses = [], onTopicClick, onBossClick }) {
  const charColors = getElementColors(character);
  const { isMobile } = useIsMobile();

  return (
    <div style={{ padding: isMobile ? '16px 12px 60px' : '28px 32px 80px' }}>
      {GAMING_ISLANDS.map((island, islandIdx) => {
        const theme       = ISLAND_THEMES[island.id];
        const unlocked    = isIslandUnlocked(islandIdx, defeatedBosses);
        const bossAvail   = isBossAvailable(island, completedTopics);
        const bossDefeated = defeatedBosses.includes(island.bossId);
        const topicsDone  = island.topics.filter(t => completedTopics.includes(t)).length;
        const allDone     = topicsDone === island.topics.length;
        const IslandIcon  = island.icon;
        const BossIcon    = island.bossIcon;

        return (
          <motion.div
            key={island.id}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: unlocked ? 1 : 0.42, y: 0 }}
            transition={{ delay: islandIdx * 0.15, duration: 0.5 }}
            style={{ marginBottom: islandIdx < GAMING_ISLANDS.length - 1 ? 0 : '52px', display: 'flex', gap: isMobile ? '0' : '28px', alignItems: 'flex-start' }}
          >
            {/* ── Left: island content ─────────────────────────────── */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* ── Island Banner ────────────────────────────────────── */}
              <div style={{
                padding: '20px 24px', marginBottom: '4px', borderRadius: '16px',
                background: unlocked
                  ? `linear-gradient(135deg, ${theme.bg} 0%, rgba(30,42,69,0.7) 100%)`
                  : 'rgba(25,34,58,0.6)',
                border: `1px solid ${unlocked ? theme.color + '30' : 'rgba(139,184,233,0.1)'}`,
                borderLeft: `4px solid ${unlocked ? theme.color : 'rgba(139,184,233,0.2)'}`,
                position: 'relative', overflow: 'hidden',
              }}>
                {unlocked && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0, width: '180px', height: '100%',
                    background: `radial-gradient(ellipse at 100% 50%, ${theme.glow} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />
                )}
                <div style={{
                  fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                  letterSpacing: '3px', textTransform: 'uppercase',
                  color: unlocked ? theme.color : gamingTheme.mutedBlue,
                  marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span>{theme.zone}</span><span style={{ opacity: 0.4 }}>·</span>
                  <span style={{ opacity: 0.6 }}>{island.subtitle}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IslandIcon size={24} color={unlocked ? theme.color : gamingTheme.mutedBlue} style={{ opacity: unlocked ? 1 : 0.5 }} />
                    <h2 style={{
                      fontFamily: gamingTheme.fontHeading, fontSize: '19px', fontWeight: 800,
                      color: unlocked ? gamingTheme.stellarWhite : gamingTheme.mutedBlue,
                      textTransform: 'uppercase', letterSpacing: '2px',
                      textShadow: unlocked ? `0 0 20px ${theme.glow}` : 'none', margin: 0,
                    }}>{island.name}</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {island.topics.map((t, i) => {
                        const done = completedTopics.includes(t);
                        return (
                          <motion.div key={i}
                            animate={done ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.4 }}
                            style={{
                              width: done ? 10 : 8, height: done ? 10 : 8, borderRadius: '50%',
                              background: done ? theme.color : 'rgba(139,184,233,0.2)',
                              boxShadow: done ? `0 0 8px ${theme.color}` : 'none',
                              transition: 'all 0.3s ease',
                            }}
                          />
                        );
                      })}
                    </div>
                    <span style={{ fontFamily: gamingTheme.fontLabel, fontSize: '10px', color: unlocked ? theme.color : gamingTheme.mutedBlue, letterSpacing: '1px' }}>
                      {topicsDone}/{island.topics.length}
                    </span>
                    {!unlocked && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '3px 9px', borderRadius: '999px',
                        fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                        letterSpacing: '1px', color: gamingTheme.mutedBlue,
                        background: 'rgba(139,184,233,0.08)', border: '1px solid rgba(139,184,233,0.15)',
                      }}>
                        <Lock size={9} /> LOCKED
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Path + Topics (grid: path-col | content-col) ─────── */}
              <div style={{ display: 'flex', paddingTop: '10px', position: 'relative' }}>

                {/* PATH COLUMN */}
                <div style={{
                  width: '40px', flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  position: 'relative',
                }}>
                  {/* Connector line spanning topics */}
                  <div style={{
                    position: 'absolute',
                    top: 0, bottom: 0, left: '50%',
                    transform: 'translateX(-1px)',
                    width: '2px',
                    background: buildConnectorGradient(island.topics, completedTopics, theme, unlocked),
                    boxShadow: topicsDone > 0 && unlocked ? `0 0 10px ${theme.color}55` : 'none',
                    transition: 'background 0.5s ease, box-shadow 0.5s ease',
                  }} />

                  {/* Per-topic dots */}
                  {island.topics.map((topic, topicIdx) => {
                    const status = getTopicStatus(topic, island.topics, completedTopics, unlocked);
                    const isCompleted = status === 'completed';
                    const isCurrent   = status === 'current';

                    return (
                      <div
                        key={topic}
                        style={{
                          // height must match the topic card height (padding + content + margin 8px)
                          height: isMobile ? '78px' : '76px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          position: 'relative', zIndex: 2, flexShrink: 0,
                        }}
                      >
                        <PathDot
                          completed={isCompleted}
                          current={isCurrent}
                          theme={theme}
                          charColors={charColors}
                        />
                      </div>
                    );
                  })}

                  {/* Line from last topic dot to boss dot */}
                  <div style={{
                    width: '2px', height: '28px', flexShrink: 0,
                    background: allDone && unlocked ? `${theme.color}aa` : 'rgba(139,184,233,0.1)',
                    boxShadow: allDone && unlocked ? `0 0 8px ${theme.color}66` : 'none',
                    transition: 'background 0.4s, box-shadow 0.4s',
                  }} />

                  {/* Boss dot */}
                  <motion.div
                    animate={bossAvail && !bossDefeated ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      zIndex: 2, position: 'relative',
                      background: bossDefeated
                        ? gamingTheme.mint
                        : bossAvail ? theme.color : gamingTheme.bgMid,
                      border: `2.5px solid ${bossDefeated ? gamingTheme.mint : bossAvail ? theme.color : 'rgba(139,184,233,0.2)'}`,
                      boxShadow: bossDefeated
                        ? `0 0 14px ${gamingTheme.mint}, 0 0 28px ${gamingTheme.mint}55`
                        : bossAvail ? `0 0 12px ${theme.color}, 0 0 24px ${theme.glow}` : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {bossDefeated && <Skull size={9} color={gamingTheme.bgDark} strokeWidth={2.5} />}
                  </motion.div>
                </div>

                {/* CONTENT COLUMN */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {island.topics.map((topic, topicIdx) => {
                    const status = getTopicStatus(topic, island.topics, completedTopics, unlocked);
                    const isCompleted = status === 'completed';
                    const isCurrent   = status === 'current';
                    const isLocked    = status === 'locked';

                    return (
                      <motion.div
                        key={topic}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: islandIdx * 0.12 + topicIdx * 0.07 }}
                        whileHover={!isLocked ? { x: 4, transition: { duration: 0.15 } } : {}}
                        onClick={!isLocked ? () => onTopicClick(topic) : undefined}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: isMobile ? '16px 16px' : '16px 22px',
                          marginBottom: '8px',
                          borderRadius: '12px',
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          background: isLocked
                            ? 'rgba(25,34,58,0.5)'
                            : isCurrent
                              ? `linear-gradient(90deg, rgba(${hexToRgbStr(charColors.primary)},0.13) 0%, rgba(25,34,58,0.7) 100%)`
                              : 'rgba(25,34,58,0.55)',
                          border: isCurrent
                            ? `1px solid rgba(${hexToRgbStr(charColors.primary)},0.6)`
                            : isCompleted
                              ? `1px solid rgba(${hexToRgbStr(theme.color)},0.25)`
                              : '1px solid rgba(139,184,233,0.1)',
                          backdropFilter: 'blur(8px)',
                          boxShadow: isCurrent
                            ? `0 0 20px rgba(${hexToRgbStr(charColors.primary)},0.18), inset 0 0 10px rgba(${hexToRgbStr(charColors.primary)},0.06)`
                            : 'none',
                          opacity: isLocked ? 0.5 : 1,
                          transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: gamingTheme.fontBody, fontWeight: 600, fontSize: '14px',
                            color: isLocked ? gamingTheme.mutedBlue : gamingTheme.stellarWhite,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>{topic}</div>
                          <div style={{
                            fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                            letterSpacing: '1.5px', textTransform: 'uppercase',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            color: isCompleted ? theme.color : isCurrent ? charColors.primary : 'rgba(139,184,233,0.35)',
                            marginTop: '3px',
                          }}>
                            {isCompleted
                              ? <><CheckCircle size={9} /> Cleared</>
                              : isCurrent
                                ? <><Play size={9} /> In Progress</>
                                : <><Lock size={9} /> Locked</>
                            }
                          </div>
                        </div>
                        {isCurrent && (
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity }}
                          >
                            <Zap size={14} color={charColors.primary} />
                          </motion.div>
                        )}
                        {isCompleted && (
                          <span style={{
                            padding: '2px 8px', borderRadius: '999px', flexShrink: 0,
                            fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                            color: theme.color, background: `${theme.color}18`,
                            border: `1px solid ${theme.color}33`, letterSpacing: '0.5px',
                          }}>+30 XP</span>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Boss card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: islandIdx * 0.12 + 0.4, type: 'spring', stiffness: 200 }}
                    whileHover={(bossAvail && !bossDefeated) ? { scale: 1.015 } : {}}
                    onClick={(bossAvail && !bossDefeated) ? () => onBossClick(island) : undefined}
                    style={{
                      marginTop: '8px', borderRadius: '16px',
                      cursor: bossAvail && !bossDefeated ? 'pointer' : 'default',
                      overflow: 'hidden',
                      border: bossDefeated
                        ? `1px solid rgba(159,224,211,0.2)`
                        : bossAvail ? `2px solid ${theme.color}88` : '1px solid rgba(139,184,233,0.1)',
                      boxShadow: bossAvail && !bossDefeated
                        ? `0 0 40px ${theme.glow}, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.3)',
                      opacity: !bossAvail && !bossDefeated ? 0.42 : 1,
                      position: 'relative',
                    }}
                  >
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: bossDefeated
                        ? 'rgba(25,34,58,0.7)'
                        : bossAvail
                          ? `linear-gradient(135deg, rgba(${hexToRgbStr(theme.color)},0.12) 0%, rgba(20,28,50,0.95) 60%)`
                          : 'rgba(25,34,58,0.6)',
                      backdropFilter: 'blur(12px)',
                    }} />
                    {bossAvail && !bossDefeated && (
                      <motion.div
                        animate={{ opacity: [0.15, 0.45, 0.15] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        style={{
                          position: 'absolute', inset: 0,
                          background: `radial-gradient(ellipse at 30% 50%, ${theme.color}33 0%, transparent 65%)`,
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '18px', padding: '20px 22px' }}>
                      <motion.div
                        animate={bossAvail && !bossDefeated ? { scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] } : {}}
                        transition={{ duration: 2.4, repeat: Infinity }}
                        style={{
                          width: 56, height: 56, borderRadius: '14px', flexShrink: 0,
                          background: bossDefeated
                            ? 'rgba(159,224,211,0.1)'
                            : `linear-gradient(135deg, rgba(${hexToRgbStr(theme.color)},0.2) 0%, rgba(15,20,40,0.8) 100%)`,
                          border: bossDefeated ? '1px solid rgba(159,224,211,0.3)' : `2px solid ${theme.color}66`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: bossAvail && !bossDefeated ? `0 0 24px ${theme.glow}` : 'none',
                        }}
                      >
                        {bossDefeated
                          ? <Skull size={24} color="rgba(159,224,211,0.6)" />
                          : <BossIcon size={24} color={theme.color} />
                        }
                      </motion.div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                          letterSpacing: '2px', textTransform: 'uppercase',
                          color: bossDefeated ? gamingTheme.mint : bossAvail ? theme.color : gamingTheme.mutedBlue,
                          marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px',
                        }}>
                          {bossDefeated
                            ? <><Skull size={9} /> Defeated</>
                            : bossAvail
                              ? <><AlertTriangle size={9} /> Boss Encounter</>
                              : <><Lock size={9} /> Boss · Clear all topics first</>
                          }
                        </div>
                        <div style={{
                          fontFamily: gamingTheme.fontHeading, fontSize: '16px', fontWeight: 700,
                          color: bossDefeated ? gamingTheme.mutedBlue : gamingTheme.stellarWhite,
                          letterSpacing: '1px',
                          textDecoration: bossDefeated ? 'line-through' : 'none',
                          textShadow: bossAvail && !bossDefeated ? `0 0 12px ${theme.glow}` : 'none',
                        }}>{island.bossName}</div>
                        {!bossDefeated && (
                          <div style={{
                            fontFamily: gamingTheme.fontLabel, fontSize: '10px',
                            color: gamingTheme.mutedBlue, marginTop: '4px',
                            display: 'flex', alignItems: 'center', gap: '5px',
                          }}>
                            <Zap size={10} /> +{island.bossXP} XP Reward
                          </div>
                        )}
                      </div>
                      {bossAvail && !bossDefeated && (
                        <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.75, repeat: Infinity }} style={{ flexShrink: 0 }}>
                          <Skull size={20} color={theme.color} />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* ── Cross-island bridge ─────────────────────────────── */}
              {islandIdx < GAMING_ISLANDS.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                  {/* Bridge path — aligned with the 40px path column */}
                  <div style={{ width: '40px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                      animate={bossDefeated ? { boxShadow: [`0 0 6px ${theme.color}44`, `0 0 14px ${theme.color}66`, `0 0 6px ${theme.color}44`] } : {}}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      style={{
                        width: '2px',
                        minHeight: '64px',
                        background: bossDefeated
                          ? `linear-gradient(180deg, ${theme.color}aa 0%, ${ISLAND_THEMES[GAMING_ISLANDS[islandIdx + 1].id].color}aa 100%)`
                          : 'rgba(139,184,233,0.08)',
                        boxShadow: bossDefeated ? `0 0 8px ${theme.color}55` : 'none',
                        transition: 'background 0.5s ease',
                      }}
                    />
                  </div>

                  {/* Separator label */}
                  <div style={{
                    flex: 1, display: 'flex', alignItems: 'center',
                    gap: '10px', padding: '0 0 0 14px', opacity: 0.45,
                  }}>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(139,184,233,0.2) 0%, transparent 100%)' }} />
                    <ChevronDown size={12} color={gamingTheme.mutedBlue} />
                    <span style={{
                      fontFamily: gamingTheme.fontLabel, fontSize: '8px',
                      letterSpacing: '2.5px', color: gamingTheme.mutedBlue, textTransform: 'uppercase',
                    }}>Next Zone</span>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(139,184,233,0.2) 100%)' }} />
                  </div>
                </div>
              )}

            </div>{/* end left content */}

            {/* ── Right: Zone image (desktop only) ─────────────────── */}
            {!isMobile && <ZoneImage src={island.zoneImage} theme={theme} unlocked={unlocked} />}

          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Path dot
// ─────────────────────────────────────────────────────────────────────────────
function PathDot({ completed, current, theme, charColors }) {
  const size   = completed ? 14 : current ? 13 : 10;
  const bg     = completed ? theme.color : current ? charColors.primary : gamingTheme.bgMid;
  const border = completed ? theme.color : current ? charColors.primary : 'rgba(139,184,233,0.3)';
  const shadow = completed
    ? `0 0 10px ${theme.color}, 0 0 22px ${theme.glow}, 0 0 4px ${theme.color}`
    : current
      ? `0 0 8px ${charColors.primary}, 0 0 18px ${charColors.glow}`
      : 'none';

  return (
    <motion.div
      animate={current ? { scale: [1, 1.45, 1], opacity: [0.65, 1, 0.65] } : {}}
      transition={{ duration: 1.1, repeat: Infinity }}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg,
        border: `2.5px solid ${border}`,
        boxShadow: shadow,
        transition: 'all 0.35s ease',
        position: 'relative', zIndex: 3,
      }}
    >
      {/* Inner bright core for completed dots */}
      {completed && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40%', height: '40%', borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)',
        }} />
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Zone image with neon glow + floating animation
// ─────────────────────────────────────────────────────────────────────────────
function ZoneImage({ src, theme, unlocked }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ width: '180px', flexShrink: 0, position: 'relative' }}>
      {unlocked && (
        <motion.div
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.04, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: '-18px', borderRadius: '24px',
            background: `radial-gradient(ellipse at 50% 60%, ${theme.color}44 0%, transparent 70%)`,
            filter: 'blur(14px)', pointerEvents: 'none', zIndex: 0,
          }}
        />
      )}
      <motion.div
        animate={unlocked ? { y: [0, -10, 0] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <img
          src={src} alt=""
          onLoad={() => setLoaded(true)}
          onError={() => {}}
          style={{
            width: '100%', height: 'auto', display: 'block',
            opacity: loaded ? (unlocked ? 1 : 0.25) : 0,
            transition: 'opacity 0.5s ease',
            filter: unlocked
              ? `drop-shadow(0 0 18px ${theme.color}cc) drop-shadow(0 0 6px ${theme.color}88)`
              : 'grayscale(1)',
          }}
        />
        {unlocked && loaded && (
          <motion.div
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at 50% 100%, ${theme.color}33 0%, transparent 65%)`,
              pointerEvents: 'none', mixBlendMode: 'screen',
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}
