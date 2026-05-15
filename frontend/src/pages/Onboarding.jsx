import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smile, Layers, User, Flag, BarChart2,
  Check, Rocket, ArrowRight, ArrowLeft, Lock,
  GraduationCap, Briefcase, Sparkles, CreditCard, PiggyBank,
  TrendingUp, HelpCircle, Sprout, Leaf, TreePine,
  Gamepad2, Trophy, Film, ChefHat, Music,
} from 'lucide-react';
import AnimatedIcon from '../components/shared/AnimatedIcon';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { ONBOARDING_QUESTIONS } from '../utils/constants';
import GridDistortion from '../components/effects/GridDistortion';
import LogoutConfirmModal from '../components/shared/LogoutConfirmModal';
import GlassCard from '../components/core/GlassCard';
import { glass } from '../styles/coreTheme';
import { getDomainPath } from '../services/chapterService';

const CORE_DOMAINS = [
  { id: 'gaming',  name: 'Gaming',  Icon: Gamepad2, desc: 'XP, quests & boss battles',        color: '#9FE0D3', bg: 'linear-gradient(135deg, #9FE0D3 0%, #5E86C1 100%)' },
  { id: 'fashion', name: 'Fashion', emoji: '👗',    desc: 'Style your financial future',       color: '#f7a0b8', bg: 'linear-gradient(135deg, #f7a0b8 0%, #c084fc 50%, #fbb6c4 100%)' },
  { id: 'sports',  name: 'Sports',  Icon: Trophy,   desc: 'Your championship finance roster',  color: '#FF6B35', bg: 'linear-gradient(135deg, #FF6B35 0%, #F7C59F 100%)' },
  { id: 'movies',  name: 'Movies',  Icon: Film,     desc: 'Direct your financial blockbuster', color: '#DC2626', bg: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)' },
  { id: 'food',    name: 'Food',    Icon: ChefHat,  desc: 'Master your financial kitchen',     color: '#FB923C', bg: 'linear-gradient(135deg, #FB923C 0%, #FEF3C7 100%)' },
  { id: 'music',   name: 'Music',   Icon: Music,    desc: 'Compose your financial symphony',   color: '#7C3AED', bg: 'linear-gradient(135deg, #7C3AED 0%, #EAB308 100%)' },
];

const OPTION_ICON_MAP = {
  GraduationCap, Briefcase, Rocket, Sparkles,
  CreditCard, PiggyBank, TrendingUp, BarChart2, HelpCircle,
  Sprout, Leaf, TreePine,
};

const STEP_META = [
  { label: 'Welcome',   Icon: Smile    },
  { label: 'Interests', Icon: Layers   },
  { label: 'Situation', Icon: User     },
  { label: 'Challenge', Icon: Flag     },
  { label: 'Level',     Icon: BarChart2},
];

const GlassStepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, i) => {
      const isComplete = i < currentStep;
      const isActive   = i === currentStep;
      const meta       = STEP_META[i];
      return (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 220 }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600,
              transition: 'all 0.3s ease',
              background: isActive   ? '#3A8DFF'
                        : isComplete ? 'rgba(52,211,153,0.15)'
                        : 'rgba(255,255,255,0.65)',
              border: isActive   ? '2px solid rgba(58,141,255,0.4)'
                    : isComplete ? '1.5px solid rgba(52,211,153,0.5)'
                    : '1px solid rgba(203,213,225,0.6)',
              boxShadow: isActive ? '0 4px 12px rgba(58,141,255,0.35)' : 'none',
              color: isActive ? '#fff' : isComplete ? '#10b981' : '#94a3b8',
            }}>
              {isComplete ? <Check size={14} strokeWidth={3} /> : <meta.Icon size={13} strokeWidth={2} />}
            </div>
            <span style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: isActive ? '#3A8DFF' : isComplete ? '#10b981' : '#cbd5e1',
            }}>
              {meta.label}
            </span>
          </motion.div>

          {i < totalSteps - 1 && (
            <div style={{ width: 24, height: 1, position: 'relative', marginBottom: 16 }}>
              <div style={{ position: 'absolute', inset: 0, background: '#e2e8f0' }} />
              <motion.div
                style={{ position: 'absolute', top: 0, left: 0, bottom: 0, background: '#3A8DFF' }}
                initial={{ width: '0%' }}
                animate={{ width: isComplete ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

const GRID_BG = { grid: 15, mouse: 0.1, strength: 0.15, relaxation: 0.9 };

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();
  const { user, logout } = useAuth();
  const [currentStep, setCurrentStep]     = useState(0);
  const signupName = user?.user_metadata?.name || user?.user_metadata?.full_name || '';
  const [answers, setAnswers]             = useState({ name: signupName });
  const [direction, setDirection]         = useState(1);
  const [saving, setSaving]               = useState(false);
  const [saveError, setSaveError]         = useState('');
  const [showPathPreview, setShowPathPreview] = useState(false);
  const [savedInterest, setSavedInterest] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
  const totalSteps      = ONBOARDING_QUESTIONS.length;
  const isLastStep      = currentStep === totalSteps - 1;

  const handleAnswer = (id, value) => setAnswers({ ...answers, [id]: value });

  const handleNext = async () => {
    const cur = answers[currentQuestion.id];
    if (!cur || saving) return;
    if (isLastStep) {
      setSaving(true); setSaveError('');
      const result = await completeOnboarding({
        name: answers.name, primaryInterest: answers.interest,
        situation: answers.situation, challenge: answers.challenge,
        difficulty: answers.knowledge,
      });
      setSaving(false);
      if (result.success) {
        const path = getDomainPath(answers.interest);
        if (path) { setSavedInterest(answers.interest); setShowPathPreview(true); }
        else       { navigate('/dashboard'); }
      } else {
        setSaveError(result.error || 'Failed to save. Please try again.');
      }
    } else {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) { setDirection(-1); setCurrentStep(currentStep - 1); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && answers[currentQuestion.id]) handleNext();
  };

  const slideVariants = {
    enter:  (d) => ({ x: d > 0 ?  64 : -64, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:   (d) => ({ x: d > 0 ? -64 :  64, opacity: 0, scale: 0.98 }),
  };

  if (showPathPreview) {
    const path = getDomainPath(savedInterest);
    return (
      <div className={`${glass.page} flex flex-col items-center justify-center p-4`}>
        <GridDistortion {...GRID_BG} />
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          transition={{ duration: 0.45 }}
          className="max-w-lg w-full relative z-10"
        >
          <GlassCard large className="p-8 md:p-10">
            <div className="text-center mb-6">
              <div style={{ display: 'inline-block', background: 'rgba(58,141,255,0.10)', border: '1px solid rgba(58,141,255,0.22)', borderRadius: 9999, padding: '4px 12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3A8DFF', marginBottom: 12 }}>
                YOUR LEARNING PATH
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#1e293b' }}>{path.campaignTitle}</h2>
              <p className="text-sm" style={{ color: '#64748b' }}>{path.tagline}</p>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              {path.chapters.map((chapter, idx) => {
                const isFirst = idx === 0;
                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + idx * 0.08 }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 16, padding: 16,
                      borderRadius: 12,
                      background: isFirst ? 'rgba(58,141,255,0.07)' : 'rgba(255,255,255,0.4)',
                      border: isFirst ? '1px solid rgba(58,141,255,0.25)' : '1px solid rgba(203,213,225,0.5)',
                      opacity: isFirst ? 1 : 0.6,
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isFirst ? 'rgba(58,141,255,0.12)' : 'rgba(203,213,225,0.3)',
                      border: isFirst ? '1px solid rgba(58,141,255,0.3)' : '1px solid rgba(203,213,225,0.5)',
                      color: isFirst ? '#3A8DFF' : '#94a3b8',
                    }}>
                      {isFirst ? <Rocket size={16} /> : <Lock size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8' }}>Ch{chapter.number}</span>
                        {isFirst && <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#3A8DFF' }}>UNLOCKED</span>}
                      </div>
                      <p className="font-semibold text-sm" style={{ color: isFirst ? '#1e293b' : '#94a3b8' }}>{chapter.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: isFirst ? '#64748b' : '#b0bec5' }}>
                        {chapter.topics.length} topics · {chapter.difficulty}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              onClick={() => navigate('/dashboard')}
              className={`w-full py-4 text-sm font-bold ${glass.accentBtn}`}
            >
              <AnimatedIcon icon={Rocket} size={18} animation="float" />
              START CHAPTER 1
            </motion.button>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${glass.page} flex flex-col items-center justify-center p-4`} onKeyDown={handleKeyDown}>
      <GridDistortion {...GRID_BG} />

      <div className="max-w-3xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 relative"
        >
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: '#1a2e4a' }}>
            FIN<span style={{ color: '#3A8DFF' }}>LIT</span>
          </h1>
          <p className="text-sm" style={{ color: '#64748b' }}>Personalizing your experience</p>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="absolute right-0 top-0 text-xs font-medium transition-colors"
            style={{ color: '#b0bec5' }}
          >
            Sign out
          </button>
          <LogoutConfirmModal
            open={showLogoutConfirm}
            domain="default"
            onConfirm={async () => { await logout(); navigate('/login', { replace: true }); }}
            onCancel={() => setShowLogoutConfirm(false)}
          />
        </motion.div>

        <GlassStepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <GlassCard large className="p-8 md:p-10 mb-8">
              <QuestionContent
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onAnswer={(v) => handleAnswer(currentQuestion.id, v)}
                stepIndex={currentStep}
              />
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex gap-4 justify-between items-center"
        >
          <motion.button
            onClick={handleBack}
            disabled={currentStep === 0}
            whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
            whileTap={currentStep  > 0 ? { scale: 0.98 } : {}}
            className={`${glass.ghostBtn} px-6 py-3 text-sm ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Back
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id] || saving}
            whileHover={answers[currentQuestion.id] && !saving ? { scale: 1.03 } : {}}
            whileTap={answers[currentQuestion.id]  && !saving ? { scale: 0.97 } : {}}
            className={`px-8 py-3.5 text-sm font-bold ${glass.accentBtn} ${!answers[currentQuestion.id] || saving ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {isLastStep ? 'Launch FINLIT' : 'Continue'}
                <AnimatedIcon
                  icon={isLastStep ? Rocket : ArrowRight}
                  size={17}
                  animation={answers[currentQuestion.id] ? (isLastStep ? 'float' : 'bounce') : 'none'}
                />
              </>
            )}
          </motion.button>
        </motion.div>

        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-4 text-sm font-medium rounded-xl px-4 py-3"
            style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca' }}
          >
            {saveError}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const QuestionContent = ({ question, answer, onAnswer, stepIndex }) => {
  const stepLabel = (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-2">
      <span style={{ color: 'rgba(58,141,255,0.7)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
        Step {stepIndex + 1} of 5
      </span>
    </motion.div>
  );

  const heading = (text) => (
    <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
      className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#1e293b' }}>
      {text}
    </motion.h2>
  );

  if (question.type === 'text') {
    return (
      <div>
        {stepLabel}
        {heading(question.question)}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <input
            type="text" value={answer || ''} onChange={(e) => onAnswer(e.target.value)}
            placeholder={question.placeholder}
            className={`${glass.input} text-lg py-4 px-5`}
            autoFocus
          />
        </motion.div>
      </div>
    );
  }

  if (question.type === 'interest-selector') {
    return (
      <div>
        {stepLabel}
        {heading(question.question)}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
          className="text-sm -mt-3 mb-6" style={{ color: '#64748b' }}>
          {question.description}
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CORE_DOMAINS.map((domain, idx) => {
            const isSelected = answer === domain.id;
            const { Icon } = domain;
            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.20 + idx * 0.06 }}
                onClick={() => onAnswer(domain.id)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '18px 14px', borderRadius: 16, cursor: 'pointer',
                  transition: 'all 0.22s ease', position: 'relative', overflow: 'hidden',
                  background: isSelected ? 'rgba(58,141,255,0.09)' : 'rgba(255,255,255,0.55)',
                  border: isSelected ? `1.5px solid ${domain.color}` : '1px solid rgba(203,213,225,0.6)',
                  boxShadow: isSelected ? `0 4px 18px ${domain.color}44` : 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: isSelected ? domain.bg : 'rgba(203,213,225,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.22s ease',
                  boxShadow: isSelected ? `0 4px 12px ${domain.color}55` : 'none',
                }}>
                  {domain.emoji
                    ? <span style={{ fontSize: 22, lineHeight: 1 }}>{domain.emoji}</span>
                    : <Icon size={22} strokeWidth={1.8} style={{ color: isSelected ? '#fff' : '#94a3b8' }} />
                  }
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: isSelected ? '#1e293b' : '#374151', marginBottom: 2 }}>
                    {domain.name}
                  </div>
                  <div style={{ fontSize: 11, color: isSelected ? '#64748b' : '#94a3b8', lineHeight: 1.4 }}>
                    {domain.desc}
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: isSelected ? 1 : 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 20, height: 20, borderRadius: '50%',
                    background: domain.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Check size={11} strokeWidth={3} style={{ color: '#fff' }} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.type === 'multiple-choice') {
    return (
      <div>
        {stepLabel}
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
          className="text-2xl md:text-3xl font-bold mb-8" style={{ color: '#1e293b' }}>
          {question.question}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            const isSelected = answer === option.value;
            const I = OPTION_ICON_MAP[option.icon];
            return (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + index * 0.07 }}
                onClick={() => onAnswer(option.value)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: 20, borderRadius: 16, cursor: 'pointer',
                  transition: 'all 0.25s ease', position: 'relative', overflow: 'hidden',
                  background: isSelected ? 'rgba(58,141,255,0.08)' : 'rgba(255,255,255,0.55)',
                  border: isSelected ? '1.5px solid #3A8DFF' : '1px solid rgba(203,213,225,0.6)',
                  boxShadow: isSelected ? '0 4px 16px rgba(58,141,255,0.15)' : 'none',
                }}
              >
                <div className="flex items-center gap-4">
                  {I && (
                    <div style={{ color: isSelected ? '#3A8DFF' : '#64748b', transition: 'color 0.2s' }}>
                      <AnimatedIcon icon={I} size={26} animation={isSelected ? 'pulse' : 'none'} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-0.5" style={{ color: isSelected ? '#1e3a8a' : '#374151' }}>
                      {option.label}
                    </h3>
                    {option.description && (
                      <p className="text-xs" style={{ color: isSelected ? 'rgba(58,141,255,0.65)' : '#94a3b8' }}>
                        {option.description}
                      </p>
                    )}
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isSelected ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    style={{ width: 24, height: 24, borderRadius: '50%', background: '#3A8DFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <Check size={12} strokeWidth={3} style={{ color: '#fff' }} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default Onboarding;
