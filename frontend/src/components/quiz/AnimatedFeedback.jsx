// FINLIT Animated Feedback Component - Neo-Brutalist Edition
// Shows brutal honest feedback with GIF reactions

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCorrectGif, getWrongGif } from '../../services/api';
import LoadingAnimation from '../shared/LoadingAnimation';

const AnimatedFeedback = ({
  isCorrect,
  explanation,
  brutalHonestFeedback,
  correctAnswer,
  userAnswer,
  options,
  onNext,
  isLastQuestion
}) => {
  const [gif, setGif] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGif();
  }, [isCorrect]);

  const fetchGif = async () => {
    try {
      setLoading(true);
      const response = isCorrect ? await getCorrectGif() : await getWrongGif();
      if (response.success) {
        setGif(response.gif);
      }
    } catch (error) {
      console.error('Error fetching GIF:', error);
    } finally {
      setLoading(false);
    }
  };

  const answerLabels = ['A', 'B', 'C', 'D'];
  const correctAnswerText = options[answerLabels.indexOf(correctAnswer)];
  const userAnswerText = options[answerLabels.indexOf(userAnswer)];

  // Use brutal honest feedback if available, fallback to regular explanation
  const feedbackText = brutalHonestFeedback || explanation || 'Keep pushing forward!';

  return (
    <div className="space-y-6">
      {/* Result Card - Neo-Brutalist */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`
          border-4 border-brutal-black shadow-brutal rounded-none p-8 text-center
          ${isCorrect ? 'bg-brutal-green' : 'bg-brutal-pink'}
        `}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="text-8xl mb-4"
        >
          {isCorrect ? '✅' : '❌'}
        </motion.div>

        <h2 className="text-4xl font-black text-brutal-black mb-3">
          {isCorrect ? 'CRUSHED IT! 🎉' : 'NOT QUITE!'}
        </h2>

        <p className="text-xl font-bold text-brutal-black">
          {isCorrect
            ? 'You got it right!'
            : `Correct answer: ${correctAnswer}`
          }
        </p>
      </motion.div>

      {/* GIF Display */}
      {loading ? (
        <div className="py-8">
          <LoadingAnimation message="Loading reaction..." />
        </div>
      ) : gif ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-4 border-brutal-black shadow-brutal rounded-none overflow-hidden bg-brutal-white"
        >
          <img
            src={gif.url}
            alt={gif.title || 'Feedback GIF'}
            className="w-full max-h-80 object-contain"
          />
        </motion.div>
      ) : null}

      {/* Brutal Honest Feedback Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-brutal-white border-4 border-brutal-black shadow-brutal rounded-none p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">💭</span>
          <h3 className="text-2xl font-black text-brutal-black">
            BRUTAL HONEST FEEDBACK
          </h3>
        </div>

        {!isCorrect && (
          <div className="mb-4 p-4 bg-brutal-bg border-2 border-brutal-black rounded-none">
            <p className="text-brutal-black font-bold">
              <span className="font-black text-red-600">Your answer:</span> {userAnswerText}
            </p>
            <p className="text-brutal-black font-bold mt-2">
              <span className="font-black text-brutal-green">Correct answer:</span> {correctAnswerText}
            </p>
          </div>
        )}

        <div className="bg-brutal-black border-2 border-brutal-black rounded-none p-4">
          <p className="text-brutal-white text-lg leading-relaxed font-medium whitespace-pre-wrap">
            {feedbackText}
          </p>
        </div>

        {!isCorrect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-4 bg-brutal-blue border-2 border-brutal-black rounded-none"
          >
            <p className="text-brutal-white font-black text-center">
              💪 MISTAKES = LEARNING. You're leveling up right now. Keep going!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ x: 4, y: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="bg-brutal-green border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover px-12 py-4 rounded-none font-black text-2xl text-brutal-black"
        >
          {isLastQuestion ? 'SEE RESULTS 🎉' : 'NEXT QUESTION →'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AnimatedFeedback;
