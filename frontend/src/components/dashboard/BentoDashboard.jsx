// FINLIT - Bento Dashboard (COMPACT 4-COLUMN GRID)
// Clean Glassmorphism Layout

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Flame, BookOpen, Lock,
  GraduationCap, Target, Zap, Star, Crown, MessageCircle,
  ArrowRight, ChevronLeft, ChevronRight,
} from 'lucide-react';
import AnimatedIcon from '../shared/AnimatedIcon';
import { useUser } from '../../context/UserContext';
import useGamification from '../../hooks/useGamification';
import TopicSelector from './TopicSelector';

const BADGE_ICON_MAP = { GraduationCap, Target, Flame, Zap, Star, Crown };

const toRecObj = (r) =>
  typeof r === 'string' ? { name: r, reason: null, difficulty: null, estimatedMinutes: null } : r;

const DIFFICULTY_CONFIG = {
  beginner:     { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  intermediate: { bg: 'bg-blue-100',    text: 'text-blue-700'    },
  advanced:     { bg: 'bg-rose-100',    text: 'text-rose-700'    },
};

const BentoDashboard = ({ recommendations, onStartTopic, onOpenMentor }) => {
  const { profile } = useUser();
  const { xp, level, streak, badges, getLevelProgress, getXPForNextLevel } = useGamification();
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [isTopicSelectorOpen, setIsTopicSelectorOpen] = useState(false);

  const currentRec = toRecObj(recommendations[currentTopicIndex] || 'Budgeting Basics');
  const currentTopic = currentRec.name;

  const nextTopic = () => setCurrentTopicIndex((prev) => (prev + 1) % recommendations.length);
  const prevTopic = () => setCurrentTopicIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);

  const levelProgress = getLevelProgress();
  const xpNeeded = getXPForNextLevel();
  const interest = profile?.primaryInterest || 'finance';

  const finnMessages = [
    `Ready to crush "${currentTopic}"? I'll break it down through ${interest} — no boring textbooks!`,
    `${streak > 0 ? `${streak}-day streak? Respect. ` : ''}Let me show you how ${interest} and money are the same game.`,
    `Level ${level} and still grinding — love to see it. Pick a topic and I'll make ${interest} your finance lens.`,
    `"${currentTopic}" sounds complicated, but through ${interest}? It's actually a whole vibe.`,
    `Your ${interest} intuition is literally a finance superpower. I'll show you exactly how.`,
  ];
  const finnMessage = finnMessages[new Date().getDate() % finnMessages.length];
  const diffCfg = DIFFICULTY_CONFIG[currentRec.difficulty] || null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto">

      {/* Block 1: Current Learning Module (2 cols × 2 rows) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#3A8DFF] to-[#2563EB] rounded-2xl p-6 relative overflow-hidden shadow-md"
      >
        {/* decorative blobs */}
        <div className="absolute -top-8 -right-8 w-44 h-44 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-14 -left-6 w-52 h-52 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative">
          <div className="absolute top-0 right-0 bg-emerald-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
            NEXT UP
          </div>

          <h2 className="text-2xl font-black text-white mb-2 pr-20 leading-snug">
            {currentTopic}
          </h2>

          {(currentRec.difficulty || currentRec.estimatedMinutes) && (
            <div className="flex items-center gap-2 mb-2.5">
              {diffCfg && (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${diffCfg.bg} ${diffCfg.text}`}>
                  {currentRec.difficulty.toUpperCase()}
                </span>
              )}
              {currentRec.estimatedMinutes && (
                <span className="text-xs font-medium text-white/70">
                  ~{currentRec.estimatedMinutes} min
                </span>
              )}
            </div>
          )}

          {currentRec.reason && (
            <div className="bg-white/15 border-l-4 border-emerald-300 px-3 py-2 mb-3 rounded-r-lg">
              <p className="text-white/90 text-xs font-medium italic leading-snug">
                {currentRec.reason}
              </p>
            </div>
          )}

          <p className="text-white/70 text-sm mb-4 font-medium">
            Personalized through {profile?.primaryInterest || 'your interests'}
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onStartTopic(currentTopic)}
                className="bg-emerald-400 hover:bg-emerald-300 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
              >
                START <ArrowRight size={15} strokeWidth={2.5} />
              </motion.button>

              {recommendations.length > 1 && (
                <div className="flex gap-1">
                  <button
                    onClick={prevTopic}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl transition-all"
                  >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={nextTopic}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl transition-all"
                  >
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsTopicSelectorOpen(true)}
              className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all w-fit flex items-center gap-1.5"
            >
              <BookOpen size={13} strokeWidth={2} /> Browse All Topics
            </button>
          </div>
        </div>
      </motion.div>

      {/* Block 2: XP & Level (1 col, 1 row) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-black text-slate-900">Level {level}</h3>
          <span className="bg-blue-50 text-blue-600 font-bold text-xs px-2.5 py-1 rounded-full border border-blue-100">
            {xp} XP
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
          />
        </div>
        <p className="text-xs text-slate-400 font-medium">
          {xpNeeded} XP to Level {level + 1}
        </p>
      </motion.div>

      {/* Block 3: Streak (1 col, 1 row) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-gradient-to-br from-orange-50 to-amber-50 border border-amber-100/60 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center"
      >
        <AnimatedIcon icon={Flame} size={40} animation="flicker" className="text-orange-400 mb-2" />
        <h3 className="text-3xl font-black text-slate-900">{streak}</h3>
        <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mt-0.5">Day Streak</p>
      </motion.div>

      {/* Block 4: Mentor's Corner (2 cols, 1 row) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="md:col-span-2 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-5 shadow-sm relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-50/60 rounded-full pointer-events-none" />

        <div className="flex gap-4 items-start relative">
          <div className="relative shrink-0">
            <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
              <AnimatedIcon icon={Brain} size={28} animation="wiggle" className="text-blue-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-black text-slate-900">Finn</h3>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                ONLINE
              </span>
            </div>
            <p className="text-slate-400 text-xs font-medium mb-2.5 truncate">
              {interest} specialist · your AI mentor
            </p>
            <div className="bg-slate-50 rounded-xl p-3 mb-3">
              <p className="text-slate-700 text-xs font-medium leading-snug">
                "{finnMessage}"
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenMentor}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle size={13} strokeWidth={2.5} /> Chat with Finn
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenMentor}
                title="Quick question"
                className="bg-blue-50 hover:bg-blue-100 text-blue-500 px-3 py-2 rounded-xl transition-colors border border-blue-100"
              >
                <Zap size={14} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Block 5: Badges (2 cols, 1 row) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className="md:col-span-2 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 shadow-sm"
      >
        <h3 className="font-black text-slate-900 mb-3 text-sm">Badges</h3>
        <div className="grid grid-cols-3 gap-2">
          {badges.slice(0, 6).map((badge) => (
            <div
              key={badge.id}
              className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                badge.unlocked
                  ? 'bg-emerald-50 border border-emerald-100 cursor-pointer hover:bg-emerald-100'
                  : 'bg-slate-50 border border-slate-100 opacity-40'
              }`}
              title={badge.unlocked ? badge.desc : 'Locked'}
            >
              {badge.unlocked
                ? (() => {
                    const I = BADGE_ICON_MAP[badge.icon];
                    return I ? <I size={24} strokeWidth={1.8} className="text-emerald-600" /> : null;
                  })()
                : <Lock size={18} strokeWidth={1.8} className="text-slate-300" />}
            </div>
          ))}
        </div>
      </motion.div>

      <TopicSelector
        isOpen={isTopicSelectorOpen}
        onClose={() => setIsTopicSelectorOpen(false)}
        onSelectTopic={onStartTopic}
      />
    </div>
  );
};

export default BentoDashboard;
