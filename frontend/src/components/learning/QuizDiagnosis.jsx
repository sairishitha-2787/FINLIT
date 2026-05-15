import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, BarChart2, BookOpen, Target, ArrowLeft, ArrowRight } from 'lucide-react';
import { gamingTheme } from '../../styles/gamingTheme';

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const AREAS = [
  {
    value: 'analogy',
    label: 'Connecting the concept',
    Icon: Brain,
    advice: 'The analogy section is your friend here. Try reading it again — maybe the comparison will click on a second look. Or hit "Explain Differently" for a fresh angle.',
    section: 'analogy',
  },
  {
    value: 'math',
    label: 'The calculations',
    Icon: BarChart2,
    advice: 'The math section breaks down all the formulas step by step. Try working through the numbers with a simple example ($100 is always a good starting point).',
    section: 'math',
  },
  {
    value: 'vocabulary',
    label: 'Understanding the terms',
    Icon: BookOpen,
    advice: 'Financial vocabulary can be a blocker. Re-read the analogy and math sections with the glossary mindset — treat each new word as a puzzle piece, not a barrier.',
    section: 'analogy',
  },
  {
    value: 'concept',
    label: 'The big picture',
    Icon: Target,
    advice: "Start with WHY IT MATTERS — that section connects the concept to your real life. Once you feel the relevance, the other parts make a lot more sense.",
    section: 'whyItMatters',
  },
];

const QuizDiagnosis = ({ score, totalQuestions, topic, onReteach, onContinue, gamingMode, gamingColors }) => {
  const [selected, setSelected] = useState(null);
  const pct = Math.round((score / totalQuestions) * 100);
  const selectedArea = AREAS.find((a) => a.value === selected);

  if (gamingMode && gamingColors) {
    const gc = gamingColors;
    const pr = hexToRgbStr(gc.primary);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: '520px', margin: '0 auto 32px',
          borderRadius: '20px',
          background: gamingTheme.cardBg,
          backdropFilter: `blur(${gamingTheme.glassBlur})`,
          border: `2px solid rgba(${pr},0.4)`,
          boxShadow: `0 0 40px rgba(${pr},0.15), ${gamingTheme.shadowDeep}`,
          overflow: 'hidden',
        }}
      >
        {/* Header band */}
        <div style={{
          padding: '20px 24px 16px',
          background: `linear-gradient(135deg, rgba(${pr},0.14) 0%, rgba(${pr},0.04) 100%)`,
          borderBottom: `1px solid rgba(${pr},0.25)`,
        }}>
          <div style={{
            fontFamily: gamingTheme.fontLabel, fontSize: '9px',
            letterSpacing: '2.5px', textTransform: 'uppercase',
            color: gc.primary, marginBottom: '6px',
          }}>
            Score: {score}/{totalQuestions} ({pct}%)
          </div>
          <h3 style={{
            fontFamily: gamingTheme.fontHeading, fontSize: '18px', fontWeight: 700,
            color: gamingTheme.stellarWhite, textTransform: 'uppercase',
            letterSpacing: '1.5px', margin: 0,
            textShadow: `0 0 12px ${gc.glow}`,
          }}>Let's find what tripped you up</h3>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <p style={{
            fontFamily: gamingTheme.fontBody, fontSize: '13px',
            color: gamingTheme.seafoam, marginBottom: '16px',
          }}>
            Which part of <strong style={{ color: gamingTheme.stellarWhite }}>{topic}</strong> felt hardest?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {AREAS.map(({ value, label, Icon }) => {
              const isActive = selected === value;
              return (
                <motion.button
                  key={value}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px', cursor: 'pointer',
                    background: isActive
                      ? `rgba(${pr},0.14)`
                      : 'rgba(47,58,95,0.5)',
                    border: isActive
                      ? `1px solid rgba(${pr},0.5)`
                      : gamingTheme.borderThin,
                    fontFamily: gamingTheme.fontBody, fontSize: '13px', fontWeight: 600,
                    color: isActive ? gamingTheme.stellarWhite : gamingTheme.seafoam,
                    textAlign: 'left', transition: 'all 0.18s ease',
                    boxShadow: isActive ? `0 0 12px rgba(${pr},0.2)` : 'none',
                  }}
                >
                  <Icon size={16} color={isActive ? gc.primary : gamingTheme.mutedBlue} />
                  {label}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedArea && (
              <motion.div
                key={selectedArea.value}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: '20px' }}
              >
                <div style={{
                  padding: '14px 16px', borderRadius: '10px',
                  background: 'rgba(78,205,196,0.08)',
                  border: '1px solid rgba(78,205,196,0.3)',
                  borderLeft: '3px solid #4ECDC4',
                }}>
                  <p style={{
                    fontFamily: gamingTheme.fontBody, fontSize: '13px',
                    color: gamingTheme.seafoam, lineHeight: 1.6, margin: 0,
                  }}>{selectedArea.advice}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
              onClick={() => onReteach(selectedArea?.section || 'analogy')}
              style={{
                flex: 1, padding: '13px',
                borderRadius: '10px', cursor: 'pointer',
                fontFamily: gamingTheme.fontHeading, fontSize: '11px',
                fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase',
                color: gamingTheme.seafoam,
                background: 'rgba(61,78,122,0.5)',
                border: gamingTheme.borderThin,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <ArrowLeft size={14} /> Review Lesson
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
              onClick={onContinue}
              style={{
                flex: 1, padding: '13px',
                borderRadius: '10px', cursor: 'pointer',
                fontFamily: gamingTheme.fontHeading, fontSize: '11px',
                fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                color: gamingTheme.bgDark,
                background: `linear-gradient(135deg, ${gc.primary}, ${gc.secondary})`,
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: `0 4px 16px ${gc.glow}`,
              }}
            >
              Keep Going <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brutal-white border-4 border-brutal-black shadow-brutal p-6 max-w-lg mx-auto mb-8"
    >
      {/* Header */}
      <div className="bg-brutal-pink border-b-4 border-brutal-black -mx-6 -mt-6 px-6 py-4 mb-5">
        <span className="text-xs font-black tracking-widest text-brutal-black/60 uppercase">SCORE: {score}/{totalQuestions} ({pct}%)</span>
        <h3 className="text-2xl font-black text-brutal-black mt-0.5">Let's figure out what tripped you up</h3>
      </div>

      <p className="text-sm font-bold text-brutal-black/60 mb-4">
        Which part of <span className="text-brutal-black">{topic}</span> felt hardest?
      </p>

      <div className="space-y-2 mb-5">
        {AREAS.map(({ value, label, Icon }) => (
          <motion.button
            key={value}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(value)}
            className={`w-full flex items-center gap-3 px-4 py-3 border-2 border-brutal-black font-bold text-sm text-left transition-all ${
              selected === value
                ? 'bg-brutal-blue text-brutal-white shadow-brutal-sm'
                : 'bg-brutal-bg text-brutal-black hover:bg-brutal-bg/60'
            }`}
          >
            <Icon size={16} strokeWidth={2.5} className="shrink-0" />
            {label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedArea && (
          <motion.div
            key={selectedArea.value}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-brutal-green border-2 border-brutal-black p-4 mb-5">
              <p className="text-sm font-bold text-brutal-black leading-relaxed">{selectedArea.advice}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ x: 2, y: 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onReteach(selectedArea?.section || 'analogy')}
          className="flex-1 bg-brutal-black border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal py-3 font-black text-sm text-brutal-white flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft size={14} strokeWidth={2.5} /> REVIEW THE LESSON
        </motion.button>
        <motion.button
          whileHover={{ x: 2, y: 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          className="flex-1 bg-brutal-bg border-2 border-brutal-black shadow-brutal-sm hover:shadow-brutal py-3 font-black text-sm text-brutal-black flex items-center justify-center gap-2 transition-all"
        >
          KEEP SCORE <ArrowRight size={14} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuizDiagnosis;
