// FINLIT Explanation Display Component - Neo-Brutalist Edition
// HIGH CONTRAST: Black text on white/colored backgrounds

import React from 'react';
import { motion } from 'framer-motion';

const ExplanationDisplay = ({ explanation, topic, interest }) => {
  const sections = [
    {
      icon: '🎯',
      title: 'THE ANALOGY',
      content: explanation.analogy,
      bgColor: 'bg-brutal-blue',
      textColor: 'text-brutal-white'
    },
    {
      icon: '💡',
      title: 'WHAT THIS ACTUALLY MEANS',
      content: explanation.meaning,
      bgColor: 'bg-brutal-white',
      textColor: 'text-brutal-black'
    },
    {
      icon: '🌍',
      title: 'REAL-LIFE EXAMPLE',
      content: explanation.example,
      bgColor: 'bg-brutal-pink',
      textColor: 'text-brutal-black'
    },
    {
      icon: '🔑',
      title: 'KEY TAKEAWAY',
      content: explanation.takeaway,
      bgColor: 'bg-brutal-green',
      textColor: 'text-brutal-black'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brutal-white border-4 border-brutal-black shadow-brutal rounded-none p-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">🧠</span>
          <div>
            <h2 className="text-2xl font-black text-brutal-black">
              {topic}
            </h2>
            <p className="text-brutal-black font-bold text-sm">
              Explained through {interest}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Explanation Sections */}
      {sections.map((section, index) => (
        <ExplanationSection
          key={section.title}
          section={section}
          index={index}
        />
      ))}
    </div>
  );
};

const ExplanationSection = ({ section, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 4, y: 4 }}
      className={`
        ${section.bgColor}
        border-4 border-brutal-black
        shadow-brutal
        hover:shadow-brutal-hover
        rounded-none
        p-6
        transition-all
        duration-200
      `}
    >
      <div className="flex items-start gap-4">
        <div className="text-5xl">
          {section.icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-2xl font-black mb-4 ${section.textColor}`}>
            {section.title}
          </h3>
          <p className={`${section.textColor} text-lg leading-relaxed font-medium whitespace-pre-wrap`}>
            {section.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ExplanationDisplay;
