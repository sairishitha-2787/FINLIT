// MoviesProgress — Film Production progression view

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { COLLECTIBLES, CHAPTER_TOPICS } from '../../config/collectibles';
import CollectibleTooltip from './CollectibleTooltip';

// ── Clapperboard SVG ─────────────────────────────────────────────────────────

const ClapperSVG = ({ scene, isUnlocked, color }) => (
  <svg viewBox="0 0 44 44" className="w-full h-full">
    {/* Body */}
    <rect x="2" y="12" width="40" height="30" rx="1" fill={isUnlocked ? color : '#e5e7eb'} stroke="black" strokeWidth="2" />
    {/* Top bar */}
    <rect x="2" y="6" width="40" height="8" rx="1" fill={isUnlocked ? 'black' : '#d1d5db'} />
    {/* Stripe */}
    <rect x="2" y="6" width="40" height="4" rx="1" fill={isUnlocked ? color : '#e5e7eb'} opacity="0.6" />
    {/* Clapper arm */}
    <path d="M6 6 L12 2 L40 8 L34 12" fill={isUnlocked ? 'black' : '#d1d5db'} stroke="black" strokeWidth="1" />
    {isUnlocked ? (
      <text x="22" y="32" textAnchor="middle" fontSize="11" fontWeight="900" fill="black" fontFamily="monospace">
        {scene}
      </text>
    ) : (
      <>
        <rect x="16" y="26" width="12" height="10" rx="1" fill="black" opacity="0.1" />
        <path d="M20 26 V24 A2 2 0 0 1 24 24 V26" stroke="black" strokeWidth="1.5" fill="none" opacity="0.2" />
      </>
    )}
  </svg>
);

// ── Film Strip Holes ──────────────────────────────────────────────────────────

const FilmHoles = ({ count = 5 }) => (
  <div className="flex gap-2 px-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="w-2 h-2 rounded-full bg-brutal-black/15 border border-brutal-black/10" />
    ))}
  </div>
);

// ── Scene Card ────────────────────────────────────────────────────────────────

const ACT_COLORS = { 1: '#4ade80', 2: '#60a5fa', 3: '#f472b6' };

const SceneCard = ({ topic, collectible, isUnlocked }) => {
  const [hovered, setHovered] = useState(false);
  const color = ACT_COLORS[collectible?.act] || '#4ade80';

  return (
    <div
      className="relative flex flex-col items-center gap-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        whileHover={isUnlocked ? { y: -3, rotate: 2 } : { x: [0,-2,2,-2,0] }}
        transition={isUnlocked ? { type:'spring', stiffness:400 } : { duration:0.3 }}
        className="w-11 h-11"
      >
        <ClapperSVG scene={collectible?.scene} isUnlocked={isUnlocked} color={color} />
      </motion.div>
      <span className={`text-[8px] font-black text-center leading-tight max-w-[48px] ${isUnlocked ? 'text-brutal-black' : 'text-brutal-black/25'}`}>
        Sc.{collectible?.scene}
      </span>
      <CollectibleTooltip visible={hovered} collectible={collectible} isUnlocked={isUnlocked} prerequisite={topic} />
    </div>
  );
};

// ── Award Oscar SVG ──────────────────────────────────────────────────────────

const AwardSVG = ({ isUnlocked }) => (
  <svg viewBox="0 0 24 32" className="w-full h-full">
    <ellipse cx="12" cy="10" rx="8" ry="10" fill={isUnlocked ? '#f59e0b' : '#e5e7eb'} stroke="black" strokeWidth="1.5" />
    <circle cx="12" cy="8" r="4" fill={isUnlocked ? '#000' : '#d1d5db'} opacity="0.3" />
    <rect x="9" y="20" width="6" height="8" fill={isUnlocked ? '#f59e0b' : '#e5e7eb'} stroke="black" strokeWidth="1.5" />
    <rect x="6" y="28" width="12" height="3" rx="0.5" fill={isUnlocked ? '#000' : '#d1d5db'} />
  </svg>
);

// ── Main Component ────────────────────────────────────────────────────────────

const ACT_LABELS = ['ACT I — THE SETUP', 'ACT II — RISING ACTION', 'ACT III — THE RESOLUTION'];

const MoviesProgress = ({ completedTopics = [] }) => {
  const domain = COLLECTIBLES.movies;
  const allTopics = [...CHAPTER_TOPICS[1], ...CHAPTER_TOPICS[2], ...CHAPTER_TOPICS[3]];
  const unlockedCount = allTopics.filter(t => completedTopics.includes(t)).length;
  const pct = Math.round((unlockedCount / allTopics.length) * 100);

  const budgets = ['$0', '$50K', '$100K', '$200K', '$400K', '$600K', '$1M', '$2M', '$5M', '$10M', '$20M', '$50M', '$100M', '$1B'];
  const budget = budgets[Math.min(unlockedCount, budgets.length - 1)];

  const actCompleted = [1, 2, 3].map(act =>
    CHAPTER_TOPICS[act].every(t => completedTopics.includes(t))
  );

  return (
    <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal">
      {/* Header */}
      <div className="bg-brutal-black px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-brutal-green text-xs font-black tracking-widest">FILM PRODUCTION</p>
          <h3 className="text-brutal-white font-black text-xl leading-tight">FINANCIAL FREEDOM</h3>
          <p className="text-brutal-white/40 text-xs font-bold">Genre: Financial Drama</p>
        </div>
        <div className="text-right">
          <p className="text-brutal-white/50 text-xs font-bold mb-0.5">PRODUCTION BUDGET</p>
          <p className="text-brutal-green font-black text-xl">{budget}</p>
          <p className="text-brutal-white/50 text-xs font-bold">{unlockedCount}/{allTopics.length} scenes filmed</p>
        </div>
      </div>

      {/* Film reel progress */}
      <div className="bg-brutal-bg border-b-4 border-brutal-black">
        <FilmHoles count={7} />
        <div className="px-5 py-1 flex items-center gap-3">
          <span className="text-xs font-black text-brutal-black/50">FILMING</span>
          <div className="flex-1 h-4 bg-brutal-black border-2 border-brutal-black">
            <motion.div
              className="h-full bg-brutal-green"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs font-black text-brutal-black/70">{pct}%</span>
        </div>
        <FilmHoles count={7} />
      </div>

      {/* Acts + Scenes */}
      <div className="p-5 space-y-5">
        {[1, 2, 3].map(act => {
          const topics = CHAPTER_TOPICS[act];
          const actColor = ACT_COLORS[act];
          const chCompleted = topics.filter(t => completedTopics.includes(t)).length;
          return (
            <div key={act}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-0.5 flex-1" style={{ backgroundColor: actColor }} />
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black tracking-widest text-brutal-black/50 whitespace-nowrap">
                    {ACT_LABELS[act - 1]}
                  </span>
                  {actCompleted[act - 1] && (
                    <span className="text-[9px] font-black bg-brutal-black text-brutal-white px-1.5 py-0.5">
                      <span className="flex items-center gap-1">FILMED <Check size={9} strokeWidth={3} /></span>
                    </span>
                  )}
                </div>
                <div className="h-0.5 flex-1" style={{ backgroundColor: actColor }} />
              </div>

              {/* Film strip row */}
              <div className="bg-brutal-black/5 border border-brutal-black/10 px-3 py-2">
                <div className="flex flex-wrap gap-3">
                  {topics.map(topic => (
                    <SceneCard
                      key={topic}
                      topic={topic}
                      collectible={domain[topic]}
                      isUnlocked={completedTopics.includes(topic)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1 h-1 bg-brutal-black/5">
                  <div className="h-full" style={{ backgroundColor: actColor, width: `${(chCompleted / topics.length) * 100}%` }} />
                </div>
                <span className="text-[10px] font-black text-brutal-black/40">{chCompleted}/{topics.length} scenes</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Awards Shelf */}
      <div className="border-t-4 border-brutal-black px-5 py-4 bg-brutal-bg">
        <p className="text-xs font-black text-brutal-black/40 mb-3 tracking-wider">AWARDS SHELF</p>
        <div className="flex gap-6">
          {actCompleted.map((won, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-8 h-10">
                <AwardSVG isUnlocked={won} />
              </div>
              <span className={`text-[9px] font-black text-center ${won ? 'text-brutal-black' : 'text-brutal-black/25'}`}>
                Act {i + 1}
              </span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1 ml-auto">
            <svg viewBox="0 0 24 24" className="w-8 h-8 opacity-10">
              <rect x="2" y="4" width="20" height="16" rx="1" fill="black" />
              <polygon points="10,8 18,12 10,16" fill="white" />
            </svg>
            <span className="text-[9px] font-black text-brutal-black/25">PREMIERE</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-brutal-black px-5 py-2 flex items-center justify-between">
        <span className="text-xs font-black text-brutal-white/40">PRODUCTION PROGRESS</span>
        <span className="text-xs font-black text-brutal-white">{unlockedCount}/{allTopics.length} SCENES ({pct}%)</span>
      </div>
    </div>
  );
};

export default MoviesProgress;
