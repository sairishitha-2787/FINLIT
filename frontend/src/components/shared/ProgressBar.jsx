// FINLIT Progress Bar Component
// Animated progress indicator

import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ current, total, showLabel = true }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">
            Progress: {current} / {total}
          </span>
          <span className="text-sm font-semibold text-primary">
            {percentage}%
          </span>
        </div>
      )}

      <div className="w-full h-3 bg-dark-light rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
