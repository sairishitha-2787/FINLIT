// FINLIT - XP Popup Component
// Floating XP notifications

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const XPPopup = ({ popups }) => {
  return (
    <div className="fixed top-24 right-8 z-50 pointer-events-none">
      <AnimatePresence>
        {popups.map((popup, index) => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: -index * 70, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.5 }}
            transition={{ duration: 0.4 }}
            className="mb-2"
          >
            <div className="bg-brutal-green border-4 border-brutal-black shadow-brutal px-6 py-3 rounded-none">
              <p className="text-brutal-black font-bold text-lg">
                {popup.text}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default XPPopup;
