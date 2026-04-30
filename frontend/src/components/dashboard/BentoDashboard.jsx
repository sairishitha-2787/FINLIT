// FINLIT - Bento Dashboard (COMPACT 4-COLUMN GRID)
// Neo-Brutalist Grid Layout - Above the fold

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import useGamification from '../../hooks/useGamification';
import TopicSelector from './TopicSelector';

const BentoDashboard = ({ recommendations, onStartTopic }) => {
  const { profile } = useUser();
  const { xp, level, streak, badges, getLevelProgress, getXPForNextLevel } = useGamification();
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [isTopicSelectorOpen, setIsTopicSelectorOpen] = useState(false);

  const currentTopic = recommendations[currentTopicIndex] || 'Budgeting Basics';

  const nextTopic = () => {
    setCurrentTopicIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevTopic = () => {
    setCurrentTopicIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  const levelProgress = getLevelProgress();
  const xpNeeded = getXPForNextLevel();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
      {/* Block 1: Current Learning Module (2 cols, 2 rows) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="md:col-span-2 md:row-span-2 bg-brutal-blue border-4 border-brutal-black shadow-brutal p-6 rounded-none relative"
      >
        <div className="absolute top-3 right-3 bg-brutal-green border-2 border-brutal-black px-2 py-1 rounded-none">
          <span className="text-xs font-black">NEXT UP</span>
        </div>

        <h2 className="text-3xl font-black text-brutal-white mb-3 leading-tight pr-16">
          {currentTopic}
        </h2>

        <p className="text-brutal-white text-base mb-4 font-medium">
          Master through {profile?.primaryInterest || 'your interests'}
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            <motion.button
              whileHover={{ x: 2, y: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStartTopic(currentTopic)}
              className="bg-brutal-green border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-6 py-3 rounded-none font-black text-lg text-brutal-black"
            >
              START →
            </motion.button>

            {recommendations.length > 1 && (
              <div className="flex gap-1">
                <button
                  onClick={prevTopic}
                  className="bg-brutal-white border-2 border-brutal-black px-3 py-2 rounded-none font-black text-sm"
                >
                  ←
                </button>
                <button
                  onClick={nextTopic}
                  className="bg-brutal-white border-2 border-brutal-black px-3 py-2 rounded-none font-black text-sm"
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* Browse More Topics Button */}
          <button
            onClick={() => setIsTopicSelectorOpen(true)}
            className="bg-brutal-pink border-2 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-4 py-2 rounded-none font-black text-sm text-brutal-black transition-all w-fit"
          >
            📚 BROWSE ALL TOPICS
          </button>
        </div>
      </motion.div>

      {/* Block 2: XP & Level (1 col, 1 row) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="md:col-span-1 bg-brutal-white border-4 border-brutal-black shadow-brutal p-4 rounded-none"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-black text-brutal-black">LVL {level}</h3>
          <div className="bg-brutal-pink border-2 border-brutal-black px-2 py-1 rounded-none">
            <span className="font-black text-xs">{xp} XP</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-8 bg-brutal-bg border-4 border-brutal-black rounded-none overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 0.6 }}
            className="h-full bg-brutal-green border-r-4 border-brutal-black flex items-center justify-end pr-1"
          >
            {levelProgress > 15 && (
              <span className="font-black text-xs text-brutal-black">
                {Math.round(levelProgress)}%
              </span>
            )}
          </motion.div>
        </div>

        <p className="text-xs font-mono text-brutal-black font-bold">
          {xpNeeded} XP to Lv{level + 1}
        </p>
      </motion.div>

      {/* Block 3: Streak (1 col, 1 row) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="md:col-span-1 bg-brutal-pink border-4 border-brutal-black shadow-brutal p-4 rounded-none flex flex-col items-center justify-center text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-5xl mb-2"
        >
          🔥
        </motion.div>
        <h3 className="text-3xl font-black text-brutal-black">{streak}</h3>
        <p className="text-brutal-black font-bold uppercase text-xs">Day Streak</p>
      </motion.div>

      {/* Block 4: Mentor's Corner (2 cols, 1 row) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="md:col-span-2 bg-brutal-bg border-4 border-brutal-black shadow-brutal p-4 rounded-none"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            🧠
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-black mb-1 text-brutal-black">MENTOR'S CORNER</h3>
            <p className="text-brutal-black text-sm mb-2 leading-snug font-medium">
              "Yo! Pick a topic and let's crush it. I'll explain using{' '}
              {profile?.primaryInterest || 'what you love'} - no boring vibes!"
            </p>
            <button className="bg-brutal-blue border-2 border-brutal-black shadow-brutal-sm px-3 py-1 rounded-none font-bold text-brutal-white text-xs">
              CHAT →
            </button>
          </div>
        </div>
      </motion.div>

      {/* Block 5: Badges (2 cols, 1 row) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className="md:col-span-2 bg-brutal-white border-4 border-brutal-black shadow-brutal p-4 rounded-none"
      >
        <h3 className="text-lg font-black mb-3 text-brutal-black">BADGES</h3>
        <div className="grid grid-cols-3 gap-2">
          {badges.slice(0, 6).map((badge) => (
            <div
              key={badge.id}
              className={`aspect-square border-4 border-brutal-black rounded-none flex items-center justify-center text-3xl ${
                badge.unlocked
                  ? 'bg-brutal-green cursor-pointer'
                  : 'bg-brutal-bg opacity-40'
              }`}
              title={badge.unlocked ? badge.desc : '🔒 Locked'}
            >
              {badge.unlocked ? badge.name.split(' ')[0] : '🔒'}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Topic Selector Modal */}
      <TopicSelector
        isOpen={isTopicSelectorOpen}
        onClose={() => setIsTopicSelectorOpen(false)}
        onSelectTopic={onStartTopic}
      />
    </div>
  );
};

export default BentoDashboard;
