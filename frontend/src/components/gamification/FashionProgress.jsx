// FashionProgress — Wardrobe Collection progression view

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { COLLECTIBLES, CHAPTER_TOPICS } from '../../config/collectibles';
import CollectibleTooltip from './CollectibleTooltip';

// ── Garment SVGs ──────────────────────────────────────────────────────────────

const TeeSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M8 6 L0 14 L8 18 L8 36 L32 36 L32 18 L40 14 L32 6 L26 10 C24 12 16 12 14 10 Z" fill={color} stroke="black" strokeWidth="1.5" />
  </svg>
);

const PantsSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M4 4 L36 4 L36 10 L28 10 L28 36 L22 36 L20 18 L18 36 L12 36 L12 10 L4 10 Z" fill={color} stroke="black" strokeWidth="1.5" />
  </svg>
);

const JacketSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M6 4 L0 12 L8 16 L8 36 L32 36 L32 16 L40 12 L34 4 L28 8 L22 4 L18 4 L12 8 Z" fill={color} stroke="black" strokeWidth="1.5" />
    <line x1="20" y1="4" x2="20" y2="36" stroke="black" strokeWidth="1.5" />
    <rect x="22" y="18" width="4" height="2" rx="0.5" fill="black" opacity="0.3" />
    <rect x="22" y="24" width="4" height="2" rx="0.5" fill="black" opacity="0.3" />
  </svg>
);

const SneakerSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M4 24 L10 16 L20 14 L32 16 L36 22 L36 28 L4 28 Z" fill={color} stroke="black" strokeWidth="1.5" />
    <path d="M4 28 L36 28 L36 32 L4 32 Z" fill="black" opacity="0.7" />
    <path d="M14 20 L22 18" stroke="white" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

const WatchSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <rect x="16" y="4"  width="8" height="6" fill={color} stroke="black" strokeWidth="1.5" />
    <rect x="16" y="30" width="8" height="6" fill={color} stroke="black" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="10" fill={color} stroke="black" strokeWidth="2" />
    <line x1="20" y1="14" x2="20" y2="20" stroke="black" strokeWidth="1.5" />
    <line x1="20" y1="20" x2="25" y2="22" stroke="black" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="1.5" fill="black" />
  </svg>
);

const BagSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M14 10 C14 6 18 4 20 4 C22 4 26 6 26 10" stroke={color} strokeWidth="2.5" fill="none" />
    <rect x="6" y="10" width="28" height="26" rx="1" fill={color} stroke="black" strokeWidth="1.5" />
    <rect x="6" y="10" width="28" height="6"  rx="1" fill="black" opacity="0.2" />
    <rect x="16" y="22" width="8" height="4" rx="0.5" fill="black" opacity="0.3" />
  </svg>
);

const BlazerSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M8 4 L4 12 L10 18 L10 36 L30 36 L30 18 L36 12 L32 4 L26 8 L22 4 L18 4 L14 8 Z" fill={color} stroke="black" strokeWidth="1.5" />
    <line x1="20" y1="4" x2="20" y2="36" stroke="black" strokeWidth="1.5" />
    <path d="M20 4 L18 16 L14 18 L12 14 Z" fill="black" opacity="0.15" />
    <path d="M20 4 L22 16 L26 18 L28 14 Z" fill="black" opacity="0.15" />
    <rect x="8" y="18" width="5" height="5" rx="1" fill="black" opacity="0.3" />
  </svg>
);

const BeltSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <rect x="2" y="14" width="36" height="12" rx="1" fill={color} stroke="black" strokeWidth="1.5" />
    <rect x="16" y="16" width="8" height="8" fill="black" opacity="0.7" />
    <rect x="17" y="18" width="6" height="4" fill={color} opacity="0.8" />
  </svg>
);

const CapsuleSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <rect x="2"  y="10" width="10" height="20" rx="1" fill={color} stroke="black" strokeWidth="1.5" />
    <rect x="15" y="6"  width="10" height="28" rx="1" fill={color} stroke="black" strokeWidth="1.5" opacity="0.8" />
    <rect x="28" y="12" width="10" height="16" rx="1" fill={color} stroke="black" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

const GownSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M14 2 L26 2 L24 14 L28 38 L12 38 L16 14 Z" fill={color} stroke="black" strokeWidth="1.5" />
    <path d="M16 14 L12 38 L8 38 L14 14 Z" fill={color} stroke="black" strokeWidth="1" opacity="0.6" />
    <path d="M24 14 L28 38 L32 38 L26 14 Z" fill={color} stroke="black" strokeWidth="1" opacity="0.6" />
    <rect x="14" y="2" width="12" height="6" rx="0.5" fill="black" opacity="0.15" />
  </svg>
);

const LimitedSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M8 4 L2 12 L8 16 L8 36 L32 36 L32 16 L38 12 L32 4 Z" fill={color} stroke="black" strokeWidth="1.5" />
    <polygon points="20,10 22,16 28,16 23,20 25,26 20,22 15,26 17,20 12,16 18,16" fill="black" opacity="0.3" />
    <rect x="6"  y="36" width="8"  height="3" fill="black" opacity="0.5" />
    <rect x="26" y="36" width="8"  height="3" fill="black" opacity="0.5" />
  </svg>
);

const CoatSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M6 2 L2 12 L10 18 L10 38 L30 38 L30 18 L38 12 L34 2 L28 6 L22 2 L18 2 L12 6 Z" fill={color} stroke="black" strokeWidth="1.5" />
    <line x1="20" y1="2" x2="20" y2="38" stroke="black" strokeWidth="1.5" />
    <rect x="10" y="20" width="4" height="4" rx="1" fill="black" opacity="0.3" />
    <rect x="10" y="26" width="4" height="4" rx="1" fill="black" opacity="0.3" />
    <path d="M2 12 L10 18" stroke="black" strokeWidth="1" opacity="0.4" />
    <path d="M38 12 L30 18" stroke="black" strokeWidth="1" opacity="0.4" />
  </svg>
);

const FullSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M10 2 L30 2 L28 10 L32 10 L32 24 L28 24 L28 38 L12 38 L12 24 L8 24 L8 10 L12 10 Z" fill={color} stroke="black" strokeWidth="1.5" />
    <polygon points="20,4 22,8 26,8 23,11 24,15 20,12 16,15 17,11 14,8 18,8" fill="black" opacity="0.25" />
  </svg>
);

const GARMENT_MAP = {
  tee: TeeSVG, pants: PantsSVG, jacket: JacketSVG, sneaker: SneakerSVG,
  watch: WatchSVG, bag: BagSVG, blazer: BlazerSVG, belt: BeltSVG, capsule: CapsuleSVG,
  gown: GownSVG, limited: LimitedSVG, coat: CoatSVG, full: FullSVG,
};

const LockSVG = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <rect x="5" y="11" width="14" height="11" rx="1" fill="currentColor" opacity="0.25" />
    <path d="M8 11 V8 A4 4 0 0 1 16 8 V11" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
  </svg>
);

// ── Garment Card ──────────────────────────────────────────────────────────────

const TIER_COLORS = { basics: '#4ade80', statement: '#60a5fa', luxury: '#f472b6' };

const GarmentCard = ({ topic, collectible, isUnlocked }) => {
  const [hovered, setHovered] = useState(false);
  const GarmentCmp = GARMENT_MAP[collectible?.shape] || TeeSVG;
  const tierColor = TIER_COLORS[collectible?.tier] || '#4ade80';

  return (
    <div
      className="relative flex flex-col items-center gap-1.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hanger hook */}
      <div
        className="w-0.5 h-3"
        style={{ backgroundColor: isUnlocked ? 'black' : '#d1d5db' }}
      />
      {/* Hanger bar */}
      <div
        className="w-12 h-0.5"
        style={{ backgroundColor: isUnlocked ? 'black' : '#d1d5db' }}
      />

      {/* Garment */}
      <motion.div
        whileHover={isUnlocked ? { y: -4 } : { x: [0,-2,2,-2,0] }}
        transition={isUnlocked ? { type:'spring', stiffness:400 } : { duration:0.3 }}
        className={`w-12 h-12 flex items-center justify-center ${!isUnlocked ? 'opacity-25 grayscale' : ''}`}
      >
        {isUnlocked
          ? <GarmentCmp color={tierColor} />
          : <div className="text-brutal-black"><LockSVG /></div>
        }
      </motion.div>

      <span className={`text-[9px] font-black text-center leading-tight max-w-[52px] ${isUnlocked ? 'text-brutal-black' : 'text-brutal-black/25'}`}>
        {collectible?.name}
      </span>

      <CollectibleTooltip visible={hovered} collectible={collectible} isUnlocked={isUnlocked} prerequisite={topic} />
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const TIER_LABELS = { basics: 'BASICS COLLECTION', statement: 'STATEMENT PIECES', luxury: 'LUXURY COLLECTION' };
const TIERS = ['basics', 'statement', 'luxury'];

const FashionProgress = ({ completedTopics = [] }) => {
  const domain = COLLECTIBLES.fashion;
  const allTopics = [...CHAPTER_TOPICS[1], ...CHAPTER_TOPICS[2], ...CHAPTER_TOPICS[3]];
  const unlockedCount = allTopics.filter(t => completedTopics.includes(t)).length;
  const pct = Math.round((unlockedCount / allTopics.length) * 100);

  const styleLevels = ['Wardrobe Starter', 'Basics Curator', 'Style Enthusiast', 'Statement Dresser', 'Fashion Editor', 'Style Icon', 'Fashion Director', 'Iconic'];
  const styleLevel = styleLevels[Math.min(Math.floor(unlockedCount / 2), styleLevels.length - 1)];

  return (
    <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal">
      {/* Header */}
      <div className="bg-brutal-black px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-brutal-pink text-xs font-black tracking-widest">WARDROBE COLLECTION</p>
          <h3 className="text-brutal-white font-black text-xl leading-tight">YOUR FINANCIAL WARDROBE</h3>
        </div>
        <div className="text-right">
          <p className="text-brutal-pink font-black text-sm">{styleLevel}</p>
          <p className="text-brutal-white/50 text-xs font-bold">{unlockedCount}/{allTopics.length} pieces</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-brutal-bg border-b-4 border-brutal-black px-5 py-2 flex items-center gap-3">
        <span className="text-xs font-black text-brutal-black/50">COLLECTION</span>
        <div className="flex-1 h-4 bg-brutal-black border-2 border-brutal-black">
          <motion.div
            className="h-full bg-brutal-pink"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs font-black text-brutal-black/70">{pct}%</span>
      </div>

      {/* Wardrobe tiers */}
      <div className="p-5 space-y-6">
        {TIERS.map((tier, ti) => {
          const tierTopics = allTopics.filter(t => domain[t]?.tier === tier);
          const tierColor = TIER_COLORS[tier];
          const tierComplete = tierTopics.every(t => completedTopics.includes(t));
          return (
            <div key={tier}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-0.5 flex-1" style={{ backgroundColor: tierColor }} />
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black tracking-widest text-brutal-black/50">
                    {TIER_LABELS[tier]}
                  </span>
                  {tierComplete && (
                    <span className="text-[9px] font-black bg-brutal-black text-brutal-white px-1.5 py-0.5">
                      <span className="flex items-center gap-1">COMPLETE <Check size={9} strokeWidth={3} /></span>
                    </span>
                  )}
                </div>
                <div className="h-0.5 flex-1" style={{ backgroundColor: tierColor }} />
              </div>

              {/* Rack bar */}
              <div className="relative flex items-end justify-center gap-4 px-2">
                {/* Rack pole */}
                <div className="absolute top-0 left-4 right-4 h-1 bg-brutal-black/20 border border-brutal-black/10" />
                {tierTopics.map(topic => (
                  <GarmentCard
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

      {/* Footer */}
      <div className="bg-brutal-bg border-t-4 border-brutal-black px-5 py-2 flex items-center justify-between">
        <span className="text-xs font-black text-brutal-black/40">TOTAL COLLECTION</span>
        <span className="text-xs font-black text-brutal-black">{unlockedCount}/{allTopics.length} PIECES COLLECTED ({pct}%)</span>
      </div>
    </div>
  );
};

export default FashionProgress;
