import React from 'react';
import { motion } from 'framer-motion';

const PRESETS = {
  none:     { animate: {},                              transition: {} },
  pulse:    { animate: { scale: [1, 1.18, 1] },         transition: { duration: 2,   repeat: Infinity, ease: 'easeInOut' } },
  bounce:   { animate: { y: [0, -5, 0] },               transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } },
  wiggle:   { animate: { rotate: [0, 8, -8, 0] },       transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } },
  spin:     { animate: { rotate: 360 },                 transition: { duration: 3,   repeat: Infinity, ease: 'linear' } },
  float:    { animate: { y: [0, -7, 0] },               transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } },
  flash:    { animate: { opacity: [1, 0.3, 1] },        transition: { duration: 1.8, repeat: Infinity } },
  flicker:  { animate: { scale: [1, 1.1, 0.95, 1.05, 1] }, transition: { duration: 1.5, repeat: Infinity } },
};

// AnimatedIcon wraps any Lucide icon with a Framer Motion animation preset.
// Usage: <AnimatedIcon icon={Brain} animation="wiggle" size={32} className="text-white" />
const AnimatedIcon = ({
  icon: Icon,
  size = 20,
  animation = 'none',
  className = '',
  strokeWidth = 2.5,
  style,
}) => {
  const { animate, transition } = PRESETS[animation] || PRESETS.none;
  return (
    <motion.span
      animate={animate}
      transition={transition}
      className={`inline-flex items-center justify-center ${className}`}
      style={style}
    >
      <Icon size={size} strokeWidth={strokeWidth} />
    </motion.span>
  );
};

export default AnimatedIcon;
