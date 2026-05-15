import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, HelpCircle, XCircle } from 'lucide-react';

const OPTIONS = [
  { value: 'yes',    label: 'Got it!',    Icon: CheckCircle, bg: 'bg-brutal-green', text: 'text-brutal-black' },
  { value: 'sortof', label: 'Sort of...',  Icon: HelpCircle,  bg: 'bg-brutal-blue',  text: 'text-brutal-white' },
  { value: 'no',     label: 'Lost me',    Icon: XCircle,     bg: 'bg-brutal-pink',  text: 'text-brutal-black' },
];

const ComprehensionCheck = ({ sectionKey, response, onResponse, isDark = false }) => {
  const labelColor = isDark ? 'text-brutal-white/40' : 'text-brutal-black/40';
  const borderColor = isDark ? 'border-brutal-white/20' : 'border-brutal-black/10';

  if (response === 'yes') {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className={`border-t-2 ${borderColor} mt-3 pt-3 flex items-center gap-2`}
      >
        <CheckCircle size={14} strokeWidth={2.5} className="text-brutal-green" />
        <span className={`text-xs font-black ${labelColor}`}>UNDERSTOOD</span>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border-t-2 ${borderColor} mt-4 pt-4`}
      >
        <p className={`text-xs font-black ${labelColor} uppercase tracking-widest mb-2`}>
          Did this make sense?
        </p>
        <div className="flex gap-2 flex-wrap">
          {OPTIONS.map(({ value, label, Icon, bg, text }) => (
            <motion.button
              key={value}
              whileHover={{ x: 1, y: 1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onResponse(sectionKey, value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-brutal-black font-black text-xs transition-all ${
                response === value
                  ? `${bg} ${text} shadow-brutal-sm`
                  : 'bg-brutal-bg text-brutal-black/60 hover:bg-brutal-bg/80'
              }`}
            >
              <Icon size={12} strokeWidth={2.5} />
              {label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComprehensionCheck;
