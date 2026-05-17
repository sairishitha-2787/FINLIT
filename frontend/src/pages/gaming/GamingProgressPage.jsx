import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useDomain } from '../../contexts/DomainContext';
import { useUser } from '../../context/UserContext';
import GamingProgress from '../../components/gaming/GamingProgress';

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

export default function GamingProgressPage() {
  const { defeatedBosses } = useDomain();
  const { completedTopics, loading } = useUser();
  const { xp, level, streak, getLevelProgress, getXPForNextLevel, colors } = useOutletContext();

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 14 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid rgba(${hexToRgbStr(colors?.primary)},0.20)`, borderTop: `3px solid ${colors?.primary || '#9FE0D3'}`, animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 9, letterSpacing: '0.22em', color: '#8899bb', textTransform: 'uppercase' }}>Loading...</span>
    </div>
  );

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
