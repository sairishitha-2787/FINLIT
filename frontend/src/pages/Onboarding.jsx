// FINLIT Onboarding Page - Cosmic Theme
// Immersive 5-step flow with futuristic design

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { ONBOARDING_QUESTIONS } from '../utils/constants';
import InterestSelector from '../components/onboarding/InterestSelector';

// Canvas particle background (shared with Landing)
const CosmicParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    const particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        color: Math.random() > 0.6
          ? 'rgba(167, 139, 250, '
          : Math.random() > 0.4
            ? 'rgba(236, 72, 153, '
            : 'rgba(59, 130, 246, '
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const o = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + o + ')';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (o * 0.1) + ')';
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.6 }} />;
};

// Step labels and icons for the orbit tracker
const STEP_META = [
  { label: 'Welcome', icon: '✦' },
  { label: 'Interests', icon: '◈' },
  { label: 'Situation', icon: '◉' },
  { label: 'Challenge', icon: '⬡' },
  { label: 'Level', icon: '★' },
];

// Orbit-style progress tracker
const OrbitProgress = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isComplete = i < currentStep;
        const isActive = i === currentStep;
        const meta = STEP_META[i];

        return (
          <div key={i} className="flex items-center gap-3">
            <motion.div
              className="flex flex-col items-center gap-1.5"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-500 orbit-dot
                  ${isActive
                    ? 'bg-cosmic-purple text-white orbit-dot-active border-2 border-cosmic-glow/60'
                    : isComplete
                      ? 'bg-emerald-500/20 text-emerald-400 orbit-dot-complete border border-emerald-400/40'
                      : 'bg-white/5 text-white/30 border border-white/10'
                  }
                `}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={isActive ? { duration: 2, repeat: Infinity } : {}}
              >
                {isComplete ? '✓' : meta.icon}
              </motion.div>
              <span className={`text-[10px] font-medium tracking-wider uppercase transition-colors duration-300 ${
                isActive ? 'text-cosmic-glow' : isComplete ? 'text-emerald-400/70' : 'text-white/20'
              }`}>
                {meta.label}
              </span>
            </motion.div>

            {/* Connector line */}
            {i < totalSteps - 1 && (
              <div className="w-8 h-px relative mb-5">
                <div className="absolute inset-0 bg-white/10" />
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cosmic-purple to-cosmic-glow"
                  initial={{ width: '0%' }}
                  animate={{ width: isComplete ? '100%' : '0%' }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
  const totalSteps = ONBOARDING_QUESTIONS.length;
  const isLastStep = currentStep === totalSteps - 1;

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    const currentAnswer = answers[currentQuestion.id];
    if (!currentAnswer) return;

    if (isLastStep) {
      const profileData = {
        name: answers.name,
        primaryInterest: answers.interest,
        situation: answers.situation,
        challenge: answers.challenge,
        difficulty: answers.knowledge,
        createdAt: new Date().toISOString()
      };
      completeOnboarding(profileData);
      navigate('/dashboard');
    } else {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle Enter key for text inputs
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && answers[currentQuestion.id]) {
      handleNext();
    }
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.98 }),
  };

  return (
    <div className="min-h-screen cosmic-bg flex flex-col items-center justify-center p-4 relative" onKeyDown={handleKeyDown}>
      <CosmicParticles />

      {/* Nebula background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(108,60,224,0.5) 0%, transparent 70%)',
            animation: 'nebulaDrift 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
            animation: 'nebulaDrift 22s ease-in-out infinite reverse',
          }}
        />
      </div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-2"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white mb-1"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="bg-gradient-to-r from-cosmic-glow to-cosmic-cyan bg-clip-text text-transparent">
              FINLIT
            </span>
          </motion.h1>
          <p className="text-white/35 text-sm tracking-wide">
            Personalizing your experience
          </p>
        </motion.div>

        {/* Orbit Progress */}
        <OrbitProgress currentStep={currentStep} totalSteps={totalSteps} />

        {/* Question Card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="glass-card p-8 md:p-10 mb-8"
          >
            <QuestionContent
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onAnswer={(value) => handleAnswer(currentQuestion.id, value)}
              stepIndex={currentStep}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-between items-center"
        >
          <motion.button
            onClick={handleBack}
            disabled={currentStep === 0}
            whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
            whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
            className={`cosmic-btn-ghost px-6 py-3 text-sm ${
              currentStep === 0 ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            ← Back
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            whileHover={answers[currentQuestion.id] ? { scale: 1.03 } : {}}
            whileTap={answers[currentQuestion.id] ? { scale: 0.97 } : {}}
            className={`cosmic-btn px-8 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
              !answers[currentQuestion.id] ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLastStep ? 'Launch FINLIT' : 'Continue'}
              <motion.span
                animate={answers[currentQuestion.id] ? { x: [0, 3, 0] } : {}}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                {isLastStep ? '🚀' : '→'}
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

// Renders the right content based on question type
const QuestionContent = ({ question, answer, onAnswer, stepIndex }) => {
  if (question.type === 'text') {
    return (
      <div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2"
        >
          <span className="text-cosmic-glow/60 text-xs font-medium tracking-[0.2em] uppercase">
            Step {stepIndex + 1} of 5
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl md:text-3xl font-bold text-white mb-6"
        >
          {question.question}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <input
            type="text"
            value={answer || ''}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder={question.placeholder}
            className="glass-input w-full px-6 py-4 text-lg"
            autoFocus
          />
        </motion.div>
      </div>
    );
  }

  if (question.type === 'interest-selector') {
    return (
      <div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2"
        >
          <span className="text-cosmic-glow/60 text-xs font-medium tracking-[0.2em] uppercase">
            Step {stepIndex + 1} of 5
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl md:text-3xl font-bold text-white mb-2"
        >
          {question.question}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 mb-6 text-sm"
        >
          {question.description}
        </motion.p>
        <InterestSelector
          selectedInterest={answer}
          onSelect={onAnswer}
        />
      </div>
    );
  }

  if (question.type === 'multiple-choice') {
    return (
      <div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2"
        >
          <span className="text-cosmic-glow/60 text-xs font-medium tracking-[0.2em] uppercase">
            Step {stepIndex + 1} of 5
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl md:text-3xl font-bold text-white mb-8"
        >
          {question.question}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            const isSelected = answer === option.value;
            return (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                onClick={() => onAnswer(option.value)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-5 rounded-2xl cursor-pointer transition-all duration-400 border relative overflow-hidden
                  ${isSelected
                    ? 'bg-cosmic-purple/20 border-cosmic-purple/60 selected-glow'
                    : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06]'
                  }
                `}
              >
                {/* Selected indicator glow */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedBg"
                    className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/10 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <div className="flex items-center gap-4 relative z-10">
                  <motion.div
                    className="text-3xl"
                    animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {option.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-0.5 transition-colors duration-300 ${
                      isSelected ? 'text-white' : 'text-white/80'
                    }`}>
                      {option.label}
                    </h3>
                    {option.description && (
                      <p className={`text-sm transition-colors duration-300 ${
                        isSelected ? 'text-white/50' : 'text-white/30'
                      }`}>
                        {option.description}
                      </p>
                    )}
                  </div>

                  {/* Selection check */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isSelected ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-6 h-6 rounded-full bg-cosmic-purple flex items-center justify-center"
                  >
                    <span className="text-white text-xs">✓</span>
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
