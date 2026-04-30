// FINLIT Learning Page - Neo-Brutalist Edition
// Displays explanation and quiz with gamification

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getExplanation, getQuiz } from '../services/api';
import ExplanationDisplay from '../components/learning/ExplanationDisplay';
import NeoQuizEnvironment from '../components/quiz/NeoQuizEnvironment';
import JargonFlashcard from '../components/learning/JargonFlashcard';
import XPPopup from '../components/shared/XPPopup';
import FloatingMentor from '../components/mentor/FloatingMentor';
import LoadingAnimation from '../components/shared/LoadingAnimation';
import useGamification from '../hooks/useGamification';

const Learning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, addTopicProgress } = useUser();
  const { xpPopups, awardXP } = useGamification();
  const topic = location.state?.topic;

  const [stage, setStage] = useState('loading'); // loading, explanation, quiz, complete
  const [explanation, setExplanation] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [jargonGuide, setJargonGuide] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!topic) {
      navigate('/dashboard');
      return;
    }

    loadExplanation();
  }, [topic]);

  const loadExplanation = async () => {
    try {
      setStage('loading');
      setError(null);

      const response = await getExplanation(
        topic,
        profile.primaryInterest,
        profile.difficulty
      );

      if (response.success) {
        setExplanation(response.explanation);
        setStage('explanation');

        // Award XP for reading explanation
        setTimeout(() => {
          awardXP.readExplanation();
        }, 1000);
      } else {
        setError('Failed to load explanation');
      }
    } catch (err) {
      console.error('Error loading explanation:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleStartQuiz = async () => {
    try {
      setStage('loading');

      const response = await getQuiz(
        topic,
        profile.primaryInterest,
        profile.difficulty
      );

      if (response.success && response.questions.length > 0) {
        setQuiz(response.questions);
        setJargonGuide(response.jargonGuide || null);
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
    // Save progress
    addTopicProgress({
      topic,
      score,
      totalQuestions,
      difficulty: profile.difficulty
    });

    setStage('complete');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (!topic) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brutal-bg p-4 md:p-8">
      {/* XP Popups */}
      <XPPopup popups={xpPopups} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal rounded-none">
            {/* Top Bar - Navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-b-4 border-brutal-black">
              <button
                onClick={handleBackToDashboard}
                className="bg-brutal-bg border-2 border-brutal-black px-4 py-2 rounded-none font-black text-sm hover:bg-brutal-green transition-colors"
              >
                ← BACK
              </button>
              <div className="flex items-center gap-2">
                <div className="bg-brutal-pink border-2 border-brutal-black px-3 py-1 rounded-none">
                  <span className="text-xs font-black text-brutal-black">
                    {profile.primaryInterest.toUpperCase()}
                  </span>
                </div>
                <div className="bg-brutal-green border-2 border-brutal-black px-3 py-1 rounded-none">
                  <span className="text-xs font-black text-brutal-black">
                    {profile.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Title Section */}
            <div className="bg-brutal-blue px-6 py-8">
              <h1 className="text-4xl md:text-5xl font-black text-brutal-white leading-tight">
                {topic.toUpperCase()}
              </h1>
              <p className="text-brutal-white mt-2 text-lg font-bold">
                Learning through {profile.primaryInterest}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-brutal-pink border-4 border-brutal-black shadow-brutal rounded-none p-4 mb-6"
          >
            <p className="text-brutal-black font-bold">{error}</p>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {stage === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20"
            >
              <LoadingAnimation
                message={quiz ? 'Preparing your quiz...' : 'AI is crafting your personalized lesson...'}
              />
            </motion.div>
          )}

          {stage === 'explanation' && explanation && (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ExplanationDisplay
                explanation={explanation}
                topic={topic}
                interest={profile.primaryInterest}
              />
              <div className="flex justify-center mt-8">
                <motion.button
                  whileHover={{ x: 4, y: 4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartQuiz}
                  className="bg-brutal-green border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover px-12 py-4 rounded-none font-black text-2xl text-brutal-black transition-all"
                >
                  TAKE THE QUIZ 🎯
                </motion.button>
              </div>
            </motion.div>
          )}

          {stage === 'quiz' && quiz && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <NeoQuizEnvironment
                questions={quiz}
                topic={topic}
                onComplete={handleQuizComplete}
              />
            </motion.div>
          )}

          {stage === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center py-12">
                <div className="bg-brutal-green border-4 border-brutal-black shadow-brutal-lg rounded-none p-12 max-w-2xl mx-auto mb-8">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: 3 }}
                    className="text-8xl mb-6"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-5xl font-black text-brutal-black mb-4">
                    TOPIC COMPLETE!
                  </h2>
                  <p className="text-2xl text-brutal-black mb-8 font-bold">
                    You crushed {topic}!
                  </p>
                  <motion.button
                    whileHover={{ x: 4, y: 4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBackToDashboard}
                    className="bg-brutal-blue border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover px-12 py-4 rounded-none font-black text-2xl text-brutal-white"
                  >
                    CONTINUE LEARNING →
                  </motion.button>
                </div>

                {/* Jargon Flashcards */}
                {jargonGuide && <JargonFlashcard jargonGuide={jargonGuide} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Mentor */}
      <FloatingMentor
        currentTopic={topic}
        userInterest={profile.primaryInterest}
        isVisible={stage === 'explanation' || stage === 'quiz'}
      />
    </div>
  );
};

export default Learning;
