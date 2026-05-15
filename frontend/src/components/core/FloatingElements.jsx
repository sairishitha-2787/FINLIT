import React from 'react';
import { motion } from 'framer-motion';

const ORBS = [
  { width: 340, height: 340, style: { top: '-80px', left: '-80px' }, from: '#99f6e4', to: '#bae6fd', opacity: 0.45, duration: 9 },
  { width: 300, height: 300, style: { bottom: '-60px', right: '-60px' }, from: '#bfdbfe', to: '#a5f3fc', opacity: 0.38, duration: 11 },
  { width: 220, height: 220, style: { top: '40%', right: '6%' }, from: '#d9f99d', to: '#99f6e4', opacity: 0.28, duration: 13 },
  { width: 180, height: 180, style: { top: '22%', left: '10%' }, from: '#bae6fd', to: '#c7d2fe', opacity: 0.32, duration: 8 },
];

const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {ORBS.map((orb, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: orb.width,
          height: orb.height,
          borderRadius: '50%',
          filter: 'blur(64px)',
          background: `radial-gradient(circle, ${orb.from}, ${orb.to})`,
          opacity: orb.opacity,
          ...orb.style,
        }}
        animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
        transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 1.8 }}
      />
    ))}
  </div>
);

export default FloatingElements;
