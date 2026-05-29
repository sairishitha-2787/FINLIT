// frontend/src/components/achievements/BadgeCard.jsx
// Individual badge rendered as a pointy-top hexagon.
// Glow color comes from the user's chosen character element (gaming)
// or a fixed theme color (fashion) — no tier-based effects.

import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { hexW, hexPathD } from './hexUtils';

const HEX_CLIP_SHARP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';


function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ── Tooltip portal ────────────────────────────────────────────────────────────
function TooltipPortal({ badge, domain, rect, glowColor }) {
  if (!rect) return null;

  const isGaming = domain === 'gaming';
  const isSports = domain === 'sports';
  const isDark   = isGaming || isSports;
  const TOOLTIP_W = 190;
  const TOOLTIP_PAD = 10;

  let left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
  let top = rect.top - TOOLTIP_PAD;
  if (left < 8) left = 8;
  if (left + TOOLTIP_W > window.innerWidth - 8) left = window.innerWidth - 8 - TOOLTIP_W;

  const tooltipStyle = isDark
    ? {
        background: isSports ? 'rgba(15,15,15,0.97)' : 'rgba(20,30,55,0.97)',
        border: `1px solid ${isSports ? 'rgba(255,255,255,0.18)' : 'rgba(139,184,233,0.35)'}`,
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }
    : {
        background: 'rgba(255,252,248,0.97)',
        border: '1px solid rgba(247,160,184,0.45)',
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(157,31,74,0.12)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      };

  const nameStyle = isSports
    ? { fontFamily: "'Bebas Neue', cursive", fontSize: 14, fontWeight: 400, color: '#fff', letterSpacing: '1px', marginBottom: 4 }
    : isGaming
      ? { fontFamily: '"Orbitron", sans-serif', fontSize: 11, fontWeight: 700, color: '#F0FFFA', letterSpacing: '0.5px', marginBottom: 4 }
      : { fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 600, color: '#9d1f4a', marginBottom: 4 };

  const subStyle = isSports
    ? { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 600, color: glowColor || '#E8457A', marginTop: 3 }
    : isGaming
      ? { fontFamily: '"Jura", sans-serif', fontSize: 10, color: '#8BB8E9', marginTop: 3 }
      : { fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#b0627a', marginTop: 3 };

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        left,
        top,
        transform: 'translateY(-100%)',
        width: TOOLTIP_W,
        zIndex: 99999,
        pointerEvents: 'none',
        ...tooltipStyle,
      }}
    >
      <div style={nameStyle}>{badge.name}</div>
      {badge.isUnlocked ? (
        badge.dateEarned && (
          <div style={subStyle}>Earned {formatDate(badge.dateEarned)}</div>
        )
      ) : (
        badge.hintWhenLocked && (
          <div style={subStyle}>{badge.hintWhenLocked}</div>
        )
      )}
    </div>,
    document.body
  );
}

// ── BadgeCard ─────────────────────────────────────────────────────────────────
export default function BadgeCard({ badge, domain = 'gaming', size = 100, glowColor }) {
  const [hovered, setHovered] = useState(false);
  const [tooltipRect, setTooltipRect] = useState(null);
  const containerRef = useRef(null);

  const isGaming = domain === 'gaming';
  const isSports = domain === 'sports';
  const isDark   = isGaming || isSports;
  const w = hexW(size);
  const h = size;

  // Sports and gaming use sharp hex; fashion uses rounded hex path.
  const clipPath = (isGaming || isSports)
    ? HEX_CLIP_SHARP
    : `path('${hexPathD(w, h, 10)}')`;

  const resolvedGlow = glowColor || (isSports ? '#E8457A' : isGaming ? '#9FE0D3' : '#f7a0b8');
  const glowFilter = badge.isUnlocked
    ? `drop-shadow(0 0 8px ${resolvedGlow}99) drop-shadow(0 0 3px ${resolvedGlow}66)`
    : 'none';

  const isNew = badge.isUnlocked && badge.dateEarned
    ? Date.now() - new Date(badge.dateEarned).getTime() < 86400000
    : false;

  const handleMouseEnter = useCallback(() => {
    if (containerRef.current) setTooltipRect(containerRef.current.getBoundingClientRect());
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTooltipRect(null);
  }, []);

  return (
    <>
      <motion.div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ position: 'relative', width: w, height: h, flexShrink: 0 }}
      >
        {/* Glow wrapper must be outside the clip-path element so drop-shadow isn't clipped */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: w, height: h,
          filter: glowFilter,
        }}>
          <div style={{
            width: '100%', height: '100%',
            clipPath, WebkitClipPath: clipPath,
            overflow: 'hidden',
          }}>
            <img
              src={badge.imagePath}
              alt={badge.name}
              draggable={false}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: badge.isUnlocked ? 'none' : 'grayscale(1)',
                opacity: badge.isUnlocked ? 1 : (isDark ? 0.40 : 0.45),
                userSelect: 'none',
              }}
            />
          </div>
        </div>

        {!badge.isUnlocked && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock size={14} color={isDark ? 'rgba(255,255,255,0.55)' : 'rgba(157,31,74,0.6)'} />
          </div>
        )}

        {isNew && (
          <div style={{
            position: 'absolute',
            top: Math.round(h * 0.06), right: Math.round(w * 0.02),
            zIndex: 4,
            background: isSports ? (glowColor || '#E8457A') : isGaming ? '#9FE0D3' : '#d4537e',
            color: isDark ? '#000' : '#fff',
            fontFamily: isSports ? "'Barlow Condensed', sans-serif" : isDark ? '"Michroma", sans-serif' : "'DM Sans', sans-serif",
            fontSize: 9, fontWeight: 800, letterSpacing: '0.8px',
            padding: '3px 7px', borderRadius: 999, lineHeight: 1.2,
            pointerEvents: 'none',
          }}>
            NEW
          </div>
        )}
      </motion.div>

      {hovered && (
        <TooltipPortal
          badge={badge}
          domain={domain}
          rect={tooltipRect}
          glowColor={resolvedGlow}
        />
      )}
    </>
  );
}
