// FoodProgress — Kitchen Pantry progression view

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { COLLECTIBLES, CHAPTER_TOPICS } from '../../config/collectibles';
import CollectibleTooltip from './CollectibleTooltip';

// ── Jar SVG ───────────────────────────────────────────────────────────────────

const JarSVG = ({ label, isUnlocked, color }) => (
  <svg viewBox="0 0 36 44" className="w-full h-full">
    {/* Lid */}
    <rect x="8" y="2" width="20" height="8" rx="2" fill={isUnlocked ? '#1f1f1f' : '#d1d5db'} />
    <rect x="10" y="0" width="16" height="4" rx="1" fill={isUnlocked ? '#333' : '#e5e7eb'} />
    {/* Jar body */}
    <path d="M6 10 L4 14 L4 38 C4 40 6 42 8 42 L28 42 C30 42 32 40 32 38 L32 14 L30 10 Z"
      fill={isUnlocked ? color : '#f3f4f6'}
      stroke="black"
      strokeWidth="1.5"
    />
    {/* Shine */}
    <rect x="8" y="16" width="4" height="12" rx="2" fill="white" opacity={isUnlocked ? 0.4 : 0.6} />
    {/* Label strip */}
    {isUnlocked && (
      <rect x="6" y="28" width="24" height="10" rx="1" fill="white" opacity="0.3" />
    )}
    {/* Lock */}
    {!isUnlocked && (
      <>
        <rect x="13" y="26" width="10" height="8" rx="1" fill="black" opacity="0.1" />
        <path d="M16 26 V24 A2 2 0 0 1 20 24 V26" stroke="black" strokeWidth="1.2" fill="none" opacity="0.2" />
      </>
    )}
  </svg>
);

// ── Michelin Star ─────────────────────────────────────────────────────────────

const MichelinStarSVG = ({ filled }) => (
  <svg viewBox="0 0 20 20" className="w-4 h-4">
    <polygon
      points="10,1 12.9,7 19.5,7 14.3,11.3 16.4,18 10,14 3.6,18 5.7,11.3 0.5,7 7.1,7"
      fill={filled ? '#f59e0b' : 'none'}
      stroke={filled ? '#f59e0b' : '#d1d5db'}
      strokeWidth="1.5"
    />
  </svg>
);

// ── Chef Hat SVG ──────────────────────────────────────────────────────────────

const ChefHatSVG = ({ level }) => {
  const colors = ['#e5e7eb', '#4ade80', '#60a5fa', '#f472b6'];
  const color = colors[Math.min(level, colors.length - 1)];
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <ellipse cx="20" cy="22" rx="16" ry="6" fill="black" opacity="0.15" />
      <rect x="8" y="20" width="24" height="12" rx="1" fill={color} stroke="black" strokeWidth="1.5" />
      <ellipse cx="20" cy="18" rx="14" ry="12" fill={color} stroke="black" strokeWidth="1.5" />
      <ellipse cx="20" cy="8"  rx="10" ry="8"  fill="white" opacity="0.3" />
      <rect x="12" y="20" width="4" height="12" fill="black" opacity="0.08" />
      <rect x="24" y="20" width="4" height="12" fill="black" opacity="0.08" />
    </svg>
  );
};

// ── Jar Card ──────────────────────────────────────────────────────────────────

const SHELF_COLORS = { 1: '#4ade80', 2: '#60a5fa', 3: '#f472b6' };

const JarCard = ({ topic, collectible, isUnlocked }) => {
  const [hovered, setHovered] = useState(false);
  const shelfColor = SHELF_COLORS[collectible?.shelf] || '#4ade80';

  return (
    <div
      className="relative flex flex-col items-center gap-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        whileHover={isUnlocked ? { y: -4 } : { x: [0,-2,2,-2,0] }}
        transition={isUnlocked ? { type:'spring', stiffness:400 } : { duration:0.3 }}
        className="w-9 h-11"
      >
        <JarSVG
          label={collectible?.name}
          isUnlocked={isUnlocked}
          color={shelfColor}
        />
      </motion.div>
      <span className={`text-[8px] font-black text-center leading-tight max-w-[40px] ${isUnlocked ? 'text-brutal-black' : 'text-brutal-black/25'}`}>
        {collectible?.name}
      </span>
      <CollectibleTooltip visible={hovered} collectible={collectible} isUnlocked={isUnlocked} prerequisite={topic} />
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const SHELF_LABELS = ['PANTRY ESSENTIALS', 'SIGNATURE TECHNIQUES', 'PREMIUM COLLECTION'];
const CHEF_LEVELS  = ['Sous Chef Trainee', 'Home Cook', 'Line Cook', 'Sous Chef', 'Head Chef', 'Executive Chef', 'Michelin Chef'];

const FoodProgress = ({ completedTopics = [] }) => {
  const domain = COLLECTIBLES.food;
  const allTopics = [...CHAPTER_TOPICS[1], ...CHAPTER_TOPICS[2], ...CHAPTER_TOPICS[3]];
  const unlockedCount = allTopics.filter(t => completedTopics.includes(t)).length;
  const pct = Math.round((unlockedCount / allTopics.length) * 100);

  const chefLevelIdx = Math.min(Math.floor(unlockedCount / 2), CHEF_LEVELS.length - 1);
  const chefLevel = CHEF_LEVELS[chefLevelIdx];
  const stars = Math.min(5, Math.floor(unlockedCount / 3));

  return (
    <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal">
      {/* Header */}
      <div className="bg-brutal-black px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-brutal-green text-xs font-black tracking-widest">FINANCIAL KITCHEN</p>
          <h3 className="text-brutal-white font-black text-xl leading-tight">YOUR PANTRY</h3>
        </div>
        <div className="text-right">
          <div className="flex gap-0.5 justify-end mb-1">
            {[1,2,3,4,5].map(n => <MichelinStarSVG key={n} filled={n <= stars} />)}
          </div>
          <p className="text-brutal-white/50 text-xs font-bold">{chefLevel}</p>
        </div>
      </div>

      {/* Chef + progress */}
      <div className="bg-brutal-bg border-b-4 border-brutal-black px-5 py-2 flex items-center gap-4">
        <div className="w-10 h-10 flex-shrink-0">
          <ChefHatSVG level={chefLevelIdx} />
        </div>
        <div className="flex-1 flex items-center gap-3">
          <span className="text-xs font-black text-brutal-black/50 whitespace-nowrap">PANTRY FILLED</span>
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
      </div>

      {/* Shelves */}
      <div className="p-5 space-y-5">
        {[1, 2, 3].map(shelf => {
          const topics = CHAPTER_TOPICS[shelf];
          const shelfColor = SHELF_COLORS[shelf];
          const shelfDone = topics.filter(t => completedTopics.includes(t)).length;
          return (
            <div key={shelf}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-black tracking-widest text-brutal-black/50">{SHELF_LABELS[shelf - 1]}</span>
                <div className="h-0.5 flex-1" style={{ backgroundColor: shelfColor, opacity: 0.4 }} />
                <span className="text-[9px] font-black text-brutal-black/40">{shelfDone}/{topics.length}</span>
              </div>

              {/* Shelf board */}
              <div className="relative">
                <div className="flex gap-3 items-end px-2 pb-2 min-h-[88px]">
                  {topics.map(topic => (
                    <JarCard
                      key={topic}
                      topic={topic}
                      collectible={domain[topic]}
                      isUnlocked={completedTopics.includes(topic)}
                    />
                  ))}
                </div>
                {/* Shelf plank */}
                <div className="h-2 bg-brutal-black border-t-2 border-brutal-black/40" style={{ backgroundColor: '#8B6914', opacity: 0.5 }} />
                <div className="h-1 bg-brutal-black/20" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe teaser */}
      {unlockedCount >= 3 && (
        <div className="border-t-4 border-brutal-black px-5 py-3 bg-brutal-bg">
          <p className="text-xs font-black text-brutal-black/40 mb-2 tracking-wider">RECIPES UNLOCKED</p>
          <div className="flex gap-2 flex-wrap">
            {unlockedCount >= 3  && <span className="text-xs font-black bg-brutal-green border-2 border-brutal-black px-2 py-1 flex items-center gap-1">Basic Soup <MichelinStarSVG filled /></span>}
            {unlockedCount >= 6  && <span className="text-xs font-black bg-brutal-blue  border-2 border-brutal-black px-2 py-1 text-brutal-white flex items-center gap-1">Signature Dish <MichelinStarSVG filled /><MichelinStarSVG filled /></span>}
            {unlockedCount >= 10 && <span className="text-xs font-black bg-brutal-pink  border-2 border-brutal-black px-2 py-1 flex items-center gap-1">Michelin Menu <MichelinStarSVG filled /><MichelinStarSVG filled /><MichelinStarSVG filled /></span>}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-brutal-bg border-t-4 border-brutal-black px-5 py-2 flex items-center justify-between">
        <span className="text-xs font-black text-brutal-black/40">PANTRY STOCK</span>
        <span className="text-xs font-black text-brutal-black">{unlockedCount}/{allTopics.length} INGREDIENTS ({pct}%)</span>
      </div>
    </div>
  );
};

export default FoodProgress;
