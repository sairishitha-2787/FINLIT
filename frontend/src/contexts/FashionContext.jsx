import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveDefeatedBoss, fetchDefeatedBosses } from '../services/progressService';

const FashionContext = createContext(null);

export const useFashion = () => {
  const ctx = useContext(FashionContext);
  if (!ctx) throw new Error('useFashion must be used within FashionProvider');
  return ctx;
};

const CHAR_KEY  = (uid) => `finlit_fashion_char_${uid}`;
const BOSS_KEY  = (uid) => `finlit_fashion_bosses_${uid}`;

export const FASHION_CHARACTERS = [
  {
    id: 'raven',
    name: 'Raven',
    archetype: 'The Trendsetter',
    tagline: 'Fortune favors the bold',
    description: "You don't follow trends — you set them. Your portfolio is as daring as your wardrobe. High risk, high reward, always ahead of the curve.",
    strengths: ['Trend Analysis +20%', 'Risk Tolerance +15%'],
    colors: {
      primary:   '#e85d75',
      secondary: '#ff8fa3',
      accent:    '#fde68a',
      glow:      'rgba(232,93,117,0.35)',
      gradient:  'linear-gradient(135deg, #e85d75, #ff8fa3, #fbb6c4)',
    },
    fullImage:  '/CHARACTERS/FASHION_RAVEN-full.png',
    chibiImage: '/CHARACTERS/FASHION_RAVEN-CHIBI.png',
  },
  {
    id: 'amara',
    name: 'Amara',
    archetype: 'The Classic',
    tagline: 'Elegance never goes out of style',
    description: 'Timeless pieces, timeless strategy. You invest in quality that appreciates over time. Slow and steady wins the fashion show.',
    strengths: ['Portfolio Balance +20%', 'Compound Growth +15%'],
    colors: {
      primary:   '#c084fc',
      secondary: '#d8b4fe',
      accent:    '#fae9d7',
      glow:      'rgba(192,132,252,0.35)',
      gradient:  'linear-gradient(135deg, #c084fc, #d8b4fe, #f0abfc)',
    },
    fullImage:  '/CHARACTERS/FASHION_AMARA-full.png',
    chibiImage: '/CHARACTERS/FASHION_AMARA-_CHIBI.png',
  },
  {
    id: 'amon',
    name: 'Amon',
    archetype: 'The Avant-Garde',
    tagline: 'Break the rules, build the wealth',
    description: "Who says finance has to be boring? You find opportunities where others see chaos. Your portfolio is your canvas.",
    strengths: ['Creative Income +20%', 'Innovation Bonus +15%'],
    colors: {
      primary:   '#f7a0b8',
      secondary: '#fbb6c4',
      accent:    '#c084fc',
      glow:      'rgba(247,160,184,0.35)',
      gradient:  'linear-gradient(135deg, #f7a0b8, #c084fc, #fbb6c4)',
    },
    fullImage:  '/CHARACTERS/FASHION_AMON-full.png',
    chibiImage: '/CHARACTERS/FASHION_AMON-CHIBI.png',
  },
];

export function FashionProvider({ children }) {
  const { user } = useAuth();
  const [fashionCharacter, setFashionCharacter] = useState(null);
  const [fashionCharacterLoaded, setFashionCharacterLoaded] = useState(false);
  const [defeatedBosses, setDefeatedBosses] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    // Load character from localStorage
    const raw = localStorage.getItem(CHAR_KEY(user.id));
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        const fresh = FASHION_CHARACTERS.find(c => c.id === saved.id);
        setFashionCharacter(fresh || saved);
      } catch { /* ignore */ }
    }

    // Merge localStorage bosses with Supabase (Supabase is source of truth)
    const localRaw = localStorage.getItem(BOSS_KEY(user.id));
    let localBosses = [];
    if (localRaw) { try { localBosses = JSON.parse(localRaw); } catch { /* ignore */ } }

    fetchDefeatedBosses(user.id).then(({ data }) => {
      const remoteBosses = (data || []).map(r => r.boss_id);
      const merged = [...new Set([...localBosses, ...remoteBosses])];
      setDefeatedBosses(merged);
      if (merged.length > 0) {
        localStorage.setItem(BOSS_KEY(user.id), JSON.stringify(merged));
      }
    });

    setFashionCharacterLoaded(true);
  }, [user?.id]);

  const updateFashionCharacter = useCallback((char) => {
    setFashionCharacter(char);
    if (user?.id) localStorage.setItem(CHAR_KEY(user.id), JSON.stringify({ id: char.id }));
  }, [user?.id]);

  const clearFashionCharacter = useCallback(() => {
    setFashionCharacter(null);
    if (user?.id) localStorage.removeItem(CHAR_KEY(user.id));
  }, [user?.id]);

  const addDefeatedBoss = useCallback((bossId) => {
    setDefeatedBosses(prev => {
      if (prev.includes(bossId)) return prev;
      const next = [...prev, bossId];
      if (user?.id) {
        localStorage.setItem(BOSS_KEY(user.id), JSON.stringify(next));
        saveDefeatedBoss(user.id, bossId).catch(err =>
          console.error('Boss save error:', err.message)
        );
      }
      return next;
    });
  }, [user?.id]);

  return (
    <FashionContext.Provider value={{
      fashionCharacter,
      fashionCharacterLoaded,
      defeatedBosses,
      updateFashionCharacter,
      clearFashionCharacter,
      addDefeatedBoss,
    }}>
      {children}
    </FashionContext.Provider>
  );
}
