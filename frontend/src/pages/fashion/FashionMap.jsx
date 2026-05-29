import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useFashion } from '../../contexts/FashionContext';
import RunwayMap from '../../components/fashion/RunwayMap';
import RunwayShowModal from '../../components/fashion/RunwayShowModal';

const F = { heading: "'Playfair Display', serif", ui: "'DM Sans', sans-serif" };
const C = { deepRose: '#9d1f4a', midRose: '#d4537e', label: '#c98a9e' };

export default function FashionMap() {
  const navigate = useNavigate();
  const { fashionCharacter, fashionColor } = useOutletContext();
  const { completedTopics } = useUser();
  const { defeatedBosses } = useFashion();

  const [activeBossDistrict, setActiveBossDistrict] = useState(null);

  const FASHION_TOPICS_FLAT = [
    'Budgeting Basics', 'Saving Money', 'Emergency Funds', 'Simple Interest',
    'Compound Interest', 'Credit Scores', 'Investing Basics', 'Stocks & Bonds', 'Debt Management',
    'Retirement Accounts', 'Tax Fundamentals', 'Portfolio Diversification', 'Advanced Planning',
  ];

  const handleTopicClick = useCallback((topic) => {
    const idx  = FASHION_TOPICS_FLAT.indexOf(topic);
    const next = idx >= 0 && idx < FASHION_TOPICS_FLAT.length - 1 ? FASHION_TOPICS_FLAT[idx + 1] : null;
    navigate('/fashion/learn', { state: { topic, nextTopic: next } });
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBossClick = useCallback((district) => {
    setActiveBossDistrict(district);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
    >
      <div style={{ padding: '28px 32px 0', maxWidth: 960, margin: '0 auto' }}>
        <div style={{
          fontFamily: F.ui, fontWeight: 500, fontSize: 10,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label, marginBottom: 8,
        }}>
          Runway Map
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 4 }}>
          <h1 style={{
            fontFamily: F.heading, fontWeight: 600, fontSize: 28,
            letterSpacing: '-0.02em', lineHeight: 1.15, color: C.deepRose, margin: 0,
          }}>
            Your Style Districts
          </h1>
          <div style={{
            padding: '5px 14px', borderRadius: 99,
            background: 'rgba(247,160,184,0.12)', border: '1px solid rgba(247,160,184,0.30)',
            fontFamily: F.ui, fontWeight: 500, fontSize: 11, letterSpacing: '0.10em',
            color: C.midRose,
          }}>
            {completedTopics.length} looks styled
          </div>
        </div>
        <p style={{
          fontFamily: F.ui, fontStyle: 'italic', fontSize: 14, color: C.midRose, margin: '0 0 8px',
        }}>
          Chart your path through the world of financial fashion.
        </p>
      </div>

      <RunwayMap
        completedTopics={completedTopics}
        defeatedBosses={defeatedBosses}
        onTopicClick={handleTopicClick}
        onBossClick={handleBossClick}
        characterColor={fashionColor}
      />

      <AnimatePresence>
        {activeBossDistrict && (
          <RunwayShowModal
            district={activeBossDistrict}
            onVictory={() => {}}
            onClose={() => setActiveBossDistrict(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
