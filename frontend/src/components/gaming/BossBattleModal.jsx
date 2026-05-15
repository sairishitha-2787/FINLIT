// FINLIT — Boss Battle Modal
// Entrance → Battle (quiz) → Victory | Defeat
// Per-island questions, 70% pass threshold, XP on victory

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Skull, Swords, Trophy, RotateCcw, Zap, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { gamingTheme } from '../../styles/gamingTheme';
import { useIsMobile } from '../../hooks/useIsMobile';

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

// ── Zone theme colours (match IslandMap ISLAND_THEMES) ────────────────────────
const ZONE_COLORS = {
  tutorial: { primary: '#4ECDC4', glow: 'rgba(78,205,196,0.35)' },
  citadel:  { primary: '#818CF8', glow: 'rgba(129,140,248,0.35)' },
  rift:     { primary: '#F87171', glow: 'rgba(248,113,113,0.35)' },
};

// ── Per-island boss questions ─────────────────────────────────────────────────
const BOSS_QUESTIONS = {
  boss_tutorial: [
    {
      question: 'You earn $3,500/month. Using the 50/30/20 rule, how much should go toward savings?',
      options: ['$350 — 10%', '$700 — 20%', '$1,050 — 30%', '$1,750 — 50%'],
      correctIndex: 1,
      explanation: '20% of $3,500 = $700. The 20% slice covers savings, investing, and debt repayment.',
    },
    {
      question: 'Simple interest formula: $2,000 invested at 5% per year for 3 years. How much total interest is earned?',
      options: ['$100', '$200', '$300', '$600'],
      correctIndex: 2,
      explanation: 'I = P × r × t = 2,000 × 0.05 × 3 = $300. Simple interest does NOT compound.',
    },
    {
      question: 'You\'re a freelancer with irregular income. How many months of expenses should your emergency fund cover?',
      options: ['1 month', '3 months', '3–6 months', '6–12 months'],
      correctIndex: 3,
      explanation: 'Freelancers face variable income. 6–12 months gives a much larger safety net than the standard 3–6.',
    },
    {
      question: 'Monthly costs: Rent $900, Groceries $400, Netflix $15, Gym $50. Which are "needs" vs "wants"?',
      options: ['Only rent is a need', 'Rent + groceries are needs', 'All four are needs', 'Netflix + gym are needs'],
      correctIndex: 1,
      explanation: 'Needs = housing and food. Subscriptions and gym memberships are discretionary wants.',
    },
    {
      question: '"Pay yourself first" is a budgeting strategy that means:',
      options: ['Spend freely before paying bills', 'Transfer savings before spending on anything else', 'Buy wants before paying rent', 'Spend your whole paycheck, then save the rest'],
      correctIndex: 1,
      explanation: 'Automating savings the moment you\'re paid ensures you save consistently before lifestyle spending can drain the budget.',
    },
  ],

  boss_citadel: [
    {
      question: '$5,000 invested at 8% compounded annually for 5 years. What is the approximate final balance?',
      options: ['$6,000', '$7,000', '$7,347', '$8,500'],
      correctIndex: 2,
      explanation: '5000 × 1.08⁵ ≈ $7,347. Compound growth accelerates because interest earns interest.',
    },
    {
      question: 'Which single factor has the LARGEST impact on your FICO credit score?',
      options: ['Length of credit history (15%)', 'Payment history (35%)', 'Credit utilization (30%)', 'Types of credit (10%)'],
      correctIndex: 1,
      explanation: 'Payment history accounts for 35% of your score. One missed payment can drop it significantly.',
    },
    {
      question: 'Rule of 72: at a 6% annual return, approximately how many years until your money doubles?',
      options: ['6 years', '9 years', '12 years', '18 years'],
      correctIndex: 2,
      explanation: '72 ÷ 6 = 12 years. A quick mental math shortcut for estimating doubling time.',
    },
    {
      question: 'A stock has a P/E ratio of 30. What does that mean?',
      options: ['Investors pay $30 per $1 of annual earnings', 'The stock pays $30 in dividends per year', 'The stock grew 30% this year', 'There are 30 shares outstanding'],
      correctIndex: 0,
      explanation: 'P/E = Price ÷ Earnings. A P/E of 30 means the market pays $30 for every $1 the company earns annually.',
    },
    {
      question: 'If interest rates rise sharply, what typically happens to existing bond prices?',
      options: ['Bond prices rise in sync', 'Bond prices fall', 'Bond prices are unaffected', 'Bonds convert into stocks'],
      correctIndex: 1,
      explanation: 'Bonds have an inverse relationship with rates. Newly issued bonds offer higher yields, making existing lower-yield bonds less attractive and cheaper.',
    },
  ],

  boss_rift: [
    {
      question: 'The debt avalanche method means you pay off debts in what order?',
      options: ['Smallest balance first', 'Largest balance first', 'Highest interest rate first', 'Oldest debt first'],
      correctIndex: 2,
      explanation: 'Avalanche = highest APR first. It minimises total interest paid, saving the most money mathematically.',
    },
    {
      question: 'A Roth IRA is better than a Traditional IRA when you expect to be in a:',
      options: ['Lower tax bracket in retirement', 'Higher tax bracket in retirement', 'The same tax bracket', 'No tax bracket (retired abroad)'],
      correctIndex: 1,
      explanation: 'Roth: contribute after-tax now, withdraw tax-free later. Ideal when future tax rates will be higher.',
    },
    {
      question: 'Your marginal federal tax rate is 22%. A $10,000 tax deduction saves you exactly:',
      options: ['$10,000', '$2,200', '$780', '$4,400'],
      correctIndex: 1,
      explanation: 'Deductions reduce taxable income, not taxes directly. $10,000 × 22% = $2,200 saved.',
    },
    {
      question: 'At a 9% annual return, how many years does it take $10,000 to grow to $20,000? (Rule of 72)',
      options: ['6 years', '8 years', '9 years', '12 years'],
      correctIndex: 1,
      explanation: '72 ÷ 9 = 8 years. The doubling time shortcut saves you from having to calculate 1.09ⁿ = 2.',
    },
    {
      question: 'A well-diversified portfolio protects you by:',
      options: ['Owning one strong company\'s stock', 'Spreading investments across asset classes and sectors', 'Keeping all money in bonds', 'Moving in and out of the market daily'],
      correctIndex: 1,
      explanation: 'Diversification spreads risk. If one sector drops, gains elsewhere cushion the blow.',
    },
  ],
};

// Fallback questions if a boss has no specific data
const FALLBACK_QUESTIONS = BOSS_QUESTIONS.boss_tutorial;

const PASS_THRESHOLD = 0.7; // 70% required

// ── Component ─────────────────────────────────────────────────────────────────

export default function BossBattleModal({ island, colors, onVictory, onDefeat, onClose }) {
  const { isMobile } = useIsMobile();
  const [stage, setStage] = useState('entrance'); // entrance | battle | victory | defeat
  const [idx, setIdx]     = useState(0);
  const [selected, setSelected]   = useState(null);
  const [answered, setAnswered]   = useState(false);
  const [results, setResults]     = useState([]);   // { correct: bool }[]
  const confettiFired = useRef(false);

  const zoneColors = ZONE_COLORS[island?.id] || ZONE_COLORS.tutorial;
  const zc = zoneColors; // zone colour
  const ec = colors;     // character element colour

  const questions = BOSS_QUESTIONS[island?.bossId] || FALLBACK_QUESTIONS;
  const q = questions[idx];
  const totalQ = questions.length;
  const requiredCorrect = Math.ceil(totalQ * PASS_THRESHOLD);

  // Reset on open
  useEffect(() => {
    setStage('entrance');
    setIdx(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    confettiFired.current = false;
  }, [island?.bossId]);

  // Fire confetti on victory stage
  useEffect(() => {
    if (stage === 'victory' && !confettiFired.current) {
      confettiFired.current = true;
      const opts = { particleCount: 80, spread: 70, startVelocity: 45, colors: [zc.primary, ec.primary, '#F0FFFA'] };
      confetti({ ...opts, origin: { x: 0.25, y: 0.6 } });
      setTimeout(() => confetti({ ...opts, origin: { x: 0.75, y: 0.6 } }), 300);
    }
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnswer(optionIdx) {
    if (answered) return;
    const correct = optionIdx === q.correctIndex;
    setSelected(optionIdx);
    setAnswered(true);
    const newResults = [...results, { correct }];
    setResults(newResults);

    setTimeout(() => {
      if (idx < totalQ - 1) {
        setIdx(i => i + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        // Quiz complete
        const correctCount = newResults.filter(r => r.correct).length;
        const passed = correctCount >= requiredCorrect;
        if (passed) {
          setStage('victory');
          onVictory?.();
        } else {
          setStage('defeat');
          onDefeat?.();
        }
      }
    }, 1600);
  }

  function handleRetry() {
    setStage('entrance');
    setIdx(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    confettiFired.current = false;
  }

  const correctCount = results.filter(r => r.correct).length;
  const progress = totalQ > 0 ? ((idx + (answered ? 1 : 0)) / totalQ) * 100 : 0;

  // ── Shared card style ──────────────────────────────────────────────────────

  const cardStyle = {
    position: 'fixed', inset: 0,
    background: 'rgba(10,14,30,0.94)',
    backdropFilter: 'blur(14px)',
    zIndex: 800,
    display: 'flex',
    alignItems: isMobile ? 'flex-start' : 'center',
    justifyContent: 'center',
    padding: isMobile ? '0' : '20px',
  };

  const panelStyle = isMobile ? {
    width: '100%', height: '100%',
    overflowY: 'auto',
    borderRadius: '0',
    background: 'rgba(20,28,52,0.99)',
    padding: '24px 16px',
    position: 'relative',
    border: 'none',
  } : {
    width: '100%', maxWidth: '560px',
    maxHeight: '90vh', overflowY: 'auto',
    borderRadius: '20px',
    background: 'rgba(20,28,52,0.98)',
    backdropFilter: `blur(${gamingTheme.glassBlur})`,
    boxShadow: `0 0 80px ${zc.glow}, 0 24px 64px rgba(0,0,0,0.6)`,
    padding: '40px 36px',
    position: 'relative',
    border: `2px solid rgba(${hexToRgbStr(zc.primary)},0.5)`,
  };

  const gradientBtn = {
    padding: '14px 32px',
    fontFamily: gamingTheme.fontHeading, fontSize: '13px', fontWeight: 700,
    letterSpacing: '2px', textTransform: 'uppercase',
    color: gamingTheme.bgDark,
    background: `linear-gradient(135deg, ${zc.primary}, ${ec.primary || zc.primary})`,
    border: 'none', borderRadius: '12px', cursor: 'pointer',
    boxShadow: `0 4px 24px ${zc.glow}`,
  };

  const ghostBtn = {
    padding: '14px 24px',
    fontFamily: gamingTheme.fontHeading, fontSize: '13px', fontWeight: 600,
    letterSpacing: '1.5px', textTransform: 'uppercase',
    color: gamingTheme.seafoam,
    background: 'rgba(61,78,122,0.4)',
    border: gamingTheme.borderThin, borderRadius: '12px', cursor: 'pointer',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={cardStyle}
    >
      <motion.div
        initial={isMobile ? { y: '100%' } : { scale: 0.88, y: 32 }}
        animate={isMobile ? { y: 0 } : { scale: 1, y: 0 }}
        exit={isMobile ? { y: '100%' } : { scale: 0.88, y: 32 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        style={panelStyle}
      >
        {/* ── ENTRANCE ────────────────────────────────────────────── */}
        {stage === 'entrance' && (
          <>
            {/* Close */}
            <button onClick={onClose} style={{
              position: 'absolute', top: 16, right: 16,
              width: 32, height: 32, borderRadius: '8px',
              background: 'rgba(61,78,122,0.4)',
              border: '1px solid rgba(139,184,233,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <X size={15} color={gamingTheme.mutedBlue} />
            </button>

            <div style={{ textAlign: 'center' }}>
              {/* Pulsing boss icon */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                style={{
                  width: 100, height: 100, borderRadius: '22px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `linear-gradient(135deg, rgba(${hexToRgbStr(zc.primary)},0.2) 0%, rgba(15,20,40,0.85) 100%)`,
                  border: `2px solid ${zc.primary}`,
                  boxShadow: `0 0 40px ${zc.glow}`,
                  margin: '0 auto 24px',
                }}
              >
                <island.bossIcon size={52} color={zc.primary} />
              </motion.div>

              <div style={{ fontFamily: gamingTheme.fontLabel, fontSize: '9px', letterSpacing: '3px', color: zc.primary, textTransform: 'uppercase', marginBottom: '8px' }}>
                Boss Encounter
              </div>

              <h2 style={{
                fontFamily: gamingTheme.fontHeading, fontSize: '26px', fontWeight: 800,
                color: gamingTheme.stellarWhite, textTransform: 'uppercase',
                letterSpacing: '2px', textShadow: `0 0 24px ${zc.glow}`,
                margin: '0 0 10px',
              }}>
                {island.bossName}
              </h2>

              <p style={{ fontFamily: gamingTheme.fontBody, fontSize: '14px', color: gamingTheme.seafoam, lineHeight: 1.6, marginBottom: '24px' }}>
                You've mastered all topics in{' '}
                <strong style={{ color: gamingTheme.stellarWhite }}>{island.name}</strong>.
                {' '}Face the boss and prove your financial mastery!
              </p>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
                {[
                  { label: 'Questions', value: totalQ },
                  { label: 'To Pass', value: `${Math.round(PASS_THRESHOLD * 100)}%` },
                  { label: 'XP Reward', value: `+${island.bossXP}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    flex: 1, padding: '12px 8px', borderRadius: '12px', textAlign: 'center',
                    background: `rgba(${hexToRgbStr(zc.primary)},0.08)`,
                    border: `1px solid rgba(${hexToRgbStr(zc.primary)},0.25)`,
                  }}>
                    <div style={{ fontFamily: gamingTheme.fontHeading, fontSize: '20px', fontWeight: 800, color: zc.primary, marginBottom: '4px' }}>{value}</div>
                    <div style={{ fontFamily: gamingTheme.fontLabel, fontSize: '8px', letterSpacing: '1.5px', color: gamingTheme.mutedBlue, textTransform: 'uppercase' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div style={{
                padding: '10px 16px', borderRadius: '10px', marginBottom: '28px',
                background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)',
                fontFamily: gamingTheme.fontLabel, fontSize: '10px', letterSpacing: '1px',
                color: '#FBBF24',
              }}>
                Answer {requiredCorrect}/{totalQ} correctly to defeat this boss
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: `0 8px 32px ${zc.glow}` }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setStage('battle')}
                style={{ ...gradientBtn, width: '100%', padding: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <Swords size={18} /> Begin Battle
              </motion.button>
            </div>
          </>
        )}

        {/* ── BATTLE ──────────────────────────────────────────────── */}
        {stage === 'battle' && q && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`q-${idx}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.22 }}
            >
              {/* Progress */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: gamingTheme.fontLabel, fontSize: '9px', letterSpacing: '2px', color: gamingTheme.mutedBlue }}>
                    QUESTION {idx + 1} / {totalQ}
                  </span>
                  <span style={{ fontFamily: gamingTheme.fontLabel, fontSize: '9px', letterSpacing: '1px', color: zc.primary }}>
                    {correctCount} correct so far
                  </span>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(61,78,122,0.5)', overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ height: '100%', borderRadius: '3px', background: `linear-gradient(90deg, ${zc.primary}, ${gamingTheme.mint})`, boxShadow: `0 0 8px ${zc.glow}` }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div style={{
                background: gamingTheme.cardBg,
                backdropFilter: `blur(${gamingTheme.glassBlur})`,
                border: `1px solid rgba(${hexToRgbStr(zc.primary)},0.25)`,
                borderRadius: '14px', padding: '22px 20px', marginBottom: '16px',
              }}>
                <p style={{
                  fontFamily: gamingTheme.fontBody, fontSize: '16px', fontWeight: 500,
                  color: gamingTheme.stellarWhite, lineHeight: 1.65, margin: 0,
                }}>
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect  = answered && i === q.correctIndex;
                  const isWrong    = answered && isSelected && i !== q.correctIndex;

                  return (
                    <motion.button
                      key={i}
                      whileHover={!answered ? { x: 3 } : {}}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswer(i)}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '13px 16px',
                        fontFamily: gamingTheme.fontBody, fontSize: '14px',
                        color: isCorrect ? gamingTheme.bgDark : isWrong ? gamingTheme.stellarWhite : gamingTheme.seafoam,
                        background: isCorrect
                          ? `rgba(${hexToRgbStr(gamingTheme.mint)},0.85)`
                          : isWrong
                            ? 'rgba(248,113,113,0.3)'
                            : isSelected
                              ? `rgba(${hexToRgbStr(zc.primary)},0.18)`
                              : `rgba(${hexToRgbStr(zc.primary)},0.06)`,
                        border: isCorrect
                          ? `1.5px solid ${gamingTheme.mint}`
                          : isWrong
                            ? '1.5px solid rgba(248,113,113,0.8)'
                            : isSelected
                              ? `1.5px solid rgba(${hexToRgbStr(zc.primary)},0.7)`
                              : `1px solid rgba(${hexToRgbStr(zc.primary)},0.2)`,
                        borderRadius: '10px',
                        cursor: answered ? 'default' : 'pointer',
                        transition: 'all 0.18s ease',
                        display: 'flex', alignItems: 'center', gap: '10px',
                      }}
                    >
                      {answered && isCorrect && <CheckCircle size={15} color={gamingTheme.bgDark} style={{ flexShrink: 0 }} />}
                      {answered && isWrong    && <XCircle    size={15} color="#F87171"              style={{ flexShrink: 0 }} />}
                      {!(answered && (isCorrect || isWrong)) && (
                        <span style={{
                          width: 22, height: 22, borderRadius: '6px', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isSelected ? `rgba(${hexToRgbStr(zc.primary)},0.3)` : 'rgba(61,78,122,0.5)',
                          border: `1px solid rgba(${hexToRgbStr(zc.primary)},${isSelected ? '0.7' : '0.2'})`,
                          fontFamily: gamingTheme.fontHeading, fontSize: '9px', fontWeight: 700,
                          color: isSelected ? zc.primary : gamingTheme.mutedBlue,
                        }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                      )}
                      <span>{opt}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation after answer */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      marginTop: '14px', padding: '12px 16px', borderRadius: '10px',
                      background: selected === q.correctIndex ? 'rgba(78,205,196,0.08)' : 'rgba(248,113,113,0.08)',
                      border: `1px solid ${selected === q.correctIndex ? 'rgba(78,205,196,0.3)' : 'rgba(248,113,113,0.3)'}`,
                    }}
                  >
                    <p style={{ fontFamily: gamingTheme.fontBody, fontSize: '12px', color: gamingTheme.seafoam, margin: 0, lineHeight: 1.6 }}>
                      {q.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── VICTORY ─────────────────────────────────────────────── */}
        {stage === 'victory' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, 360] }}
              transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.8, repeat: Infinity } }}
              style={{
                width: 104, height: 104, borderRadius: '50%', margin: '0 auto 24px',
                background: `linear-gradient(135deg, ${zc.primary}, ${ec.primary || zc.primary})`,
                border: `2px solid ${zc.primary}`,
                boxShadow: `0 0 48px ${zc.glow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Trophy size={52} color={gamingTheme.bgDark} />
            </motion.div>

            <div style={{ fontFamily: gamingTheme.fontLabel, fontSize: '9px', letterSpacing: '3px', color: zc.primary, marginBottom: '8px' }}>Boss Defeated</div>

            <h2 style={{
              fontFamily: gamingTheme.fontHeading, fontSize: '32px', fontWeight: 800,
              color: gamingTheme.stellarWhite, textTransform: 'uppercase', letterSpacing: '3px',
              textShadow: `0 0 30px ${zc.glow}`, margin: '0 0 8px',
            }}>
              Victory!
            </h2>

            <p style={{ fontFamily: gamingTheme.fontBody, fontSize: '14px', color: gamingTheme.seafoam, marginBottom: '28px' }}>
              You defeated <strong style={{ color: gamingTheme.stellarWhite }}>{island.bossName}</strong>!
            </p>

            {/* Score + XP */}
            <div style={{
              padding: '20px', borderRadius: '14px', marginBottom: '28px',
              background: `rgba(${hexToRgbStr(zc.primary)},0.1)`,
              border: `1px solid rgba(${hexToRgbStr(zc.primary)},0.35)`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <div style={{ fontFamily: gamingTheme.fontHeading, fontSize: '28px', fontWeight: 800, color: zc.primary }}>{correctCount}/{totalQ}</div>
                  <div style={{ fontFamily: gamingTheme.fontLabel, fontSize: '8px', letterSpacing: '1.5px', color: gamingTheme.mutedBlue, textTransform: 'uppercase', marginTop: '4px' }}>Score</div>
                </div>
                <div style={{ width: '1px', background: `rgba(${hexToRgbStr(zc.primary)},0.2)` }} />
                <div>
                  <div style={{ fontFamily: gamingTheme.fontHeading, fontSize: '28px', fontWeight: 800, color: gamingTheme.mint }}>+{island.bossXP}</div>
                  <div style={{ fontFamily: gamingTheme.fontLabel, fontSize: '8px', letterSpacing: '1.5px', color: gamingTheme.mutedBlue, textTransform: 'uppercase', marginTop: '4px' }}>XP Earned</div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={{ ...gradientBtn, width: '100%', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Return to Map <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {/* ── DEFEAT ──────────────────────────────────────────────── */}
        {stage === 'defeat' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.5 }}
              style={{ fontSize: '80px', marginBottom: '16px', lineHeight: 1 }}
            >
              <Skull size={80} color="rgba(248,113,113,0.8)" style={{ margin: '0 auto' }} />
            </motion.div>

            <div style={{ fontFamily: gamingTheme.fontLabel, fontSize: '9px', letterSpacing: '3px', color: '#F87171', marginBottom: '8px' }}>Defeated</div>

            <h2 style={{
              fontFamily: gamingTheme.fontHeading, fontSize: '30px', fontWeight: 800,
              color: gamingTheme.stellarWhite, textTransform: 'uppercase', letterSpacing: '2px',
              margin: '0 0 8px',
            }}>
              Not This Time...
            </h2>

            <p style={{ fontFamily: gamingTheme.fontBody, fontSize: '14px', color: gamingTheme.seafoam, marginBottom: '24px' }}>
              <strong style={{ color: gamingTheme.stellarWhite }}>{island.bossName}</strong> was too powerful. Study up and return stronger!
            </p>

            {/* Score */}
            <div style={{
              padding: '18px', borderRadius: '14px', marginBottom: '28px',
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)',
            }}>
              <div style={{ fontFamily: gamingTheme.fontHeading, fontSize: '26px', fontWeight: 800, color: '#F87171', marginBottom: '6px' }}>
                {correctCount} / {totalQ}
              </div>
              <div style={{ fontFamily: gamingTheme.fontLabel, fontSize: '9px', letterSpacing: '1.5px', color: gamingTheme.mutedBlue, textTransform: 'uppercase' }}>
                Needed {requiredCorrect}/{totalQ} to win
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRetry}
                style={{ ...gradientBtn, flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}
              >
                <RotateCcw size={16} /> Retry Battle
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{ ...ghostBtn, flex: 1, padding: '14px' }}
              >
                Retreat
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
