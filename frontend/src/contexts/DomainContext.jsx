import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveDefeatedBoss, fetchDefeatedBosses } from '../services/progressService';

const DomainContext = createContext(null);

export const useDomain = () => {
  const ctx = useContext(DomainContext);
  if (!ctx) throw new Error('useDomain must be used within DomainProvider');
  return ctx;
};

const CHAR_KEY  = (uid) => `finlit_character_${uid}`;
const BOSS_KEY  = (uid) => `finlit_bosses_${uid}`;

const CHARACTER_IMAGES = {
  raeveth: {
    fullImage:  '/CHARACTERS/GAMING_A-Raeveth_Character.png',
    chibiImage: '/CHARACTERS/GAMING_CHIBI_VER-_A-Raeveth.png',
  },
  thessiveil: {
    fullImage:  '/CHARACTERS/GAMING_F-Thessiveil_Character.png',
    chibiImage: '/CHARACTERS/GAMING_CHIBI_VER-_F-_Thessiveil.png',
  },
  caeldryn: {
    fullImage:  '/CHARACTERS/GAMING_M-Caeldryn_Character.png',
    chibiImage: '/CHARACTERS/GAMING_CHIBI_VER-M-_Caeldryn.png',
  },
};

export function DomainProvider({ children }) {
  const { user } = useAuth();
  const [character, setCharacter]         = useState(null);
  const [defeatedBosses, setDefeatedBosses] = useState([]);
  const [characterLoaded, setCharacterLoaded] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    // Load character from localStorage
    const raw = localStorage.getItem(CHAR_KEY(user.id));
    if (raw) {
      try {
        const saved    = JSON.parse(raw);
        const images   = CHARACTER_IMAGES[saved.id] || {};
        const hydrated = { ...images, ...saved };
        setCharacter(hydrated);
        localStorage.setItem(CHAR_KEY(user.id), JSON.stringify(hydrated));
      } catch { /* ignore bad JSON */ }
    }

    // Load defeated bosses: merge localStorage (instant) + Supabase (source of truth)
    const localRaw = localStorage.getItem(BOSS_KEY(user.id));
    const localBosses = localRaw ? (() => { try { return JSON.parse(localRaw); } catch { return []; } })() : [];
    if (localBosses.length) setDefeatedBosses(localBosses); // show immediately from cache

    fetchDefeatedBosses(user.id).then(({ data, error }) => {
      if (error) {
        // Falls back to localStorage. Don't spam the console if the table just
        // doesn't exist yet (schema-cache miss) — that's an expected state.
        if (!error.message?.includes('schema cache')) {
          console.warn('Could not load defeated bosses from Supabase:', error.message);
        }
        setCharacterLoaded(true);
        return;
      }
      const remoteBossIds = data.map(r => r.boss_id);
      // Union of local + remote so nothing is lost
      const merged = [...new Set([...localBosses, ...remoteBossIds])];
      // Sync any local-only bosses up to Supabase
      localBosses.filter(id => !remoteBossIds.includes(id)).forEach(id => {
        saveDefeatedBoss(user.id, id).catch(() => {});
      });
      setDefeatedBosses(merged);
      localStorage.setItem(BOSS_KEY(user.id), JSON.stringify(merged));
      setCharacterLoaded(true);
    });

    if (!localBosses.length) setCharacterLoaded(true);
  }, [user?.id]);

  const updateCharacter = useCallback((char) => {
    const images    = CHARACTER_IMAGES[char.id] || {};
    const withImages = { ...images, ...char };
    setCharacter(withImages);
    if (user?.id) localStorage.setItem(CHAR_KEY(user.id), JSON.stringify(withImages));
  }, [user?.id]);

  const clearCharacter = useCallback(() => {
    setCharacter(null);
    if (user?.id) localStorage.removeItem(CHAR_KEY(user.id));
  }, [user?.id]);

  const addDefeatedBoss = useCallback((bossId) => {
    setDefeatedBosses(prev => {
      if (prev.includes(bossId)) return prev;
      const updated = [...prev, bossId];
      if (user?.id) {
        localStorage.setItem(BOSS_KEY(user.id), JSON.stringify(updated));
        saveDefeatedBoss(user.id, bossId).catch(err =>
          console.warn('Boss save to Supabase failed:', err.message)
        );
      }
      return updated;
    });
  }, [user?.id]);

  return (
    <DomainContext.Provider value={{
      character,
      defeatedBosses,
      characterLoaded,
      updateCharacter,
      clearCharacter,
      addDefeatedBoss,
    }}>
      {children}
    </DomainContext.Provider>
  );
}
