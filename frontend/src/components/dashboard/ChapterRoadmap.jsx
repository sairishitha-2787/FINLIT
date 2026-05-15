// FINLIT — Chapter Roadmap
// Horizontal campaign timeline: 3 chapter nodes with expandable detail panels

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, TrendingUp, Crown,
  CheckCircle, Zap, Lock, ArrowRight, Check, ChevronDown, Map,
} from 'lucide-react';
import { getChapterProgress, getDomainPath } from '../../services/chapterService';
import { useUser } from '../../context/UserContext';

const CHAPTER_ICONS = [BookOpen, TrendingUp, Crown];

const DIFF_STYLE = {
  beginner:     'bg-brutal-green   text-brutal-black border-brutal-green',
  intermediate: 'bg-brutal-white   text-brutal-black border-brutal-black',
  advanced:     'bg-brutal-pink    text-brutal-black border-brutal-pink',
};

// ── ChapterRoadmap ────────────────────────────────────────────────────────────

const ChapterRoadmap = ({ domain, onStartTopic }) => {
  const { completedTopics } = useUser();
  const userInteracted = useRef(false);
  const [expandedIdx, setExpandedIdx] = useState(null);

  const path = getDomainPath(domain);
  if (!path) return null;

  const chapters = getChapterProgress(completedTopics, domain);
  if (!chapters) return null;

  const activeIdx = chapters.findIndex(
    c => c.status === 'in_progress' || c.status === 'available'
  );

  // Before the user clicks anything, auto-open the active chapter
  const displayIdx = !userInteracted.current && expandedIdx === null
    ? (activeIdx >= 0 ? activeIdx : null)
    : expandedIdx;

  const handleNodeClick = (idx) => {
    if (chapters[idx].status === 'locked') return;
    userInteracted.current = true;
    setExpandedIdx(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal p-5 rounded-none">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-xl font-black text-brutal-black leading-none">{path.campaignTitle}</h3>
          <p className="text-brutal-black/50 text-xs font-bold mt-1">{path.tagline}</p>
        </div>
        <div className="bg-brutal-blue border-2 border-brutal-black px-2 py-1 flex items-center gap-1 shrink-0">
          <Map size={11} strokeWidth={2.5} className="text-brutal-white" />
          <span className="text-[10px] font-black text-brutal-white uppercase tracking-wider">PATH</span>
        </div>
      </div>

      {/* Node row */}
      <div className="flex items-start">
        {chapters.map((chapter, idx) => {
          const ChIcon = CHAPTER_ICONS[idx] || BookOpen;
          const isLocked    = chapter.status === 'locked';
          const isComplete  = chapter.status === 'completed';
          const isActive    = chapter.status === 'in_progress';
          const isExpanded  = displayIdx === idx;

          const nodeBg = isLocked
            ? 'bg-brutal-bg border-brutal-black/25 opacity-50 cursor-default'
            : isComplete
              ? 'bg-brutal-green border-brutal-black cursor-pointer'
              : isActive
                ? 'bg-brutal-blue border-brutal-black cursor-pointer'
                : 'bg-brutal-white border-brutal-black cursor-pointer';

          return (
            <React.Fragment key={chapter.id}>
              {/* Node + label column */}
              <div className="flex flex-col items-center min-w-[72px]">
                <motion.button
                  whileHover={!isLocked ? { scale: 1.07 } : {}}
                  whileTap={!isLocked ? { scale: 0.93 } : {}}
                  onClick={() => handleNodeClick(idx)}
                  className={`w-14 h-14 border-4 rounded-none flex flex-col items-center justify-center gap-0.5 transition-shadow ${nodeBg} ${!isLocked ? 'shadow-brutal-sm hover:shadow-brutal' : ''}`}
                >
                  {isLocked
                    ? <Lock size={18} strokeWidth={2.5} className="text-brutal-black/30" />
                    : isComplete
                      ? <CheckCircle size={20} strokeWidth={2.5} className="text-brutal-black" />
                      : isActive
                        ? <Zap size={20} strokeWidth={2.5} className="text-brutal-white" />
                        : <ChIcon size={20} strokeWidth={2} className="text-brutal-black" />
                  }
                  <span className={`text-[9px] font-black leading-none ${isActive ? 'text-brutal-white' : isLocked ? 'text-brutal-black/30' : 'text-brutal-black'}`}>
                    CH{chapter.number}
                  </span>
                </motion.button>

                <p className={`text-[10px] font-bold mt-1.5 text-center leading-tight w-16 ${isLocked ? 'text-brutal-black/30' : 'text-brutal-black'}`}>
                  {chapter.title}
                </p>

                {!isLocked && (
                  <span className={`text-[10px] font-bold mt-0.5 ${isComplete ? 'text-brutal-green' : 'text-brutal-black/40'}`}>
                    {chapter.topicsCompleted}/{chapter.topicsTotal}
                  </span>
                )}

                {!isLocked && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ChevronDown size={11} className="text-brutal-black/30 mt-0.5" />
                  </motion.div>
                )}
              </div>

              {/* Connector */}
              {idx < chapters.length - 1 && (
                <div className="flex-1 mt-7 h-1 relative mx-1">
                  <div className="absolute inset-0 bg-brutal-black/10" />
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-brutal-green"
                    initial={{ width: '0%' }}
                    animate={{ width: isComplete ? '100%' : '0%' }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence mode="wait">
        {displayIdx !== null && chapters[displayIdx] && (
          <motion.div
            key={displayIdx}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <ChapterDetail
              chapter={chapters[displayIdx]}
              completedTopics={completedTopics}
              onStartTopic={onStartTopic}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── ChapterDetail ─────────────────────────────────────────────────────────────

const ChapterDetail = ({ chapter, completedTopics, onStartTopic }) => {
  const done = new Set(completedTopics || []);
  const pct  = chapter.topicsTotal > 0
    ? Math.round((chapter.topicsCompleted / chapter.topicsTotal) * 100)
    : 0;

  const isComplete = chapter.status === 'completed';
  const isLocked   = chapter.status === 'locked';
  const nextTopic  = !isLocked ? chapter.topics.find(t => !done.has(t)) : null;

  return (
    <div className="border-t-4 border-brutal-black pt-4 mt-3">
      {/* Title row */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-base font-black text-brutal-black leading-none">{chapter.title}</h4>
          <p className="text-brutal-black/55 text-xs font-bold mt-0.5">{chapter.subtitle}</p>
        </div>
        <span className={`text-[9px] font-black px-2 py-0.5 border-2 shrink-0 ml-2 ${DIFF_STYLE[chapter.difficulty] || DIFF_STYLE.beginner}`}>
          {(chapter.difficulty || 'beginner').toUpperCase()}
        </span>
      </div>

      {/* Narrative */}
      <p className="text-brutal-black/65 text-xs font-medium mb-4 leading-relaxed border-l-4 border-brutal-blue px-3 italic">
        {chapter.narrative}
      </p>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs font-black text-brutal-black mb-1">
          <span>PROGRESS</span>
          <span>{chapter.topicsCompleted}/{chapter.topicsTotal} topics · {pct}%</span>
        </div>
        <div className="h-3 bg-brutal-bg border-2 border-brutal-black overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.45 }}
            className={`h-full ${isComplete ? 'bg-brutal-green' : 'bg-brutal-blue'}`}
          />
        </div>
      </div>

      {/* Topic grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
        {chapter.topics.map((topicName) => {
          const alias      = chapter.topicAliases?.[topicName] || null;
          const isDone     = done.has(topicName);
          const isNext     = !isDone && topicName === nextTopic;
          const allLocked  = isLocked;

          return (
            <div
              key={topicName}
              className={`flex items-center gap-2 px-3 py-1.5 border-2 ${
                isDone     ? 'bg-brutal-green/15 border-brutal-green'
                : isNext   ? 'bg-brutal-blue/10 border-brutal-blue'
                : allLocked? 'bg-brutal-bg border-brutal-black/15 opacity-50'
                :             'bg-brutal-bg border-brutal-black/25'
              }`}
            >
              {isDone ? (
                <Check size={12} strokeWidth={3} className="text-brutal-black shrink-0" />
              ) : allLocked ? (
                <Lock size={12} strokeWidth={2} className="text-brutal-black/30 shrink-0" />
              ) : isNext ? (
                <ArrowRight size={12} strokeWidth={2.5} className="text-brutal-blue shrink-0" />
              ) : (
                <div className="w-2.5 h-2.5 border-2 border-brutal-black/25 rounded-none shrink-0" />
              )}
              <div className="min-w-0">
                <p className={`text-[11px] font-bold leading-tight truncate ${allLocked ? 'text-brutal-black/30' : isNext ? 'text-brutal-black' : isDone ? 'text-brutal-black' : 'text-brutal-black/55'}`}>
                  {alias || topicName}
                </p>
                {alias && (
                  <p className="text-[9px] text-brutal-black/35 font-medium leading-none truncate">{topicName}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {!isLocked && !isComplete && nextTopic && (
        <motion.button
          whileHover={{ x: 3, y: 3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onStartTopic(nextTopic)}
          className="bg-brutal-green border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-5 py-2.5 rounded-none font-black text-sm text-brutal-black flex items-center gap-2 transition-all"
        >
          CONTINUE LEARNING <ArrowRight size={14} strokeWidth={2.5} />
        </motion.button>
      )}

      {isComplete && (
        <div className="flex items-center gap-2 bg-brutal-green/15 border-2 border-brutal-green px-4 py-2 w-fit">
          <CheckCircle size={14} strokeWidth={2.5} className="text-brutal-black" />
          <span className="text-xs font-black text-brutal-black">CHAPTER COMPLETE!</span>
        </div>
      )}
    </div>
  );
};

export default ChapterRoadmap;
