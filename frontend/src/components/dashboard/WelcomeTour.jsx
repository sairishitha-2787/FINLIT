import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, Brain, BarChart2, ArrowDown, ArrowRight } from 'lucide-react';
import AnimatedIcon from '../shared/AnimatedIcon';

const TOUR_STEPS = [
  { Icon: Target,   animation: 'bounce',  title: 'Your Learning Hub',      body: "Recommended topics are picked just for you based on your level and interests. Tap one to start learning!", accent: 'bg-brutal-blue' },
  { Icon: Zap,      animation: 'flash',   title: 'XP & Levels',            body: "Every topic you finish, quiz you ace, and question you ask Finn earns you XP. Level up to unlock harder content!", accent: 'bg-brutal-green' },
  { Icon: Brain,    animation: 'wiggle',  title: 'Meet Finn — Your AI Mentor', body: "See that brain button in the corner? That's Finn. Ask anything about finance and he'll explain it through your interests.", accent: 'bg-brutal-pink' },
  { Icon: BarChart2, animation: 'none',   title: 'Track Your Progress',    body: "Your stats, streaks, and completed topics all live on this dashboard. Come back daily to keep your streak alive!", accent: 'bg-brutal-yellow' },
];

const AUTO_ADVANCE_MS = 5000;

const WelcomeTour = ({ userName, onDone }) => {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (exiting) return;
    const timer = setTimeout(() => {
      if (step < TOUR_STEPS.length - 1) {
        setStep(s => s + 1);
      } else {
        handleDone();
      }
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [step, exiting]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDone = () => {
    setExiting(true);
    setTimeout(onDone, 400);
  };

  const current = TOUR_STEPS[step];

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="tour-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 pointer-events-none"
        >
          {/* Dim backdrop — only partial so dashboard is still visible */}
          <div className="absolute inset-0 bg-brutal-black/40" />

          {/* Tour card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="absolute bottom-28 right-8 w-80 pointer-events-auto"
          >
            <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal-lg rounded-none">
              {/* Coloured top bar */}
              <div className={`${current.accent} border-b-4 border-brutal-black px-4 py-3 flex items-center gap-3`}>
                <AnimatedIcon icon={current.Icon} size={28} animation={current.animation} className="text-brutal-black shrink-0" />
                <h3 className="font-black text-brutal-black text-base leading-tight">{current.title}</h3>
              </div>

              <div className="px-4 py-3">
                <p className="text-sm font-bold text-brutal-black leading-relaxed">{current.body}</p>
              </div>

              {/* Progress dots + controls */}
              <div className="border-t-4 border-brutal-black px-4 py-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {TOUR_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 border-2 border-brutal-black transition-colors duration-300 ${
                        i === step ? 'bg-brutal-black' : 'bg-brutal-black/20'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDone}
                    className="text-xs font-black text-brutal-black/40 hover:text-brutal-black transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => step < TOUR_STEPS.length - 1 ? setStep(s => s + 1) : handleDone()}
                    className="bg-brutal-black text-brutal-white font-black text-xs px-3 py-1.5 border-2 border-brutal-black hover:bg-brutal-blue hover:border-brutal-blue transition-colors"
                  >
                    {step < TOUR_STEPS.length - 1
                      ? <span className="flex items-center gap-1">Next <ArrowRight size={12} strokeWidth={2.5} /></span>
                      : 'Got it!'
                    }
                  </button>
                </div>
              </div>

              {/* Auto-advance progress bar */}
              <div className="h-1 bg-brutal-black/10">
                <motion.div
                  key={`bar-${step}`}
                  className="h-full bg-brutal-black"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                />
              </div>
            </div>

            {/* Pointer arrow toward the Finn button in the bottom-right */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute -bottom-7 right-16 text-brutal-black select-none"
              >
                <AnimatedIcon icon={ArrowDown} size={24} animation="bounce" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeTour;
