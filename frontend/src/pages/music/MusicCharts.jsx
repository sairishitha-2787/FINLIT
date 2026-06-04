// Music domain scoreboard — /music/charts  ("The Charts")
// Comprehensive progress + performance overview, cluster-themed.

import React, { useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame, Music, Target, Trophy, CheckCircle2, Lock, Award,
  TrendingUp, Star, Clock, ArrowRight,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { useMusic } from '../../contexts/MusicContext';
import { useBadgeTracker } from '../../hooks/useBadgeTracker';
import { getClusterTheme, CLUSTER_MAP } from '../../styles/musicTheme';
import { MUSIC_TOPICS } from '../../data/musicTopics';
import { MUSIC_BOSSES } from '../../data/musicBosses';
import { MUSIC_BADGES_CONFIG } from '../../data/musicBadges';

// ── Season metadata ───────────────────────────────────────────────────────────
const SEASONS = [
  { id: 0, label: 'SEASON 1', title: 'Industry Foundations' },
  { id: 1, label: 'SEASON 2', title: 'Revenue & Growth' },
  { id: 2, label: 'SEASON 3', title: 'Mastery & Independence' },
];

// ── Concert Division ladder (XP milestones) ───────────────────────────────────
const DIVISIONS = [
  { name: 'Listener',     min: 0 },
  { name: 'Collaborator', min: 1000 },
  { name: 'Producer',     min: 5000 },
  { name: 'Headliner',    min: 15000 },
  { name: 'Legend',       min: 30000 },
];

function getDivision(xp) {
  let cur = DIVISIONS[0], next = null;
  for (let i = 0; i < DIVISIONS.length; i++) {
    if (xp >= DIVISIONS[i].min) { cur = DIVISIONS[i]; next = DIVISIONS[i + 1] || null; }
  }
  return { cur, next };
}

// ── Rarity palette ─────────────────────────────────────────────────────────────
const RARITY = [
  { tier: 'common',    label: 'Common',    color: '#9ca3af' },
  { tier: 'rare',      label: 'Rare',      color: '#60a5fa' },
  { tier: 'epic',      label: 'Epic',      color: '#a78bfa' },
  { tier: 'legendary', label: 'Legendary', color: '#fbbf24' },
];

// ── Relative time ──────────────────────────────────────────────────────────────
function relTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d === 1) return 'yesterday';
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Radial gauge (pure SVG) ─────────────────────────────────────────────────────
function Gauge({ pct, color, theme, size = 132 }) {
  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={9} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: theme.fontHeading, fontSize: 34, color, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontFamily: theme.fontSub, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.textMuted, marginTop: 2 }}>Avg Score</span>
      </div>
    </div>
  );
}

// ── Loading spinner ──────────────────────────────────────────────────────────
function LoadingSpinner({ C, theme }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 14 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: C }} />
      <div style={{ fontFamily: theme.fontSub, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>LOADING…</div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export default function MusicCharts() {
  const navigate = useNavigate();
  const { completedTopics = [], stats, loading: userLoading } = useUser();
  const { user } = useAuth();
  const { defeatedBosses = [] } = useMusic();
  const { earnedMap = {} } = useBadgeTracker();

  const {
    musicColor: C, musicCharacter, musicCluster,
    xp = 0, level = 1, streak = 0, tier, tierName, levelProgress = 0, getXPForNextLevel,
  } = useOutletContext();

  const cluster = musicCluster || CLUSTER_MAP[musicCharacter?.id] || 'vinyl';
  const theme   = getClusterTheme(musicCharacter?.id);
  const color   = C || '#D798A3';
  const glow    = musicCharacter?.glow || `${color}80`;
  const neon    = cluster === 'neon';
  const HEAD    = (big, sm = 0) => (neon ? big - sm - 4 : big);

  const PREVIEW = ['hannie@gmail.com'].includes(user?.email?.toLowerCase());

  // ── Derived stats ───────────────────────────────────────────────────────
  const xpToNext   = getXPForNextLevel?.() ?? 500;
  const avgScore   = Math.round(stats?.averageScore ?? 0);
  const totalTopics = MUSIC_TOPICS.length; // 12
  const topicsDone = MUSIC_TOPICS.filter(t => completedTopics.includes(t.name)).length;
  const bossesDone = MUSIC_BOSSES.filter(b => defeatedBosses.includes(b.id)).length;
  const { cur: division, next: nextDiv } = getDivision(xp);

  // Badge counts by rarity
  const badgeStats = useMemo(() => {
    const totals = {}, earned = {};
    RARITY.forEach(r => { totals[r.tier] = 0; earned[r.tier] = 0; });
    MUSIC_BADGES_CONFIG.forEach(b => {
      totals[b.tier] = (totals[b.tier] || 0) + 1;
      if (PREVIEW || earnedMap[b.id]) earned[b.tier] = (earned[b.tier] || 0) + 1;
    });
    const totalEarned = Object.values(earned).reduce((a, n) => a + n, 0);
    return { totals, earned, totalEarned, totalBadges: MUSIC_BADGES_CONFIG.length };
  }, [earnedMap, PREVIEW]);

  // Recent activity (real earned-badge timestamps, newest first)
  const recent = useMemo(() => {
    return Object.entries(earnedMap)
      .map(([id, at]) => {
        const cfg = MUSIC_BADGES_CONFIG.find(b => b.id === id);
        return cfg ? { name: cfg.name, at, tier: cfg.tier } : null;
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 10);
  }, [earnedMap]);

  if (userLoading) return <LoadingSpinner C={color} theme={theme} />;

  // ── Reusable panel ────────────────────────────────────────────────────────
  const panel = (extra = {}) => ({
    background: theme.bgCard,
    border: `1px solid ${color}22`,
    borderLeft: `3px solid ${color}`,
    borderRadius: neon ? 0 : cluster === 'dreamy' ? 16 : 8,
    ...(cluster === 'dreamy' ? { backdropFilter: 'blur(14px)' } : {}),
    ...(neon ? { clipPath: 'polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)' } : {}),
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    ...extra,
  });

  const sectionLabel = (txt) => (
    <div style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.textMuted, marginBottom: 10 }}>
      {txt}
    </div>
  );

  return (
    <motion.div
      key={cluster}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={`music-charts music-${cluster}`}
      style={{ padding: '24px 18px 60px', maxWidth: 920, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* ── Page title ── */}
      <div>
        <div style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: 4 }}>
          Music Domain
        </div>
        <h1 className="music-heading" style={{ fontFamily: theme.fontHeading, fontSize: HEAD(34), letterSpacing: neon ? 2 : 3, color: theme.textPrimary, margin: 0, lineHeight: 1, textShadow: `0 0 20px ${glow}` }}>
          THE CHARTS
        </h1>
      </div>

      {/* ── Overview / Division card ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ ...panel(), padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color, marginBottom: 4 }}>
              {musicCharacter ? `${musicCharacter.name} · Active` : 'Your Standing'}
            </div>
            <div style={{ fontFamily: theme.fontHeading, fontSize: HEAD(30), color: theme.textPrimary, letterSpacing: neon ? 1 : 1.5, lineHeight: 1 }}>
              {division.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: theme.fontBody, fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
              Tier {tier} · {tierName} · Level {level}
            </div>
          </div>
          <div style={{ fontFamily: theme.fontHeading, fontSize: HEAD(52), color, letterSpacing: 2, lineHeight: 1, textShadow: `0 0 24px ${glow}`, flexShrink: 0 }}>
            {level}
          </div>
        </div>

        {/* Level progress */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.textMuted }}>
              CONCERT POINTS · LVL {level} → {level + 1}
            </span>
            <span style={{ fontFamily: theme.fontHeading, fontSize: 13, letterSpacing: 1, color }}>
              {xp} / {xp + xpToNext}
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${levelProgress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 99, background: neon ? `linear-gradient(90deg, #C231C9, ${color})` : color, boxShadow: `0 0 10px ${color}80` }} />
          </div>
          {nextDiv && (
            <p style={{ marginTop: 8, fontFamily: theme.fontBody, fontSize: 11, color: theme.textMuted }}>
              {nextDiv.min - xp > 0 ? `${nextDiv.min - xp} CP to ${nextDiv.name}` : `${nextDiv.name} reached`}
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Stat grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
        {[
          { label: 'Concert Points', value: xp,                       Icon: TrendingUp, col: color },
          { label: 'Day Streak',     value: streak,                   Icon: Flame,      col: streak > 0 ? '#fb923c' : theme.textMuted },
          { label: 'Topics Done',    value: `${topicsDone}/${totalTopics}`, Icon: Music, col: color },
          { label: 'Avg Score',      value: `${avgScore}%`,           Icon: Target,     col: '#a78bfa' },
          { label: 'Bosses',         value: `${bossesDone}/3`,        Icon: Trophy,     col: color },
          { label: 'Badges',         value: `${badgeStats.totalEarned}/${badgeStats.totalBadges}`, Icon: Award, col: '#fbbf24' },
        ].map(({ label, value, Icon, col }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            style={{ ...panel({ borderLeft: `3px solid ${col}` }), padding: 14, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: `${col}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={17} color={col} strokeWidth={1.8} fill={label === 'Day Streak' && streak > 0 ? '#fb923c' : 'none'} />
            </div>
            <div>
              <div style={{ fontFamily: theme.fontSub, fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.textMuted, marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: theme.fontHeading, fontSize: HEAD(26), letterSpacing: 1, color: col, lineHeight: 1 }}>{value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Performance + Badge rarity (two columns on wide) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>

        {/* Performance gauge */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ ...panel(), padding: 18 }}>
          {sectionLabel('Performance')}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Gauge pct={avgScore} color={color} theme={theme} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              {[
                { Icon: Star,        label: 'Topics Completed', val: `${topicsDone}/${totalTopics}` },
                { Icon: Trophy,      label: 'Bosses Defeated',  val: `${bossesDone}/3` },
                { Icon: CheckCircle2,label: 'Domain Progress',  val: `${Math.round((topicsDone / totalTopics) * 100)}%` },
              ].map(({ Icon, label, val }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={14} color={color} strokeWidth={1.8} />
                  <span style={{ fontFamily: theme.fontBody, fontSize: 12, color: theme.textSecondary, flex: 1 }}>{label}</span>
                  <span style={{ fontFamily: theme.fontHeading, fontSize: 15, letterSpacing: 0.5, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Badge rarity breakdown */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/music/vault')}
          style={{ ...panel(), padding: 18, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            {sectionLabel('Achievement Progress')}
            <ArrowRight size={14} color={theme.textMuted} style={{ marginTop: -8 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RARITY.map(({ tier: rt, label, color: rc }) => {
              const tot = badgeStats.totals[rt] || 0;
              const got = badgeStats.earned[rt] || 0;
              const pct = tot ? (got / tot) * 100 : 0;
              return (
                <div key={rt}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: rc }}>{label}</span>
                    <span style={{ fontFamily: theme.fontHeading, fontSize: 12, letterSpacing: 0.5, color: theme.textSecondary }}>{got}/{tot}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 99, background: rc, boxShadow: `0 0 8px ${rc}66` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Season breakdown ── */}
      <div>
        {sectionLabel('Season Breakdown')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          {SEASONS.map((s, i) => {
            const topics  = MUSIC_TOPICS.filter(t => t.season === s.id);
            const done    = topics.filter(t => completedTopics.includes(t.name)).length;
            const boss     = MUSIC_BOSSES.find(b => b.season === s.id);
            const bossDone = boss && defeatedBosses.includes(boss.id);
            const pct      = Math.round((done / topics.length) * 100);
            const complete = done === topics.length && bossDone;

            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}
                onClick={() => navigate('/music/setlist')}
                style={{ ...panel({ borderLeft: `3px solid ${complete ? color : 'rgba(255,255,255,0.1)'}`, boxShadow: complete ? `0 0 20px ${color}20` : '0 4px 20px rgba(0,0,0,0.5)' }), padding: '14px 16px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: theme.fontSub, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: complete ? color : theme.textMuted }}>{s.label}</div>
                    <div style={{ fontFamily: theme.fontHeading, fontSize: HEAD(17), letterSpacing: 0.5, color: theme.textPrimary, lineHeight: 1.1, marginTop: 2 }}>{s.title}</div>
                  </div>
                  {complete && <CheckCircle2 size={16} color={color} />}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: theme.fontSub, fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.textMuted }}>Topics</span>
                  <span style={{ fontFamily: theme.fontHeading, fontSize: 12, color }}>{done}/{topics.length}</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: 10 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, delay: 0.1 }}
                    style={{ height: '100%', borderRadius: 99, background: pct === 100 ? color : 'rgba(255,255,255,0.25)' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderRadius: 6,
                  background: bossDone ? `${color}10` : 'rgba(255,255,255,0.04)', border: `1px solid ${bossDone ? color + '40' : 'rgba(255,255,255,0.06)'}` }}>
                  {bossDone ? <Trophy size={12} color={color} /> : <Lock size={12} color="rgba(255,255,255,0.25)" />}
                  <span style={{ fontFamily: theme.fontSub, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: bossDone ? color : theme.textMuted }}>
                    {bossDone ? 'Boss Defeated' : 'Boss Locked'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div>
        {sectionLabel('Recent Activity')}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ ...panel({ borderLeft: `3px solid ${color}` }), padding: '8px 16px' }}>
          {recent.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 2px', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={16} color={theme.textMuted} />
                <span style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textMuted }}>
                  No activity yet — complete a lesson to start your timeline.
                </span>
              </div>
              <motion.button whileHover={{ filter: 'brightness(1.12)' }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/music/setlist')}
                style={{ background: color, color: '#000', padding: '8px 14px', borderRadius: neon ? 0 : 8, fontFamily: theme.fontHeading, fontSize: 14, letterSpacing: 1, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                START <ArrowRight size={13} strokeWidth={2.5} />
              </motion.button>
            </div>
          ) : (
            recent.map((a, i) => {
              const rc = RARITY.find(r => r.tier === a.tier)?.color || color;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 2px', borderBottom: i < recent.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${rc}18`, border: `1px solid ${rc}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Award size={14} color={rc} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Badge earned: <strong style={{ color: rc }}>{a.name}</strong>
                    </div>
                  </div>
                  <span style={{ fontFamily: theme.fontSub, fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', color: theme.textMuted, flexShrink: 0 }}>{relTime(a.at)}</span>
                </div>
              );
            })
          )}
        </motion.div>
      </div>

      {/* ── Division ladder ── */}
      <div>
        {sectionLabel('Concert Division Ladder')}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ ...panel({ borderLeft: `3px solid rgba(255,255,255,0.1)` }), padding: 16 }}>
          {DIVISIONS.map((d, i) => {
            const reached = xp >= d.min;
            const isCurrent = division.name === d.name;
            return (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < DIVISIONS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: reached ? color : 'rgba(255,255,255,0.12)', boxShadow: reached ? `0 0 6px ${color}` : 'none' }} />
                <span style={{ fontFamily: theme.fontSub, fontSize: 13, fontWeight: 600, color: reached ? theme.textPrimary : theme.textMuted, flex: 1 }}>
                  {d.name}
                </span>
                {isCurrent && (
                  <span style={{ fontFamily: theme.fontSub, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color, background: `${color}18`, padding: '2px 7px', borderRadius: 4 }}>
                    You are here
                  </span>
                )}
                <span style={{ fontFamily: theme.fontHeading, fontSize: 13, letterSpacing: 0.5, color: reached ? color : 'rgba(255,255,255,0.2)' }}>
                  {d.min.toLocaleString()} CP
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

    </motion.div>
  );
}
