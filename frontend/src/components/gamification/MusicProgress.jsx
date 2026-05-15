// MusicProgress — Orchestra Building progression view

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Play, Circle } from 'lucide-react';
import { COLLECTIBLES, CHAPTER_TOPICS } from '../../config/collectibles';
import CollectibleTooltip from './CollectibleTooltip';

// ── Instrument SVGs ───────────────────────────────────────────────────────────

const ViolinSVG = ({ color }) => (
  <svg viewBox="0 0 24 40" className="w-full h-full">
    <path d="M12 2 C8 2 5 5 5 8 C5 11 7 13 7 16 C7 19 4 22 4 26 C4 32 8 38 12 38 C16 38 20 32 20 26 C20 22 17 19 17 16 C17 13 19 11 19 8 C19 5 16 2 12 2 Z"
      fill={color} stroke="black" strokeWidth="1.5" />
    <line x1="12" y1="4" x2="12" y2="36" stroke="black" strokeWidth="1" opacity="0.4" />
    <ellipse cx="12" cy="16" rx="4" ry="3" fill="black" opacity="0.15" />
    <ellipse cx="12" cy="26" rx="5" ry="4" fill="black" opacity="0.15" />
  </svg>
);

const CelloSVG = ({ color }) => (
  <svg viewBox="0 0 28 44" className="w-full h-full">
    <path d="M14 2 C9 2 5 6 5 10 C5 14 8 16 8 20 C8 24 4 28 4 33 C4 40 9 44 14 44 C19 44 24 40 24 33 C24 28 20 24 20 20 C20 16 23 14 23 10 C23 6 19 2 14 2 Z"
      fill={color} stroke="black" strokeWidth="1.5" />
    <line x1="14" y1="2" x2="14" y2="44" stroke="black" strokeWidth="0.8" opacity="0.3" />
    <rect x="12" y="0" width="4" height="4" rx="0.5" fill="black" opacity="0.5" />
    <line x1="8"  y1="2"  x2="20" y2="2"  stroke="black" strokeWidth="0.8" opacity="0.4" />
  </svg>
);

const FluteSVG = ({ color }) => (
  <svg viewBox="0 0 8 44" className="w-full h-full">
    <rect x="2" y="2" width="4" height="40" rx="2" fill={color} stroke="black" strokeWidth="1" />
    <circle cx="4" cy="8"  r="1.5" fill="black" opacity="0.5" />
    <circle cx="4" cy="14" r="1.5" fill="black" opacity="0.4" />
    <circle cx="4" cy="20" r="1.5" fill="black" opacity="0.4" />
    <circle cx="4" cy="26" r="1.5" fill="black" opacity="0.4" />
    <circle cx="4" cy="32" r="1.5" fill="black" opacity="0.4" />
    <ellipse cx="4" cy="5" rx="3" ry="2" fill={color} stroke="black" strokeWidth="1" />
  </svg>
);

const TrumpetSVG = ({ color }) => (
  <svg viewBox="0 0 44 24" className="w-full h-full">
    <path d="M2 12 L28 10 L34 8 L40 10 L42 18 L36 22 L30 16 L28 14 L2 14 Z"
      fill={color} stroke="black" strokeWidth="1.5" />
    <circle cx="38" cy="15" r="6" fill={color} stroke="black" strokeWidth="1.5" />
    <rect x="2" y="10" width="12" height="4" rx="2" fill={color} stroke="black" strokeWidth="1" />
    <circle cx="14" cy="8"  r="3" fill={color} stroke="black" strokeWidth="1" />
    <circle cx="20" cy="8"  r="3" fill={color} stroke="black" strokeWidth="1" />
    <circle cx="26" cy="8"  r="3" fill={color} stroke="black" strokeWidth="1" />
  </svg>
);

const TromboneSVG = ({ color }) => (
  <svg viewBox="0 0 44 20" className="w-full h-full">
    <path d="M2 4 L32 4 L32 8 L36 8 L40 10 L42 14 L36 18 L32 14 L32 10 L28 10 L28 14 L2 14 Z"
      fill={color} stroke="black" strokeWidth="1.5" />
    <rect x="2" y="8" width="8" height="2" fill={color} stroke="black" strokeWidth="1" />
    <rect x="2" y="6" width="4" height="6" rx="1" fill="black" opacity="0.2" />
  </svg>
);

const FrenchHornSVG = ({ color }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M8 8 C8 4 12 2 16 4 L30 10 L32 20 L24 28 L16 26 C10 24 6 20 6 16 L6 16 C4 12 6 10 8 8 Z"
      fill={color} stroke="black" strokeWidth="1.5" />
    <circle cx="28" cy="30" r="8" fill={color} stroke="black" strokeWidth="1.5" />
    <circle cx="28" cy="30" r="4" fill="black" opacity="0.2" />
  </svg>
);

const TimpaniSVG = ({ color }) => (
  <svg viewBox="0 0 40 30" className="w-full h-full">
    <ellipse cx="20" cy="12" rx="18" ry="10" fill={color} stroke="black" strokeWidth="1.5" />
    <ellipse cx="20" cy="10" rx="16" ry="8"  fill="black" opacity="0.2" />
    <path d="M2 12 L2 24 C2 26 10 28 20 28 C30 28 38 26 38 24 L38 12" fill={color} stroke="black" strokeWidth="1.5" />
  </svg>
);

const SnareSVG = ({ color }) => (
  <svg viewBox="0 0 40 20" className="w-full h-full">
    <ellipse cx="20" cy="8"  rx="18" ry="8"  fill={color} stroke="black" strokeWidth="1.5" />
    <ellipse cx="20" cy="6"  rx="16" ry="6"  fill="black" opacity="0.15" />
    <path d="M2 8 L2 16 C2 18 10 20 20 20 C30 20 38 18 38 16 L38 8" fill={color} stroke="black" strokeWidth="1.5" />
    <line x1="4"  y1="14" x2="36" y2="14" stroke="black" strokeWidth="0.8" opacity="0.4" />
  </svg>
);

const ConductorSVG = ({ color }) => (
  <svg viewBox="0 0 40 44" className="w-full h-full">
    <circle cx="20" cy="10" r="8" fill={color} stroke="black" strokeWidth="1.5" />
    <rect x="12" y="18" width="16" height="18" rx="1" fill={color} stroke="black" strokeWidth="1.5" />
    <rect x="4"  y="20" width="8"  height="12" rx="1" fill={color} stroke="black" strokeWidth="1.5" />
    <rect x="28" y="20" width="8"  height="12" rx="1" fill={color} stroke="black" strokeWidth="1.5" />
    <rect x="14" y="36" width="6"  height="8"  rx="1" fill={color} stroke="black" strokeWidth="1.5" />
    <rect x="20" y="36" width="6"  height="8"  rx="1" fill={color} stroke="black" strokeWidth="1.5" />
    <line x1="32" y1="20" x2="40" y2="8" stroke={color} strokeWidth="2" />
    <line x1="38" y1="12" x2="42" y2="6" stroke="black" strokeWidth="1.5" />
  </svg>
);

const LockMusician = () => (
  <svg viewBox="0 0 24 44" className="w-full h-full">
    <circle cx="12" cy="8" r="6" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
    <rect x="5" y="14" width="14" height="20" rx="1" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
    <rect x="8" y="28" width="4" height="10" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
    <rect x="12" y="28" width="4" height="10" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
    <rect x="9" y="22" width="6" height="5" rx="0.5" fill="black" opacity="0.1" />
    <path d="M11 22 V20 A1.5 1.5 0 0 1 13 20 V22" stroke="black" strokeWidth="1" fill="none" opacity="0.2" />
  </svg>
);

const INSTRUMENT_MAP = {
  'First Violin':  ViolinSVG,
  'Second Violin': ViolinSVG,
  'Cello':         CelloSVG,
  'Viola':         ViolinSVG,
  'Flute':         FluteSVG,
  'Clarinet':      FluteSVG,
  'Oboe':          FluteSVG,
  'Trumpet':       TrumpetSVG,
  'Trombone':      TromboneSVG,
  'French Horn':   FrenchHornSVG,
  'Timpani':       TimpaniSVG,
  'Snare Drum':    SnareSVG,
  'Conductor':     ConductorSVG,
};

// ── Musician Card ─────────────────────────────────────────────────────────────

const SECTION_COLORS = { strings: '#4ade80', woodwinds: '#60a5fa', brass: '#f59e0b', percussion: '#f472b6', conductor: '#a78bfa' };

const MusicianCard = ({ topic, collectible, isUnlocked }) => {
  const [hovered, setHovered] = useState(false);
  const color = SECTION_COLORS[collectible?.section] || '#4ade80';
  const InstrumentCmp = INSTRUMENT_MAP[collectible?.name] || ViolinSVG;

  return (
    <div
      className="relative flex flex-col items-center gap-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        whileHover={isUnlocked ? { y: -4 } : { x: [0,-2,2,-2,0] }}
        transition={isUnlocked ? { type:'spring', stiffness:400 } : { duration:0.3 }}
        className="w-8 h-12"
      >
        {isUnlocked
          ? <InstrumentCmp color={color} />
          : <LockMusician />
        }
      </motion.div>
      <span className={`text-[8px] font-black text-center leading-tight max-w-[40px] ${isUnlocked ? 'text-brutal-black' : 'text-brutal-black/25'}`}>
        {collectible?.name?.split(' ').slice(-1)[0]}
      </span>
      <CollectibleTooltip visible={hovered} collectible={collectible} isUnlocked={isUnlocked} prerequisite={topic} />
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const SECTION_GROUPS = [
  { key: 'strings',    label: 'STRINGS',    topics: ['Budgeting Basics','Saving Money','Emergency Fund','Credit Scores'] },
  { key: 'woodwinds',  label: 'WOODWINDS',  topics: ['Compound Interest','Investing Basics','Stock Market'] },
  { key: 'brass',      label: 'BRASS',      topics: ['Risk Management','Diversification','Retirement Planning'] },
  { key: 'percussion', label: 'PERCUSSION', topics: ['Tax Optimization','Real Estate'] },
  { key: 'conductor',  label: 'CONDUCTOR',  topics: ['Portfolio Rebalancing'] },
];

const MOVEMENT_LABELS = ['Movement I — Allegro', 'Movement II — Andante', 'Movement III — Finale'];

const MusicProgress = ({ completedTopics = [] }) => {
  const domain = COLLECTIBLES.music;
  const allTopics = [...CHAPTER_TOPICS[1], ...CHAPTER_TOPICS[2], ...CHAPTER_TOPICS[3]];
  const unlockedCount = allTopics.filter(t => completedTopics.includes(t)).length;
  const pct = Math.round((unlockedCount / allTopics.length) * 100);

  const titles = ['Audience Member','Apprentice Musician','Section Player','First Chair','Principal','Concert Master','Composer','Conductor','Maestro'];
  const titleIdx = Math.min(Math.floor(unlockedCount / 1.6), titles.length - 1);

  const movementDone = [1,2,3].map(ch => CHAPTER_TOPICS[ch].every(t => completedTopics.includes(t)));
  const currentMovement = movementDone[2] ? 3 : movementDone[1] ? 2 : movementDone[0] ? 2 : 1;

  return (
    <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal">
      {/* Header */}
      <div className="bg-brutal-black px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-brutal-blue text-xs font-black tracking-widest">FINANCIAL ORCHESTRA</p>
          <h3 className="text-brutal-white font-black text-xl leading-tight">YOUR SYMPHONY</h3>
        </div>
        <div className="text-right">
          <p className="text-brutal-white font-black text-sm">{titles[titleIdx]}</p>
          <p className="text-brutal-white/50 text-xs font-bold">{unlockedCount}/{allTopics.length} musicians</p>
        </div>
      </div>

      {/* Movement progress */}
      <div className="bg-brutal-bg border-b-4 border-brutal-black px-5 py-3">
        <p className="text-[9px] font-black text-brutal-black/40 mb-2 tracking-widest">SYMPHONY MOVEMENTS</p>
        <div className="flex gap-3">
          {MOVEMENT_LABELS.map((label, i) => {
            const done = movementDone[i];
            const active = (i + 1) === currentMovement && !done;
            return (
              <div key={i} className={`flex-1 border-2 p-2 ${done ? 'bg-brutal-green border-brutal-black' : active ? 'bg-brutal-blue border-brutal-black' : 'bg-brutal-bg border-brutal-black/20'}`}>
                <p className={`text-[9px] font-black ${done || active ? 'text-brutal-black' : 'text-brutal-black/30'}`}>
                  <span className="flex items-center gap-1">
                    {done ? <Check size={9} strokeWidth={3} /> : active ? <Play size={9} strokeWidth={2.5} fill="currentColor" /> : <Circle size={9} strokeWidth={2} />}
                    {label.split('—')[0].trim()}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1 h-3 bg-brutal-black border-2 border-brutal-black">
            <motion.div
              className="h-full bg-brutal-blue"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs font-black text-brutal-black/70">{pct}% complete</span>
        </div>
      </div>

      {/* Orchestra sections */}
      <div className="p-5 space-y-4">
        {SECTION_GROUPS.map(({ key, label, topics }) => {
          const sectionColor = SECTION_COLORS[key];
          const sectionDone = topics.filter(t => completedTopics.includes(t)).length;
          const sectionComplete = sectionDone === topics.length;
          return (
            <div key={key}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 border-2 border-brutal-black" style={{ backgroundColor: sectionColor, opacity: sectionComplete ? 1 : 0.4 }} />
                <span className="text-[9px] font-black tracking-widest text-brutal-black/50">{label}</span>
                {sectionComplete && <span className="flex items-center gap-1 text-[9px] font-black bg-brutal-black text-brutal-white px-1.5 py-0.5">COMPLETE <Check size={9} strokeWidth={3} /></span>}
                <div className="h-0.5 flex-1" style={{ backgroundColor: sectionColor, opacity: 0.3 }} />
                <span className="text-[9px] font-black text-brutal-black/40">{sectionDone}/{topics.length}</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {topics.map(topic => (
                  <MusicianCard
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

      {/* Musical note decoration + footer */}
      <div className="bg-brutal-bg border-t-4 border-brutal-black px-5 py-2 flex items-center justify-between">
        <span className="text-xs font-black text-brutal-black/40">ORCHESTRA SIZE</span>
        <span className="text-xs font-black text-brutal-black">{unlockedCount}/{allTopics.length} MUSICIANS SEATED ({pct}%)</span>
      </div>
    </div>
  );
};

export default MusicProgress;
