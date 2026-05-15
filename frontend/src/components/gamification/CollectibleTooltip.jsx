// Shared hover tooltip for collectibles across all domain progress views

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check } from 'lucide-react';

const CollectibleTooltip = ({ visible, collectible, isUnlocked, prerequisite }) => (
  <AnimatePresence>
    {visible && collectible && (
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.95 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={   { opacity: 0, y: 6,  scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 pointer-events-none"
      >
        <div className="bg-brutal-black border-2 border-brutal-black shadow-brutal-sm p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            {!isUnlocked && <Lock size={10} strokeWidth={2.5} className="text-brutal-white/40 flex-shrink-0" />}
            <p className="text-xs font-black text-brutal-white leading-tight">
              {collectible.name}
            </p>
          </div>
          <p className="text-brutal-white/60 text-xs font-bold leading-snug mb-1.5">
            {isUnlocked ? collectible.desc : `Complete "${prerequisite}" to unlock`}
          </p>
          <div className={`text-xs font-black tracking-wider ${
            isUnlocked ? 'text-brutal-green' : 'text-brutal-white/30'
          }`}>
            {isUnlocked
              ? <span className="flex items-center gap-1"><Check size={10} strokeWidth={3} />UNLOCKED</span>
              : 'LOCKED'
            }
          </div>
        </div>
        {/* Arrow */}
        <div className="w-2 h-2 bg-brutal-black border-r-2 border-b-2 border-brutal-black rotate-45 mx-auto -mt-1" />
      </motion.div>
    )}
  </AnimatePresence>
);

export default CollectibleTooltip;
