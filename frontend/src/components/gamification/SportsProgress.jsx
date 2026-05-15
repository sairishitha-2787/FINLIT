// SportsProgress — Championship Roster progression view

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { COLLECTIBLES, CHAPTER_TOPICS } from '../../config/collectibles';
import CollectibleTooltip from './CollectibleTooltip';

// ── Jersey SVG ────────────────────────────────────────────────────────────────

const JerseySVG = ({ number, color, isUnlocked }) => (
  <svg viewBox="0 0 48 56" className="w-full h-full">
    <path
      d="M10 6 L2 18 L12 22 L12 52 L36 52 L36 22 L46 18 L38 6 L32 10 C28 14 20 14 16 10 Z"
      fill={isUnlocked ? color : '#e5e7eb'}
      stroke="black"
      strokeWidth="2"
    />
    {isUnlocked ? (
      <text
        x="24" y="36"
        textAnchor="middle"
        fontSize="14"
        fontWeight="900"
        fill="black"
        fontFamily="monospace"
      >
        {number}
      </text>
    ) : (
      <>
        <rect x="18" y="28" width="12" height="10" rx="1" fill="black" opacity="0.15" />
        <path d="M22 28 V26 A2 2 0 0 1 26 26 V28" stroke="black" strokeWidth="1.5" fill="none" opacity="0.2" />
      </>
    )}
  </svg>
);

// ── Court diagram (half-court) ────────────────────────────────────────────────

const CourtSVG = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full opacity-20">
    <rect x="2" y="2" width="196" height="116" fill="none" stroke="black" strokeWidth="2" />
    <rect x="70" y="2" width="60" height="50" fill="none" stroke="black" strokeWidth="1.5" />
    <circle cx="100" cy="52" r="20" fill="none" stroke="black" strokeWidth="1.5" />
    <circle cx="100" cy="2"  r="6"  fill="none" stroke="black" strokeWidth="1.5" />
    <line x1="2" y1="60" x2="198" y2="60" stroke="black" strokeWidth="1" strokeDasharray="6,4" />
    <circle cx="100" cy="60" r="12" fill="none" stroke="black" strokeWidth="1" />
  </svg>
);

// ── Player Card ───────────────────────────────────────────────────────────────

const CHAPTER_COLORS = { 1: '#4ade80', 2: '#60a5fa', 3: '#f472b6' };

const PlayerCard = ({ topic, collectible, isUnlocked }) => {
  const [hovered, setHovered] = useState(false);
  const color = CHAPTER_COLORS[collectible?.chapter] || '#4ade80';

  return (
    <div
      className="relative flex flex-col items-center gap-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        whileHover={isUnlocked ? { y: -4, scale: 1.1 } : { x: [0,-2,2,-2,0] }}
        transition={isUnlocked ? { type:'spring', stiffness:400 } : { duration:0.3 }}
        className="w-10 h-12"
      >
        <JerseySVG number={collectible?.number} color={color} isUnlocked={isUnlocked} />
      </motion.div>
      <span className={`text-[8px] font-black text-center leading-none px-0.5 ${isUnlocked ? 'text-brutal-black' : 'text-brutal-black/25'}`}>
        {collectible?.position}
      </span>
      <span className={`text-[8px] font-bold text-center leading-tight max-w-[48px] ${isUnlocked ? 'text-brutal-black/60' : 'text-brutal-black/20'}`}>
        {collectible?.name?.split(' ').slice(0, 2).join(' ')}
      </span>
      <CollectibleTooltip visible={hovered} collectible={collectible} isUnlocked={isUnlocked} prerequisite={topic} />
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const CHAPTER_LABELS = ['STARTING FIVE', 'BENCH ROTATION', 'FRONT OFFICE'];

const SportsProgress = ({ completedTopics = [] }) => {
  const domain = COLLECTIBLES.sports;
  const allTopics = [...CHAPTER_TOPICS[1], ...CHAPTER_TOPICS[2], ...CHAPTER_TOPICS[3]];
  const unlockedCount = allTopics.filter(t => completedTopics.includes(t)).length;
  const pct = Math.round((unlockedCount / allTopics.length) * 100);

  const records = ['0-0', '2-0', '4-0', '6-0', '8-0', '10-0', '12-0', '14-0'];
  const record = records[Math.min(Math.floor(unlockedCount / 2), records.length - 1)];

  return (
    <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal">
      {/* Header */}
      <div className="bg-brutal-black px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-brutal-blue text-xs font-black tracking-widest">CHAMPIONSHIP ROSTER</p>
          <h3 className="text-brutal-white font-black text-xl leading-tight">THE WEALTH BUILDERS</h3>
        </div>
        <div className="text-right">
          <p className="text-brutal-blue font-black text-xl">{record}</p>
          <p className="text-brutal-white/50 text-xs font-bold">{unlockedCount} players drafted</p>
        </div>
      </div>

      {/* Team chemistry bar */}
      <div className="bg-brutal-bg border-b-4 border-brutal-black px-5 py-2 flex items-center gap-3">
        <span className="text-xs font-black text-brutal-black/50">CHEMISTRY</span>
        <div className="flex-1 h-4 bg-brutal-black border-2 border-brutal-black">
          <motion.div
            className="h-full bg-brutal-blue"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs font-black text-brutal-black/70">{pct}%</span>
      </div>

      {/* Court background + roster */}
      <div className="p-5">
        <div className="relative">
          {/* Decorative court */}
          <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
            <div className="w-full max-w-xs opacity-10">
              <CourtSVG />
            </div>
          </div>

          {/* Roster by chapter */}
          {[1, 2, 3].map(ch => {
            const topics = CHAPTER_TOPICS[ch];
            const chCompleted = topics.filter(t => completedTopics.includes(t)).length;
            const chColor = CHAPTER_COLORS[ch];
            return (
              <div key={ch} className="mb-5 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-0.5 flex-1" style={{ backgroundColor: chColor }} />
                  <span className="text-[9px] font-black tracking-widest text-brutal-black/50 whitespace-nowrap">
                    {CHAPTER_LABELS[ch - 1]} — {chCompleted}/{topics.length}
                  </span>
                  <div className="h-0.5 flex-1" style={{ backgroundColor: chColor }} />
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {topics.map(topic => (
                    <PlayerCard
                      key={topic}
                      topic={topic}
                      collectible={domain[topic]}
                      isUnlocked={completedTopics.includes(topic)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-brutal-bg border-t-4 border-brutal-black px-5 py-2 flex items-center justify-between">
        <span className="text-xs font-black text-brutal-black/40">ROSTER DEPTH</span>
        <span className="text-xs font-black text-brutal-black">{unlockedCount}/{allTopics.length} PLAYERS DRAFTED ({pct}%)</span>
      </div>
    </div>
  );
};

export default SportsProgress;
