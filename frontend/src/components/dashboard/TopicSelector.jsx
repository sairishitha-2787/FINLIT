// FINLIT Topic Selector Modal - Neo-Brutalist Edition
// Allows users to browse and select finance topics

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FINANCE_TOPICS = [
  // Beginner Topics
  { category: 'Basics', topics: ['Budgeting Basics', 'Saving Money', 'Understanding Income', 'Emergency Funds', 'Credit Scores'] },
  // Intermediate Topics
  { category: 'Investing', topics: ['Stock Market 101', 'Mutual Funds', 'Index Funds', 'Bonds', 'Diversification'] },
  // Advanced Topics
  { category: 'Advanced', topics: ['Cryptocurrency', 'Real Estate Investing', 'Tax Optimization', 'Retirement Planning', 'Portfolio Management'] },
  // Debt & Credit
  { category: 'Debt', topics: ['Credit Cards', 'Student Loans', 'Debt Payoff Strategies', 'Good vs Bad Debt', 'Interest Rates'] },
  // Life Skills
  { category: 'Life Skills', topics: ['First Job Finance', 'Moving Out', 'Insurance Basics', 'Side Hustles', 'Negotiating Salary'] },
  // Economics
  { category: 'Economics', topics: ['Inflation', 'Supply & Demand', 'Economic Cycles', 'Interest Rates', 'GDP & Markets'] }
];

const TopicSelector = ({ isOpen, onClose, onSelectTopic }) => {
  const [selectedCategory, setSelectedCategory] = useState('Basics');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter topics based on search
  const filteredTopics = FINANCE_TOPICS.map(cat => ({
    ...cat,
    topics: cat.topics.filter(topic =>
      topic.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.topics.length > 0);

  const handleTopicSelect = (topic) => {
    onSelectTopic(topic);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-brutal-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-brutal-white border-4 border-brutal-black shadow-brutal-lg rounded-none max-w-4xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-brutal-blue border-b-4 border-brutal-black p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-4xl font-black text-brutal-white">
                  BROWSE TOPICS
                </h2>
                <p className="text-brutal-white/90 font-bold mt-1">
                  Pick any topic to start learning
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-4xl font-black text-brutal-white hover:scale-110 transition-transform"
              >
                ×
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search topics..."
                className="w-full border-4 border-brutal-black rounded-none px-4 py-3 font-bold text-brutal-black placeholder-brutal-black/40 focus:outline-none bg-brutal-white"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                🔍
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="border-b-4 border-brutal-black bg-brutal-bg p-4">
            <div className="flex gap-2 overflow-x-auto">
              {FINANCE_TOPICS.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`px-4 py-2 border-4 border-brutal-black rounded-none font-black text-sm whitespace-nowrap transition-all ${
                    selectedCategory === cat.category
                      ? 'bg-brutal-pink shadow-brutal-sm'
                      : 'bg-brutal-white shadow-brutal-sm hover:bg-brutal-green'
                  }`}
                >
                  {cat.category.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-brutal-bg">
            {searchTerm ? (
              // Search Results
              <div>
                <p className="text-sm font-black text-brutal-black mb-4">
                  SEARCH RESULTS ({filteredTopics.reduce((acc, cat) => acc + cat.topics.length, 0)})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredTopics.map((cat) =>
                    cat.topics.map((topic, index) => (
                      <TopicCard
                        key={`${cat.category}-${index}`}
                        topic={topic}
                        category={cat.category}
                        onSelect={handleTopicSelect}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : (
              // Category View
              <div>
                {FINANCE_TOPICS.filter(cat => cat.category === selectedCategory).map((cat) => (
                  <div key={cat.category}>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl font-black text-brutal-black">
                        {cat.category.toUpperCase()}
                      </h3>
                      <div className="bg-brutal-black border-2 border-brutal-black px-3 py-1 rounded-none">
                        <span className="text-brutal-green font-black text-sm">
                          {cat.topics.length} TOPICS
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cat.topics.map((topic, index) => (
                        <TopicCard
                          key={index}
                          topic={topic}
                          category={cat.category}
                          onSelect={handleTopicSelect}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {searchTerm && filteredTopics.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl font-black text-brutal-black">
                  NO TOPICS FOUND
                </p>
                <p className="text-brutal-black font-bold mt-2">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const TopicCard = ({ topic, category, onSelect }) => {
  const categoryColors = {
    'Basics': 'bg-brutal-blue',
    'Investing': 'bg-brutal-green',
    'Advanced': 'bg-brutal-pink',
    'Debt': 'bg-brutal-white',
    'Life Skills': 'bg-brutal-green',
    'Economics': 'bg-brutal-pink'
  };

  const categoryIcons = {
    'Basics': '📚',
    'Investing': '📈',
    'Advanced': '🚀',
    'Debt': '💳',
    'Life Skills': '🎯',
    'Economics': '🌍'
  };

  return (
    <motion.button
      whileHover={{ x: 4, y: 4 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(topic)}
      className="bg-brutal-white border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover rounded-none p-4 text-left transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-3xl">{categoryIcons[category]}</span>
        <div className={`${categoryColors[category]} border-2 border-brutal-black px-2 py-1 rounded-none`}>
          <span className="text-xs font-black text-brutal-black">
            {category.toUpperCase()}
          </span>
        </div>
      </div>
      <h4 className="text-lg font-black text-brutal-black leading-tight">
        {topic}
      </h4>
    </motion.button>
  );
};

export default TopicSelector;
