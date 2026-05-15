import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Swords, Flame, Zap, Snowflake, Shield, Gem,
  Sprout, Leaf, Wind, GraduationCap, Target, Star, Crown, Trophy,
} from 'lucide-react';
import { gamingTheme, getElementColors } from '../../styles/gamingTheme';
import { useIsMobile } from '../../hooks/useIsMobile';

const BEGINNER_TOPICS      = ['Budgeting Basics', 'Saving Money', 'Emergency Funds', 'Simple Interest'];
const INTERMEDIATE_TOPICS  = ['Compound Interest', 'Credit Scores', 'Investing Basics', 'Stocks & Bonds'];
const ADVANCED_TOPICS      = ['Retirement Accounts', 'Tax Fundamentals', 'Debt Management', 'Portfolio Diversification'];

const calcStat = (topics, completed) =>
  Math.round((topics.filter(t => completed.includes(t)).length / topics.length) * 100);

const ELEMENT_SKILLS = {
  fire:   [{ icon: Swords,    name: 'Aggressive Budgeting' }, { icon: Flame,  name: 'Risk Taking'      }, { icon: Zap,   name: 'Market Momentum' }],
  frost:  [{ icon: Snowflake, name: 'Risk Management'      }, { icon: Shield, name: 'Capital Guard'    }, { icon: Gem,   name: 'Value Investing'  }],
  nature: [{ icon: Sprout,    name: 'Compound Growth'      }, { icon: Leaf,   name: 'ESG Mastery'      }, { icon: Wind,  name: 'Long-term Vision' }],
};

const BADGE_ICON_MAP = {
  first_lesson: GraduationCap,
  perfect_quiz: Target,
  streak_3:     Flame,
  streak_7:     Zap,
  level_5:      Star,
  topic_master: Crown,
};

export default function CharacterSheet({ isOpen, onClose, character, completedTopics = [], badges = [], level, xp, streak }) {
  const colors = getElementColors(character);
  const elemKey = character?.element?.toLowerCase() || 'fire';
  const { isMobile } = useIsMobile();

  const stats = [
    { name: 'Budgeting',  value: calcStat(BEGINNER_TOPICS, completedTopics) },
    { name: 'Investing',  value: calcStat(INTERMEDIATE_TOPICS, completedTopics) },
    { name: 'Wealth Mgmt', value: calcStat(ADVANCED_TOPICS, completedTopics) },
  ];

  const skills = ELEMENT_SKILLS[elemKey] || ELEMENT_SKILLS.fire;
  const unlockedBadges = badges.filter(b => b.unlocked);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(20,28,52,0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 800,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            style={{
              position: 'fixed',
              top: isMobile ? 'auto' : 0,
              bottom: isMobile ? 0 : 'auto',
              right: 0, left: isMobile ? 0 : 'auto',
              width: isMobile ? '100%' : '360px',
              height: isMobile ? '90vh' : '100vh',
              background: gamingTheme.bgMid,
              borderLeft: isMobile ? 'none' : gamingTheme.borderThin,
              borderTop: isMobile ? gamingTheme.borderThin : 'none',
              borderRadius: isMobile ? '20px 20px 0 0' : '0',
              boxShadow: isMobile ? '0 -12px 48px rgba(0,0,0,0.5)' : '-12px 0 48px rgba(0,0,0,0.5)',
              zIndex: 900, overflowY: 'auto',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 20px 16px',
              borderBottom: gamingTheme.borderThin,
              flexShrink: 0,
            }}>
              <div>
                <div style={{
                  fontFamily: gamingTheme.fontLabel,
                  fontSize: '9px', letterSpacing: '2.5px',
                  color: gamingTheme.mutedBlue, textTransform: 'uppercase',
                  marginBottom: '3px',
                }}>Character</div>
                <h2 style={{
                  fontFamily: gamingTheme.fontHeading,
                  fontSize: '18px', fontWeight: 700,
                  color: gamingTheme.stellarWhite,
                }}>
                  {character?.name || 'No Guardian'}
                </h2>
              </div>
              <button onClick={onClose} style={iconBtn}><X size={15} color={gamingTheme.seafoam} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {/* Portrait */}
              <PortraitImage character={character} colors={colors} elemKey={elemKey} />

              {/* Name + element */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{
                  fontFamily: gamingTheme.fontHeading, fontSize: '24px', fontWeight: 700,
                  color: gamingTheme.stellarWhite, marginBottom: '4px',
                }}>
                  {character?.name}
                </h3>
                <p style={{
                  fontFamily: gamingTheme.fontLabel, fontSize: '10px',
                  letterSpacing: '2px', color: colors.primary, textTransform: 'uppercase',
                }}>
                  {character?.element} Guardian
                </p>
              </div>

              {/* Quick stats row */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px', marginBottom: '24px',
              }}>
                {[
                  { label: 'Level', value: level },
                  { label: 'XP', value: xp?.toLocaleString() },
                  { label: 'Streak', value: streak, isStreak: true },
                ].map(({ label, value, isStreak }) => (
                  <div key={label} style={{
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'rgba(61,78,122,0.4)',
                    border: gamingTheme.borderThin,
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontFamily: gamingTheme.fontHeading,
                      fontSize: '18px', fontWeight: 700,
                      color: colors.primary, marginBottom: '2px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    }}>
                      {value}
                      {isStreak && <Flame size={14} color="#FF8C42" />}
                    </div>
                    <div style={{
                      fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                      letterSpacing: '1.5px', color: gamingTheme.mutedBlue,
                      textTransform: 'uppercase',
                    }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Financial Stats */}
              <Section title="Financial Stats" colors={colors}>
                {stats.map(stat => (
                  <div key={stat.name} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontFamily: gamingTheme.fontBody, fontSize: '13px', color: gamingTheme.seafoam }}>{stat.name}</span>
                      <span style={{ fontFamily: gamingTheme.fontLabel, fontSize: '12px', color: gamingTheme.stellarWhite }}>{stat.value}%</span>
                    </div>
                    <div style={{
                      height: '6px', borderRadius: '3px',
                      background: 'rgba(61,78,122,0.5)',
                      overflow: 'hidden',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{
                          height: '100%', borderRadius: '3px',
                          background: `linear-gradient(90deg, ${colors.primary}, ${gamingTheme.mint})`,
                          boxShadow: `0 0 8px ${colors.glow}`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Section>

              {/* Skills */}
              <Section title="Guardian Skills" colors={colors}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {skills.map(skill => (
                    <motion.div
                      key={skill.name}
                      whileHover={{ scale: 1.06 }}
                      title={skill.name}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '12px',
                        background: `rgba(${hexToRgbStr(colors.primary)},0.10)`,
                        border: `1px solid rgba(${hexToRgbStr(colors.primary)},0.3)`,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: '4px', cursor: 'default',
                      }}
                    >
                      <skill.icon size={22} color={colors.primary} />
                      <span style={{
                        fontFamily: gamingTheme.fontLabel,
                        fontSize: '7px', letterSpacing: '0.5px',
                        color: colors.primary, textAlign: 'center',
                        padding: '0 4px',
                      }}>{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </Section>

              {/* Badges */}
              <Section title={`Badges (${unlockedBadges.length}/${badges.length})`} colors={colors}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {badges.map(badge => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.06 }}
                      title={badge.desc}
                      style={{
                        aspectRatio: '1', borderRadius: '12px',
                        background: badge.unlocked
                          ? `rgba(${hexToRgbStr(colors.primary)},0.12)`
                          : 'rgba(47,58,95,0.4)',
                        border: badge.unlocked
                          ? `1px solid rgba(${hexToRgbStr(colors.primary)},0.4)`
                          : gamingTheme.borderThin,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: '3px', cursor: 'default',
                        opacity: badge.unlocked ? 1 : 0.35,
                        filter: badge.unlocked ? 'none' : 'grayscale(1)',
                      }}
                    >
                      {(() => { const BadgeIcon = BADGE_ICON_MAP[badge.id] || Trophy; return <BadgeIcon size={20} color={badge.unlocked ? colors.primary : gamingTheme.mutedBlue} />; })()}
                      <span style={{
                        fontFamily: gamingTheme.fontLabel,
                        fontSize: '7px', letterSpacing: '0.5px',
                        color: badge.unlocked ? colors.primary : gamingTheme.mutedBlue,
                        textAlign: 'center', padding: '0 4px',
                      }}>{badge.name}</span>
                    </motion.div>
                  ))}
                </div>
              </Section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const ELEM_FALLBACK_ICON = { fire: Flame, frost: Snowflake, nature: Leaf };

function PortraitImage({ character, colors, elemKey }) {
  const [loaded, setLoaded] = React.useState(false);
  const FallbackIcon = ELEM_FALLBACK_ICON[elemKey] || Flame;
  return (
    <motion.div
      animate={{ boxShadow: [`0 0 24px ${colors.glow}`, `0 0 48px ${colors.glow}`, `0 0 24px ${colors.glow}`] }}
      transition={{ duration: 2.4, repeat: Infinity }}
      style={{
        width: '100%', height: '340px',
        borderRadius: '16px',
        background: `linear-gradient(160deg, rgba(${hexToRgbStr(colors.primary)},0.18) 0%, ${gamingTheme.bgSecondary} 100%)`,
        border: `2px solid rgba(${hexToRgbStr(colors.primary)},0.5)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px',
        overflow: 'hidden', position: 'relative',
      }}
    >
      {character?.fullImage && (
        <img
          src={character.fullImage}
          alt={character?.name}
          onLoad={() => setLoaded(true)}
          onError={(e) => { e.target.style.display = 'none'; }}
          style={{
            width: '100%', height: '100%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      )}
      {!loaded && (
        <FallbackIcon size={80} color={colors.primary} style={{ position: 'absolute' }} />
      )}
    </motion.div>
  );
}

function Section({ title, colors, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '12px',
      }}>
        <div style={{
          width: '3px', height: '14px', borderRadius: '2px',
          background: colors.primary,
        }} />
        <h4 style={{
          fontFamily: gamingTheme.fontHeading,
          fontSize: '12px', fontWeight: 600,
          color: gamingTheme.stellarWhite,
          textTransform: 'uppercase', letterSpacing: '1.5px',
        }}>{title}</h4>
      </div>
      {children}
    </div>
  );
}

const iconBtn = {
  width: 32, height: 32, borderRadius: '8px',
  background: 'rgba(61,78,122,0.4)',
  border: '1px solid rgba(139,184,233,0.25)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}
