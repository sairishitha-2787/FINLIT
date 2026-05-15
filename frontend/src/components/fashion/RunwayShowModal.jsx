// FINLIT — Runway Show Boss Battle Modal
// Phases: entrance → battle → victory | defeat

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Crown, Check, XCircle, RotateCcw, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { fashionAccents, fashionGlass } from '../../styles/fashionTheme';
import { useFashion } from '../../contexts/FashionContext';
import { useGamification } from '../../hooks/useGamification';
import { useIsMobile } from '../../hooks/useIsMobile';

// ── Tokens ────────────────────────────────────────────────────────────────────
const F = {
  heading: "'Playfair Display', serif",
  script:  "'Sacramento', cursive",
  ui:      "'DM Sans', sans-serif",
};
const C = {
  deepRose: '#9d1f4a', midRose: '#d4537e', body: '#b0627a',
  label: '#c98a9e', gold: '#fde68a', success: '#7ec9a0', error: '#e87070',
};
const GRAD = 'linear-gradient(135deg, #f7a0b8, #c084fc, #fbb6c4)';

const DISTRICT_COLORS = {
  boutique: { color: '#e8956d', glow: 'rgba(232,149,109,0.30)' },
  atelier:  { color: '#f7a0b8', glow: 'rgba(247,160,184,0.30)' },
  runway:   { color: '#c084fc', glow: 'rgba(192,132,252,0.30)' },
};

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ].join(',');
}

// ── Boss data ─────────────────────────────────────────────────────────────────
const BOSS_DATA = {
  boss_boutique: {
    shortName:    'The Buyer',
    subtitle:     'District I Fashion Critic',
    entranceLine: "Let's see if your financial basics are runway-ready...",
    victoryLine:  "Impressive. You've earned your place in The Atelier.",
    defeatLine:   "Back to the fitting room, darling. Practice makes perfect.",
    sp:           150,
    badge:        'Boutique Graduate',
    questions: [
      {
        question: 'Using the 50/30/20 rule, if your take-home pay is $3,000/month, how much goes toward savings & debt repayment?',
        options: ['$150 — 5%', '$300 — 10%', '$600 — 20%', '$900 — 30%'],
        correctIndex: 2,
        explanation: '20% of $3,000 = $600. The 20% slice covers savings, investments, and debt payments.',
      },
      {
        question: 'Which of these is a "want," not a "need," in your budget?',
        options: ['Rent', 'Grocery staples', 'Streaming subscriptions', 'Utilities'],
        correctIndex: 2,
        explanation: 'Streaming subscriptions are discretionary. Rent, food, and utilities are essential needs.',
      },
      {
        question: 'You deposit $2,000 at 4% simple annual interest. How much total interest do you earn after 3 years?',
        options: ['$80', '$160', '$240', '$249.73'],
        correctIndex: 2,
        explanation: 'Simple interest: I = P × r × t = 2,000 × 0.04 × 3 = $240. It does not compound.',
      },
      {
        question: 'An emergency fund for someone with steady employment should cover how many months of expenses?',
        options: ['1 month', '3–6 months', '12 months', '24 months'],
        correctIndex: 1,
        explanation: '3–6 months is the standard guideline. Freelancers and variable-income earners may target 6–12 months.',
      },
      {
        question: '"Pay yourself first" means:',
        options: ['Buy luxury items before paying bills', 'Automate savings before spending', 'Pay your highest bill first', 'Invest your entire paycheck'],
        correctIndex: 1,
        explanation: 'Automating savings right when you\'re paid removes temptation and ensures consistent saving before lifestyle spending.',
      },
    ],
  },

  boss_atelier: {
    shortName:    'The Editor',
    subtitle:     'District II Fashion Critic',
    entranceLine: "My editorial standards are exacting. Show me what you've crafted.",
    victoryLine:  "Consider yourself published. The Runway awaits.",
    defeatLine:   "This draft needs work. Revise and resubmit.",
    sp:           250,
    badge:        'Atelier Artisan',
    questions: [
      {
        question: 'Using the Rule of 72, at an 8% annual return, how many years does your money take to double?',
        options: ['6 years', '8 years', '9 years', '12 years'],
        correctIndex: 2,
        explanation: '72 ÷ 8 = 9 years. The Rule of 72 is a quick mental shortcut for estimating doubling time.',
      },
      {
        question: 'Which factor has the LARGEST impact on your FICO credit score?',
        options: ['Credit utilization (30%)', 'Payment history (35%)', 'Length of credit history (15%)', 'New inquiries (10%)'],
        correctIndex: 1,
        explanation: 'Payment history at 35% is the single biggest factor. One missed payment can significantly drop your score.',
      },
      {
        question: 'The debt avalanche strategy pays off debts in what order?',
        options: ['Smallest balance first', 'Largest balance first', 'Highest interest rate first', 'Oldest account first'],
        correctIndex: 2,
        explanation: 'Avalanche = highest APR first. Mathematically optimal — it minimises total interest paid over time.',
      },
      {
        question: 'When market interest rates rise, what happens to the price of existing bonds?',
        options: ['Bond prices rise', 'Bond prices fall', 'Bond prices stay the same', 'Bonds convert to stocks'],
        correctIndex: 1,
        explanation: 'New bonds offer better yields, making existing lower-yield bonds less attractive — their prices fall.',
      },
      {
        question: 'A stock has a P/E ratio of 25. This means investors are paying:',
        options: ['$25 per $1 of annual earnings', '$1 per $25 of earnings', '25% dividend yield', 'The stock is 25% overvalued'],
        correctIndex: 0,
        explanation: 'P/E = Price ÷ Earnings per share. A P/E of 25 means $25 paid for every $1 the company earns annually.',
      },
    ],
  },

  boss_runway: {
    shortName:    'The Icon',
    subtitle:     'District III — The Grand Finale',
    entranceLine: "Only the truly exceptional reach this stage. Prove you belong.",
    victoryLine:  "You are fashion. You are finance. You are iconic.",
    defeatLine:   "Close, but icons don't settle for almost. Try again.",
    sp:           500,
    badge:        'Fashion Icon',
    questions: [
      {
        question: 'A Roth IRA is most advantageous when you expect to be in a tax bracket that is:',
        options: ['Lower in retirement', 'Higher in retirement', 'The same in retirement', 'Tax-free in retirement'],
        correctIndex: 1,
        explanation: 'Roth: pay tax now, withdraw tax-free later. Best when your future tax rate will be higher than today.',
      },
      {
        question: 'Your marginal federal tax rate is 22%. A $10,000 traditional IRA contribution reduces your tax bill by approximately:',
        options: ['$10,000', '$4,400', '$2,200', '$1,000'],
        correctIndex: 2,
        explanation: 'Deductions reduce taxable income, not taxes directly. $10,000 × 22% = $2,200 saved.',
      },
      {
        question: 'Portfolio diversification primarily reduces:',
        options: ['All investment risk', 'Systematic (market-wide) risk', 'Unsystematic (company-specific) risk', 'Inflation risk'],
        correctIndex: 2,
        explanation: 'Diversification reduces unsystematic risk — tied to individual companies or sectors. Market-wide risk remains.',
      },
      {
        question: 'The "4% rule" targets a retirement horizon of approximately:',
        options: ['10 years', '20 years', '30 years', 'Indefinitely'],
        correctIndex: 2,
        explanation: 'The 4% rule (Trinity Study) targets ~30 years. It\'s a guideline — sequence of returns matters greatly.',
      },
      {
        question: 'Contributing to a 401(k) "up to the employer match" is called free money because:',
        options: ['The government doubles your contribution', 'Your employer adds matching dollars up to a limit', 'The contribution is always tax-exempt', 'It earns a guaranteed 10% return'],
        correctIndex: 1,
        explanation: 'Employer matching is an immediate 50–100% return on your contribution. Always capture the full match first.',
      },
    ],
  },
};

const PASS = 3;
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// ── Accent float durations (stable, index-based) ──────────────────────────────
const FLOAT_DUR = [5.2, 4.8, 6.1, 5.5, 4.4, 5.8, 6.5];

function AccentSVG({ objectName, size, opacity, rotation, position, idx }) {
  const obj = fashionAccents.objects[objectName];
  if (!obj) return null;
  const dur   = FLOAT_DUR[idx % FLOAT_DUR.length];
  const gradId = `iri-boss-${objectName}`;
  return (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [rotation - 1, rotation + 1, rotation - 1] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', pointerEvents: 'none', zIndex: 0, filter: 'blur(1px)', ...position }}
    >
      <svg width={size} height={size} viewBox={obj.viewBox} style={{ opacity, display: 'block' }}>
        <defs>
          <radialGradient id={gradId} cx="30%" cy="25%" r="75%">
            {fashionAccents.iridescentStops.map(s => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </radialGradient>
        </defs>
        {Object.entries(obj.paths).map(([key, path]) =>
          path.fill === 'none'
            ? <path key={key} d={path.d} fill="none" stroke={fashionAccents.silverRim} strokeWidth={fashionAccents.silverRimWidth} strokeLinecap="round" />
            : <path key={key} d={path.d} fill={`url(#${gradId})`} stroke={fashionAccents.silverRim} strokeWidth={fashionAccents.silverRimWidth} />
        )}
      </svg>
    </motion.div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function GlassCard({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.28)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      borderTop:    '1.5px solid rgba(255,255,255,0.70)',
      borderLeft:   '1.5px solid rgba(255,255,255,0.70)',
      borderBottom: '1.5px solid rgba(247,160,184,0.28)',
      borderRight:  '1.5px solid rgba(247,160,184,0.28)',
      borderRadius: 16,
      ...style,
    }}>
      {children}
    </div>
  );
}

function GradBtn({ children, onClick, style = {} }) {
  return (
    <motion.button
      whileHover={{ y: -1, boxShadow: '0 10px 28px rgba(192,132,252,0.40)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '14px 28px', borderRadius: 16, border: 'none',
        background: GRAD, color: '#fff',
        fontFamily: F.ui, fontWeight: 600, fontSize: 14,
        cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(192,132,252,0.28)',
        ...style,
      }}
    >{children}</motion.button>
  );
}

function GlassBtn({ children, onClick, style = {} }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '12px 20px', borderRadius: 14,
        border: '1.5px solid rgba(247,160,184,0.50)',
        background: 'rgba(255,255,255,0.22)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        color: C.deepRose, fontFamily: F.ui, fontWeight: 500, fontSize: 13,
        cursor: 'pointer',
        ...style,
      }}
    >{children}</motion.button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RunwayShowModal({ district, onVictory, onClose }) {
  const { isMobile } = useIsMobile();
  const { addDefeatedBoss } = useFashion();
  const { addXP } = useGamification();

  const [phase,    setPhase]    = useState('entrance');
  const [qIdx,     setQIdx]     = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results,  setResults]  = useState([]);
  const [spCount,  setSpCount]  = useState(0);
  const confettiFired = useRef(false);
  const spTimer       = useRef(null);

  const theme     = DISTRICT_COLORS[district?.id] || DISTRICT_COLORS.boutique;
  const boss      = district?.bossId ? BOSS_DATA[district.bossId] : null;
  const questions = boss?.questions || [];
  const totalQ    = questions.length;
  const q         = questions[qIdx];
  const correctCount = results.filter(r => r.correct).length;

  // Reset when district changes
  useEffect(() => {
    setPhase('entrance');
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    setSpCount(0);
    confettiFired.current = false;
    return () => clearInterval(spTimer.current);
  }, [district?.bossId]);

  // Victory side-effects
  useEffect(() => {
    if (phase !== 'victory') return;

    addDefeatedBoss(district.bossId);
    addXP(boss.sp, 'Runway Show Victory!');

    if (!confettiFired.current) {
      confettiFired.current = true;
      const opts = {
        particleCount: 70, spread: 65, startVelocity: 42,
        colors: ['#f7a0b8', '#c084fc', '#fde68a', '#ffffff', '#9d1f4a'],
      };
      confetti({ ...opts, origin: { x: 0.25, y: 0.65 } });
      setTimeout(() => confetti({ ...opts, origin: { x: 0.75, y: 0.65 } }), 350);
    }

    const target  = boss.sp;
    const startMs = Date.now();
    spTimer.current = setInterval(() => {
      const t = Math.min((Date.now() - startMs) / 1800, 1);
      setSpCount(Math.floor(t * target));
      if (t >= 1) clearInterval(spTimer.current);
    }, 30);

    return () => clearInterval(spTimer.current);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnswer(optIdx) {
    if (answered) return;
    const correct = optIdx === q.correctIndex;
    setSelected(optIdx);
    setAnswered(true);
    const newResults = [...results, { correct }];
    setResults(newResults);

    setTimeout(() => {
      if (qIdx < totalQ - 1) {
        setQIdx(i => i + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        const score = newResults.filter(r => r.correct).length;
        setPhase(score >= PASS ? 'victory' : 'defeat');
      }
    }, 1600);
  }

  function handleRetry() {
    clearInterval(spTimer.current);
    setPhase('entrance');
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    setSpCount(0);
    confettiFired.current = false;
  }

  if (!boss) return null;

  const modalStyle = isMobile
    ? {
        width: '100%', height: '100%',
        borderRadius: 0, padding: '28px 20px 24px',
        overflowY: 'auto',
        background: 'rgba(250,245,236,0.97)',
        backdropFilter: 'blur(32px) saturate(220%)',
        WebkitBackdropFilter: 'blur(32px) saturate(220%)',
        position: 'relative',
      }
    : {
        ...fashionGlass.modal,
        width: '100%', maxWidth: 560,
        maxHeight: '90vh', overflowY: 'auto',
        padding: '44px 40px',
        position: 'relative',
        boxShadow: `0 24px 64px rgba(247,160,184,0.35), 0 8px 32px rgba(192,132,252,0.20), 0 0 80px ${theme.glow}`,
      };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.40)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        zIndex: 800,
      }}
    >
      {/* Decorative accents (desktop only) */}
      {!isMobile && fashionAccents.placements.bossBattle.map((acc, i) => (
        <AccentSVG
          key={acc.object}
          idx={i}
          objectName={acc.object}
          size={acc.size}
          opacity={acc.opacity}
          rotation={acc.rotation}
          position={acc.position}
        />
      ))}

      {/* Centering wrapper */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: isMobile ? 0 : 20,
      }}>
        <motion.div
          initial={isMobile ? { y: '100%' } : { scale: 0.88, y: 24 }}
          animate={isMobile ? { y: 0 } : { scale: 1, y: 0 }}
          exit={isMobile ? { y: '100%' } : { scale: 0.88, y: 24 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          style={modalStyle}
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(255,255,255,0.40)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.65)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10,
            }}
          >
            <X size={15} color={C.label} />
          </motion.button>

          <AnimatePresence mode="wait">

            {/* ══ ENTRANCE ══════════════════════════════════════════════ */}
            {phase === 'entrance' && (
              <motion.div
                key="entrance"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                style={{ textAlign: 'center' }}
              >
                {/* Boss icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.15 }}
                  style={{ marginBottom: 24 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.07, 1], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                    style={{
                      width: 100, height: 100, borderRadius: 22, margin: '0 auto',
                      background: `linear-gradient(135deg, rgba(255,255,255,0.40) 0%, rgba(${hexToRgb(theme.color)},0.22) 100%)`,
                      border: `2px solid ${theme.color}`,
                      boxShadow: `0 0 40px ${theme.glow}, 0 8px 32px rgba(0,0,0,0.06)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Crown size={52} color={theme.color} />
                  </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.50 }}>
                  <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase', color: C.label, marginBottom: 6 }}>
                    Runway Show
                  </div>
                  <h2 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 26, letterSpacing: '-0.02em', color: C.deepRose, margin: '0 0 4px', lineHeight: 1.1 }}>
                    {boss.shortName}
                  </h2>
                  <div style={{ fontFamily: F.script, fontSize: 20, color: C.midRose, marginBottom: 18 }}>
                    {boss.subtitle}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.70 }}>
                  <GlassCard style={{ padding: '14px 20px', marginBottom: 22 }}>
                    <p style={{ fontFamily: F.ui, fontStyle: 'italic', fontSize: 14, color: C.body, margin: 0, lineHeight: 1.6 }}>
                      "{boss.entranceLine}"
                    </p>
                  </GlassCard>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.88 }}>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 22 }}>
                    {[
                      { label: 'Looks', value: totalQ },
                      { label: 'To Pass', value: `${PASS}/${totalQ}` },
                      { label: 'Style Points', value: `+${boss.sp}` },
                    ].map(({ label, value }) => (
                      <GlassCard key={label} style={{ flex: 1, padding: '14px 10px', textAlign: 'center' }}>
                        <div style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 20, color: theme.color, marginBottom: 3 }}>{value}</div>
                        <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.label }}>{label}</div>
                      </GlassCard>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}>
                  <GradBtn onClick={() => setPhase('battle')} style={{ width: '100%', padding: '16px' }}>
                    <Sparkles size={16} /> Begin Runway Show
                  </GradBtn>
                </motion.div>
              </motion.div>
            )}

            {/* ══ BATTLE ════════════════════════════════════════════════ */}
            {phase === 'battle' && q && (
              <motion.div
                key={`battle-${qIdx}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.22 }}
              >
                {/* Progress circles */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                  {questions.map((_, i) => {
                    const isDone    = i < results.length;
                    const isCorrect = isDone ? results[i].correct : null;
                    const isCurr   = i === qIdx;
                    return (
                      <motion.div
                        key={i}
                        animate={isCurr ? { scale: [1, 1.25, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{
                          width: 16, height: 16, borderRadius: '50%',
                          background: isCorrect === true ? C.success : isCorrect === false ? C.error : isCurr ? theme.color : 'rgba(255,255,255,0.30)',
                          border: `2px solid ${isCorrect === true ? C.success : isCorrect === false ? C.error : isCurr ? theme.color : 'rgba(200,160,175,0.35)'}`,
                          boxShadow: isCurr ? `0 0 10px ${theme.glow}` : 'none',
                          transition: 'all 0.3s',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Counter + running score */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label }}>
                    Look {qIdx + 1} of {totalQ}
                  </div>
                  <div style={{
                    padding: '2px 10px', borderRadius: 99,
                    background: `rgba(${hexToRgb(theme.color)},0.12)`,
                    fontFamily: F.ui, fontWeight: 600, fontSize: 10, color: theme.color,
                  }}>
                    {correctCount} styled
                  </div>
                </div>

                {/* Question */}
                <GlassCard style={{ padding: '20px 22px', marginBottom: 16 }}>
                  <p style={{ fontFamily: F.heading, fontWeight: 500, fontSize: isMobile ? 16 : 18, color: C.deepRose, lineHeight: 1.5, margin: 0 }}>
                    {q.question}
                  </p>
                </GlassCard>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 4 }}>
                  {q.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect  = answered && i === q.correctIndex;
                    const isWrong    = answered && isSelected && i !== q.correctIndex;

                    return (
                      <motion.button
                        key={i}
                        whileHover={!answered ? { x: 3 } : {}}
                        animate={isWrong ? { x: [-4, 4, -4, 0] } : {}}
                        transition={isWrong ? { duration: 0.3 } : {}}
                        onClick={() => handleAnswer(i)}
                        style={{
                          width: '100%', textAlign: 'left',
                          padding: '13px 16px', minHeight: 44,
                          display: 'flex', alignItems: 'center', gap: 12,
                          borderRadius: 12,
                          background: isCorrect
                            ? 'rgba(126,201,160,0.18)'
                            : isWrong
                              ? 'rgba(232,112,112,0.14)'
                              : isSelected
                                ? `rgba(${hexToRgb(theme.color)},0.14)`
                                : 'rgba(255,255,255,0.30)',
                          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                          border: isCorrect
                            ? `1.5px solid ${C.success}`
                            : isWrong
                              ? '1.5px solid rgba(232,112,112,0.70)'
                              : isSelected
                                ? `1.5px solid ${theme.color}`
                                : '1px solid rgba(255,255,255,0.55)',
                          cursor: answered ? 'default' : 'pointer',
                          fontFamily: F.ui, fontSize: 13,
                          color: isCorrect ? '#2a7a50' : isWrong ? '#b33' : C.deepRose,
                          fontWeight: isSelected ? 600 : 400,
                          transition: 'all 0.18s ease',
                        }}
                      >
                        <span style={{
                          width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isCorrect ? C.success : isWrong ? C.error : isSelected ? theme.color : 'rgba(200,160,175,0.20)',
                          fontFamily: F.ui, fontWeight: 700, fontSize: 10,
                          color: (isCorrect || isWrong || isSelected) ? '#fff' : C.label,
                        }}>
                          {isCorrect ? <Check size={12} /> : isWrong ? <XCircle size={12} /> : OPTION_LABELS[i]}
                        </span>
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
                      exit={{ opacity: 0 }}
                      style={{
                        marginTop: 14, padding: '12px 16px', borderRadius: 12,
                        background: selected === q.correctIndex ? 'rgba(126,201,160,0.10)' : 'rgba(232,112,112,0.08)',
                        border: `1px solid ${selected === q.correctIndex ? 'rgba(126,201,160,0.35)' : 'rgba(232,112,112,0.30)'}`,
                        borderTop: '1px solid rgba(255,255,255,0.50)',
                      }}
                    >
                      <p style={{ fontFamily: F.ui, fontSize: 12, color: C.body, margin: 0, lineHeight: 1.6 }}>
                        {q.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ══ VICTORY ═══════════════════════════════════════════════ */}
            {phase === 'victory' && (
              <motion.div
                key="victory"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: 'center' }}
              >
                {/* Iridescent star */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                  style={{ marginBottom: 22 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      width: 96, height: 96, borderRadius: '50%', margin: '0 auto',
                      background: 'linear-gradient(135deg, #ffffff, #fde68a, #f7a0b8, #c084fc)',
                      boxShadow: '0 0 40px rgba(253,230,138,0.60), 0 0 80px rgba(247,160,184,0.40)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Star size={48} color="#9d1f4a" fill="#9d1f4a" />
                  </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.40 }}>
                  <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.label, marginBottom: 6 }}>
                    Runway Conquered
                  </div>
                  <h2 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 30, color: C.deepRose, margin: '0 0 6px', lineHeight: 1.1 }}>
                    Absolutely Iconic!
                  </h2>
                  <div style={{ fontFamily: F.script, fontSize: 20, color: C.midRose, marginBottom: 20 }}>
                    {boss.victoryLine}
                  </div>
                </motion.div>

                {/* Score + SP */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                  <GlassCard style={{ padding: '20px 24px', marginBottom: 14, display: 'flex', justifyContent: 'space-around' }}>
                    <div>
                      <div style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 26, color: theme.color }}>{correctCount}/{totalQ}</div>
                      <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.label, marginTop: 3 }}>Looks Styled</div>
                    </div>
                    <div style={{ width: 1, background: 'rgba(247,160,184,0.25)' }} />
                    <div>
                      <div style={{ fontFamily: F.heading, fontWeight: 700, fontSize: 26, color: C.deepRose }}>+{spCount}</div>
                      <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.label, marginTop: 3 }}>Style Points</div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Badge earned */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.70 }}>
                  <GlassCard style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: 'linear-gradient(135deg, #fde68a, #f7a0b8, #c084fc)',
                      boxShadow: '0 0 16px rgba(253,230,138,0.45)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Crown size={22} color="#9d1f4a" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.label, marginBottom: 2 }}>
                        Designer Label Earned
                      </div>
                      <div style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 15, color: C.deepRose }}>
                        {boss.badge}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
                  <GradBtn
                    onClick={() => { onVictory?.(); onClose?.(); }}
                    style={{ width: '100%', padding: '15px' }}
                  >
                    Continue to Map <ChevronRight size={16} />
                  </GradBtn>
                </motion.div>
              </motion.div>
            )}

            {/* ══ DEFEAT ════════════════════════════════════════════════ */}
            {phase === 'defeat' && (
              <motion.div
                key="defeat"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: 'center' }}
              >
                {/* Boss icon dimmed */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  style={{
                    width: 80, height: 80, borderRadius: 18, margin: '0 auto 20px',
                    background: 'rgba(200,160,175,0.15)',
                    border: '2px solid rgba(200,160,175,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Crown size={38} color="rgba(200,160,175,0.60)" />
                </motion.div>

                <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase', color: C.label, marginBottom: 6 }}>
                  Not Quite Yet
                </div>
                <h2 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 26, color: C.deepRose, margin: '0 0 4px' }}>
                  Almost There, Darling
                </h2>
                <div style={{ fontFamily: F.script, fontSize: 18, color: C.midRose, marginBottom: 18 }}>
                  {boss.defeatLine}
                </div>

                <GlassCard style={{ padding: '18px', marginBottom: 14 }}>
                  <div style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 24, color: 'rgba(180,80,80,0.85)', marginBottom: 4 }}>
                    {correctCount}/{totalQ} Looks Styled
                  </div>
                  <div style={{ fontFamily: F.ui, fontSize: 11, color: C.label, letterSpacing: '0.10em' }}>
                    Need {PASS}/{totalQ} to conquer the Runway Show
                  </div>
                </GlassCard>

                <GlassCard style={{ padding: '12px 18px', marginBottom: 24 }}>
                  <p style={{ fontFamily: F.ui, fontSize: 13, color: C.body, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                    Review the collection and try again. Every icon has a fitting-room moment.
                  </p>
                </GlassCard>

                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10 }}>
                  <GradBtn onClick={handleRetry} style={{ flex: 2, padding: '14px', width: isMobile ? '100%' : 'auto' }}>
                    <RotateCcw size={15} /> Try Again
                  </GradBtn>
                  <GlassBtn onClick={onClose} style={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
                    Back to Map
                  </GlassBtn>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
