// FINLIT Interest Selector - Cosmic Theme
// Immersive floating cards with glow effects

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInterests } from '../../services/api';

// Pulsing loading dots
const CosmicLoader = () => (
  <div className="flex items-center justify-center py-12 gap-2">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="w-2.5 h-2.5 rounded-full bg-cosmic-glow/60"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);

const InterestSelector = ({ selectedInterest, onSelect }) => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      setLoading(true);
      const response = await getInterests();
      if (response.success) {
        setInterests(response.interests);
      }
    } catch (err) {
      console.error('Error fetching interests:', err);
      setError('Failed to load interests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CosmicLoader />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400/80 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {interests.map((interest, index) => (
        <InterestCard
          key={interest.id}
          interest={interest}
          isSelected={selectedInterest === interest.id}
          onSelect={() => onSelect(interest.id)}
          index={index}
        />
      ))}
    </div>
  );
};

const InterestCard = ({ interest, isSelected, onSelect, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={`
        relative p-5 rounded-2xl cursor-pointer transition-all duration-400 overflow-hidden
        border group
        ${isSelected
          ? 'bg-cosmic-purple/20 border-cosmic-purple/50 selected-glow'
          : 'bg-white/[0.04] border-white/[0.08] hover:border-cosmic-glow/30 hover:bg-white/[0.07]'
        }
      `}
    >
      {/* Background glow on hover */}
      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${isSelected ? 'opacity-100' : ''}
        `}
        style={{
          background: isSelected
            ? 'radial-gradient(ellipse at 50% 50%, rgba(108, 60, 224, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(167, 139, 250, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="text-center relative z-10">
        <motion.div
          className="text-4xl mb-2.5"
          animate={isSelected ? {
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {interest.icon}
        </motion.div>
        <h3 className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
          isSelected ? 'text-white' : 'text-white/75'
        }`}>
          {interest.name}
        </h3>
        <p className={`text-[11px] leading-tight transition-colors duration-300 line-clamp-2 ${
          isSelected ? 'text-white/45' : 'text-white/25'
        }`}>
          {interest.description}
        </p>
      </div>

      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cosmic-purple flex items-center justify-center"
          >
            <span className="text-white text-[10px]">✓</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InterestSelector;
