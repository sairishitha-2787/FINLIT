// FINLIT Learning Page
// Adaptive learning loop: pacing selector → explanation + comprehension checks → quiz → reflection → complete
// Gaming mode: auto-skips pacing, uses gaming theme styling when inside /gaming/* routes.

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles, ArrowLeft, ArrowRight, Lock, BookOpen, Zap } from 'lucide-react';
import AnimatedIcon from '../components/shared/AnimatedIcon';
import { useUser } from '../context/UserContext';
import { getExplanation, getQuiz, generateScenarioQuiz, getAdaptiveExplanation } from '../services/api';
import ExplanationDisplay from '../components/learning/ExplanationDisplay';
import PacingSelector from '../components/learning/PacingSelector';
import QuizDiagnosis from '../components/learning/QuizDiagnosis';
import PostQuizReflection from '../components/learning/PostQuizReflection';
import NeoQuizEnvironment from '../components/quiz/NeoQuizEnvironment';
import ScenarioQuizEnvironment from '../components/quiz/ScenarioQuizEnvironment';
import JargonFlashcard from '../components/learning/JargonFlashcard';
import ChapterCompletionModal from '../components/shared/ChapterCompletionModal';
import CollectibleUnlock from '../components/gamification/CollectibleUnlock';
import XPPopup from '../components/shared/XPPopup';
import FloatingMentor from '../components/mentor/FloatingMentor';
import LoadingAnimation from '../components/shared/LoadingAnimation';
import { useGamification } from '../hooks/useGamification';
import { useCelebration } from '../hooks/useCelebration';
import {
  isTopicUnlocked,
  checkChapterCompletion,
  getTopicChapterInfo,
  getChapterProgress,
} from '../services/chapterService';
import { getCollectible } from '../config/collectibles';
import { gamingTheme } from '../styles/gamingTheme';

// ── Save/restore helpers ──────────────────────────────────────────────────────

const getStorageKey = (topic) => `finlit_progress_${topic?.replace(/\s+/g, '_')}`;
const getExplanationCacheKey = (topic, variation) => `finlit_expl_${topic?.replace(/\s+/g, '_')}_v${variation}`;
const getQuizCacheKey = (topic) => `finlit_quiz_${topic?.replace(/\s+/g, '_')}`;

const saveProgress = (topic, data) => {
  try { localStorage.setItem(getStorageKey(topic), JSON.stringify(data)); } catch (_) {}
};

const loadProgress = (topic) => {
  try {
    const raw = localStorage.getItem(getStorageKey(topic));
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
};

const clearProgress = (topic) => {
  try {
    localStorage.removeItem(getStorageKey(topic));
    // Clear explanation and quiz caches when topic is fully done
    for (let v = 0; v < 3; v++) {
      sessionStorage.removeItem(getExplanationCacheKey(topic, v));
    }
    sessionStorage.removeItem(getQuizCacheKey(topic));
  } catch (_) {}
};

const getCachedExplanation = (topic, variation) => {
  try {
    const raw = sessionStorage.getItem(getExplanationCacheKey(topic, variation));
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
};

const setCachedExplanation = (topic, variation, data) => {
  try { sessionStorage.setItem(getExplanationCacheKey(topic, variation), JSON.stringify(data)); } catch (_) {}
};

const getCachedQuiz = (topic) => {
  try {
    const raw = sessionStorage.getItem(getQuizCacheKey(topic));
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
};

const setCachedQuiz = (topic, data) => {
  try { sessionStorage.setItem(getQuizCacheKey(topic), JSON.stringify(data)); } catch (_) {}
};

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

const Learning = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { profile, completedTopics, addTopicProgress } = useUser();
  const { xp, level, xpPopups, awardXP, checkBadgeUnlock, badgeNotification } = useGamification();
  const outletCtx  = useOutletContext();

  const isGamingMode  = !!(outletCtx?.colors);
  const gamingColors  = outletCtx?.colors;

  const topic     = location.state?.topic;
  const nextTopic = location.state?.nextTopic || null;
  const domain    = profile?.primaryInterest || 'general';

  // stage: loading | locked | pacing | explanation | quiz | diagnosis | complete
  const [stage, setStage]                   = useState('loading');
  const [explanation, setExplanation]       = useState(null);
  const [quiz, setQuiz]                     = useState(null);
  const [scenarioQuiz, setScenarioQuiz]     = useState(null);
  const [jargonGuide, setJargonGuide]       = useState(null);
  const [error, setError]                   = useState(null);
  const [variationIndex, setVariationIndex] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [unlockCollectible, setUnlockCollectible] = useState(null);
  const [completedChapter, setCompletedChapter]   = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const [pacing, setPacing]               = useState('standard');
  const [comprehensionState, setComprehensionState] = useState({});
  const [adaptiveContent, setAdaptiveContent]       = useState({});
  const [adaptiveLoading, setAdaptiveLoading]       = useState({});

  const [quizResult, setQuizResult]   = useState(null);
  const [showReflection, setShowReflection] = useState(false);

  const { celebrate } = useCelebration('gaming', gamingColors?.primary);

  // ── Init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!topic) {
      navigate(isGamingMode ? '/gaming/map' : '/dashboard');
      return;
    }
    if (!profile) return; // Wait for profile to load before doing anything
    if (!isTopicUnlocked(completedTopics, domain, topic)) { setStage('locked'); return; }

    const saved = loadProgress(topic);
    if (saved?.pacing) setPacing(saved.pacing);
    if (saved?.comprehensionState) setComprehensionState(saved.comprehensionState);

    if (isGamingMode) {
      // Restore quiz state if user navigated away mid-quiz
      const cachedQuiz = getCachedQuiz(topic);
      if (cachedQuiz) {
        if (cachedQuiz.type === 'scenario') {
          setScenarioQuiz(cachedQuiz.data);
        } else {
          setQuiz(cachedQuiz.data.questions);
          setJargonGuide(cachedQuiz.data.jargonGuide || null);
        }
        setStage('quiz');
        return;
      }
      // Auto-start in gaming mode — skip pacing selector
      loadExplanation(0);
    } else if (saved?.stage === 'explanation') {
      loadExplanation(0);
    } else {
      setStage('pacing');
    }
  }, [topic, profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (topic && stage !== 'loading' && stage !== 'locked') {
      saveProgress(topic, { pacing, comprehensionState, stage });
    }
  }, [pacing, comprehensionState, stage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Explanation loading ───────────────────────────────────────────────────

  const loadExplanation = async (variation = 0, isRegen = false) => {
    if (!profile) return;
    try {
      // Serve from sessionStorage cache on remount — avoids redundant API calls
      if (!isRegen) {
        const cached = getCachedExplanation(topic, variation);
        if (cached) {
          setExplanation(cached);
          setStage('explanation');
          return;
        }
        setStage('loading');
      } else {
        setIsRegenerating(true);
      }
      setError(null);
      const response = await getExplanation(topic, profile.primaryInterest, profile.difficulty, variation);
      if (response.success) {
        setExplanation(response.explanation);
        setCachedExplanation(topic, variation, response.explanation);
        if (!isRegen) setStage('explanation');
        const explXpKey = `finlit_expl_xp_${topic?.replace(/\s+/g,'_')}`;
        if (!isRegen && !localStorage.getItem(explXpKey)) {
          setTimeout(() => { awardXP.readExplanation(); try { localStorage.setItem(explXpKey,'1'); } catch {} }, 1000);
        }
      } else {
        setError('Failed to load explanation');
      }
    } catch (err) {
      console.error('Error loading explanation:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      if (isRegen) setIsRegenerating(false);
    }
  };

  const handlePacingConfirm = (selected) => {
    setPacing(selected);
    loadExplanation(0);
  };

  const handleRegenerate = () => {
    const next = (variationIndex + 1) % 3;
    setVariationIndex(next);
    loadExplanation(next, true);
  };

  // ── Comprehension + adaptive ──────────────────────────────────────────────

  const handleComprehension = useCallback((sectionKey, response) => {
    setComprehensionState((prev) => ({ ...prev, [sectionKey]: response }));
  }, []);

  const handleRequestAdaptive = useCallback(async (sectionKey, confusionType) => {
    setAdaptiveLoading((prev) => ({ ...prev, [sectionKey]: true }));
    try {
      const previousText = explanation?.sections?.[sectionKey] || '';
      const res = await getAdaptiveExplanation({ topic, domain, confusionPoint: confusionType, previousExplanation: previousText });
      setAdaptiveContent((prev) => ({ ...prev, [sectionKey]: res.reExplanation || '' }));
    } catch (err) {
      console.error('Adaptive explain error:', err);
    } finally {
      setAdaptiveLoading((prev) => ({ ...prev, [sectionKey]: false }));
    }
  }, [topic, domain, explanation]);

  // ── Quiz flow ─────────────────────────────────────────────────────────────

  const handleStartQuiz = async () => {
    try {
      // Restore quiz from session cache if user navigated away mid-quiz
      const cachedQuiz = getCachedQuiz(topic);
      if (cachedQuiz) {
        if (cachedQuiz.type === 'scenario') {
          setScenarioQuiz(cachedQuiz.data);
        } else {
          setQuiz(cachedQuiz.data.questions);
          setJargonGuide(cachedQuiz.data.jargonGuide || null);
        }
        setStage('quiz');
        return;
      }

      setStage('loading');
      try {
        const scenarioRes = await generateScenarioQuiz(topic, profile.primaryInterest, profile.difficulty, 0);
        if (scenarioRes.success && scenarioRes.questions?.length === 5) {
          const sq = { questions: scenarioRes.questions, scenarioTitle: scenarioRes.scenarioTitle, scenarioContext: scenarioRes.scenarioContext };
          setScenarioQuiz(sq);
          setCachedQuiz(topic, { type: 'scenario', data: sq });
          setStage('quiz');
          return;
        }
      } catch (scenarioErr) {
        console.warn('Scenario quiz unavailable, falling back:', scenarioErr.message);
      }
      const response = await getQuiz(topic, profile.primaryInterest, profile.difficulty);
      if (response.success && response.questions.length > 0) {
        setQuiz(response.questions);
        setJargonGuide(response.jargonGuide || null);
        setCachedQuiz(topic, { type: 'neo', data: { questions: response.questions, jargonGuide: response.jargonGuide || null } });
        setStage('quiz');
      } else {
        setError('Failed to load quiz');
        setStage('explanation');
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError('Failed to load quiz');
      setStage('explanation');
    }
  };

  const handleQuizComplete = (score, totalQuestions) => {
    // Drop all quiz caches so a retry gets fresh questions and starts from Q1
    sessionStorage.removeItem(getQuizCacheKey(topic));
    sessionStorage.removeItem(`finlit_quiz_prog_${topic?.replace(/\s+/g, '_')}`);
    sessionStorage.removeItem(`finlit_scenario_prog_${topic?.replace(/\s+/g, '_')}`);
    setQuizResult({ score, totalQuestions });
    if (score / totalQuestions < 0.6) {
      setStage('diagnosis');
    } else {
      const alreadyDone = completedTopics.includes(topic);
      if (!alreadyDone) {
        awardXP.completeQuiz(score, totalQuestions);
        addTopicProgress({ topic, score, totalQuestions, difficulty: profile?.difficulty || 'beginner' });
        const newCount = completedTopics.length + 1;
        if (newCount >= 10) checkBadgeUnlock('TOPIC_MASTER', newCount);
      }
      proceedToComplete();
    }
  };

  const proceedToComplete = () => {
    checkBadgeUnlock('FIRST_LESSON');
    setTimeout(celebrate, 300);

    const collectible = getCollectible(domain, topic);
    if (collectible) {
      setUnlockCollectible(collectible);
    } else {
      const chapterJustDone = checkChapterCompletion(completedTopics, topic, domain);
      if (chapterJustDone) {
        setCompletedChapter(chapterJustDone);
        setShowCompletionModal(true);
      }
      setStage('complete');
      setShowReflection(true);
    }
    clearProgress(topic);
  };

  const handleCollectibleDismiss = () => {
    setUnlockCollectible(null);
    const chapterJustDone = checkChapterCompletion(completedTopics, topic, domain);
    if (chapterJustDone) { setCompletedChapter(chapterJustDone); setShowCompletionModal(true); }
    setStage('complete');
    setShowReflection(true);
  };

  const handleReteach = () => {
    setStage('explanation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDiagnosisContinue = () => { proceedToComplete(); };

  const handleBackToDashboard = () => {
    navigate(isGamingMode ? '/gaming/map' : '/dashboard');
  };

  const handleModalNavigate = () => {
    setShowCompletionModal(false);
    navigate(isGamingMode ? '/gaming/map' : '/dashboard');
  };

  if (!topic) return null;
  if (!profile) return null; // Wait for UserContext to load before rendering

  const chapterInfo  = getTopicChapterInfo(domain, topic);
  const allChapters  = getChapterProgress(completedTopics, domain);
  const nextChapter  = completedChapter && allChapters
    ? allChapters.find(c => c.number === completedChapter.number + 1) || null
    : null;

  // ── Gaming mode render ────────────────────────────────────────────────────

  if (isGamingMode) {
    const gc = gamingColors;
    return (
      <div style={{ padding: '24px 32px', maxWidth: '900px', margin: '0 auto' }}>
        <XPPopup popups={xpPopups} gamingMode={true} gamingColors={gc} badge={badgeNotification} />
        <CollectibleUnlock collectible={unlockCollectible} domain={domain} onClose={handleCollectibleDismiss} gamingMode={true} gamingColors={gc} />
        {showCompletionModal && completedChapter && (
          <ChapterCompletionModal
            chapter={completedChapter} nextChapter={nextChapter}
            onClose={handleModalNavigate} onContinue={handleModalNavigate}
          />
        )}

        {/* Gaming header (sticky) */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: gamingTheme.bgDark,
          borderBottom: `1px solid rgba(${hexToRgbStr(gc.primary)},0.15)`,
          marginBottom: 20, marginLeft: -32, marginRight: -32,
          paddingLeft: 32, paddingRight: 32, paddingTop: 10, paddingBottom: 10,
        }}>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={handleBackToDashboard}
              style={{
                width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
                background: `rgba(${hexToRgbStr(gc.primary)},0.12)`,
                border: `1px solid rgba(${hexToRgbStr(gc.primary)},0.3)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={18} color={gc.primary} />
            </motion.button>

            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: gamingTheme.fontLabel, fontSize: '9px', letterSpacing: '2.5px', color: gamingTheme.mutedBlue, textTransform: 'uppercase', marginBottom: '2px' }}>
                Quest Briefing
              </div>
              <h1 style={{
                fontFamily: gamingTheme.fontHeading, fontSize: 'clamp(16px,3vw,22px)', fontWeight: 800,
                color: gamingTheme.stellarWhite, textTransform: 'uppercase', letterSpacing: '2px',
                textShadow: `0 0 16px ${gc.glow}`, margin: 0,
              }}>
                {topic}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ fontFamily: gamingTheme.fontLabel, fontSize: '8px', letterSpacing: '2px', color: gamingTheme.mutedBlue, textTransform: 'uppercase' }}>LV {level}</span>
                <span style={{
                  padding: '2px 8px', borderRadius: 6,
                  background: `rgba(${hexToRgbStr(gc.primary)},0.14)`,
                  border: `1px solid rgba(${hexToRgbStr(gc.primary)},0.35)`,
                  fontFamily: gamingTheme.fontLabel, fontSize: 10, letterSpacing: '1px', color: gc.primary,
                }}>{xp} XP</span>
              </div>
            </div>

            {chapterInfo && (
              <div style={{
                padding: '4px 12px', borderRadius: '999px',
                background: `rgba(${hexToRgbStr(gc.primary)},0.1)`,
                border: `1px solid rgba(${hexToRgbStr(gc.primary)},0.25)`,
                fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                letterSpacing: '1px', color: gc.primary,
                display: 'flex', alignItems: 'center', gap: '6px',
                flexShrink: 0,
              }}>
                <BookOpen size={11} />
                Ch.{chapterInfo.chapter.number}
              </div>
            )}
          </motion.div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
            background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.4)',
            fontFamily: gamingTheme.fontBody, color: '#F87171', fontSize: '14px',
          }}>{error}</div>
        )}

        <AnimatePresence mode="wait">

          {/* LOCKED */}
          {stage === 'locked' && (
            <motion.div key="locked" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{
                background: gamingTheme.cardBg, borderRadius: '16px', border: gamingTheme.borderThin,
                padding: '40px', maxWidth: '380px', margin: '0 auto',
                backdropFilter: `blur(${gamingTheme.glassBlur})`,
              }}>
                <Lock size={48} color={gamingTheme.mutedBlue} style={{ marginBottom: '16px' }} />
                <h2 style={{ fontFamily: gamingTheme.fontHeading, color: gamingTheme.stellarWhite, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Topic Locked</h2>
                {chapterInfo && (
                  <p style={{ fontFamily: gamingTheme.fontBody, color: gamingTheme.seafoam, fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
                    Complete Chapter {chapterInfo.chapter.number - 1} first to unlock <em>{chapterInfo.chapter.title}</em>.
                  </p>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleBackToDashboard}
                  style={{
                    padding: '12px 28px', borderRadius: '10px',
                    fontFamily: gamingTheme.fontHeading, fontSize: '12px', fontWeight: 600,
                    letterSpacing: '1.5px', textTransform: 'uppercase',
                    color: gamingTheme.bgDark,
                    background: `linear-gradient(135deg, ${gc.primary}, ${gc.secondary})`,
                    border: 'none', cursor: 'pointer',
                    boxShadow: `0 4px 16px ${gc.glow}`,
                  }}
                >Back to Map</motion.button>
              </div>
            </motion.div>
          )}

          {/* LOADING */}
          {stage === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: `3px solid rgba(${hexToRgbStr(gc.primary)},0.2)`,
                  borderTopColor: gc.primary,
                }}
              />
              <span style={{ fontFamily: gamingTheme.fontLabel, fontSize: '11px', letterSpacing: '2px', color: gamingTheme.mutedBlue, textTransform: 'uppercase' }}>
                {quiz ? 'Preparing challenge...' : 'Generating quest briefing...'}
              </span>
            </motion.div>
          )}

          {/* EXPLANATION */}
          {stage === 'explanation' && explanation && (
            <motion.div key="explanation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ExplanationDisplay
                explanation={explanation} topic={topic} interest={profile?.primaryInterest}
                onRegenerate={handleRegenerate} isRegenerating={isRegenerating}
                pacing={pacing} comprehensionState={comprehensionState}
                onComprehension={handleComprehension} adaptiveContent={adaptiveContent}
                adaptiveLoading={adaptiveLoading} onRequestAdaptive={handleRequestAdaptive}
                gamingMode={true} gamingColors={gc}
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: `0 6px 28px ${gc.glow}` }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStartQuiz}
                  style={{
                    padding: '16px 40px', borderRadius: '12px',
                    fontFamily: gamingTheme.fontHeading, fontSize: '14px', fontWeight: 700,
                    letterSpacing: '2px', textTransform: 'uppercase',
                    color: gamingTheme.bgDark,
                    background: `linear-gradient(135deg, ${gc.primary}, ${gc.secondary})`,
                    border: 'none', cursor: 'pointer',
                    boxShadow: `0 4px 20px ${gc.glow}`,
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}
                >
                  <Target size={18} /> Take the Challenge
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* QUIZ */}
          {stage === 'quiz' && (scenarioQuiz || quiz) && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {scenarioQuiz ? (
                <ScenarioQuizEnvironment
                  questions={scenarioQuiz.questions}
                  scenarioTitle={scenarioQuiz.scenarioTitle}
                  scenarioContext={scenarioQuiz.scenarioContext}
                  topic={topic} onComplete={handleQuizComplete}
                  gamingMode={true} gamingColors={gc}
                />
              ) : (
                <NeoQuizEnvironment
                  questions={quiz} topic={topic}
                  onComplete={handleQuizComplete}
                  gamingMode={true} gamingColors={gc}
                />
              )}
            </motion.div>
          )}

          {/* DIAGNOSIS */}
          {stage === 'diagnosis' && quizResult && (
            <motion.div key="diagnosis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ paddingTop: '16px' }}>
              <QuizDiagnosis
                score={quizResult.score} totalQuestions={quizResult.totalQuestions}
                topic={topic} onReteach={handleReteach} onContinue={handleDiagnosisContinue}
                gamingMode={true} gamingColors={gc}
              />
            </motion.div>
          )}

          {/* COMPLETE */}
          {stage === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', paddingTop: '48px' }}>
              <motion.div
                animate={{ boxShadow: [`0 0 30px ${gc.glow}`, `0 0 60px ${gc.glow}`, `0 0 30px ${gc.glow}`] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                style={{
                  background: `rgba(${hexToRgbStr(gc.primary)},0.1)`,
                  border: `2px solid ${gc.primary}`,
                  borderRadius: '20px', padding: '48px',
                  maxWidth: '560px', margin: '0 auto 32px',
                }}
              >
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}>
                  <Zap size={64} color={gc.primary} style={{ marginBottom: '16px' }} />
                </motion.div>
                <h2 style={{
                  fontFamily: gamingTheme.fontHeading, fontSize: '28px', fontWeight: 800,
                  color: gamingTheme.stellarWhite, textTransform: 'uppercase', letterSpacing: '2px',
                  textShadow: `0 0 20px ${gc.glow}`, marginBottom: '8px',
                }}>Quest Complete!</h2>
                <p style={{ fontFamily: gamingTheme.fontBody, color: gamingTheme.seafoam, fontSize: '16px', marginBottom: '32px' }}>
                  You mastered <strong style={{ color: gc.primary }}>{topic}</strong>!
                </p>
                {!showReflection && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                    {nextTopic && (
                      <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/gaming/learn', { state: { topic: nextTopic } })}
                        style={{
                          padding: '16px 44px', borderRadius: '12px',
                          fontFamily: gamingTheme.fontHeading, fontSize: '15px', fontWeight: 700,
                          letterSpacing: '2px', textTransform: 'uppercase',
                          color: gamingTheme.bgDark,
                          background: `linear-gradient(135deg, ${gc.primary}, ${gc.secondary})`,
                          border: 'none', cursor: 'pointer', boxShadow: `0 6px 28px ${gc.glow}`,
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                        }}
                      >Next: {nextTopic} <ArrowRight size={16} /></motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={handleBackToDashboard}
                      style={{
                        padding: '12px 32px', borderRadius: '12px',
                        fontFamily: gamingTheme.fontHeading, fontSize: '12px', fontWeight: 700,
                        letterSpacing: '1.5px', textTransform: 'uppercase',
                        color: nextTopic ? gc.primary : gamingTheme.bgDark,
                        background: nextTopic
                          ? `rgba(${hexToRgbStr(gc.primary)},0.1)`
                          : `linear-gradient(135deg, ${gc.primary}, ${gc.secondary})`,
                        border: nextTopic ? `1px solid rgba(${hexToRgbStr(gc.primary)},0.35)` : 'none',
                        cursor: 'pointer', boxShadow: nextTopic ? 'none' : `0 4px 24px ${gc.glow}`,
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                      }}
                    >Island Map <ArrowRight size={14} /></motion.button>
                  </div>
                )}
              </motion.div>
              {showReflection && <PostQuizReflection onDone={() => setShowReflection(false)} gamingMode={true} gamingColors={gc} />}
              {jargonGuide && <JargonFlashcard jargonGuide={jargonGuide} />}
            </motion.div>
          )}
        </AnimatePresence>

        <FloatingMentor
          currentTopic={topic} userInterest={profile?.primaryInterest}
          isVisible={stage === 'explanation' || stage === 'quiz'}
          gamingMode={true} gamingColors={gc}
        />
      </div>
    );
  }

  // ── Brutalist (non-gaming) render ─────────────────────────────────────────

  return (
    <div className="min-h-screen bg-brutal-bg p-4 md:p-8">
      <XPPopup popups={xpPopups} badge={badgeNotification} />
      <CollectibleUnlock collectible={unlockCollectible} domain={domain} onClose={handleCollectibleDismiss} />
      {showCompletionModal && completedChapter && (
        <ChapterCompletionModal
          chapter={completedChapter} nextChapter={nextChapter}
          onClose={() => { setShowCompletionModal(false); navigate('/dashboard'); }}
          onContinue={() => { setShowCompletionModal(false); navigate('/dashboard'); }}
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal rounded-none">
            <div className="flex items-center justify-between px-6 py-4 border-b-4 border-brutal-black">
              <button onClick={handleBackToDashboard}
                className="bg-brutal-bg border-2 border-brutal-black px-4 py-2 rounded-none font-black text-sm hover:bg-brutal-green transition-colors">
                <ArrowLeft size={14} strokeWidth={2.5} className="inline mr-1" /> BACK
              </button>
              <div className="flex items-center gap-2">
                <div className="bg-brutal-pink border-2 border-brutal-black px-3 py-1 rounded-none">
                  <span className="text-xs font-black text-brutal-black">{profile?.primaryInterest?.toUpperCase()}</span>
                </div>
                <div className="bg-brutal-green border-2 border-brutal-black px-3 py-1 rounded-none">
                  <span className="text-xs font-black text-brutal-black">{profile?.difficulty?.toUpperCase()}</span>
                </div>
              </div>
            </div>
            {chapterInfo && (
              <div className="bg-brutal-black/80 px-6 py-2 flex items-center gap-2">
                <BookOpen size={12} strokeWidth={2.5} className="text-brutal-white/50" />
                <span className="text-brutal-white/50 text-xs font-bold">Chapter {chapterInfo.chapter.number}: {chapterInfo.chapter.title}</span>
                <span className="text-brutal-white/25 text-xs font-bold">·</span>
                <span className="text-brutal-white/40 text-xs font-bold">Topic {chapterInfo.position} of {chapterInfo.topicTotal}</span>
              </div>
            )}
            <div className="bg-brutal-blue px-6 py-8">
              <h1 className="text-4xl md:text-5xl font-black text-brutal-white leading-tight">{topic.toUpperCase()}</h1>
              <p className="text-brutal-white mt-2 text-lg font-bold">Learning through {profile?.primaryInterest}</p>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-brutal-pink border-4 border-brutal-black shadow-brutal rounded-none p-4 mb-6">
            <p className="text-brutal-black font-bold">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {stage === 'locked' && (
            <motion.div key="locked" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-12 text-center">
              <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal max-w-md mx-auto p-10">
                <div className="w-16 h-16 bg-brutal-bg border-4 border-brutal-black flex items-center justify-center mx-auto mb-5">
                  <Lock size={32} strokeWidth={2} className="text-brutal-black/40" />
                </div>
                <h2 className="text-2xl font-black text-brutal-black mb-2">TOPIC LOCKED</h2>
                <p className="text-brutal-black/60 text-sm font-bold mb-2">
                  <span className="text-brutal-black">{topic}</span> is part of a locked chapter.
                </p>
                {chapterInfo && (
                  <p className="text-brutal-black/50 text-xs font-bold mb-6">
                    Complete Chapter {chapterInfo.chapter.number - 1} first to unlock <em>{chapterInfo.chapter.title}</em>.
                  </p>
                )}
                <motion.button whileHover={{ x: 3, y: 3 }} whileTap={{ scale: 0.97 }}
                  onClick={handleBackToDashboard}
                  className="bg-brutal-green border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-8 py-3 font-black text-sm text-brutal-black transition-all">
                  BACK TO DASHBOARD
                </motion.button>
              </div>
            </motion.div>
          )}

          {stage === 'pacing' && (
            <motion.div key="pacing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto">
              <PacingSelector selected={pacing} onSelect={(p) => setPacing(p)} />
              <div className="flex justify-center mt-2">
                <motion.button whileHover={{ x: 4, y: 4 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handlePacingConfirm(pacing)}
                  className="bg-brutal-green border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover px-12 py-4 rounded-none font-black text-xl text-brutal-black transition-all">
                  <span className="flex items-center gap-2">START LEARNING <Zap size={20} strokeWidth={2.5} /></span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {stage === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20">
              <LoadingAnimation message={quiz ? 'Preparing your quiz...' : 'AI is crafting your personalized lesson...'} />
            </motion.div>
          )}

          {stage === 'explanation' && explanation && (
            <motion.div key="explanation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ExplanationDisplay
                explanation={explanation} topic={topic} interest={profile?.primaryInterest}
                onRegenerate={handleRegenerate} isRegenerating={isRegenerating}
                pacing={pacing} comprehensionState={comprehensionState}
                onComprehension={handleComprehension} adaptiveContent={adaptiveContent}
                adaptiveLoading={adaptiveLoading} onRequestAdaptive={handleRequestAdaptive}
              />
              <div className="flex justify-center mt-8">
                <motion.button whileHover={{ x: 4, y: 4 }} whileTap={{ scale: 0.95 }}
                  onClick={handleStartQuiz}
                  className="bg-brutal-green border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover px-12 py-4 rounded-none font-black text-2xl text-brutal-black transition-all">
                  <span className="flex items-center gap-2">TAKE THE QUIZ <AnimatedIcon icon={Target} size={22} animation="bounce" /></span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {stage === 'quiz' && (scenarioQuiz || quiz) && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {scenarioQuiz ? (
                <ScenarioQuizEnvironment
                  questions={scenarioQuiz.questions} scenarioTitle={scenarioQuiz.scenarioTitle}
                  scenarioContext={scenarioQuiz.scenarioContext} topic={topic} onComplete={handleQuizComplete}
                />
              ) : (
                <NeoQuizEnvironment questions={quiz} topic={topic} onComplete={handleQuizComplete} />
              )}
            </motion.div>
          )}

          {stage === 'diagnosis' && quizResult && (
            <motion.div key="diagnosis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-4">
              <QuizDiagnosis score={quizResult.score} totalQuestions={quizResult.totalQuestions}
                topic={topic} onReteach={handleReteach} onContinue={handleDiagnosisContinue} />
            </motion.div>
          )}

          {stage === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center py-8">
                <div className="bg-brutal-green border-4 border-brutal-black shadow-brutal-lg rounded-none p-12 max-w-2xl mx-auto mb-8">
                  <div className="mb-6 flex justify-center text-brutal-black">
                    <AnimatedIcon icon={Sparkles} size={80} animation="pulse" />
                  </div>
                  <h2 className="text-5xl font-black text-brutal-black mb-4">TOPIC COMPLETE!</h2>
                  <p className="text-2xl text-brutal-black mb-8 font-bold">You crushed {topic}!</p>
                  {!showReflection && (
                    <motion.button whileHover={{ x: 4, y: 4 }} whileTap={{ scale: 0.95 }}
                      onClick={handleBackToDashboard}
                      className="bg-brutal-blue border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover px-12 py-4 rounded-none font-black text-2xl text-brutal-white">
                      <span className="flex items-center gap-2">CONTINUE LEARNING <ArrowRight size={22} strokeWidth={2.5} /></span>
                    </motion.button>
                  )}
                </div>
                {showReflection && <PostQuizReflection onDone={() => setShowReflection(false)} />}
                {jargonGuide && <JargonFlashcard jargonGuide={jargonGuide} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FloatingMentor currentTopic={topic} userInterest={profile?.primaryInterest}
        isVisible={stage === 'explanation' || stage === 'quiz'} />
    </div>
  );
};

export default Learning;
