import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Telescope } from 'lucide-react';

const OPTIONS = [
  {
    key: 'quick',
    label: 'QUICK',
    subLabel: '~8 min',
    icon: Zap,
    color: 'bg-brutal-green',
    desc: 'Core concept only. Jump to quiz fast.',
    checks: false,
  },
  {
    key: 'standard',
    label: 'STANDARD',
    subLabel: '~12 min',
    icon: BookOpen,
    color: 'bg-brutal-blue',
    desc: 'Full lesson with check-ins on the key sections.',
    checks: 'partial',
  },
  {
    key: 'deep_dive',
    label: 'DEEP DIVE',
    subLabel: '~20 min',
    icon: Telescope,
    color: 'bg-brutal-pink',
    desc: 'Every section checked. Ask FINN questions. Maximum retention.',
    checks: true,
  },
];

const PacingSelector = ({ selected, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-brutal-white border-4 border-brutal-black shadow-brutal p-6 mb-6"
  >
    <h3 className="text-xl font-black text-brutal-black mb-1">HOW DO YOU WANT TO LEARN?</h3>
    <p className="text-sm font-bold text-brutal-black/50 mb-5">Pick your pace — you can change it anytime.</p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isSelected = selected === opt.key;
        return (
          <motion.button
            key={opt.key}
            whileHover={{ x: 2, y: 2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(opt.key)}
            className={`border-4 border-brutal-black text-left p-4 transition-all ${
              isSelected
                ? `${opt.color} shadow-brutal`
                : 'bg-brutal-bg shadow-brutal-sm hover:shadow-brutal'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={20} strokeWidth={2.5} className={isSelected ? 'text-brutal-black' : 'text-brutal-black/60'} />
              <span className={`font-black text-sm ${isSelected ? 'text-brutal-black' : 'text-brutal-black/80'}`}>
                {opt.label}
              </span>
              <span className={`ml-auto text-xs font-bold ${isSelected ? 'text-brutal-black/70' : 'text-brutal-black/40'}`}>
                {opt.subLabel}
              </span>
            </div>
            <p className={`text-xs font-bold leading-snug ${isSelected ? 'text-brutal-black/80' : 'text-brutal-black/50'}`}>
              {opt.desc}
            </p>
          </motion.button>
        );
      })}
    </div>
  </motion.div>
);

export default PacingSelector;
