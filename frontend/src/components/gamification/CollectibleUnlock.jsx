// CollectibleUnlock — animated overlay shown when a new collectible is earned
// Trigger: pass collectible={...} to show; null to hide

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const CollectibleUnlock = ({ collectible, domain, onClose, gamingMode = false, gamingColors = {} }) => {
  const fired = useRef(false);
  const gc = gamingColors;
  const accent = gc.primary || '#4ECDC4';
  const glow = gc.glow || accent;

  useEffect(() => {
    if (collectible && !fired.current) {
      fired.current = true;
      const colors = gamingMode
        ? [accent, gc.secondary || accent, '#fff']
        : undefined;
      confetti({ particleCount: 60, spread: 50, startVelocity: 35, origin: { x: 0.5, y: 0.5 }, colors });
    }
    if (!collectible) fired.current = false;
  }, [collectible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {collectible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={gamingMode ? {
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)',
          } : undefined}
          className={gamingMode ? '' : 'fixed inset-0 z-[100] flex items-center justify-center bg-brutal-black/80'}
          onClick={onClose}
        >
          {gamingMode ? (
            // ── Gaming dark style ──────────────────────────────────────────────
            <motion.div
              initial={{ scale: 0.4, opacity: 0, y: 40 }}
              animate={{ scale: 1,   opacity: 1, y: 0  }}
              exit={{    scale: 0.7, opacity: 0        }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: `rgba(10,14,30,0.96)`,
                border: `1px solid rgba(${hexToRgbStr(accent)},0.55)`,
                borderRadius: '20px',
                boxShadow: `0 0 60px rgba(${hexToRgbStr(glow)},0.3)`,
                maxWidth: '400px',
                width: '100%',
                margin: '0 16px',
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              {/* Top glow bar */}
              <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${gc.secondary || accent})` }} />

              <div style={{ padding: '40px 32px' }}>
                {/* Icon */}
                <motion.div
                  animate={{ boxShadow: [
                    `0 0 0 0 rgba(${hexToRgbStr(glow)},0)`,
                    `0 0 0 16px rgba(${hexToRgbStr(glow)},0.25)`,
                    `0 0 0 0 rgba(${hexToRgbStr(glow)},0)`,
                  ]}}
                  transition={{ repeat: 3, duration: 0.9 }}
                  style={{
                    width: 80, height: 80,
                    borderRadius: '16px',
                    background: `rgba(${hexToRgbStr(accent)},0.15)`,
                    border: `2px solid rgba(${hexToRgbStr(accent)},0.6)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}
                >
                  <Sparkles size={36} color={accent} />
                </motion.div>

                {/* Label */}
                <div style={{
                  display: 'inline-block',
                  background: `rgba(${hexToRgbStr(accent)},0.15)`,
                  border: `1px solid rgba(${hexToRgbStr(accent)},0.4)`,
                  borderRadius: 6,
                  padding: '4px 12px',
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  color: accent,
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}>
                  NEW COLLECTIBLE UNLOCKED
                </div>

                {/* Name */}
                <h2 style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#fff',
                  textShadow: `0 0 20px ${glow}`,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                  {collectible.name}
                </h2>

                {domain && (
                  <p style={{
                    fontFamily: "'Jura', sans-serif",
                    fontSize: 10,
                    color: `rgba(${hexToRgbStr(accent)},0.8)`,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}>
                    {domain.toUpperCase()} COLLECTION
                  </p>
                )}

                <p style={{
                  fontFamily: "'Jura', sans-serif",
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.6,
                  marginBottom: 28,
                }}>
                  {collectible.desc}
                </p>

                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: `0 0 28px rgba(${hexToRgbStr(glow)},0.6)` }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onClose}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    background: `linear-gradient(135deg, ${accent}, ${gc.secondary || accent})`,
                    color: '#000',
                    fontFamily: "'Orbitron', monospace",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: `0 4px 20px rgba(${hexToRgbStr(glow)},0.4)`,
                  }}
                >
                  EPIC! CONTINUE <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // ── Brutalist style (non-gaming) ───────────────────────────────────
            <motion.div
              initial={{ scale: 0.4, rotate: -15, opacity: 0 }}
              animate={{ scale: 1,   rotate: 0,   opacity: 1 }}
              exit={{    scale: 0.6, opacity: 0              }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="bg-brutal-white border-4 border-brutal-black shadow-brutal-lg max-w-sm w-full mx-4 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-brutal-green h-2" />
              <div className="p-8 text-center">
                <motion.div
                  animate={{ boxShadow: ['0 0 0 0 rgba(74,222,128,0)', '0 0 0 12px rgba(74,222,128,0.3)', '0 0 0 0 rgba(74,222,128,0)'] }}
                  transition={{ repeat: 3, duration: 0.8 }}
                  className="w-20 h-20 bg-brutal-green border-4 border-brutal-black mx-auto mb-6 flex items-center justify-center"
                >
                  <Sparkles size={36} strokeWidth={2} className="text-brutal-black" />
                </motion.div>
                <div className="bg-brutal-black text-brutal-green text-xs font-black px-3 py-1 inline-block mb-3 tracking-widest">
                  NEW COLLECTIBLE UNLOCKED
                </div>
                <h2 className="text-3xl font-black text-brutal-black mb-2 leading-tight">{collectible.name}</h2>
                {domain && (
                  <p className="text-brutal-black/50 text-xs font-black uppercase tracking-widest mb-3">
                    {domain.toUpperCase()} COLLECTION
                  </p>
                )}
                <p className="text-brutal-black/70 font-bold text-sm mb-6 leading-relaxed">{collectible.desc}</p>
                <motion.button
                  whileHover={{ x: 3, y: 3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="bg-brutal-black border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-8 py-3 font-black text-brutal-white w-full transition-all"
                >
                  <span className="flex items-center justify-center gap-2">EPIC! CONTINUE <ArrowRight size={18} strokeWidth={2.5} /></span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollectibleUnlock;
