// FINLIT - Gamification Hook
// Handles XP, Levels, Streaks, and Badges

import { useState, useEffect, useCallback } from 'react';

const XP_ACTIONS = {
  READ_EXPLANATION: 10,
  USE_CHAT: 20,
  QUIZ_COMPLETE: 30,
  PERFECT_QUIZ: 50,
  DAILY_STREAK: 25
};

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000];

const BADGES = {
  FIRST_LESSON: { id: 'first_lesson', name: '🎓 First Lesson', desc: 'Complete your first topic' },
  PERFECT_QUIZ: { id: 'perfect_quiz', name: '🎯 Perfect Score', desc: 'Get 5/5 on a quiz' },
  STREAK_3: { id: 'streak_3', name: '🔥 3-Day Streak', desc: 'Learn 3 days in a row' },
  STREAK_7: { id: 'streak_7', name: '⚡ Week Warrior', desc: '7-day learning streak' },
  LEVEL_5: { id: 'level_5', name: '⭐ Level 5', desc: 'Reach level 5' },
  TOPIC_MASTER: { id: 'topic_master', name: '👑 Topic Master', desc: 'Complete 10 topics' }
};

export const useGamification = () => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  const [xpPopups, setXpPopups] = useState([]);
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [levelUpNotification, setLevelUpNotification] = useState(null);

  // Load gamification data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('finlit_gamification');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setXp(data.xp || 0);
        setLevel(data.level || 1);
        setStreak(data.streak || 0);
        setBadges(data.badges || []);
        setLastLoginDate(data.lastLoginDate || null);

        // Check and update streak
        updateStreak(data.lastLoginDate);
      } catch (error) {
        console.error('Error loading gamification data:', error);
      }
    }
  }, []);

  // Save gamification data to localStorage immediately
  useEffect(() => {
    const data = {
      xp,
      level,
      streak,
      badges,
      lastLoginDate: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('finlit_gamification', JSON.stringify(data));
    console.log('💾 Gamification data saved:', data); // Debug log
  }, [xp, level, streak, badges]);

  // Update streak based on last login
  const updateStreak = (lastLogin) => {
    if (!lastLogin) {
      setStreak(1);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const last = new Date(lastLogin).toISOString().split('T')[0];

    if (today === last) {
      // Same day, don't change streak
      return;
    }

    const dayDiff = Math.floor((new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      // Consecutive day
      setStreak(prev => prev + 1);
      addXP(XP_ACTIONS.DAILY_STREAK, '🔥 Daily Streak Bonus!');
    } else if (dayDiff > 1) {
      // Streak broken
      setStreak(1);
    }
  };

  // Calculate level from XP
  const calculateLevel = (currentXP) => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (currentXP >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  };

  // Get XP needed for next level
  const getXPForNextLevel = () => {
    if (level >= LEVEL_THRESHOLDS.length) {
      return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    }
    return LEVEL_THRESHOLDS[level] - xp;
  };

  // Get progress percentage to next level
  const getLevelProgress = () => {
    if (level >= LEVEL_THRESHOLDS.length) return 100;

    const currentLevelXP = LEVEL_THRESHOLDS[level - 1];
    const nextLevelXP = LEVEL_THRESHOLDS[level];
    const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return Math.min(100, Math.max(0, progress));
  };

  // Add XP with popup notification
  const addXP = (amount, label = '') => {
    setXp(prev => {
      const newXP = prev + amount;
      const newLevel = calculateLevel(newXP);

      if (newLevel > level) {
        setLevel(newLevel);
        showXPPopup(amount, `${label} +${amount} XP • LEVEL UP! 🎉`);
        checkBadgeUnlock('LEVEL_5', newLevel);

        // Trigger level-up modal
        setLevelUpNotification({
          oldLevel: level,
          newLevel: newLevel,
          timestamp: Date.now()
        });

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setLevelUpNotification(null);
        }, 5000);
      } else {
        showXPPopup(amount, label || `+${amount} XP`);
      }

      return newXP;
    });
  };

  // Show XP popup animation
  const showXPPopup = (amount, text) => {
    const id = Date.now() + Math.random();
    setXpPopups(prev => [...prev, { id, amount, text }]);

    setTimeout(() => {
      setXpPopups(prev => prev.filter(p => p.id !== id));
    }, 2000);
  };

  // Award XP for specific actions
  const awardXP = {
    readExplanation: () => addXP(XP_ACTIONS.READ_EXPLANATION, '📚 Read Explanation'),
    useChat: () => addXP(XP_ACTIONS.USE_CHAT, '💬 Used Chat'),
    completeQuiz: (score, total) => {
      const isPerfect = score === total;
      const xpAmount = isPerfect ? XP_ACTIONS.PERFECT_QUIZ : XP_ACTIONS.QUIZ_COMPLETE;
      const label = isPerfect ? '🎯 Perfect Quiz!' : '✅ Quiz Complete';
      addXP(xpAmount, label);

      if (isPerfect) {
        unlockBadge('PERFECT_QUIZ');
      }
    }
  };

  // Unlock a badge
  const unlockBadge = (badgeId) => {
    if (!badges.includes(badgeId) && BADGES[badgeId]) {
      setBadges(prev => [...prev, badgeId]);
      return BADGES[badgeId];
    }
    return null;
  };

  // Check and unlock badge based on condition
  const checkBadgeUnlock = (type, value) => {
    switch (type) {
      case 'LEVEL_5':
        if (value >= 5) unlockBadge('LEVEL_5');
        break;
      case 'FIRST_LESSON':
        unlockBadge('FIRST_LESSON');
        break;
      case 'STREAK_3':
        if (value >= 3) unlockBadge('STREAK_3');
        break;
      case 'STREAK_7':
        if (value >= 7) unlockBadge('STREAK_7');
        break;
      default:
        break;
    }
  };

  // Get all badges with unlock status
  const getAllBadges = () => {
    return Object.entries(BADGES).map(([key, badge]) => ({
      ...badge,
      unlocked: badges.includes(key)
    }));
  };

  // Dismiss level-up notification
  const dismissLevelUp = () => {
    setLevelUpNotification(null);
  };

  return {
    xp,
    level,
    streak,
    badges: getAllBadges(),
    xpPopups,
    levelUpNotification,
    awardXP,
    unlockBadge,
    checkBadgeUnlock,
    getXPForNextLevel,
    getLevelProgress,
    dismissLevelUp
  };
};

export default useGamification;
