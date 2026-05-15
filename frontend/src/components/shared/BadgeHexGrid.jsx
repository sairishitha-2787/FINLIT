// FINLIT — BadgeHexGrid
// Pointy-top hex layout. Unlocked: badge image + glow ring. Locked: clip-path hex.
// Mystery badges (far from user progress) show as "???" to encourage progression.

import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, HelpCircle } from 'lucide-react';

// Pointy-top hex: W/H = √3/2 ≈ 0.866
// `size` prop = hex HEIGHT. Width is derived.
const HEX_RATIO = Math.sqrt(3) / 2;           // ≈ 0.866
const HEX_CLIP  = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

function hexW(size) { return Math.round(size * HEX_RATIO); }

// SVG path string for a pointy-top hex with optional rounded corners (r=0 → sharp)
function hexPathD(w, h, r = 0) {
  const pts = [
    [w / 2, 0],
    [w,     h / 4],
    [w,     h * 3 / 4],
    [w / 2, h],
    [0,     h * 3 / 4],
    [0,     h / 4],
  ];
  const n = pts.length;
  const f = v => v.toFixed(1);
  if (r <= 0) {
    return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${f(x)} ${f(y)}`).join(' ') + 'Z';
  }
  let d = '';
  for (let i = 0; i < n; i++) {
    const [cx, cy] = pts[i];
    const [px, py] = pts[(i + n - 1) % n];
    const [nx, ny] = pts[(i + 1) % n];
    const lp = Math.hypot(px - cx, py - cy);
    const ln = Math.hypot(nx - cx, ny - cy);
    const rc = Math.min(r, lp / 2, ln / 2);
    const sx = cx + (px - cx) / lp * rc,  sy = cy + (py - cy) / lp * rc;
    const ex = cx + (nx - cx) / ln * rc,  ey = cy + (ny - cy) / ln * rc;
    d += i === 0 ? `M${f(sx)} ${f(sy)}` : `L${f(sx)} ${f(sy)}`;
    d += ` Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`;
  }
  return d + 'Z';
}

// SVG outline that matches the hex shape (sharp for gaming, rounded for fashion)
function HexOutlineSVG({ w, h, color, opacity = 1, strokeWidth = 2, rounded = false }) {
  const d = hexPathD(w, h, rounded ? 10 : 0);
  return (
    <svg
      width={w} height={h}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 4 }}
    >
      <path d={d} fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeOpacity={opacity} />
    </svg>
  );
}

// ── Domain theme tokens ───────────────────────────────────────────────────────
const THEMES = {
  gaming: {
    lockedBg:        'rgba(30,42,69,0.85)',
    lockedText:      'rgba(139,184,233,0.80)',
    lockedBorder:    'rgba(139,184,233,0.30)',
    lockedLock:      'rgba(139,184,233,0.55)',
    // glow colours — used to build drop-shadow filter strings
    glowColor:       '#00ffc8',
    glowAlt:         '#00aaff',
    ringGradient:    'linear-gradient(135deg, #00ffc8, #00aaff, #00ffc8)',
    tooltipBg:       'rgba(15,20,40,0.96)',
    tooltipBorder:   'rgba(159,224,211,0.35)',
    tooltipName:     '#9FE0D3',
    tooltipDate:     'rgba(139,184,233,0.70)',
    fontName:        '"Orbitron", sans-serif',
    fontBody:        '"Jura", sans-serif',
    fontLabel:       '"Michroma", sans-serif',
  },
  fashion: {
    lockedBg:        'rgba(255,255,255,0.12)',
    lockedText:      'rgba(157,31,74,0.60)',
    lockedBorder:    'rgba(247,160,184,0.22)',
    lockedLock:      'rgba(201,138,158,0.65)',
    glowColor:       '#f7a0b8',
    glowAlt:         '#c084fc',
    ringGradient:    'linear-gradient(135deg, #f7a0b8, #c084fc, #f7a0b8)',
    tooltipBg:       'rgba(255,255,255,0.92)',
    tooltipBorder:   'rgba(247,160,184,0.50)',
    tooltipName:     '#9d1f4a',
    tooltipDate:     '#c98a9e',
    fontName:        "'Playfair Display', serif",
    fontBody:        "'DM Sans', sans-serif",
    fontLabel:       "'DM Sans', sans-serif",
  },
};

// ── Single badge ──────────────────────────────────────────────────────────────
function HexBadge({ badge, domain, size = 110, isMystery = false }) {
  const [hovered, setHovered] = useState(false);
  const [tipPos, setTipPos] = useState({ bottom: 0, left: 0 });
  const containerRef = useRef(null);
  const theme     = THEMES[domain] || THEMES.gaming;
  const w         = hexW(size);
  const h         = size;
  const isFashion = domain === 'fashion';
  // Fashion locked/mystery frames use soft-edged rounded hex; gaming stays sharp
  const hexClip   = isFashion
    ? `path('${hexPathD(w, h, 10)}')`
    : HEX_CLIP;

  const { name, imagePath, isUnlocked, dateEarned, desc } = badge;

  const formattedDate = dateEarned
    ? new Date(dateEarned).toLocaleDateString('en-US',
        { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  const c  = theme.glowColor;
  const ca = theme.glowAlt;
  const hexD       = hexPathD(w, h, isFashion ? 10 : 0);
  const hexDAmbient = hexPathD(w, h, isFashion ? 14 : 2);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      setTipPos({
        // fixed bottom = distance from viewport bottom to badge top, + 10px gap
        bottom: window.innerHeight - r.top + 10,
        left: r.left + r.width / 2,
      });
    }
    setHovered(true);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: w, height: h, flexShrink: 0 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      {isUnlocked ? (
        /* ── Unlocked ────────────────────────────────────────────────────── */
        <motion.div
          animate={hovered ? { scale: 1.08 } : { scale: 1 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{ position: 'relative', width: w, height: h }}
        >
          {/* Fashion only: ambient blur ring + outline glow (gaming stays clean, no glow) */}
          {isFashion && (
            <>
              <motion.svg
                width={w} height={h}
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, filter: 'blur(7px)', pointerEvents: 'none' }}
                animate={hovered ? { opacity: 1 } : { opacity: [0.35, 0.65, 0.35] }}
                transition={hovered ? { duration: 0.18 } : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path d={hexDAmbient} fill="none" stroke={c} strokeWidth={10} />
              </motion.svg>

              <motion.svg
                width={w} height={h}
                style={{
                  position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none',
                  filter: hovered
                    ? `drop-shadow(0 0 8px ${c}) drop-shadow(0 0 18px ${c}bb) drop-shadow(0 0 4px ${ca})`
                    : `drop-shadow(0 0 4px ${c}cc)`,
                }}
                animate={hovered ? { opacity: 1 } : { opacity: [0.75, 1, 0.75] }}
                transition={hovered ? { duration: 0.18 } : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path d={hexD} fill="none" stroke={c} strokeWidth={hovered ? 2.5 : 1.8} />
              </motion.svg>
            </>
          )}

          {/* Badge image — plain div, no filter */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: w, height: h,
            clipPath: hexClip,
            overflow: 'hidden',
            zIndex: 1,
          }}>
            <img
              src={imagePath}
              alt={name}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                display: 'block',
                cursor: 'default',
              }}
            />
          </div>
        </motion.div>
      ) : isMystery ? (
        /* ── Mystery locked: "???" — hidden badge ─────────────────────────── */
        <>
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: w, height: h,
            clipPath: hexClip,
            overflow: 'hidden',
            opacity: 0.45,
            cursor: 'default',
            background: theme.lockedBg,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <HelpCircle size={18} color={theme.lockedLock} strokeWidth={1.5} />
            <p style={{
              fontFamily: theme.fontBody, fontSize: 11, fontWeight: 700,
              color: theme.lockedText, margin: 0, letterSpacing: '0.12em',
            }}>???</p>
          </div>
          <HexOutlineSVG w={w} h={h} color={theme.lockedBorder} opacity={0.25} strokeWidth={1} rounded={isFashion} />
        </>
      ) : (
        /* ── Locked: clip-path hex with lock + name ───────────────────────── */
        <>
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: w, height: h,
            clipPath: hexClip,
            overflow: 'hidden',
            opacity: 0.65,
            cursor: 'default',
          }}>
            <div style={{
              width: '100%', height: '100%',
              background: theme.lockedBg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '16px 8px 12px',
              boxSizing: 'border-box',
            }}>
              <Lock size={14} color={theme.lockedLock} strokeWidth={2}
                style={{ marginBottom: 2, flexShrink: 0 }} />
              <p style={{
                fontFamily: theme.fontBody,
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: domain === 'gaming' ? '0.08em' : '0.04em',
                textTransform: 'uppercase',
                color: theme.lockedText,
                textAlign: 'center',
                lineHeight: 1.3,
                margin: 0,
                wordBreak: 'break-word',
                maxWidth: '88%',
              }}>
                {name}
              </p>
            </div>
          </div>
          <HexOutlineSVG w={w} h={h} color={theme.lockedBorder} opacity={0.40} strokeWidth={1.5} rounded={isFashion} />
        </>
      )}

      {/* ── Hover tooltip — portal to body so scroll/overflow never clips it ── */}
      {hovered && !isMystery && ReactDOM.createPortal(
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.93 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'fixed',
              bottom: tipPos.bottom,
              left: tipPos.left,
              transform: 'translateX(-50%)',
              zIndex: 9999,
              pointerEvents: 'none',
              width: 170,
            }}
          >
            <div style={{
              background: theme.tooltipBg,
              border: `1px solid ${theme.tooltipBorder}`,
              borderRadius: 12,
              padding: '10px 12px',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: domain === 'fashion'
                ? '0 8px 24px rgba(247,160,184,0.22), 0 2px 8px rgba(0,0,0,0.08)'
                : '0 8px 24px rgba(0,0,0,0.50)',
              textAlign: 'center',
            }}>
              {/* Badge name */}
              <div style={{
                fontFamily: theme.fontName,
                fontSize: domain === 'fashion' ? 13 : 11,
                fontWeight: 600,
                color: theme.tooltipName,
                letterSpacing: domain === 'gaming' ? '0.06em' : '-0.01em',
                marginBottom: 5,
                lineHeight: 1.2,
              }}>
                {name}
              </div>

              {/* Status line */}
              {isUnlocked ? (
                formattedDate && (
                  <div style={{
                    fontFamily: theme.fontLabel, fontSize: 9,
                    color: theme.tooltipDate, letterSpacing: '0.04em', marginBottom: 5,
                  }}>
                    Earned {formattedDate}
                  </div>
                )
              ) : (
                <div style={{
                  fontFamily: theme.fontLabel, fontSize: 9,
                  color: theme.tooltipDate, letterSpacing: '0.04em', marginBottom: 5,
                  textTransform: 'uppercase',
                }}>
                  Locked
                </div>
              )}

              {/* Requirement — only shown for locked badges */}
              {!isUnlocked && desc && (
                <div style={{
                  fontFamily: theme.fontBody,
                  fontSize: 10,
                  color: theme.tooltipDate,
                  lineHeight: 1.4,
                  borderTop: `1px solid ${theme.tooltipBorder}`,
                  paddingTop: 5,
                  marginTop: 2,
                }}>
                  {desc}
                </div>
              )}
            </div>
            <div style={{
              position: 'absolute',
              top: '100%', left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `6px solid ${theme.tooltipBorder}`,
            }} />
          </motion.div>,
          document.body
        )}
    </div>
  );
}

// ── Badge hex grid ────────────────────────────────────────────────────────────
// Display rules:
//   - Unlocked badges: always shown with glow
//   - Locked badges within REVEAL_RADIUS of any unlocked: shown with name + lock
//   - Locked badges beyond REVEAL_RADIUS: shown as mystery "???"
//   - If zero unlocked badges: show first STARTER_VISIBLE as locked, rest as mystery
const REVEAL_RADIUS = 3;   // how many locked badges ahead to reveal
const STARTER_VISIBLE = 6; // locked badges visible before any are earned

export default function BadgeHexGrid({ badges = [], domain = 'gaming', badgeSize = 110 }) {
  if (!badges.length) return null;

  // Find the last unlocked badge index
  const lastUnlockedIdx = badges.reduce((acc, b, i) => b.isUnlocked ? i : acc, -1);

  // A badge is revealed if it is unlocked, or within REVEAL_RADIUS of the last unlocked
  const revealThreshold = lastUnlockedIdx >= 0
    ? lastUnlockedIdx + REVEAL_RADIUS
    : STARTER_VISIBLE - 1;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '18px 12px',
      justifyContent: 'flex-start',
    }}>
      {badges.map((badge, i) => {
        const mystery = !badge.isUnlocked && i > revealThreshold;
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.82, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            transition={{ delay: i * 0.03, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <HexBadge badge={badge} domain={domain} size={badgeSize} isMystery={mystery} />
          </motion.div>
        );
      })}
    </div>
  );
}
