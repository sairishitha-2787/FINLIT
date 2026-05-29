import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Sparkles, Star, Crown, Scissors, Palette, ChevronDown } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

const F = {
  heading: "'Playfair Display', serif",
  italic:  "'Playfair Display', serif",
  ui:      "'DM Sans', sans-serif",
};
const C = { deepRose: '#9d1f4a', midRose: '#d4537e', label: '#c98a9e', body: '#b0627a', pink: '#f7a0b8' };

export const FASHION_DISTRICTS = [
  {
    id: 'boutique',
    name: 'The Boutique',
    subtitle: 'THE BEGINNING',
    icon: Scissors,
    topics: ['Budgeting Basics', 'Saving Money', 'Emergency Funds', 'Simple Interest'],
    bossId: 'boss_boutique',
    bossName: 'Fashion Critic: The Buyer',
    bossIcon: Crown,
    bossXP: 150,
    zoneImage: '/ZONES/FASHION_ZONE-1.png',
  },
  {
    id: 'atelier',
    name: 'The Atelier',
    subtitle: 'THE PROVING GROUNDS',
    icon: Palette,
    topics: ['Compound Interest', 'Credit Scores', 'Investing Basics', 'Stocks & Bonds', 'Debt Management'],
    bossId: 'boss_atelier',
    bossName: 'Fashion Critic: The Editor',
    bossIcon: Crown,
    bossXP: 150,
    zoneImage: '/ZONES/FASHION_ZONE-2.png',
  },
  {
    id: 'runway',
    name: 'The Runway',
    subtitle: 'THE GRAND FINALE',
    icon: Star,
    topics: ['Retirement Accounts', 'Tax Fundamentals', 'Portfolio Diversification', 'Advanced Planning'],
    bossId: 'boss_runway',
    bossName: 'Fashion Critic: The Icon',
    bossIcon: Crown,
    bossXP: 150,
    zoneImage: '/ZONES/FASHION_ZONE-3.png',
  },
];

const DISTRICT_THEMES = {
  boutique: { color: '#e8956d', glow: 'rgba(232,149,109,0.30)', bg: 'rgba(232,149,109,0.09)', label: 'DISTRICT I'   },
  atelier:  { color: '#f7a0b8', glow: 'rgba(247,160,184,0.30)', bg: 'rgba(247,160,184,0.09)', label: 'DISTRICT II'  },
  runway:   { color: '#c084fc', glow: 'rgba(192,132,252,0.30)', bg: 'rgba(192,132,252,0.09)', label: 'DISTRICT III' },
};

function rgb(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

function buildConnectorGradient(topics, completedTopics, theme, unlocked) {
  if (!unlocked) return 'rgba(200,160,175,0.15)';
  const n    = topics.length;
  const lit  = `${theme.color}bb`;
  const dim  = 'rgba(200,160,175,0.22)';
  const stops = [];
  for (let i = 0; i < n; i++) {
    const s = (i / n * 100).toFixed(1);
    const e = ((i + 1) / n * 100).toFixed(1);
    const c = completedTopics.includes(topics[i]) ? lit : dim;
    stops.push(`${c} ${s}%`, `${c} ${e}%`);
    if (i < n - 1) {
      const nc = completedTopics.includes(topics[i + 1]) ? lit : dim;
      if (nc !== c) stops.push(`${nc} ${e}%`);
    }
  }
  return `linear-gradient(180deg, ${stops.join(', ')})`;
}

const isDistrictUnlocked = (idx, defeatedBosses) =>
  idx === 0 || defeatedBosses.includes(FASHION_DISTRICTS[idx - 1].bossId);

const isBossAvailable = (district, completedTopics) =>
  district.topics.every(t => completedTopics.includes(t));

const getTopicStatus = (topicName, districtTopics, completedTopics, districtUnlocked) => {
  if (!districtUnlocked) return 'locked';
  if (completedTopics.includes(topicName)) return 'completed';
  const idx = districtTopics.indexOf(topicName);
  return districtTopics.slice(0, idx).every(t => completedTopics.includes(t)) ? 'current' : 'locked';
};

function PathDot({ completed, current, theme, charColor }) {
  const cur    = charColor || C.deepRose;
  const size   = completed ? 14 : current ? 13 : 10;
  const bg     = completed ? theme.color : current ? cur : 'rgba(200,160,175,0.30)';
  const border = completed ? theme.color : current ? cur : 'rgba(200,160,175,0.40)';
  const shadow = completed
    ? `0 0 10px ${theme.color}, 0 0 22px ${theme.glow}`
    : current ? `0 0 8px ${cur}99` : 'none';

  return (
    <motion.div
      animate={current ? { scale: [1, 1.4, 1], opacity: [0.65, 1, 0.65] } : {}}
      transition={{ duration: 1.1, repeat: Infinity }}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg, border: `2px solid ${border}`, boxShadow: shadow,
        transition: 'all 0.35s ease', position: 'relative', zIndex: 3,
      }}
    >
      {completed && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '40%', height: '40%', borderRadius: '50%', background: 'rgba(255,255,255,0.70)',
        }} />
      )}
    </motion.div>
  );
}

function ZoneImage({ src, theme, unlocked }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ width: 180, flexShrink: 0, position: 'relative' }}>
      {unlocked && (
        <motion.div
          animate={{ opacity: [0.30, 0.65, 0.30], scale: [1, 1.04, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: -18, borderRadius: 24,
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
              : 'grayscale(1) opacity(0.3)',
          }}
        />
      </motion.div>
    </div>
  );
}

export default function RunwayMap({ completedTopics = [], defeatedBosses = [], onTopicClick, onBossClick, characterColor }) {
  const { isMobile } = useIsMobile();
  const charColor = characterColor || C.deepRose;

  return (
    <div style={{ padding: isMobile ? '16px 12px 60px' : '28px 32px 80px' }}>
      {FASHION_DISTRICTS.map((district, districtIdx) => {
        const theme        = DISTRICT_THEMES[district.id];
        const unlocked     = isDistrictUnlocked(districtIdx, defeatedBosses);
        const bossAvail    = isBossAvailable(district, completedTopics);
        const bossDefeated = defeatedBosses.includes(district.bossId);
        const topicsDone   = district.topics.filter(t => completedTopics.includes(t)).length;
        const allDone      = topicsDone === district.topics.length;
        const DistrictIcon = district.icon;
        const BossIcon     = district.bossIcon;

        return (
          <motion.div
            key={district.id}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: unlocked ? 1 : 0.45, y: 0 }}
            transition={{ delay: districtIdx * 0.15, duration: 0.5 }}
            style={{
              marginBottom: districtIdx < FASHION_DISTRICTS.length - 1 ? 0 : 52,
              display: 'flex', gap: isMobile ? 0 : 28, alignItems: 'flex-start',
            }}
          >
            {/* ── District content ── */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* District banner */}
              <div style={{
                padding: '20px 24px', marginBottom: 4, borderRadius: 16,
                background: unlocked
                  ? `linear-gradient(135deg, ${theme.bg} 0%, rgba(255,255,255,0.18) 100%)`
                  : 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                border: `1px solid ${unlocked ? theme.color + '30' : 'rgba(200,160,175,0.18)'}`,
                borderLeft: `4px solid ${unlocked ? theme.color : 'rgba(200,160,175,0.25)'}`,
                borderTop: '1.5px solid rgba(255,255,255,0.60)',
                position: 'relative', overflow: 'hidden',
              }}>
                {unlocked && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0, width: 180, height: '100%',
                    background: `radial-gradient(ellipse at 100% 50%, ${theme.glow} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />
                )}

                <div style={{
                  fontFamily: F.ui, fontWeight: 500, fontSize: 9,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: unlocked ? theme.color : C.label, marginBottom: 8,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span>{theme.label}</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span style={{ opacity: 0.6 }}>{district.subtitle}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <DistrictIcon size={22} color={unlocked ? theme.color : C.label} style={{ opacity: unlocked ? 1 : 0.5 }} />
                    <h2 style={{
                      fontFamily: F.heading, fontWeight: 600, fontSize: 19, letterSpacing: '-0.01em',
                      color: unlocked ? C.deepRose : C.label, margin: 0,
                      textShadow: unlocked ? `0 0 20px ${theme.glow}` : 'none',
                    }}>{district.name}</h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {district.topics.map((t, i) => {
                        const done = completedTopics.includes(t);
                        return (
                          <motion.div key={i}
                            animate={done ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.4 }}
                            style={{
                              width: done ? 10 : 8, height: done ? 10 : 8, borderRadius: '50%',
                              background: done ? theme.color : 'rgba(200,160,175,0.25)',
                              boxShadow: done ? `0 0 8px ${theme.color}` : 'none',
                              transition: 'all 0.3s ease',
                            }}
                          />
                        );
                      })}
                    </div>
                    <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, color: unlocked ? theme.color : C.label, letterSpacing: '0.08em' }}>
                      {topicsDone}/{district.topics.length}
                    </span>
                    {!unlocked && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '3px 9px', borderRadius: 99,
                        fontFamily: F.ui, fontSize: 9, letterSpacing: '0.14em',
                        color: C.label, background: 'rgba(200,160,175,0.12)', border: '1px solid rgba(200,160,175,0.22)',
                      }}>
                        <Lock size={9} /> Velvet Rope
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Path + Topics */}
              <div style={{ display: 'flex', paddingTop: 10, position: 'relative' }}>

                {/* PATH COLUMN */}
                <div style={{
                  width: 40, flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, bottom: 0, left: '50%',
                    transform: 'translateX(-1px)', width: 2,
                    background: buildConnectorGradient(district.topics, completedTopics, theme, unlocked),
                    boxShadow: topicsDone > 0 && unlocked ? `0 0 10px ${theme.color}55` : 'none',
                    transition: 'background 0.5s ease, box-shadow 0.5s ease',
                  }} />

                  {district.topics.map((topic) => {
                    const status = getTopicStatus(topic, district.topics, completedTopics, unlocked);
                    return (
                      <div key={topic} style={{
                        height: isMobile ? 78 : 76,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', zIndex: 2, flexShrink: 0,
                      }}>
                        <PathDot completed={status === 'completed'} current={status === 'current'} theme={theme} charColor={charColor} />
                      </div>
                    );
                  })}

                  {/* Line to boss dot */}
                  <div style={{
                    width: 2, height: 28, flexShrink: 0,
                    background: allDone && unlocked ? `${theme.color}aa` : 'rgba(200,160,175,0.12)',
                    boxShadow: allDone && unlocked ? `0 0 8px ${theme.color}66` : 'none',
                    transition: 'background 0.4s, box-shadow 0.4s',
                  }} />

                  {/* Boss dot */}
                  <motion.div
                    animate={bossAvail && !bossDefeated ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0, zIndex: 2, position: 'relative',
                      background: bossDefeated ? '#fde68a' : bossAvail ? theme.color : 'rgba(200,160,175,0.25)',
                      border: `2.5px solid ${bossDefeated ? '#fde68a' : bossAvail ? theme.color : 'rgba(200,160,175,0.35)'}`,
                      boxShadow: bossDefeated
                        ? '0 0 14px rgba(253,230,138,0.70), 0 0 28px rgba(253,230,138,0.40)'
                        : bossAvail ? `0 0 12px ${theme.color}, 0 0 24px ${theme.glow}` : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {bossDefeated && <Star size={9} fill="#9d1f4a" color="#9d1f4a" />}
                  </motion.div>
                </div>

                {/* CONTENT COLUMN */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {district.topics.map((topic, topicIdx) => {
                    const status      = getTopicStatus(topic, district.topics, completedTopics, unlocked);
                    const isCompleted = status === 'completed';
                    const isCurrent   = status === 'current';
                    const isLocked    = status === 'locked';

                    return (
                      <motion.div
                        key={topic}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: districtIdx * 0.12 + topicIdx * 0.07 }}
                        whileHover={!isLocked ? { x: 4, transition: { duration: 0.15 } } : {}}
                        onClick={!isLocked ? () => onTopicClick?.(topic) : undefined}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: isMobile ? '16px 16px' : '16px 22px',
                          marginBottom: 8,
                          borderRadius: 12,
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          background: isLocked
                            ? 'rgba(255,255,255,0.08)'
                            : isCurrent
                              ? `linear-gradient(90deg, rgba(${rgb(charColor)},0.16) 0%, rgba(255,255,255,0.20) 100%)`
                              : 'rgba(255,255,255,0.28)',
                          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                          border: isCurrent
                            ? `1px solid rgba(${rgb(charColor)},0.60)`
                            : isCompleted
                              ? `1px solid rgba(${rgb(theme.color)},0.25)`
                              : '1px solid rgba(200,160,175,0.18)',
                          borderTop: '1px solid rgba(255,255,255,0.55)',
                          boxShadow: isCurrent ? `0 0 18px rgba(${rgb(charColor)},0.22)` : 'none',
                          opacity: isLocked ? 0.50 : 1,
                          transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: F.ui, fontWeight: 600, fontSize: 14,
                            color: isLocked ? C.label : C.deepRose,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>{topic}</div>
                          <div style={{
                            fontFamily: F.ui, fontWeight: 500, fontSize: 9,
                            letterSpacing: '0.16em', textTransform: 'uppercase',
                            display: 'flex', alignItems: 'center', gap: 4,
                            color: isCompleted ? theme.color : isCurrent ? charColor : 'rgba(200,160,175,0.60)',
                            marginTop: 3,
                          }}>
                            {isCompleted
                              ? <><CheckCircle size={9} /> In Your Wardrobe</>
                              : isCurrent
                                ? <><Sparkles size={9} /> In Collection</>
                                : <><Lock size={9} /> Velvet Rope</>
                            }
                          </div>
                        </div>

                        {isCurrent && (
                          <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 0.9, repeat: Infinity }}>
                            <Sparkles size={14} color={charColor} />
                          </motion.div>
                        )}
                        {isCompleted && (
                          <span style={{
                            padding: '2px 8px', borderRadius: 99, flexShrink: 0,
                            fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.10em',
                            color: theme.color, background: `rgba(${rgb(theme.color)},0.10)`,
                            border: `1px solid rgba(${rgb(theme.color)},0.25)`,
                          }}>+30 SP</span>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Boss card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: districtIdx * 0.12 + 0.4, type: 'spring', stiffness: 200 }}
                    whileHover={bossAvail && !bossDefeated ? { scale: 1.015 } : {}}
                    onClick={bossAvail && !bossDefeated ? () => onBossClick?.(district) : undefined}
                    style={{
                      marginTop: 8, borderRadius: 16,
                      cursor: bossAvail && !bossDefeated ? 'pointer' : 'default',
                      overflow: 'hidden', position: 'relative',
                      border: bossDefeated
                        ? '1px solid rgba(253,230,138,0.35)'
                        : bossAvail ? `2px solid rgba(${rgb(theme.color)},0.60)` : '1px solid rgba(200,160,175,0.18)',
                      boxShadow: bossAvail && !bossDefeated
                        ? `0 0 40px ${theme.glow}, 0 8px 32px rgba(157,31,74,0.10)`
                        : '0 4px 16px rgba(157,31,74,0.06)',
                      opacity: !bossAvail && !bossDefeated ? 0.45 : 1,
                    }}
                  >
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: bossDefeated
                        ? 'rgba(253,230,138,0.08)'
                        : bossAvail
                          ? `linear-gradient(135deg, rgba(${rgb(theme.color)},0.14) 0%, rgba(255,255,255,0.22) 60%)`
                          : 'rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)', pointerEvents: 'none' }} />

                    {bossAvail && !bossDefeated && (
                      <motion.div
                        animate={{ opacity: [0.15, 0.45, 0.15] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        style={{
                          position: 'absolute', inset: 0,
                          background: `radial-gradient(ellipse at 30% 50%, rgba(${rgb(theme.color)},0.30) 0%, transparent 65%)`,
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 18, padding: '20px 22px' }}>
                      <motion.div
                        animate={bossAvail && !bossDefeated ? { scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] } : {}}
                        transition={{ duration: 2.4, repeat: Infinity }}
                        style={{
                          width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                          background: bossDefeated
                            ? 'rgba(253,230,138,0.15)'
                            : `linear-gradient(135deg, rgba(${rgb(theme.color)},0.22) 0%, rgba(255,255,255,0.12) 100%)`,
                          border: bossDefeated
                            ? '1px solid rgba(253,230,138,0.40)'
                            : `2px solid rgba(${rgb(theme.color)},0.50)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: bossAvail && !bossDefeated ? `0 0 24px ${theme.glow}` : 'none',
                        }}
                      >
                        {bossDefeated
                          ? <Star size={24} color="#fde68a" fill="#fde68a" />
                          : <BossIcon size={24} color={theme.color} />
                        }
                      </motion.div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: F.ui, fontWeight: 500, fontSize: 9,
                          letterSpacing: '0.18em', textTransform: 'uppercase',
                          color: bossDefeated ? '#c4a33a' : bossAvail ? theme.color : C.label,
                          marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                          {bossDefeated
                            ? <><Star size={9} fill="currentColor" /> Conquered</>
                            : bossAvail
                              ? <><Sparkles size={9} /> Critic has arrived</>
                              : <><Lock size={9} /> Clear all looks first</>
                          }
                        </div>
                        <div style={{
                          fontFamily: F.heading, fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em',
                          color: bossDefeated ? C.label : C.deepRose,
                          textDecoration: bossDefeated ? 'line-through' : 'none',
                          textShadow: bossAvail && !bossDefeated ? `0 0 12px ${theme.glow}` : 'none',
                        }}>{district.bossName}</div>
                        {!bossDefeated && (
                          <div style={{
                            fontFamily: F.ui, fontSize: 10, color: C.label, marginTop: 4,
                            display: 'flex', alignItems: 'center', gap: 5,
                          }}>
                            <Sparkles size={10} color={C.label} /> +{district.bossXP} Style Points
                          </div>
                        )}
                      </div>

                      {bossAvail && !bossDefeated && (
                        <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.75, repeat: Infinity }} style={{ flexShrink: 0 }}>
                          <Crown size={20} color={theme.color} />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Cross-district bridge */}
              {districtIdx < FASHION_DISTRICTS.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                  <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                      animate={bossDefeated ? {
                        boxShadow: [`0 0 6px ${theme.color}44`, `0 0 14px ${theme.color}66`, `0 0 6px ${theme.color}44`],
                      } : {}}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      style={{
                        width: 2, minHeight: 64,
                        background: bossDefeated
                          ? `linear-gradient(180deg, ${theme.color}aa 0%, ${DISTRICT_THEMES[FASHION_DISTRICTS[districtIdx + 1].id].color}aa 100%)`
                          : 'rgba(200,160,175,0.12)',
                        transition: 'background 0.5s ease',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 0 0 14px', opacity: 0.45 }}>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(200,160,175,0.30) 0%, transparent 100%)' }} />
                    <ChevronDown size={12} color={C.label} />
                    <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 8, letterSpacing: '0.22em', color: C.label, textTransform: 'uppercase' }}>
                      Next District
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(200,160,175,0.30) 100%)' }} />
                  </div>
                </div>
              )}

            </div>

            {/* Zone image (desktop only) */}
            {!isMobile && <ZoneImage src={district.zoneImage} theme={theme} unlocked={unlocked} />}

          </motion.div>
        );
      })}
    </div>
  );
}
