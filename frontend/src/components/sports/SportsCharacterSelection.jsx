import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { SPORTS_CHARACTERS } from '../../contexts/SportsContext';
import { sportsTheme } from '../../styles/sportsTheme';

const CHAR_ARRAY = Object.values(SPORTS_CHARACTERS);

// Sport emoji per character — visual identity without full-art
const CHAR_EMOJI = {
  striker:  '⚡',
  playmaker: '🎯',
  captain:  '🏆',
};

const CHAR_PHILOSOPHY = {
  striker:  'Aggressive income growth. Chase opportunities others miss.',
  playmaker:'Balanced strategy. Budget, plan, control the whole field.',
  captain:  'Long-term legacy building. Wealth that outlasts the season.',
};

export default function SportsCharacterSelection({ isOpen, onSelect }) {
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setConfirming(true);
    setTimeout(() => onSelect(selected), 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: sportsTheme.bgDark,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '20px 16px',
          overflow: 'auto',
        }}
      >
        {/* Faint grid layer */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: '680px', width: '100%',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              fontFamily: sportsTheme.fontSub,
              fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: sportsTheme.textMuted, marginBottom: '8px',
            }}>
              SELECT YOUR ARCHETYPE
            </div>
            <h1 style={{
              fontFamily: sportsTheme.fontHeading,
              fontSize: 'clamp(32px, 6vw, 52px)',
              color: sportsTheme.textPrimary,
              letterSpacing: '3px', margin: '0 0 10px',
            }}>
              WHO ARE YOU ON THE PITCH?
            </h1>
            <p style={{
              fontFamily: sportsTheme.fontBody,
              fontSize: '14px',
              color: sportsTheme.textMuted,
            }}>
              Your archetype shapes your financial philosophy and colour signature throughout the app.
            </p>
          </div>

          {/* Character cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {CHAR_ARRAY.map((c) => {
              const isActive = selected === c.id;
              return (
                <motion.button
                  key={c.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelect(c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '18px 20px',
                    background: isActive ? c.dim : 'rgba(22,22,22,0.95)',
                    borderRadius: '8px',
                    border: isActive ? `1px solid ${c.color}` : '1px solid rgba(255,255,255,0.07)',
                    borderLeft: `4px solid ${c.color}`,
                    boxShadow: isActive ? `0 0 24px ${c.glow}` : sportsTheme.cardShadow,
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all 0.18s ease',
                    outline: 'none',
                  }}
                >
                  {/* Emoji */}
                  <div style={{
                    fontSize: '32px', flexShrink: 0, width: '44px', textAlign: 'center',
                    filter: isActive ? 'none' : 'grayscale(60%) brightness(0.7)',
                    transition: 'filter 0.2s',
                  }}>
                    {CHAR_EMOJI[c.id]}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{
                        fontFamily: sportsTheme.fontHeading,
                        fontSize: '24px', color: c.color, letterSpacing: '1px',
                      }}>
                        {c.name}
                      </span>
                      {/* Color swatch */}
                      <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: c.color,
                        boxShadow: isActive ? `0 0 8px ${c.glow}` : 'none',
                      }} />
                    </div>
                    <div style={{
                      fontFamily: sportsTheme.fontSub,
                      fontSize: '10px', fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: isActive ? c.color : sportsTheme.textMuted,
                      marginBottom: '4px',
                    }}>
                      {c.role}
                    </div>
                    <div style={{
                      fontFamily: sportsTheme.fontBody,
                      fontSize: '13px',
                      color: isActive ? sportsTheme.textSecondary : sportsTheme.textMuted,
                    }}>
                      {CHAR_PHILOSOPHY[c.id]}
                    </div>
                  </div>

                  {/* Selection indicator */}
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    flexShrink: 0,
                    background: isActive ? c.color : 'rgba(255,255,255,0.06)',
                    border: isActive ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    {isActive
                      ? <Check size={14} color="#000" strokeWidth={3} />
                      : <ChevronRight size={14} color="rgba(255,255,255,0.2)" strokeWidth={2} />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Confirm button */}
          <motion.button
            whileHover={selected ? { filter: 'brightness(1.1)' } : {}}
            whileTap={selected ? { scale: 0.98 } : {}}
            onClick={handleConfirm}
            disabled={!selected || confirming}
            style={{
              width: '100%', padding: '14px',
              borderRadius: '8px',
              background: selected
                ? SPORTS_CHARACTERS[selected]?.color || '#E8457A'
                : 'rgba(255,255,255,0.06)',
              border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
              fontFamily: sportsTheme.fontHeading,
              fontSize: '22px', letterSpacing: '2px',
              color: selected ? '#000' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.2s ease',
              boxShadow: selected && !confirming
                ? `0 4px 24px ${SPORTS_CHARACTERS[selected]?.glow || 'rgba(232,69,122,0.4)'}`
                : 'none',
            }}
          >
            {confirming ? 'ENTERING THE PITCH...' : selected ? `PLAY AS ${SPORTS_CHARACTERS[selected]?.name.toUpperCase()}` : 'SELECT AN ARCHETYPE'}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
