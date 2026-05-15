import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, BarChart2, BookOpen, Target, Loader2 } from 'lucide-react';

const TYPES = [
  { value: 'analogy',    label: 'The analogy',     Icon: Brain,    desc: "I didn't connect with the comparison" },
  { value: 'math',       label: 'The numbers',     Icon: BarChart2, desc: 'The math or formula confused me' },
  { value: 'vocabulary', label: 'The words used',  Icon: BookOpen,  desc: "I don't know what some terms mean" },
  { value: 'concept',    label: 'The big picture',  Icon: Target,   desc: "I'm lost on what this even is" },
];

const ConfusionIdentifier = ({ sectionKey, onSelect, isLoading, adaptiveContent }) => {
  if (adaptiveContent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 bg-brutal-white border-4 border-brutal-black shadow-brutal-sm p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Brain size={16} strokeWidth={2.5} className="text-brutal-blue shrink-0" />
          <span className="text-xs font-black text-brutal-blue uppercase tracking-wider">FINN'S ALTERNATIVE EXPLANATION</span>
        </div>
        <p className="text-sm font-bold text-brutal-black leading-relaxed whitespace-pre-wrap">{adaptiveContent}</p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-3 bg-brutal-white border-4 border-brutal-black shadow-brutal-sm p-4 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center gap-2 py-2">
            <Loader2 size={16} strokeWidth={2.5} className="animate-spin text-brutal-blue" />
            <span className="text-sm font-black text-brutal-black/60">FINN is thinking...</span>
          </div>
        ) : (
          <>
            <p className="text-xs font-black text-brutal-black/50 uppercase tracking-widest mb-3">
              Which part is tricky?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(({ value, label, Icon, desc }) => (
                <motion.button
                  key={value}
                  whileHover={{ x: 2, y: 2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelect(sectionKey, value)}
                  className="border-2 border-brutal-black bg-brutal-bg hover:bg-brutal-blue hover:text-brutal-white text-left p-3 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} strokeWidth={2.5} className="shrink-0" />
                    <span className="font-black text-xs">{label}</span>
                  </div>
                  <p className="text-[11px] font-bold text-brutal-black/50 group-hover:text-brutal-white/70 leading-snug">
                    {desc}
                  </p>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfusionIdentifier;
