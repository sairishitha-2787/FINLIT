// GamingProgress — RPG Character Sheet progression view

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { COLLECTIBLES, CHAPTER_TOPICS } from '../../config/collectibles';
import CollectibleTooltip from './CollectibleTooltip';

// ── SVG Icons ─────────────────────────────────────────────────────────────────

const SwordSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <rect x="11" y="2" width="2" height="14" fill={color} />
    <rect x="7"  y="12" width="10" height="2" fill={color} />
    <polygon points="12,18 10,22 14,22" fill={color} />
  </svg>
);

const ShieldSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <path d="M12 2 L20 6 L20 14 C20 18 16 21 12 22 C8 21 4 18 4 14 L4 6 Z" fill={color} />
  </svg>
);

const PotionSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <rect x="9" y="2" width="6" height="4" fill={color} />
    <path d="M8 6 L5 11 L4 18 C4 20.2 6 22 8 22 L16 22 C18 22 20 20.2 20 18 L19 11 L16 6 Z" fill={color} />
    <rect x="9" y="2" width="6" height="2" fill={color} />
    <rect x="8" y="14" width="8" height="2" rx="1" fill="white" opacity="0.4" />
  </svg>
);

const StarSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill={color} />
  </svg>
);

const BadgeSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <circle cx="12" cy="10" r="8" fill={color} />
    <rect x="9" y="18" width="6" height="4" fill={color} />
    <polygon points="12,6 13.5,9.5 17,10 14.5,12.5 15,16 12,14 9,16 9.5,12.5 7,10 10.5,9.5" fill="white" opacity="0.6" />
  </svg>
);

const ChartSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <rect x="2"  y="16" width="4" height="6" fill={color} />
    <rect x="8"  y="10" width="4" height="12" fill={color} />
    <rect x="14" y="6"  width="4" height="16" fill={color} />
    <rect x="20" y="2"  width="2" height="20" fill={color} opacity="0.4" />
    <polyline points="4,15 10,9 16,5 22,1" stroke={color} strokeWidth="1.5" fill="none" />
  </svg>
);

const TowerSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <rect x="6" y="4" width="12" height="18" fill={color} />
    <rect x="4" y="2" width="16" height="4" fill={color} />
    <rect x="6"  y="2" width="2" height="4" fill="white" opacity="0.3" />
    <rect x="11" y="2" width="2" height="4" fill="white" opacity="0.3" />
    <rect x="16" y="2" width="2" height="4" fill="white" opacity="0.3" />
    <rect x="9"  y="14" width="6" height="8" fill="white" opacity="0.25" />
  </svg>
);

const GroupSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <circle cx="8"  cy="8"  r="4" fill={color} />
    <circle cx="16" cy="8"  r="4" fill={color} />
    <circle cx="12" cy="6"  r="3" fill={color} opacity="0.6" />
    <ellipse cx="8"  cy="19" rx="5" ry="3" fill={color} />
    <ellipse cx="16" cy="19" rx="5" ry="3" fill={color} />
  </svg>
);

const CrownSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <polygon points="2,8 7,14 12,4 17,14 22,8 20,20 4,20" fill={color} />
    <circle cx="2"  cy="8"  r="2" fill={color} />
    <circle cx="12" cy="4"  r="2" fill={color} />
    <circle cx="22" cy="8"  r="2" fill={color} />
  </svg>
);

const HammerSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <rect x="2" y="8" width="14" height="8" rx="1" fill={color} />
    <rect x="14" y="10" width="8" height="4" rx="1" fill={color} opacity="0.6" />
    <rect x="9" y="16" width="4" height="6" fill={color} />
  </svg>
);

const CastleSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <rect x="3"  y="10" width="18" height="12" fill={color} />
    <rect x="3"  y="6"  width="4"  height="6"  fill={color} />
    <rect x="10" y="6"  width="4"  height="6"  fill={color} />
    <rect x="17" y="6"  width="4"  height="6"  fill={color} />
    <rect x="3"  y="4"  width="4"  height="2"  fill={color} opacity="0.5" />
    <rect x="10" y="4"  width="4"  height="2"  fill={color} opacity="0.5" />
    <rect x="17" y="4"  width="4"  height="2"  fill={color} opacity="0.5" />
    <rect x="9"  y="16" width="6"  height="6"  fill="white" opacity="0.2" />
  </svg>
);

const CompassSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none" />
    <polygon points="12,4 10,12 12,11 14,12" fill={color} />
    <polygon points="12,20 14,12 12,13 10,12" fill={color} opacity="0.5" />
    <circle cx="12" cy="12" r="1.5" fill={color} />
  </svg>
);

const BranchSVG = ({ color = '#000' }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <circle cx="12" cy="4"  r="2.5" fill={color} />
    <circle cx="5"  cy="16" r="2.5" fill={color} />
    <circle cx="19" cy="16" r="2.5" fill={color} />
    <line x1="12" y1="6"  x2="5"  y2="14" stroke={color} strokeWidth="2" />
    <line x1="12" y1="6"  x2="19" y2="14" stroke={color} strokeWidth="2" />
    <line x1="12" y1="6"  x2="12" y2="20" stroke={color} strokeWidth="1.5" strokeDasharray="3,2" />
  </svg>
);

const ICON_MAP = {
  sword: SwordSVG, shield: ShieldSVG, potion: PotionSVG,
  badge: BadgeSVG, star: StarSVG,   chart: ChartSVG,
  tower: TowerSVG, group: GroupSVG,  crown: CrownSVG,
  hammer: HammerSVG, castle: CastleSVG, compass: CompassSVG, branch: BranchSVG,
};

// ── Lock SVG ─────────────────────────────────────────────────────────────────

const LockSVG = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <rect x="5" y="11" width="14" height="11" rx="1" fill="currentColor" opacity="0.3" />
    <path d="M8 11 V8 A4 4 0 0 1 16 8 V11" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
    <circle cx="12" cy="16" r="2" fill="currentColor" opacity="0.3" />
  </svg>
);

// ── Character SVG ─────────────────────────────────────────────────────────────

const CharacterSVG = ({ level = 1 }) => {
  const color = level >= 8 ? '#f472b6' : level >= 5 ? '#60a5fa' : '#4ade80';
  return (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      {/* Head */}
      <rect x="18" y="2" width="24" height="22" rx="2" fill={color} stroke="black" strokeWidth="2" />
      {/* Eyes */}
      <rect x="22" y="10" width="5" height="5" fill="black" />
      <rect x="33" y="10" width="5" height="5" fill="black" />
      {/* Body */}
      <rect x="10" y="26" width="40" height="28" rx="1" fill={color} stroke="black" strokeWidth="2" />
      {/* Armor detail */}
      {level >= 3 && <rect x="10" y="26" width="8" height="28" fill="black" opacity="0.2" />}
      {level >= 3 && <rect x="42" y="26" width="8" height="28" fill="black" opacity="0.2" />}
      {level >= 5 && <rect x="22" y="30" width="16" height="4" fill="black" opacity="0.25" />}
      {/* Legs */}
      <rect x="12" y="56" width="14" height="32" rx="1" fill={color} stroke="black" strokeWidth="2" />
      <rect x="34" y="56" width="14" height="32" rx="1" fill={color} stroke="black" strokeWidth="2" />
      {/* Level indicator */}
      {level >= 8 && (
        <>
          <polygon points="30,0 34,8 28,8" fill="#f472b6" stroke="black" strokeWidth="1" />
          <polygon points="30,0 26,8 32,8" fill="#f472b6" stroke="black" strokeWidth="1" />
        </>
      )}
    </svg>
  );
};

// ── Skill Node ────────────────────────────────────────────────────────────────

const SkillNode = ({ topic, collectible, isUnlocked, isNext }) => {
  const [hovered, setHovered] = useState(false);
  const IconCmp = ICON_MAP[collectible?.icon] || StarSVG;
  const chapterColors = { 1: '#4ade80', 2: '#60a5fa', 3: '#f472b6' };
  const chColor = chapterColors[collectible?.chapter] || '#4ade80';

  return (
    <div
      className="relative flex flex-col items-center gap-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        whileHover={isUnlocked ? { y: -3, scale: 1.08 } : { x: [0, -2, 2, -2, 0] }}
        transition={isUnlocked ? { type: 'spring', stiffness: 400 } : { duration: 0.3 }}
        className={`w-10 h-10 border-2 border-brutal-black flex items-center justify-center transition-all ${
          isUnlocked
            ? 'bg-brutal-black shadow-brutal-sm'
            : isNext
            ? 'bg-brutal-white border-dashed'
            : 'bg-brutal-bg opacity-40'
        }`}
        style={isUnlocked ? { borderColor: chColor, backgroundColor: chColor } : {}}
      >
        {isUnlocked
          ? <div className="w-5 h-5"><IconCmp color="black" /></div>
          : <div className="w-5 h-5 text-brutal-black/30"><LockSVG /></div>
        }
      </motion.div>
      <span className={`text-[9px] font-black text-center leading-tight max-w-[44px] ${isUnlocked ? 'text-brutal-black' : 'text-brutal-black/30'}`}>
        {collectible?.name?.split(' ').slice(0, 2).join(' ')}
      </span>
      <CollectibleTooltip
        visible={hovered}
        collectible={collectible}
        isUnlocked={isUnlocked}
        prerequisite={topic}
      />
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const CHAPTER_LABELS = ['TUTORIAL ISLAND', 'MAIN QUEST', 'ENDGAME CONTENT'];

const GamingProgress = ({ completedTopics = [] }) => {
  const domain = COLLECTIBLES.gaming;
  const allTopics = [...CHAPTER_TOPICS[1], ...CHAPTER_TOPICS[2], ...CHAPTER_TOPICS[3]];
  const unlockedCount = allTopics.filter(t => completedTopics.includes(t)).length;
  const level = Math.max(1, Math.floor(unlockedCount * 1.2) + 1);
  const pct = Math.round((unlockedCount / allTopics.length) * 100);

  return (
    <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal">
      {/* Header */}
      <div className="bg-brutal-black px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-brutal-green text-xs font-black tracking-widest">RPG CHARACTER SHEET</p>
          <h3 className="text-brutal-white font-black text-xl leading-tight">FINANCIAL WARRIOR</h3>
        </div>
        <div className="text-right">
          <p className="text-brutal-green font-black text-2xl">Lv.{level}</p>
          <p className="text-brutal-white/50 text-xs font-bold">{unlockedCount}/{allTopics.length} skills</p>
        </div>
      </div>

      {/* XP Bar */}
      <div className="bg-brutal-bg border-b-4 border-brutal-black px-5 py-2 flex items-center gap-3">
        <span className="text-xs font-black text-brutal-black/50 w-8">XP</span>
        <div className="flex-1 h-4 bg-brutal-black border-2 border-brutal-black">
          <motion.div
            className="h-full bg-brutal-green"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs font-black text-brutal-black/70 w-12 text-right">{pct}%</span>
      </div>

      {/* Content: character + skill tree */}
      <div className="flex flex-col md:flex-row gap-0">
        {/* Left — Character */}
        <div className="md:w-36 border-b-4 md:border-b-0 md:border-r-4 border-brutal-black p-4 flex flex-col items-center gap-3 bg-brutal-bg">
          <div className="w-24 h-32">
            <CharacterSVG level={level} />
          </div>
          <div className="w-full">
            <div className="text-xs font-black text-brutal-black/40 mb-1.5 tracking-wider text-center">STATS</div>
            {[
              { label: 'ATK', val: Math.min(100, unlockedCount * 9) },
              { label: 'DEF', val: Math.min(100, unlockedCount * 7) },
              { label: 'INT', val: Math.min(100, pct) },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black text-brutal-black/50 w-7">{label}</span>
                <div className="flex-1 h-2 bg-brutal-black/10 border border-brutal-black/20">
                  <motion.div
                    className="h-full bg-brutal-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Skill Tree */}
        <div className="flex-1 p-5">
          <div className="text-xs font-black text-brutal-black/40 mb-4 tracking-wider">SKILL TREE</div>
          {[1, 2, 3].map(ch => {
            const topics = CHAPTER_TOPICS[ch];
            const chCompleted = topics.filter(t => completedTopics.includes(t)).length;
            const nextIdx = topics.findIndex(t => !completedTopics.includes(t));
            return (
              <div key={ch} className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-0.5 flex-1 ${ch === 1 ? 'bg-brutal-green' : ch === 2 ? 'bg-brutal-blue' : 'bg-brutal-pink'}`} />
                  <span className="text-[9px] font-black text-brutal-black/40 tracking-widest whitespace-nowrap">
                    CH{ch}: {CHAPTER_LABELS[ch - 1]}
                  </span>
                  <div className={`h-0.5 flex-1 ${ch === 1 ? 'bg-brutal-green' : ch === 2 ? 'bg-brutal-blue' : 'bg-brutal-pink'}`} />
                </div>
                <div className="flex flex-wrap gap-3">
                  {topics.map((topic, i) => (
                    <SkillNode
                      key={topic}
                      topic={topic}
                      collectible={domain[topic]}
                      isUnlocked={completedTopics.includes(topic)}
                      isNext={i === nextIdx}
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-brutal-black/5">
                    <div
                      className={`h-full ${ch === 1 ? 'bg-brutal-green' : ch === 2 ? 'bg-brutal-blue' : 'bg-brutal-pink'}`}
                      style={{ width: `${(chCompleted / topics.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-brutal-black/40">{chCompleted}/{topics.length}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-brutal-bg border-t-4 border-brutal-black px-5 py-2 flex items-center justify-between">
        <span className="text-xs font-black text-brutal-black/40">COLLECTION PROGRESS</span>
        <span className="text-xs font-black text-brutal-black">{unlockedCount}/{allTopics.length} SKILLS UNLOCKED ({pct}%)</span>
      </div>
    </div>
  );
};

export default GamingProgress;
