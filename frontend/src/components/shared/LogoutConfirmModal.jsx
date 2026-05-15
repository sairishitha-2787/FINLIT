// Confirmation modal shown before signing out.
// `domain` controls the visual style: 'gaming' | 'fashion' | 'default'

import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';

export default function LogoutConfirmModal({ open, domain = 'default', onConfirm, onCancel }) {
  const isGaming  = domain === 'gaming';
  const isFashion = domain === 'fashion';

  // ── Style tokens ─────────────────────────────────────────────────────────────
  const overlay = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 99999,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  };

  const card = isGaming
    ? {
        background: 'rgba(20,30,55,0.98)',
        border: '1px solid rgba(139,184,233,0.30)',
        borderRadius: 18,
        padding: '32px 28px 24px',
        width: 300,
        boxShadow: '0 24px 64px rgba(0,0,0,0.70)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }
    : isFashion
    ? {
        background: 'rgba(255,252,248,0.98)',
        border: '1px solid rgba(247,160,184,0.40)',
        borderRadius: 20,
        padding: '32px 28px 24px',
        width: 300,
        boxShadow: '0 24px 64px rgba(157,31,74,0.18)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }
    : {
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 16,
        padding: '28px 24px 20px',
        width: 290,
        boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
      };

  const iconColor   = isGaming ? '#FF6B6B' : isFashion ? '#d4537e' : '#ef4444';
  const titleColor  = isGaming ? '#F0FFFA'  : isFashion ? '#9d1f4a' : '#111827';
  const bodyColor   = isGaming ? '#8BB8E9'  : isFashion ? '#b0627a' : '#6b7280';
  const titleFont   = isGaming ? '"Orbitron", sans-serif' : isFashion ? "'Playfair Display', serif" : 'inherit';
  const bodyFont    = isGaming ? '"Jura", sans-serif'     : isFashion ? "'DM Sans', sans-serif"     : 'inherit';

  const btnYes = {
    flex: 1,
    padding: '10px 0',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: isGaming ? '0.8px' : '0.2px',
    fontFamily: bodyFont,
    background: isGaming ? '#FF6B6B' : isFashion ? '#d4537e' : '#ef4444',
    color: '#fff',
    transition: 'opacity 0.15s',
  };

  const btnNo = {
    flex: 1,
    padding: '10px 0',
    borderRadius: 10,
    border: `1px solid ${isGaming ? 'rgba(139,184,233,0.35)' : isFashion ? 'rgba(247,160,184,0.40)' : '#e5e7eb'}`,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    fontFamily: bodyFont,
    background: 'transparent',
    color: bodyColor,
    transition: 'opacity 0.15s',
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="logout-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={overlay}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 12 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.92, opacity: 0, y: 6  }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            style={card}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: isGaming ? 'rgba(255,107,107,0.15)' : isFashion ? 'rgba(212,83,126,0.12)' : 'rgba(239,68,68,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <LogOut size={22} color={iconColor} />
              </div>
            </div>

            {/* Title */}
            <div style={{
              fontFamily: titleFont,
              fontSize: isGaming ? 13 : 16,
              fontWeight: isGaming ? 800 : 600,
              color: titleColor,
              textAlign: 'center',
              letterSpacing: isGaming ? '1.5px' : '0',
              textTransform: isGaming ? 'uppercase' : 'none',
              marginBottom: 8,
            }}>
              {isGaming ? 'Sign Out?' : 'Sign out?'}
            </div>

            {/* Body */}
            <div style={{
              fontFamily: bodyFont,
              fontSize: 13,
              color: bodyColor,
              textAlign: 'center',
              lineHeight: 1.5,
              marginBottom: 24,
            }}>
              {isGaming
                ? 'Your progress is saved. Ready to log off?'
                : isFashion
                ? 'Your style journey is saved. Sign out?'
                : 'Are you sure you want to sign out?'}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={btnNo}  onClick={onCancel}>Stay</button>
              <button style={btnYes} onClick={onConfirm}>Sign out</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
