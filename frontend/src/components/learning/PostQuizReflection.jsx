import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { gamingTheme } from '../../styles/gamingTheme';

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const ITEMS = [
  { key: 'analogy',     label: 'The analogy / comparison' },
  { key: 'math',        label: 'The math breakdown' },
  { key: 'domain',      label: 'How it connected to my interests' },
  { key: 'examples',    label: 'The real-world examples' },
  { key: 'stepbystep',  label: 'The step-by-step walkthrough' },
];

const STORAGE_KEY = 'finlit_learning_style';

const PostQuizReflection = ({ onDone, gamingMode, gamingColors }) => {
  const [selected, setSelected] = useState([]);

  const toggle = (key) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const handleDone = () => {
    if (selected.length > 0) {
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const updated = { ...existing };
        selected.forEach((k) => { updated[k] = (updated[k] || 0) + 1; });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
    }
    onDone();
  };

  if (gamingMode && gamingColors) {
    const gc = gamingColors;
    const pr = hexToRgbStr(gc.primary);
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          maxWidth: '480px', margin: '0 auto 32px',
          borderRadius: '16px',
          background: gamingTheme.cardBg,
          backdropFilter: `blur(${gamingTheme.glassBlur})`,
          border: `1px solid rgba(${pr},0.3)`,
          boxShadow: gamingTheme.shadowDeep,
          padding: '24px',
        }}
      >
        <div style={{
          fontFamily: gamingTheme.fontLabel, fontSize: '9px',
          letterSpacing: '2.5px', textTransform: 'uppercase',
          color: gc.primary, marginBottom: '6px',
        }}>Post-Quest Reflection</div>
        <h3 style={{
          fontFamily: gamingTheme.fontHeading, fontSize: '16px', fontWeight: 700,
          color: gamingTheme.stellarWhite, textTransform: 'uppercase',
          letterSpacing: '1.5px', marginBottom: '4px',
        }}>Quick reflection</h3>
        <p style={{
          fontFamily: gamingTheme.fontBody, fontSize: '13px',
          color: gamingTheme.mutedBlue, marginBottom: '18px',
        }}>What helped you learn this? (pick anything)</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '20px' }}>
          {ITEMS.map(({ key, label }) => {
            const isOn = selected.includes(key);
            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '9px', cursor: 'pointer',
                  background: isOn
                    ? `rgba(${pr},0.12)`
                    : 'rgba(47,58,95,0.45)',
                  border: isOn
                    ? `1px solid rgba(${pr},0.45)`
                    : gamingTheme.borderThin,
                  fontFamily: gamingTheme.fontBody, fontSize: '13px', fontWeight: 600,
                  color: isOn ? gamingTheme.stellarWhite : gamingTheme.seafoam,
                  textAlign: 'left', transition: 'all 0.18s ease',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '5px', flexShrink: 0,
                  background: isOn ? gc.primary : 'rgba(61,78,122,0.6)',
                  border: `1px solid ${isOn ? gc.primary : 'rgba(139,184,233,0.3)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.18s ease',
                }}>
                  {isOn && <Check size={11} strokeWidth={3} color={gamingTheme.bgDark} />}
                </div>
                {label}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
          onClick={handleDone}
          style={{
            width: '100%', padding: '14px',
            borderRadius: '10px', cursor: 'pointer',
            fontFamily: gamingTheme.fontHeading, fontSize: '12px',
            fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
            color: gamingTheme.bgDark,
            background: `linear-gradient(135deg, ${gc.primary}, ${gc.secondary})`,
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: `0 4px 18px ${gc.glow}`,
          }}
        >
          Done <ArrowRight size={15} />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-brutal-white border-4 border-brutal-black shadow-brutal p-6 max-w-lg mx-auto mb-8"
    >
      <h3 className="text-lg font-black text-brutal-black mb-1">Quick reflection</h3>
      <p className="text-sm font-bold text-brutal-black/50 mb-4">What helped you learn this? (pick anything)</p>

      <div className="space-y-2 mb-5">
        {ITEMS.map(({ key, label }) => {
          const isOn = selected.includes(key);
          return (
            <motion.button
              key={key}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggle(key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 border-2 border-brutal-black text-sm font-bold text-left transition-all ${
                isOn ? 'bg-brutal-green text-brutal-black' : 'bg-brutal-bg text-brutal-black/70 hover:bg-brutal-bg/60'
              }`}
            >
              <div className={`w-4 h-4 border-2 border-brutal-black shrink-0 flex items-center justify-center ${isOn ? 'bg-brutal-black' : 'bg-brutal-white'}`}>
                {isOn && <div className="w-2 h-2 bg-brutal-white" />}
              </div>
              {label}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ x: 2, y: 2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleDone}
        className="w-full bg-brutal-black border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal py-3 font-black text-sm text-brutal-white flex items-center justify-center gap-2 transition-all"
      >
        DONE <ArrowRight size={14} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
};

export default PostQuizReflection;
