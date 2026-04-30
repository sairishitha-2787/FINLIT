// FINLIT - Interest Domains Configuration
// Exactly 11 interest domains for personalized learning

const interestDomains = [
  {
    id: 'writing',
    name: 'Writing & Storytelling',
    icon: '✍️',
    description: 'Learn finance through narrative structures and writing concepts'
  },
  {
    id: 'movies',
    name: 'Movies & TV Shows',
    icon: '🎬',
    description: 'Understand money through plots, characters, and productions'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: '🎮',
    description: 'Level up your finance knowledge with gaming analogies'
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    description: 'Compose your financial future with music industry insights'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: '👗',
    description: 'Style your finances with fashion industry parallels'
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'Debug your finances with tech concepts and startups'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    description: 'Master finance through entrepreneurship and business strategy'
  },
  {
    id: 'food',
    name: 'Food',
    icon: '🍕',
    description: 'Cook up financial success with culinary comparisons'
  },
  {
    id: 'college',
    name: 'College Life',
    icon: '🎓',
    description: 'Navigate student finances with campus life analogies'
  },
  {
    id: 'art',
    name: 'Art',
    icon: '🎨',
    description: 'Paint your financial picture with artistic concepts'
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    description: 'Score financial wins with sports strategy and team building'
  }
];

// Financial topics organized by difficulty
const financialTopics = {
  beginner: [
    'Budgeting Basics',
    'Saving Money',
    'Understanding Income',
    'Credit vs Debit',
    'Emergency Funds',
    'Simple Interest',
    'Banking Accounts',
    'Tracking Expenses'
  ],
  intermediate: [
    'Compound Interest',
    'Credit Scores',
    'Investing Basics',
    'Stocks & Bonds',
    'Retirement Accounts',
    'Tax Fundamentals',
    'Debt Management',
    'Insurance Types',
    'Real Estate Basics'
  ],
  advanced: [
    'Portfolio Diversification',
    'Asset Allocation',
    'Options Trading',
    'Cryptocurrency',
    'Tax Optimization',
    'Estate Planning',
    'Risk Management',
    'Alternative Investments'
  ]
};

module.exports = {
  interestDomains,
  financialTopics
};
