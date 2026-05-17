import React, { createContext, useContext, useState, useEffect } from 'react';

export const SPORTS_CHARACTERS = {
  lyra: {
    id: 'lyra',
    name: 'Lyra',
    title: 'The Striker',
    role: 'Attack · Opportunity Hunter',
    jersey: '44',
    color: '#E8457A',
    glow: 'rgba(232,69,122,0.5)',
    dim: 'rgba(232,69,122,0.12)',
    border: 'rgba(232,69,122,0.3)',
    description: 'High risk, high reward. Lyra chases the big opportunities others miss and converts them into wealth.',
    philosophy: 'Aggressive income growth. Chase opportunities others miss.',
    traits: ['Bold', 'Decisive', 'Opportunistic', 'High-energy'],
    teaches: ['Income Growth', 'Side Hustles', 'Risk Management', 'Opportunity Spotting'],
    fullImage: '/CHARACTERS/SPORTS/SPORTS_LYRA_FULL_VER.png',
    chibiImage: '/CHARACTERS/SPORTS/SPORTS_LYRA_CHIBI_VER.png',
  },
  kael: {
    id: 'kael',
    name: 'Kael',
    title: 'The Playmaker',
    role: 'Vision · System Builder',
    jersey: '11',
    color: '#0F3BBC',
    glow: 'rgba(15,59,188,0.5)',
    dim: 'rgba(15,59,188,0.12)',
    border: 'rgba(15,59,188,0.3)',
    description: 'Control the flow. Kael balances the books and sees the whole field, building systems that run themselves.',
    philosophy: 'Balanced strategy. Budget, plan, control the whole field.',
    traits: ['Strategic', 'Analytical', 'Calm', 'Disciplined'],
    teaches: ['Budgeting', 'Cash Flow', 'Financial Planning', 'Debt Strategy'],
    fullImage: '/CHARACTERS/SPORTS/SPORTS_KAEL_FULL_VER.png',
    chibiImage: '/CHARACTERS/SPORTS/SPORTS_KAEL_CHIBI_VER.png',
  },
  ian: {
    id: 'ian',
    name: 'Ian',
    title: 'The Captain',
    role: 'Leadership · Long-Term Vision',
    jersey: '07',
    color: '#F5C842',
    glow: 'rgba(245,200,66,0.5)',
    dim: 'rgba(245,200,66,0.12)',
    border: 'rgba(245,200,66,0.3)',
    description: 'Legacy over quick wins. Ian builds wealth that outlasts the season and inspires the whole team.',
    philosophy: 'Long-term legacy building. Wealth that outlasts the season.',
    traits: ['Patient', 'Visionary', 'Trustworthy', 'Resilient'],
    teaches: ['Investing', 'Compound Growth', 'Wealth Building', 'Retirement Planning'],
    fullImage: '/CHARACTERS/SPORTS/SPORTS_IAN_FULL_VER.png',
    chibiImage: '/CHARACTERS/SPORTS/SPORTS_IAN_CHIBI_VER.png',
  },
};

const SportsContext = createContext(null);

export function SportsProvider({ children }) {
  const [character, setCharacter]             = useState(null);
  const [characterLoaded, setCharacterLoaded] = useState(false);
  const [defeatedBosses, setDefeatedBosses]   = useState([]);

  useEffect(() => {
    const savedChar = localStorage.getItem('finlit_sports_char');
    if (savedChar && SPORTS_CHARACTERS[savedChar]) setCharacter(SPORTS_CHARACTERS[savedChar]);

    const savedBosses = localStorage.getItem('finlit_sports_bosses');
    if (savedBosses) {
      try { setDefeatedBosses(JSON.parse(savedBosses)); } catch { /* ignore */ }
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

  const addDefeatedBoss = (bossId) => {
    setDefeatedBosses(prev => {
      if (prev.includes(bossId)) return prev;
      const updated = [...prev, bossId];
      localStorage.setItem('finlit_sports_bosses', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SportsContext.Provider value={{
      character, characterLoaded, updateCharacter, clearCharacter,
      defeatedBosses, addDefeatedBoss,
    }}>
      {children}
    </SportsContext.Provider>
  );
}

export function useSports() {
  return useContext(SportsContext);
}
