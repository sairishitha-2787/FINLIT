// FINLIT API Service
// Handles all backend communication

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
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

// Get personalized explanation for a topic
export const getExplanation = async (topic, interest, difficulty = 'beginner') => {
  try {
    const response = await api.post('/explain', {
      topic,
      interest,
      difficulty
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

// Get topic recommendations
export const getRecommendations = async (difficulty, completedTopics = []) => {
  try {
    const response = await api.post('/recommend', {
      difficulty,
      completedTopics
    });
    return response.data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
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
