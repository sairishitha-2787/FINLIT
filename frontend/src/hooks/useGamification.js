import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const XP_ACTIONS = {
  READ_EXPLANATION: 10,
  USE_CHAT: 20,
  QUIZ_COMPLETE: 30,
  PERFECT_QUIZ: 50,
  DAILY_STREAK: 25,
  BOSS_FIGHT: 150,
};

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000];

const BADGES = {
  FIRST_LESSON: { id: 'first_lesson', name: 'First Lesson',  icon: 'GraduationCap', desc: 'Complete your first topic' },
  PERFECT_QUIZ: { id: 'perfect_quiz', name: 'Perfect Score',  icon: 'Target',        desc: 'Get 5/5 on a quiz' },
  STREAK_3:     { id: 'streak_3',     name: '3-Day Streak',   icon: 'Flame',         desc: 'Learn 3 days in a row' },
  STREAK_7:     { id: 'streak_7',     name: 'Week Warrior',   icon: 'Zap',           desc: '7-day learning streak' },
  LEVEL_5:      { id: 'level_5',      name: 'Level 5',        icon: 'Star',          desc: 'Reach level 5' },
  TOPIC_MASTER: { id: 'topic_master', name: 'Topic Master',   icon: 'Crown',         desc: 'Complete 10 topics' }
};

// Map DB badge_id back to internal key
const BADGE_ID_TO_KEY = Object.fromEntries(
  Object.entries(BADGES).map(([key, badge]) => [badge.id, key])
);

const calculateLevel = (totalXp) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
};

const todayStr = () => new Date().toISOString().split('T')[0];

export const useGamification = () => {
  const { user } = useAuth();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [unlockedKeys, setUnlockedKeys] = useState([]); // stores BADGE KEYS (e.g. 'FIRST_LESSON')
  const [unlockedDates, setUnlockedDates] = useState({}); // badgeKey → ISO date string
  const [xpPopups, setXpPopups] = useState([]);
  const [levelUpNotification, setLevelUpNotification] = useState(null);
  const [badgeNotification, setBadgeNotification] = useState(null);

  // Refs so async callbacks always see latest values without stale closures
  const ref = useRef({ xp: 0, level: 1, streak: 0, longestStreak: 0 });
  // Ref to track unlocked keys without stale closure in unlockBadgeInternal
  const unlockedKeysRef = useRef([]);

  useEffect(() => {
    ref.current.xp = xp;
    ref.current.level = level;
    ref.current.streak = streak;
  }, [xp, level, streak]);

  useEffect(() => {
    unlockedKeysRef.current = unlockedKeys;
  }, [unlockedKeys]);

  useEffect(() => {
    if (!user) return;
    loadGamification();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadGamification = async () => {
    const [{ data: streakRow }, { data: badgeRows }] = await Promise.all([
      supabase.from('user_streaks').select('*').eq('user_id', user.id).single(),
      // select('*') (not explicit columns) so a missing earned_at/created_at
      // column can't trigger a 400; we read whichever timestamp exists below.
      supabase.from('user_badges').select('*').eq('user_id', user.id),
    ]);

    if (badgeRows) {
      const keys = [];
      const dates = {};
      badgeRows.forEach(r => {
        const key = BADGE_ID_TO_KEY[r.badge_id];
        if (key) {
          keys.push(key);
          dates[key] = r.earned_at || r.created_at || null;
        }
      });
      setUnlockedKeys(keys);
      unlockedKeysRef.current = keys;
      setUnlockedDates(dates);
    }

    const today = todayStr();

    if (!streakRow) {
      ref.current = { xp: 0, level: 1, streak: 1, longestStreak: 1 };
      setXp(0); setLevel(1); setStreak(1);
      supabase.from('user_streaks').insert([{
        user_id: user.id,
        current_streak: 1,
        longest_streak: 1,
        last_active: today,
        total_xp: 0,
        current_level: 1,
      }]);
      return;
    }

    const initXp = streakRow.total_xp || 0;
    const initLevel = streakRow.current_level || 1;
    const initStreak = streakRow.current_streak || 0;
    const initLongest = streakRow.longest_streak || 0;

    ref.current = { xp: initXp, level: initLevel, streak: initStreak, longestStreak: initLongest };
    setXp(initXp);
    setLevel(initLevel);

    const lastActive = streakRow.last_active?.split('T')[0];
    if (!lastActive || lastActive === today) {
      setStreak(initStreak);
      return;
    }

    const dayDiff = Math.floor((new Date(today) - new Date(lastActive)) / 86400000);

    if (dayDiff === 1) {
      const newStreak = initStreak + 1;
      const newLongest = Math.max(newStreak, initLongest);
      const newXp = initXp + XP_ACTIONS.DAILY_STREAK;
      const newLevel = calculateLevel(newXp);

      ref.current = { xp: newXp, level: newLevel, streak: newStreak, longestStreak: newLongest };
      setStreak(newStreak);
      setXp(newXp);
      if (newLevel > initLevel) {
        setLevel(newLevel);
        setLevelUpNotification({ oldLevel: initLevel, newLevel, timestamp: Date.now() });
        setTimeout(() => setLevelUpNotification(null), 5000);
      }
      showXPPopup(XP_ACTIONS.DAILY_STREAK, 'Daily Streak!');

      supabase.from('user_streaks').update({
        total_xp: newXp,
        current_level: newLevel,
        current_streak: newStreak,
        longest_streak: newLongest,
        last_active: today,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id);

      if (newStreak >= 7) unlockBadgeInternal('STREAK_7');
      else if (newStreak >= 3) unlockBadgeInternal('STREAK_3');
    } else {
      ref.current.streak = 1;
      setStreak(1);
      supabase.from('user_streaks').update({
        current_streak: 1,
        last_active: today,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id);
    }
  };

  const showXPPopup = (amount, label) => {
    const id = Date.now() + Math.random();
    setXpPopups(prev => [...prev, { id, amount, label }]);
    setTimeout(() => setXpPopups(prev => prev.filter(p => p.id !== id)), 2500);
  };

  const unlockBadgeInternal = useCallback((badgeKey) => {
    if (!user || !BADGES[badgeKey]) return;
    // Use ref to avoid stale closure — immediately bail if already earned
    if (unlockedKeysRef.current.includes(badgeKey)) return;

    const badge = BADGES[badgeKey];
    const now = new Date().toISOString();

    // Update state
    setUnlockedKeys(prev => {
      if (prev.includes(badgeKey)) return prev;
      return [...prev, badgeKey];
    });
    setUnlockedDates(d => ({ ...d, [badgeKey]: now }));

    // Show in-page badge notification
    setBadgeNotification(badge);
    setTimeout(() => setBadgeNotification(null), 4500);

    // Persist to Supabase — include earned_at to match table schema
    supabase.from('user_badges').insert([{
      user_id: user.id,
      badge_id: badge.id,
      badge_name: badge.name,
      earned_at: now,
    }]).then(({ error }) => {
      if (error && error.code !== '23505') {
        // 23505 = unique violation (already exists) — safe to ignore
        console.error('Badge save error:', error.message);
      }
    });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addXP = useCallback((amount, label = '') => {
    if (!user) return;
    setXp(prevXp => {
      const newXP = prevXp + amount;
      const prevLevel = ref.current.level;
      const newLevel = calculateLevel(newXP);

      if (newLevel > prevLevel) {
        ref.current.level = newLevel;
        setLevel(newLevel);
        showXPPopup(amount, 'Level Up!');
        setLevelUpNotification({ oldLevel: prevLevel, newLevel, timestamp: Date.now() });
        setTimeout(() => setLevelUpNotification(null), 5000);
        if (newLevel >= 5) unlockBadgeInternal('LEVEL_5');
      } else {
        showXPPopup(amount, label);
      }

      ref.current.xp = newXP;
      const { streak: curStreak, longestStreak } = ref.current;

      supabase.from('user_streaks').update({
        total_xp: newXP,
        current_level: newLevel,
        current_streak: curStreak,
        longest_streak: Math.max(curStreak, longestStreak),
        last_active: todayStr(),
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id).then(({ error }) => {
        if (error) console.error('XP save error:', error.message);
      });

      return newXP;
    });
  }, [user, unlockBadgeInternal]);

  const unlockBadge = useCallback((badgeKey) => {
    unlockBadgeInternal(badgeKey);
    return BADGES[badgeKey] || null;
  }, [unlockBadgeInternal]);

  const checkBadgeUnlock = useCallback((type, value) => {
    switch (type) {
      case 'LEVEL_5':       if (value >= 5)  unlockBadgeInternal('LEVEL_5');   break;
      case 'FIRST_LESSON':                   unlockBadgeInternal('FIRST_LESSON'); break;
      case 'STREAK_3':      if (value >= 3)  unlockBadgeInternal('STREAK_3');  break;
      case 'STREAK_7':      if (value >= 7)  unlockBadgeInternal('STREAK_7');  break;
      case 'TOPIC_MASTER':  if (value >= 10) unlockBadgeInternal('TOPIC_MASTER'); break;
      default: break;
    }
  }, [unlockBadgeInternal]);

  const awardXP = {
    readExplanation: () => addXP(XP_ACTIONS.READ_EXPLANATION, 'Explanation'),
    useChat: () => addXP(XP_ACTIONS.USE_CHAT, 'Chat with Finn'),
    completeQuiz: (score, total) => {
      const isPerfect = score === total;
      addXP(isPerfect ? XP_ACTIONS.PERFECT_QUIZ : XP_ACTIONS.QUIZ_COMPLETE, isPerfect ? 'Perfect Quiz!' : 'Quiz Complete');
      if (isPerfect) unlockBadge('PERFECT_QUIZ');
    },
    bossFight: () => addXP(XP_ACTIONS.BOSS_FIGHT, 'Boss Defeated!'),
  };

  const getXPForNextLevel = () => {
    if (level >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    return LEVEL_THRESHOLDS[level] - xp;
  };

  const getLevelProgress = () => {
    if (level >= LEVEL_THRESHOLDS.length) return 100;
    const currentLevelXP = LEVEL_THRESHOLDS[level - 1];
    const nextLevelXP = LEVEL_THRESHOLDS[level];
    return Math.min(100, Math.max(0, ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100));
  };

  const getAllBadges = () => Object.entries(BADGES).map(([key, badge]) => ({
    ...badge,
    unlocked: unlockedKeys.includes(key),
    unlockedAt: unlockedDates[key] ?? null,
  }));

  const dismissLevelUp = () => setLevelUpNotification(null);
  const dismissBadgeNotification = () => setBadgeNotification(null);

  return {
    xp,
    level,
    streak,
    badges: getAllBadges(),
    xpPopups,
    levelUpNotification,
    badgeNotification,
    awardXP,
    addXP,
    unlockBadge,
    checkBadgeUnlock,
    getXPForNextLevel,
    getLevelProgress,
    dismissLevelUp,
    dismissBadgeNotification,
  };
};

export default useGamification;
