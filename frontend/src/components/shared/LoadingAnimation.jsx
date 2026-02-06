// FINLIT Loading Animation Component
// Animated loading indicator

import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🧠
        </motion.div>
      </motion.div>

      {message && (
        <motion.p
          className="text-gray-300 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingAnimation;
