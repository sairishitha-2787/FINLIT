import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useDomain } from '../../contexts/DomainContext';
import { useUser } from '../../context/UserContext';
import GamingProgress from '../../components/gaming/GamingProgress';

export default function GamingProgressPage() {
  const { defeatedBosses } = useDomain();
  const { completedTopics } = useUser();
  const { xp, level, streak, getLevelProgress, getXPForNextLevel, colors } = useOutletContext();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
    >
      <GamingProgress
        colors={colors}
        level={level}
        xp={xp}
        streak={streak}
        completedTopics={completedTopics}
        defeatedBosses={defeatedBosses}
        getLevelProgress={getLevelProgress}
        getXPForNextLevel={getXPForNextLevel}
      />
    </motion.div>
  );
}
