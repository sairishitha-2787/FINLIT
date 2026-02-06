// FINLIT Constants

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const STORAGE_KEYS = {
  PROFILE: 'finlit_profile',
  PROGRESS: 'finlit_progress',
  ONBOARDING_COMPLETE: 'finlit_onboarding_complete'
};

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

export const ONBOARDING_QUESTIONS = [
  {
    id: 'name',
    question: "What's your name?",
    type: 'text',
    placeholder: 'Enter your name'
  },
  {
    id: 'interest',
    question: 'What are you most interested in?',
    type: 'interest-selector',
    description: 'We\'ll use this to make finance relatable to you!'
  },
  {
    id: 'situation',
    question: 'What\'s your current situation?',
    type: 'multiple-choice',
    options: [
      { value: 'student', label: 'Student', icon: '🎓' },
      { value: 'working', label: 'Working Professional', icon: '💼' },
      { value: 'business', label: 'Business Owner', icon: '🚀' },
      { value: 'other', label: 'Other', icon: '✨' }
    ]
  },
  {
    id: 'challenge',
    question: 'What\'s your biggest financial challenge?',
    type: 'multiple-choice',
    options: [
      { value: 'debt', label: 'Managing Debt', icon: '💳' },
      { value: 'saving', label: 'Saving Money', icon: '💰' },
      { value: 'investing', label: 'Learning to Invest', icon: '📈' },
      { value: 'budgeting', label: 'Budgeting', icon: '📊' },
      { value: 'understanding', label: 'Understanding Finance', icon: '🤔' }
    ]
  },
  {
    id: 'knowledge',
    question: 'How would you rate your financial knowledge?',
    type: 'multiple-choice',
    options: [
      { value: 'beginner', label: 'Just Starting Out', icon: '🌱', description: 'I\'m new to personal finance' },
      { value: 'intermediate', label: 'Some Experience', icon: '🌿', description: 'I know the basics' },
      { value: 'advanced', label: 'Pretty Confident', icon: '🌳', description: 'I want to level up' }
    ]
  }
];

export const QUIZ_CONFIG = {
  QUESTIONS_PER_QUIZ: 5,
  PASSING_SCORE: 3
};

export const ANIMATION_VARIANTS = {
  pageInitial: { opacity: 0, y: 20 },
  pageAnimate: { opacity: 1, y: 0 },
  pageExit: { opacity: 0, y: -20 },
  pageTransition: { duration: 0.3 }
};
