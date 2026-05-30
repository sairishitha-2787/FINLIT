// FINLIT - Interest Domains Configuration
// 9 interest domains (food and movies removed — no built domain for those)

const interestDomains = [
  {
    id: 'gaming',
    name: 'Gaming',
    icon: 'Gamepad2',
    description: 'Level up your finance knowledge with gaming analogies'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: 'Shirt',
    description: 'Style your finances with fashion industry parallels'
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: 'Activity',
    description: 'Score financial wins with sports strategy and team building'
  },
  {
    id: 'music',
    name: 'Music',
    icon: 'Music',
    description: 'Compose your financial future with music industry insights'
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: 'Code2',
    description: 'Debug your finances with tech concepts and startups'
  },
  {
    id: 'business',
    name: 'Business',
    icon: 'Briefcase',
    description: 'Master finance through entrepreneurship and business strategy'
  },
  {
    id: 'writing',
    name: 'Writing & Storytelling',
    icon: 'PenLine',
    description: 'Learn finance through narrative structures and writing concepts'
  },
  {
    id: 'college',
    name: 'College Life',
    icon: 'GraduationCap',
    description: 'Navigate student finances with campus life analogies'
  },
  {
    id: 'art',
    name: 'Art',
    icon: 'Palette',
    description: 'Paint your financial picture with artistic concepts'
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
