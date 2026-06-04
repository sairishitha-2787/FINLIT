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
  const isMusic  = domain === 'music';
  const isDark   = isGaming || isSports || isMusic;
  const TOOLTIP_W = 190;
  const TOOLTIP_PAD = 10;

  let left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
  let top = rect.top - TOOLTIP_PAD;
  if (left < 8) left = 8;
  if (left + TOOLTIP_W > window.innerWidth - 8) left = window.innerWidth - 8 - TOOLTIP_W;

  const accentColor = glowColor || (isMusic ? '#D798A3' : isSports ? '#E8457A' : '#9FE0D3');

  const tooltipStyle = isDark
    ? {
        background: isMusic ? 'rgba(44,31,27,0.97)' : isSports ? 'rgba(15,15,15,0.97)' : 'rgba(20,30,55,0.97)',
        border: `1px solid ${isMusic ? `${accentColor}35` : isSports ? 'rgba(255,255,255,0.18)' : 'rgba(139,184,233,0.35)'}`,
        borderRadius: isMusic ? 14 : 10,
        padding: '10px 14px',
        boxShadow: isMusic ? `0 8px 32px rgba(0,0,0,0.55), 0 0 16px ${accentColor}18` : '0 8px 32px rgba(0,0,0,0.55)',
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
    : isMusic
      ? { fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontWeight: 500, fontStyle: 'italic', color: accentColor, marginBottom: 4 }
      : { fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 600, color: '#9d1f4a', marginBottom: 4 };

  const subStyle = isSports
    ? { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 600, color: accentColor, marginTop: 3 }
    : isGaming
      ? { fontFamily: '"Jura", sans-serif', fontSize: 10, color: '#8BB8E9', marginTop: 3 }
    : isMusic
      ? { fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(243,230,233,0.55)', marginTop: 3 }
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

      {/* Character exclusive label */}
      {badge.characterExclusive && (
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: 4,
          color: accentColor,
          fontFamily: isMusic ? "'DM Sans', sans-serif" : nameStyle.fontFamily,
        }}>
          ★ Exclusive to {badge.characterExclusive.toUpperCase()}
        </div>
      )}

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
// Tier-based fallback gradient when the badge PNG hasn't been dropped in yet
const TIER_FALLBACK = {
  common:    'linear-gradient(160deg, #2a2a2a 0%, #3d3d3d 100%)',
  uncommon:  'linear-gradient(160deg, #1a2e1a 0%, #2d5a2d 100%)',
  rare:      'linear-gradient(160deg, #1a1a3e 0%, #2d3d8a 100%)',
  epic:      'linear-gradient(160deg, #2d1b69 0%, #6b21a8 100%)',
  legendary: 'linear-gradient(160deg, #78350f 0%, #d97706 100%)',
};
const TIER_ACCENT = {
  common: '#9ca3af', uncommon: '#4ade80', rare: '#60a5fa', epic: '#a78bfa', legendary: '#fbbf24',
};

export default function BadgeCard({ badge, domain = 'gaming', size = 100, glowColor }) {
  const [hovered, setHovered] = useState(false);
  const [tooltipRect, setTooltipRect] = useState(null);
  const [imgError, setImgError] = useState(false);
  const containerRef = useRef(null);

  const isGaming = domain === 'gaming';
  const isSports = domain === 'sports';
  const isMusic  = domain === 'music';
  const isDark   = isGaming || isSports || isMusic;
  const w = hexW(size);
  const h = size;

  // Sports, gaming and music use sharp hex; fashion uses rounded hex path.
  const clipPath = isDark
    ? HEX_CLIP_SHARP
    : `path('${hexPathD(w, h, 10)}')`;

  // Character-exclusive badges carry their own glow color via _charGlow
  const resolvedGlow = badge._charGlow
    || glowColor
    || (isSports ? '#E8457A' : isGaming ? '#9FE0D3' : isMusic ? '#D798A3' : '#f7a0b8');

  const glowFilter = badge.isUnlocked
    ? `drop-shadow(0 0 10px ${resolvedGlow}bb) drop-shadow(0 0 4px ${resolvedGlow}77)`
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
            {imgError ? (
              /* ── Fallback when PNG hasn't been added yet ── */
              <div style={{
                width: '100%', height: '100%',
                background: badge.isUnlocked
                  ? (TIER_FALLBACK[badge.tier] || TIER_FALLBACK.common)
                  : 'rgba(30,30,30,0.9)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 4, padding: '8px 6px',
                filter: badge.isUnlocked ? 'none' : 'grayscale(1)',
                opacity: badge.isUnlocked ? 1 : (isDark ? 0.45 : 0.50),
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: badge.isUnlocked
                    ? (badge._charGlow || TIER_ACCENT[badge.tier] || resolvedGlow)
                    : 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 14 }}>
                    {badge.characterExclusive === 'luna' ? '🎤'
                      : badge.characterExclusive === 'jay' ? '🎧'
                      : badge.characterExclusive === 'cypher' ? '⚡'
                      : '🎵'}
                  </span>
                </div>
                <p style={{
                  margin: 0, textAlign: 'center', lineHeight: 1.2,
                  fontSize: 8, fontWeight: 700, letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: badge.isUnlocked
                    ? (TIER_ACCENT[badge.tier] || '#fff')
                    : 'rgba(255,255,255,0.35)',
                  wordBreak: 'break-word', maxWidth: '88%',
                }}>
                  {badge.name}
                </p>
              </div>
            ) : (
              <img
                src={badge.imagePath}
                alt={badge.name}
                draggable={false}
                onError={() => setImgError(true)}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: badge.isUnlocked ? 'none' : 'grayscale(1)',
                  opacity: badge.isUnlocked ? 1 : (isDark ? 0.40 : 0.45),
                  userSelect: 'none',
                }}
              />
            )}
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
            background: isSports ? (glowColor || '#E8457A') : isGaming ? '#9FE0D3' : isMusic ? (glowColor || '#D798A3') : '#d4537e',
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
