import React, { createContext, useContext, useState, useEffect } from 'react';
import { MUSIC_CHARACTERS } from '../data/musicCharacters';

export { MUSIC_CHARACTERS };

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [character, setCharacter]             = useState(null);
  const [characterLoaded, setCharacterLoaded] = useState(false);
  const [defeatedBosses, setDefeatedBosses]   = useState([]);

  useEffect(() => {
    const savedChar = localStorage.getItem('finlit_music_char');
    if (savedChar && MUSIC_CHARACTERS[savedChar]) setCharacter(MUSIC_CHARACTERS[savedChar]);

    const savedBosses = localStorage.getItem('finlit_music_bosses');
    if (savedBosses) {
      try { setDefeatedBosses(JSON.parse(savedBosses)); } catch { /* ignore */ }
    }
    setCharacterLoaded(true);
  }, []);

  const updateCharacter = (id) => {
    const c = MUSIC_CHARACTERS[id];
    if (!c) return;
    setCharacter(c);
    localStorage.setItem('finlit_music_char', id);
  };

  const clearCharacter = () => {
    setCharacter(null);
    localStorage.removeItem('finlit_music_char');
  };

  const addDefeatedBoss = (bossId) => {
    setDefeatedBosses(prev => {
      if (prev.includes(bossId)) return prev;
      const updated = [...prev, bossId];
      localStorage.setItem('finlit_music_bosses', JSON.stringify(updated));
      return updated;
    });
  };

  const clearDefeatedBosses = () => {
    setDefeatedBosses([]);
    localStorage.removeItem('finlit_music_bosses');
  };

  return (
    <MusicContext.Provider value={{
      character, characterLoaded, updateCharacter, clearCharacter,
      defeatedBosses, addDefeatedBoss, clearDefeatedBosses,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}
