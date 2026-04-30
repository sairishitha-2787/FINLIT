import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchProfile, saveProfile, updateProfileFields } from '../services/profileService';
import {
  getProgress,
  saveProgress,
  getCompletedTopics,
  getUserStats
} from '../utils/storage';
import { saveTopicProgress } from '../services/progressService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

// DB columns → internal profile shape that components already rely on
const normalizeProfile = (row) => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  primaryInterest: row.primary_interest || '',
  situation: row.current_situation || '',
  challenge: row.financial_challenge || '',
  difficulty: row.difficulty_level || 'beginner',
  goals: row.goals || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Internal profile shape → actual DB column names
const toDbFields = (profile) => ({
  name: profile.name,
  primary_interest: profile.primaryInterest,
  current_situation: profile.situation,
  financial_challenge: profile.challenge,
  difficulty_level: profile.difficulty,
  goals: profile.goals || [],
});

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reload profile whenever the logged-in user changes
  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setProgress(getProgress());
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await fetchProfile(user.id); // fetchProfile queries by user_id
      if (fetchError) throw fetchError;
      setProfile(data ? normalizeProfile(data) : null);
      setProgress(getProgress()); // progress stays in localStorage until Session 4
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // Called at the end of onboarding — persists to Supabase
  const completeOnboarding = async (profileData) => {
    try {
      setError(null);
      const fields = toDbFields(profileData);
      const { data, error: saveError } = await saveProfile(user.id, fields);
      if (saveError) {
        console.error('Supabase save error:', saveError);
        throw saveError;
      }
      setProfile(normalizeProfile(data));
      return { success: true };
    } catch (err) {
      console.error('Error saving onboarding profile:', err);
      // Surface the real Supabase message so it's easy to diagnose
      const msg = err.message || 'Unable to save profile. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Partial update — used by any component that needs to edit profile fields
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      const merged = { ...(profile || {}), ...updates };
      const { data, error: updateError } = await updateProfileFields(user.id, toDbFields(merged));
      if (updateError) throw updateError;
      setProfile(normalizeProfile(data));
      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { success: false, error: err.message };
    }
  };

  const addTopicProgress = (topicData) => {
    const newItem = {
      topic: topicData.topic,
      score: topicData.score,
      totalQuestions: topicData.totalQuestions,
      difficulty: topicData.difficulty,
      completedAt: new Date().toISOString(),
    };
    // Persist locally for immediate stats (localStorage)
    saveProgress(newItem);
    setProgress((prev) => [...prev, newItem]);

    // Also persist to Supabase if logged in
    if (user) {
      saveTopicProgress(user.id, {
        topic: topicData.topic,
        score: topicData.score,
        totalQuestions: topicData.totalQuestions,
      }).then(({ error }) => {
        if (error) console.error('Progress save error:', error.message);
      });
    }
    return true;
  };

  const resetUserData = () => {
    setProfile(null);
    setProgress([]);
  };

  const loadUserData = () => {
    if (user) loadProfile();
  };

  // Onboarding is complete when the profile exists and has a real interest (not the 'general' placeholder)
  const onboardingComplete = !!(
    profile &&
    profile.primaryInterest &&
    profile.primaryInterest !== 'general'
  );

  const completedTopics = getCompletedTopics();
  const stats = getUserStats();

  return (
    <UserContext.Provider value={{
      profile,
      progress,
      onboardingComplete,
      loading,
      error,
      completedTopics,
      stats,
      completeOnboarding,
      updateUserProfile,
      addTopicProgress,
      resetUserData,
      loadUserData,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
