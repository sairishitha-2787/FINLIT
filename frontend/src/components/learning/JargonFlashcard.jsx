// FINLIT Jargon Flashcard Component
// Developer's Guide to Finance Jargon - Interactive flip cards

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const JargonFlashcard = ({ jargonGuide }) => {
  if (!jargonGuide || jargonGuide.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 mb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brutal-black border-4 border-brutal-black shadow-brutal rounded-none p-6 mb-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">📚</span>
          <div>
            <h2 className="text-3xl font-black text-brutal-green">
              DEVELOPER'S GUIDE TO FINANCE JARGON
            </h2>
            <p className="text-brutal-white font-bold mt-1">
              Click any card to reveal the translation
            </p>
          </div>
        </div>
      </motion.div>

      {/* Flashcards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jargonGuide.map((item, index) => (
          <FlipCard key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

const FlipCard = ({ item, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="perspective-1000"
    >
      <motion.div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative h-64 cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Front of Card (Jargon Term) */}
        <div
          className={`absolute inset-0 bg-brutal-pink border-4 border-brutal-black shadow-brutal rounded-none p-6 flex flex-col items-center justify-center text-center ${
            isFlipped ? 'invisible' : 'visible'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-3xl font-black text-brutal-black mb-2">
            {item.jargon}
          </h3>
          <p className="text-brutal-black font-bold text-sm uppercase tracking-wide">
            Click to unlock
          </p>
        </div>

        {/* Back of Card (Translation) */}
        <div
          className={`absolute inset-0 bg-brutal-green border-4 border-brutal-black shadow-brutal rounded-none p-6 flex flex-col justify-between ${
            isFlipped ? 'visible' : 'invisible'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-brutal-black">
                {item.jargon}
              </h3>
              <div className="text-3xl">💡</div>
            </div>

            <div className="mb-4">
              <p className="text-brutal-black font-bold text-sm mb-2 uppercase tracking-wide">
                Your Translation:
              </p>
              <p className="text-brutal-black text-base leading-relaxed font-medium">
                {item.analogy}
              </p>
            </div>
          </div>

          <div className="bg-brutal-black border-2 border-brutal-black rounded-none p-3 mt-4">
            <p className="text-xs font-bold text-brutal-white uppercase mb-1">
              💎 PRO TIP
            </p>
            <p className="text-brutal-green text-sm font-bold">
              {item.proTip}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JargonFlashcard;
