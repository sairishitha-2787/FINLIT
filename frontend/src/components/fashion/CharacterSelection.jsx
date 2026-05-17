import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Heart } from 'lucide-react';
import { FASHION_CHARACTERS } from '../../contexts/FashionContext';
import { useIsMobile } from '../../hooks/useIsMobile';

// ── Design tokens ─────────────────────────────────────────────────────────────
const F = {
  heading: "'Playfair Display', serif",   // main headings — normal
  italic:  "'Playfair Display', serif",   // taglines — italic weight; elegant, readable
  ui:      "'DM Sans', sans-serif",
};
const C = { deepRose: '#9d1f4a', midRose: '#d4537e', label: '#c98a9e', body: '#b0627a', pink: '#f7a0b8' };

// Fixed heights that every card section must honour (px)
const ROW = {
  portrait:    240,   // image area
  nameBlock:    56,   // name + a little breathing room
  tagline:      36,   // italic sub-line
  description: 100,   // 4-ish lines of body text
  strengths:    68,   // two pill badges
};

function rgb(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

// ── Iridescent star badge ─────────────────────────────────────────────────────
function IridescentStar({ size = 22 }) {
  const gid = `star-${Math.random().toString(36).slice(2,6)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#fff"    />
          <stop offset="30%"  stopColor="#fde68a" />
          <stop offset="60%"  stopColor="#d8b4fe" />
          <stop offset="80%"  stopColor="#f7a0b8" />
          <stop offset="100%" stopColor="#9d1f4a" />
        </linearGradient>
      </defs>
      <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"
        fill={`url(#${gid})`} stroke="rgba(255,255,255,0.85)" strokeWidth="0.8" />
      <ellipse cx="9" cy="6.5" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

// ── Character portrait ────────────────────────────────────────────────────────
// mix-blend-mode: screen dissolves black backgrounds against any light surface
function CharPortrait({ char, isSelected }) {
  const [loaded, setLoaded] = useState(false);
  const { colors } = char;
  return (
    <div style={{ height: ROW.portrait, flexShrink: 0, position: 'relative', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
      {/* Gradient backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 85%, rgba(${rgb(colors.primary)},0.42) 0%, rgba(${rgb(colors.secondary)},0.18) 55%, transparent 80%)`,
      }} />
      {/* Atmospheric halo */}
      <motion.div
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 28%, ${colors.glow} 0%, transparent 62%)`, pointerEvents: 'none' }}
      />
      <img
        src={char.fullImage} alt={char.name}
        onLoad={() => setLoaded(true)}
        onError={(e) => { e.target.style.display = 'none'; }}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'contain', objectPosition: 'center bottom',
          opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease',
          mixBlendMode: 'screen',
        }}
      />
      {!loaded && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={40} color={char.colors?.primary || '#d4537e'} strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

// ── Floating bg accents ───────────────────────────────────────────────────────
const BG_ACCENTS = [
  { d: 'M28 28 Q40 16 52 28 M20 28 Q18 52 20 60 Q40 68 60 60 Q62 52 60 28 Z', vb: '0 0 80 80', sz: 80, op: 0.34, pos: { top: '5%',    right: '2%'  }, delay: 0   },
  { d: 'M8 52 L16 20 L32 36 L40 12 L48 36 L64 20 L72 52 Z',                  vb: '0 0 80 60', sz: 74, op: 0.30, pos: { bottom: '8%', left: '2%'  }, delay: 1.5 },
  { d: 'M10 44 Q20 20 52 24 Q68 26 70 36 Q70 44 60 44 Z',                    vb: '0 0 80 60', sz: 68, op: 0.28, pos: { top: '45%',  right: '1%' }, delay: 2.8 },
];

function BgAccent({ d, vb, sz, op, pos, delay }) {
  const gid = `bga-${Math.random().toString(36).slice(2,6)}`;
  return (
    <motion.div
      style={{ position: 'fixed', pointerEvents: 'none', zIndex: 0, opacity: op, filter: 'blur(0.8px)', ...pos }}
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <svg width={sz} height={sz} viewBox={vb}>
        <defs>
          <radialGradient id={gid} cx="30%" cy="25%" r="75%">
            <stop offset="0%"   stopColor="#fff"    />
            <stop offset="25%"  stopColor="#fde68a" />
            <stop offset="55%"  stopColor="#d8b4fe" />
            <stop offset="80%"  stopColor="#f7a0b8" />
            <stop offset="100%" stopColor="#9d1f4a" />
          </radialGradient>
        </defs>
        <path d={d} fill={`url(#${gid})`} stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinejoin="round" />
        <ellipse cx="28%" cy="22%" rx="14%" ry="9%" fill="rgba(255,255,255,0.45)" />
      </svg>
    </motion.div>
  );
}

// ── Glass card — full height flex column ──────────────────────────────────────
function GlassCard({ children, isSelected, colors, style = {} }) {
  return (
    <div style={{
      height: '100%',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      background: 'rgba(255,255,255,0.22)',
      backdropFilter: 'blur(24px) saturate(200%)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      borderTop:    isSelected ? `2px solid rgba(${rgb(colors.primary)},0.55)` : '1.5px solid rgba(255,255,255,0.65)',
      borderLeft:   isSelected ? `2px solid rgba(${rgb(colors.primary)},0.55)` : '1.5px solid rgba(255,255,255,0.65)',
      borderBottom: isSelected ? `2px solid rgba(${rgb(colors.primary)},0.30)` : '1.5px solid rgba(247,160,184,0.28)',
      borderRight:  isSelected ? `2px solid rgba(${rgb(colors.primary)},0.30)` : '1.5px solid rgba(247,160,184,0.28)',
      borderRadius: 24,
      boxShadow: isSelected
        ? `0 20px 60px ${colors.glow}, 0 8px 24px rgba(192,132,252,0.20)`
        : '0 12px 40px rgba(247,160,184,0.18), 0 4px 14px rgba(192,132,252,0.10)',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Top rim light */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.70), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      {/* Left rim light */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.50), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CharacterSelection({ isOpen, onSelect }) {
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { isMobile } = useIsMobile();

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    setTimeout(() => onSelect(selected), 800);
  };

  if (!isOpen) return null;

  const portraitH = isMobile ? 180 : ROW.portrait;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={confirmed ? { opacity: 0, scale: 1.03 } : { opacity: 1, scale: 1 }}
      transition={{ duration: confirmed ? 0.65 : 0.32 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: '#faf5ec',
        backgroundImage: `
          radial-gradient(circle 380px at 95% 8%,  rgba(247,160,184,0.50) 0%, transparent 70%),
          radial-gradient(circle 240px at 3%  85%, rgba(192,132,252,0.40) 0%, transparent 70%),
          radial-gradient(circle 100px at 60% 45%, rgba(251,182,196,0.55) 0%, transparent 70%)
        `,
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: isMobile ? '28px 16px 36px' : '52px 32px 52px',
      }}
    >
      {BG_ACCENTS.map((a, i) => <BgAccent key={i} {...a} />)}

      <div style={{ width: '100%', maxWidth: 1020, position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42 }}
          style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}
        >
          <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label, marginBottom: 12 }}>
            The Studio
          </div>
          <h1 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: isMobile ? 26 : 34, letterSpacing: '-0.02em', lineHeight: 1.1, color: C.deepRose, margin: '0 0 10px' }}>
            Choose Your Style Icon
          </h1>
          {/* Playfair Display italic replaces Sacramento — more legible, still editorial */}
          <p style={{ fontFamily: F.italic, fontStyle: 'italic', fontWeight: 400, fontSize: isMobile ? 17 : 20, color: C.midRose, margin: 0, lineHeight: 1.4 }}>
            Your fashion archetype shapes your financial journey
          </p>
        </motion.div>

        {/* ── Character cards — aligned grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          alignItems: 'stretch',   // ← all cells same height
          gap: isMobile ? 16 : 24,
          marginBottom: 44,
        }}>
          {FASHION_CHARACTERS.map((char, idx) => {
            const isSelected = selected?.id === char.id;
            const { colors } = char;
            return (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: isSelected ? 1.025 : 1 }}
                transition={isSelected
                  ? { type: 'spring', stiffness: 300, damping: 22 }
                  : { delay: idx * 0.08, type: 'spring', stiffness: 220, damping: 24 }
                }
                whileHover={!isSelected ? { y: -5, transition: { duration: 0.2 } } : {}}
                whileTap={{ scale: 0.985 }}
                onClick={() => setSelected(char)}
                style={{ cursor: 'pointer', height: '100%' }}   // ← fill grid cell
              >
                <GlassCard isSelected={isSelected} colors={colors}>

                  {/* Selected star badge — absolute so it doesn't disturb layout */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                        style={{ position: 'absolute', top: 12, right: 12, zIndex: 3 }}
                      >
                        <IridescentStar size={28} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Portrait — fixed height ── */}
                  <div style={{ height: portraitH, flexShrink: 0, position: 'relative', overflow: 'hidden', borderRadius: '22px 22px 0 0' }}>
                    <CharPortrait char={char} isSelected={isSelected} />
                  </div>

                  {/* ── Text body — flex-grows to fill remaining space ── */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: isMobile ? '16px 20px 20px' : '20px 24px 24px' }}>

                    {/* Name — fixed-height row */}
                    <div style={{ height: ROW.nameBlock, display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
                      <h3 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 22, letterSpacing: '-0.01em', lineHeight: 1.15, color: colors.primary, margin: 0 }}>
                        {char.name}
                      </h3>
                    </div>

                    {/* Tagline — fixed-height row, Playfair italic */}
                    <div style={{ height: ROW.tagline, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <p style={{ fontFamily: F.italic, fontStyle: 'italic', fontWeight: 400, fontSize: 16, color: colors.secondary, margin: 0, lineHeight: 1.3 }}>
                        {char.tagline}
                      </p>
                    </div>

                    {/* Description — fixed height, clamp overflow */}
                    <div style={{ height: ROW.description, flexShrink: 0, overflow: 'hidden' }}>
                      <p style={{ fontFamily: F.ui, fontWeight: 400, fontSize: 13, lineHeight: 1.7, color: C.body, margin: 0 }}>
                        {char.description}
                      </p>
                    </div>

                    {/* Strengths — fixed height */}
                    <div style={{ height: ROW.strengths, flexShrink: 0, display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
                      {char.strengths.map(s => (
                        <span key={s} style={{
                          padding: '5px 13px', borderRadius: 99,
                          background: 'rgba(255,255,255,0.35)',
                          backdropFilter: 'blur(8px)',
                          border: `1px solid rgba(${rgb(colors.primary)},0.28)`,
                          fontFamily: F.ui, fontWeight: 500, fontSize: 11,
                          color: colors.primary, whiteSpace: 'nowrap',
                          lineHeight: 1.4,
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* spacer pushes button to bottom of every card */}
                    <div style={{ flex: 1 }} />

                    {/* Choose / Selected button — always at card bottom */}
                    <motion.button
                      whileHover={{ y: -1, boxShadow: `0 10px 28px ${colors.glow}` }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => { e.stopPropagation(); setSelected(char); }}
                      style={{
                        marginTop: 16, width: '100%',
                        padding: '13px 20px', borderRadius: 14, border: 'none',
                        background: isSelected ? colors.gradient : 'rgba(255,255,255,0.38)',
                        color: isSelected ? '#fff' : colors.primary,
                        fontFamily: F.ui, fontWeight: 600, fontSize: 14,
                        cursor: 'pointer',
                        boxShadow: isSelected ? `0 6px 20px ${colors.glow}` : 'none',
                        backdropFilter: isSelected ? 'none' : 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        position: 'relative', overflow: 'hidden',
                        transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)', pointerEvents: 'none' }} />
                      )}
                      {isSelected ? <><Check size={15} strokeWidth={2.5} /> Selected</> : 'Choose'}
                    </motion.button>
                  </div>

                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* ── Begin Your Journey ── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <motion.button
                whileHover={{ y: -2, boxShadow: `0 14px 36px ${selected.colors.glow}` }}
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirm}
                disabled={confirmed}
                style={{
                  padding: '16px 52px', borderRadius: 16, border: 'none',
                  background: selected.colors.gradient,
                  color: '#fff',
                  fontFamily: F.ui, fontWeight: 700, fontSize: 15,
                  cursor: confirmed ? 'not-allowed' : 'pointer',
                  boxShadow: `0 8px 28px ${selected.colors.glow}`,
                  display: 'flex', alignItems: 'center', gap: 10,
                  position: 'relative', overflow: 'hidden',
                  minWidth: 260, justifyContent: 'center',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.70), transparent)', pointerEvents: 'none' }} />
                <Sparkles size={17} />
                {confirmed ? 'Entering the studio…' : `Begin as ${selected.name}`}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
