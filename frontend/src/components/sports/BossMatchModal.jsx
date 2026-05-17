// Sports Boss Match Modal — Pre-Match Briefing → The Match → Victory / Defeat
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, RotateCcw, ChevronRight, CheckCircle, XCircle, Flag, CircleX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sportsTheme } from '../../styles/sportsTheme';
import { useIsMobile } from '../../hooks/useIsMobile';

// ─── Per-season boss questions ────────────────────────────────────────────────
const BOSS_QUESTIONS = {
  boss_s0: [
    {
      question: 'You earn $3,500/month. Using the 50/30/20 rule, how much should go toward savings?',
      options: ['$350 (10%)', '$700 (20%)', '$1,050 (30%)', '$1,750 (50%)'],
      correctIndex: 1,
      explanation: '20% of $3,500 = $700. The 20% slice covers savings, investing, and debt repayment.',
    },
    {
      question: 'Which type of expense should you cut FIRST when you need to reduce your budget?',
      options: ['Rent', 'Groceries', 'Streaming subscriptions', 'Utility bills'],
      correctIndex: 2,
      explanation: 'Subscriptions are discretionary wants — easy to cancel instantly with no lifestyle impact.',
    },
    {
      question: 'A freelancer\'s emergency fund should ideally cover how many months of expenses?',
      options: ['1 month', '3 months', '3–6 months', '6–12 months'],
      correctIndex: 3,
      explanation: 'Variable income means a larger safety net. 6–12 months protects against dry spells.',
    },
    {
      question: '"Pay yourself first" means:',
      options: [
        'Spend freely before paying bills',
        'Automate savings before spending anything else',
        'Buy things you want before paying rent',
        'Spend your whole paycheck, then save what\'s left',
      ],
      correctIndex: 1,
      explanation: 'Saving automatically the moment you\'re paid ensures you save consistently before lifestyle spending drains the budget.',
    },
    {
      question: 'If your income is $4,000 and expenses are $3,200, what is your savings rate?',
      options: ['20%', '25%', '30%', '80%'],
      correctIndex: 0,
      explanation: 'Savings rate = (saved / income) × 100 = (800 / 4000) × 100 = 20%.',
    },
  ],

  boss_s1: [
    {
      question: '$5,000 invested at 8% compounded annually for 5 years — approximate final balance?',
      options: ['$6,000', '$7,000', '$7,347', '$8,500'],
      correctIndex: 2,
      explanation: '5000 × 1.08⁵ ≈ $7,347. Compound growth accelerates because interest earns interest.',
    },
    {
      question: 'Which factor has the LARGEST impact on your FICO credit score?',
      options: [
        'Length of credit history (15%)',
        'Payment history (35%)',
        'Credit utilisation (30%)',
        'New credit inquiries (10%)',
      ],
      correctIndex: 1,
      explanation: 'Payment history is 35% of your score. One missed payment can cause a significant drop.',
    },
    {
      question: 'Rule of 72: at a 6% annual return, how many years until your money doubles?',
      options: ['6 years', '9 years', '12 years', '18 years'],
      correctIndex: 2,
      explanation: '72 ÷ 6 = 12 years. A quick mental maths shortcut for estimating doubling time.',
    },
    {
      question: 'The debt avalanche method means paying off debts in what order?',
      options: [
        'Smallest balance first',
        'Largest balance first',
        'Highest interest rate first',
        'Oldest debt first',
      ],
      correctIndex: 2,
      explanation: 'Avalanche = highest APR first. Minimises total interest paid — the mathematically optimal approach.',
    },
    {
      question: 'Your marginal tax rate is 22%. A $10,000 deduction saves you exactly:',
      options: ['$10,000', '$2,200', '$780', '$4,400'],
      correctIndex: 1,
      explanation: 'Deductions reduce taxable income, not taxes directly. $10,000 × 22% = $2,200 saved.',
    },
  ],

  boss_s2: [
    {
      question: 'A Roth IRA is better than a Traditional IRA when you expect to be in a:',
      options: [
        'Lower tax bracket in retirement',
        'Higher tax bracket in retirement',
        'The same tax bracket',
        'It makes no difference',
      ],
      correctIndex: 1,
      explanation: 'Roth: contribute after-tax now, withdraw tax-free later. Ideal when future tax rates will be higher.',
    },
    {
      question: 'A well-diversified portfolio protects you by:',
      options: [
        'Owning one strong company\'s stock',
        'Spreading investments across asset classes and sectors',
        'Keeping all money in bonds',
        'Timing the market daily',
      ],
      correctIndex: 1,
      explanation: 'Diversification spreads risk. If one sector drops, gains elsewhere cushion the blow.',
    },
    {
      question: 'In real estate, "house hacking" means:',
      options: [
        'Illegally entering a property',
        'Renting out part of your primary residence to offset mortgage costs',
        'Buying a house below market price',
        'Using a home equity loan for renovation',
      ],
      correctIndex: 1,
      explanation: 'House hacking uses rental income from your own property to reduce or eliminate housing costs.',
    },
    {
      question: 'At a 9% annual return, how many years for $10,000 to grow to $20,000? (Rule of 72)',
      options: ['6 years', '8 years', '9 years', '12 years'],
      correctIndex: 1,
      explanation: '72 ÷ 9 = 8 years. The doubling-time shortcut saves you from calculating 1.09ⁿ = 2.',
    },
    {
      question: 'The 4% withdrawal rule in retirement planning states:',
      options: [
        'Invest 4% of your salary each year',
        'You can withdraw 4% of your portfolio annually with low risk of running out',
        'Keep 4% of savings in cash',
        'Retire when your savings equal 4× your annual income',
      ],
      correctIndex: 1,
      explanation: 'The 4% rule: withdraw 4% of your nest egg yearly and a 30-year retirement is historically sustainable.',
    },
  ],
};

const PASS_THRESHOLD = 0.7;

// ─── Component ────────────────────────────────────────────────────────────────
export default function BossMatchModal({ boss, color, glow, onVictory, onDefeat, onClose }) {
  const { isMobile } = useIsMobile();
  const [stage, setStage]         = useState('briefing'); // briefing | match | victory | defeat
  const [idx, setIdx]             = useState(0);
  const [selected, setSelected]   = useState(null);
  const [answered, setAnswered]   = useState(false);
  const [results, setResults]     = useState([]);
  const confettiFired             = useRef(false);

  const C = color || '#E8457A';
  const G = glow  || 'rgba(232,69,122,0.5)';

  const questions     = BOSS_QUESTIONS[boss?.id] || BOSS_QUESTIONS.boss_s0;
  const q             = questions[idx];
  const totalQ        = questions.length;
  const requiredCorrect = Math.ceil(totalQ * PASS_THRESHOLD);
  const correctCount  = results.filter(r => r.correct).length;
  const progress      = totalQ > 0 ? ((idx + (answered ? 1 : 0)) / totalQ) * 100 : 0;

  // Reset on open
  useEffect(() => {
    setStage('briefing');
    setIdx(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    confettiFired.current = false;
  }, [boss?.id]);

  useEffect(() => {
    if (stage === 'victory' && !confettiFired.current) {
      confettiFired.current = true;
      const opts = { particleCount: 90, spread: 75, startVelocity: 50, colors: [C, '#fff', '#fbbf24'] };
      confetti({ ...opts, origin: { x: 0.25, y: 0.6 } });
      setTimeout(() => confetti({ ...opts, origin: { x: 0.75, y: 0.6 } }), 350);
    }
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnswer(optionIdx) {
    if (answered) return;
    const correct   = optionIdx === q.correctIndex;
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
        const passed = newResults.filter(r => r.correct).length >= requiredCorrect;
        if (passed) { setStage('victory'); onVictory?.(); }
        else        { setStage('defeat');  onDefeat?.();  }
      }
    }, 1700);
  }

  function handleRetry() {
    setStage('briefing');
    setIdx(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    confettiFired.current = false;
  }

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 900,
    background: 'rgba(0,0,0,0.88)',
    backdropFilter: 'blur(14px)',
    display: 'flex',
    alignItems: isMobile ? 'flex-start' : 'center',
    justifyContent: 'center',
    padding: isMobile ? 0 : '20px',
  };

  const panel = isMobile ? {
    width: '100%', height: '100%', overflowY: 'auto',
    background: '#0d0d0d', padding: '28px 18px',
    position: 'relative',
  } : {
    width: '100%', maxWidth: 560,
    maxHeight: '92vh', overflowY: 'auto',
    borderRadius: 16,
    background: '#0d0d0d',
    border: `1.5px solid ${C}55`,
    boxShadow: `0 0 60px ${G}, 0 24px 64px rgba(0,0,0,0.7)`,
    padding: '40px 36px',
    position: 'relative',
  };

  const primaryBtn = {
    width: '100%', padding: '15px',
    background: C, color: '#000',
    fontFamily: sportsTheme.fontHeading,
    fontSize: 20, letterSpacing: '1.5px',
    border: 'none', borderRadius: 10, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    boxShadow: `0 4px 24px ${G}`,
  };

  const ghostBtn = {
    padding: '14px 24px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: sportsTheme.textMuted,
    fontFamily: sportsTheme.fontSub,
    fontSize: 13, fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    borderRadius: 10, cursor: 'pointer',
  };

  const CloseBtn = () => (
    <button onClick={onClose} style={{
      position: 'absolute', top: 14, right: 14,
      width: 32, height: 32, borderRadius: 8,
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    }}>
      <X size={14} color={sportsTheme.textMuted} />
    </button>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlay}>
      <motion.div
        initial={isMobile ? { y: '100%' } : { scale: 0.9, y: 24 }}
        animate={isMobile ? { y: 0 }     : { scale: 1,   y: 0  }}
        exit={isMobile    ? { y: '100%' } : { scale: 0.9, y: 24 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={panel}
      >

        {/* ── PRE-MATCH BRIEFING ──────────────────────────────────────── */}
        {stage === 'briefing' && (
          <>
            <CloseBtn />
            <div style={{ textAlign: 'center' }}>

              {/* Pulsing trophy */}
              <motion.div
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 96, height: 96, borderRadius: 18, margin: '0 auto 24px',
                  background: `${C}18`,
                  border: `2px solid ${C}`,
                  boxShadow: `0 0 40px ${G}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Trophy size={48} color={C} strokeWidth={1.5} />
              </motion.div>

              <div style={{
                fontFamily: sportsTheme.fontSub, fontWeight: 600,
                fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: C, marginBottom: 8,
              }}>
                Pre-Match Briefing
              </div>

              <h2 style={{
                fontFamily: sportsTheme.fontHeading,
                fontSize: 28, letterSpacing: '2px',
                color: '#fff', margin: '0 0 10px',
                textShadow: `0 0 24px ${G}`,
              }}>
                {boss?.name || 'The Challenge'}
              </h2>

              <p style={{
                fontFamily: sportsTheme.fontBody,
                fontSize: 13, color: sportsTheme.textSecondary,
                lineHeight: 1.65, marginBottom: 24,
              }}>
                You've completed all training sessions in this block. Step onto the pitch and
                prove your financial mastery to advance to the next season.
              </p>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                {[
                  { label: 'Questions', value: totalQ },
                  { label: 'To Pass',   value: `${Math.round(PASS_THRESHOLD * 100)}%` },
                  { label: 'XP Reward', value: `+${boss?.xp || 150}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    flex: 1, padding: '12px 8px', borderRadius: 10, textAlign: 'center',
                    background: `${C}10`, border: `1px solid ${C}30`,
                  }}>
                    <div style={{
                      fontFamily: sportsTheme.fontHeading,
                      fontSize: 22, letterSpacing: '1px', color: C, marginBottom: 4,
                    }}>{value}</div>
                    <div style={{
                      fontFamily: sportsTheme.fontSub, fontWeight: 600,
                      fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: sportsTheme.textMuted,
                    }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 26,
                background: 'rgba(251,191,36,0.07)',
                border: '1px solid rgba(251,191,36,0.22)',
                fontFamily: sportsTheme.fontSub, fontWeight: 600,
                fontSize: 11, letterSpacing: '0.06em',
                color: '#fbbf24',
              }}>
                Answer {requiredCorrect}/{totalQ} correctly to win the match
              </div>

              <motion.button
                whileHover={{ filter: 'brightness(1.12)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStage('match')}
                style={primaryBtn}
              >
                <Flag size={18} strokeWidth={2} /> KICK OFF
              </motion.button>
            </div>
          </>
        )}

        {/* ── THE MATCH ──────────────────────────────────────────────── */}
        {stage === 'match' && q && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`q-${idx}`}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 }}
              transition={{ duration: 0.2 }}
            >
              {/* Progress header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{
                    fontFamily: sportsTheme.fontSub, fontWeight: 600,
                    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: sportsTheme.textMuted,
                  }}>
                    QUESTION {idx + 1} / {totalQ}
                  </span>
                  <span style={{
                    fontFamily: sportsTheme.fontHeading,
                    fontSize: 13, letterSpacing: '0.5px', color: C,
                  }}>
                    {correctCount} correct
                  </span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ height: '100%', borderRadius: 3, background: C, boxShadow: `0 0 8px ${G}` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${C}25`,
                borderRadius: 12, padding: '20px 18px', marginBottom: 14,
              }}>
                <p style={{
                  fontFamily: sportsTheme.fontBody,
                  fontSize: 15, color: '#fff',
                  lineHeight: 1.65, margin: 0,
                }}>
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {q.options.map((opt, i) => {
                  const isSel     = selected === i;
                  const isCorrect = answered && i === q.correctIndex;
                  const isWrong   = answered && isSel && i !== q.correctIndex;

                  return (
                    <motion.button
                      key={i}
                      whileHover={!answered ? { x: 3 } : {}}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswer(i)}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '12px 14px',
                        fontFamily: sportsTheme.fontBody,
                        fontSize: 14,
                        color: isCorrect ? '#000' : isWrong ? '#fff' : sportsTheme.textSecondary,
                        background: isCorrect
                          ? '#4ade80'
                          : isWrong
                            ? 'rgba(248,113,113,0.22)'
                            : isSel
                              ? `${C}20`
                              : `${C}08`,
                        border: isCorrect
                          ? '1.5px solid #4ade80'
                          : isWrong
                            ? '1.5px solid rgba(248,113,113,0.7)'
                            : isSel
                              ? `1.5px solid ${C}80`
                              : `1px solid ${C}22`,
                        borderRadius: 10,
                        cursor: answered ? 'default' : 'pointer',
                        transition: 'all 0.18s ease',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}
                    >
                      {answered && isCorrect && <CheckCircle size={14} color="#000" style={{ flexShrink: 0 }} />}
                      {answered && isWrong   && <XCircle     size={14} color="#f87171" style={{ flexShrink: 0 }} />}
                      {!(answered && (isCorrect || isWrong)) && (
                        <span style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isSel ? `${C}30` : 'rgba(255,255,255,0.06)',
                          border: `1px solid ${isSel ? C : 'rgba(255,255,255,0.12)'}`,
                          fontFamily: sportsTheme.fontHeading,
                          fontSize: 11, color: isSel ? C : sportsTheme.textMuted,
                        }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                      )}
                      <span>{opt}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: 12, padding: '11px 14px', borderRadius: 9,
                      background: selected === q.correctIndex
                        ? 'rgba(74,222,128,0.07)'
                        : 'rgba(248,113,113,0.07)',
                      border: `1px solid ${selected === q.correctIndex ? 'rgba(74,222,128,0.28)' : 'rgba(248,113,113,0.28)'}`,
                    }}
                  >
                    <p style={{
                      fontFamily: sportsTheme.fontBody,
                      fontSize: 12, color: sportsTheme.textSecondary,
                      margin: 0, lineHeight: 1.6,
                    }}>
                      {q.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── VICTORY ────────────────────────────────────────────────── */}
        {stage === 'victory' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 104, height: 104, borderRadius: '50%',
                margin: '0 auto 24px',
                background: C, border: `2px solid ${C}`,
                boxShadow: `0 0 50px ${G}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Trophy size={52} color="#000" strokeWidth={1.5} />
            </motion.div>

            <div style={{
              fontFamily: sportsTheme.fontSub, fontWeight: 600,
              fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: C, marginBottom: 8,
            }}>
              Match Won
            </div>

            <h2 style={{
              fontFamily: sportsTheme.fontHeading,
              fontSize: 36, letterSpacing: '3px', color: '#fff',
              textShadow: `0 0 32px ${G}`, margin: '0 0 8px',
            }}>
              FULL TIME!
            </h2>

            <p style={{
              fontFamily: sportsTheme.fontBody,
              fontSize: 13, color: sportsTheme.textSecondary, marginBottom: 26,
            }}>
              You defeated <strong style={{ color: '#fff' }}>{boss?.name}</strong>.
              The next season is now unlocked.
            </p>

            {/* Score + XP */}
            <div style={{
              padding: '18px', borderRadius: 12, marginBottom: 26,
              background: `${C}12`, border: `1px solid ${C}35`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <div style={{ fontFamily: sportsTheme.fontHeading, fontSize: 30, letterSpacing: '1px', color: C }}>
                    {correctCount}/{totalQ}
                  </div>
                  <div style={{
                    fontFamily: sportsTheme.fontSub, fontWeight: 600,
                    fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: sportsTheme.textMuted, marginTop: 4,
                  }}>Score</div>
                </div>
                <div style={{ width: 1, background: `${C}25` }} />
                <div>
                  <div style={{ fontFamily: sportsTheme.fontHeading, fontSize: 30, letterSpacing: '1px', color: '#4ade80' }}>
                    +{boss?.xp || 150}
                  </div>
                  <div style={{
                    fontFamily: sportsTheme.fontSub, fontWeight: 600,
                    fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: sportsTheme.textMuted, marginTop: 4,
                  }}>Points</div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={primaryBtn}
            >
              RETURN TO PLAYBOOK <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {/* ── DEFEAT ─────────────────────────────────────────────────── */}
        {stage === 'defeat' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
              style={{
                width: 88, height: 88, borderRadius: '50%',
                margin: '0 auto 16px',
                background: 'rgba(248,113,113,0.12)',
                border: '2px solid rgba(248,113,113,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <CircleX size={44} color="#f87171" strokeWidth={1.5} />
            </motion.div>

            <div style={{
              fontFamily: sportsTheme.fontSub, fontWeight: 600,
              fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#f87171', marginBottom: 8,
            }}>
              Match Lost
            </div>

            <h2 style={{
              fontFamily: sportsTheme.fontHeading,
              fontSize: 32, letterSpacing: '2px', color: '#fff',
              margin: '0 0 8px',
            }}>
              Not This Time
            </h2>

            <p style={{
              fontFamily: sportsTheme.fontBody,
              fontSize: 13, color: sportsTheme.textSecondary, marginBottom: 22,
            }}>
              <strong style={{ color: '#fff' }}>{boss?.name}</strong> was too strong today.
              Review your training and come back stronger.
            </p>

            {/* Score */}
            <div style={{
              padding: '16px', borderRadius: 12, marginBottom: 26,
              background: 'rgba(248,113,113,0.07)',
              border: '1px solid rgba(248,113,113,0.28)',
            }}>
              <div style={{ fontFamily: sportsTheme.fontHeading, fontSize: 28, letterSpacing: '1px', color: '#f87171', marginBottom: 6 }}>
                {correctCount} / {totalQ}
              </div>
              <div style={{
                fontFamily: sportsTheme.fontSub, fontWeight: 600,
                fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: sportsTheme.textMuted,
              }}>
                Needed {requiredCorrect}/{totalQ} to win
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <motion.button
                whileHover={{ filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRetry}
                style={{ ...primaryBtn, flex: 2 }}
              >
                <RotateCcw size={16} strokeWidth={2} /> RETRY MATCH
              </motion.button>
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{ ...ghostBtn, flex: 1 }}
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
