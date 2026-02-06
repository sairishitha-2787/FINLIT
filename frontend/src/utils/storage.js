// FINLIT localStorage utilities

import { STORAGE_KEYS } from './constants';

// Get user profile from localStorage
export const getProfile = () => {
  try {
    const profile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error reading profile from localStorage:', error);
    return null;
  }
};

// Save user profile to localStorage
export const saveProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving profile to localStorage:', error);
    return false;
  }
};

// Update specific profile fields
export const updateProfile = (updates) => {
  try {
    const currentProfile = getProfile() || {};
    const updatedProfile = { ...currentProfile, ...updates };
    return saveProfile(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};

// Get user progress (completed topics, scores, etc.)
export const getProgress = () => {
  try {
    const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return progress ? JSON.parse(progress) : [];
  } catch (error) {
    console.error('Error reading progress from localStorage:', error);
    return [];
  }
};

// Save progress for a completed topic
export const saveProgress = (topicData) => {
  try {
    const currentProgress = getProgress();
    const newProgress = [
      ...currentProgress,
      {
        ...topicData,
        completedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
    return true;
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
    return false;
  }
};

// Get completed topics list
export const getCompletedTopics = () => {
  try {
    const progress = getProgress();
    return progress.map(item => item.topic);
  } catch (error) {
    console.error('Error getting completed topics:', error);
    return [];
  }
};

// Check if onboarding is complete
export const isOnboardingComplete = () => {
  try {
    const complete = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return complete === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

// Mark onboarding as complete
export const setOnboardingComplete = (complete = true) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, complete.toString());
    return true;
  } catch (error) {
    console.error('Error setting onboarding status:', error);
    return false;
  }
};

// Clear all FINLIT data (for testing or reset)
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Get user stats
export const getUserStats = () => {
  try {
    const progress = getProgress();
    const profile = getProfile();

    return {
      totalTopicsCompleted: progress.length,
      averageScore: progress.length > 0
        ? progress.reduce((sum, item) => sum + (item.score || 0), 0) / progress.length
        : 0,
      difficulty: profile?.difficulty || 'beginner',
      primaryInterest: profile?.primaryInterest || 'general'
    };
  } catch (error) {
    console.error('Error calculating user stats:', error);
    return {
      totalTopicsCompleted: 0,
      averageScore: 0,
      difficulty: 'beginner',
      primaryInterest: 'general'
    };
  }
};
