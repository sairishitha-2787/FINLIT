// FINLIT - Neo-Brutalist Quiz Card Component
// Question display with stark design

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { gamingTheme } from '../../styles/gamingTheme';

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const optionText = (opt) => (opt && typeof opt === 'object' ? opt.text : opt);

const FQ = { h: "'Playfair Display',serif", ui: "'DM Sans',sans-serif" };
const FC = { deep: '#9d1f4a', mid: '#d4537e', body: '#b0627a', label: '#c98a9e', pink: '#f7a0b8' };

const QuizCard = ({ question, questionNumber, selectedAnswer, onSelectAnswer, totalQuestions, gamingMode, gamingColors, fashionMode }) => {
  const answerLabels = ['A', 'B', 'C', 'D'];
  const gc = gamingColors || {};

  // ── Sports theme override ────────────────────────────────────────────────────
  const sm = !!(gamingMode && gc.sports);
  const xt = {
    cardBg: sm ? 'rgba(22,22,22,0.95)'            : gamingTheme.cardBg,
    fontH:  sm ? "'Bebas Neue', cursive"           : gamingTheme.fontHeading,
    fontL:  sm ? "'Barlow Condensed', sans-serif"  : gamingTheme.fontLabel,
    fontB:  sm ? "'Inter', sans-serif"             : gamingTheme.fontBody,
    text1:  sm ? '#fff'                            : gamingTheme.stellarWhite,
    text2:  sm ? 'rgba(255,255,255,0.72)'          : gamingTheme.seafoam,
    muted:  sm ? 'rgba(255,255,255,0.4)'           : gamingTheme.mutedBlue,
    border: sm ? '1px solid rgba(255,255,255,0.1)' : gamingTheme.borderThin,
    blur:   sm ? '16px'                            : gamingTheme.glassBlur,
    dark:   sm ? '#000'                            : gamingTheme.bgDark,
    shadow: sm ? 'none'                            : gamingTheme.shadowCard,
  };

  // ── Fashion render ──────────────────────────────────────────────────────────
  if (fashionMode) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(24px) saturate(200%)', WebkitBackdropFilter: 'blur(24px) saturate(200%)', borderTop: '1.5px solid rgba(255,255,255,0.65)', borderLeft: '1.5px solid rgba(255,255,255,0.65)', borderBottom: '1.5px solid rgba(247,160,184,0.28)', borderRight: '1.5px solid rgba(247,160,184,0.28)', borderRadius: 24, padding: '28px', boxShadow: '0 16px 48px rgba(247,160,184,0.18), 0 6px 20px rgba(192,132,252,0.10)' }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <span style={{ fontFamily: FQ.ui, fontSize: 10, color: FC.label, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Look {questionNumber} of {totalQuestions}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[...Array(totalQuestions)].map((_, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i + 1 === questionNumber ? FC.pink : 'rgba(247,160,184,0.25)', boxShadow: i + 1 === questionNumber ? '0 0 6px rgba(247,160,184,0.55)' : 'none', transition: 'all 0.2s' }} />
            ))}
          </div>
        </div>
        {/* Question */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: FQ.h, fontSize: 20, fontWeight: 500, color: FC.deep, lineHeight: 1.45, margin: 0 }}>
            {question.question || question.text || question.prompt || ''}
          </h2>
        </motion.div>
        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {question.options.map((option, index) => {
            const label = answerLabels[index];
            const sel = selectedAnswer === label;
            return (
              <motion.div key={index} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07 }}
                onClick={() => onSelectAnswer(label)} whileHover={!sel ? { y: -2 } : {}} whileTap={{ scale: 0.99 }}
                style={{ padding: '14px 18px', borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, background: sel ? 'rgba(247,160,184,0.12)' : 'rgba(255,255,255,0.35)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.62)', borderLeft: '1px solid rgba(255,255,255,0.55)', borderBottom: sel ? '1.5px solid rgba(247,160,184,0.50)' : '1px solid rgba(247,160,184,0.18)', borderRight: sel ? '1.5px solid rgba(247,160,184,0.35)' : '1px solid rgba(247,160,184,0.18)', boxShadow: sel ? '0 0 16px rgba(247,160,184,0.18)' : 'none', transition: 'all 0.18s ease' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: sel ? 'rgba(247,160,184,0.18)' : 'rgba(255,255,255,0.38)', border: sel ? '1px solid rgba(247,160,184,0.48)' : '1px solid rgba(255,255,255,0.58)' }}>
                  <span style={{ fontFamily: FQ.ui, fontWeight: 600, fontSize: 12, color: sel ? FC.deep : FC.label }}>{label}</span>
                </div>
                <p style={{ flex: 1, fontFamily: FQ.ui, fontSize: 14, color: sel ? FC.deep : FC.body, margin: 0, lineHeight: 1.4 }}>{optionText(option)}</p>
                {sel && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#f7a0b8,#c084fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={11} strokeWidth={3} color="#fff" /></motion.div>}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (gamingMode && gc.primary) {
    return (
      <div style={{ background: xt.cardBg, border: xt.border, borderRadius: '16px', padding: '28px', backdropFilter: `blur(${xt.blur})`, boxShadow: xt.shadow }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <span style={{ fontFamily: xt.fontL, fontSize: '9px', color: gc.primary, letterSpacing: '2px' }}>Q{questionNumber} / {totalQuestions}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[...Array(totalQuestions)].map((_, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i + 1 === questionNumber ? gc.primary : 'rgba(139,184,233,0.25)', boxShadow: i + 1 === questionNumber ? `0 0 6px ${gc.glow}` : 'none', transition: 'all 0.2s' }} />
            ))}
          </div>
        </div>

        {/* Question text */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
          <h2 style={{ fontFamily: xt.fontB, fontSize: '20px', fontWeight: 600, color: xt.text1, lineHeight: 1.5, margin: 0 }}>{question.question || question.text || question.prompt || ''}</h2>
        </motion.div>

        {/* Answer options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.options.map((option, index) => {
            const label = answerLabels[index];
            const isSelected = selectedAnswer === label;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
                onClick={() => onSelectAnswer(label)}
                whileHover={{ scale: isSelected ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{ padding: '14px 18px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', background: isSelected ? `rgba(${hexToRgbStr(gc.primary)},0.15)` : 'rgba(30,42,69,0.55)', border: isSelected ? `1.5px solid ${gc.primary}` : '1px solid rgba(139,184,233,0.18)', boxShadow: isSelected ? `0 0 12px ${gc.glow}` : 'none', transition: 'all 0.18s ease' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? `rgba(${hexToRgbStr(gc.primary)},0.25)` : 'rgba(61,78,122,0.6)', border: `1px solid rgba(${hexToRgbStr(gc.primary)},${isSelected ? '0.6' : '0.2'})` }}>
                  <span style={{ fontFamily: xt.fontH, fontSize: '11px', fontWeight: 700, color: isSelected ? gc.primary : xt.muted }}>{label}</span>
                </div>
                <p style={{ flex: 1, fontFamily: xt.fontB, fontSize: '15px', color: isSelected ? xt.text1 : xt.text2, margin: 0, lineHeight: 1.4 }}>{optionText(option)}</p>
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 20, height: 20, borderRadius: '50%', background: gc.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={11} strokeWidth={3} color={xt.dark} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Brutalist render
  return (
    <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal rounded-none p-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="bg-brutal-blue border-2 border-brutal-black px-4 py-2 rounded-none">
          <span className="font-black text-brutal-white">
            Q{questionNumber}/{totalQuestions}
          </span>
        </div>
        <div className="flex gap-2">
          {[...Array(totalQuestions)].map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 border-2 border-brutal-black rounded-none ${
                index + 1 === questionNumber ? 'bg-brutal-blue' : 'bg-brutal-bg'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-black text-brutal-black leading-tight">
          {question.question || question.text || question.prompt || ''}
        </h2>
      </motion.div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.options.map((option, index) => {
          const answerLabel = answerLabels[index];
          const isSelected = selectedAnswer === answerLabel;

          return (
            <AnswerOption
              key={index}
              label={answerLabel}
              option={option}
              isSelected={isSelected}
              onSelect={() => onSelectAnswer(answerLabel)}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};

const AnswerOption = ({ label, option, isSelected, onSelect, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      whileHover={{ x: isSelected ? 0 : 4, y: isSelected ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        p-5 border-4 border-brutal-black cursor-pointer transition-all rounded-none
        ${isSelected
          ? 'bg-brutal-pink shadow-brutal-hover'
          : 'bg-brutal-bg shadow-brutal hover:shadow-brutal-hover'
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Label Circle */}
        <div
          className={`
            w-12 h-12 border-4 border-brutal-black rounded-none flex items-center justify-center font-black text-xl
            ${isSelected ? 'bg-brutal-white' : 'bg-brutal-white'}
          `}
        >
          {label}
        </div>

        {/* Option Text */}
        <div className="flex-1">
          <p className="text-brutal-black font-bold text-lg">
            {optionText(option)}
          </p>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 bg-brutal-green border-2 border-brutal-black rounded-none flex items-center justify-center"
          >
            <Check size={14} strokeWidth={3} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default QuizCard;
