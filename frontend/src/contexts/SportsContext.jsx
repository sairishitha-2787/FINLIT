import React, { createContext, useContext, useState, useEffect } from 'react';

export const SPORTS_CHARACTERS = {
  striker: {
    id: 'striker',
    name: 'The Striker',
    role: 'Attack · Opportunity Hunter',
    desc: 'High risk, high reward. You chase the big opportunities others miss.',
    color: '#E8457A',
    glow: 'rgba(232,69,122,0.5)',
    dim: 'rgba(232,69,122,0.12)',
    border: 'rgba(232,69,122,0.3)',
  },
  playmaker: {
    id: 'playmaker',
    name: 'The Playmaker',
    role: 'Vision · System Builder',
    desc: 'Control the flow. Balance the books. See the whole field.',
    color: '#4A7BF7',
    glow: 'rgba(74,123,247,0.5)',
    dim: 'rgba(74,123,247,0.12)',
    border: 'rgba(74,123,247,0.3)',
  },
  captain: {
    id: 'captain',
    name: 'The Captain',
    role: 'Leadership · Long-Term Vision',
    desc: 'Legacy over quick wins. Build wealth that lasts generations.',
    color: '#F5C842',
    glow: 'rgba(245,200,66,0.5)',
    dim: 'rgba(245,200,66,0.12)',
    border: 'rgba(245,200,66,0.3)',
  },
};

const SportsContext = createContext(null);

export function SportsProvider({ children }) {
  const [character, setCharacter] = useState(null);
  const [characterLoaded, setCharacterLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('finlit_sports_char');
    if (saved && SPORTS_CHARACTERS[saved]) {
      setCharacter(SPORTS_CHARACTERS[saved]);
    }
    setCharacterLoaded(true);
  }, []);

  const updateCharacter = (id) => {
    const c = SPORTS_CHARACTERS[id];
    if (!c) return;
    setCharacter(c);
    localStorage.setItem('finlit_sports_char', id);
  };

  const clearCharacter = () => {
    setCharacter(null);
    localStorage.removeItem('finlit_sports_char');
  };

  return (
    <SportsContext.Provider value={{ character, characterLoaded, updateCharacter, clearCharacter }}>
      {children}
    </SportsContext.Provider>
  );
}

export function useSports() {
  return useContext(SportsContext);
}
