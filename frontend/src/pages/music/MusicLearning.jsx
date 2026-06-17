import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Trophy, RotateCcw, ChevronRight, BarChart2 } from 'lucide-react';
import QuizHistoryModal from '../../components/QuizHistoryModal';
import { MUSIC_TOPICS } from '../../data/musicTopics';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastProvider';
import { getExplanation, getQuiz, generateScenarioQuiz, getAdaptiveExplanation } from '../../services/api';
import ExplanationDisplay from '../../components/learning/ExplanationDisplay';
import QuizDiagnosis from '../../components/learning/QuizDiagnosis';
import PostQuizReflection from '../../components/learning/PostQuizReflection';
import NeoQuizEnvironment from '../../components/quiz/NeoQuizEnvironment';
import ScenarioQuizEnvironment from '../../components/quiz/ScenarioQuizEnvironment';
import JargonFlashcard from '../../components/learning/JargonFlashcard';
import XPPopup from '../../components/shared/XPPopup';
import FloatingMentor from '../../components/mentor/FloatingMentor';
import { useGamification } from '../../hooks/useGamification';
import confetti from 'canvas-confetti';
import { getClusterTheme, CLUSTER_MAP } from '../../styles/musicTheme';
import { getRandomQuestions } from '../../data/musicQuestions';

// ─── Music celebration ─────────────────────────────────────────────────────────
function fireMusicCelebration(accent) {
  const a = accent || '#D798A3';
  const gold = '#fbbf24';
  confetti({
    particleCount: 180, spread: 100, origin: { x: 0.5, y: 0.55 },
    colors: [a, gold, '#fff', '#60a5fa'], gravity: 0.5, scalar: 1.2, ticks: 320,
  });
  setTimeout(() => {
    confetti({ particleCount: 70, angle: 60,  spread: 52, origin: { x: 0, y: 0.65 }, colors: [a, gold] });
    confetti({ particleCount: 70, angle: 120, spread: 52, origin: { x: 1, y: 0.65 }, colors: [a, '#fff'] });
  }, 100);
  setTimeout(() =>
    confetti({
      particleCount: 90, spread: 120, origin: { x: 0.5, y: 0 },
      colors: [a, gold, '#fff'], gravity: 0.4, scalar: 0.7, ticks: 400,
    }), 380);
}

// ─── Cache helpers ─────────────────────────────────────────────────────────────
const storageKey = (t) => `finlit_progress_${t?.replace(/\s+/g, '_')}`;
const explKey    = (t, v) => `finlit_expl_${t?.replace(/\s+/g, '_')}_v${v}`;
const quizKey    = (t) => `finlit_quiz_${t?.replace(/\s+/g, '_')}`;

const save  = (t, d) => { try { localStorage.setItem(storageKey(t), JSON.stringify(d)); } catch {} };
const clear = (t)    => { try { localStorage.removeItem(storageKey(t)); [0,1,2].forEach(v => sessionStorage.removeItem(explKey(t,v))); sessionStorage.removeItem(quizKey(t)); } catch {} };

const getExplCache = (t, v) => { try { const r = sessionStorage.getItem(explKey(t,v));  return r ? JSON.parse(r) : null; } catch { return null; } };
const setExplCache = (t, v, d) => { try { sessionStorage.setItem(explKey(t,v), JSON.stringify(d)); } catch {} };
const getQuizCache = (t) => { try { const r = sessionStorage.getItem(quizKey(t));  return r ? JSON.parse(r) : null; } catch { return null; } };
const setQuizCache = (t, d) => { try { sessionStorage.setItem(quizKey(t), JSON.stringify(d)); } catch {} };

// ─── Background overlay ────────────────────────────────────────────────────────
function MusicLearningBg({ color }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 45% at 50% 0%, ${color}12 0%, transparent 65%)`,
      }} />
    </div>
  );
}

// ─── Label chip ────────────────────────────────────────────────────────────────
function Label({ children, color, theme }) {
  return (
    <div style={{
      fontFamily: theme.fontSub, fontWeight: 700,
      fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
      color: color || theme.textMuted, marginBottom: 6,
    }}>
      {children}
    </div>
  );
}

// ─── Performance rating ────────────────────────────────────────────────────────
function rating(pct) {
  if (pct === 1)   return { label: 'PERFECT SCORE',       color: '#fbbf24' };
  if (pct >= 0.8)  return { label: 'STRONG PERFORMANCE',  color: '#4ade80' };
  if (pct >= 0.6)  return { label: 'SOLID EFFORT',        color: '#60a5fa' };
  return                  { label: 'KEEP PRACTICING',     color: '#f87171' };
}

// ─── XP count-up hook ─────────────────────────────────────────────────────────
function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const steps = 30;
    const inc   = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, target);
      setVal(Math.round(cur));
      if (cur >= target) clearInterval(t);
    }, duration / steps);
    return () => clearInterval(t);
  }, [target, duration]);
  return val;
}

// ─── Cluster-specific complete copy ───────────────────────────────────────────
function completeHeading(cluster, theme) {
  if (cluster === 'neon')   return 'SIGNAL RECEIVED';
  if (cluster === 'dreamy') return theme.fontHeading.includes('Cormorant') ? 'Track Complete' : 'TRACK COMPLETE';
  return 'TRACK DROPPED!'; // vinyl
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function MusicLearning() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { profile, completedTopics, addTopicProgress } = useUser();
  const toast = useToast();
  const { xp, level, xpPopups, awardXP, checkBadgeUnlock, badgeNotification } = useGamification();
  const outletCtx = useOutletContext();

  const C       = outletCtx?.musicColor     || '#D798A3';
  const G       = outletCtx?.musicGlow      || 'rgba(215,152,163,0.5)';
  const cluster = outletCtx?.musicCluster   || CLUSTER_MAP[outletCtx?.musicCharacter?.id] || 'dreamy';
  const theme   = getClusterTheme(outletCtx?.musicCharacter?.id);
  const gc      = { primary: C, secondary: C, glow: G };

  const topic       = location.state?.topic;
  const topicId     = location.state?.topicId;
  const nextTopic   = location.state?.nextTopic   || null;
  const nextTopicId = location.state?.nextTopicId || null;
  const domain      = 'music';

  const [stage,           setStage]           = useState('loading');
  const [explanation,     setExplanation]     = useState(null);
  const [quiz,            setQuiz]            = useState(null);
  const [scenarioQuiz,    setScenarioQuiz]    = useState(null);
  const [jargonGuide,     setJargonGuide]     = useState(null);
  const [error,           setError]           = useState(null);
  const [variationIndex,  setVariationIndex]  = useState(0);
  const [isRegenerating,  setIsRegenerating]  = useState(false);
  const [quizResult,      setQuizResult]      = useState(null);
  const [showReflection,  setShowReflection]  = useState(false);
  const [showHistory,     setShowHistory]     = useState(false);
  const [comprehension,   setComprehension]   = useState({});
  const [adaptiveContent, setAdaptiveContent] = useState({});
  const [adaptiveLoading, setAdaptiveLoading] = useState({});

  // Fire celebration on complete
  useEffect(() => {
    if (stage === 'complete') {
      const t = setTimeout(() => fireMusicCelebration(C), 400);
      return () => clearTimeout(t);
    }
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!topic)   { navigate('/music/setlist'); return; }
    if (!profile) return;

    const cachedQ = getQuizCache(topic);
    if (cachedQ) {
      if (cachedQ.type === 'scenario') { setScenarioQuiz(cachedQ.data); }
      else { setQuiz(cachedQ.data.questions); setJargonGuide(cachedQ.data.jargonGuide || null); }
      setStage('quiz');
      return;
    }
    loadExplanation(0);
  }, [topic, profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load explanation ────────────────────────────────────────────────────────
  async function loadExplanation(variation = 0, isRegen = false) {
    try {
      if (!isRegen) {
        const cached = getExplCache(topic, variation);
        if (cached) { setExplanation(cached); setStage('explanation'); return; }
        setStage('loading');
      } else {
        setIsRegenerating(true);
      }
      setError(null);
      const res = await getExplanation(topic, domain, profile?.difficulty || 'beginner', variation);
      if (res.success) {
        setExplanation(res.explanation);
        setExplCache(topic, variation, res.explanation);
        if (!isRegen) setStage('explanation');
        const explXpKey = `finlit_expl_xp_${topic?.replace(/\s+/g,'_')}`;
        if (!isRegen && !localStorage.getItem(explXpKey)) {
          setTimeout(() => {
            awardXP.readExplanation();
            try { localStorage.setItem(explXpKey, '1'); } catch {}
          }, 1000);
        }
      } else {
        setError('Failed to load explanation. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      if (isRegen) setIsRegenerating(false);
    }
  }

  const handleRegenerate = () => {
    const next = (variationIndex + 1) % 3;
    setVariationIndex(next);
    loadExplanation(next, true);
  };

  // ── Comprehension ────────────────────────────────────────────────────────────
  const handleComprehension = useCallback((key, resp) => {
    setComprehension(prev => ({ ...prev, [key]: resp }));
  }, []);

  const handleRequestAdaptive = useCallback(async (key, confType) => {
    setAdaptiveLoading(prev => ({ ...prev, [key]: true }));
    try {
      const prev = explanation?.sections?.[key] || '';
      const res  = await getAdaptiveExplanation({ topic, domain, confusionPoint: confType, previousExplanation: prev });
      setAdaptiveContent(p => ({ ...p, [key]: res.reExplanation || '' }));
    } catch {}
    finally { setAdaptiveLoading(p => ({ ...p, [key]: false })); }
  }, [topic, explanation]);

  // ── Start quiz ───────────────────────────────────────────────────────────────
  async function startQuiz() {
    const cached = getQuizCache(topic);
    if (cached) {
      if (cached.type === 'scenario') { setScenarioQuiz(cached.data); }
      else { setQuiz(cached.data.questions); setJargonGuide(cached.data.jargonGuide || null); }
      setStage('quiz');
      return;
    }
    setStage('loading');

    // Try scenario quiz first
    try {
      const sRes = await generateScenarioQuiz(topic, domain, profile?.difficulty || 'beginner', 0);
      if (sRes.success && sRes.questions?.length === 5) {
        const sq = { questions: sRes.questions, scenarioTitle: sRes.scenarioTitle, scenarioContext: sRes.scenarioContext };
        setScenarioQuiz(sq);
        setQuizCache(topic, { type: 'scenario', data: sq });
        setStage('quiz');
        return;
      }
    } catch {}

    // Try standard AI quiz
    try {
      const qRes = await getQuiz(topic, domain, profile?.difficulty || 'beginner');
      if (qRes.success && qRes.questions?.length > 0) {
        setQuiz(qRes.questions);
        setJargonGuide(qRes.jargonGuide || null);
        setQuizCache(topic, { type: 'neo', data: { questions: qRes.questions, jargonGuide: qRes.jargonGuide || null } });
        setStage('quiz');
        return;
      }
    } catch {}

    // Fallback to static questions
    const fallback = getRandomQuestions(topic, 4);
    if (fallback.length > 0) {
      setQuiz(fallback);
      setQuizCache(topic, { type: 'neo', data: { questions: fallback, jargonGuide: null } });
      setStage('quiz');
    } else {
      setError('Failed to load quiz. Please try again.');
      setStage('explanation');
    }
  }

  // ── Quiz complete ────────────────────────────────────────────────────────────
  function handleQuizComplete(score, totalQuestions) {
    sessionStorage.removeItem(quizKey(topic));
    sessionStorage.removeItem(`finlit_quiz_prog_${topic?.replace(/\s+/g,'_')}`);
    sessionStorage.removeItem(`finlit_scenario_prog_${topic?.replace(/\s+/g,'_')}`);
    setQuizResult({ score, totalQuestions, xp: Math.round((score / totalQuestions) * 100) });
    const pct = Math.round((score / totalQuestions) * 100);
    if (pct >= 70)      toast.celebration(`Topic complete! ${pct}%`);
    else if (pct >= 60) toast.success(`Passed — ${pct}%. Hit 70% to master it.`);
    else                toast.warning(`You scored ${pct}% — review and try again.`);
    if (score / totalQuestions < 0.6) {
      setStage('diagnosis');
    } else {
      const alreadyDone = completedTopics.includes(topic);
      if (!alreadyDone) {
        awardXP.completeQuiz(score, totalQuestions);
        addTopicProgress({ topic, score, totalQuestions, difficulty: profile?.difficulty || 'beginner' });
        checkBadgeUnlock('FIRST_LESSON');
        const newCount = completedTopics.length + 1;
        if (newCount >= 10) checkBadgeUnlock('TOPIC_MASTER', newCount);
      }
      clear(topic);
      setStage('complete');
      setShowReflection(true);
    }
  }

  function handleDiagnosisContinue() { clear(topic); setStage('complete'); setShowReflection(true); }

  if (!topic)   return null;
  if (!profile) return null;

  const backPath  = '/music/setlist';
  const backLabel = 'THE SETLIST';
  const perf      = quizResult ? rating(quizResult.score / quizResult.totalQuestions) : null;

  // ── Heading font size helper (Orbitron is wider) ─────────────────────────────
  const hSize = (base) => theme.fontHeading.includes('Orbitron') ? Math.round(base * 0.78) : base;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <MusicLearningBg color={C} />
      <XPPopup popups={xpPopups} gamingMode gamingColors={gc} badge={badgeNotification} />

      <div style={{ position: 'relative', zIndex: 1, padding: '20px 20px 56px', maxWidth: 760, margin: '0 auto' }}>

        {/* ── Sticky header ── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: theme.bgDark,
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
          marginBottom: 20, paddingTop: 12, paddingBottom: 12,
        }}>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14 }}
          >
            <motion.button
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
              onClick={() => navigate(backPath)}
              style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: `${C}15`, border: `1px solid ${C}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={17} color={C} />
            </motion.button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <Label color={C} theme={theme}>Study Session · {backLabel}</Label>
              <div style={{
                fontFamily: theme.fontHeading,
                fontSize: `clamp(${hSize(18)}px, 4vw, ${hSize(26)}px)`,
                letterSpacing: theme.fontHeading.includes('Cormorant') ? '1px' : '2px',
                fontStyle: theme.fontHeading.includes('Cormorant') ? 'italic' : 'normal',
                color: '#fff',
                textShadow: `0 0 18px ${G}`,
                lineHeight: 1.1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {topic}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ fontFamily: theme.fontSub, fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.textMuted }}>
                  LV {level}
                </span>
                <span style={{
                  padding: '2px 8px', borderRadius: 6,
                  background: `${C}18`, border: `1px solid ${C}40`,
                  fontFamily: theme.fontSub, fontWeight: 700, fontSize: 10, letterSpacing: '1px', color: C,
                }}>
                  {xp} XP
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            padding: '11px 14px', borderRadius: 9, marginBottom: 14,
            background: 'rgba(248,113,113,0.09)', border: '1px solid rgba(248,113,113,0.32)',
            fontFamily: theme.fontBody, fontSize: 13, color: '#f87171',
          }}>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── LOADING ── */}
          {stage === 'loading' && (
            <motion.div key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${C}25`, borderTopColor: C }}
              />
              <span style={{
                fontFamily: theme.fontSub, fontWeight: 700,
                fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: theme.textMuted,
              }}>
                {quiz ? 'Setting up your quiz...' : 'Tuning your session...'}
              </span>
            </motion.div>
          )}

          {/* ── LOCKED ── */}
          {stage === 'locked' && (
            <motion.div key="locked"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '48px 0' }}
            >
              <div style={{
                background: theme.bgCard, border: theme.borderFaint,
                borderRadius: 14, padding: '40px 32px', maxWidth: 400, margin: '0 auto',
              }}>
                <Lock size={40} color="rgba(255,255,255,0.2)" style={{ marginBottom: 16 }} />
                <div style={{ fontFamily: theme.fontHeading, fontSize: hSize(24), letterSpacing: '2px', color: '#fff', marginBottom: 8 }}>
                  TOPIC LOCKED
                </div>
                <div style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textMuted, lineHeight: 1.6, marginBottom: 24 }}>
                  Complete the previous topic first to unlock this one.
                </div>
                <motion.button
                  whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(backPath)}
                  style={{
                    padding: '12px 28px', borderRadius: 8, background: C, border: 'none',
                    fontFamily: theme.fontHeading, fontSize: hSize(16), letterSpacing: '1.5px',
                    color: '#000', cursor: 'pointer',
                  }}
                >
                  BACK TO SETLIST
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── EXPLANATION ── */}
          {stage === 'explanation' && explanation && (
            <motion.div key="explanation"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              <ExplanationDisplay
                explanation={explanation} topic={topic} interest={domain}
                onRegenerate={handleRegenerate} isRegenerating={isRegenerating}
                pacing="standard" comprehensionState={comprehension}
                onComprehension={handleComprehension}
                adaptiveContent={adaptiveContent} adaptiveLoading={adaptiveLoading}
                onRequestAdaptive={handleRequestAdaptive}
                gamingMode gamingColors={gc}
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
                <motion.button
                  whileHover={{ filter: 'brightness(1.12)', y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startQuiz}
                  style={{
                    padding: '15px 44px', borderRadius: 10, background: C, border: 'none',
                    fontFamily: theme.fontHeading,
                    fontSize: hSize(20), letterSpacing: '2px',
                    color: '#000', cursor: 'pointer',
                    boxShadow: `0 4px 24px ${G}`,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  TAKE THE QUIZ <ChevronRight size={18} strokeWidth={2.5} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── QUIZ ── */}
          {stage === 'quiz' && (scenarioQuiz || quiz) && (
            <motion.div key="quiz"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              {scenarioQuiz ? (
                <ScenarioQuizEnvironment
                  questions={scenarioQuiz.questions}
                  scenarioTitle={scenarioQuiz.scenarioTitle}
                  scenarioContext={scenarioQuiz.scenarioContext}
                  topic={topic} onComplete={handleQuizComplete}
                  gamingMode gamingColors={gc}
                />
              ) : (
                <NeoQuizEnvironment
                  questions={quiz} topic={topic}
                  onComplete={handleQuizComplete}
                  gamingMode gamingColors={gc}
                />
              )}
            </motion.div>
          )}

          {/* ── DIAGNOSIS ── */}
          {stage === 'diagnosis' && quizResult && (
            <motion.div key="diagnosis"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <QuizDiagnosis
                score={quizResult.score} totalQuestions={quizResult.totalQuestions}
                topic={topic}
                onReteach={() => { setStage('explanation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onContinue={handleDiagnosisContinue}
                gamingMode gamingColors={gc}
              />
            </motion.div>
          )}

          {/* ── COMPLETE ── */}
          {stage === 'complete' && (
            <motion.div key="complete"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', paddingTop: 32 }}
            >
              {/* Trophy pulse */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 6, -6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 100, height: 100, borderRadius: '50%',
                  margin: '0 auto 20px',
                  background: C, boxShadow: `0 0 48px ${G}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Trophy size={48} color="#000" strokeWidth={1.5} />
              </motion.div>

              <div style={{
                background: theme.bgCard,
                border: `1.5px solid ${C}50`,
                borderRadius: 16, padding: '32px 28px',
                maxWidth: 480, margin: '0 auto 24px',
                boxShadow: `0 0 40px ${C}12`,
              }}>
                <Label color={C} theme={theme}>Track Complete</Label>
                <div style={{
                  fontFamily: theme.fontHeading,
                  fontSize: hSize(36), letterSpacing: '3px',
                  fontStyle: theme.fontHeading.includes('Cormorant') ? 'italic' : 'normal',
                  color: '#fff',
                  textShadow: `0 0 24px ${G}`, marginBottom: 6,
                }}>
                  {completeHeading(cluster, theme)}
                </div>

                {quizResult && perf && (
                  <>
                    <div style={{
                      fontFamily: theme.fontHeading,
                      fontSize: hSize(20), letterSpacing: '1.5px',
                      color: perf.color, marginBottom: 16,
                    }}>
                      {perf.label}
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                      <div style={{
                        flex: 1, padding: '12px 8px', borderRadius: 10, textAlign: 'center',
                        background: `${C}10`, border: `1px solid ${C}25`,
                      }}>
                        <div style={{ fontFamily: theme.fontHeading, fontSize: hSize(26), letterSpacing: '1px', color: C }}>
                          {quizResult.score}/{quizResult.totalQuestions}
                        </div>
                        <Label theme={theme}>Score</Label>
                      </div>
                      <div style={{
                        flex: 1, padding: '12px 8px', borderRadius: 10, textAlign: 'center',
                        background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.22)',
                      }}>
                        <div style={{ fontFamily: theme.fontHeading, fontSize: hSize(26), letterSpacing: '1px', color: '#4ade80' }}>
                          +{quizResult.xp}
                        </div>
                        <Label theme={theme}>XP Earned</Label>
                      </div>
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
                  {nextTopic && (
                    <motion.button
                      whileHover={{ filter: 'brightness(1.12)', y: -2 }} whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/music/learn', { state: { topic: nextTopic, topicId: nextTopicId } })}
                      style={{
                        width: '100%', padding: '16px', borderRadius: 9, background: C, border: 'none',
                        fontFamily: theme.fontHeading,
                        fontSize: hSize(20), letterSpacing: '2px',
                        color: '#000', cursor: 'pointer',
                        boxShadow: `0 6px 28px ${G}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      NEXT: {nextTopic.toUpperCase()} <ChevronRight size={18} />
                    </motion.button>
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <motion.button
                      whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(backPath)}
                      style={{
                        flex: 2, padding: '14px', borderRadius: 9,
                        background: nextTopic ? 'rgba(255,255,255,0.06)' : C,
                        border: nextTopic ? `1px solid rgba(255,255,255,0.14)` : 'none',
                        fontFamily: theme.fontHeading,
                        fontSize: hSize(16), letterSpacing: '2px',
                        color: nextTopic ? theme.textMuted : '#000', cursor: 'pointer',
                        boxShadow: nextTopic ? 'none' : `0 4px 20px ${G}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      THE SETLIST <ChevronRight size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setStage('explanation'); setQuizResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      style={{
                        flex: 1, padding: '14px', borderRadius: 9,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        fontFamily: theme.fontSub, fontWeight: 700,
                        fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: theme.textMuted, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      <RotateCcw size={13} /> Review
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.98 }}
                    onClick={() => setShowHistory(true)}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 9,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
                      fontFamily: theme.fontSub, fontWeight: 700,
                      fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: theme.textMuted, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    }}
                  >
                    <BarChart2 size={13} /> View Past Attempts
                  </motion.button>
                </div>
              </div>

              {showReflection && (
                <PostQuizReflection onDone={() => setShowReflection(false)} gamingMode gamingColors={gc} />
              )}
              {jargonGuide && <JargonFlashcard jargonGuide={jargonGuide} />}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <QuizHistoryModal
        open={showHistory}
        onClose={() => setShowHistory(false)}
        topicNames={MUSIC_TOPICS.map(t => t.name)}
        accent={C}
        theme={{
          surface: theme.bgCard, border: 'rgba(255,255,255,0.10)',
          textPrimary: '#fff', textMuted: theme.textMuted,
          radius: 16, fontHeading: theme.fontHeading, fontBody: theme.fontBody,
        }}
        onRetry={(tp) => {
          setShowHistory(false);
          navigate('/music/learn', { state: { topic: tp, topicId: MUSIC_TOPICS.find(x => x.name === tp)?.id || null } });
        }}
      />

      <FloatingMentor
        currentTopic={topic} userInterest={domain}
        isVisible={stage === 'explanation' || stage === 'quiz'}
        gamingMode gamingColors={gc}
      />
    </div>
  );
}
