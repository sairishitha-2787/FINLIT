// FINLIT - XP Popup Component
// Floating XP reward toast — supports gaming and brutalist modes
// Also renders badge unlock notifications when `badge` prop is set.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Star } from 'lucide-react';
import { gamingTheme } from '../../styles/gamingTheme';

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const popVariants = {
  initial: { opacity: 0, x: 60, scale: 0.85 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit:    { opacity: 0, x: 60, scale: 0.85 },
};

const XPPopup = ({ popups, gamingMode, gamingColors, badge }) => {
  const gc = gamingColors || {};

  return (
    <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 9000, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Badge unlock notification */}
      <AnimatePresence>
        {badge && (
          <motion.div
            key="badge-unlock"
            variants={popVariants}
            initial="initial" animate="animate" exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            {gamingMode && gc.primary ? (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 999,
                background: 'rgba(15,20,40,0.95)',
                backdropFilter: 'blur(12px)',
                border: `1px solid rgba(${hexToRgbStr(gc.primary)},0.65)`,
                boxShadow: `0 0 20px rgba(${hexToRgbStr(gc.primary)},0.35), 0 4px 16px rgba(0,0,0,0.5)`,
              }}>
                <Star size={13} color={gc.primary} fill={gc.primary} />
                <span style={{
                  fontFamily: gamingTheme.fontHeading,
                  fontSize: 11, fontWeight: 700,
                  color: gc.primary, letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                }}>
                  BADGE UNLOCKED
                </span>
                <span style={{
                  fontFamily: gamingTheme.fontBody,
                  fontSize: 11, color: gamingTheme.seafoam,
                  letterSpacing: '0.5px',
                }}>
                  · {badge.name}
                </span>
              </div>
            ) : (
              <div className="bg-brutal-yellow border-4 border-brutal-black shadow-brutal px-5 py-2 rounded-none inline-flex items-center gap-2">
                <Star size={14} strokeWidth={2.5} />
                <span className="text-brutal-black font-black text-sm">
                  BADGE: {badge.name}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP popups */}
      <AnimatePresence>
        {popups.map((popup) => (
          <motion.div
            key={popup.id}
            variants={popVariants}
            initial="initial" animate="animate" exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            {gamingMode && gc.primary ? (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '999px',
                background: `rgba(15,20,40,0.88)`,
                backdropFilter: 'blur(12px)',
                border: `1px solid rgba(${hexToRgbStr(gc.primary)},0.5)`,
                boxShadow: `0 0 16px rgba(${hexToRgbStr(gc.primary)},0.25), 0 4px 16px rgba(0,0,0,0.4)`,
              }}>
                <Zap size={13} color={gc.primary} fill={gc.primary} />
                <span style={{
                  fontFamily: gamingTheme.fontHeading,
                  fontSize: '12px', fontWeight: 700,
                  color: gc.primary, letterSpacing: '1.5px',
                }}>
                  +{popup.amount} XP
                </span>
                {popup.label && (
                  <span style={{
                    fontFamily: gamingTheme.fontBody,
                    fontSize: '11px',
                    color: gamingTheme.seafoam,
                    letterSpacing: '0.5px',
                  }}>
                    · {popup.label}
                  </span>
                )}
              </div>
            ) : (
              <div className="bg-brutal-green border-4 border-brutal-black shadow-brutal px-5 py-2 rounded-none inline-flex items-center gap-2">
                <Zap size={14} strokeWidth={2.5} />
                <span className="text-brutal-black font-black text-sm">
                  +{popup.amount} XP{popup.label ? ` · ${popup.label}` : ''}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default XPPopup;
