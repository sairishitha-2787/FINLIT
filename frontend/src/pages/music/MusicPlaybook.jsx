import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, CheckCircle2, Trophy, ChevronDown, ChevronRight,
  Star, Zap, Globe, Scale, Wifi, Briefcase, BarChart2,
  Tag, Star as StarIcon, Users, Music, MapPin, PiggyBank,
  Sparkles, TrendingUp, Building2, Medal, X, Shield,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useMusic } from '../../contexts/MusicContext';
import { getClusterTheme, CLUSTER_MAP, musicTheme } from '../../styles/musicTheme';
import { MUSIC_TOPICS } from '../../data/musicTopics';
import { MUSIC_BOSSES } from '../../data/musicBosses';
import SuggestedForReview from '../../components/SuggestedForReview';
import './MusicPlaybook.css';

// ─── Assign icons to topics ───────────────────────────────────────────────────
const TOPIC_ICONS = {
  'The Music Ecosystem':            Globe,
  'Rights & Royalties Basics':      Scale,
  'Streaming Economics':            Wifi,
  'Artist vs Label Deals':          Briefcase,
  'Multiple Revenue Streams':       BarChart2,
  'Merchandise & Sales Strategy':   Tag,
  'Sponsorships & Endorsements':    StarIcon,
  'Building Your Fan Base':         Users,
  'Independent Artist Success':     Music,
  'Tour & Event Management':        MapPin,
  'Financial Planning for Musicians': PiggyBank,
  'Building a Music Brand':         Sparkles,
};

const BOSS_ICONS = {
  'music_boss_0': Building2,
  'music_boss_1': Trophy,
  'music_boss_2': Medal,
};

// ─── Build SEASONS structure ──────────────────────────────────────────────────
const SEASON_META = [
  { seasonLabel: 'SEASON 1', title: 'Music Industry Foundations', SeasonIcon: Globe, desc: 'Master the fundamentals of how the music business works.' },
  { seasonLabel: 'SEASON 2', title: 'Revenue & Growth',           SeasonIcon: TrendingUp, desc: 'Diversify your income and grow your music career.' },
  { seasonLabel: 'SEASON 3', title: 'Mastery & Independence',     SeasonIcon: Shield, desc: 'Go independent and build your lasting music legacy.' },
];

const SEASONS = SEASON_META.map((meta, si) => ({
  ...meta,
  id: si,
  topics: MUSIC_TOPICS
    .filter(t => t.season === si)
    .map(t => ({ ...t, Icon: TOPIC_ICONS[t.name] || Music })),
  boss: { ...MUSIC_BOSSES[si], Icon: BOSS_ICONS[MUSIC_BOSSES[si].id] || Trophy },
}));

// ─── Unlock helpers ───────────────────────────────────────────────────────────
function isTopicUnlocked(seasonIdx, topicIdx, completedTopics, defeatedBosses) {
  if (seasonIdx === 0 && topicIdx === 0) return true;
  if (seasonIdx > 0 && !defeatedBosses.includes(MUSIC_BOSSES[seasonIdx - 1].id)) return false;
  if (topicIdx > 0) return completedTopics.includes(SEASONS[seasonIdx].topics[topicIdx - 1].name);
  return true;
}

function isBossUnlocked(seasonIdx, completedTopics) {
  return SEASONS[seasonIdx].topics.every(t => completedTopics.includes(t.name));
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
const DIFF_COLORS = { Beginner: '#34d399', Intermediate: '#60a5fa', Advanced: '#f59e0b', Expert: '#ef4444' };
function DiffBadge({ difficulty, theme }) {
  const color = DIFF_COLORS[difficulty] || '#60a5fa';
  return (
    <span style={{
      fontFamily: theme.fontSub, fontSize: 9, fontWeight: 700,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color, background: `${color}18`,
      border: `1px solid ${color}40`,
      padding: '2px 7px', borderRadius: 99,
    }}>
      {difficulty}
    </span>
  );
}

// ─── Path connector ───────────────────────────────────────────────────────────
function PathLine({ color, complete, pulse }) {
  return (
    <div style={{ width: 2, height: 28, margin: '0 auto', background: complete ? color : 'rgba(255,255,255,0.08)', boxShadow: complete ? `0 0 6px ${color}` : 'none', position: 'relative', overflow: 'hidden' }}>
      {pulse && (
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', repeatDelay: 0.3 }}
          style={{ position: 'absolute', width: '100%', height: '40%', background: `linear-gradient(to bottom, transparent, ${color}, transparent)` }}
        />
      )}
    </div>
  );
}

// ─── Vinyl TopicNode (JAY) ────────────────────────────────────────────────────
function VinylTopicNode({ topic, state, onClick }) {
  const isLocked   = state === 'locked';
  const isComplete = state === 'complete';
  return (
    <motion.button
      className={`vinyl-topic-card${isLocked ? ' locked' : ''}${isComplete ? ' done' : ''}`}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      style={{
        width: '100%', textAlign: 'left', cursor: isLocked ? 'default' : 'pointer',
        background: '#C4C1B8', border: '2px solid #551F22',
        borderRadius: 12, overflow: 'hidden', opacity: isLocked ? 0.6 : 1,
        display: 'block', padding: 0,
      }}
    >
      {/* Album sleeve */}
      <div className="vinyl-sleeve" style={{ height: 86, background: 'linear-gradient(135deg, #301415, #1c0d0e)', position: 'relative', overflow: 'hidden' }}>
        <div className="vinyl-disc" />
        <div style={{ position: 'absolute', left: 12, top: 8, fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: 'rgba(196,193,184,0.82)', lineHeight: 1, zIndex: 2 }}>
          {String(topic.id).padStart(2, '0')}
        </div>
        <div style={{ position: 'absolute', left: 12, bottom: 10, fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', background: '#C4C1B8', color: '#130F0D', padding: '3px 8px', borderRadius: 6, fontWeight: 700, zIndex: 2 }}>
          {topic.difficulty}
        </div>
        {isLocked && (
          <div style={{ position: 'absolute', right: 12, top: 12, background: 'rgba(19,15,13,0.7)', width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, zIndex: 2 }}>🔒</div>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: '12px 14px 14px', background: '#C4C1B8' }}>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 17, textTransform: 'uppercase', lineHeight: 1, color: '#301415' }}>{topic.name}</div>
        <div style={{ fontSize: 12, color: '#635B51', marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>{topic.difficulty}</span><span>·</span>
          <b style={{ color: '#551F22' }}>+{topic.xpReward} XP</b>
          {isComplete && <span style={{ color: '#8A2D31', fontSize: 11, marginLeft: 'auto' }}>✓ Done</span>}
        </div>
        {!isLocked && (
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(48,20,21,0.16)', marginTop: 10, overflow: 'hidden' }}>
            <div style={{ width: isComplete ? '100%' : '0%', height: '100%', background: 'linear-gradient(90deg, #551F22, #8A2D31)', borderRadius: 999, transition: 'width 0.6s ease' }} />
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ─── Neon TopicNode (CYPHER) ──────────────────────────────────────────────────
function NeonTopicNode({ topic, state, onClick }) {
  const isLocked   = state === 'locked';
  const isComplete = state === 'complete';
  const isCyan     = topic.id % 2 === 0;
  const borderCol  = isCyan ? '#6BA2EB' : '#C231C9';
  return (
    <motion.button
      className={`neon-topic-card${isLocked ? ' locked' : ''}${isCyan ? ' cyan' : ''}`}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      style={{
        width: '100%', textAlign: 'left', cursor: isLocked ? 'default' : 'pointer',
        background: 'rgba(29,2,37,0.55)', border: `1px solid ${borderCol}`,
        padding: 0, overflow: 'hidden', opacity: isLocked ? 0.5 : 1, display: 'block',
      }}
    >
      {/* EQ vis area */}
      <div style={{ height: 78, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(194,49,201,0.22), rgba(76,93,215,0.22))', borderBottom: `1px solid ${borderCol}40` }}>
        <div className="neon-eq">
          {Array.from({ length: 18 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: 12, top: 12, fontSize: 9, letterSpacing: '2px', background: borderCol, color: '#0a0010', padding: '3px 8px', fontWeight: 700, textTransform: 'uppercase', zIndex: 2 }}>
          {topic.difficulty}
        </div>
        {isLocked && <div style={{ position: 'absolute', right: 12, top: 12, fontSize: 13, color: '#FFD60A', zIndex: 2 }}>🔒</div>}
      </div>
      {/* Body */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, color: '#EAD9FF', lineHeight: 1.2 }}>{topic.name}</div>
        <div style={{ fontSize: 11, color: borderCol, marginTop: 7, display: 'flex', gap: 8, letterSpacing: '0.5px' }}>
          <span>{topic.difficulty}</span><span>·</span>
          <b style={{ color: isCyan ? '#C231C9' : '#6BA2EB' }}>+{topic.xpReward} XP</b>
          {isComplete && <span style={{ marginLeft: 'auto', color: '#6BA2EB', fontSize: 10, letterSpacing: '1px' }}>▶ SYNCED</span>}
        </div>
        {!isLocked && (
          <div style={{ height: 5, background: 'rgba(107,162,235,0.15)', marginTop: 10, overflow: 'hidden' }}>
            <div style={{ width: isComplete ? '100%' : '0%', height: '100%', background: 'linear-gradient(90deg, #C231C9, #6BA2EB)', boxShadow: '0 0 8px #C231C9', transition: 'width 0.6s ease' }} />
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ─── Dreamy TopicNode (LUNA) ──────────────────────────────────────────────────
function DreamyTopicNode({ topic, state, onClick }) {
  const isLocked   = state === 'locked';
  const isComplete = state === 'complete';
  const isCurrent  = state === 'current';
  return (
    <motion.button
      className="dreamy-topic-card"
      whileHover={!isLocked ? { y: -6 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      style={{
        width: '100%', textAlign: 'left', cursor: isLocked ? 'default' : 'pointer',
        background: 'rgba(44,31,27,0.68)',
        backdropFilter: 'blur(16px)',
        border: isComplete ? '1px solid rgba(215,152,163,0.55)' : isCurrent ? '1px solid rgba(215,152,163,0.32)' : '1px solid rgba(215,152,163,0.16)',
        borderRadius: 16, overflow: 'hidden', opacity: isLocked ? 0.55 : 1, display: 'block', padding: 0,
        boxShadow: isComplete ? '0 10px 30px rgba(0,0,0,0.3), inset 0 0 30px rgba(215,152,163,0.06)' : '0 10px 26px rgba(0,0,0,0.25)',
      }}
    >
      {/* Vis area */}
      <div style={{ height: 90, position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, rgba(155,102,107,0.38), rgba(77,50,48,0.45))' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 20%, rgba(215,152,163,0.35), transparent 55%)' }} />
        <div className="dreamy-moonbit" />
        <div style={{ position: 'absolute', left: 14, bottom: 12, fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#F3E6E9', zIndex: 2, background: 'rgba(44,31,27,0.55)', backdropFilter: 'blur(8px)', padding: '4px 9px', borderRadius: 999, border: '1px solid rgba(215,152,163,0.3)' }}>
          {topic.difficulty}
        </div>
        {isLocked && <div style={{ position: 'absolute', left: 14, top: 14, fontSize: 13, zIndex: 2 }}>🔒</div>}
      </div>
      {/* Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, fontWeight: 400, lineHeight: 1.05, color: '#F3E6E9' }}>{topic.name}</div>
        <div style={{ fontSize: 11, color: '#D798A3', marginTop: 7, display: 'flex', gap: 8, letterSpacing: '0.5px' }}>
          <span>{topic.difficulty}</span><span>·</span>
          <b style={{ color: '#F3E6E9' }}>+{topic.xpReward} XP</b>
          {isComplete && <span style={{ marginLeft: 'auto', color: '#D798A3' }}>✓</span>}
        </div>
        {!isLocked && (
          <div style={{ height: 5, borderRadius: 999, background: 'rgba(215,152,163,0.14)', marginTop: 12, overflow: 'hidden' }}>
            <div style={{ width: isComplete ? '100%' : '0%', height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #9B666B, #D798A3)', boxShadow: '0 0 8px rgba(215,152,163,0.5)', transition: 'width 0.6s ease' }} />
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ─── Topic node (cluster dispatcher) ─────────────────────────────────────────
function TopicNode({ topic, state, color, theme, cluster, onClick }) {
  if (cluster === 'vinyl')  return <VinylTopicNode  topic={topic} state={state} onClick={onClick} />;
  if (cluster === 'neon')   return <NeonTopicNode   topic={topic} state={state} onClick={onClick} />;
  if (cluster === 'dreamy') return <DreamyTopicNode topic={topic} state={state} onClick={onClick} />;

  // ── Default fallback ──────────────────────────────────────────────────────
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
        background: isComplete ? `${color}18` : isCurrent ? theme.bgCard : 'rgba(18,14,17,0.7)',
        border: isComplete ? `1px solid ${color}55` : isCurrent ? `1px solid ${color}30` : '1px solid rgba(255,255,255,0.06)',
        borderLeft: `3px solid ${isLocked ? 'rgba(255,255,255,0.08)' : isComplete ? color : isCurrent ? color : 'rgba(255,255,255,0.15)'}`,
        borderRadius: 10, padding: '13px 14px',
        cursor: isLocked ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: isComplete ? `0 0 18px ${color}14` : isCurrent ? '0 4px 16px rgba(0,0,0,0.5)' : 'none',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isLocked ? 'rgba(255,255,255,0.04)' : isComplete ? `${color}22` : `${color}12`,
        border: isLocked ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${color}35`,
      }}>
        {isLocked
          ? <Lock size={13} color="rgba(255,255,255,0.2)" strokeWidth={1.8} />
          : isComplete
            ? <CheckCircle2 size={16} color={color} strokeWidth={1.8} />
            : <topic.Icon size={16} color={color} strokeWidth={1.8} />}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{
            fontFamily: theme.fontSub, fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
            color: isLocked ? 'rgba(255,255,255,0.2)' : isComplete ? color : theme.textPrimary,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {topic.name}
          </span>
          {!isLocked && <DiffBadge difficulty={topic.difficulty} theme={theme} />}
        </div>
        <div style={{
          fontFamily: theme.fontBody, fontSize: 11, letterSpacing: '0.02em',
          color: isLocked ? 'rgba(255,255,255,0.12)' : isComplete ? `${color}99` : theme.textMuted,
        }}>
          {isComplete ? 'Completed' : isLocked ? 'Locked' : `+${topic.xpReward} XP`}
        </div>
      </div>

      {/* Right */}
      {!isLocked && (
        isComplete
          ? <span style={{ fontFamily: theme.fontHeading, fontSize: 14, color, opacity: 0.8 }}>✓</span>
          : <ChevronRight size={14} color="rgba(255,255,255,0.25)" />
      )}
    </motion.button>
  );
}

// ─── Boss node ────────────────────────────────────────────────────────────────
function BossNode({ boss, state, color, glow, theme, cluster, onClick }) {
  const isLocked   = state === 'locked';
  const isDefeated = state === 'defeated';
  const isReady    = state === 'unlocked';

  const clusterCardStyle = cluster === 'vinyl' ? {
    background:   isDefeated ? `${color}20` : isReady ? '#1c0d0e' : '#130F0D',
    border:       isDefeated ? `2px solid ${color}80` : isReady ? '2px solid #551F22' : '2px solid rgba(196,193,184,0.08)',
    borderRadius: 12,
  } : cluster === 'neon' ? {
    background:   isDefeated ? `${color}20` : isReady ? 'rgba(29,2,37,0.98)' : 'rgba(14,10,12,0.85)',
    border:       isDefeated ? `1.5px solid ${color}80` : isReady ? `1.5px solid ${color}55` : '1.5px solid rgba(194,49,201,0.18)',
    borderRadius: 0,
    clipPath:     'polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)',
  } : cluster === 'dreamy' ? {
    background:    isDefeated ? 'rgba(215,152,163,0.2)' : isReady ? 'rgba(44,31,27,0.92)' : 'rgba(44,31,27,0.6)',
    border:        isDefeated ? '1.5px solid rgba(215,152,163,0.7)' : isReady ? '1.5px solid rgba(215,152,163,0.5)' : '1.5px solid rgba(215,152,163,0.12)',
    borderRadius:  18,
    backdropFilter: 'blur(16px)',
  } : {
    background:   isDefeated ? `${color}20` : isReady ? 'rgba(20,14,18,0.98)' : 'rgba(14,10,12,0.85)',
    border:       isDefeated ? `1.5px solid ${color}70` : isReady ? `1.5px solid ${color}55` : '1.5px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
  };

  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.015 } : {}}
      whileTap={!isLocked ? { scale: 0.975 } : {}}
      onClick={!isLocked ? onClick : undefined}
      className={isReady ? 'music-boss-ready' : ''}
      style={{
        width: '100%', textAlign: 'center',
        ...clusterCardStyle,
        padding: '18px 16px',
        cursor: isLocked ? 'default' : 'pointer',
        boxShadow: isDefeated ? `0 0 32px ${color}22, 0 8px 24px rgba(0,0,0,0.4)` : isReady ? `0 0 24px ${glow}30, 0 8px 24px rgba(0,0,0,0.5)` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Ready pulse ring */}
      {isReady && (
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, border: `2px solid ${color}`, borderRadius: 14, pointerEvents: 'none' }}
        />
      )}

      {/* Boss icon */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%', margin: '0 auto 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isLocked ? 'rgba(255,255,255,0.05)' : isDefeated ? color : `${color}20`,
        border: isLocked ? '2px solid rgba(255,255,255,0.1)' : `2px solid ${color}`,
        boxShadow: !isLocked ? `0 0 24px ${glow}` : 'none',
      }}>
        {isLocked
          ? <Lock size={20} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
          : isDefeated
            ? <Trophy size={28} color="#000" strokeWidth={1.5} />
            : <boss.Icon size={28} color={color} strokeWidth={1.5} />}
      </div>

      {/* Badge */}
      <div style={{
        fontFamily: theme.fontSub, fontWeight: 700,
        fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
        color: isLocked ? 'rgba(255,255,255,0.2)' : color,
        marginBottom: 5,
      }}>
        {isDefeated ? 'DEFEATED' : isReady ? 'CHALLENGE READY' : boss.badgeLabel || 'LOCKED'}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: theme.fontHeading,
        fontSize: theme.fontHeading.includes('Orbitron') ? 14 : 20,
        letterSpacing: '1.5px',
        color: isLocked ? 'rgba(255,255,255,0.25)' : theme.textPrimary,
        marginBottom: 6,
        textShadow: !isLocked ? `0 0 16px ${glow}` : 'none',
      }}>
        {boss.name}
      </div>

      {!isLocked && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {isDefeated ? (
            <span style={{ fontFamily: theme.fontSub, fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color, opacity: 0.8 }}>
              ✓ Season Cleared
            </span>
          ) : (
            <>
              <Zap size={11} color={color} />
              <span style={{ fontFamily: theme.fontSub, fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color }}>
                +{boss.xpReward} XP · Tap to Challenge
              </span>
            </>
          )}
        </div>
      )}
    </motion.button>
  );
}

// ─── Boss Challenge Modal ─────────────────────────────────────────────────────
function BossChallengeModal({ boss, color, glow, theme, onVictory, onClose }) {
  const [phase, setPhase] = useState('preview'); // 'preview' | 'confirming' | 'victory'
  const BossIcon = boss.Icon || Trophy;

  const handleAttempt = () => {
    setPhase('confirming');
    setTimeout(() => setPhase('victory'), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={(e) => { if (e.target === e.currentTarget && phase !== 'confirming') onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        style={{ width: '100%', maxWidth: 480, background: theme.bgCard, border: `1.5px solid ${color}55`, borderRadius: 18, padding: 28, boxShadow: `0 0 60px ${glow}30, 0 24px 48px rgba(0,0,0,0.7)`, position: 'relative' }}
      >
        {/* Close */}
        {phase === 'preview' && (
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={13} color="rgba(255,255,255,0.5)" />
          </button>
        )}

        {phase === 'victory' ? (
          /* Victory state */
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '8px 0' }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              style={{ fontSize: 60, marginBottom: 16 }}
            >
              🏆
            </motion.div>
            <div style={{ fontFamily: theme.fontHeading, fontSize: theme.fontHeading.includes('Orbitron') ? 20 : 30, letterSpacing: 2, color, marginBottom: 8, textShadow: `0 0 20px ${glow}` }}>
              CHALLENGE COMPLETE!
            </div>
            <div style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textMuted, marginBottom: 20 }}>
              +{boss.xpReward} Concert Points earned
            </div>
            <motion.button
              whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
              onClick={onVictory}
              style={{ background: color, color: '#000', padding: '12px 32px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: theme.fontHeading, fontSize: 18, letterSpacing: 1.5 }}
            >
              CLAIM REWARD
            </motion.button>
          </motion.div>
        ) : phase === 'confirming' ? (
          /* Processing state */
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid ${color}40`, borderTopColor: color, margin: '0 auto 16px' }}
            />
            <div style={{ fontFamily: theme.fontSub, fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.textMuted }}>
              Processing challenge...
            </div>
          </div>
        ) : (
          /* Preview state */
          <>
            {/* Boss icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${color}20`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 28px ${glow}` }}>
                <BossIcon size={32} color={color} strokeWidth={1.5} />
              </div>
            </div>

            {/* Badge */}
            <div style={{ textAlign: 'center', fontFamily: theme.fontSub, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color, marginBottom: 8 }}>
              {boss.badgeLabel || 'SEASON CHALLENGE'}
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', fontFamily: theme.fontHeading, fontSize: theme.fontHeading.includes('Orbitron') ? 16 : 22, letterSpacing: 1.5, color: theme.textPrimary, marginBottom: 16, lineHeight: 1.2 }}>
              {boss.name}
            </div>

            {/* Scenario */}
            <div style={{ background: `${color}0C`, border: `1px solid ${color}25`, borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
              <div style={{ fontFamily: theme.fontSub, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: 6 }}>
                THE SCENARIO
              </div>
              <p style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textSecondary, lineHeight: 1.65, margin: 0 }}>
                {boss.scenario}
              </p>
            </div>

            {/* XP reward */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
              <Zap size={13} color={color} />
              <span style={{ fontFamily: theme.fontSub, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color }}>
                {boss.xpReward} Concert Points at stake
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onClose}
                style={{ flex: 1, padding: '12px', borderRadius: 8, background: 'transparent', border: `1px solid rgba(255,255,255,0.15)`, cursor: 'pointer', fontFamily: theme.fontSub, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.textMuted }}
              >
                Not Ready
              </button>
              <motion.button
                whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
                onClick={handleAttempt}
                style={{ flex: 2, padding: '12px', borderRadius: 8, background: color, border: 'none', cursor: 'pointer', fontFamily: theme.fontHeading, fontSize: theme.fontHeading.includes('Orbitron') ? 14 : 18, letterSpacing: 1.5, color: '#000', boxShadow: `0 0 18px ${glow}50` }}
              >
                BEGIN CHALLENGE
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Loading spinner ──────────────────────────────────────────────────────────
function LoadingSpinner({ C, theme }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 14 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: C }} />
      <div style={{ fontFamily: theme.fontSub, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>LOADING...</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MusicPlaybook() {
  const navigate = useNavigate();
  const { completedTopics = [], loading: userLoading } = useUser();
  const { defeatedBosses = [] } = useMusic();
  const { musicColor: C, musicCluster, musicCharacter } = useOutletContext();

  const cluster = musicCluster || CLUSTER_MAP[musicCharacter?.id] || 'vinyl';
  const theme   = getClusterTheme(musicCharacter?.id);
  const color   = C || '#D798A3';
  const glow    = musicCharacter?.glow || `${color}80`;

  // Default: season 0 open, others closed
  const [openSeasons, setOpenSeasons] = useState({ 0: true, 1: false, 2: false });

  const toggleSeason = (id) => setOpenSeasons(p => ({ ...p, [id]: !p[id] }));

  // Summary stats
  const totalTopics = SEASONS.reduce((a, s) => a + s.topics.length, 0);
  const doneTopics  = completedTopics.filter(n => MUSIC_TOPICS.some(t => t.name === n)).length;
  const doneBosses  = defeatedBosses.filter(id => MUSIC_BOSSES.some(b => b.id === id)).length;

  function handleTopicClick(topic) {
    const flat = SEASONS.flatMap(s => s.topics);
    const idx  = flat.findIndex(t => t.id === topic.id);
    const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
    navigate('/music/learn', { state: {
      topic: topic.name, topicId: topic.id,
      nextTopic: next?.name || null, nextTopicId: next?.id || null,
    }});
  }

  if (userLoading) return <LoadingSpinner C={color} theme={theme} />;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`music-playbook music-playbook-${cluster}`}
        style={{ padding: '18px 16px 60px', maxWidth: 560, margin: '0 auto' }}
      >

        {/* ── Page title ── */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: 4 }}>
            Music Domain
          </div>
          <h1 style={{ fontFamily: theme.fontHeading, fontSize: theme.fontHeading.includes('Orbitron') ? 24 : 34, letterSpacing: theme.fontHeading.includes('Cormorant') ? 2 : 3, color: theme.textPrimary, margin: 0, lineHeight: 1 }}>
            THE SETLIST
          </h1>
          <p style={{ fontFamily: theme.fontBody, fontSize: 12, color: theme.textMuted, marginTop: 6 }}>
            12 topics · 3 seasons · 3 boss challenges
          </p>
        </div>

        {/* ── Progress summary ── */}
        <div style={{ background: theme.bgCard, border: `1px solid ${color}28`, borderRadius: 14, padding: '16px 18px', marginBottom: 28, boxShadow: `0 0 24px ${color}0C` }}>
          <div style={{ fontFamily: theme.fontSub, fontWeight: 600, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color, marginBottom: 10 }}>
            Your Progress
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            {[
              { label: 'Topics Completed', value: `${doneTopics}/${totalTopics}`, icon: <Star size={12} color={color} /> },
              { label: 'Bosses Defeated',  value: `${doneBosses}/3`,             icon: <Trophy size={12} color={color} /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, textAlign: 'center', background: `${color}0C`, border: `1px solid ${color}25` }}>
                <div style={{ fontFamily: theme.fontHeading, fontSize: theme.fontHeading.includes('Orbitron') ? 16 : 22, letterSpacing: '1px', color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  {icon} {value}
                </div>
                <div style={{ fontFamily: theme.fontSub, fontWeight: 600, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.textMuted, marginTop: 3 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: theme.fontSub, fontWeight: 600, fontSize: 10, color: theme.textMuted }}>Overall</span>
              <span style={{ fontFamily: theme.fontHeading, fontSize: 12, letterSpacing: '0.5px', color }}>{Math.round((doneTopics / totalTopics) * 100)}%</span>
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
          domain="music"
          accent={color}
          theme={{ surface: theme.bgCard, border: 'rgba(255,255,255,0.10)', textPrimary: theme.textPrimary, textMuted: theme.textMuted, radius: cluster === 'neon' ? 0 : 14, fontHeading: theme.fontHeading, fontBody: theme.fontBody }}
        />

        {/* ── Seasons ── */}
        {SEASONS.map((season, si) => {
          const seasonUnlocked = si === 0 || defeatedBosses.includes(MUSIC_BOSSES[si - 1].id);
          const bossReady      = isBossUnlocked(si, completedTopics);
          const bossDefeated   = defeatedBosses.includes(season.boss.id);
          const isOpen         = openSeasons[si];
          const seasonDone     = season.topics.filter(t => completedTopics.includes(t.name)).length;

          const bossState = !seasonUnlocked || !bossReady
            ? 'locked'
            : bossDefeated
              ? 'defeated'
              : 'unlocked';

          return (
            <div key={season.id} style={{ marginBottom: 20 }}>

              {/* Season header (clickable to expand/collapse) */}
              <motion.button
                onClick={() => seasonUnlocked && toggleSeason(si)}
                whileHover={seasonUnlocked ? { x: 2 } : {}}
                whileTap={seasonUnlocked ? { scale: 0.99 } : {}}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', borderRadius: 12, marginBottom: isOpen ? 14 : 0,
                  background: seasonUnlocked ? `${color}0E` : 'rgba(255,255,255,0.02)',
                  border: seasonUnlocked ? `1px solid ${color}30` : '1px solid rgba(255,255,255,0.06)',
                  cursor: seasonUnlocked ? 'pointer' : 'default',
                  transition: 'all 0.2s ease', textAlign: 'left',
                  boxShadow: isOpen && seasonUnlocked ? `0 0 20px ${color}10` : 'none',
                }}
              >
                {/* Season icon */}
                <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: seasonUnlocked ? `${color}18` : 'rgba(255,255,255,0.04)', border: seasonUnlocked ? `1.5px solid ${color}50` : '1.5px solid rgba(255,255,255,0.08)' }}>
                  {seasonUnlocked
                    ? <season.SeasonIcon size={20} color={color} strokeWidth={1.8} />
                    : <Lock size={16} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />}
                </div>

                {/* Labels */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: theme.fontSub, fontWeight: 600, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: seasonUnlocked ? color : 'rgba(255,255,255,0.2)', marginBottom: 2 }}>
                    {season.seasonLabel}
                  </div>
                  <div style={{ fontFamily: theme.fontHeading, fontSize: theme.fontHeading.includes('Orbitron') ? 14 : 20, letterSpacing: '1.5px', color: seasonUnlocked ? theme.textPrimary : 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {season.title}
                  </div>
                </div>

                {/* Progress + chevron */}
                {seasonUnlocked && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontFamily: theme.fontHeading, fontSize: 13, letterSpacing: '0.5px', color, opacity: 0.8 }}>
                      {seasonDone}/{season.topics.length}
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={16} color={color} />
                    </motion.div>
                  </div>
                )}
              </motion.button>

              {/* Expanded content */}
              <AnimatePresence initial={false}>
                {isOpen && seasonUnlocked && (
                  <motion.div
                    key={`season-${si}-content`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingLeft: 8, paddingRight: 8, paddingBottom: 4 }}>
                      {/* Season description */}
                      <p style={{ fontFamily: theme.fontBody, fontSize: 12, color: theme.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
                        {season.desc}
                      </p>

                      {/* Topic nodes */}
                      {season.topics.map((topic, ti) => {
                        const unlocked  = isTopicUnlocked(si, ti, completedTopics, defeatedBosses);
                        const complete   = completedTopics.includes(topic.name);
                        const topicState = !unlocked ? 'locked' : complete ? 'complete' : 'current';

                        return (
                          <React.Fragment key={topic.id}>
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.22, delay: ti * 0.04 }}
                            >
                              <TopicNode
                                topic={topic}
                                state={topicState}
                                color={color}
                                theme={theme}
                                cluster={cluster}
                                onClick={() => handleTopicClick(topic)}
                              />
                            </motion.div>
                            {/* Path connector between topics */}
                            {ti < season.topics.length - 1 && (
                              <PathLine
                                color={color}
                                complete={complete}
                                pulse={unlocked && !complete && (ti === 0 || completedTopics.includes(season.topics[ti - 1].name))}
                              />
                            )}
                          </React.Fragment>
                        );
                      })}

                      {/* Path to boss */}
                      <PathLine
                        color={color}
                        complete={bossReady && seasonUnlocked}
                        pulse={bossReady && !bossDefeated && seasonUnlocked}
                      />

                      {/* Boss node */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.28, delay: 0.18 }}
                      >
                        <BossNode
                          boss={season.boss}
                          state={bossState}
                          color={color}
                          glow={glow}
                          theme={theme}
                          cluster={cluster}
                          onClick={() => navigate(`/music/boss/${season.boss.id}`)}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Season divider */}
              {si < SEASONS.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
                  <div style={{ fontFamily: theme.fontSub, fontWeight: 600, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
                    Next Season
                  </div>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
                </div>
              )}
            </div>
          );
        })}

        {/* ── Mastered state ── */}
        {doneBosses === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ textAlign: 'center', padding: '28px 20px', background: `${color}12`, border: `1.5px solid ${color}60`, borderRadius: 16, boxShadow: `0 0 40px ${color}20`, marginTop: 8 }}
          >
            <Trophy size={52} color={color} strokeWidth={1.2} style={{ marginBottom: 12 }} />
            <div style={{ fontFamily: theme.fontHeading, fontSize: theme.fontHeading.includes('Orbitron') ? 22 : 30, letterSpacing: '2.5px', color, marginBottom: 6, textShadow: `0 0 24px ${glow}` }}>
              {theme.fontHeading.includes('Cormorant') ? 'Maestro' : 'MASTERED'}
            </div>
            <div style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textMuted, lineHeight: 1.6 }}>
              All three seasons conquered.<br />You are a fully independent music artist.
            </div>
          </motion.div>
        )}
      </motion.div>

    </>
  );
}
