// FINLIT User Context
// Global state management for user data

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getProfile,
  saveProfile,
  updateProfile,
  getProgress,
  saveProgress,
  isOnboardingComplete,
  setOnboardingComplete,
  getCompletedTopics,
  getUserStats
} from '../utils/storage';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState([]);
  const [onboardingComplete, setOnboardingCompleteState] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const savedProfile = getProfile();
      const savedProgress = getProgress();
      const onboardingStatus = isOnboardingComplete();

      setProfile(savedProfile);
      setProgress(savedProgress);
      setOnboardingCompleteState(onboardingStatus);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = (updates) => {
    try {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      saveProfile(updatedProfile);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  // Complete onboarding
  const completeOnboarding = (profileData) => {
    try {
      setProfile(profileData);
      saveProfile(profileData);
      setOnboardingComplete(true);
      setOnboardingCompleteState(true);
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  };

  // Add completed topic to progress
  const addTopicProgress = (topicData) => {
    try {
      const newProgressItem = {
        topic: topicData.topic,
        score: topicData.score,
        totalQuestions: topicData.totalQuestions,
        difficulty: topicData.difficulty,
        completedAt: new Date().toISOString()
      };

      saveProgress(newProgressItem);
      setProgress([...progress, newProgressItem]);
      return true;
    } catch (error) {
      console.error('Error saving topic progress:', error);
      return false;
    }
  };

  // Get completed topics list
  const completedTopics = getCompletedTopics();

  // Get user statistics
  const stats = getUserStats();

  // Reset all user data (for testing)
  const resetUserData = () => {
    try {
      setProfile(null);
      setProgress([]);
      setOnboardingCompleteState(false);
      setOnboardingComplete(false);
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error resetting user data:', error);
      return false;
    }
  };

  const value = {
    // State
    profile,
    progress,
    onboardingComplete,
    loading,
    completedTopics,
    stats,

    // Methods
    updateUserProfile,
    completeOnboarding,
    addTopicProgress,
    resetUserData,
    loadUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
