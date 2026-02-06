// FINLIT Question Component
// Displays a single quiz question with multiple choice options

import React from 'react';
import { motion } from 'framer-motion';

const Question = ({ question, questionNumber, selectedAnswer, onSelectAnswer }) => {
  const answerLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-dark-light/80 backdrop-blur-sm rounded-2xl p-8 border border-primary/20">
      {/* Question Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="text-sm text-gray-400 mb-3">
          Question {questionNumber}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {question.question}
        </h2>
      </motion.div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.options.map((option, index) => {
          const answerLabel = answerLabels[index];
          const isSelected = selectedAnswer === answerLabel;

          return (
            <AnswerOption
              key={index}
              label={answerLabel}
              option={option}
              isSelected={isSelected}
              onSelect={() => onSelectAnswer(answerLabel)}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};

const AnswerOption = ({ label, option, isSelected, onSelect, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        p-5 rounded-xl cursor-pointer transition-all duration-300 border-2
        ${isSelected
          ? 'bg-primary border-primary shadow-lg shadow-primary/50'
          : 'bg-dark border-gray-700 hover:border-primary/50'
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Answer Label Circle */}
        <div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
            ${isSelected
              ? 'bg-white text-primary'
              : 'bg-primary/20 text-primary'
            }
          `}
        >
          {label}
        </div>

        {/* Answer Text */}
        <div className="flex-1">
          <p className="text-white font-medium text-lg">
            {option}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Question;
