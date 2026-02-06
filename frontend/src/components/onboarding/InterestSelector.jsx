// FINLIT Interest Selector Component
// Allows users to select their primary interest

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getInterests } from '../../services/api';
import LoadingAnimation from '../shared/LoadingAnimation';

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

  if (loading) {
    return (
      <div className="py-12">
        <LoadingAnimation message="Loading interests..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={`
        p-6 rounded-xl cursor-pointer transition-all duration-300
        ${isSelected
          ? 'bg-primary border-2 border-primary shadow-xl shadow-primary/50'
          : 'bg-dark-light border-2 border-gray-700 hover:border-primary/50'
        }
      `}
    >
      <div className="text-center">
        <div className="text-4xl mb-3">{interest.icon}</div>
        <h3 className="font-semibold text-white text-sm mb-1">
          {interest.name}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2">
          {interest.description}
        </p>
      </div>
    </motion.div>
  );
};

export default InterestSelector;
