// FINLIT — Chapter Completion Modal
// Confetti burst + badge reveal + XP display + next chapter unlock notification

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, GraduationCap, Target, Zap, Flame, Star, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

const BADGE_ICON_MAP = { GraduationCap, Target, Flame, Zap, Star, Crown, CheckCircle };

const ChapterCompletionModal = ({ chapter, nextChapter, onContinue, onClose }) => {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const colors = ['#00ff88', '#3b82f6', '#ec4899', '#1a1a1a', '#ffffff'];
    const end = Date.now() + 2800;

    const frame = () => {
      confetti({ particleCount: 5, angle: 60,  spread: 58, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 58, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  if (!chapter) return null;

  const BadgeIcon = BADGE_ICON_MAP[chapter.completionBadge?.icon] || CheckCircle;
  const hasNext = nextChapter && nextChapter.status !== 'locked';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brutal-black/70"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.65, opacity: 0, y: 50 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{   scale: 0.8,   opacity: 0        }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          className="bg-brutal-white border-4 border-brutal-black shadow-brutal-lg rounded-none max-w-md w-full p-8 text-center relative overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0  w-7 h-7 bg-brutal-green border-r-4 border-b-4 border-brutal-black pointer-events-none" />
          <div className="absolute top-0 right-0 w-7 h-7 bg-brutal-pink  border-l-4 border-b-4 border-brutal-black pointer-events-none" />
          <div className="absolute bottom-0 left-0  w-7 h-7 bg-brutal-blue  border-r-4 border-t-4 border-brutal-black pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-brutal-green border-l-4 border-t-4 border-brutal-black pointer-events-none" />

          {/* Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -200 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 }}
            className="mx-auto mb-4 w-20 h-20 bg-brutal-green border-4 border-brutal-black shadow-brutal flex items-center justify-center"
          >
            <BadgeIcon size={44} strokeWidth={1.5} className="text-brutal-black" />
          </motion.div>

          {/* Badge name pill */}
          {chapter.completionBadge && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="inline-block bg-brutal-black px-3 py-1 mb-3"
            >
              <span className="text-brutal-green text-[10px] font-black tracking-widest uppercase">
                {chapter.completionBadge.name} UNLOCKED
              </span>
            </motion.div>
          )}

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            className="text-3xl font-black text-brutal-black mb-1"
          >
            CHAPTER {chapter.number} COMPLETE!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.46 }}
            className="text-brutal-black/55 text-sm font-bold mb-5"
          >
            {chapter.title}
          </motion.p>

          {/* XP reward */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.52, type: 'spring' }}
            className="bg-brutal-black inline-flex items-baseline gap-2 px-6 py-3 mb-5"
          >
            <span className="text-brutal-green font-black text-2xl">+{chapter.completionXP} XP</span>
            <span className="text-brutal-white/50 text-xs font-bold">CHAPTER BONUS</span>
          </motion.div>

          {/* Next chapter unlock callout */}
          {nextChapter && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-brutal-blue/10 border-2 border-brutal-blue px-4 py-3 mb-5 text-left"
            >
              <p className="text-[9px] font-black text-brutal-blue uppercase tracking-widest mb-0.5">
                UNLOCKED
              </p>
              <p className="text-sm font-black text-brutal-black">
                Chapter {nextChapter.number}: {nextChapter.title}
              </p>
              <p className="text-xs text-brutal-black/55 font-bold">{nextChapter.subtitle}</p>
            </motion.div>
          )}

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex gap-3"
          >
            <button
              onClick={onClose}
              className="flex-1 border-4 border-brutal-black px-4 py-3 font-black text-sm text-brutal-black hover:bg-brutal-bg transition-colors"
            >
              DASHBOARD
            </button>
            {hasNext && (
              <motion.button
                whileHover={{ x: 3, y: 3 }}
                whileTap={{ scale: 0.97 }}
                onClick={onContinue}
                className="flex-1 bg-brutal-green border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-4 py-3 font-black text-sm text-brutal-black flex items-center justify-center gap-1.5 transition-all"
              >
                CH{nextChapter.number} <ChevronRight size={14} strokeWidth={2.5} />
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChapterCompletionModal;
