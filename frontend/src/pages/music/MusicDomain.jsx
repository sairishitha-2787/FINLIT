// Music domain character selection overlay
// Shown as a full-screen modal inside MusicLayout when no character is selected.
// Follows the same pattern as SportsCharacterSelection.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Music, Zap, Cpu } from 'lucide-react';
import { MUSIC_CHARACTERS } from '../../contexts/MusicContext';
import { musicTheme } from '../../styles/musicTheme';

const CHAR_ARRAY = Object.values(MUSIC_CHARACTERS);

const CHAR_ICON = { luna: Music, jay: Zap, cypher: Cpu };

const STAT_BADGES = {
  luna:   ['Emotional IQ +20%',  'Storytelling +15%'],
  jay:    ['Business Savvy +20%', 'Brand Building +15%'],
  cypher: ['Tech Strategy +20%',  'Digital Finance +15%'],
};

// ─── Character portrait ───────────────────────────────────────────────────────
function CharPortrait({ src, name, color, id }) {
  const [loaded,  setLoaded]  = useState(false);
  const [errored, setErrored] = useState(false);
  const FallbackIcon = CHAR_ICON[id] || Music;

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

// ─── Individual character card ────────────────────────────────────────────────
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
          ? `linear-gradient(180deg, ${c.dim} 0%, rgba(18,14,17,0.97) 100%)`
          : 'rgba(18,14,17,0.97)',
        borderRadius: 16,
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
      <CharPortrait src={c.fullImage} name={c.name} color={c.color} id={c.id} />

      <div style={{ padding: '20px 20px 0', textAlign: 'center', flex: 1 }}>
        {/* Cluster */}
        <div style={{
          fontFamily: musicTheme.fontSub,
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: isActive ? c.color : 'rgba(255,255,255,0.35)',
          marginBottom: 4,
        }}>
          {c.cluster} · {c.clusterGenres}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: musicTheme.fontHeading,
          fontSize: 34, letterSpacing: 2,
          color: c.color, lineHeight: 1, marginBottom: 6,
        }}>
          {c.name}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: musicTheme.fontSub,
          fontSize: 11, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: isActive ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.45)',
          marginBottom: 3,
        }}>
          {c.title}
        </div>

        {/* Personality */}
        <div style={{
          fontFamily: musicTheme.fontSub,
          fontSize: 10, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: 12,
        }}>
          {c.personality}
        </div>

        {/* Bio */}
        <p style={{
          fontFamily: musicTheme.fontBody,
          fontSize: 13, lineHeight: 1.65,
          color: isActive ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.45)',
          margin: '0 0 10px',
        }}>
          {c.bio}
        </p>

        {/* Specialty */}
        <div style={{
          fontFamily: musicTheme.fontSub,
          fontSize: 11, fontWeight: 600,
          letterSpacing: '0.06em',
          color: isActive ? c.color : 'rgba(255,255,255,0.35)',
          marginBottom: 4,
        }}>
          Specialty: {c.specialty}
        </div>

        {/* Mentor style */}
        <div style={{
          fontFamily: musicTheme.fontBody,
          fontSize: 11,
          color: 'rgba(255,255,255,0.3)',
          marginBottom: 14,
        }}>
          Mentor: {c.mentorStyle}
        </div>

        {/* Stat badges */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: 6, marginBottom: 20,
        }}>
          {badges.map((badge) => (
            <span key={badge} style={{
              fontFamily: musicTheme.fontSub,
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: isActive ? c.color : 'rgba(255,255,255,0.4)',
              background: isActive ? `rgba(${hexRgb(c.color)},0.15)` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isActive ? `rgba(${hexRgb(c.color)},0.35)` : 'rgba(255,255,255,0.1)'}`,
              padding: '4px 10px', borderRadius: 12,
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
          whileTap={{ scale: 0.97 }}
          onClick={(e) => { e.stopPropagation(); isActive ? onConfirm() : onSelect(c.id); }}
          disabled={isActive && confirming}
          style={{
            width: '100%', padding: 12, borderRadius: 8,
            background: isActive ? c.color : 'rgba(0,0,0,0)',
            border: `1px solid ${isActive ? c.color : `rgba(${hexRgb(c.color)},0.5)`}`,
            cursor: 'pointer',
            fontFamily: musicTheme.fontHeading,
            fontSize: 16, letterSpacing: 2,
            color: isActive ? '#000' : c.color,
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {isActive ? (<><Check size={14} strokeWidth={3} /> SELECTED</>) : 'CHOOSE'}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main selection screen ────────────────────────────────────────────────────
export default function MusicDomain({ isOpen, onSelect }) {
  const [selected,   setSelected]   = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setConfirming(true);
    setTimeout(() => onSelect(selected), 380);
  };

  if (!isOpen) return null;

  const selectedChar = MUSIC_CHARACTERS[selected];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: musicTheme.bgDark,
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 20px 60px',
        }}
      >
        {/* Subtle noise background */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(215,152,163,0.06) 0%, transparent 60%)
          `,
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

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 980 }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <div style={{
              fontFamily: musicTheme.fontSub,
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: musicTheme.textMuted, marginBottom: 10,
            }}>
              SELECT YOUR SOUND
            </div>
            <h1 style={{
              fontFamily: musicTheme.fontHeading,
              fontSize: 'clamp(32px, 5vw, 52px)',
              color: musicTheme.textPrimary,
              letterSpacing: 4, margin: '0 0 14px', lineHeight: 1,
            }}>
              WHO ARE YOU IN THE STUDIO?
            </h1>
            <p style={{
              fontFamily: musicTheme.fontBody,
              fontSize: 14, lineHeight: 1.65,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '480px', margin: '0 auto',
            }}>
              Your character shapes your financial philosophy and colour signature throughout the app.
            </p>
          </motion.div>

          {/* Card grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16, marginBottom: 32,
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

          {/* Bottom confirm */}
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
                    padding: '16px 56px', borderRadius: 8,
                    background: selectedChar?.color || '#D798A3',
                    border: 'none',
                    cursor: confirming ? 'not-allowed' : 'pointer',
                    fontFamily: musicTheme.fontHeading,
                    fontSize: 20, letterSpacing: 3,
                    color: '#000',
                    boxShadow: `0 6px 32px ${selectedChar?.glow || 'rgba(215,152,163,0.45)'}`,
                    transition: 'all 0.2s ease',
                    opacity: confirming ? 0.75 : 1,
                  }}
                >
                  {confirming
                    ? 'ENTERING THE STUDIO...'
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
