import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, TrendingUp, Rocket, CreditCard, Target, Globe, X } from 'lucide-react';

const FINANCE_TOPICS = [
  { category: 'Basics',      topics: ['Budgeting Basics', 'Saving Money', 'Understanding Income', 'Emergency Funds', 'Credit Scores'] },
  { category: 'Investing',   topics: ['Stock Market 101', 'Mutual Funds', 'Index Funds', 'Bonds', 'Diversification'] },
  { category: 'Advanced',    topics: ['Cryptocurrency', 'Real Estate Investing', 'Tax Optimization', 'Retirement Planning', 'Portfolio Management'] },
  { category: 'Debt',        topics: ['Credit Cards', 'Student Loans', 'Debt Payoff Strategies', 'Good vs Bad Debt', 'Interest Rates'] },
  { category: 'Life Skills', topics: ['First Job Finance', 'Moving Out', 'Insurance Basics', 'Side Hustles', 'Negotiating Salary'] },
  { category: 'Economics',   topics: ['Inflation', 'Supply & Demand', 'Economic Cycles', 'Interest Rates', 'GDP & Markets'] },
];

const CATEGORY_ICONS = {
  Basics: BookOpen, Investing: TrendingUp, Advanced: Rocket,
  Debt: CreditCard, 'Life Skills': Target, Economics: Globe,
};

const CATEGORY_COLORS = {
  Basics:        { bg: 'bg-blue-50',    text: 'text-blue-600',    badge: 'bg-blue-100 text-blue-700'    },
  Investing:     { bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  Advanced:      { bg: 'bg-violet-50',  text: 'text-violet-600',  badge: 'bg-violet-100 text-violet-700'  },
  Debt:          { bg: 'bg-rose-50',    text: 'text-rose-600',    badge: 'bg-rose-100 text-rose-700'    },
  'Life Skills': { bg: 'bg-amber-50',   text: 'text-amber-600',   badge: 'bg-amber-100 text-amber-700'   },
  Economics:     { bg: 'bg-slate-50',   text: 'text-slate-600',   badge: 'bg-slate-100 text-slate-700'   },
};

const TopicSelector = ({ isOpen, onClose, onSelectTopic }) => {
  const [selectedCategory, setSelectedCategory] = useState('Basics');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTopics = FINANCE_TOPICS.map(cat => ({
    ...cat,
    topics: cat.topics.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.topics.length > 0);

  const handleTopicSelect = (topic) => { onSelectTopic(topic); onClose(); };

  if (!isOpen) return null;

  const totalResults = filteredTopics.reduce((acc, cat) => acc + cat.topics.length, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white/96 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3A8DFF] to-[#2563EB] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-white">Browse Topics</h2>
                <p className="text-white/80 text-sm font-medium mt-0.5">
                  Pick any topic to start learning
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search topics..."
                className="w-full bg-white/15 placeholder-white/50 text-white border border-white/25 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:border-white/50 focus:bg-white/22 transition-all"
              />
              <Search size={16} strokeWidth={2} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3">
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-thin">
              {FINANCE_TOPICS.map((cat) => {
                const colors = CATEGORY_COLORS[cat.category];
                const isActive = selectedCategory === cat.category;
                return (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? `${colors.bg} ${colors.text} shadow-sm`
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                    }`}
                  >
                    {cat.category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topics Grid */}
          <div className="flex-1 overflow-y-auto p-5 bg-white/90">
            {searchTerm ? (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  {totalResults} result{totalResults !== 1 ? 's' : ''}
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
              <div>
                {FINANCE_TOPICS.filter(cat => cat.category === selectedCategory).map((cat) => {
                  const colors = CATEGORY_COLORS[cat.category];
                  return (
                    <div key={cat.category}>
                      <div className="flex items-center gap-2.5 mb-4">
                        <h3 className="text-lg font-black text-slate-900">{cat.category}</h3>
                        <span className={`${colors.badge} text-xs font-bold px-2.5 py-0.5 rounded-full`}>
                          {cat.topics.length} topics
                        </span>
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
                  );
                })}
              </div>
            )}

            {searchTerm && filteredTopics.length === 0 && (
              <div className="text-center py-16">
                <Search size={48} strokeWidth={1.5} className="mx-auto mb-4 text-slate-200" />
                <p className="text-lg font-bold text-slate-700">No topics found</p>
                <p className="text-slate-400 text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const TopicCard = ({ topic, category, onSelect }) => {
  const Icon = CATEGORY_ICONS[category] || BookOpen;
  const colors = CATEGORY_COLORS[category];
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(topic)}
      className="bg-white border border-slate-200/80 hover:border-blue-200 hover:shadow-sm rounded-xl p-4 text-left transition-all group w-full"
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className={`w-9 h-9 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <Icon size={18} strokeWidth={1.8} className={colors.text} />
        </div>
        <span className={`${colors.badge} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
          {category}
        </span>
      </div>
      <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
        {topic}
      </h4>
    </motion.button>
  );
};

export default TopicSelector;
