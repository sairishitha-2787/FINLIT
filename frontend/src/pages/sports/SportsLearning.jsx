import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Trophy, RotateCcw, ChevronRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';
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
import { isTopicUnlocked } from '../../services/chapterService';
import { sportsTheme } from '../../styles/sportsTheme';

// ── Cache helpers ─────────────────────────────────────────────────────────────
const storageKey  = (t) => `finlit_progress_${t?.replace(/\s+/g, '_')}`;
const explKey     = (t, v) => `finlit_expl_${t?.replace(/\s+/g, '_')}_v${v}`;
const quizKey     = (t) => `finlit_quiz_${t?.replace(/\s+/g, '_')}`;

const save  = (t, d) => { try { localStorage.setItem(storageKey(t), JSON.stringify(d)); } catch {} };
const load  = (t)    => { try { const r = localStorage.getItem(storageKey(t)); return r ? JSON.parse(r) : null; } catch { return null; } };
const clear = (t)    => { try { localStorage.removeItem(storageKey(t)); [0,1,2].forEach(v => sessionStorage.removeItem(explKey(t,v))); sessionStorage.removeItem(quizKey(t)); } catch {} };

const getExplCache  = (t, v) => { try { const r = sessionStorage.getItem(explKey(t,v));  return r ? JSON.parse(r) : null; } catch { return null; } };
const setExplCache  = (t, v, d) => { try { sessionStorage.setItem(explKey(t,v), JSON.stringify(d)); } catch {} };
const getQuizCache  = (t) => { try { const r = sessionStorage.getItem(quizKey(t));  return r ? JSON.parse(r) : null; } catch { return null; } };
const setQuizCache  = (t, d) => { try { sessionStorage.setItem(quizKey(t), JSON.stringify(d)); } catch {} };

// ── Background: broadcast grid ────────────────────────────────────────────────
function BroadcastBg({ color }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, backgroundColor: sportsTheme.bgDark,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${color}10 0%, transparent 65%)`,
      }} />
    </div>
  );
}

// ── Label chip ────────────────────────────────────────────────────────────────
function Label({ children, color }) {
  return (
    <div style={{
      fontFamily: sportsTheme.fontSub, fontWeight: 700,
      fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
      color: color || sportsTheme.textMuted,
      marginBottom: 6,
    }}>
      {children}
    </div>
  );
}

// ── Performance rating ────────────────────────────────────────────────────────
function rating(pct) {
  if (pct === 1)         return { label: 'PERFECT MATCH',       color: '#fbbf24' };
  if (pct >= 0.8)        return { label: 'STRONG PERFORMANCE',  color: '#4ade80' };
  if (pct >= 0.6)        return { label: 'SOLID EFFORT',        color: '#60a5fa' };
  return                        { label: 'NEEDS MORE TRAINING', color: '#f87171' };
}

// ── XP count-up hook ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const steps = 30;
    const inc = target / steps;
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

// ── Main component ────────────────────────────────────────────────────────────
export default function SportsLearning() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { profile, completedTopics, addTopicProgress } = useUser();
  const { xpPopups, awardXP, checkBadgeUnlock, badgeNotification } = useGamification();
  const outletCtx = useOutletContext();

  const C    = outletCtx?.sportsColor  || '#E8457A';
  const G    = outletCtx?.sportsGlow   || 'rgba(232,69,122,0.5)';
  // Map sports colors into the shape that gamingMode quiz components expect
  const gc   = { primary: C, secondary: C, glow: G, sports: true };

  const topic  = location.state?.topic;
  const topicId = location.state?.topicId;
  const domain = 'sports';

  const [stage,            setStage]            = useState('loading');
  const [explanation,      setExplanation]      = useState(null);
  const [quiz,             setQuiz]             = useState(null);
  const [scenarioQuiz,     setScenarioQuiz]     = useState(null);
  const [jargonGuide,      setJargonGuide]      = useState(null);
  const [error,            setError]            = useState(null);
  const [variationIndex,   setVariationIndex]   = useState(0);
  const [isRegenerating,   setIsRegenerating]   = useState(false);
  const [quizResult,       setQuizResult]       = useState(null);
  const [showReflection,   setShowReflection]   = useState(false);
  const [comprehension,    setComprehension]    = useState({});
  const [adaptiveContent,  setAdaptiveContent]  = useState({});
  const [adaptiveLoading,  setAdaptiveLoading]  = useState({});

  const xpDisplayed = useCountUp(quizResult ? Math.round((quizResult.score / quizResult.totalQuestions) * 100) : 0);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!topic) { navigate('/sports/playbook'); return; }
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

  // ── Explanation ──────────────────────────────────────────────────────────
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
        setTimeout(() => awardXP.readExplanation(), 1000);
      } else {
        setError('Failed to load explanation. Please try again.');
      }
    } catch (err) {
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

  // ── Comprehension ─────────────────────────────────────────────────────────
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

  // ── Quiz ──────────────────────────────────────────────────────────────────
  async function startQuiz() {
    const cached = getQuizCache(topic);
    if (cached) {
      if (cached.type === 'scenario') { setScenarioQuiz(cached.data); }
      else { setQuiz(cached.data.questions); setJargonGuide(cached.data.jargonGuide || null); }
      setStage('quiz');
      return;
    }
    setStage('loading');
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
    try {
      const qRes = await getQuiz(topic, domain, profile?.difficulty || 'beginner');
      if (qRes.success && qRes.questions?.length > 0) {
        setQuiz(qRes.questions);
        setJargonGuide(qRes.jargonGuide || null);
        setQuizCache(topic, { type: 'neo', data: { questions: qRes.questions, jargonGuide: qRes.jargonGuide || null } });
        setStage('quiz');
      } else {
        setError('Failed to load quiz'); setStage('explanation');
      }
    } catch {
      setError('Failed to load quiz'); setStage('explanation');
    }
  }

  function handleQuizComplete(score, totalQuestions) {
    sessionStorage.removeItem(quizKey(topic));
    sessionStorage.removeItem(`finlit_quiz_prog_${topic?.replace(/\s+/g,'_')}`);
    sessionStorage.removeItem(`finlit_scenario_prog_${topic?.replace(/\s+/g,'_')}`);
    setQuizResult({ score, totalQuestions, xp: Math.round((score / totalQuestions) * 100) });
    if (score / totalQuestions < 0.6) {
      setStage('diagnosis');
    } else {
      awardXP.completeQuiz(score, totalQuestions);
      addTopicProgress({ topic, score, totalQuestions, difficulty: profile?.difficulty || 'beginner' });
      checkBadgeUnlock('FIRST_LESSON');
      const newCount = completedTopics.includes(topic) ? completedTopics.length : completedTopics.length + 1;
      if (newCount >= 10) checkBadgeUnlock('TOPIC_MASTER', newCount);
      clear(topic);
      setStage('complete');
      setShowReflection(true);
    }
  }

  function handleDiagnosisContinue() { clear(topic); setStage('complete'); setShowReflection(true); }

  if (!topic) return null;
  if (!profile) return null;

  const backLabel   = 'THE PLAYBOOK';
  const backPath    = '/sports/playbook';
  const quizResult_ = quizResult;
  const perf        = quizResult_ ? rating(quizResult_.score / quizResult_.totalQuestions) : null;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <BroadcastBg color={C} />
      <XPPopup popups={xpPopups} gamingMode gamingColors={gc} badge={badgeNotification} />

      <div style={{ position: 'relative', zIndex: 1, padding: '20px 20px 56px', maxWidth: 760, margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}
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

          <div style={{ flex: 1 }}>
            <Label color={C}>Training Session · {backLabel}</Label>
            <div style={{
              fontFamily: sportsTheme.fontHeading,
              fontSize: 'clamp(22px,4vw,30px)',
              letterSpacing: '2px', color: '#fff',
              textShadow: `0 0 18px ${G}`,
              lineHeight: 1.05,
            }}>
              {topic?.toUpperCase()}
            </div>
          </div>
        </motion.div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            padding: '11px 14px', borderRadius: 9, marginBottom: 14,
            background: 'rgba(248,113,113,0.09)', border: '1px solid rgba(248,113,113,0.32)',
            fontFamily: sportsTheme.fontBody, fontSize: 13, color: '#f87171',
          }}>{error}</div>
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
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: `3px solid ${C}25`,
                  borderTopColor: C,
                }}
              />
              <span style={{
                fontFamily: sportsTheme.fontSub, fontWeight: 700,
                fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: sportsTheme.textMuted,
              }}>
                {quiz ? 'Setting up the match...' : 'Preparing your training session...'}
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
                background: 'rgba(22,22,22,0.96)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '40px 32px', maxWidth: 400, margin: '0 auto',
              }}>
                <Lock size={40} color="rgba(255,255,255,0.2)" style={{ marginBottom: 16 }} />
                <div style={{ fontFamily: sportsTheme.fontHeading, fontSize: 24, letterSpacing: '2px', color: '#fff', marginBottom: 8 }}>
                  DRILL LOCKED
                </div>
                <div style={{ fontFamily: sportsTheme.fontBody, fontSize: 13, color: sportsTheme.textMuted, lineHeight: 1.6, marginBottom: 24 }}>
                  Complete the previous training sessions to unlock this drill.
                </div>
                <motion.button
                  whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(backPath)}
                  style={{
                    padding: '12px 28px', borderRadius: 8, background: C, border: 'none',
                    fontFamily: sportsTheme.fontHeading, fontSize: 16, letterSpacing: '1.5px',
                    color: '#000', cursor: 'pointer',
                  }}
                >
                  BACK TO PLAYBOOK
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
                    fontFamily: sportsTheme.fontHeading, fontSize: 20, letterSpacing: '2px',
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
          {stage === 'diagnosis' && quizResult_ && (
            <motion.div key="diagnosis"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <QuizDiagnosis
                score={quizResult_.score} totalQuestions={quizResult_.totalQuestions}
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
              {/* Trophy */}
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
                background: 'rgba(20,20,20,0.97)',
                border: `1.5px solid ${C}50`,
                borderRadius: 16, padding: '32px 28px',
                maxWidth: 480, margin: '0 auto 24px',
                boxShadow: `0 0 40px ${C}12`,
              }}>
                <Label color={C}>Drill Complete</Label>
                <div style={{
                  fontFamily: sportsTheme.fontHeading,
                  fontSize: 38, letterSpacing: '3px', color: '#fff',
                  textShadow: `0 0 24px ${G}`, marginBottom: 6,
                }}>
                  FULL TIME!
                </div>

                {quizResult_ && perf && (
                  <>
                    <div style={{
                      fontFamily: sportsTheme.fontHeading,
                      fontSize: 20, letterSpacing: '1.5px',
                      color: perf.color, marginBottom: 16,
                    }}>
                      {perf.label}
                    </div>

                    {/* Score row */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                      <div style={{
                        flex: 1, padding: '12px 8px', borderRadius: 10, textAlign: 'center',
                        background: `${C}10`, border: `1px solid ${C}25`,
                      }}>
                        <div style={{ fontFamily: sportsTheme.fontHeading, fontSize: 26, letterSpacing: '1px', color: C }}>
                          {quizResult_.score}/{quizResult_.totalQuestions}
                        </div>
                        <Label>Score</Label>
                      </div>
                      <div style={{
                        flex: 1, padding: '12px 8px', borderRadius: 10, textAlign: 'center',
                        background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.22)',
                      }}>
                        <div style={{ fontFamily: sportsTheme.fontHeading, fontSize: 26, letterSpacing: '1px', color: '#4ade80' }}>
                          +{quizResult_.xp}
                        </div>
                        <Label>XP Earned</Label>
                      </div>
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: 10 }}>
                  <motion.button
                    whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(backPath)}
                    style={{
                      flex: 2, padding: '14px', borderRadius: 9, background: C, border: 'none',
                      fontFamily: sportsTheme.fontHeading, fontSize: 18, letterSpacing: '2px',
                      color: '#000', cursor: 'pointer',
                      boxShadow: `0 4px 20px ${G}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    RETURN TO PLAYBOOK <ChevronRight size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setStage('explanation'); setQuizResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{
                      flex: 1, padding: '14px', borderRadius: 9,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      fontFamily: sportsTheme.fontSub, fontWeight: 700,
                      fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: sportsTheme.textMuted, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <RotateCcw size={13} /> Review
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

      <FloatingMentor
        currentTopic={topic} userInterest={domain}
        isVisible={stage === 'explanation' || stage === 'quiz'}
        gamingMode gamingColors={gc}
      />
    </div>
  );
}
