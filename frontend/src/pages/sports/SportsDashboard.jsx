import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Zap, BookOpen, Trophy, FileText, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { sportsTheme, getDivisionName } from '../../styles/sportsTheme';
import FloatingMentor from '../../components/mentor/FloatingMentor';
import DailyChallengeCard from '../../components/DailyChallengeCard';
import SuggestedForReview from '../../components/SuggestedForReview';
import DailyGlossaryCard from '../../components/DailyGlossaryCard';

const ALL_TOPIC_NAMES = [
  'Budgeting Basics','Saving 101','Income Tracking','Emergency Funds',
  'Investment Basics','Debt Management','Credit Scores','Tax Fundamentals',
  'Portfolio Building','Retirement Planning','Real Estate','Wealth Building',
];

function LoadingSpinner({ C }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 14 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: C }}
      />
      <div style={{ fontFamily: sportsTheme.fontSub, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
        LOADING...
      </div>
    </div>
  );
}

// ─── Broadcast panel card ─────────────────────────────────────────────────────
function Panel({ color, children, style = {} }) {
  return (
    <div style={{
      background: sportsTheme.bgCard,
      // Use side-specific shorthands only — never mix the `border` shorthand
      // with `borderLeft`, which triggers React's style-conflict warning.
      borderTop: sportsTheme.borderFaint,
      borderRight: sportsTheme.borderFaint,
      borderBottom: sportsTheme.borderFaint,
      borderLeft: `3px solid ${color}`,
      borderRadius: '8px',
      boxShadow: sportsTheme.cardShadow,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Commentary lines ─────────────────────────────────────────────────────────
const COMMENTARY = [
  (s) => s > 0 ? `${s}-day win streak. Don't stop now.` : `First whistle. Get in the game.`,
  (_, t) => t > 0 ? `${t} drills mastered. Keep climbing.` : `Half time. Start your first drill.`,
  () => `The Playmaker is watching. Complete your daily drill.`,
  () => `Full time glory is 90 minutes away. Make your move.`,
  () => `Division 1 is at the top of the table. Start climbing.`,
];

function getSportsGreeting(name, streak, topicsCount) {
  const first = name?.split(' ')[0] || 'Player';
  const h = new Date().getHours();
  if (topicsCount === 0) return [`Welcome to the squad, ${first}.`, 'The first whistle awaits.'];
  if (streak >= 14)     return [`${first}. 14-day unbeaten run.`, 'The whole division is watching.'];
  if (streak >= 7)      return [`Week warrior, ${first}.`, `${streak} sessions. You don't miss.`];
  if (streak >= 3)      return [`${first} — ${streak} days straight.`, "That's what champions are made of."];
  if (h < 6)            return [`Pre-dawn training, ${first}.`, 'Nobody outworks you.'];
  if (h < 12)           return [`Morning session, ${first}.`, 'First whistle. Set the tone.'];
  if (h < 17)           return [`Back on the pitch, ${first}.`, 'Afternoon push. Make it count.'];
  if (h < 21)           return [`Evening drills, ${first}.`, 'Sharpen up before full time.'];
  return                       [`Night training, ${first}.`, 'Champions never clock out.'];
}

export default function SportsDashboard() {
  const navigate = useNavigate();
  const { profile, completedTopics, loading: userLoading } = useUser();
  const {
    sportsCharacter, sportsColor,
    xp, streak, division, levelProgress, getXPForNextLevel,
    awardXP, onOpenSheet,
  } = useOutletContext();

  const C          = sportsColor;
  const xpToNext   = getXPForNextLevel?.() ?? 500;
  const divName    = getDivisionName(division);
  const commentary = COMMENTARY[new Date().getDate() % COMMENTARY.length](streak, completedTopics.length);
  const allDone    = ALL_TOPIC_NAMES.every(name => completedTopics.includes(name));

  if (userLoading) return <LoadingSpinner C={C} />;

  const quickActions = [
    { label: 'The Playbook', sub: 'Browse all drills',  path: '/sports/playbook',      Icon: BookOpen  },
    { label: 'Trophy Case',  sub: 'View achievements',  path: '/sports/achievements',   Icon: Trophy    },
    { label: 'Scoreboard',   sub: 'Your stats',         path: '/sports/progress',       Icon: FileText  },
    { label: 'Player Card',  sub: sportsCharacter?.name || 'Select archetype', path: null, Icon: Zap, action: onOpenSheet },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {/* ── Page header ── */}
      {(() => {
        const [greetLine, subLine] = getSportsGreeting(profile?.name, streak, completedTopics.length);
        return (
          <div>
            <div style={{
              fontFamily: sportsTheme.fontSub, fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: C, marginBottom: '4px',
            }}>
              {sportsCharacter ? `${sportsCharacter.name} · Active` : 'The Tunnel'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <h1 style={{
                fontFamily: sportsTheme.fontHeading,
                fontSize: '28px', color: sportsTheme.textPrimary,
                letterSpacing: '2px', margin: 0, lineHeight: 1,
              }}>
                {greetLine}
              </h1>
              <div style={{ flex: 1, height: '1px', background: C, opacity: 0.45, position: 'relative' }}>
                <div style={{ position: 'absolute', right: 0, top: '-3.5px', width: '8px', height: '8px', borderRadius: '50%', background: C, opacity: 0.8 }} />
              </div>
            </div>
            <div style={{
              fontFamily: sportsTheme.fontSub, fontSize: '12px',
              color: 'rgba(255,255,255,0.45)', marginTop: '6px',
              letterSpacing: '0.05em',
            }}>
              {subLine}
            </div>
          </div>
        );
      })()}

      {/* ── Stat row ── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {/* Points */}
        <div style={{
          background: C, color: '#000',
          padding: '8px 16px', borderRadius: '8px',
          fontFamily: sportsTheme.fontHeading,
          fontSize: '18px', letterSpacing: '1px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Zap size={14} fill="#000" strokeWidth={0} />
          {xp?.toLocaleString()} POINTS
        </div>

        {/* Division */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${C}`,
          color: C,
          padding: '8px 16px', borderRadius: '8px',
          fontFamily: sportsTheme.fontHeading,
          fontSize: '18px', letterSpacing: '1px',
        }}>
          DIV {division} · {divName.toUpperCase()}
        </div>

        {/* Streak */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.13)',
          color: streak > 0 ? '#fb923c' : sportsTheme.textMuted,
          padding: '8px 16px', borderRadius: '8px',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontFamily: sportsTheme.fontSub,
          fontSize: '16px', fontWeight: 700,
          letterSpacing: '0.04em',
        }}>
          <Flame
            size={14}
            fill={streak > 0 ? '#fb923c' : 'none'}
            strokeWidth={streak > 0 ? 0 : 1.5}
            color={streak > 0 ? '#fb923c' : sportsTheme.textMuted}
          />
          {streak} WIN STREAK
        </div>
      </div>

      {/* ── Match progress ── */}
      <Panel color={C} style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{
            fontFamily: sportsTheme.fontSub,
            fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: sportsTheme.textMuted,
          }}>
            MATCH PROGRESS
          </span>
          <span style={{
            fontFamily: sportsTheme.fontHeading,
            fontSize: '13px', letterSpacing: '1px', color: C,
          }}>
            {xp} / {xp + xpToNext}
          </span>
        </div>
        <div style={{
          height: '6px', borderRadius: '3px',
          background: 'rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              height: '100%', borderRadius: '3px',
              background: C,
              boxShadow: `0 0 8px ${C}70`,
            }}
          />
        </div>
        <p style={{
          marginTop: '10px',
          fontFamily: sportsTheme.fontBody,
          fontSize: '12px',
          color: sportsTheme.textMuted,
        }}>
          {commentary}
        </p>
      </Panel>

      {/* ── Daily Cipher (sports daily challenge) ── */}
      <DailyChallengeCard
        domain="sports"
        awardXP={awardXP}
        accent={C}
        theme={{
          surface: sportsTheme.bgCard,
          border: 'rgba(255,255,255,0.07)',
          textPrimary: sportsTheme.textPrimary,
          textMuted: sportsTheme.textMuted,
          radius: 8,
          fontHeading: sportsTheme.fontHeading,
          fontBody: sportsTheme.fontBody,
          overlayBg: 'rgba(15,15,15,0.94)',
        }}
      />

      {/* ── Daily Glossary term ── */}
      <DailyGlossaryCard />

      {/* ── Suggested for Review (spaced repetition) ── */}
      <SuggestedForReview
        domain="sports"
        compact
        accent={C}
        theme={{ surface: sportsTheme.bgCard, border: 'rgba(255,255,255,0.10)', textPrimary: sportsTheme.textPrimary, textMuted: sportsTheme.textMuted, radius: 8, fontHeading: sportsTheme.fontHeading, fontBody: sportsTheme.fontBody }}
      />

      {/* ── Daily drill card ── */}
      <Panel color={C} style={{ padding: '18px' }}>
        <div style={{
          fontFamily: sportsTheme.fontSub,
          fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: C, marginBottom: '6px',
        }}>
          DAILY DRILL
        </div>

        {allDone ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
            <CheckCircle2 size={32} color={C} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            <div>
              <div style={{
                fontFamily: sportsTheme.fontHeading,
                fontSize: '24px', letterSpacing: '1.5px',
                color: sportsTheme.textPrimary, lineHeight: 1, marginBottom: '4px',
              }}>
                All Caught Up!
              </div>
              <p style={{ fontFamily: sportsTheme.fontBody, fontSize: '13px', color: sportsTheme.textMuted, margin: 0 }}>
                Every drill completed. Full time. Championship won.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              fontFamily: sportsTheme.fontHeading,
              fontSize: '28px', letterSpacing: '1.5px',
              color: sportsTheme.textPrimary, lineHeight: 1, marginBottom: '2px',
            }}>
              {completedTopics.length > 0 ? 'Continue Training' : 'Budgeting Basics'}
            </div>

            <div style={{
              fontFamily: sportsTheme.fontSub,
              fontSize: '11px', fontWeight: 600,
              color: sportsTheme.textMuted,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              {completedTopics.length > 0 ? `CH. ${Math.ceil((completedTopics.length + 1) / 5)} · IN PROGRESS` : 'CH. 1 · PRE-SEASON'}
            </div>

            <p style={{
              fontFamily: sportsTheme.fontBody,
              fontSize: '13px',
              color: sportsTheme.textSecondary,
              marginBottom: '16px',
            }}>
              {completedTopics.length > 0 ? 'Half time. Keep pushing.' : 'First whistle. The match is about to start.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.button
                whileHover={{ filter: 'brightness(1.12)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/sports/playbook')}
                style={{
                  background: C, color: '#000',
                  padding: '10px 22px', borderRadius: '8px',
                  fontFamily: sportsTheme.fontHeading,
                  fontSize: '18px', letterSpacing: '1.5px',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                RESUME <ArrowRight size={16} strokeWidth={2.5} />
              </motion.button>
            </div>
          </>
        )}
      </Panel>

      {/* ── Quick actions grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {quickActions.map(({ label, sub, path, Icon, action }) => (
          <motion.button
            key={label}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => action ? action() : navigate(path)}
            style={{
              background: sportsTheme.bgCard,
              borderTop: sportsTheme.borderFaint,
              borderRight: sportsTheme.borderFaint,
              borderBottom: sportsTheme.borderFaint,
              borderLeft: `3px solid ${C}`,
              borderRadius: '8px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
              padding: '14px',
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: '4px',
            }}
          >
            <Icon size={16} color={C} strokeWidth={1.8} />
            <div style={{
              fontFamily: sportsTheme.fontHeading,
              fontSize: '17px', color: sportsTheme.textPrimary,
              letterSpacing: '1px',
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: sportsTheme.fontBody,
              fontSize: '11px', color: sportsTheme.textMuted,
            }}>
              {sub}
            </div>
          </motion.button>
        ))}
      </div>

      {/* ── Recent form ── */}
      {completedTopics.length > 0 && (
        <Panel color="rgba(255,255,255,0.10)" style={{ padding: '14px 16px' }}>
          <div style={{
            fontFamily: sportsTheme.fontSub,
            fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: sportsTheme.textMuted, marginBottom: '10px',
          }}>
            RECENT FORM
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {completedTopics.slice(-6).map((t, i) => (
              <div key={i} style={{
                background: `${C}15`,
                border: `1px solid ${C}35`,
                borderRadius: '6px', padding: '4px 10px',
                fontFamily: sportsTheme.fontSub,
                fontSize: '12px', fontWeight: 600,
                color: sportsTheme.textSecondary,
              }}>
                {t}
              </div>
            ))}
          </div>
        </Panel>
      )}

      <FloatingMentor
        userInterest="sports"
        gamingMode={true}
        gamingColors={{ primary: C, glow: `${C}55` }}
      />
    </motion.div>
  );
}
