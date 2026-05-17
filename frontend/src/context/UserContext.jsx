import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchProfile, saveProfile, updateProfileFields } from '../services/profileService';
import {
  getProgress,
  saveProgress,
  getCompletedTopics,
  getUserStats
} from '../utils/storage';
import { saveTopicProgress, fetchUserProgress } from '../services/progressService';

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
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reload profile whenever the logged-in user changes
  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setProgress([]);
      setCompletedTopics([]);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data, error: fetchError }, { data: progressRows }] = await Promise.all([
        fetchProfile(user.id),
        fetchUserProgress(user.id),
      ]);

      if (fetchError) throw fetchError;

      const normalized = data ? normalizeProfile(data) : null;
      if (normalized && !normalized.primaryInterest) {
        const cached = localStorage.getItem(`finlit_interest_${user.id}`);
        if (cached) normalized.primaryInterest = cached;
      }
      setProfile(normalized);
      setProgress(getProgress());

      // Supabase is the sole source of truth — never merge with localStorage
      // (localStorage is not user-scoped, so merging causes cross-account contamination)
      const supabaseTopics = progressRows ? progressRows.map(r => r.topic) : [];
      setCompletedTopics(supabaseTopics);
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
      // Belt-and-suspenders: persist completion flag so the user never gets
      // bounced back to onboarding if the DB fetch later returns null
      localStorage.setItem(`finlit_ob_done_${user.id}`, '1');
      // Cache the interest so loadProfile can recover if Supabase returns NULL
      if (profileData.primaryInterest) {
        localStorage.setItem(`finlit_interest_${user.id}`, profileData.primaryInterest.toLowerCase());
      }
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
      if (updates.primaryInterest) {
        localStorage.setItem(`finlit_interest_${user.id}`, updates.primaryInterest.toLowerCase());
      }
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
    saveProgress(newItem);
    setProgress((prev) => [...prev, newItem]);
    setCompletedTopics(prev => {
      if (prev.includes(topicData.topic)) return prev;
      return [...prev, topicData.topic];
    });

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

  // Onboarding is complete when:
  // (a) the loaded profile has a real interest set, OR
  // (b) localStorage says this user has already done onboarding (handles DB fetch hiccups)
  const localFlag = user ? !!localStorage.getItem(`finlit_ob_done_${user.id}`) : false;
  const onboardingComplete = localFlag || !!(profile && profile.primaryInterest);

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
