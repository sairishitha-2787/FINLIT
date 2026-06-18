// FINLIT - Neo-Brutalist Quiz Environment
// With Confetti and Gamification

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calculator, Swords, Sparkles, Star } from 'lucide-react';
import AnimatedIcon from '../shared/AnimatedIcon';
import confetti from 'canvas-confetti';
import QuizCard from './QuizCard';
import AnimatedFeedback from './AnimatedFeedback';
import useGamification from '../../hooks/useGamification';
import { gamingTheme } from '../../styles/gamingTheme';

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const GAMING_LEVEL_COLORS = ['#4ECDC4', '#FF8C42', null]; // null = use gamingColors.primary

const progressKey  = (topic) => `finlit_quiz_prog_${(topic || '').replace(/\s+/g, '_')}`;
const completedKey = (topic) => `finlit_quiz_done_${(topic || '').replace(/\s+/g, '_')}`;

const FASHION_LEVELS = {
  1: { label: 'THE FITTING',    Icon: Sparkles,   color: '#f7a0b8' },
  2: { label: 'THE NUMBERS',   Icon: Calculator,  color: '#c084fc' },
  3: { label: 'GRAND FINALE',  Icon: Star,        color: '#fde68a' },
};
const NFQ = { h: "'Playfair Display',serif", ui: "'DM Sans',sans-serif" };
const FGRAD = 'linear-gradient(135deg,#f7a0b8,#c084fc,#fbb6c4)';

const NeoQuizEnvironment = ({ questions, topic, onComplete, gamingMode, gamingColors, fashionMode }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    try {
      const saved = sessionStorage.getItem(progressKey(topic));
      return saved ? (JSON.parse(saved).idx || 0) : 0;
    } catch { return 0; }
  });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(() => {
    try {
      const saved = sessionStorage.getItem(progressKey(topic));
      return saved ? (JSON.parse(saved).score || 0) : 0;
    } catch { return 0; }
  });
  const { awardXP } = useGamification();
  // One-shot submit guard: a fast double-tap on "See Results" must not fire
  // onComplete twice (which would double-log events / toasts).
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittedRef = useRef(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowFeedback(true);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    submittedRef.current = false;
    setIsSubmitting(false);
    try { sessionStorage.removeItem(progressKey(topic)); } catch {}
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (isLastQuestion) {
      if (submittedRef.current) return;   // ignore double-taps
      submittedRef.current = true;
      setIsSubmitting(true);
      // Clear progress on completion
      try { sessionStorage.removeItem(progressKey(topic)); } catch {}
      const finalScore = score;

      onComplete(finalScore, totalQuestions);
    } else {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      // Persist progress so the user can resume if they navigate away
      try { sessionStorage.setItem(progressKey(topic), JSON.stringify({ idx: nextIdx, score })); } catch {}
    }
  };

  const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;

  // Get current level info
  const getCurrentLevel = () => {
    const level = currentQuestion.level || 1;
    const levelName = currentQuestion.levelName || 'UNDERSTANDING';
    const levelColors = {
      1: { bg: 'bg-brutal-blue',  text: 'text-brutal-white', Icon: BookOpen,    animation: 'none' },
      2: { bg: 'bg-brutal-pink',  text: 'text-brutal-black', Icon: Calculator,  animation: 'none' },
      3: { bg: 'bg-brutal-green', text: 'text-brutal-black', Icon: Swords,      animation: 'wiggle' }
    };
    return { level, levelName, ...levelColors[level] };
  };

  const currentLevel = getCurrentLevel();
  const gc = gamingColors || {};

  // ── Sports theme override (when gc.sports is true) ───────────────────────────
  const sm = !!(gamingMode && gc.sports);
  const xt = {
    cardBg: sm ? 'rgba(22,22,22,0.95)'               : gamingTheme.cardBg,
    fontH:  sm ? "'Bebas Neue', cursive"              : gamingTheme.fontHeading,
    fontL:  sm ? "'Barlow Condensed', sans-serif"     : gamingTheme.fontLabel,
    fontB:  sm ? "'Inter', sans-serif"                : gamingTheme.fontBody,
    text1:  sm ? '#fff'                               : gamingTheme.stellarWhite,
    text2:  sm ? 'rgba(255,255,255,0.72)'             : gamingTheme.seafoam,
    muted:  sm ? 'rgba(255,255,255,0.4)'              : gamingTheme.mutedBlue,
    border: sm ? '1px solid rgba(255,255,255,0.1)'    : gamingTheme.borderThin,
    blur:   sm ? '16px'                               : gamingTheme.glassBlur,
    dark:   sm ? '#000'                               : gamingTheme.bgDark,
    score:  sm ? gc.primary                           : gc.primary,
    lsz:    sm ? '1.5px'                              : '2px',
  };

  // ── Fashion render ───────────────────────────────────────────────────────────
  if (fashionMode) {
    const lvlNum = currentLevel.level || 1;
    const fl = FASHION_LEVELS[Math.min(lvlNum, 3)];
    const FlIcon = fl.Icon;
    const glassCard = { background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderTop: '1.5px solid rgba(255,255,255,0.60)', borderLeft: '1.5px solid rgba(255,255,255,0.60)', borderBottom: '1.5px solid rgba(247,160,184,0.25)', borderRight: '1.5px solid rgba(247,160,184,0.25)', borderRadius: 18 };

    return (
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Level progress tracker */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
          <div style={{ ...glassCard, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontFamily: NFQ.ui, fontWeight: 600, fontSize: 10, color: '#9d1f4a', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Quiz Progression</span>
              <span style={{ fontFamily: NFQ.ui, fontSize: 11, color: '#c98a9e', letterSpacing: '0.08em' }}>Q{currentQuestionIndex + 1} / {totalQuestions}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[1, 2, 3].map((lvl) => {
                const isAct = lvlNum === lvl, isPast = lvlNum > lvl;
                const lfl = FASHION_LEVELS[lvl];
                const LI = lfl.Icon;
                return (
                  <div key={lvl} style={{ flex: 1, borderRadius: 12, padding: '12px 8px', textAlign: 'center', background: isAct ? `rgba(${lvl === 1 ? '247,160,184' : lvl === 2 ? '192,132,252' : '253,230,138'},0.18)` : isPast ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)', border: `1px solid rgba(${lvl === 1 ? '247,160,184' : lvl === 2 ? '192,132,252' : '253,230,138'},${isAct ? '0.55' : isPast ? '0.22' : '0.12'})`, transform: isAct ? 'scale(1.04)' : 'scale(1)', opacity: isPast ? 0.6 : 1, transition: 'all 0.25s ease' }}>
                    <LI size={18} color={isAct || isPast ? lfl.color : '#c98a9e'} style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontFamily: NFQ.ui, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: isAct || isPast ? lfl.color : '#c98a9e' }}>{lfl.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Level badge + score */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, ...glassCard, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, background: `rgba(${lvlNum === 1 ? '247,160,184' : lvlNum === 2 ? '192,132,252' : '253,230,138'},0.10)` }}>
            <div style={{ width: 3, height: 36, borderRadius: 2, background: fl.color, flexShrink: 0 }} />
            <FlIcon size={22} color={fl.color} />
            <div>
              <div style={{ fontFamily: NFQ.ui, fontSize: 8, color: '#c98a9e', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Level {lvlNum}</div>
              <div style={{ fontFamily: NFQ.h, fontSize: 15, fontWeight: 600, color: '#9d1f4a' }}>{fl.label}</div>
            </div>
          </div>
          <div style={{ ...glassCard, padding: '14px 20px', flexShrink: 0, background: 'rgba(255,255,255,0.25)' }}>
            <div style={{ fontFamily: NFQ.ui, fontSize: 8, color: '#c98a9e', letterSpacing: '0.18em', marginBottom: 4 }}>SCORE</div>
            <div style={{ fontFamily: NFQ.h, fontSize: 22, fontWeight: 600, color: '#9d1f4a' }}>{score}<span style={{ fontSize: 12, color: '#c98a9e', fontFamily: NFQ.ui }}>/{currentQuestionIndex + (showFeedback ? 1 : 0)}</span></div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <motion.div key={`fq-${currentQuestionIndex}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
              <QuizCard question={currentQuestion} questionNumber={currentQuestionIndex + 1} totalQuestions={totalQuestions} selectedAnswer={selectedAnswer} onSelectAnswer={handleAnswerSelect} fashionMode={true} />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
                <motion.button whileHover={{ y: -2, boxShadow: '0 10px 28px rgba(192,132,252,0.38)' }} whileTap={{ scale: 0.96 }} onClick={handleSubmitAnswer} disabled={!selectedAnswer}
                  style={{ background: selectedAnswer ? FGRAD : 'rgba(200,160,175,0.25)', border: 'none', color: selectedAnswer ? '#fff' : '#c98a9e', fontFamily: NFQ.ui, fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 40px', borderRadius: 14, cursor: selectedAnswer ? 'pointer' : 'not-allowed', boxShadow: selectedAnswer ? '0 6px 20px rgba(192,132,252,0.28)' : 'none', transition: 'all 0.2s ease' }}>
                  Confirm Answer
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={`ff-${currentQuestionIndex}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <AnimatedFeedback isCorrect={isAnswerCorrect} explanation={currentQuestion.explanation} brutalHonestFeedback={currentQuestion.brutalHonestFeedback} correctAnswer={currentQuestion.correctAnswer} userAnswer={selectedAnswer} options={currentQuestion.options} onNext={handleNextQuestion} onRetry={handleRetry} isLastQuestion={isLastQuestion} submitting={isSubmitting} fashionMode={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Gaming render ────────────────────────────────────────────────────────────
  if (gamingMode && gc.primary) {
    const stepIcons = [BookOpen, Calculator, Swords];
    const lvlColor = (lvl) => GAMING_LEVEL_COLORS[lvl - 1] ?? gc.primary;

    return (
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Progress tracker */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '20px' }}>
          <div style={{ background: xt.cardBg, border: xt.border, borderRadius: '14px', padding: '16px 20px', backdropFilter: `blur(${xt.blur})` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontFamily: xt.fontH, fontSize: '11px', fontWeight: 600, color: xt.text1, textTransform: 'uppercase', letterSpacing: '2px' }}>Quiz Progression</span>
              <span style={{ fontFamily: xt.fontL, fontSize: '10px', color: gc.primary, letterSpacing: '1px' }}>Q{currentQuestionIndex + 1} / {totalQuestions}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[1, 2, 3].map((lvl) => {
                const isActive = currentLevel.level === lvl;
                const isPassed = currentLevel.level > lvl;
                const StepIcon = stepIcons[lvl - 1];
                const c = lvlColor(lvl);
                return (
                  <div key={lvl} style={{ flex: 1, borderRadius: '10px', padding: '12px 8px', textAlign: 'center', background: isActive ? `rgba(${hexToRgbStr(c)},0.18)` : isPassed ? `rgba(${hexToRgbStr(c)},0.08)` : 'rgba(30,42,69,0.5)', border: `1px solid rgba(${hexToRgbStr(c)},${isActive ? '0.55' : isPassed ? '0.25' : '0.12'})`, transition: 'all 0.25s ease', transform: isActive ? 'scale(1.04)' : 'scale(1)', opacity: isPassed ? 0.7 : 1 }}>
                    <StepIcon size={18} color={isActive || isPassed ? c : xt.muted} style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontFamily: xt.fontL, fontSize: '8px', letterSpacing: xt.lsz, color: isActive || isPassed ? c : xt.muted }}>LVL {lvl}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Level badge + score */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, background: `rgba(${hexToRgbStr(lvlColor(currentLevel.level))},0.12)`, border: `1px solid rgba(${hexToRgbStr(lvlColor(currentLevel.level))},0.35)`, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 3, height: 36, borderRadius: 2, background: lvlColor(currentLevel.level), flexShrink: 0 }} />
            <currentLevel.Icon size={22} color={lvlColor(currentLevel.level)} />
            <div>
              <div style={{ fontFamily: xt.fontL, fontSize: '8px', color: xt.muted, letterSpacing: xt.lsz, textTransform: 'uppercase' }}>Level {currentLevel.level}</div>
              <div style={{ fontFamily: xt.fontH, fontSize: '14px', fontWeight: 700, color: xt.text1, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{currentLevel.levelName}</div>
            </div>
          </div>
          <div style={{ background: xt.cardBg, border: xt.border, borderRadius: '12px', padding: '14px 20px', flexShrink: 0 }}>
            <div style={{ fontFamily: xt.fontL, fontSize: '8px', color: xt.muted, letterSpacing: xt.lsz, marginBottom: '4px' }}>SCORE</div>
            <div style={{ fontFamily: xt.fontH, fontSize: '20px', fontWeight: 800, color: gc.primary }}>{score}<span style={{ fontSize: '12px', color: xt.muted }}>/{currentQuestionIndex + (showFeedback ? 1 : 0)}</span></div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <motion.div key={`question-${currentQuestionIndex}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
              <QuizCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={totalQuestions}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleAnswerSelect}
                gamingMode={true}
                gamingColors={gc}
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  style={{ background: selectedAnswer ? `linear-gradient(135deg, ${gc.primary}, ${gc.secondary || gc.primary})` : 'rgba(61,78,122,0.4)', border: `1px solid ${selectedAnswer ? gc.primary : 'rgba(139,184,233,0.2)'}`, color: selectedAnswer ? xt.dark : xt.muted, fontFamily: xt.fontH, fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '14px 40px', borderRadius: '10px', cursor: selectedAnswer ? 'pointer' : 'not-allowed', boxShadow: selectedAnswer ? `0 0 20px ${gc.glow}` : 'none', transition: 'all 0.2s ease' }}
                >
                  Submit Answer
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={`feedback-${currentQuestionIndex}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <AnimatedFeedback
                isCorrect={isAnswerCorrect}
                explanation={currentQuestion.explanation}
                brutalHonestFeedback={currentQuestion.brutalHonestFeedback}
                correctAnswer={currentQuestion.correctAnswer}
                userAnswer={selectedAnswer}
                options={currentQuestion.options}
                onNext={handleNextQuestion}
                onRetry={handleRetry}
                isLastQuestion={isLastQuestion}
                submitting={isSubmitting}
                gamingMode={true}
                gamingColors={gc}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Brutalist render ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto">
      {/* Level Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal rounded-none p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-black text-brutal-black">
              QUIZ PROGRESSION
            </h3>
            <span className="font-black text-brutal-black">
              Q{currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((lvl) => {
              const isActive = currentLevel.level === lvl;
              const isPassed = currentLevel.level > lvl;
              const stepIcons = [BookOpen, Calculator, Swords];
              const StepIcon = stepIcons[lvl - 1];
              return (
                <div
                  key={lvl}
                  className={`flex-1 border-4 border-brutal-black rounded-none p-3 text-center transition-all ${
                    isActive
                      ? 'bg-brutal-green scale-105'
                      : isPassed
                      ? 'bg-brutal-blue opacity-60'
                      : 'bg-brutal-bg opacity-40'
                  }`}
                >
                  <div className="flex justify-center mb-1 text-brutal-black"><StepIcon size={24} strokeWidth={2.5} /></div>
                  <p className="font-black text-xs text-brutal-black">
                    LVL {lvl}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Current Level Badge & Score */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-between items-center gap-4"
      >
        <div className={`${currentLevel.bg} border-4 border-brutal-black shadow-brutal px-6 py-3 rounded-none flex items-center gap-3 flex-1`}>
          <AnimatedIcon icon={currentLevel.Icon} size={32} animation={currentLevel.animation} className={currentLevel.text} />
          <div>
            <p className={`font-black ${currentLevel.text} text-sm`}>
              LEVEL {currentLevel.level}
            </p>
            <p className={`font-black ${currentLevel.text} text-xl`}>
              {currentLevel.levelName}
            </p>
          </div>
        </div>
        <div className="bg-brutal-black border-4 border-brutal-black shadow-brutal px-6 py-3 rounded-none">
          <span className="font-black text-brutal-green text-xl">
            SCORE: {score}/{currentQuestionIndex + (showFeedback ? 1 : 0)}
          </span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showFeedback ? (
          <motion.div
            key={`question-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <QuizCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleAnswerSelect}
            />

            <div className="flex justify-center mt-8">
              <motion.button
                whileHover={{ x: 4, y: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="bg-brutal-green border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover px-12 py-4 rounded-none font-black text-2xl text-brutal-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SUBMIT ANSWER
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`feedback-${currentQuestionIndex}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatedFeedback
              isCorrect={isAnswerCorrect}
              explanation={currentQuestion.explanation}
              brutalHonestFeedback={currentQuestion.brutalHonestFeedback}
              correctAnswer={currentQuestion.correctAnswer}
              userAnswer={selectedAnswer}
              options={currentQuestion.options}
              onNext={handleNextQuestion}
              onRetry={handleRetry}
              isLastQuestion={isLastQuestion}
              submitting={isSubmitting}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeoQuizEnvironment;
