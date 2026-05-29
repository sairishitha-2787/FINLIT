import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Map, BarChart2, Award, Sparkles, Heart, Zap, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { FASHION_DISTRICTS } from '../../components/fashion/RunwayMap';
import FloatingMentor from '../../components/mentor/FloatingMentor';

// ─── Design tokens (self-contained) ──────────────────────────────────────────
const C = {
  bg:         '#faf5ec',
  pink:       '#f7a0b8',
  brightPink: '#fbb6c4',
  purple:     '#c084fc',
  deepRose:   '#9d1f4a',
  midRose:    '#d4537e',
  body:       '#b0627a',
  label:      '#c98a9e',
  gold:       '#fde68a',
};

const F = {
  logo:    "'Petit Formal Script', cursive",
  heading: "'Playfair Display', serif",
  italic:  "'Playfair Display', serif",
  ui:      "'DM Sans', sans-serif",
};

// ─── Reusable glass card with inner rim lights ─────────────────────────────────
function GlassCard({ children, style = {}, padding = 28 }) {
  return (
    <div style={{
      position: 'relative',
      background: 'rgba(255,255,255,0.20)',
      backdropFilter: 'blur(24px) saturate(200%)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      borderTop:    '1.5px solid rgba(255,255,255,0.60)',
      borderLeft:   '1.5px solid rgba(255,255,255,0.60)',
      borderBottom: '1.5px solid rgba(247,160,184,0.30)',
      borderRight:  '1.5px solid rgba(247,160,184,0.30)',
      borderRadius: 28,
      boxShadow: '0 16px 48px rgba(247,160,184,0.25), 0 6px 20px rgba(192,132,252,0.15)',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Top rim light */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
      }} />
      {/* Left rim light */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 1, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.45), transparent)',
      }} />
      <div style={{ position: 'relative', zIndex: 1, padding }}>
        {children}
      </div>
    </div>
  );
}

// ─── Typography helpers ────────────────────────────────────────────────────────
const SectionLabel = ({ children, style = {} }) => (
  <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label, ...style }}>
    {children}
  </div>
);

const Heading = ({ children, size = 28, style = {} }) => (
  <h2 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: size, letterSpacing: '-0.02em', lineHeight: 1.15, color: C.deepRose, margin: 0, ...style }}>
    {children}
  </h2>
);

const ScriptSub = ({ children, style = {} }) => (
  <p style={{ fontFamily: F.italic, fontStyle: 'italic', fontWeight: 400, fontSize: 20, lineHeight: 1.4, color: C.midRose, margin: 0, ...style }}>
    {children}
  </p>
);

const BodyText = ({ children, style = {} }) => (
  <p style={{ fontFamily: F.ui, fontWeight: 400, fontSize: 13, lineHeight: 1.7, color: C.body, margin: 0, ...style }}>
    {children}
  </p>
);

// ─── Iridescent stat icon ─────────────────────────────────────────────────────
function IridescentIcon({ size = 20 }) {
  const gid = `stat-irid-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="30%"  stopColor="#fde68a" />
          <stop offset="60%"  stopColor="#d8b4fe" />
          <stop offset="80%"  stopColor="#f7a0b8" />
          <stop offset="100%" stopColor="#9d1f4a" />
        </linearGradient>
      </defs>
      <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" fill={`url(#${gid})`} stroke="rgba(255,255,255,0.80)" strokeWidth="0.8" />
      <ellipse cx="9" cy="6" rx="3" ry="2" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

// ─── Primary gradient button ───────────────────────────────────────────────────
function GradientButton({ children, onClick, style = {} }) {
  return (
    <motion.button
      whileHover={{ y: -1, boxShadow: '0 10px 28px rgba(192,132,252,0.45)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        position: 'relative', overflow: 'hidden',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '14px 28px', borderRadius: 16, border: 'none',
        background: 'linear-gradient(135deg, #f7a0b8, #c084fc, #fbb6c4)',
        color: '#fff',
        fontFamily: F.ui, fontWeight: 600, fontSize: 13,
        cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(192,132,252,0.35)',
        ...style,
      }}
    >
      {/* Inner top-edge rim highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1, pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.70), transparent)',
        borderRadius: '16px 16px 0 0',
      }} />
      {children}
    </motion.button>
  );
}

// ─── Pill button (secondary/quick-action) ──────────────────────────────────────
function PillButton({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(247,160,184,0.30)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '11px 20px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.55)',
        background: 'rgba(255,255,255,0.32)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        color: C.deepRose,
        fontFamily: F.ui, fontWeight: 500, fontSize: 13,
        cursor: 'pointer',
      }}
    >
      {children}
    </motion.button>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function ChibiAvatar({ char, size = 64 }) {
  const [loaded, setLoaded] = React.useState(false);
  if (!char) return null;
  const hr = (hex) => { const h = hex.replace('#',''); return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`; };
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `radial-gradient(circle at 40% 35%, rgba(${hr(char.colors.primary)},0.40), rgba(${hr(char.colors.secondary)},0.20) 70%, transparent)`,
      border: `2px solid rgba(${hr(char.colors.primary)},0.45)`,
      boxShadow: `0 0 16px ${char.colors.glow}`,
      overflow: 'hidden', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <img
        src={char.chibiImage} alt={char.name}
        onLoad={() => setLoaded(true)}
        onError={(e) => { e.target.style.display = 'none'; }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s', mixBlendMode: 'screen' }}
      />
      {!loaded && <Heart size={size * 0.45} color={char.colors?.primary || '#d4537e'} strokeWidth={1.5} />}
    </div>
  );
}

export default function FashionDashboard() {
  const navigate = useNavigate();
  const { xp, level, streak, fashionCharacter, onOpenSheet } = useOutletContext();
  const { profile, completedTopics, progress, loading } = useUser();

  const firstName = profile?.name?.split(' ')[0] || 'Darling';

  const getFashionGreeting = () => {
    const h = new Date().getHours();
    const t = completedTopics.length;
    const s = streak ?? 0;
    if (t === 0) return [`Welcome to the atelier, ${firstName}.`, 'Your first look awaits. Let\'s style something extraordinary.'];
    if (s >= 14) return [`Darling, ${firstName}!`, `${s} days of pure elegance. You're an icon.`];
    if (s >= 7)  return [`Darling, ${firstName}!`, `${s}-day streak, darling. The runway belongs to you.`];
    if (s >= 3)  return [`Welcome back, ${firstName}.`, `${s} days running. Absolutely relentless.`];
    if (h < 6)   return [`Still awake, ${firstName}?`, 'Even at this hour, your taste is impeccable.'];
    if (h < 12)  return [`Good morning, ${firstName}.`, "Today's collection is about to turn heads."];
    if (h < 17)  return [`Back in the atelier, ${firstName}.`, 'Midday glow-up incoming.'];
    if (h < 21)  return [`Evening, ${firstName}.`, 'The golden hour is all yours.'];
    return              [`Late-night haute couture, ${firstName}.`, 'The most fashionable hour.'];
  };
  const [greetMain, greetSub] = getFashionGreeting();

  const allTopics = FASHION_DISTRICTS.flatMap(d => d.topics);
  const nextTopic = allTopics.find(t => !completedTopics.includes(t));
  const nextTopicDistrict = nextTopic
    ? FASHION_DISTRICTS.find(d => d.topics.includes(nextTopic))
    : null;

  const recentLooks = (() => {
    if (progress && progress.length > 0) {
      return [...progress]
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, 5)
        .map(p => p.topic);
    }
    return completedTopics.slice(-5).reverse();
  })();

  const stats = [
    { label: 'Style Points',    value: xp?.toLocaleString() ?? '0',  accent: C.pink   },
    { label: 'Fashion Tier',    value: `Tier ${level}`,               accent: C.purple  },
    { label: 'Day Streak',      value: `${streak ?? 0}d`,             accent: C.gold    },
    { label: 'Wardrobe Pieces', value: completedTopics.length,        accent: C.midRose },
  ];

  const actions = [
    { label: 'Continue Learning', icon: BookOpen, go: '/fashion/learn'        },
    { label: 'Runway Map',        icon: Map,       go: '/fashion/map'          },
    { label: 'My Progress',       icon: BarChart2, go: '/fashion/progress'     },
    { label: 'Designer Labels',   icon: Award,     go: '/fashion/achievements' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: `3px solid rgba(247,160,184,0.25)`,
          borderTop: `3px solid ${C.pink}`,
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontFamily: F.ui, fontSize: 11, letterSpacing: '0.16em', color: C.label, textTransform: 'uppercase' }}>Loading...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
      style={{ padding: '36px 32px', maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}
    >

      {/* ── HEADER ── */}
      <div>
        <SectionLabel style={{ marginBottom: 8 }}>Studio</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {fashionCharacter && <ChibiAvatar char={fashionCharacter} size={64} />}
          <div>
            <Heading size={28}>{greetMain}</Heading>
            {fashionCharacter && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <span style={{ fontFamily: F.heading, fontWeight: 500, fontSize: 14, color: fashionCharacter.colors.primary }}>{fashionCharacter.name}</span>
                <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.label }}>·</span>
                <span style={{ fontFamily: F.italic, fontStyle: 'italic', fontSize: 16, color: C.midRose }}>{fashionCharacter.archetype}</span>
                <button onClick={onOpenSheet} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: F.ui, fontSize: 11, color: C.label, textDecoration: 'underline', padding: 0, marginLeft: 2 }}>view card</button>
              </div>
            )}
          </div>
        </div>
        <ScriptSub style={{ marginTop: 10 }}>{greetSub}</ScriptSub>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        {stats.map(({ label, value, accent }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + i * 0.07, type: 'spring', stiffness: 220, damping: 22 }}
          >
            <GlassCard padding={20} style={{ borderRadius: 20, textAlign: 'center' }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: `rgba(${hexRgb(accent)},0.12)`,
                border: `1.5px solid rgba(${hexRgb(accent)},0.28)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <IridescentIcon size={22} />
              </div>
              <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: accent, marginBottom: 4, lineHeight: 1 }}>
                {value}
              </div>
              <SectionLabel>{label}</SectionLabel>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}>
        <SectionLabel style={{ marginBottom: 12 }}>Quick Actions</SectionLabel>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {actions.map(({ label, icon: Icon, go }) => (
            <PillButton key={label} onClick={() => navigate(go)}>
              <Icon size={14} color={C.pink} strokeWidth={2} />
              {label}
            </PillButton>
          ))}
        </div>
      </motion.div>

      {/* ── DAILY DRILL: Next Look ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <GlassCard padding={28} style={{
          background: 'linear-gradient(135deg, rgba(247,160,184,0.22) 0%, rgba(192,132,252,0.16) 50%, rgba(251,182,196,0.14) 100%)',
          borderTop: '1.5px solid rgba(255,255,255,0.72)',
          borderLeft: '1.5px solid rgba(255,255,255,0.72)',
        }}>
          {completedTopics.length === allTopics.length ? (
            /* All done state */
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <CheckCircle2 size={36} color={C.pink} style={{ marginBottom: 12 }} />
              <Heading size={22} style={{ marginBottom: 6 }}>Wardrobe Complete!</Heading>
              <ScriptSub>Every look styled. You are truly iconic.</ScriptSub>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: 'rgba(247,160,184,0.18)', border: '1.5px solid rgba(247,160,184,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={24} color={C.pink} />
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <SectionLabel style={{ marginBottom: 4 }}>
                  {completedTopics.length === 0 ? 'First Look' : 'Daily Drill'}
                </SectionLabel>
                <Heading size={18} style={{ marginBottom: 2 }}>{nextTopic}</Heading>
                {nextTopicDistrict && (
                  <BodyText style={{ fontSize: 12 }}>{nextTopicDistrict.name}</BodyText>
                )}
              </div>
              <GradientButton onClick={() => navigate('/fashion/learn', { state: { topic: nextTopic } })} style={{ flexShrink: 0 }}>
                <BookOpen size={14} />
                {completedTopics.length === 0 ? 'Start First Look' : 'Continue'}
              </GradientButton>
            </div>
          )}
        </GlassCard>
      </motion.div>

      <FloatingMentor userInterest="fashion" />

      {/* ── RECENT LOOKS ── */}
      {recentLooks.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
          <SectionLabel style={{ marginBottom: 12 }}>Recent Looks</SectionLabel>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {recentLooks.map((topic) => (
              <div key={topic} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 99,
                background: 'rgba(255,255,255,0.28)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.52)',
              }}>
                <Sparkles size={11} color={C.pink} />
                <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 12, color: C.deepRose }}>{topic}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}

function hexRgb(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}
