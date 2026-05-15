import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Lock, CheckCircle2, Circle } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const PLAYBOOK = [
  {
    season: 'PRE-SEASON',
    title: 'Foundations',
    drills: ['Budgeting Basics', 'Understanding Income', 'Saving Money', 'Emergency Funds', 'Credit Scores'],
  },
  {
    season: 'SEASON 1',
    title: 'Building Your Squad',
    drills: ['Stock Market 101', 'Mutual Funds', 'Index Funds', 'Bonds', 'Diversification'],
  },
  {
    season: 'SEASON 2',
    title: 'Tactical Plays',
    drills: ['Credit Cards', 'Student Loans', 'Debt Payoff Strategies', 'Good vs Bad Debt', 'Interest Rates'],
  },
  {
    season: 'SEASON 3',
    title: 'Advanced Formations',
    drills: ['Cryptocurrency', 'Real Estate Investing', 'Tax Optimization', 'Retirement Planning', 'Portfolio Management'],
  },
  {
    season: 'SEASON 4',
    title: 'The Big Leagues',
    drills: ['First Job Finance', 'Moving Out', 'Insurance Basics', 'Side Hustles', 'Negotiating Salary'],
  },
  {
    season: 'FINALS',
    title: 'Championship Economics',
    drills: ['Inflation', 'Supply & Demand', 'Economic Cycles', 'GDP & Markets', 'Global Finance'],
  },
];

export default function SportsMap() {
  const navigate = useNavigate();
  const { completedTopics } = useUser();
  const { sportsColor: C } = useOutletContext();

  const [expandedSeason, setExpandedSeason] = useState(0);

  const completedSet = new Set(completedTopics);

  const getSeasonProgress = (drills) => {
    const done = drills.filter(d => completedSet.has(d)).length;
    return { done, total: drills.length, pct: Math.round((done / drills.length) * 100) };
  };

  const isSeasonUnlocked = (index) => {
    if (index === 0) return true;
    const prev = PLAYBOOK[index - 1];
    return getSeasonProgress(prev.drills).done >= 2;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ padding: '20px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      {/* Sub-header */}
      <div style={{ marginBottom: '4px' }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px', color: 'rgba(255,255,255,0.45)',
        }}>
          {completedTopics.length} drills completed · Select a drill to train
        </p>
      </div>

      {/* Season cards */}
      {PLAYBOOK.map((season, si) => {
        const { done, total, pct } = getSeasonProgress(season.drills);
        const unlocked = isSeasonUnlocked(si);
        const isOpen = expandedSeason === si;
        const complete = done === total;

        return (
          <div key={si}>
            {/* Season header */}
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => unlocked && setExpandedSeason(isOpen ? -1 : si)}
              style={{
                width: '100%', textAlign: 'left',
                background: complete
                  ? `${C}15`
                  : isOpen
                    ? 'rgba(30,30,30,0.98)'
                    : 'rgba(26,26,26,0.95)',
                borderLeft: `3px solid ${unlocked ? C : 'rgba(255,255,255,0.12)'}`,
                borderTop: '1px solid rgba(255,255,255,0.07)',
                borderRight: '1px solid rgba(255,255,255,0.04)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '8px',
                padding: '14px 16px',
                cursor: unlocked ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              {/* Season icon */}
              <div style={{ flexShrink: 0 }}>
                {!unlocked ? (
                  <Lock size={18} color="rgba(255,255,255,0.2)" strokeWidth={1.8} />
                ) : complete ? (
                  <CheckCircle2 size={18} color={C} strokeWidth={1.8} />
                ) : (
                  <Circle size={18} color={C} strokeWidth={1.8} />
                )}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: unlocked ? C : 'rgba(255,255,255,0.25)',
                  marginBottom: '2px',
                }}>
                  {season.season}
                </div>
                <div style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: '20px', letterSpacing: '1px',
                  color: unlocked ? '#fff' : 'rgba(255,255,255,0.25)',
                }}>
                  {season.title}
                </div>
              </div>

              {/* Progress */}
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: '16px', letterSpacing: '1px',
                  color: unlocked ? C : 'rgba(255,255,255,0.2)',
                }}>
                  {done}/{total}
                </div>
                {unlocked && (
                  <div style={{
                    width: '40px', height: '3px', borderRadius: '2px',
                    background: 'rgba(255,255,255,0.1)',
                    overflow: 'hidden', marginTop: '4px',
                  }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: C, borderRadius: '2px' }} />
                  </div>
                )}
              </div>

              {unlocked && (
                <ChevronRight
                  size={16}
                  color="rgba(255,255,255,0.3)"
                  style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                />
              )}
            </motion.button>

            {/* Drill list */}
            {isOpen && unlocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  marginTop: '3px',
                  background: 'rgba(20,20,20,0.95)',
                  borderLeft: `3px solid ${C}55`,
                  borderRadius: '0 0 8px 8px',
                  overflow: 'hidden',
                }}
              >
                {season.drills.map((drill, di) => {
                  const done = completedSet.has(drill);
                  return (
                    <motion.button
                      key={di}
                      whileHover={{ backgroundColor: `${C}10` }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => navigate('/sports/learn', { state: { topic: drill } })}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '12px 16px',
                        background: 'transparent',
                        border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '12px',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                        background: done ? C : 'rgba(255,255,255,0.15)',
                        boxShadow: done ? `0 0 6px ${C}` : 'none',
                      }} />
                      <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '15px', fontWeight: 600,
                        letterSpacing: '0.03em',
                        color: done ? C : 'rgba(255,255,255,0.75)',
                        flex: 1,
                      }}>
                        {drill}
                      </span>
                      {done ? (
                        <span style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: '10px', fontWeight: 600,
                          color: C, letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}>
                          FULL TIME
                        </span>
                      ) : (
                        <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
