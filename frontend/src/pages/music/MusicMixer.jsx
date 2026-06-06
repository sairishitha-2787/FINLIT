// Music domain settings — /music/mixer  ("The Mixer")
// Character, difficulty, learning preferences, player stats, data & about.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Shield, Gauge, Sparkles, Database, Info,
  Check, ChevronRight, AlertTriangle, Download, RotateCcw,
  Music, Zap, Cpu, Flame, Trophy, BookOpen, Star,
} from 'lucide-react';
import { useMusic } from '../../contexts/MusicContext';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { useBadgeTracker } from '../../hooks/useBadgeTracker';
import { getClusterTheme, CLUSTER_MAP } from '../../styles/musicTheme';
import { MUSIC_TOPICS } from '../../data/musicTopics';
import { MUSIC_BADGES_CONFIG } from '../../data/musicBadges';
import { supabase } from '../../config/supabase';
import { loadSRPref, saveSRPref } from '../../services/spacedRepetition';

const LS_DIFFICULTY = 'finlit_music_difficulty';
const LS_PREFS      = 'finlit_music_prefs';

const CHAR_ICON = { luna: Music, jay: Zap, cypher: Cpu };

const DIFFICULTIES = [
  { id: 'beginner',     label: 'Beginner',     desc: 'Perfect for learning the basics',       xp: '1.0× XP' },
  { id: 'intermediate', label: 'Intermediate', desc: 'The standard studio experience',         xp: '1.0× XP' },
  { id: 'advanced',     label: 'Advanced',     desc: 'Harder questions, 75% boss pass mark',   xp: '1.25× XP' },
];

const DEFAULT_PREFS = {
  enableGifs:        true,
  enableCelebrations: true,
  showHints:         true,
  reduceMotion:      false,
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(LS_PREFS);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : { ...DEFAULT_PREFS };
  } catch { return { ...DEFAULT_PREFS }; }
}

export default function MusicMixer() {
  const navigate = useNavigate();
  const {
    musicColor: C, musicCharacter, musicCluster,
    xp = 0, streak = 0, tier, tierName,
  } = useOutletContext();

  const { character, clearCharacter, clearDefeatedBosses, defeatedBosses = [] } = useMusic();
  const { user } = useAuth();
  const { profile, completedTopics = [], updateUserProfile } = useUser();
  const { earnedMap = {} } = useBadgeTracker();

  const cluster = musicCluster || CLUSTER_MAP[musicCharacter?.id] || 'vinyl';
  const theme   = getClusterTheme(musicCharacter?.id);
  const color   = C || '#D798A3';
  const glow    = musicCharacter?.glow || `${color}80`;
  const neon    = cluster === 'neon';
  const CharIcon = CHAR_ICON[character?.id] || Music;

  // ── State ──────────────────────────────────────────────────────────────────
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem(LS_DIFFICULTY) || 'beginner');
  const [prefs, setPrefs]           = useState(loadPrefs);
  const [srEnabled, setSrEnabled]   = useState(loadSRPref);
  const [name, setName]             = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [toast, setToast]           = useState(null);
  const [showCharModal, setShowCharModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting]   = useState(false);

  useEffect(() => { if (profile) setName(profile.name || ''); }, [profile]);

  const nameDirty = name !== (profile?.name || '');

  const flashToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleDifficulty = (id) => {
    setDifficulty(id);
    localStorage.setItem(LS_DIFFICULTY, id);
    updateUserProfile?.({ difficulty: id });
    flashToast('Difficulty saved');
  };

  const togglePref = (key) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(LS_PREFS, JSON.stringify(next));
      return next;
    });
    flashToast('Preference saved');
  };

  const handleSaveName = async () => {
    if (!nameDirty) return;
    setNameSaving(true);
    await updateUserProfile?.({ name, difficulty });
    setNameSaving(false);
    flashToast('Name saved');
  };

  const handleChangeCharacter = () => {
    clearCharacter();          // MusicLayout shows the character selector when character === null
    navigate('/music');
  };

  const handleExport = () => {
    const earned = MUSIC_BADGES_CONFIG.filter(b => earnedMap[b.id])
      .map(b => ({ id: b.id, name: b.name, tier: b.tier, earnedAt: earnedMap[b.id] }));
    const data = {
      exportedAt: new Date().toISOString(),
      domain: 'music',
      player: profile?.name || user?.email || 'Player',
      character: character?.id || null,
      difficulty,
      concertPoints: xp,
      tier, tierName, streak,
      completedTopics,
      defeatedBosses,
      badgesEarned: earned,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `finlit-music-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    flashToast('Progress exported');
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      if (user) {
        const musicTopicNames = MUSIC_TOPICS.map(t => t.name);
        const musicBadgeIds   = MUSIC_BADGES_CONFIG.map(b => b.id);
        // Domain-scoped deletes (music identifiers are distinct from other domains)
        await supabase.from('progress').delete().eq('user_id', user.id).in('topic', musicTopicNames);
        await supabase.from('user_badges').delete().eq('user_id', user.id).in('badge_id', musicBadgeIds);
      }
      clearDefeatedBosses();           // music bosses live in localStorage
    } catch (err) {
      console.error('[MusicMixer] reset error:', err);
    }
    setResetting(false);
    setShowResetModal(false);
    // Hard reload so UserContext / badge tracker re-fetch clean state
    window.location.href = '/music';
  };

  // ── Derived player stats ───────────────────────────────────────────────────
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';
  const topicsDone  = MUSIC_TOPICS.filter(t => completedTopics.includes(t.name)).length;
  const badgesDone  = MUSIC_BADGES_CONFIG.filter(b => earnedMap[b.id]).length;

  // ── Shared styles ────────────────────────────────────────────────────────
  const cardStyle = {
    background: theme.bgCard,
    border: `1px solid ${color}1f`,
    borderRadius: neon ? 0 : cluster === 'dreamy' ? 14 : 10,
    overflow: 'hidden',
    ...(cluster === 'dreamy' ? { backdropFilter: 'blur(14px)' } : {}),
    ...(neon ? { clipPath: 'polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)' } : {}),
  };

  const Section = ({ title, icon: Icon, children }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: theme.fontSub, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.textMuted, marginBottom: 8, padding: '0 2px' }}>
        {Icon && <Icon size={11} strokeWidth={2} />} {title}
      </div>
      <div style={cardStyle}>{children}</div>
    </div>
  );

  const Row = ({ label, desc, right, onClick, danger, last }) => (
    <motion.div
      whileHover={onClick ? { backgroundColor: 'rgba(255,255,255,0.02)' } : {}}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px',
        backgroundColor: 'rgba(255,255,255,0)',
        borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
        <div style={{ fontFamily: theme.fontBody, fontSize: 14, color: danger ? '#f87171' : theme.textPrimary, marginBottom: desc ? 2 : 0 }}>{label}</div>
        {desc && <div style={{ fontFamily: theme.fontBody, fontSize: 11, color: theme.textMuted }}>{desc}</div>}
      </div>
      {right}
    </motion.div>
  );

  const Toggle = ({ on, onToggle }) => (
    <button
      onClick={onToggle}
      role="switch" aria-checked={on}
      style={{
        width: 42, height: 24, borderRadius: 99, flexShrink: 0, cursor: 'pointer', position: 'relative',
        border: `1px solid ${on ? color : 'rgba(255,255,255,0.18)'}`,
        background: on ? `${color}cc` : 'rgba(255,255,255,0.08)',
        transition: 'all 0.2s',
      }}
    >
      <motion.div
        animate={{ x: on ? 19 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{ position: 'absolute', top: 2, left: 0, width: 18, height: 18, borderRadius: '50%', background: on ? '#000' : '#fff' }}
      />
    </button>
  );

  return (
    <motion.div
      key={cluster}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={`music-mixer music-${cluster}`}
      style={{ padding: '24px 16px 60px', maxWidth: 620, margin: '0 auto' }}
    >
      {/* ── Header ── */}
      <div style={{ marginBottom: 26 }}>
        <div style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color, marginBottom: 4 }}>
          Music Domain
        </div>
        <h1 className="music-heading" style={{ fontFamily: theme.fontHeading, fontSize: neon ? 26 : 38, letterSpacing: neon ? 2 : 3, color: theme.textPrimary, margin: '0 0 4px', lineHeight: 1, textShadow: `0 0 20px ${glow}` }}>
          THE MIXER
        </h1>
        <p style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textMuted }}>
          Customize your studio experience
        </p>
      </div>

      {/* ── CHARACTER ── */}
      <Section title="Character" icon={User}>
        {character ? (
          <Row
            last
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: character.dim, border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: `0 0 10px ${character.glow}` }}>
                  {character.chibiImage
                    ? <img src={character.chibiImage} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} onError={e => { e.target.style.display = 'none'; }} />
                    : <CharIcon size={22} color={color} />}
                </div>
                <div>
                  <div style={{ fontFamily: theme.fontHeading, fontSize: 20, letterSpacing: 1, color, lineHeight: 1 }}>{character.name}</div>
                  <div style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.textMuted, marginTop: 2 }}>{character.title}</div>
                </div>
              </div>
            }
            right={
              <motion.button whileHover={{ x: 2 }} onClick={() => setShowCharModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 6, background: `${color}15`, border: `1px solid ${color}40`, fontFamily: theme.fontSub, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color, cursor: 'pointer', flexShrink: 0 }}>
                CHANGE <ChevronRight size={12} />
              </motion.button>
            }
          />
        ) : (
          <Row last label="No character selected" desc="Choose your mentor to begin" onClick={() => navigate('/music')} right={<ChevronRight size={16} color="rgba(255,255,255,0.3)" />} />
        )}
      </Section>

      {/* ── DIFFICULTY ── */}
      <Section title="Difficulty" icon={Shield}>
        {DIFFICULTIES.map((d, i) => {
          const sel = difficulty === d.id;
          return (
            <Row
              key={d.id}
              last={i === DIFFICULTIES.length - 1}
              label={d.label}
              desc={d.desc}
              onClick={() => handleDifficulty(d.id)}
              right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: theme.fontSub, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: sel ? color : 'rgba(255,255,255,0.25)', padding: '2px 6px', borderRadius: 4, background: sel ? `${color}15` : 'transparent', border: `1px solid ${sel ? color + '40' : 'transparent'}` }}>{d.xp}</span>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${sel ? color : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: sel ? color : 'transparent', flexShrink: 0 }}>
                    {sel && <Check size={10} color="#000" strokeWidth={3} />}
                  </div>
                </div>
              }
            />
          );
        })}
      </Section>

      {/* ── PLAYER STATS (read-only) ── */}
      <Section title="Player Stats" icon={Gauge}>
        {[
          { Icon: Star,     label: 'Concert Points', val: xp.toLocaleString() },
          { Icon: Gauge,    label: 'Tier',           val: `${tier} · ${tierName}` },
          { Icon: BookOpen, label: 'Topics Completed', val: `${topicsDone}/${MUSIC_TOPICS.length}` },
          { Icon: Trophy,   label: 'Badges Earned',  val: `${badgesDone}/${MUSIC_BADGES_CONFIG.length}` },
          { Icon: Flame,    label: 'Current Streak',  val: `${streak} day${streak === 1 ? '' : 's'}` },
        ].map((s, i, arr) => (
          <Row key={s.label} last={i === arr.length - 1} label={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <s.Icon size={15} color={color} strokeWidth={1.8} />
              <span style={{ fontFamily: theme.fontBody, fontSize: 14, color: theme.textSecondary }}>{s.label}</span>
            </div>
          } right={<span style={{ fontFamily: theme.fontHeading, fontSize: 16, letterSpacing: 0.5, color }}>{s.val}</span>} />
        ))}
      </Section>

      {/* ── LEARNING PREFERENCES ── */}
      <Section title="Learning Preferences" icon={Sparkles}>
        {[
          { key: 'enableGifs',         label: 'Quiz GIFs',           desc: 'Show reaction GIFs after answering' },
          { key: 'enableCelebrations', label: 'Celebration Effects', desc: 'Confetti and animations on wins' },
          { key: 'showHints',          label: 'Learning Hints',      desc: 'Show helpful hints during lessons' },
          { key: 'reduceMotion',       label: 'Reduce Motion',       desc: 'Minimize background animations' },
        ].map((p, i) => (
          <Row key={p.key} label={p.label} desc={p.desc}
            right={<Toggle on={prefs[p.key]} onToggle={() => togglePref(p.key)} />} />
        ))}
        <Row last
          label="Spaced Repetition"
          desc="Smart suggestions for topics to review"
          right={<Toggle on={srEnabled} onToggle={() => { const v = !srEnabled; setSrEnabled(v); saveSRPref(v); flashToast('Preference saved'); }} />} />
      </Section>

      {/* ── ACCOUNT ── */}
      <Section title="Account" icon={User}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '13px 16px' }}>
          <div style={{ fontFamily: theme.fontSub, fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', color: theme.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>Display Name</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{ flex: 1, padding: '8px 12px', fontFamily: theme.fontBody, fontSize: 14, color: theme.textPrimary, background: 'rgba(255,255,255,0.06)', border: `1px solid ${nameDirty ? color : 'rgba(255,255,255,0.12)'}`, borderRadius: 8, outline: 'none', transition: 'border-color 0.2s' }}
            />
            <AnimatePresence>
              {nameDirty && (
                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSaveName} disabled={nameSaving}
                  style={{ padding: '8px 14px', borderRadius: 8, background: color, border: 'none', cursor: 'pointer', fontFamily: theme.fontSub, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000', flexShrink: 0, opacity: nameSaving ? 0.7 : 1 }}>
                  {nameSaving ? '…' : 'SAVE'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Row label="Email" desc={user?.email || '—'} />
        <Row last label="Member since" desc={memberSince} />
      </Section>

      {/* ── DATA & ACCOUNT ── */}
      <Section title="Data" icon={Database}>
        <Row
          label="Export Progress"
          desc="Download your music progress as JSON"
          onClick={handleExport}
          right={<Download size={16} color={color} />}
        />
        <Row
          last
          danger
          label="Reset Music Progress"
          desc="Clear topics, quizzes, badges & bosses"
          onClick={() => setShowResetModal(true)}
          right={<RotateCcw size={16} color="#f87171" />}
        />
      </Section>

      {/* ── ABOUT ── */}
      <Section title="About & Support" icon={Info}>
        <Row label="FINLIT Version" desc="v1.0.0 · Music build" />
        <Row label="Support" onClick={() => window.open('mailto:support@finlit.app', '_blank')} right={<ChevronRight size={16} color="rgba(255,255,255,0.3)" />} />
        <Row label="Report a Bug" onClick={() => window.open('mailto:support@finlit.app?subject=Bug%20Report%20(Music)', '_blank')} right={<ChevronRight size={16} color="rgba(255,255,255,0.3)" />} />
        <Row last label="Send Feedback" onClick={() => window.open('mailto:support@finlit.app?subject=Feedback%20(Music)', '_blank')} right={<ChevronRight size={16} color="rgba(255,255,255,0.3)" />} />
      </Section>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9000, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 99, background: color, color: '#000', fontFamily: theme.fontSub, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', boxShadow: `0 8px 28px ${glow}` }}>
            <Check size={14} strokeWidth={3} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Change character confirm ── */}
      <AnimatePresence>
        {showCharModal && (
          <ConfirmModal
            theme={theme} color={color} icon={null}
            title="CHANGE CHARACTER?"
            body="You'll go to the character selection screen. Your progress, XP, and streak are not affected."
            confirmLabel="CHANGE"
            onConfirm={handleChangeCharacter}
            onCancel={() => setShowCharModal(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Reset progress confirm ── */}
      <AnimatePresence>
        {showResetModal && (
          <ConfirmModal
            theme={theme} color={color} danger busy={resetting}
            title="RESET PROGRESS?"
            body="This permanently clears your music topics, quiz scores, badges, and boss wins. Your character and settings are kept. This cannot be undone."
            confirmLabel={resetting ? 'RESETTING…' : 'RESET'}
            onConfirm={handleReset}
            onCancel={() => !resetting && setShowResetModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Confirm modal ───────────────────────────────────────────────────────────
function ConfirmModal({ title, body, confirmLabel, onConfirm, onCancel, danger, busy, theme, color }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{ background: theme.bgCard, border: danger ? '1px solid rgba(248,113,113,0.3)' : `1px solid ${color}30`, borderRadius: 14, padding: '28px 24px', maxWidth: 360, width: '100%', backdropFilter: 'blur(20px)' }}
      >
        {danger && (
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertTriangle size={20} color="#f87171" />
          </div>
        )}
        <div style={{ fontFamily: theme.fontHeading, fontSize: 22, letterSpacing: 1.5, color: theme.textPrimary, textAlign: 'center', marginBottom: 10 }}>{title}</div>
        <div style={{ fontFamily: theme.fontBody, fontSize: 13, lineHeight: 1.6, color: theme.textMuted, textAlign: 'center', marginBottom: 24 }}>{body}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={busy}
            style={{ flex: 1, padding: '11px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: busy ? 'default' : 'pointer', fontFamily: theme.fontSub, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.textMuted }}>
            CANCEL
          </button>
          <button onClick={onConfirm} disabled={busy}
            style={{ flex: 1, padding: '11px', background: danger ? '#f87171' : color, border: 'none', borderRadius: 8, cursor: busy ? 'default' : 'pointer', fontFamily: theme.fontSub, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000', opacity: busy ? 0.7 : 1 }}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
