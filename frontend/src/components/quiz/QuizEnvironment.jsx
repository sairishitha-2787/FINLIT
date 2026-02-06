// FINLIT Quiz Environment Component
// Main quiz interface with question flow and GIF feedback

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Question from './Question';
import AnimatedFeedback from './AnimatedFeedback';
import Button from '../shared/Button';
import ProgressBar from '../shared/ProgressBar';

const QuizEnvironment = ({ questions, topic, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return; // Prevent changing answer during feedback
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions([
      ...answeredQuestions,
      {
        question: currentQuestion.question,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect
      }
    ]);

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (isLastQuestion) {
      // Quiz complete
      onComplete(score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0), totalQuestions);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          showLabel={true}
        />
        <p className="text-center text-gray-400 text-sm mt-2">
          Current Score: {score} / {currentQuestionIndex + (showFeedback ? 1 : 0)}
        </p>
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
            <Question
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleAnswerSelect}
            />

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                variant="primary"
                size="lg"
              >
                Submit Answer
              </Button>
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

export default QuizEnvironment;
