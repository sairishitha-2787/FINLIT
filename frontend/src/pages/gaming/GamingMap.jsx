import React, { useState, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useDomain } from '../../contexts/DomainContext';
import { useUser } from '../../context/UserContext';
import IslandMap from '../../components/gaming/IslandMap';
import SuggestedForReview from '../../components/SuggestedForReview';
import MasteryBanner from '../../components/MasteryBanner';
import BossBattleModal from '../../components/gaming/BossBattleModal';
import { gamingTheme, getElementColors } from '../../styles/gamingTheme';

export default function GamingMap() {
  const navigate  = useNavigate();
  const { character, defeatedBosses, addDefeatedBoss } = useDomain();
  const { completedTopics } = useUser();
  const { awardXP, colors: layoutColors } = useOutletContext();
  const [bossModal, setBossModal] = useState(null);

  const colors = layoutColors || getElementColors(character);

  const GAMING_TOPICS_FLAT = [
    'Budgeting Basics', 'Saving Money', 'Emergency Funds', 'Simple Interest',
    'Compound Interest', 'Credit Scores', 'Investing Basics', 'Stocks & Bonds',
    'Retirement Accounts', 'Tax Fundamentals', 'Debt Management', 'Portfolio Diversification',
  ];

  const handleTopicClick = useCallback((topic) => {
    const idx  = GAMING_TOPICS_FLAT.indexOf(topic);
    const next = idx >= 0 && idx < GAMING_TOPICS_FLAT.length - 1 ? GAMING_TOPICS_FLAT[idx + 1] : null;
    navigate('/gaming/learn', { state: { topic, nextTopic: next } });
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBossClick = useCallback((island) => {
    setBossModal(island);
  }, []);

  const handleBossVictory = useCallback(() => {
    if (!bossModal) return;
    addDefeatedBoss(bossModal.bossId);
    awardXP?.bossFight?.();
  }, [bossModal, addDefeatedBoss, awardXP]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Page title */}
      <div style={{ padding: '32px 32px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{
            fontFamily: gamingTheme.fontLabel,
            fontSize: '10px', letterSpacing: '3px',
            color: gamingTheme.mutedBlue,
            textTransform: 'uppercase', marginBottom: '4px',
          }}>Your Journey</div>
          <h1 style={{
            fontFamily: gamingTheme.fontHeading,
            fontSize: '28px', fontWeight: 800,
            color: gamingTheme.stellarWhite,
            textTransform: 'uppercase', letterSpacing: '2px',
            textShadow: `0 0 20px ${colors.glow}`,
            margin: 0,
          }}>Island Conquest Map</h1>
        </div>
        <div style={{
          padding: '6px 14px',
          borderRadius: '999px',
          background: `rgba(${hexToRgbStr(colors.primary)},0.12)`,
          border: `1px solid rgba(${hexToRgbStr(colors.primary)},0.3)`,
          fontFamily: gamingTheme.fontLabel,
          fontSize: '11px', letterSpacing: '1px',
          color: colors.primary,
          marginBottom: '4px',
        }}>
          {completedTopics.length} topics cleared
        </div>
      </div>

      <div style={{ padding: '20px 32px 0' }}>
        <MasteryBanner
          topics={GAMING_TOPICS_FLAT}
          completed={completedTopics}
          accent={colors.primary}
          theme={{ surface: gamingTheme.cardBg, border: gamingTheme.glassBorder, textPrimary: gamingTheme.stellarWhite, textMuted: gamingTheme.mutedBlue, radius: 14, fontHeading: gamingTheme.fontHeading, fontBody: gamingTheme.fontBody }}
        />
        <SuggestedForReview
          domain="gaming"
          accent={colors.primary}
          theme={{ surface: gamingTheme.cardBg, border: gamingTheme.glassBorder, textPrimary: gamingTheme.stellarWhite, textMuted: gamingTheme.mutedBlue, radius: 14, fontHeading: gamingTheme.fontHeading, fontBody: gamingTheme.fontBody }}
        />
      </div>

      <IslandMap
        character={character}
        completedTopics={completedTopics}
        defeatedBosses={defeatedBosses}
        onTopicClick={handleTopicClick}
        onBossClick={handleBossClick}
      />

      {/* Boss battle modal - full quiz flow */}
      <AnimatePresence>
        {bossModal && (
          <BossBattleModal
            island={bossModal}
            colors={colors}
            onVictory={handleBossVictory}
            onDefeat={() => {}}
            onClose={() => setBossModal(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}
