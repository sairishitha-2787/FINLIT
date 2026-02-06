// FINLIT - Neo-Brutalist Quiz Card Component
// Question display with stark design

import React from 'react';
import { motion } from 'framer-motion';

const QuizCard = ({ question, questionNumber, selectedAnswer, onSelectAnswer, totalQuestions }) => {
  const answerLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal rounded-none p-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="bg-brutal-blue border-2 border-brutal-black px-4 py-2 rounded-none">
          <span className="font-black text-brutal-white">
            Q{questionNumber}/{totalQuestions}
          </span>
        </div>
        <div className="flex gap-2">
          {[...Array(totalQuestions)].map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 border-2 border-brutal-black rounded-none ${
                index + 1 === questionNumber ? 'bg-brutal-blue' : 'bg-brutal-bg'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-black text-brutal-black leading-tight">
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
      whileHover={{ x: isSelected ? 0 : 4, y: isSelected ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        p-5 border-4 border-brutal-black cursor-pointer transition-all rounded-none
        ${isSelected
          ? 'bg-brutal-pink shadow-brutal-hover'
          : 'bg-brutal-bg shadow-brutal hover:shadow-brutal-hover'
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Label Circle */}
        <div
          className={`
            w-12 h-12 border-4 border-brutal-black rounded-none flex items-center justify-center font-black text-xl
            ${isSelected ? 'bg-brutal-white' : 'bg-brutal-white'}
          `}
        >
          {label}
        </div>

        {/* Option Text */}
        <div className="flex-1">
          <p className="text-brutal-black font-bold text-lg">
            {option}
          </p>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 bg-brutal-green border-2 border-brutal-black rounded-none flex items-center justify-center"
          >
            <span className="text-sm">✓</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default QuizCard;
