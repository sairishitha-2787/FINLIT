// FINLIT API Service
// Handles all backend communication

import axios from 'axios';
import { supabase } from '../config/supabase';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Supabase access token to every request
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 — session expired → sign out and redirect to login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// API Methods

// Get all interest domains
export const getInterests = async () => {
  try {
    const response = await api.get('/interests');
    return response.data;
  } catch (error) {
    console.error('Error fetching interests:', error);
    throw error;
  }
};

// Get financial topics by difficulty
export const getTopics = async (difficulty = null) => {
  try {
    const params = difficulty ? { difficulty } : {};
    const response = await api.get('/topics', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

// Get personalized deep explanation — 4-section, domain-vocabulary-enforced
// variation 0 = direct analogy, 1 = unexpected angle, 2 = habit/system focus
export const getExplanation = async (topic, interest, difficulty = 'beginner', variation = 0) => {
  try {
    const response = await api.post('/explain', {
      topic,
      interest,
      difficulty,
      variation,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting explanation:', error);
    throw error;
  }
};

// Generate quiz questions for a topic
export const getQuiz = async (topic, interest, difficulty = 'beginner') => {
  try {
    const response = await api.post('/quiz', {
      topic,
      interest,
      difficulty
    });
    return response.data;
  } catch (error) {
    console.error('Error getting quiz:', error);
    throw error;
  }
};

// Get GIF for correct answer
export const getCorrectGif = async () => {
  try {
    const response = await api.get('/gifs/correct');
    return response.data;
  } catch (error) {
    console.error('Error getting correct GIF:', error);
    throw error;
  }
};

// Get GIF for wrong answer
export const getWrongGif = async () => {
  try {
    const response = await api.get('/gifs/wrong');
    return response.data;
  } catch (error) {
    console.error('Error getting wrong GIF:', error);
    throw error;
  }
};

// Get celebration GIF
export const getCelebrationGif = async () => {
  try {
    const response = await api.get('/gifs/celebration');
    return response.data;
  } catch (error) {
    console.error('Error getting celebration GIF:', error);
    throw error;
  }
};

// Smart personalized recommendations — returns enriched objects with reasons
export const getSmartRecommendations = async ({
  completedTopics = [],
  interest = 'general',
  difficulty = 'beginner',
  avgScore = 0,
  goals = [],
  shuffle = false,
  limit = 5,
} = {}) => {
  try {
    const response = await api.post('/recommend', {
      completedTopics, interest, difficulty, avgScore, goals, shuffle, limit,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting smart recommendations:', error);
    throw error;
  }
};

// Single best next topic — lightweight, for widgets
export const getNextTopicRecommendation = async ({
  completedTopics = [],
  interest = 'general',
  difficulty = 'beginner',
  avgScore = 0,
} = {}) => {
  try {
    const params = {
      completedTopics: completedTopics.join(','),
      interest,
      difficulty,
      avgScore,
    };
    const response = await api.get('/recommend/next-topic', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting next topic:', error);
    throw error;
  }
};

// Legacy: kept for backward compatibility (used internally, passes difficulty+topics)
export const getRecommendations = async (difficulty, completedTopics = []) => {
  try {
    const response = await api.post('/recommend', { difficulty, completedTopics });
    // Normalize: new API returns objects, old callers expect string array
    const data = response.data;
    if (data.recommendations?.[0]?.name) {
      return {
        ...data,
        recommendations: data.recommendations.map(r => r.name),
      };
    }
    return data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

// Generate a 5-question scenario quiz (template-first, Groq fallback)
export const generateScenarioQuiz = async (topic, interest, difficulty = 'beginner', variant = 0) => {
  try {
    const response = await api.post('/quiz/generate', {
      topic,
      domain: interest,
      difficulty,
      variant,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating scenario quiz:', error);
    throw error;
  }
};

// Evaluate a Level 3 Boss Fight open-ended answer via Groq
export const evaluateOpenEnded = async ({
  topic,
  domain,
  scenarioContext = '',
  question,
  evaluationCriteria = [],
  userAnswer,
}) => {
  try {
    const response = await api.post('/quiz/evaluate-open-ended', {
      topic,
      domain,
      scenarioContext,
      question,
      evaluationCriteria,
      userAnswer,
    });
    return response.data;
  } catch (error) {
    console.error('Error evaluating open-ended answer:', error);
    throw error;
  }
};

// Adaptive re-explanation — triggered by comprehension check failures or inline Q&A
export const getAdaptiveExplanation = async ({
  topic,
  domain,
  confusionPoint,
  previousExplanation = '',
  question = null,
}) => {
  try {
    const response = await api.post('/explain/adaptive', {
      topic,
      domain,
      confusionPoint,
      previousExplanation,
      question,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting adaptive explanation:', error);
    throw error;
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

export default api;
