// FINLIT - Neo-Brutalist Quiz Environment
// With Confetti and Gamification

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import QuizCard from './QuizCard';
import AnimatedFeedback from './AnimatedFeedback';
import useGamification from '../../hooks/useGamification';

const NeoQuizEnvironment = ({ questions, topic, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const { awardXP } = useGamification();

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

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (isLastQuestion) {
      // Quiz complete - award XP and trigger confetti
      const finalScore = score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0);
      awardXP.completeQuiz(finalScore, totalQuestions);

      // Confetti celebration
      if (finalScore === totalQuestions) {
        // Perfect score - epic confetti
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#70FFCA', '#FF90E8', '#3352FF']
        });
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#70FFCA', '#FF90E8', '#3352FF']
          });
        }, 250);
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#70FFCA', '#FF90E8', '#3352FF']
          });
        }, 400);
      } else if (finalScore >= 3) {
        // Good score - normal confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#70FFCA', '#FF90E8', '#3352FF']
        });
      }

      onComplete(finalScore, totalQuestions);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;

  // Get current level info
  const getCurrentLevel = () => {
    const level = currentQuestion.level || 1;
    const levelName = currentQuestion.levelName || 'UNDERSTANDING';
    const levelColors = {
      1: { bg: 'bg-brutal-blue', text: 'text-brutal-white', icon: '📖' },
      2: { bg: 'bg-brutal-pink', text: 'text-brutal-black', icon: '🧮' },
      3: { bg: 'bg-brutal-green', text: 'text-brutal-black', icon: '⚔️' }
    };
    return { level, levelName, ...levelColors[level] };
  };

  const currentLevel = getCurrentLevel();

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
              const icons = ['📖', '🧮', '⚔️'];
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
                  <div className="text-2xl mb-1">{icons[lvl - 1]}</div>
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
          <span className="text-3xl">{currentLevel.icon}</span>
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
              isLastQuestion={isLastQuestion}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeoQuizEnvironment;
