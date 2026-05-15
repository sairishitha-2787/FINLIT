// FINLIT - XP Popup Component
// Floating XP reward toast — supports gaming and brutalist modes

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { gamingTheme } from '../../styles/gamingTheme';

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const XPPopup = ({ popups, gamingMode, gamingColors }) => {
  const gc = gamingColors || {};

  return (
    <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 9000, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence>
        {popups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, x: 60, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            {gamingMode && gc.primary ? (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
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
