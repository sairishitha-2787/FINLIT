import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import useGamification from '../../hooks/useGamification';

const SPORTS_BADGES = [
  {
    id: 'first_whistle',
    emoji: '⚽',
    name: 'First Whistle',
    desc: 'Complete your first drill',
    condition: (completed, streak, score) => completed >= 1,
    rarity: 'COMMON',
  },
  {
    id: 'hat_trick',
    emoji: '🎯',
    name: 'Hat Trick',
    desc: '3 drills in a row',
    condition: (completed, streak) => streak >= 3,
    rarity: 'COMMON',
  },
  {
    id: 'clean_sheet',
    emoji: '🛡️',
    name: 'Clean Sheet',
    desc: 'Score 100% on a drill',
    condition: (completed, streak, score) => score >= 100,
    rarity: 'RARE',
  },
  {
    id: 'unbeaten_run',
    emoji: '🔥',
    name: 'Unbeaten Run',
    desc: '7-day win streak',
    condition: (completed, streak) => streak >= 7,
    rarity: 'RARE',
  },
  {
    id: 'golden_boot',
    emoji: '🥾',
    name: 'Golden Boot',
    desc: 'Master 10 drills',
    condition: (completed) => completed >= 10,
    rarity: 'EPIC',
  },
  {
    id: 'captains_armband',
    emoji: '🏅',
    name: "Captain's Armband",
    desc: 'Complete a full season',
    condition: (completed) => completed >= 5,
    rarity: 'EPIC',
  },
  {
    id: 'mvp',
    emoji: '⭐',
    name: 'MVP',
    desc: 'Master 20 drills',
    condition: (completed) => completed >= 20,
    rarity: 'EPIC',
  },
  {
    id: 'the_treble',
    emoji: '🏆',
    name: 'The Treble',
    desc: 'Complete 3 full seasons',
    condition: (completed) => completed >= 15,
    rarity: 'LEGENDARY',
  },
  {
    id: 'champions',
    emoji: '👑',
    name: 'Champions',
    desc: 'Complete the entire playbook',
    condition: (completed) => completed >= 30,
    rarity: 'LEGENDARY',
  },
];

const RARITY_CONFIG = {
  COMMON:    { color: 'rgba(255,255,255,0.5)', label: 'COMMON'    },
  RARE:      { color: '#4A7BF7',               label: 'RARE'      },
  EPIC:      { color: '#a855f7',               label: 'EPIC'      },
  LEGENDARY: { color: '#F5C842',               label: 'LEGENDARY' },
};

export default function SportsBadgesPage() {
  const { completedTopics, stats } = useUser();
  const { streak } = useGamification();
  const { sportsColor: C } = useOutletContext();

  const completed = completedTopics.length;
  const avgScore  = stats?.avgScore ?? 0;

  const evaluatedBadges = SPORTS_BADGES.map(b => ({
    ...b,
    unlocked: b.condition(completed, streak, avgScore),
  }));

  const unlockedCount = evaluatedBadges.filter(b => b.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '20px 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* Summary */}
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
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', marginBottom: '4px',
          }}>
            TROPHIES COLLECTED
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: '36px', letterSpacing: '2px',
            color: C, lineHeight: 1,
          }}>
            {unlockedCount} / {SPORTS_BADGES.length}
          </div>
        </div>
        {/* Progress ring approximation */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          border: `3px solid rgba(255,255,255,0.08)`,
          boxShadow: `inset 0 0 0 3px ${C}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${C}12`,
        }}>
          <span style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: '18px', color: C,
          }}>
            {Math.round((unlockedCount / SPORTS_BADGES.length) * 100)}%
          </span>
        </div>
      </motion.div>

      {/* Badge grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {evaluatedBadges.map((badge, i) => {
          const rarity = RARITY_CONFIG[badge.rarity];
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              style={{
                background: badge.unlocked ? `${C}0F` : 'rgba(20,20,20,0.95)',
                borderLeft: `3px solid ${badge.unlocked ? C : 'rgba(255,255,255,0.08)'}`,
                borderTop: '1px solid rgba(255,255,255,0.07)',
                borderRight: '1px solid rgba(255,255,255,0.04)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '8px',
                boxShadow: badge.unlocked ? `0 0 16px ${C}30` : '0 2px 12px rgba(0,0,0,0.4)',
                padding: '14px',
                opacity: badge.unlocked ? 1 : 0.55,
              }}
            >
              {/* Emoji */}
              <div style={{
                fontSize: '28px', marginBottom: '8px',
                filter: badge.unlocked ? 'none' : 'grayscale(100%) brightness(0.4)',
              }}>
                {badge.unlocked ? badge.emoji : <Lock size={22} color="rgba(255,255,255,0.2)" />}
              </div>

              {/* Rarity label */}
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '9px', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: badge.unlocked ? rarity.color : 'rgba(255,255,255,0.2)',
                marginBottom: '3px',
              }}>
                {badge.rarity}
              </div>

              {/* Name */}
              <div style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: '16px', letterSpacing: '0.8px',
                color: badge.unlocked ? '#fff' : 'rgba(255,255,255,0.25)',
                lineHeight: 1.1, marginBottom: '4px',
              }}>
                {badge.name}
              </div>

              {/* Description */}
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                color: badge.unlocked ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
              }}>
                {badge.desc}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
