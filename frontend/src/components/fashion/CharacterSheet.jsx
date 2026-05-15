import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

const F = {
  heading: "'Playfair Display', serif",
  italic:  "'Playfair Display', serif",   // italic weight — replaces Sacramento
  ui:      "'DM Sans', sans-serif",
};
const C = { deepRose: '#9d1f4a', midRose: '#d4537e', label: '#c98a9e', body: '#b0627a', pink: '#f7a0b8' };

function rgb(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(247,160,184,0.20)', margin: '20px 0' }} />;
}

function SheetSection({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: 'linear-gradient(180deg, #f7a0b8, #c084fc)' }} />
        <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function ChibiPortrait({ char }) {
  const [loaded, setLoaded] = React.useState(false);
  const { colors } = char;
  return (
    <div style={{ width: '100%', height: 280, borderRadius: 20, overflow: 'hidden', position: 'relative', marginBottom: 20 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 80%, rgba(${rgb(colors.primary)},0.40) 0%, rgba(${rgb(colors.secondary)},0.20) 50%, transparent 75%)`,
      }} />
      <motion.div
        animate={{ opacity: [0.35, 0.60, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 25%, ${colors.glow} 0%, transparent 65%)`, pointerEvents: 'none' }}
      />
      <img
        src={char.fullImage}
        alt={char.name}
        onLoad={() => setLoaded(true)}
        onError={(e) => { e.target.style.display = 'none'; }}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'contain', objectPosition: 'center bottom',
          opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}

export default function CharacterSheet({ isOpen, onClose, character, level = 1, xp = 0, streak = 0 }) {
  const { isMobile } = useIsMobile();
  if (!character) return null;
  const { colors } = character;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(157,31,74,0.12)', backdropFilter: 'blur(4px)', zIndex: 800 }}
          />
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
              width: isMobile ? '100%' : 340,
              height: isMobile ? '92vh' : '100vh',
              background: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(32px) saturate(220%)',
              WebkitBackdropFilter: 'blur(32px) saturate(220%)',
              borderLeft: isMobile ? 'none' : '1.5px solid rgba(255,255,255,0.60)',
              borderTop: isMobile ? '1.5px solid rgba(255,255,255,0.60)' : 'none',
              borderRadius: isMobile ? '24px 24px 0 0' : 0,
              boxShadow: isMobile
                ? '0 -12px 48px rgba(247,160,184,0.25)'
                : '-12px 0 48px rgba(247,160,184,0.20)',
              zIndex: 900, overflowY: 'auto',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 20px 14px',
              borderBottom: '1px solid rgba(247,160,184,0.20)',
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label, marginBottom: 2 }}>
                  Style Icon
                </div>
                <h2 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 18, letterSpacing: '-0.01em', color: C.deepRose, margin: 0 }}>
                  {character.name}
                </h2>
              </div>
              <button onClick={onClose} style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <X size={15} color={C.deepRose} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {/* Portrait */}
              <ChibiPortrait char={character} />

              {/* Name + archetype */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', color: colors.primary, margin: '0 0 4px' }}>
                  {character.name}
                </h3>
                <p style={{ fontFamily: F.italic, fontStyle: 'italic', fontWeight: 400, fontSize: 18, color: colors.secondary, margin: '0 0 4px' }}>
                  {character.archetype}
                </p>
                <p style={{ fontFamily: F.ui, fontSize: 12, color: C.label, margin: 0, fontStyle: 'italic' }}>
                  "{character.tagline}"
                </p>
              </div>

              <Divider />

              {/* Quick stats */}
              <SheetSection label="Your Stats">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Tier',   value: level },
                    { label: 'SP',     value: xp?.toLocaleString() },
                    { label: 'Streak', value: streak, icon: true },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{
                      padding: '10px 8px', borderRadius: 14, textAlign: 'center',
                      background: `rgba(${rgb(colors.primary)},0.08)`,
                      border: `1px solid rgba(${rgb(colors.primary)},0.20)`,
                    }}>
                      <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: colors.primary, marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                        {value}{icon && <Flame size={13} color="#f0c060" />}
                      </div>
                      <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.label }}>{label}</div>
                    </div>
                  ))}
                </div>
              </SheetSection>

              <Divider />

              {/* Strengths */}
              <SheetSection label="Signature Strengths">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {character.strengths.map(s => (
                    <div key={s} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px', borderRadius: 12,
                      background: `rgba(${rgb(colors.primary)},0.08)`,
                      border: `1px solid rgba(${rgb(colors.primary)},0.20)`,
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.primary, flexShrink: 0 }} />
                      <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: colors.primary }}>{s}</span>
                    </div>
                  ))}
                </div>
              </SheetSection>

              <Divider />

              {/* Bio */}
              <SheetSection label="Your Style">
                <p style={{ fontFamily: F.ui, fontWeight: 400, fontSize: 13, lineHeight: 1.7, color: C.body, margin: 0 }}>
                  {character.description}
                </p>
              </SheetSection>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
