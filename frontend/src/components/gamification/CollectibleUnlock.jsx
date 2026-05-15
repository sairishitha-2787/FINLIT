// CollectibleUnlock — animated overlay shown when a new collectible is earned
// Trigger: pass collectible={...} to show; null to hide

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';

const CollectibleUnlock = ({ collectible, domain, onClose }) => {
  const fired = useRef(false);

  useEffect(() => {
    if (collectible && !fired.current) {
      fired.current = true;
      confetti({ particleCount: 60, spread: 50, startVelocity: 35, origin: { x: 0.5, y: 0.5 } });
    }
    if (!collectible) fired.current = false;
  }, [collectible]);

  return (
    <AnimatePresence>
      {collectible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brutal-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.4, rotate: -15, opacity: 0 }}
            animate={{ scale: 1,   rotate: 0,   opacity: 1 }}
            exit={{    scale: 0.6, opacity: 0              }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="bg-brutal-white border-4 border-brutal-black shadow-brutal-lg max-w-sm w-full mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent */}
            <div className="bg-brutal-green h-2" />

            <div className="p-8 text-center">
              {/* Glowing collectible icon */}
              <motion.div
                animate={{ boxShadow: ['0 0 0 0 rgba(74,222,128,0)', '0 0 0 12px rgba(74,222,128,0.3)', '0 0 0 0 rgba(74,222,128,0)'] }}
                transition={{ repeat: 3, duration: 0.8 }}
                className="w-20 h-20 bg-brutal-green border-4 border-brutal-black mx-auto mb-6 flex items-center justify-center"
              >
                <Sparkles size={36} strokeWidth={2} className="text-brutal-black" />
              </motion.div>

              <div className="bg-brutal-black text-brutal-green text-xs font-black px-3 py-1 inline-block mb-3 tracking-widest">
                NEW COLLECTIBLE UNLOCKED
              </div>

              <h2 className="text-3xl font-black text-brutal-black mb-2 leading-tight">
                {collectible.name}
              </h2>

              {domain && (
                <p className="text-brutal-black/50 text-xs font-black uppercase tracking-widest mb-3">
                  {domain.toUpperCase()} COLLECTION
                </p>
              )}

              <p className="text-brutal-black/70 font-bold text-sm mb-6 leading-relaxed">
                {collectible.desc}
              </p>

              <motion.button
                whileHover={{ x: 3, y: 3 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="bg-brutal-black border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-8 py-3 font-black text-brutal-white w-full transition-all"
              >
                <span className="flex items-center justify-center gap-2">EPIC! CONTINUE <ArrowRight size={18} strokeWidth={2.5} /></span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollectibleUnlock;
