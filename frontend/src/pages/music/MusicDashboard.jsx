import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Flame, Music, BookOpen, Trophy, FileText,
  CheckCircle2, Zap, Cpu, Sliders,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getMusicTierName, getClusterTheme, CLUSTER_MAP } from '../../styles/musicTheme';
import { MUSIC_TOPICS } from '../../data/musicTopics';
import FloatingMentor from '../../components/mentor/FloatingMentor';
import DailyChallengeCard from '../../components/DailyChallengeCard';
import SuggestedForReview from '../../components/SuggestedForReview';
import './MusicDashboard.css';

const ALL_TOPIC_NAMES = [
  'The Music Ecosystem','Rights & Royalties Basics','Streaming Economics','Artist vs Label Deals',
  'Multiple Revenue Streams','Merchandise & Sales Strategy','Sponsorships & Endorsements','Building Your Fan Base',
  'Independent Artist Success','Tour & Event Management','Financial Planning for Musicians','Building a Music Brand',
];

// ─── Cluster card configs ─────────────────────────────────────────────────────
const CLUSTERS = [
  {
    key:    'vinyl',
    path:   '/music/vinyl',
    num:    '01',
    name:   'Vinyl Records',
    genres: 'Urban · Hip-Hop · K-Pop',
    bg:     'radial-gradient(circle at 80% 10%, #2a1213, #130F0D 60%)',
    accent: '#C4C1B8',
  },
  {
    key:    'neon',
    path:   '/music/neon',
    num:    '02',
    name:   'Neon Glitch',
    genres: 'Electronic · EDM · Techno',
    bg:     'linear-gradient(160deg, #1D0225, #260B68 90%)',
    accent: '#C231C9',
  },
  {
    key:    'forest',
    path:   '/music/forest',
    num:    '03',
    name:   'Dreamy Forest',
    genres: 'Ballads · Country · Blues',
    bg:     'radial-gradient(circle at 50% 8%, rgba(215,152,163,.28), #2C1F1B 55%)',
    accent: '#D798A3',
  },
];

// ─── Greeting copy per cluster ────────────────────────────────────────────────
const GREET = {
  vinyl: (name, streak, topics) => {
    const f = name?.split(' ')[0] || 'Artist';
    const h = new Date().getHours();
    if (topics === 0) return [`Welcome to the booth, ${f}.`, 'Drop your first track.'];
    if (streak >= 7)  return [`${f} — ${streak} sessions.`, 'The streets notice.'];
    if (streak >= 3)  return [`${streak} days straight, ${f}.`, 'That\'s the grind.'];
    if (h < 12)       return [`Morning session, ${f}.`, 'Set the tone.'];
    if (h < 18)       return [`Back in the booth, ${f}.`, 'Keep it rolling.'];
    return                   [`Late night session, ${f}.`, 'Best tracks after midnight.'];
  },
  neon: (name, streak, topics) => {
    const f = name?.split(' ')[0] || 'Architect';
    const h = new Date().getHours();
    if (topics === 0) return [`SYSTEM ONLINE — ${f.toUpperCase()}`, 'INITIALIZE FIRST PROTOCOL'];
    if (streak >= 7)  return [`${streak} CONSECUTIVE UPLINKS`, 'DATA STREAM UNBROKEN'];
    if (streak >= 3)  return [`${f.toUpperCase()} — ACTIVE`, `${streak} CYCLES LOGGED`];
    if (h < 12)       return [`DAWN SEQUENCE — ${f.toUpperCase()}`, 'EARLY UPLOAD DETECTED'];
    return                   [`${f.toUpperCase()} — ONLINE`, 'LAB IS HOT'];
  },
  dreamy: (name, streak, topics) => {
    const f = name?.split(' ')[0] || 'Luna';
    const h = new Date().getHours();
    if (topics === 0) return [`Welcome, ${f}.`, 'The forest waits for your voice.'];
    if (streak >= 7)  return [`${f}, seven moons have passed.`, 'The melody carries on.'];
    if (streak >= 3)  return [`Three notes, ${f}.`, 'A song is beginning.'];
    if (h < 12)       return [`Morning light, ${f}.`, 'Sing while the dew is still there.'];
    if (h < 20)       return [`Afternoon reverie, ${f}.`, 'Let the music breathe.'];
    return                   [`Moonrise, ${f}.`, 'The forest hums tonight.'];
  },
};

function getGreeting(cluster, name, streak, topics) {
  const fn = GREET[cluster] || GREET.vinyl;
  return fn(name, streak, topics);
}

// ─── Loading spinner ──────────────────────────────────────────────────────────
function LoadingSpinner({ C }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 14 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid rgba(255,255,255,0.08)`, borderTopColor: C }}
      />
    </div>
  );
}

export default function MusicDashboard() {
  const navigate = useNavigate();
  const { profile, completedTopics, loading: userLoading } = useUser();
  const {
    musicCharacter, musicColor: C, musicCluster,
    xp, streak, tier, tierName, levelProgress, getXPForNextLevel,
    awardXP, onOpenSheet,
  } = useOutletContext();

  // Derive cluster from character id (fallback to vinyl)
  const cluster = musicCluster || CLUSTER_MAP[musicCharacter?.id] || 'vinyl';
  const theme   = getClusterTheme(musicCharacter?.id);

  const xpToNext   = getXPForNextLevel?.() ?? 500;
  const concertHrs = completedTopics.length;
  const allDone    = ALL_TOPIC_NAMES.every(n => completedTopics.includes(n));

  if (userLoading) return <LoadingSpinner C={C} />;

  const [greetLine, subLine] = getGreeting(cluster, profile?.name, streak, completedTopics.length);

  const quickActions = [
    { label: 'The Setlist', sub: 'Browse all lessons',   path: '/music/setlist', Icon: BookOpen  },
    { label: 'The Vault',   sub: 'View achievements',    path: '/music/vault',   Icon: Trophy    },
    { label: 'The Charts',  sub: 'Your stats',           path: '/music/charts',  Icon: FileText  },
    { label: 'The Mixer',   sub: musicCharacter?.name || 'Settings', path: null, Icon: Sliders, action: onOpenSheet },
  ];

  // ── Cluster-specific panel style helpers ──────────────────────────────────
  const panelStyle = (extraBorderColor = C) => ({
    background:      theme.bgCard,
    border:          theme.borderFaint,
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    borderLeftColor: extraBorderColor,
    borderRadius:    8,
    boxShadow:       '0 4px 24px rgba(0,0,0,0.60)',
  });

  // Neon-specific: add subtle inner glow to cards
  const neonCardExtra = cluster === 'neon' ? {
    boxShadow: `0 4px 24px rgba(0,0,0,0.60), inset 0 0 40px rgba(194,49,201,0.04)`,
  } : {};

  return (
    <motion.div
      key={cluster}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className={`music-dashboard music-${cluster}`}
      style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
    >

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Chibi avatar */}
        {musicCharacter && (
          <div style={{
            width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
            border: `3px solid ${C}55`,
            background: musicCharacter.dim || 'rgba(0,0,0,0.3)',
            overflow: 'hidden',
            boxShadow: `0 0 18px ${musicCharacter.glow || C + '40'}`,
          }}>
            <img
              src={musicCharacter.chibiImage}
              alt={musicCharacter.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: C, marginBottom: 4,
        }}>
          {musicCharacter ? `${musicCharacter.name} · Active` : 'The Studio'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h1
            className="music-heading"
            style={{
              fontFamily: theme.fontHeading,
              fontSize: cluster === 'neon' ? 22 : 28,
              color: theme.textPrimary,
              letterSpacing: cluster === 'neon' ? 1 : 2,
              margin: 0, lineHeight: 1,
            }}
          >
            {greetLine}
          </h1>
          <div style={{ flex: 1, height: 1, background: C, opacity: 0.45, position: 'relative' }}>
            <div style={{ position: 'absolute', right: 0, top: '-3.5px', width: 8, height: 8, borderRadius: '50%', background: C, opacity: 0.8 }} />
          </div>
        </div>
        <div style={{ fontFamily: theme.fontBody, fontSize: 12, color: theme.textMuted, marginTop: 6, letterSpacing: '0.03em' }}>
          {subLine}
        </div>
        </div>{/* end flex-1 text column */}
      </div>

      {/* ── Stat row ── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {/* Concert Hours */}
        <div style={{
          background: C, color: '#000',
          padding: '8px 16px', borderRadius: 8,
          fontFamily: theme.fontHeading,
          fontSize: cluster === 'neon' ? 14 : 18,
          letterSpacing: cluster === 'neon' ? 0.5 : 1,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Music size={14} fill="#000" strokeWidth={0} />
          {concertHrs} CONCERT HRS
        </div>

        {/* Tier */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${C}`,
          color: C,
          padding: '8px 16px', borderRadius: 8,
          fontFamily: theme.fontHeading,
          fontSize: cluster === 'neon' ? 14 : 18,
          letterSpacing: cluster === 'neon' ? 0.5 : 1,
        }}>
          TIER {tier} · {tierName.toUpperCase()}
        </div>

        {/* Streak */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${theme.borderFaint.split(' ').slice(2).join(' ')}`,
          color: streak > 0 ? '#fb923c' : theme.textMuted,
          padding: '8px 16px', borderRadius: 8,
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: theme.fontSub, fontSize: 16, fontWeight: 700, letterSpacing: '0.04em',
        }}>
          <Flame size={14} fill={streak > 0 ? '#fb923c' : 'none'} strokeWidth={streak > 0 ? 0 : 1.5} color={streak > 0 ? '#fb923c' : theme.textMuted} />
          {streak} DAY STREAK
        </div>
      </div>

      {/* ── Progress panel ── */}
      <div style={{ ...panelStyle(), ...neonCardExtra, padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.textMuted }}>
            CONCERT POINTS
          </span>
          <span style={{ fontFamily: theme.fontHeading, fontSize: cluster === 'neon' ? 12 : 13, letterSpacing: 1, color: C }}>
            {xp} / {xp + xpToNext}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              height: '100%', borderRadius: 3,
              background: cluster === 'neon'
                ? `linear-gradient(90deg, #C231C9, ${C})`
                : C,
              boxShadow: `0 0 8px ${C}70`,
            }}
          />
        </div>
      </div>


      {/* ── Daily Cipher (music daily challenge) ── */}
      <DailyChallengeCard
        domain="music"
        awardXP={awardXP}
        accent={C}
        theme={{
          surface: theme.bgCard,
          border: theme.borderFaint.replace('1px solid ', ''),
          textPrimary: theme.textPrimary,
          textMuted: theme.textMuted,
          radius: cluster === 'neon' ? 0 : cluster === 'dreamy' ? 16 : 8,
          fontHeading: theme.fontHeading,
          fontBody: theme.fontBody,
          overlayBg: 'rgba(10,8,10,0.94)',
        }}
      />

      {/* ── Suggested for Review (spaced repetition) ── */}
      <SuggestedForReview
        domain="music"
        compact
        accent={C}
        theme={{
          surface: theme.bgCard,
          border: theme.borderFaint.replace('1px solid ', ''),
          textPrimary: theme.textPrimary,
          textMuted: theme.textMuted,
          radius: cluster === 'neon' ? 0 : cluster === 'dreamy' ? 16 : 8,
          fontHeading: theme.fontHeading,
          fontBody: theme.fontBody,
        }}
      />

      {/* ── Daily track ── */}
      <div style={{ ...panelStyle(), ...neonCardExtra, padding: 18 }}>
        <div style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C, marginBottom: 6 }}>
          DAILY TRACK
        </div>

        {allDone ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
            <CheckCircle2 size={32} color={C} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: theme.fontHeading, fontSize: cluster === 'neon' ? 18 : 24, letterSpacing: '1.5px', color: theme.textPrimary, lineHeight: 1, marginBottom: 4 }}>
                {cluster === 'dreamy' ? 'The Album Is Complete' : cluster === 'neon' ? 'ALL PROTOCOLS COMPLETE' : 'All Caught Up!'}
              </div>
              <p style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textMuted, margin: 0 }}>
                {cluster === 'dreamy' ? 'Every verse has been sung. Rest, for now.'
                  : cluster === 'neon' ? 'FULL SYNCHRONIZATION ACHIEVED.'
                  : 'Every track completed. The album is done.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: theme.fontHeading, fontSize: cluster === 'neon' ? 20 : 28, letterSpacing: '1.5px', color: theme.textPrimary, lineHeight: 1, marginBottom: 2 }}>
              {completedTopics.length > 0
                ? (cluster === 'neon' ? 'CONTINUE PROTOCOL' : cluster === 'dreamy' ? 'Continue the Melody' : 'Continue Session')
                : (cluster === 'neon' ? 'INITIALIZE: BUDGETING' : 'Budgeting Basics')}
            </div>
            <div style={{ fontFamily: theme.fontSub, fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              {completedTopics.length > 0 ? `TRACK ${Math.ceil((completedTopics.length + 1) / 5)} · IN PROGRESS` : 'TRACK 1 · INTRO'}
            </div>
            <p style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textSecondary, marginBottom: 16 }}>
              {completedTopics.length > 0
                ? (cluster === 'dreamy' ? 'The next verse awaits your voice.' : cluster === 'neon' ? 'MAINTAIN UPLINK. CONTINUE.' : 'Keep rolling. The drop is coming.')
                : (cluster === 'dreamy' ? 'Begin softly. The first note is the hardest.' : cluster === 'neon' ? 'BOOT SEQUENCE READY. ENGAGE.' : 'First bar. The studio is yours.')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.button
                whileHover={{ filter: 'brightness(1.12)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const nextName = ALL_TOPIC_NAMES.find(n => !completedTopics.includes(n)) || ALL_TOPIC_NAMES[0];
                  const nextData = MUSIC_TOPICS.find(t => t.name === nextName);
                  const idx      = MUSIC_TOPICS.findIndex(t => t.name === nextName);
                  const afterData = idx >= 0 && idx < MUSIC_TOPICS.length - 1 ? MUSIC_TOPICS[idx + 1] : null;
                  navigate('/music/learn', { state: {
                    topic: nextName, topicId: nextData?.id || null,
                    nextTopic: afterData?.name || null, nextTopicId: afterData?.id || null,
                  }});
                }}
                style={{
                  background: C, color: '#000',
                  padding: '10px 22px', borderRadius: 8,
                  fontFamily: theme.fontHeading,
                  fontSize: cluster === 'neon' ? 14 : 18,
                  letterSpacing: '1.5px', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: cluster === 'neon' ? `0 0 18px ${C}60` : 'none',
                }}
              >
                {cluster === 'neon' ? 'EXECUTE' : cluster === 'dreamy' ? 'Sing' : 'RECORD'}
                <ArrowRight size={16} strokeWidth={2.5} />
              </motion.button>
            </div>
          </>
        )}
      </div>

      {/* ── Quick actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {quickActions.map(({ label, sub, path, Icon, action }) => (
          <motion.button
            key={label}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => action ? action() : navigate(path)}
            style={{
              ...panelStyle(),
              ...neonCardExtra,
              padding: 14, cursor: 'pointer', textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 4,
              background: theme.bgCard,
            }}
          >
            <Icon size={16} color={C} strokeWidth={1.8} />
            <div style={{ fontFamily: theme.fontHeading, fontSize: cluster === 'neon' ? 14 : 17, color: theme.textPrimary, letterSpacing: cluster === 'neon' ? 0.5 : 1 }}>
              {label}
            </div>
            <div style={{ fontFamily: theme.fontBody, fontSize: 11, color: theme.textMuted }}>
              {sub}
            </div>
          </motion.button>
        ))}
      </div>

      {/* ── Recent tracks ── */}
      {completedTopics.length > 0 && (
        <div style={{ ...panelStyle('rgba(255,255,255,0.10)'), padding: '14px 16px' }}>
          <div style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.textMuted, marginBottom: 10 }}>
            RECENT TRACKS
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {completedTopics.slice(-6).map((t, i) => (
              <div key={i} style={{
                background: `${C}15`, border: `1px solid ${C}35`, borderRadius: 6, padding: '4px 10px',
                fontFamily: theme.fontBody, fontSize: 12, fontWeight: 600, color: theme.textSecondary,
              }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      <FloatingMentor
        userInterest="music"
        gamingMode={true}
        gamingColors={{ primary: C, glow: `${C}55` }}
      />
    </motion.div>
  );
}
