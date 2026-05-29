// FINLIT — Scenario Quiz Environment
// 3-level challenge: MC → Calculation → Boss Fight (open-ended)

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, ChevronRight, Swords, Calculator, BookOpen, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { evaluateOpenEnded, getCorrectGif, getWrongGif } from '../../services/api';
import useGamification from '../../hooks/useGamification';
import { gamingTheme } from '../../styles/gamingTheme';

const FALLBACK_GIFS = {
  correct: 'https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy.gif',
  wrong:   'https://media.giphy.com/media/l2SpZtackEqFmMT3G/giphy.gif',
};

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

// ── Level badge configs ───────────────────────────────────────────────────────

const LEVEL_CONFIG = {
  1: { label: 'LEVEL 1 — UNDERSTANDING', icon: BookOpen,    bg: 'bg-brutal-blue',  text: 'text-brutal-white', gamingColor: '#4ECDC4' },
  2: { label: 'LEVEL 2 — APPLICATION',   icon: Calculator,  bg: 'bg-brutal-pink',  text: 'text-brutal-black', gamingColor: '#FF8C42' },
  3: { label: 'LEVEL 3 — BOSS FIGHT',    icon: Swords,      bg: 'bg-brutal-black', text: 'text-brutal-white', gamingColor: null },
};

const FASHION_LEVEL_CONFIG = {
  1: { label: 'THE FITTING',   icon: Sparkles,   color: '#f7a0b8' },
  2: { label: 'THE NUMBERS',   icon: Calculator,  color: '#c084fc' },
  3: { label: 'GRAND FINALE',  icon: Star,        color: '#fde68a' },
};

const FFonts = { h: "'Playfair Display',serif", ui: "'DM Sans',sans-serif" };
const FColors = { deep: '#9d1f4a', mid: '#d4537e', body: '#b0627a', label: '#c98a9e', pink: '#f7a0b8', purple: '#c084fc', gold: '#fde68a' };

// ── Main component ────────────────────────────────────────────────────────────

const scenarioProgressKey = (topic) => `finlit_scenario_prog_${(topic || '').replace(/\s+/g, '_')}`;

const ScenarioQuizEnvironment = ({
  questions,
  topic,
  scenarioTitle,
  scenarioContext,
  onComplete,
  gamingMode,
  gamingColors,
  fashionMode,
}) => {
  const { awardXP } = useGamification();
  const [idx, setIdx]                 = useState(() => {
    try {
      const saved = sessionStorage.getItem(scenarioProgressKey(topic));
      return saved ? (JSON.parse(saved).idx || 0) : 0;
    } catch { return 0; }
  });
  const [stage, setStage]             = useState('answering'); // answering | feedback | retry | evaluating | boss_result
  const [selectedChoice, setChoice]   = useState(null);        // MC
  const [calcInput, setCalcInput]     = useState('');          // calculation
  const [showHint, setShowHint]       = useState(false);
  const [retryAvailable, setRetry]    = useState(true);
  const [openInput, setOpenInput]     = useState('');          // open-ended
  const [isEvaluating, setEvaluating] = useState(false);
  const [openEval, setOpenEval]       = useState(null);        // Groq eval result
  const [score, setScore]             = useState(() => {
    try {
      const saved = sessionStorage.getItem(scenarioProgressKey(topic));
      return saved ? (JSON.parse(saved).score || 0) : 0;
    } catch { return 0; }
  });
  const [lastResult, setLastResult]   = useState(null);        // { correct, explanation }
  const [reactionGif, setReactionGif] = useState(null);
  const [gifLoading, setGifLoading]   = useState(false);
  const bossFireRef                   = useRef(false);

  const q = questions[idx];
  const level = q?.level || 1;
  const levelCfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
  const LevelIcon = levelCfg.icon;

  const gc = gamingColors || {};
  const gm = gamingMode && !!gc.primary;
  const fm = !!fashionMode;

  // ── Sports theme override ────────────────────────────────────────────────────
  const sm = !!(gm && gc.sports);
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
    mint:   sm ? '#4ECDC4'                         : gamingTheme.mint,
    inner:  sm ? 'rgba(18,18,18,0.7)'              : 'rgba(15,20,40,0.6)',
  };

  const levelAccent = levelCfg.gamingColor ?? gc.primary;

  const fashionLevelCfg = FASHION_LEVEL_CONFIG[level] || FASHION_LEVEL_CONFIG[1];
  const FLevelIcon = fashionLevelCfg.icon;
  const fa = fashionLevelCfg.color; // fashion accent for current level

  const wordCount = openInput.trim().split(/\s+/).filter(Boolean).length;

  // ── Boss Fight confetti ───────────────────────────────────────────────────

  useEffect(() => {
    if (stage === 'boss_result' && openEval?.passed && !bossFireRef.current) {
      bossFireRef.current = true;
      fireConfetti();
      awardXP.bossFight();
    }
  }, [stage, openEval]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch reaction GIF when feedback is shown
  useEffect(() => {
    if (stage !== 'feedback' || !lastResult) return;
    let cancelled = false;
    setGifLoading(true);
    setReactionGif(null);
    (lastResult.correct ? getCorrectGif() : getWrongGif())
      .then(res => {
        if (!cancelled) setReactionGif(res?.gif?.url || (lastResult.correct ? FALLBACK_GIFS.correct : FALLBACK_GIFS.wrong));
      })
      .catch(() => {
        if (!cancelled) setReactionGif(lastResult.correct ? FALLBACK_GIFS.correct : FALLBACK_GIFS.wrong);
      })
      .finally(() => { if (!cancelled) setGifLoading(false); });
    return () => { cancelled = true; };
  }, [stage, lastResult]); // eslint-disable-line react-hooks/exhaustive-deps

  function fireConfetti() {
    const opts = { particleCount: 80, spread: 60, startVelocity: 45, colors: fm ? ['#f7a0b8','#c084fc','#fde68a','#fff'] : undefined };
    confetti({ ...opts, origin: { x: 0.15, y: 0.6 } });
    confetti({ ...opts, origin: { x: 0.85, y: 0.6 } });
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleMCSubmit() {
    if (selectedChoice === null) return;
    // Templates may use `correct: 'A'`; Groq output uses `correctIndex: 0`.
    let correctIdx = q.correctIndex;
    if (correctIdx === undefined && typeof q.correct === 'string') {
      correctIdx = q.correct.toUpperCase().charCodeAt(0) - 65; // 'A'→0, 'B'→1, etc.
    }
    const correct = selectedChoice === correctIdx;
    if (correct) setScore(s => s + 1);
    setLastResult({ correct, explanation: q.explanation });
    setStage('feedback');
  }

  function handleCalcSubmit(isRetry = false) {
    const val = parseFloat(calcInput.replace(/,/g, ''));
    if (isNaN(val)) return;
    const [lo, hi] = q.acceptableRange || [q.correctAnswer * 0.95, q.correctAnswer * 1.05];
    const correct = val >= lo && val <= hi;

    if (correct) {
      setScore(s => s + 1);
      setLastResult({ correct: true, explanation: q.feedback?.correct || 'Correct!' });
      setStage('feedback');
    } else if (!isRetry && retryAvailable) {
      setLastResult({ correct: false, explanation: q.feedback?.wrong || 'Try again!' });
      setRetry(false);
      setStage('retry');
    } else {
      setLastResult({ correct: false, explanation: q.feedback?.wrong || 'Check the formula and try again.' });
      setStage('feedback');
    }
  }

  async function handleOpenSubmit() {
    if (!openInput.trim()) return;
    setEvaluating(true);
    setStage('evaluating');
    try {
      const result = await evaluateOpenEnded({
        topic,
        domain: '',
        scenarioContext: scenarioContext || '',
        question: q.question,
        evaluationCriteria: q.evaluationCriteria || [],
        userAnswer: openInput,
      });
      setOpenEval(result);
    } catch {
      setOpenEval({ score: 3, passed: true, feedback: 'Great effort!', strengths: [], missed: [] });
    } finally {
      setEvaluating(false);
      setStage('boss_result');
    }
  }

  function handleNext() {
    const isLast = idx === questions.length - 1;
    if (isLast) {
      try { sessionStorage.removeItem(scenarioProgressKey(topic)); } catch {}
      onComplete(score, questions.length);
      return;
    }
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    setStage('answering');
    setChoice(null);
    setCalcInput('');
    setShowHint(false);
    setRetry(true);
    setLastResult(null);
    setReactionGif(null);
    try { sessionStorage.setItem(scenarioProgressKey(topic), JSON.stringify({ idx: nextIdx, score })); } catch {}
  }

  const progress = Math.round(((idx) / questions.length) * 100);

  // ── Gaming style helpers ──────────────────────────────────────────────────

  const gCard = {
    background: xt.cardBg,
    backdropFilter: `blur(${xt.blur})`,
    border: `1px solid rgba(${hexToRgbStr(levelAccent)},0.35)`,
    borderRadius: '16px',
    overflow: 'hidden',
  };

  const gInput = {
    width: '100%',
    background: xt.inner,
    border: `1px solid rgba(${hexToRgbStr(gc.primary || '#4ECDC4')},0.3)`,
    borderRadius: '10px',
    padding: '12px 16px',
    fontFamily: xt.fontB,
    fontSize: '16px',
    color: xt.text1,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const gPrimaryBtn = (disabled = false) => ({
    width: '100%',
    padding: '14px',
    fontFamily: xt.fontH,
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    border: 'none',
    borderRadius: '10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    background: disabled
      ? 'rgba(61,78,122,0.4)'
      : `linear-gradient(135deg, ${gc.primary || levelAccent}, ${gc.secondary || levelAccent})`,
    color: disabled ? xt.muted : xt.dark,
    boxShadow: disabled ? 'none' : `0 4px 20px rgba(${hexToRgbStr(gc.primary || levelAccent)},0.4)`,
  });

  const gSecondaryBtn = {
    width: '100%',
    padding: '14px',
    fontFamily: xt.fontH,
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    background: `rgba(${hexToRgbStr(levelAccent)},0.12)`,
    border: `1px solid rgba(${hexToRgbStr(levelAccent)},0.35)`,
    borderRadius: '10px',
    color: levelAccent,
    cursor: 'pointer',
  };

  // ── Fashion style helpers ─────────────────────────────────────────────────

  const fCard = {
    background: 'rgba(255,255,255,0.22)',
    backdropFilter: 'blur(24px) saturate(200%)',
    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
    borderTop: '1.5px solid rgba(255,255,255,0.65)',
    borderLeft: '1.5px solid rgba(255,255,255,0.65)',
    borderBottom: `1.5px solid rgba(${hexToRgbStr(fa)},0.28)`,
    borderRight: `1.5px solid rgba(${hexToRgbStr(fa)},0.28)`,
    borderRadius: 24,
    overflow: 'hidden',
  };

  const fInput = {
    width: '100%',
    background: 'rgba(255,255,255,0.35)',
    backdropFilter: 'blur(12px)',
    border: `1px solid rgba(${hexToRgbStr(fa)},0.4)`,
    borderRadius: '12px',
    padding: '12px 16px',
    fontFamily: FFonts.ui,
    fontSize: '15px',
    color: FColors.deep,
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
  };

  const fPrimaryBtn = (disabled = false) => ({
    width: '100%',
    padding: '14px',
    fontFamily: FFonts.ui,
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    border: 'none',
    borderRadius: '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    background: disabled ? 'rgba(255,255,255,0.3)' : 'linear-gradient(135deg,#f7a0b8,#c084fc,#fbb6c4)',
    color: disabled ? 'rgba(157,31,74,0.4)' : '#fff',
    boxShadow: disabled ? 'none' : '0 4px 20px rgba(247,160,184,0.4)',
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={(gm || fm) ? { maxWidth: '820px', margin: '0 auto' } : undefined} className={(gm || fm) ? '' : 'max-w-3xl mx-auto'}>

      {/* Progress */}
      {fm ? (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: FFonts.ui, fontSize: 10, color: FColors.label, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Look {idx + 1} of {questions.length}</span>
            <span style={{ fontFamily: FFonts.ui, fontSize: 10, color: fa, letterSpacing: '0.08em' }}>{progress}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: 'rgba(247,160,184,0.15)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg,#f7a0b8,#c084fc)`, width: `${progress}%`, transition: 'width 0.5s ease', boxShadow: '0 0 8px rgba(247,160,184,0.5)' }} />
          </div>
        </div>
      ) : gm ? (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: xt.fontL, fontSize: '9px', color: xt.muted, letterSpacing: '2px' }}>QUESTION {idx + 1} OF {questions.length}</span>
            <span style={{ fontFamily: xt.fontL, fontSize: '9px', color: levelAccent, letterSpacing: '1px' }}>{progress}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(61,78,122,0.5)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '3px', background: `linear-gradient(90deg, ${levelAccent}, ${xt.mint})`, width: `${progress}%`, transition: 'width 0.5s ease', boxShadow: `0 0 8px ${gc.glow || levelAccent}` }} />
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-brutal-black/50">QUESTION {idx + 1} OF {questions.length}</span>
            <span className="text-xs font-black text-brutal-black/50">{progress}% COMPLETE</span>
          </div>
          <div className="h-3 bg-brutal-bg border-2 border-brutal-black">
            <div className="h-full bg-brutal-blue transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Scenario Context */}
      {idx === 0 && scenarioContext && (
        fm ? (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.6)', borderLeft: '1px solid rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(247,160,184,0.22)', borderRight: '1px solid rgba(247,160,184,0.22)', borderRadius: 18, padding: '16px 20px', marginBottom: 20 }}>
            <p style={{ fontFamily: FFonts.ui, fontSize: 9, color: FColors.label, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>The Scene</p>
            <p style={{ fontFamily: FFonts.ui, fontSize: 14, color: FColors.body, lineHeight: 1.6, margin: 0 }}>{scenarioContext}</p>
          </motion.div>
        ) : gm ? (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ background: xt.cardBg, border: xt.border, borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', backdropFilter: `blur(${xt.blur})` }}>
            <p style={{ fontFamily: xt.fontL, fontSize: '8px', color: xt.muted, letterSpacing: '2.5px', marginBottom: '8px' }}>THE SCENARIO</p>
            <p style={{ fontFamily: xt.fontB, fontSize: '14px', color: xt.text2, lineHeight: 1.6, margin: 0 }}>{scenarioContext}</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-brutal-white border-4 border-brutal-black shadow-brutal mb-6 p-5">
            <p className="text-xs font-black text-brutal-black/40 mb-1 tracking-wider">THE SCENARIO</p>
            <p className="font-bold text-brutal-black">{scenarioContext}</p>
          </motion.div>
        )
      )}

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${idx}-${stage}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          {/* Card wrapper */}
          <div style={fm ? fCard : gm ? gCard : undefined} className={(fm || gm) ? '' : 'bg-brutal-white border-4 border-brutal-black shadow-brutal'}>

            {/* Level Header */}
            {fm ? (
              <div style={{
                padding: '12px 20px',
                borderBottom: `1px solid rgba(${hexToRgbStr(fa)},0.2)`,
                background: `rgba(${hexToRgbStr(fa)},0.08)`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <FLevelIcon size={15} color={fa} />
                <span style={{ fontFamily: FFonts.ui, fontSize: 9, letterSpacing: '0.2em', color: fa, textTransform: 'uppercase', fontWeight: 600 }}>{fashionLevelCfg.label}</span>
              </div>
            ) : gm ? (
              <div style={{
                padding: '12px 20px',
                borderBottom: `1px solid rgba(${hexToRgbStr(levelAccent)},0.2)`,
                background: `rgba(${hexToRgbStr(levelAccent)},0.08)`,
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <LevelIcon size={16} color={levelAccent} />
                <span style={{ fontFamily: xt.fontL, fontSize: '9px', letterSpacing: '2.5px', color: levelAccent, textTransform: 'uppercase' }}>{levelCfg.label}</span>
              </div>
            ) : (
              <div className={`${levelCfg.bg} px-5 py-3 flex items-center gap-2 border-b-4 border-brutal-black`}>
                <LevelIcon size={16} strokeWidth={2.5} className={levelCfg.text} />
                <span className={`text-xs font-black tracking-wider ${levelCfg.text}`}>{levelCfg.label}</span>
              </div>
            )}

            {/* Card body */}
            <div style={(gm || fm) ? { padding: '24px' } : undefined} className={(gm || fm) ? '' : 'p-6'}>

              {/* Question text */}
              {fm ? (
                <p style={{ fontFamily: FFonts.h, fontSize: 18, fontWeight: 500, color: FColors.deep, lineHeight: 1.55, marginBottom: 24 }}>{q?.question || q?.scenario}</p>
              ) : gm ? (
                <p style={{ fontFamily: xt.fontB, fontSize: '17px', color: xt.text1, lineHeight: 1.65, marginBottom: '24px', fontWeight: 500 }}>{q?.question || q?.scenario}</p>
              ) : (
                <p className="text-xl font-black text-brutal-black mb-6 leading-snug">{q?.question || q?.scenario}</p>
              )}

              {/* ── MULTIPLE CHOICE ── */}
              {q?.type === 'multiple_choice' && stage === 'answering' && (
                fm ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(q.choices || []).map((choice, i) => {
                      const isSel = selectedChoice === i;
                      return (
                        <button key={i} onClick={() => setChoice(i)} style={{
                          width: '100%', textAlign: 'left', padding: '12px 16px',
                          fontFamily: FFonts.ui, fontSize: 14,
                          color: isSel ? FColors.deep : FColors.body,
                          background: isSel ? 'rgba(247,160,184,0.14)' : 'rgba(255,255,255,0.35)',
                          backdropFilter: 'blur(12px)',
                          borderTop: '1px solid rgba(255,255,255,0.62)',
                          borderLeft: '1px solid rgba(255,255,255,0.55)',
                          borderBottom: isSel ? `1.5px solid rgba(${hexToRgbStr(fa)},0.5)` : '1px solid rgba(247,160,184,0.18)',
                          borderRight: isSel ? `1.5px solid rgba(${hexToRgbStr(fa)},0.35)` : '1px solid rgba(247,160,184,0.18)',
                          borderRadius: 14, cursor: 'pointer', transition: 'all 0.18s ease',
                          boxShadow: isSel ? `0 0 16px rgba(${hexToRgbStr(fa)},0.18)` : 'none',
                          fontWeight: isSel ? 600 : 400,
                        }}>
                          {choice && typeof choice === 'object' ? choice.text : choice}
                        </button>
                      );
                    })}
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handleMCSubmit}
                      disabled={selectedChoice === null}
                      style={{ ...fPrimaryBtn(selectedChoice === null), marginTop: 8 }}
                    >
                      Confirm Look
                    </motion.button>
                  </div>
                ) : gm ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(q.choices || []).map((choice, i) => {
                      const isSelected = selectedChoice === i;
                      return (
                        <button
                          key={i}
                          onClick={() => setChoice(i)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '12px 16px',
                            fontFamily: xt.fontB,
                            fontSize: '14px',
                            color: isSelected ? xt.dark : xt.text2,
                            background: isSelected
                              ? `linear-gradient(135deg, ${levelAccent}, ${gc.secondary || levelAccent})`
                              : `rgba(${hexToRgbStr(levelAccent)},0.06)`,
                            border: `1px solid rgba(${hexToRgbStr(levelAccent)},${isSelected ? '0.8' : '0.2'})`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            boxShadow: isSelected ? `0 0 16px rgba(${hexToRgbStr(levelAccent)},0.35)` : 'none',
                            fontWeight: isSelected ? 600 : 400,
                          }}
                        >
                          {choice && typeof choice === 'object' ? choice.text : choice}
                        </button>
                      );
                    })}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleMCSubmit}
                      disabled={selectedChoice === null}
                      style={{ ...gPrimaryBtn(selectedChoice === null), marginTop: '8px' }}
                    >
                      Submit Answer
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(q.choices || []).map((choice, i) => (
                      <button
                        key={i}
                        onClick={() => setChoice(i)}
                        className={`w-full text-left px-4 py-3 border-2 font-bold transition-all ${
                          selectedChoice === i
                            ? 'bg-brutal-blue border-brutal-black text-brutal-white'
                            : 'bg-brutal-bg border-brutal-black/30 hover:border-brutal-black hover:bg-brutal-white'
                        }`}
                      >
                        {choice && typeof choice === 'object' ? choice.text : choice}
                      </button>
                    ))}
                    <motion.button
                      whileHover={{ x: 3, y: 3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleMCSubmit}
                      disabled={selectedChoice === null}
                      className="mt-4 w-full bg-brutal-green border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-6 py-3 font-black text-brutal-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      SUBMIT ANSWER
                    </motion.button>
                  </div>
                )
              )}

              {/* ── CALCULATION INPUT ── */}
              {q?.type === 'calculation' && (stage === 'answering' || stage === 'retry') && (
                fm ? (
                  <div>
                    <button
                      onClick={() => setShowHint(h => !h)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FFonts.ui, fontSize: 11, color: showHint ? fa : FColors.label, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, letterSpacing: '0.08em' }}
                    >
                      <HelpCircle size={13} />
                      {showHint ? 'Hide Formula' : 'Show Formula & Hints'}
                    </button>

                    {showHint && (
                      <div style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(12px)', border: '1px solid rgba(247,160,184,0.25)', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
                        <p style={{ fontFamily: FFonts.ui, fontSize: 9, color: FColors.label, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Formula</p>
                        <p style={{ fontFamily: FFonts.h, fontSize: 14, color: FColors.deep, marginBottom: 10 }}>{q.formula}</p>
                        {(q.hints || []).map((hint, i) => (
                          <p key={i} style={{ fontFamily: FFonts.ui, fontSize: 13, color: FColors.body, marginBottom: 4 }}>{i + 1}. {hint}</p>
                        ))}
                      </div>
                    )}

                    {stage === 'retry' && lastResult && (
                      <div style={{ background: 'rgba(255,160,160,0.08)', border: '1px solid rgba(255,160,160,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
                        <p style={{ fontFamily: FFonts.ui, fontSize: 9, color: '#d4537e', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>Check Your Numbers</p>
                        <p style={{ fontFamily: FFonts.ui, fontSize: 13, color: FColors.body }}>{lastResult.explanation}</p>
                      </div>
                    )}

                    <input
                      type="number"
                      value={calcInput}
                      onChange={e => setCalcInput(e.target.value)}
                      placeholder="Enter your answer..."
                      style={{ ...fInput, marginBottom: 14 }}
                      onKeyDown={e => e.key === 'Enter' && handleCalcSubmit(stage === 'retry')}
                    />

                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleCalcSubmit(stage === 'retry')}
                      disabled={!calcInput.trim()}
                      style={fPrimaryBtn(!calcInput.trim())}
                    >
                      {stage === 'retry' ? 'Try Again, Darling' : 'Submit the Numbers'}
                    </motion.button>
                  </div>
                ) : gm ? (
                  <div>
                    <button
                      onClick={() => setShowHint(h => !h)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: xt.fontL, fontSize: '9px', letterSpacing: '1.5px', color: showHint ? levelAccent : xt.muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', textTransform: 'uppercase' }}
                    >
                      <HelpCircle size={13} />
                      {showHint ? 'Hide Formula' : 'Show Formula & Hints'}
                    </button>

                    {showHint && (
                      <div style={{ background: xt.inner, border: xt.border, borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
                        <p style={{ fontFamily: xt.fontL, fontSize: '8px', color: xt.muted, letterSpacing: '2px', marginBottom: '8px' }}>FORMULA</p>
                        <p style={{ fontFamily: xt.fontB, fontSize: '14px', color: xt.text1, marginBottom: '10px' }}>{q.formula}</p>
                        {(q.hints || []).map((hint, i) => (
                          <p key={i} style={{ fontFamily: xt.fontB, fontSize: '13px', color: xt.text2, marginBottom: '4px' }}>{i + 1}. {hint}</p>
                        ))}
                      </div>
                    )}

                    {stage === 'retry' && lastResult && (
                      <div style={{ background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
                        <p style={{ fontFamily: xt.fontL, fontSize: '8px', color: '#ff6464', letterSpacing: '2px', marginBottom: '6px' }}>CHECK YOUR WORK</p>
                        <p style={{ fontFamily: xt.fontB, fontSize: '13px', color: xt.text2 }}>{lastResult.explanation}</p>
                      </div>
                    )}

                    <input
                      type="number"
                      value={calcInput}
                      onChange={e => setCalcInput(e.target.value)}
                      placeholder="Enter your answer..."
                      style={{ ...gInput, marginBottom: '14px' }}
                      onKeyDown={e => e.key === 'Enter' && handleCalcSubmit(stage === 'retry')}
                    />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCalcSubmit(stage === 'retry')}
                      disabled={!calcInput.trim()}
                      style={gPrimaryBtn(!calcInput.trim())}
                    >
                      {stage === 'retry' ? 'Try Again' : 'Submit Calculation'}
                    </motion.button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setShowHint(h => !h)}
                      className="flex items-center gap-2 text-sm font-bold text-brutal-black/50 hover:text-brutal-black mb-4 transition-colors"
                    >
                      <HelpCircle size={14} strokeWidth={2.5} />
                      {showHint ? 'HIDE FORMULA' : 'SHOW FORMULA & HINTS'}
                    </button>

                    {showHint && (
                      <div className="bg-brutal-bg border-2 border-brutal-black p-4 mb-4">
                        <p className="text-xs font-black text-brutal-black/50 mb-1 tracking-wider">FORMULA</p>
                        <p className="font-bold text-brutal-black mb-3">{q.formula}</p>
                        {(q.hints || []).map((hint, i) => (
                          <p key={i} className="text-sm font-bold text-brutal-black/70 mb-1">{i + 1}. {hint}</p>
                        ))}
                      </div>
                    )}

                    {stage === 'retry' && lastResult && (
                      <div className="bg-brutal-pink border-2 border-brutal-black p-4 mb-4">
                        <p className="text-xs font-black text-brutal-black/60 mb-1 tracking-wider">CHECK YOUR WORK</p>
                        <p className="text-sm font-bold text-brutal-black">{lastResult.explanation}</p>
                      </div>
                    )}

                    <input
                      type="number"
                      value={calcInput}
                      onChange={e => setCalcInput(e.target.value)}
                      placeholder="Enter your answer..."
                      className="w-full border-4 border-brutal-black px-4 py-3 font-black text-xl bg-brutal-bg text-brutal-black outline-none focus:border-brutal-blue mb-4"
                      onKeyDown={e => e.key === 'Enter' && handleCalcSubmit(stage === 'retry')}
                    />

                    <motion.button
                      whileHover={{ x: 3, y: 3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCalcSubmit(stage === 'retry')}
                      disabled={!calcInput.trim()}
                      className="w-full bg-brutal-green border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-6 py-3 font-black text-brutal-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {stage === 'retry' ? 'TRY AGAIN' : 'SUBMIT CALCULATION'}
                    </motion.button>
                  </div>
                )
              )}

              {/* ── OPEN ENDED ── */}
              {q?.type === 'open_ended' && stage === 'answering' && (
                fm ? (
                  <div>
                    {(q.evaluationCriteria || []).length > 0 && (
                      <div style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(12px)', border: '1px solid rgba(247,160,184,0.25)', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
                        <p style={{ fontFamily: FFonts.ui, fontSize: 9, color: FColors.label, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>Your look should include</p>
                        {q.evaluationCriteria.map((c, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                            <Sparkles size={12} color={fa} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontFamily: FFonts.ui, fontSize: 13, color: FColors.body }}>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <textarea
                      value={openInput}
                      onChange={e => setOpenInput(e.target.value)}
                      placeholder={q.placeholder || 'Share your style reasoning...'}
                      rows={5}
                      style={{ ...fInput, marginBottom: 10 }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontFamily: FFonts.ui, fontSize: 10, letterSpacing: '0.06em', color: wordCount >= (q.minWords || 20) ? fa : FColors.label }}>
                        {wordCount} words{q.minWords && wordCount < q.minWords ? ` (aim for ${q.minWords}+)` : ''}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handleOpenSubmit}
                      disabled={!openInput.trim()}
                      style={{ ...fPrimaryBtn(!openInput.trim()), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                      Submit Your Look <Sparkles size={14} />
                    </motion.button>
                  </div>
                ) : gm ? (
                  <div>
                    {(q.evaluationCriteria || []).length > 0 && (
                      <div style={{ background: xt.inner, border: xt.border, borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
                        <p style={{ fontFamily: xt.fontL, fontSize: '8px', color: xt.muted, letterSpacing: '2px', marginBottom: '10px' }}>YOUR ANSWER SHOULD COVER</p>
                        {q.evaluationCriteria.map((c, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                            <ChevronRight size={13} color={levelAccent} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontFamily: xt.fontB, fontSize: '13px', color: xt.text2 }}>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <textarea
                      value={openInput}
                      onChange={e => setOpenInput(e.target.value)}
                      placeholder={q.placeholder || 'Share your reasoning...'}
                      rows={5}
                      style={{ ...gInput, resize: 'none', marginBottom: '10px' }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ fontFamily: xt.fontL, fontSize: '9px', letterSpacing: '1px', color: wordCount >= (q.minWords || 20) ? levelAccent : xt.muted }}>
                        {wordCount} words{q.minWords && wordCount < q.minWords ? ` (aim for ${q.minWords}+)` : ''}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleOpenSubmit}
                      disabled={!openInput.trim()}
                      style={{ ...gPrimaryBtn(!openInput.trim()), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      Submit to Boss <Swords size={15} />
                    </motion.button>
                  </div>
                ) : (
                  <div>
                    {(q.evaluationCriteria || []).length > 0 && (
                      <div className="bg-brutal-bg border-2 border-brutal-black p-4 mb-4">
                        <p className="text-xs font-black text-brutal-black/50 mb-2 tracking-wider">YOUR ANSWER SHOULD COVER</p>
                        {q.evaluationCriteria.map((c, i) => (
                          <div key={i} className="flex items-start gap-2 mb-1">
                            <ChevronRight size={14} strokeWidth={2.5} className="text-brutal-blue mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-bold text-brutal-black/80">{c}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <textarea
                      value={openInput}
                      onChange={e => setOpenInput(e.target.value)}
                      placeholder={q.placeholder || 'Share your reasoning...'}
                      rows={5}
                      className="w-full border-4 border-brutal-black px-4 py-3 font-bold bg-brutal-bg text-brutal-black outline-none focus:border-brutal-blue resize-none mb-2"
                    />
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-black ${wordCount >= (q.minWords || 20) ? 'text-brutal-blue' : 'text-brutal-black/40'}`}>
                        {wordCount} words{q.minWords && wordCount < q.minWords ? ` (aim for ${q.minWords}+)` : ''}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ x: 3, y: 3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleOpenSubmit}
                      disabled={!openInput.trim()}
                      className="w-full bg-brutal-black border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-6 py-3 font-black text-brutal-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <span className="flex items-center justify-center gap-2">
                        SUBMIT TO BOSS <Swords size={18} strokeWidth={2.5} />
                      </span>
                    </motion.button>
                  </div>
                )
              )}

              {/* ── EVALUATING SPINNER ── */}
              {stage === 'evaluating' && (
                fm ? (
                  <div style={{ padding: '40px 0', textAlign: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid rgba(${hexToRgbStr(fa)},0.18)`, borderTopColor: fa, animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ fontFamily: FFonts.h, fontSize: 16, fontWeight: 500, color: FColors.deep }}>Curating Your Look...</p>
                    <p style={{ fontFamily: FFonts.ui, fontSize: 12, color: FColors.label, marginTop: 6 }}>Our stylist is reviewing your answer</p>
                  </div>
                ) : gm ? (
                  <div style={{ padding: '40px 0', textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid rgba(${hexToRgbStr(levelAccent)},0.2)`, borderTopColor: levelAccent, animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ fontFamily: xt.fontH, fontSize: '13px', color: xt.text1, letterSpacing: '2px', textTransform: 'uppercase' }}>Evaluating Your Answer...</p>
                    <p style={{ fontFamily: xt.fontB, fontSize: '12px', color: xt.muted, marginTop: '6px' }}>AI is reviewing your response</p>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <div className="w-12 h-12 border-4 border-brutal-black border-t-brutal-blue rounded-full animate-spin mx-auto mb-4" />
                    <p className="font-black text-brutal-black">EVALUATING YOUR ANSWER...</p>
                    <p className="text-sm font-bold text-brutal-black/50 mt-1">AI is reviewing your response</p>
                  </div>
                )
              )}

              {/* ── FEEDBACK (MC + Calc) ── */}
              {stage === 'feedback' && lastResult && (
                fm ? (
                  <div>
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: 16, borderRadius: 14, marginBottom: 12,
                      background: lastResult.correct ? 'rgba(247,160,184,0.10)' : 'rgba(255,130,130,0.08)',
                      border: `1px solid ${lastResult.correct ? 'rgba(247,160,184,0.4)' : 'rgba(255,130,130,0.35)'}`,
                    }}>
                      {lastResult.correct
                        ? <CheckCircle size={20} color={FColors.pink} style={{ flexShrink: 0, marginTop: 2 }} />
                        : <XCircle    size={20} color="#e07070"       style={{ flexShrink: 0, marginTop: 2 }} />
                      }
                      <div>
                        <p style={{ fontFamily: FFonts.h, fontSize: 15, fontWeight: 500, color: lastResult.correct ? FColors.mid : '#b05050', marginBottom: 6 }}>
                          {lastResult.correct ? 'Perfectly Styled!' : 'Not Quite, Darling'}
                        </p>
                        <p style={{ fontFamily: FFonts.ui, fontSize: 13, color: FColors.body, lineHeight: 1.6 }}>{lastResult.explanation}</p>
                      </div>
                    </div>

                    {/* Reaction GIF */}
                    {gifLoading ? (
                      <div style={{ padding: '14px 0', textAlign: 'center', fontFamily: FFonts.ui, fontSize: 12, color: FColors.label }}>Loading reaction...</div>
                    ) : reactionGif ? (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(247,160,184,0.25)', marginBottom: 14 }}>
                        <img src={reactionGif} alt="Reaction" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
                      </motion.div>
                    ) : null}

                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      style={{ ...fPrimaryBtn(false), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                      {idx === questions.length - 1 ? 'Finish Your Look' : 'Next Look'}
                      <ChevronRight size={16} />
                    </motion.button>
                  </div>
                ) : gm ? (
                  <div>
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px',
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '12px',
                      background: lastResult.correct ? 'rgba(78,205,196,0.1)' : 'rgba(255,100,100,0.1)',
                      border: `1px solid ${lastResult.correct ? 'rgba(78,205,196,0.4)' : 'rgba(255,100,100,0.4)'}`,
                    }}>
                      {lastResult.correct
                        ? <CheckCircle size={20} color={xt.mint} style={{ flexShrink: 0, marginTop: 2 }} />
                        : <XCircle    size={20} color="#ff6464"  style={{ flexShrink: 0, marginTop: 2 }} />
                      }
                      <div>
                        <p style={{ fontFamily: xt.fontH, fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', color: lastResult.correct ? xt.mint : '#ff6464', textTransform: 'uppercase', marginBottom: '6px' }}>
                          {lastResult.correct ? 'Correct!' : 'Not Quite'}
                        </p>
                        <p style={{ fontFamily: xt.fontB, fontSize: '13px', color: xt.text2, lineHeight: 1.6 }}>{lastResult.explanation}</p>
                      </div>
                    </div>

                    {/* Reaction GIF */}
                    {gifLoading ? (
                      <div style={{ padding: '16px 0', textAlign: 'center' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid rgba(${hexToRgbStr(levelAccent)},0.2)`, borderTopColor: levelAccent, animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                      </div>
                    ) : reactionGif ? (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ borderRadius: '12px', overflow: 'hidden', border: xt.border, marginBottom: '16px' }}>
                        <img src={reactionGif} alt="Reaction" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
                      </motion.div>
                    ) : null}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      style={{ ...gPrimaryBtn(false), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      {idx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      <ChevronRight size={16} />
                    </motion.button>
                  </div>
                ) : (
                  <div>
                    <div className={`flex items-start gap-3 p-4 border-4 mb-6 ${
                      lastResult.correct ? 'bg-brutal-green border-brutal-black' : 'bg-brutal-pink border-brutal-black'
                    }`}>
                      {lastResult.correct
                        ? <CheckCircle size={22} strokeWidth={2.5} className="text-brutal-black flex-shrink-0 mt-0.5" />
                        : <XCircle    size={22} strokeWidth={2.5} className="text-brutal-black flex-shrink-0 mt-0.5" />
                      }
                      <div>
                        <p className="font-black text-brutal-black mb-1">
                          {lastResult.correct ? 'CORRECT!' : 'NOT QUITE'}
                        </p>
                        <p className="text-sm font-bold text-brutal-black/80">{lastResult.explanation}</p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ x: 3, y: 3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      className="w-full bg-brutal-blue border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-6 py-3 font-black text-brutal-white transition-all"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {idx === questions.length - 1 ? 'FINISH QUIZ' : 'NEXT QUESTION'}
                        <ChevronRight size={18} strokeWidth={2.5} />
                      </span>
                    </motion.button>
                  </div>
                )
              )}

              {/* ── BOSS FIGHT / GRAND FINALE RESULT ── */}
              {stage === 'boss_result' && openEval && (
                fm ? (
                  <div>
                    <div style={{
                      borderRadius: 16, padding: 20, marginBottom: 20,
                      background: openEval.passed ? 'rgba(247,160,184,0.08)' : 'rgba(255,130,130,0.06)',
                      border: `1px solid ${openEval.passed ? 'rgba(247,160,184,0.38)' : 'rgba(255,130,130,0.3)'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        {[1,2,3,4,5].map(n => (
                          <Star key={n} size={18} color={n <= openEval.score ? FColors.pink : 'rgba(247,160,184,0.2)'} fill={n <= openEval.score ? FColors.pink : 'transparent'} />
                        ))}
                        <span style={{ marginLeft: 8, fontFamily: FFonts.ui, fontSize: 13, fontWeight: 600, color: FColors.mid }}>{openEval.score}/5</span>
                      </div>
                      <p style={{ fontFamily: FFonts.h, fontSize: 22, fontWeight: 500, color: openEval.passed ? FColors.deep : '#b05050', marginBottom: 6 }}>
                        {openEval.passed ? 'Show-Stopping, Darling!' : 'Keep Styling!'}
                      </p>
                      <p style={{ fontFamily: FFonts.ui, fontSize: 13, color: FColors.body, lineHeight: 1.6 }}>{openEval.feedback}</p>
                    </div>

                    {openEval.strengths?.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <p style={{ fontFamily: FFonts.ui, fontSize: 9, color: FColors.label, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>What Worked</p>
                        {openEval.strengths.map((s, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                            <CheckCircle size={12} color={FColors.pink} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontFamily: FFonts.ui, fontSize: 13, color: FColors.body }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {openEval.missed?.length > 0 && (
                      <div style={{ marginBottom: 20 }}>
                        <p style={{ fontFamily: FFonts.ui, fontSize: 9, color: FColors.label, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>To Refine</p>
                        {openEval.missed.map((m, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                            <Sparkles size={12} color={FColors.purple} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontFamily: FFonts.ui, fontSize: 13, color: FColors.body }}>{m}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      style={fPrimaryBtn(false)}
                    >
                      Finish Your Collection
                    </motion.button>
                  </div>
                ) : gm ? (
                  <div>
                    <div style={{
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '20px',
                      background: openEval.passed ? 'rgba(78,205,196,0.08)' : 'rgba(255,100,100,0.08)',
                      border: `1px solid ${openEval.passed ? 'rgba(78,205,196,0.35)' : 'rgba(255,100,100,0.35)'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        {[1,2,3,4,5].map(n => (
                          <Star
                            key={n}
                            size={20}
                            color={n <= openEval.score ? levelAccent : 'rgba(139,184,233,0.2)'}
                            fill={n <= openEval.score ? levelAccent : 'transparent'}
                          />
                        ))}
                        <span style={{ marginLeft: '8px', fontFamily: xt.fontH, fontSize: '14px', fontWeight: 700, color: xt.text1 }}>{openEval.score}/5</span>
                      </div>
                      <p style={{ fontFamily: xt.fontH, fontSize: '22px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: openEval.passed ? xt.mint : '#ff6464', marginBottom: '6px' }}>
                        {openEval.passed ? 'Boss Defeated!' : 'Keep Training!'}
                      </p>
                      <p style={{ fontFamily: xt.fontB, fontSize: '13px', color: xt.text2, lineHeight: 1.6 }}>{openEval.feedback}</p>
                    </div>

                    {openEval.strengths?.length > 0 && (
                      <div style={{ marginBottom: '14px' }}>
                        <p style={{ fontFamily: xt.fontL, fontSize: '8px', color: xt.muted, letterSpacing: '2px', marginBottom: '10px' }}>WHAT YOU GOT RIGHT</p>
                        {openEval.strengths.map((s, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                            <CheckCircle size={13} color={xt.mint} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontFamily: xt.fontB, fontSize: '13px', color: xt.text2 }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {openEval.missed?.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontFamily: xt.fontL, fontSize: '8px', color: xt.muted, letterSpacing: '2px', marginBottom: '10px' }}>AREAS TO EXPLORE</p>
                        {openEval.missed.map((m, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                            <ChevronRight size={13} color='#ff6464' style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontFamily: xt.fontB, fontSize: '13px', color: xt.text2 }}>{m}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      style={gPrimaryBtn(false)}
                    >
                      Finish Quest
                    </motion.button>
                  </div>
                ) : (
                  <div>
                    <div className={`border-4 border-brutal-black p-5 mb-5 ${openEval.passed ? 'bg-brutal-green' : 'bg-brutal-pink'}`}>
                      <div className="flex items-center gap-1 mb-2">
                        {[1,2,3,4,5].map(n => (
                          <Star
                            key={n}
                            size={20}
                            strokeWidth={2}
                            className={n <= openEval.score ? 'text-brutal-black fill-brutal-black' : 'text-brutal-black/20'}
                          />
                        ))}
                        <span className="ml-2 font-black text-brutal-black">{openEval.score}/5</span>
                      </div>
                      <p className="font-black text-2xl text-brutal-black mb-1">
                        {openEval.passed ? 'BOSS DEFEATED!' : 'KEEP TRAINING!'}
                      </p>
                      <p className="font-bold text-brutal-black/80 text-sm">{openEval.feedback}</p>
                    </div>

                    {openEval.strengths?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-black text-brutal-black/50 mb-2 tracking-wider">WHAT YOU GOT RIGHT</p>
                        {openEval.strengths.map((s, i) => (
                          <div key={i} className="flex items-start gap-2 mb-1">
                            <CheckCircle size={14} strokeWidth={2.5} className="text-brutal-blue mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-bold text-brutal-black/80">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {openEval.missed?.length > 0 && (
                      <div className="mb-5">
                        <p className="text-xs font-black text-brutal-black/50 mb-2 tracking-wider">AREAS TO EXPLORE</p>
                        {openEval.missed.map((m, i) => (
                          <div key={i} className="flex items-start gap-2 mb-1">
                            <ChevronRight size={14} strokeWidth={2.5} className="text-brutal-pink mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-bold text-brutal-black/80">{m}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ x: 3, y: 3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      className="w-full bg-brutal-black border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-6 py-3 font-black text-brutal-white transition-all"
                    >
                      FINISH QUIZ
                    </motion.button>
                  </div>
                )
              )}

            </div>{/* end card body */}
          </div>{/* end card wrapper */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ScenarioQuizEnvironment;
