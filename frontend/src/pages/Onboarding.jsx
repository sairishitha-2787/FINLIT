// FINLIT Onboarding Page
// 5-question flow to personalize user experience

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { ONBOARDING_QUESTIONS } from '../utils/constants';
import InterestSelector from '../components/onboarding/InterestSelector';
import Button from '../components/shared/Button';
import ProgressBar from '../components/shared/ProgressBar';

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
  const totalSteps = ONBOARDING_QUESTIONS.length;
  const isLastStep = currentStep === totalSteps - 1;

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    const currentAnswer = answers[currentQuestion.id];

    if (!currentAnswer) {
      alert('Please provide an answer before continuing');
      return;
    }

    if (isLastStep) {
      // Complete onboarding
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
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to FINLIT
          </h1>
          <p className="text-gray-300">
            Let's personalize your learning experience
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <ProgressBar current={currentStep + 1} total={totalSteps} />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-dark-light/80 backdrop-blur-sm rounded-2xl p-8 border border-primary/20 mb-6"
          >
            <QuestionContent
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onAnswer={(value) => handleAnswer(currentQuestion.id, value)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4 justify-between"
        >
          <Button
            onClick={handleBack}
            variant="ghost"
            disabled={currentStep === 0}
          >
            ← Back
          </Button>

          <Button
            onClick={handleNext}
            variant="primary"
            disabled={!answers[currentQuestion.id]}
          >
            {isLastStep ? 'Complete Setup 🎉' : 'Next →'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

const QuestionContent = ({ question, answer, onAnswer }) => {
  if (question.type === 'text') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {question.question}
        </h2>
        <input
          type="text"
          value={answer || ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder={question.placeholder}
          className="w-full px-6 py-4 bg-dark rounded-lg text-white text-lg border-2 border-gray-700 focus:border-primary focus:outline-none transition-all"
          autoFocus
        />
      </div>
    );
  }

  if (question.type === 'interest-selector') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {question.question}
        </h2>
        <p className="text-gray-400 mb-6">{question.description}</p>
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
        <h2 className="text-2xl font-bold text-white mb-6">
          {question.question}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onAnswer(option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                p-6 rounded-xl cursor-pointer transition-all duration-300 border-2
                ${answer === option.value
                  ? 'bg-primary border-primary shadow-lg shadow-primary/50'
                  : 'bg-dark-light border-gray-700 hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">
                    {option.label}
                  </h3>
                  {option.description && (
                    <p className="text-sm text-gray-400">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Onboarding;
