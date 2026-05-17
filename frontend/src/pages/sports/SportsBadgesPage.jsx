import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Zap, Target, Shield, Flame, Award, Star, Trophy, Crown,
  BookOpen, TrendingUp, CheckCircle, RefreshCw, Users, X, ArrowRight,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useSports } from '../../contexts/SportsContext';
import { useGamification } from '../../hooks/useGamification';
import { sportsTheme } from '../../styles/sportsTheme';

const RARITY = {
  COMMON:    { color: 'rgba(255,255,255,0.55)', label: 'COMMON',    glow: 'rgba(255,255,255,0.1)'   },
  RARE:      { color: '#60a5fa',                label: 'RARE',      glow: 'rgba(96,165,250,0.2)'   },
  EPIC:      { color: '#a855f7',                label: 'EPIC',      glow: 'rgba(168,85,247,0.2)'   },
  LEGENDARY: { color: '#F5C842',                label: 'LEGENDARY', glow: 'rgba(245,200,66,0.25)'  },
};

const CATEGORIES = ['ALL', 'MILESTONE', 'PERFORMANCE', 'STREAK', 'SEASON', 'SPECIAL'];

const SPORTS_BADGES = [
  // ── Milestone ──────────────────────────────────────────────────────────────
  {
    id: 'first_whistle',
    Icon: Zap,
    name: 'First Whistle',
    desc: 'Complete your first training session',
    category: 'MILESTONE',
    rarity: 'COMMON',
    condition: (c) => c >= 1,
  },
  {
    id: 'opening_day',
    Icon: BookOpen,
    name: 'Opening Day',
    desc: 'Complete 3 training sessions',
    category: 'MILESTONE',
    rarity: 'COMMON',
    condition: (c) => c >= 3,
  },
  {
    id: 'in_the_squad',
    Icon: Users,
    name: 'In the Squad',
    desc: 'Complete 5 training sessions',
    category: 'MILESTONE',
    rarity: 'COMMON',
    condition: (c) => c >= 5,
  },
  {
    id: 'starting_eleven',
    Icon: Star,
    name: 'Starting Eleven',
    desc: 'Complete 11 training sessions',
    category: 'MILESTONE',
    rarity: 'RARE',
    condition: (c) => c >= 11,
  },
  {
    id: 'veteran',
    Icon: Award,
    name: 'Veteran',
    desc: 'Complete 20 training sessions',
    category: 'MILESTONE',
    rarity: 'EPIC',
    condition: (c) => c >= 20,
  },

  // ── Performance ─────────────────────────────────────────────────────────────
  {
    id: 'clean_sheet',
    Icon: Shield,
    name: 'Clean Sheet',
    desc: 'Score 100% on a quiz',
    category: 'PERFORMANCE',
    rarity: 'RARE',
    condition: (c, s, sc) => sc >= 100,
  },
  {
    id: 'sharpshooter',
    Icon: Target,
    name: 'Sharpshooter',
    desc: 'Maintain 80%+ average score',
    category: 'PERFORMANCE',
    rarity: 'RARE',
    condition: (c, s, sc) => sc >= 80 && c >= 3,
  },
  {
    id: 'golden_boot',
    Icon: Award,
    name: 'Golden Boot',
    desc: 'Complete 10 training sessions',
    category: 'PERFORMANCE',
    rarity: 'EPIC',
    condition: (c) => c >= 10,
  },
  {
    id: 'record_breaker',
    Icon: TrendingUp,
    name: 'Record Breaker',
    desc: 'Complete 15 training sessions',
    category: 'PERFORMANCE',
    rarity: 'EPIC',
    condition: (c) => c >= 15,
  },
  {
    id: 'perfectionist',
    Icon: CheckCircle,
    name: 'Perfectionist',
    desc: 'Score 100% with 5+ sessions completed',
    category: 'PERFORMANCE',
    rarity: 'LEGENDARY',
    condition: (c, s, sc) => sc >= 100 && c >= 5,
  },

  // ── Streak ──────────────────────────────────────────────────────────────────
  {
    id: 'hat_trick',
    Icon: Flame,
    name: 'Hat Trick',
    desc: '3-day learning streak',
    category: 'STREAK',
    rarity: 'COMMON',
    condition: (c, s) => s >= 3,
  },
  {
    id: 'unbeaten_run',
    Icon: Flame,
    name: 'Unbeaten Run',
    desc: '7-day winning streak',
    category: 'STREAK',
    rarity: 'RARE',
    condition: (c, s) => s >= 7,
  },
  {
    id: 'captains_armband',
    Icon: Star,
    name: "Captain's Armband",
    desc: '10-day streak — lead by example',
    category: 'STREAK',
    rarity: 'EPIC',
    condition: (c, s) => s >= 10,
  },
  {
    id: 'iron_man',
    Icon: Trophy,
    name: 'Iron Man',
    desc: '14-day streak — unstoppable',
    category: 'STREAK',
    rarity: 'LEGENDARY',
    condition: (c, s) => s >= 14,
  },

  // ── Season ──────────────────────────────────────────────────────────────────
  {
    id: 'pre_season_victor',
    Icon: Shield,
    name: 'Pre-Season Victor',
    desc: 'Defeat The Pre-Season Challenge',
    category: 'SEASON',
    rarity: 'RARE',
    condition: (c, s, sc, bosses) => bosses.includes('boss_s0'),
  },
  {
    id: 'mid_season_champion',
    Icon: Trophy,
    name: 'Mid-Season Champion',
    desc: 'Defeat The Mid-Season Match',
    category: 'SEASON',
    rarity: 'EPIC',
    condition: (c, s, sc, bosses) => bosses.includes('boss_s1'),
  },
  {
    id: 'mvp',
    Icon: Star,
    name: 'MVP',
    desc: 'Defeat the Championship Final',
    category: 'SEASON',
    rarity: 'LEGENDARY',
    condition: (c, s, sc, bosses) => bosses.includes('boss_s2'),
  },
  {
    id: 'the_treble',
    Icon: Crown,
    name: 'The Treble',
    desc: 'Win all three championships',
    category: 'SEASON',
    rarity: 'LEGENDARY',
    condition: (c, s, sc, bosses) =>
      bosses.includes('boss_s0') && bosses.includes('boss_s1') && bosses.includes('boss_s2'),
  },

  // ── Special ─────────────────────────────────────────────────────────────────
  {
    id: 'comeback_king',
    Icon: RefreshCw,
    name: 'Comeback King',
    desc: 'Score 90%+ on a quiz',
    category: 'SPECIAL',
    rarity: 'EPIC',
    condition: (c, s, sc) => sc >= 90,
  },
  {
    id: 'marathon_runner',
    Icon: Zap,
    name: 'Marathon Runner',
    desc: 'Complete 25 training sessions',
    category: 'SPECIAL',
    rarity: 'LEGENDARY',
    condition: (c) => c >= 25,
  },
];

// ── Badge detail modal ────────────────────────────────────────────────────────
function BadgeModal({ badge, onClose }) {
  const r = RARITY[badge.rarity];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(22,22,22,0.98)',
          border: `1px solid ${badge.unlocked ? r.color : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 16,
          padding: '32px 28px',
          maxWidth: 340, width: '100%',
          textAlign: 'center',
          boxShadow: badge.unlocked ? `0 0 40px ${r.glow}` : '0 8px 40px rgba(0,0,0,0.6)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: 16,
          background: badge.unlocked ? `${r.glow}` : 'rgba(255,255,255,0.04)',
          border: `2px solid ${badge.unlocked ? r.color : 'rgba(255,255,255,0.1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: badge.unlocked ? `0 0 24px ${r.glow}` : 'none',
        }}>
          {badge.unlocked
            ? <badge.Icon size={32} color={r.color} strokeWidth={1.6} />
            : <Lock size={28} color="rgba(255,255,255,0.2)" strokeWidth={1.6} />}
        </div>

        {/* Rarity */}
        <div style={{
          fontFamily: sportsTheme.fontSub, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: badge.unlocked ? r.color : 'rgba(255,255,255,0.2)',
          marginBottom: 6,
        }}>
          {badge.rarity} · {badge.category}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: sportsTheme.fontHeading,
          fontSize: 28, letterSpacing: '2px',
          color: badge.unlocked ? '#fff' : 'rgba(255,255,255,0.25)',
          lineHeight: 1, marginBottom: 10,
        }}>
          {badge.name}
        </div>

        {/* Description */}
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 20,
        }}>
          {badge.desc}
        </div>

        {/* Status */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 16px', borderRadius: 99,
          background: badge.unlocked ? `${r.glow}` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${badge.unlocked ? r.color : 'rgba(255,255,255,0.1)'}`,
          fontFamily: sportsTheme.fontSub, fontSize: 11, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: badge.unlocked ? r.color : 'rgba(255,255,255,0.25)',
        }}>
          {badge.unlocked ? <><CheckCircle size={12} /> EARNED</> : <><Lock size={12} /> LOCKED</>}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Badge card ────────────────────────────────────────────────────────────────
function BadgeCard({ badge, C, onClick }) {
  const r = RARITY[badge.rarity];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: badge.unlocked ? 1 : 0.5, scale: 1 }}
      whileHover={{ scale: 1.03, opacity: 1 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(badge)}
      style={{
        background: badge.unlocked ? `rgba(26,26,26,0.95)` : 'rgba(18,18,18,0.95)',
        border: `1px solid ${badge.unlocked ? r.color + '55' : 'rgba(255,255,255,0.06)'}`,
        borderTop: badge.unlocked ? `2px solid ${r.color}` : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 14px',
        cursor: 'pointer',
        boxShadow: badge.unlocked ? `0 4px 20px ${r.glow}` : 'none',
        transition: 'border 0.2s ease, box-shadow 0.2s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 8,
        filter: badge.unlocked ? 'none' : 'grayscale(0.4)',
      }}
    >
      {/* Icon container */}
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: badge.unlocked ? r.glow : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${badge.unlocked ? r.color : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: badge.unlocked ? `0 0 12px ${r.glow}` : 'none',
      }}>
        {badge.unlocked
          ? <badge.Icon size={22} color={r.color} strokeWidth={1.8} />
          : <Lock size={18} color="rgba(255,255,255,0.18)" strokeWidth={1.8} />}
      </div>

      {/* Rarity */}
      <div style={{
        fontFamily: sportsTheme.fontSub, fontSize: 8, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: badge.unlocked ? r.color : 'rgba(255,255,255,0.2)',
      }}>
        {badge.rarity}
      </div>

      {/* Name */}
      <div style={{
        fontFamily: sportsTheme.fontHeading,
        fontSize: 14, letterSpacing: '0.8px',
        color: badge.unlocked ? '#fff' : 'rgba(255,255,255,0.22)',
        lineHeight: 1.1,
      }}>
        {badge.name}
      </div>

      {/* Desc */}
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 10, lineHeight: 1.4,
        color: badge.unlocked ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)',
      }}>
        {badge.desc}
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
export default function SportsBadgesPage() {
  const navigate = useNavigate();
  const { completedTopics, stats, loading: userLoading } = useUser();
  const { streak } = useGamification();
  const { defeatedBosses } = useSports();
  const { sportsColor: C } = useOutletContext();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedBadge, setSelectedBadge] = useState(null);

  const completed = completedTopics.length;
  const avgScore  = stats?.avgScore ?? 0;

  const evaluated = SPORTS_BADGES.map(b => ({
    ...b,
    unlocked: b.condition(completed, streak, avgScore, defeatedBosses || []),
  }));

  const filtered = evaluated.filter(b => {
    if (activeFilter === 'ALL')    return true;
    if (activeFilter === 'EARNED') return b.unlocked;
    if (activeFilter === 'LOCKED') return !b.unlocked;
    return b.category === activeFilter;
  });

  const unlockedCount = evaluated.filter(b => b.unlocked).length;
  const pct = Math.round((unlockedCount / evaluated.length) * 100);

  if (userLoading) return <LoadingSpinner C={C} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* ── Header summary ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(26,26,26,0.95)',
          borderLeft: `3px solid ${C}`,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          padding: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: sportsTheme.fontSub, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', marginBottom: 4,
          }}>
            TROPHIES COLLECTED
          </div>
          <div style={{
            fontFamily: sportsTheme.fontHeading,
            fontSize: 36, letterSpacing: '2px',
            color: C, lineHeight: 1, marginBottom: 10,
          }}>
            {unlockedCount} / {evaluated.length}
          </div>
          {/* Progress bar */}
          <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 99, background: C, boxShadow: `0 0 8px ${C}60` }}
            />
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6,
          }}>
            {pct}% complete
          </div>
        </div>

        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          border: `2px solid rgba(255,255,255,0.08)`,
          boxShadow: `0 0 0 2px ${C}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${C}10`, flexShrink: 0,
        }}>
          <span style={{
            fontFamily: sportsTheme.fontHeading,
            fontSize: 20, letterSpacing: '1px', color: C,
          }}>
            {pct}%
          </span>
        </div>
      </motion.div>

      {/* ── Filter tabs ── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => {
          const isActive = activeFilter === cat;
          return (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: '6px 12px', borderRadius: 6,
                background: isActive ? C : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isActive ? C : 'rgba(255,255,255,0.1)'}`,
                fontFamily: sportsTheme.fontSub, fontSize: 10, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: isActive ? '#000' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </motion.button>
          );
        })}
      </div>

      {/* ── Badge grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 10,
          }}
        >
          {filtered.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              C={C}
              onClick={setSelectedBadge}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center', padding: '48px 20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: `${C}10`,
            border: `1px solid ${C}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trophy size={24} color={C} strokeWidth={1.5} style={{ opacity: 0.6 }} />
          </div>
          <div style={{
            fontFamily: sportsTheme.fontHeading,
            fontSize: 22, letterSpacing: '2px',
            color: 'rgba(255,255,255,0.35)',
          }}>
            {activeFilter === 'EARNED' ? 'NO TROPHIES YET' : 'NONE HERE'}
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13, color: 'rgba(255,255,255,0.25)',
            maxWidth: 240, lineHeight: 1.6, margin: 0,
          }}>
            {activeFilter === 'EARNED'
              ? 'Complete training sessions and quizzes to earn your first trophy.'
              : 'No badges match this filter.'}
          </p>
          {activeFilter === 'EARNED' && (
            <motion.button
              whileHover={{ filter: 'brightness(1.12)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/sports/playbook')}
              style={{
                marginTop: 4,
                background: C, color: '#000',
                padding: '9px 20px', borderRadius: '8px',
                fontFamily: sportsTheme.fontHeading,
                fontSize: '16px', letterSpacing: '1.5px',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              START TRAINING <ArrowRight size={14} strokeWidth={2.5} />
            </motion.button>
          )}
        </motion.div>
      )}

      {/* ── Badge detail modal ── */}
      <AnimatePresence>
        {selectedBadge && (
          <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
