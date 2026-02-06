// FINLIT Level Up Modal Component
// Celebration modal when user levels up

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const LevelUpModal = ({ levelUpNotification, onDismiss }) => {
  // Trigger confetti when modal appears
  React.useEffect(() => {
    if (levelUpNotification) {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#70FFCA', '#FF90E8', '#3352FF']
      });
    }
  }, [levelUpNotification]);

  if (!levelUpNotification) return null;

  const { oldLevel, newLevel } = levelUpNotification;

  // Unlock messages based on level
  const getLevelUnlock = (level) => {
    const unlocks = {
      2: 'APPLICATION Quizzes Unlocked! 🧮',
      3: 'BOSS FIGHT Simulations Unlocked! ⚔️',
      4: 'Advanced Topics Available! 📈',
      5: 'Expert Mode Activated! ⭐',
      6: 'Master Tier Reached! 👑',
      7: 'Elite Status! 💎',
      8: 'Legend Mode! 🏆',
      9: 'Grandmaster! 🌟',
      10: 'MAXIMUM LEVEL - You\'re a Finance God! 🔥'
    };
    return unlocks[level] || 'Keep crushing it! 💪';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-brutal-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-brutal-green border-4 border-brutal-black shadow-brutal-lg rounded-none p-12 max-w-2xl w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Trophy */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
            className="text-9xl mb-6"
          >
            🏆
          </motion.div>

          {/* Level Up Text */}
          <motion.h1
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-7xl font-black text-brutal-black mb-4"
          >
            LEVEL UP!
          </motion.h1>

          {/* Level Change */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="bg-brutal-white border-4 border-brutal-black rounded-none px-8 py-4">
              <p className="text-sm font-black text-brutal-black mb-1">FROM</p>
              <p className="text-5xl font-black text-brutal-blue">LVL {oldLevel}</p>
            </div>
            <div className="text-6xl font-black text-brutal-black">→</div>
            <div className="bg-brutal-pink border-4 border-brutal-black rounded-none px-8 py-4">
              <p className="text-sm font-black text-brutal-black mb-1">TO</p>
              <p className="text-5xl font-black text-brutal-blue">LVL {newLevel}</p>
            </div>
          </div>

          {/* Unlock Message */}
          <div className="bg-brutal-black border-4 border-brutal-black rounded-none p-6 mb-8">
            <p className="text-2xl font-black text-brutal-green">
              {getLevelUnlock(newLevel)}
            </p>
          </div>

          {/* Close Button */}
          <motion.button
            whileHover={{ x: 4, y: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDismiss}
            className="bg-brutal-blue border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover px-12 py-4 rounded-none font-black text-2xl text-brutal-white"
          >
            KEEP GRINDING! →
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LevelUpModal;
