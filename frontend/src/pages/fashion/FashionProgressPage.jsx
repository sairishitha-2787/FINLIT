// FINLIT — Style Progress Page (/fashion/progress)
// Overview: completion ring, district breakdown, stats row

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, Sparkles, Crown, Star } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useFashion } from '../../contexts/FashionContext';
import { useGamification } from '../../hooks/useGamification';
import { FASHION_DISTRICTS } from '../../components/fashion/RunwayMap';
import { useIsMobile } from '../../hooks/useIsMobile';

// ── Tokens ────────────────────────────────────────────────────────────────────
const F = {
  heading: "'Playfair Display', serif",
  script:  "'Sacramento', cursive",
  ui:      "'DM Sans', sans-serif",
};
const C = { deepRose: '#9d1f4a', midRose: '#d4537e', body: '#b0627a', label: '#c98a9e', gold: '#fde68a' };
const GRAD = 'linear-gradient(135deg, #f7a0b8, #c084fc, #fbb6c4)';

const DISTRICT_COLORS = {
  boutique: { color: '#e8956d', glow: 'rgba(232,149,109,0.30)', label: 'DISTRICT I' },
  atelier:  { color: '#f7a0b8', glow: 'rgba(247,160,184,0.30)', label: 'DISTRICT II' },
  runway:   { color: '#c084fc', glow: 'rgba(192,132,252,0.30)', label: 'DISTRICT III' },
};

const TOTAL_TOPICS = FASHION_DISTRICTS.reduce((s, d) => s + d.topics.length, 0);

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)].join(',');
}

// ── Circular progress ring ─────────────────────────────────────────────────────
function ProgressRing({ value, total }) {
  const RADIUS = 64;
  const CIRC   = 2 * Math.PI * RADIUS;
  const pct    = total > 0 ? Math.min(value / total, 1) : 0;
  const offset = CIRC * (1 - pct);

  return (
    <div style={{ position: 'relative', width: 160, height: 160 }}>
      <svg width={160} height={160} viewBox="0 0 160 160" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="ring-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#f7a0b8" />
            <stop offset="50%"  stopColor="#c084fc" />
            <stop offset="100%" stopColor="#fbb6c4" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx={80} cy={80} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={10} />
        {/* Fill */}
        <motion.circle
          cx={80} cy={80} r={RADIUS}
          fill="none"
          stroke="url(#ring-fill)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          transform="rotate(-90 80 80)"
        />
      </svg>
      {/* Center label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 28, color: C.deepRose, lineHeight: 1 }}>
          {Math.round(pct * 100)}%
        </div>
        <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, color: C.label, letterSpacing: '0.12em', marginTop: 2 }}>
          styled
        </div>
      </div>
    </div>
  );
}

// ── Glass card ────────────────────────────────────────────────────────────────
function GlassCard({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.22)',
      backdropFilter: 'blur(24px) saturate(200%)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      borderTop:    '1.5px solid rgba(255,255,255,0.60)',
      borderLeft:   '1.5px solid rgba(255,255,255,0.60)',
      borderBottom: '1.5px solid rgba(247,160,184,0.30)',
      borderRight:  '1.5px solid rgba(247,160,184,0.30)',
      borderRadius: 24,
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── District progress bar ─────────────────────────────────────────────────────
function DistrictBar({ value, total, color }) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  return (
    <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.50)', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
        style={{ height: '100%', borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}99` }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FashionProgressPage() {
  const { isMobile } = useIsMobile();
  const { completedTopics } = useUser();
  const { defeatedBosses } = useFashion();
  const { xp, level, streak } = useGamification();

  const totalDone  = completedTopics.length;
  const quizzesPassed = completedTopics.length; // 1 pass per topic

  // Per-district data
  const districts = FASHION_DISTRICTS.map(d => {
    const done   = d.topics.filter(t => completedTopics.includes(t)).length;
    const total  = d.topics.length;
    const theme  = DISTRICT_COLORS[d.id];
    const defeated = defeatedBosses.includes(d.bossId);
    const bossAvail = done === total && !defeated;
    return { ...d, done, total, theme, defeated, bossAvail };
  });

  const TIER_NAMES = ['', 'Apprentice', 'Stylist', 'Designer', 'Couturier', 'Icon'];
  const tierName   = TIER_NAMES[Math.min(level, 5)] || `Tier ${level}`;

  const STATS = [
    { label: 'Style Points', value: (xp || 0).toLocaleString() },
    { label: 'Fashion Tier', value: tierName },
    { label: 'Day Streak',   value: `${streak || 0}d` },
    { label: 'Looks Styled', value: `${totalDone}/${TOTAL_TOPICS}` },
    { label: 'Critics Beaten', value: `${defeatedBosses.length}/3` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
      style={{ padding: isMobile ? '20px 16px 60px' : '28px 32px 80px', maxWidth: 880, margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label, marginBottom: 6 }}>
          Your Collection
        </div>
        <h1 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: isMobile ? 24 : 28, letterSpacing: '-0.02em', color: C.deepRose, margin: '0 0 4px' }}>
          Style Progress
        </h1>
        <div style={{ fontFamily: F.script, fontSize: 18, color: C.midRose }}>
          Your journey through financial fashion
        </div>
      </div>

      {/* Overall completion card */}
      <GlassCard style={{ padding: isMobile ? '24px 20px' : '32px 36px', marginBottom: 20 }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? 20 : 36,
        }}>
          {/* Ring */}
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            <ProgressRing value={totalDone} total={TOTAL_TOPICS} />
          </div>

          {/* Text */}
          <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label, marginBottom: 8 }}>
              Overall Progress
            </div>
            <div style={{ fontFamily: F.heading, fontWeight: 600, fontSize: isMobile ? 20 : 24, color: C.deepRose, marginBottom: 4 }}>
              {totalDone} of {TOTAL_TOPICS} Looks Styled
            </div>
            <div style={{ fontFamily: F.ui, fontSize: 13, color: C.body, lineHeight: 1.6, marginBottom: 16 }}>
              {totalDone === 0
                ? "Begin your style journey — select a look from the Runway Map."
                : totalDone === TOTAL_TOPICS
                  ? "Flawless! Your wardrobe is complete. You are truly iconic."
                  : `${TOTAL_TOPICS - totalDone} looks remain in your collection.`
              }
            </div>
            {/* Mini district progress */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {districts.map(d => (
                <div key={d.id} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 99,
                  background: `rgba(${hexToRgb(d.theme.color)},0.10)`,
                  border: `1px solid rgba(${hexToRgb(d.theme.color)},0.25)`,
                }}>
                  {d.defeated
                    ? <Star size={10} color={C.gold} fill={C.gold} />
                    : <Sparkles size={10} color={d.theme.color} />
                  }
                  <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 10, color: d.theme.color }}>
                    {d.done}/{d.total}
                  </span>
                  <span style={{ fontFamily: F.ui, fontSize: 10, color: C.label }}>
                    {d.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* District breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        {districts.map((d, i) => {
          const { icon: DistIcon } = d;
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <GlassCard style={{ padding: '22px 26px' }}>
                {/* District header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `rgba(${hexToRgb(d.theme.color)},0.12)`,
                      border: `1px solid rgba(${hexToRgb(d.theme.color)},0.30)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <DistIcon size={18} color={d.theme.color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: d.theme.color, marginBottom: 2 }}>
                        {d.theme.label}
                      </div>
                      <div style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 16, color: C.deepRose }}>
                        {d.name}
                      </div>
                    </div>
                  </div>

                  {/* Boss status pill */}
                  <div style={{
                    padding: '4px 12px', borderRadius: 99,
                    fontFamily: F.ui, fontWeight: 600, fontSize: 10, letterSpacing: '0.10em',
                    background: d.defeated
                      ? 'rgba(253,230,138,0.15)'
                      : d.bossAvail
                        ? `rgba(${hexToRgb(d.theme.color)},0.12)`
                        : 'rgba(200,160,175,0.10)',
                    border: `1px solid ${d.defeated ? 'rgba(253,230,138,0.35)' : d.bossAvail ? `rgba(${hexToRgb(d.theme.color)},0.30)` : 'rgba(200,160,175,0.20)'}`,
                    color: d.defeated ? '#c4a33a' : d.bossAvail ? d.theme.color : C.label,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    {d.defeated ? <><Star size={9} fill="currentColor" /> Conquered</> : d.bossAvail ? <><Crown size={9} /> Available</> : <><Lock size={9} /> Locked</>}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, color: C.label, letterSpacing: '0.10em' }}>Looks Styled</span>
                    <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 11, color: d.theme.color }}>{d.done}/{d.total}</span>
                  </div>
                  <DistrictBar value={d.done} total={d.total} color={d.theme.color} />
                </div>

                {/* Topic list */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '6px 12px',
                }}>
                  {d.topics.map((topic) => {
                    const done = completedTopics.includes(topic);
                    const idx  = d.topics.indexOf(topic);
                    const prevDone = d.topics.slice(0, idx).every(t => completedTopics.includes(t));
                    const current  = !done && prevDone;
                    return (
                      <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        {done
                          ? <CheckCircle size={12} color={d.theme.color} />
                          : current
                            ? <Sparkles size={12} color={C.midRose} />
                            : <Lock size={12} color="rgba(200,160,175,0.50)" />
                        }
                        <span style={{
                          fontFamily: F.ui, fontSize: 12,
                          color: done ? C.deepRose : current ? C.midRose : 'rgba(200,160,175,0.70)',
                          fontWeight: done ? 500 : 400,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {topic}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
        gap: 10,
      }}>
        {STATS.map(({ label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.06 }}
          >
            <GlassCard style={{ padding: '16px 14px', textAlign: 'center' }}>
              <div style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 18, color: C.deepRose, marginBottom: 4 }}>
                {value}
              </div>
              <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.label }}>
                {label}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
