import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Target, Trophy } from 'lucide-react';
import { SPORTS_CHARACTERS } from '../../contexts/SportsContext';
import { sportsTheme } from '../../styles/sportsTheme';

const CHAR_ARRAY = Object.values(SPORTS_CHARACTERS);
const CHAR_ICON  = { lyra: Zap, kael: Target, ian: Trophy };

const STAT_BADGES = {
  lyra: ['Income Growth +20%', 'Risk Tolerance +15%'],
  kael: ['Budget Control +20%', 'Planning Bonus +15%'],
  ian:  ['Wealth Building +20%', 'Long-Term Vision +15%'],
};

// ─── Character portrait image ─────────────────────────────────────────────────
function CharPortrait({ src, name, color, id }) {
  const [loaded,  setLoaded]  = useState(false);
  const [errored, setErrored] = useState(false);
  const FallbackIcon = CHAR_ICON[id] || Zap;

  return (
    <div style={{
      width: '100%', height: '220px',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      overflow: 'hidden', position: 'relative',
      background: `linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.35) 100%)`,
    }}>
      {!errored && src && (
        <img
          src={src}
          alt={name}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            height: '100%', width: 'auto',
            objectFit: 'contain', objectPosition: 'center bottom',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.35s',
            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.7))',
          }}
        />
      )}
      {(!loaded || errored) && (
        <FallbackIcon
          size={72} color={color} strokeWidth={1.2}
          style={{ marginBottom: 24, opacity: 0.7 }}
        />
      )}
    </div>
  );
}

// ─── Individual vertical card ─────────────────────────────────────────────────
function CharCard({ c, isActive, confirming, onSelect, onConfirm }) {
  const badges = STAT_BADGES[c.id] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      style={{
        display: 'flex', flexDirection: 'column',
        background: isActive
          ? `linear-gradient(180deg, ${c.dim} 0%, rgba(18,18,18,0.97) 100%)`
          : 'rgba(18,18,18,0.97)',
        borderRadius: '16px',
        border: isActive ? `1px solid ${c.color}` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isActive
          ? `0 0 32px ${c.glow}, 0 8px 24px rgba(0,0,0,0.5)`
          : '0 4px 16px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        transition: 'border 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      onClick={() => onSelect(c.id)}
    >
      {/* Image */}
      <CharPortrait src={c.fullImage} name={c.name} color={c.color} id={c.id} />

      {/* Info block */}
      <div style={{ padding: '20px 20px 0', textAlign: 'center', flex: 1 }}>
        {/* Jersey */}
        <div style={{
          fontFamily: sportsTheme.fontSub,
          fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: isActive ? c.color : 'rgba(255,255,255,0.35)',
          marginBottom: '4px',
        }}>
          #{c.jersey}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: sportsTheme.fontHeading,
          fontSize: '34px', letterSpacing: '2px',
          color: c.color,
          lineHeight: 1, marginBottom: '6px',
        }}>
          {c.name}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: sportsTheme.fontSub,
          fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: isActive ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.45)',
          marginBottom: '3px',
        }}>
          {c.title}
        </div>

        {/* Role */}
        <div style={{
          fontFamily: sportsTheme.fontSub,
          fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: '12px',
        }}>
          {c.role}
        </div>

        {/* Description */}
        <p style={{
          fontFamily: sportsTheme.fontBody,
          fontSize: '13px', lineHeight: 1.65,
          color: isActive ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.45)',
          margin: '0 0 16px',
        }}>
          {c.description}
        </p>

        {/* Stat badges */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: '6px',
          marginBottom: '20px',
        }}>
          {badges.map((badge) => (
            <span key={badge} style={{
              fontFamily: sportsTheme.fontSub,
              fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: isActive ? c.color : 'rgba(255,255,255,0.4)',
              background: isActive ? `rgba(${hexRgb(c.color)},0.15)` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isActive ? `rgba(${hexRgb(c.color)},0.35)` : 'rgba(255,255,255,0.1)'}`,
              padding: '4px 10px',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
            }}>
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Choose button */}
      <div style={{ padding: '0 20px 20px' }}>
        <motion.button
          whileHover={!isActive ? { background: `rgba(${hexRgb(c.color)},0.12)` } : {}}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => { e.stopPropagation(); isActive ? onConfirm() : onSelect(c.id); }}
          disabled={isActive && confirming}
          style={{
            width: '100%', padding: '12px',
            borderRadius: '8px',
            background: isActive ? c.color : 'rgba(0,0,0,0)',
            border: `1px solid ${isActive ? c.color : `rgba(${hexRgb(c.color)},0.5)`}`,
            cursor: 'pointer',
            fontFamily: sportsTheme.fontHeading,
            fontSize: '16px', letterSpacing: '2px',
            color: isActive ? '#000' : c.color,
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {isActive
            ? (<><Check size={14} strokeWidth={3} /> SELECTED</>)
            : 'CHOOSE'}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main selection screen ────────────────────────────────────────────────────
export default function SportsCharacterSelection({ isOpen, onSelect }) {
  const [selected,   setSelected]   = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setConfirming(true);
    setTimeout(() => onSelect(selected), 380);
  };

  if (!isOpen) return null;

  const selectedChar = SPORTS_CHARACTERS[selected];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: sportsTheme.bgDark,
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 20px 60px',
        }}
      >
        {/* Grid background */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }} />

        {/* Selected character color bleed */}
        <AnimatePresence mode="wait">
          {selectedChar && (
            <motion.div
              key={selected}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, pointerEvents: 'none',
                background: `radial-gradient(ellipse 70% 60% at 50% 100%, ${selectedChar.color}14 0%, transparent 65%)`,
              }}
            />
          )}
        </AnimatePresence>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '980px' }}>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: '40px' }}
          >
            <div style={{
              fontFamily: sportsTheme.fontSub,
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: sportsTheme.textMuted, marginBottom: '10px',
            }}>
              SELECT YOUR ARCHETYPE
            </div>
            <h1 style={{
              fontFamily: sportsTheme.fontHeading,
              fontSize: 'clamp(32px, 5vw, 52px)',
              color: sportsTheme.textPrimary,
              letterSpacing: '4px', margin: '0 0 14px',
              lineHeight: 1,
            }}>
              WHO ARE YOU ON THE PITCH?
            </h1>
            <p style={{
              fontFamily: sportsTheme.fontBody,
              fontSize: '14px', lineHeight: 1.65,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '480px', margin: '0 auto',
            }}>
              Your archetype shapes your financial philosophy and colour signature throughout the app.
            </p>
          </motion.div>

          {/* ── Card grid — 3 col desktop, 1 col mobile ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}>
            {CHAR_ARRAY.map((c) => (
              <CharCard
                key={c.id}
                c={c}
                isActive={selected === c.id}
                confirming={confirming}
                onSelect={setSelected}
                onConfirm={handleConfirm}
              />
            ))}
          </div>

          {/* ── Bottom confirm button (appears after selection) ── */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <motion.button
                  whileHover={{ filter: 'brightness(1.12)', y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirm}
                  disabled={confirming}
                  style={{
                    padding: '16px 56px',
                    borderRadius: '8px',
                    background: selectedChar?.color || '#E8457A',
                    border: 'none',
                    cursor: confirming ? 'not-allowed' : 'pointer',
                    fontFamily: sportsTheme.fontHeading,
                    fontSize: '20px', letterSpacing: '3px',
                    color: '#000',
                    boxShadow: `0 6px 32px ${selectedChar?.glow || 'rgba(232,69,122,0.45)'}`,
                    transition: 'all 0.2s ease',
                    opacity: confirming ? 0.75 : 1,
                  }}
                >
                  {confirming
                    ? 'ENTERING THE PITCH...'
                    : `BEGIN AS ${selectedChar?.name.toUpperCase()}`}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function hexRgb(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}
