import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, BarChart2, Trophy,
  Menu, X, LogOut, WifiOff, FileText, Settings,
  Music, Zap, Cpu,
} from 'lucide-react';

import { useMusic } from '../contexts/MusicContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useGamification } from '../hooks/useGamification';
import { useIsMobile } from '../hooks/useIsMobile';
import { useOfflineSync } from '../hooks/useOfflineSync';

import MusicDomain        from '../pages/music/MusicDomain';
import LogoutConfirmModal from '../components/shared/LogoutConfirmModal';

import { musicTheme, CLUSTER_MAP, getMusicTier, getMusicTierName } from '../styles/musicTheme';

// ─── Font injection (all cluster fonts preloaded) ─────────────────────────────
let fontsInjected = false;
function useMusicFonts() {
  useEffect(() => {
    if (fontsInjected) return;
    fontsInjected = true;
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = [
      'https://fonts.googleapis.com/css2?',
      'family=Bebas+Neue',
      '&family=Barlow+Condensed:wght@600;800',
      '&family=Orbitron:wght@400;700;900',
      '&family=Space+Mono:ital,wght@0,400;0,700;1,400',
      '&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400',
      '&family=DM+Sans:wght@400;500;600',
      '&display=swap',
    ].join('');
    document.head.appendChild(link);
  }, []);
}

// shared vinyl disc JSX helper — mirrors the Vinyl Records reference record art
function VinylDisc({ size, top, bottom, left, right, speed, direction = 1, opacity }) {
  return (
    <motion.div
      animate={{ rotate: 360 * direction }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute', top, bottom, left, right,
        width: size, height: size, borderRadius: '50%',
        background: `
          repeating-radial-gradient(circle at center,
            rgba(0,0,0,0) 0 2px, rgba(85,31,34,0.16) 2px 3px, rgba(0,0,0,0) 3px 6px),
          radial-gradient(circle at center, #1c1614 0 28%, #0c0a09 28% 30%, #161210 30% 100%)
        `,
        opacity,
      }}
    >
      {/* Center label */}
      <div style={{ position: 'absolute', inset: '42%', borderRadius: '50%', background: 'radial-gradient(circle at center, #8A2D31 0 60%, #551F22 60%)', boxShadow: '0 0 0 4px rgba(0,0,0,0.4)' }} />
      {/* Spindle hole */}
      <div style={{ position: 'absolute', inset: '48%', borderRadius: '50%', background: '#0a0807', zIndex: 2 }} />
    </motion.div>
  );
}

// ─── Vinyl background (JAY) ───────────────────────────────────────────────────
// Mirrors Vinyl Records.html: deep Nuln-Oil base, warm crimson glow, and three
// spinning records (large one anchored top-right) over a fine grain overlay.
function VinylBackground({ color }) {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>
      {/* Base */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#130F0D' }} />
      {/* Warm crimson glow — top right (behind the big record) */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 82% 8%, rgba(138,45,49,0.45) 0%, transparent 55%)' }} />
      {/* Character color accent — bottom left */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 50% 38% at 18% 100%, ${color}16 0%, transparent 55%)` }} />

      {/* Vinyl 1 — large, TOP-right (focal record, matches reference) */}
      <VinylDisc size={680} top={-180} right={-180} speed={24} direction={1} opacity={0.55} />
      {/* Vinyl 2 — medium, bottom-left */}
      <VinylDisc size={520} bottom={-170} left={-150} speed={32} direction={-1} opacity={0.3} />
      {/* Vinyl 3 — small, center */}
      <VinylDisc size={300} top="44%" left="38%" speed={18} direction={1} opacity={0.2} />

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 200px rgba(0,0,0,0.6)' }} />
      {/* Grain texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}

// ─── Neon background (CYPHER) ─────────────────────────────────────────────────
function NeonBackground({ color }) {
  const particles = useMemo(() =>
    [...Array(24)].map((_, i) => ({
      left:     `${(i * 4.2 + 1) % 100}%`,
      top:      `${(i * 6.7 + 2) % 100}%`,
      size:     1.5 + (i % 3),
      opacity:  0.22 + (i % 3) * 0.1,
      duration: 1.4 + (i % 4) * 0.5,
      delay:    (i % 6) * 0.28,
      isAccent: i % 3 === 0,
    })), []);

  // Equalizer spectrum — bars bounce on staggered cycles. `base` follows a gentle
  // arc envelope so the row reads like a live audio spectrum rather than noise.
  const N_BARS = 44;
  const eqBars = useMemo(() =>
    [...Array(N_BARS)].map((_, i) => ({
      base:     0.22 + 0.58 * Math.sin((i / (N_BARS - 1)) * Math.PI),
      duration: 0.85 + (i % 5) * 0.16,
      delay:    (i % 7) * 0.11,
    })), []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>
      {/* Purple-blue gradient base */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #1D0225 0%, #0e0114 60%, #260B68 100%)' }} />
      {/* Animated vertical glitch columns */}
      <motion.div
        animate={{ x: [0, 0, -8, -8, 6, 6, -3, -3, 0, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear', times: [0, 0.08, 0.09, 0.28, 0.29, 0.52, 0.53, 0.74, 0.75, 1] }}
        style={{
          position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.5,
          background: `
            linear-gradient(90deg, transparent 0 70%, rgba(194,49,201,0.40) 70% 72%, transparent 72%),
            linear-gradient(90deg, transparent 0 30%, rgba(107,162,235,0.30) 30% 31%, transparent 31%),
            linear-gradient(90deg, transparent 0 52%, rgba(76,93,215,0.20) 52% 53%, transparent 53%),
            repeating-linear-gradient(0deg, transparent 0 38px, rgba(76,93,215,0.06) 38px 40px)
          `,
        }}
      />
      {/* Scan lines */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px)' }} />
      {/* Cyan top glow */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${color}22 0%, transparent 55%)` }} />
      {/* Magenta left bloom */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 55% at 15% 20%, rgba(194,49,201,0.22) 0%, transparent 60%)' }} />
      {/* Magenta corner bloom */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 30% at 0% 100%, rgba(194,49,201,0.18) 0%, transparent 55%)' }} />
      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 200px rgba(0,0,0,0.70)' }} />
      {/* Dual-color particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [p.opacity * 0.2, p.opacity, p.opacity * 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: p.left, top: p.top,
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.isAccent ? '#C231C9' : color,
            boxShadow: `0 0 ${p.size * 4}px ${p.isAccent ? '#C231C9' : color}`,
          }}
        />
      ))}

      {/* Equalizer spectrum — anchored at the bottom, fading up via a mask */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: '32%', display: 'flex', alignItems: 'flex-end',
        gap: 3, padding: '0 16px', opacity: 0.32,
        WebkitMaskImage: 'linear-gradient(to top, #000 0%, transparent 100%)',
        maskImage: 'linear-gradient(to top, #000 0%, transparent 100%)',
      }}>
        {eqBars.map((b, i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [b.base * 0.35, b.base, b.base * 0.55] }}
            transition={{ duration: b.duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: b.delay }}
            style={{
              flex: 1, height: '100%', transformOrigin: 'bottom',
              borderRadius: '2px 2px 0 0',
              background: 'linear-gradient(180deg, #6BA2EB 0%, #4C5DD7 45%, #C231C9 100%)',
              boxShadow: '0 0 6px rgba(194,49,201,0.4)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Dreamy background (LUNA) ─────────────────────────────────────────────────
// Butterflies use the same rAF velocity approach as the reference HTML —
// each element gets a random nudge every frame for organic Brownian drift.
function DreamyBackground({ color }) {
  const BF_COUNT = 9;
  const SP_COUNT = 6;
  const fliesRef = useRef([]);

  const bfData = useMemo(() =>
    [...Array(BF_COUNT)].map((_, i) => ({
      scale:     parseFloat((0.55 + (i % 3) * 0.30).toFixed(2)),
      opacity:   0.55 + (i % 4) * 0.10,
      flapSpeed: parseFloat((0.34 + (i % 3) * 0.10).toFixed(2)),
    })), []);

  const spData = useMemo(() =>
    [...Array(SP_COUNT)].map((_, i) => ({
      scale:   parseFloat((0.5 + (i % 3) * 0.38).toFixed(2)),
      opacity: 0.40 + (i % 4) * 0.13,
    })), []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const flies = fliesRef.current.filter(Boolean);
    if (!flies.length) return;

    const st = flies.map(() => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      ph: Math.random() * 6.28,
    }));

    let raf;
    const tick = () => {
      st.forEach((s, i) => {
        s.ph += 0.05;
        s.vx += (Math.random() - 0.5) * 0.04;
        s.vy += (Math.random() - 0.5) * 0.04;
        s.vx = Math.max(-0.7, Math.min(0.7, s.vx));
        s.vy = Math.max(-0.7, Math.min(0.7, s.vy));
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -40) s.x = window.innerWidth + 40;
        if (s.x > window.innerWidth + 40) s.x = -40;
        if (s.y < -40) s.y = window.innerHeight + 40;
        if (s.y > window.innerHeight + 40) s.y = -40;
        const sc = flies[i].dataset.sc || 1;
        flies[i].style.transform = `translate(${s.x}px,${s.y}px) rotate(${Math.sin(s.ph) * 12}deg) scale(${sc})`;
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>
      {/* Base gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #2C1F1B 0%, #1a120f 80%)' }} />

      {/* Moon glow — large centered radial */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 28%, rgba(215,152,163,0.28), transparent 40%)' }} />

      {/* Cloud layers (blurred) */}
      <div style={{
        position: 'absolute', inset: 0, filter: 'blur(7px)',
        background: `
          radial-gradient(ellipse 50% 22% at 30% 26%, rgba(155,102,107,0.42), transparent 70%),
          radial-gradient(ellipse 45% 18% at 72% 32%, rgba(112,73,74,0.38), transparent 70%),
          radial-gradient(ellipse 60% 26% at 50% 14%, rgba(215,152,163,0.18), transparent 75%)
        `,
      }} />

      {/* Moon orb — large, centered at top */}
      <motion.div
        animate={{ boxShadow: [
          '0 0 70px 28px rgba(215,152,163,0.32), 0 0 160px 70px rgba(215,152,163,0.16)',
          '0 0 110px 46px rgba(215,152,163,0.50), 0 0 230px 96px rgba(215,152,163,0.25)',
          '0 0 70px 28px rgba(215,152,163,0.32), 0 0 160px 70px rgba(215,152,163,0.16)',
        ]}}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-9%', left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle at 42% 40%, #f6e7e9 0%, #e3c0c7 42%, #c79aa3 70%, #a87a82 100%)',
          opacity: 0.36,
        }}
      />

      {/* Light rays (conic gradient) */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '140%', height: '85%', mixBlendMode: 'screen',
        background: `conic-gradient(from 180deg at 50% 0,
          transparent 0 8deg,   rgba(215,152,163,0.06) 9deg  11deg,  transparent 12deg 20deg,
          rgba(215,152,163,0.05) 21deg 23deg, transparent 24deg 34deg,
          rgba(215,152,163,0.06) 35deg 37deg, transparent 38deg 50deg,
          rgba(215,152,163,0.04) 51deg 53deg, transparent 54deg)`,
      }} />

      {/* Canopy — dark vignette on edges */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 32% 55% at 3%  0%,  rgba(0,0,0,0.58), transparent 62%),
          radial-gradient(ellipse 32% 58% at 97% 0%,  rgba(0,0,0,0.52), transparent 62%),
          radial-gradient(ellipse 55% 42% at 50% 100%, rgba(0,0,0,0.48), transparent 72%)
        `,
      }} />

      {/* Warm mauve corner */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 40% at 88% 96%, rgba(155,102,107,0.24) 0%, transparent 60%)' }} />

      {/* Light-butterflies — position:fixed so rAF translate covers full viewport */}
      {bfData.map((b, i) => (
        <span
          key={`bf-${i}`}
          ref={el => { fliesRef.current[i] = el; }}
          data-sc={b.scale}
          style={{
            position: 'fixed', zIndex: 1, pointerEvents: 'none',
            opacity: b.opacity, willChange: 'transform',
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.95)) drop-shadow(0 0 10px rgba(245,230,235,0.7)) drop-shadow(0 0 20px rgba(215,152,163,0.4))',
          }}
        >
          {/* Wing flap via CSS animation — independent of position transform */}
          <span style={{
            display: 'block', width: 34, height: 30, transformOrigin: 'center',
            animation: `dreamyFlap ${b.flapSpeed}s ease-in-out infinite`,
          }}>
            <svg viewBox="-50 -45 100 90" style={{ width: '100%', height: '100%', display: 'block', fill: 'rgba(255,255,255,0.96)' }}>
              <path d="M2,-3 C8,-42 50,-46 41,-13 C37,3 16,4 2,-3 Z"/>
              <path d="M2,3 C12,33 42,42 31,15 C27,4 13,-1 2,3 Z"/>
              <path d="M-2,-3 C-8,-42 -50,-46 -41,-13 C-37,3 -16,4 -2,-3 Z"/>
              <path d="M-2,3 C-12,33 -42,42 -31,15 C-27,4 -13,-1 -2,3 Z"/>
              <ellipse cx="0" cy="0" rx="2.3" ry="17"/>
            </svg>
          </span>
        </span>
      ))}

      {/* Distant sparkles — same rAF loop */}
      {spData.map((s, i) => (
        <span
          key={`sp-${i}`}
          ref={el => { fliesRef.current[BF_COUNT + i] = el; }}
          data-sc={s.scale}
          style={{
            position: 'fixed', zIndex: 1, pointerEvents: 'none',
            width: 5, height: 5, borderRadius: '50%',
            opacity: s.opacity, willChange: 'transform',
            background: 'radial-gradient(circle, rgba(255,255,255,0.98), rgba(215,152,163,0.4) 70%, transparent)',
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.9))',
          }}
        />
      ))}
    </div>
  );
}

// ─── Background dispatcher ────────────────────────────────────────────────────
function MusicBackground({ color, cluster }) {
  if (cluster === 'vinyl')  return <VinylBackground color={color} />;
  if (cluster === 'neon')   return <NeonBackground color={color} />;
  if (cluster === 'dreamy') return <DreamyBackground color={color} />;
  // Default generic dark
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: musicTheme.bgDark }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 45% at 50% 0%, ${color}09 0%, transparent 60%)` }} />
    </div>
  );
}

// ─── Concert Points progress bar ─────────────────────────────────────────────
function ConcertBar({ pct, color, width }) {
  return (
    <div style={{
      height: 8, borderRadius: 99,
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.12)',
      overflow: 'hidden', width,
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: 99, background: color, boxShadow: `0 0 10px ${color}70` }}
      />
    </div>
  );
}

// ─── Navigation items ─────────────────────────────────────────────────────────
const NAV = [
  { icon: Home,      label: 'The Studio',  path: '/music'         },
  { icon: BookOpen,  label: 'The Setlist', path: '/music/setlist' },
  { icon: BarChart2, label: 'The Charts',  path: '/music/charts'  },
  { icon: Trophy,    label: 'The Vault',   path: '/music/vault'   },
];

const CHAR_ICON = { luna: Music, jay: Zap, cypher: Cpu };

// ─── Level-up banner ──────────────────────────────────────────────────────────
function LevelUpBanner({ color, glow, newTier, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      onClick={onDismiss}
      style={{
        position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, cursor: 'pointer',
        padding: '14px 28px', borderRadius: 8,
        background: color, color: '#000',
        boxShadow: `0 0 40px ${glow}, 0 8px 32px rgba(0,0,0,0.5)`,
        fontFamily: musicTheme.fontHeading,
        fontSize: 20, letterSpacing: '2px', whiteSpace: 'nowrap',
      }}
    >
      LEVEL UP! → {newTier}
    </motion.div>
  );
}

// ─── Simple character info sheet ──────────────────────────────────────────────
function CharSheet({ isOpen, onClose, character, xp, level, streak }) {
  const C        = character?.color || '#D798A3';
  const CharIcon = CHAR_ICON[character?.id] || Music;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 8000 }}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 320,
              background: musicTheme.bgSecondary,
              borderLeft: `1px solid ${C}30`,
              zIndex: 8001, overflowY: 'auto',
              display: 'flex', flexDirection: 'column',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontFamily: musicTheme.fontHeading, fontSize: 22, letterSpacing: 2, color: C }}>
                PLAYER CARD
              </div>
              <button onClick={onClose} style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <X size={14} color={C} />
              </button>
            </div>

            <div style={{
              width: '100%', height: 200, borderRadius: 12,
              background: character?.dim, border: `1px solid ${C}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20, overflow: 'hidden',
            }}>
              {character?.fullImage
                ? <img src={character.fullImage} alt={character.name}
                    style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                    onError={(e) => { e.target.style.display = 'none'; }} />
                : <CharIcon size={64} color={C} strokeWidth={1} />}
            </div>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: musicTheme.fontHeading, fontSize: 36, color: C, letterSpacing: 2, lineHeight: 1 }}>
                {character?.name}
              </div>
              <div style={{ fontFamily: musicTheme.fontSub, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: musicTheme.textMuted, marginTop: 4 }}>
                {character?.title}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[{ label: 'XP', value: xp?.toLocaleString() }, { label: 'Level', value: level }, { label: 'Streak', value: `${streak}d` }].map(({ label, value }) => (
                <div key={label} style={{
                  flex: 1, textAlign: 'center', padding: '10px 8px',
                  borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ fontFamily: musicTheme.fontHeading, fontSize: 20, color: C, letterSpacing: 1 }}>{value}</div>
                  <div style={{ fontFamily: musicTheme.fontSub, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: musicTheme.textMuted }}>{label}</div>
                </div>
              ))}
            </div>

            {character && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Bio',          value: character.bio },
                  { label: 'Specialty',    value: character.specialty },
                  { label: 'Mentor Style', value: character.mentorStyle },
                  { label: 'Personality',  value: character.personality },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontFamily: musicTheme.fontSub, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: musicTheme.textMuted, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontFamily: musicTheme.fontBody, fontSize: 13, color: musicTheme.textSecondary, lineHeight: 1.5 }}>{value}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main layout ──────────────────────────────────────────────────────────────
export default function MusicLayout() {
  useMusicFonts();
  const navigate = useNavigate();
  const location = useLocation();

  const { character, characterLoaded, updateCharacter } = useMusic();
  const { logout } = useAuth();
  const { completedTopics } = useUser();
  const {
    xp, level, streak, badges,
    getLevelProgress, getXPForNextLevel,
    awardXP, dismissLevelUp, levelUpNotification,
  } = useGamification();

  const { isMobile } = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [showSheet,   setShowSheet]   = useState(false);
  const [showLogout,  setShowLogout]  = useState(false);

  const handleReconnect = useCallback(() => {}, []);
  const { isOnline } = useOfflineSync(handleReconnect);

  useEffect(() => { if (isMobile) setSidebarOpen(false); }, [isMobile]);

  const showCharSel   = characterLoaded && !character;
  const C             = character?.color || '#D798A3';
  const cluster       = CLUSTER_MAP[character?.id] || null;
  const levelProgress = getLevelProgress();
  const tier          = getMusicTier(level);
  const tierName      = getMusicTierName(tier);
  const CharIcon      = CHAR_ICON[character?.id] || Music;

  const isActive = (item) =>
    item.path === '/music'
      ? location.pathname === '/music'
      : location.pathname.startsWith(item.path);

  const outletContext = {
    musicCharacter: character,
    musicColor:     C,
    musicCluster:   cluster,
    musicGlow:      character?.glow   || 'rgba(215,152,163,0.5)',
    musicDim:       character?.dim    || 'rgba(215,152,163,0.12)',
    musicBorder:    character?.border || 'rgba(215,152,163,0.3)',
    xp, level, streak, badges, tier, tierName, levelProgress,
    getLevelProgress, getXPForNextLevel, awardXP,
    onOpenSheet: () => setShowSheet(true),
  };

  return (
    <>
      <MusicBackground color={C} cluster={cluster} />

      <MusicDomain isOpen={showCharSel} onSelect={updateCharacter} />

      <LogoutConfirmModal
        open={showLogout}
        domain="music"
        onConfirm={async () => { await logout(); navigate('/login', { replace: true }); }}
        onCancel={() => setShowLogout(false)}
      />

      <div style={{ display: 'flex', height: '100vh', position: 'relative', zIndex: 1 }}>

        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              key="music-bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(3px)', zIndex: 490 }}
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              key="music-sidebar"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              style={{
                width: 240, flexShrink: 0,
                height: isMobile ? '100vh' : '100%',
                background: 'rgba(10,8,10,0.84)',
                backdropFilter: 'blur(20px) saturate(120%)',
                WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', flexDirection: 'column',
                paddingTop: 24,
                overflowY: 'auto', overflowX: 'hidden',
                position: isMobile ? 'fixed' : 'relative',
                top: 0, left: 0,
                zIndex: isMobile ? 500 : 'auto',
              }}
            >
              {isMobile && (
                <button onClick={() => setSidebarOpen(false)} style={{
                  position: 'absolute', top: 12, right: 12,
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                  <X size={13} color={C} />
                </button>
              )}

              <div style={{
                position: 'absolute', top: 0, right: 0, width: 1, height: '100%',
                background: `linear-gradient(180deg, transparent, ${C}55 40%, ${C}30 70%, transparent)`,
                pointerEvents: 'none',
              }} />

              {/* Wordmark */}
              <div style={{ padding: '0 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 8 }}>
                <div style={{ fontFamily: musicTheme.fontHeading, fontSize: 26, letterSpacing: '3px' }}>
                  <span style={{ color: '#fff' }}>FIN</span>
                  <span style={{ color: C, textShadow: `0 0 12px ${character?.glow || 'rgba(215,152,163,0.4)'}` }}>LIT</span>
                </div>
                <div style={{
                  fontFamily: musicTheme.fontSub, fontWeight: 600,
                  fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: musicTheme.textMuted, marginTop: 2,
                }}>
                  {tierName} · Tier {tier}
                </div>
              </div>

              {/* Character mini-card */}
              {character && (
                <motion.div
                  whileHover={{ x: 2 }}
                  onClick={() => setShowSheet(true)}
                  style={{
                    margin: '0 12px 12px', padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    background: character?.dim, border: `1px solid ${character?.border}`,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                    background: character?.dim, border: `1.5px solid ${C}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 10px ${character?.glow}`, overflow: 'hidden',
                  }}>
                    {character?.chibiImage
                      ? <img src={character.chibiImage} alt={character.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                          onError={(e) => { e.target.style.display = 'none'; }} />
                      : <CharIcon size={20} color={C} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <motion.div
                      animate={{ opacity: [0.55, 1, 0.55] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      style={{ fontFamily: musicTheme.fontSub, fontWeight: 600, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: C, marginBottom: 1 }}
                    >
                      Active
                    </motion.div>
                    <div style={{ fontFamily: musicTheme.fontHeading, fontSize: 17, letterSpacing: '1px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {character.name}
                    </div>
                    <div style={{ fontFamily: musicTheme.fontSub, fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: musicTheme.textMuted }}>
                      {character.title}
                    </div>
                  </div>
                </motion.div>
              )}

              <div style={{ padding: '0 20px 6px', fontFamily: musicTheme.fontSub, fontWeight: 600, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: musicTheme.textMuted }}>
                Navigate
              </div>

              <nav style={{ padding: '0 10px' }}>
                {NAV.map((item) => {
                  const { icon: Icon, label, path } = item;
                  const active = isActive(item);
                  return (
                    <motion.button
                      key={label}
                      whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { navigate(path); if (isMobile) setSidebarOpen(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 14px', marginBottom: 3, borderRadius: 8,
                        fontFamily: musicTheme.fontSub, fontSize: 13, fontWeight: active ? 700 : 600,
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                        color: active ? '#fff' : musicTheme.textMuted,
                        background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                        border: 'none', borderLeft: `2.5px solid ${active ? C : 'transparent'}`,
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s ease',
                      }}
                    >
                      <Icon size={15} strokeWidth={2} style={{ color: active ? C : 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
                      {label}
                      {active && (
                        <motion.div
                          layoutId="music-nav-dot"
                          style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: C, boxShadow: `0 0 8px ${C}` }}
                        />
                      )}
                    </motion.button>
                  );
                })}

                {character && (
                  <motion.button
                    whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowSheet(true)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 14px', marginBottom: 3, borderRadius: 8,
                      fontFamily: musicTheme.fontSub, fontSize: 13, fontWeight: 600,
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      color: musicTheme.textMuted, background: 'transparent',
                      border: 'none', borderLeft: '2.5px solid transparent',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s ease',
                    }}
                  >
                    <FileText size={15} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
                    Player Card
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { navigate('/music/mixer'); if (isMobile) setSidebarOpen(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', marginBottom: 3, borderRadius: 8,
                    fontFamily: musicTheme.fontSub, fontSize: 13, fontWeight: 600,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    color: location.pathname === '/music/mixer' ? '#fff' : musicTheme.textMuted,
                    background: location.pathname === '/music/mixer' ? 'rgba(255,255,255,0.05)' : 'transparent',
                    border: 'none', borderLeft: `2.5px solid ${location.pathname === '/music/mixer' ? C : 'transparent'}`,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s ease',
                  }}
                >
                  <Settings size={15} strokeWidth={2} style={{ color: location.pathname === '/music/mixer' ? C : 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
                  The Mixer
                </motion.button>
              </nav>

              <div style={{ flex: 1 }} />

              {/* Concert Points mini bar */}
              <div style={{ margin: '0 14px 12px', padding: '14px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: musicTheme.fontSub, fontWeight: 600, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: musicTheme.textMuted }}>
                    Concert Points
                  </span>
                  <span style={{ fontFamily: musicTheme.fontHeading, fontSize: 14, letterSpacing: '1px', color: C }}>
                    {xp?.toLocaleString()}
                  </span>
                </div>
                <ConcertBar pct={levelProgress} color={C} />
              </div>

              {/* Sign out */}
              <div style={{ padding: '0 10px 20px' }}>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
                <motion.button
                  whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowLogout(true)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 8,
                    fontFamily: musicTheme.fontSub, fontWeight: 600, fontSize: 12,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: musicTheme.textMuted, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <LogOut size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
                  Sign out
                </motion.button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Main column ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Top bar */}
          <div style={{
            height: 56, flexShrink: 0,
            display: 'flex', alignItems: 'center',
            padding: '0 20px', gap: 16,
            background: 'rgba(10,8,10,0.80)',
            backdropFilter: 'blur(20px) saturate(120%)',
            WebkitBackdropFilter: 'blur(20px) saturate(120%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <button
              onClick={() => setSidebarOpen(p => !p)}
              style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <Menu size={16} color={C} />
            </button>

            {(!sidebarOpen || isMobile) ? (
              <span style={{ fontFamily: musicTheme.fontHeading, fontSize: 22, letterSpacing: '3px', flex: 1 }}>
                <span style={{ color: '#fff' }}>FIN</span>
                <span style={{ color: C }}>LIT</span>
              </span>
            ) : (
              <div style={{ flex: 1 }} />
            )}

            {character && (
              <motion.button
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowSheet(true)}
                style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: character?.dim, border: `1.5px solid ${C}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', padding: 0, overflow: 'hidden',
                  boxShadow: `0 0 10px ${character?.glow}`,
                }}
              >
                {character?.chibiImage
                  ? <img src={character.chibiImage} alt={character.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  : <CharIcon size={18} color={C} />}
              </motion.button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: musicTheme.fontHeading, fontSize: 14, letterSpacing: '1px', color: C, whiteSpace: 'nowrap' }}>
                {xp?.toLocaleString()} CP
              </span>
              <ConcertBar pct={levelProgress} color={C} width={80} />
              <span style={{ fontFamily: musicTheme.fontSub, fontWeight: 600, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: musicTheme.textMuted, whiteSpace: 'nowrap' }}>
                T{tier}
              </span>
            </div>
          </div>

          {/* Inject a scoped <style> so the scrollbar thumb tracks the active character color */}
          <style>{`
            .music-scroll-area::-webkit-scrollbar { width: 6px; }
            .music-scroll-area::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); }
            .music-scroll-area::-webkit-scrollbar-thumb {
              background: ${C};
              border-radius: 999px;
              box-shadow: 0 0 8px ${C}88;
            }
            .music-scroll-area::-webkit-scrollbar-thumb:hover { background: ${C}dd; }
            .music-scroll-area { scrollbar-color: ${C} rgba(255,255,255,0.04); scrollbar-width: thin; }
          `}</style>
          <div className="music-scroll-area" style={{ flex: 1, overflowY: 'auto' }}>
            <Outlet context={outletContext} />
          </div>
        </div>
      </div>

      <CharSheet isOpen={showSheet} onClose={() => setShowSheet(false)} character={character} xp={xp} level={level} streak={streak} />

      <AnimatePresence>
        {levelUpNotification && (
          <LevelUpBanner
            color={C} glow={character?.glow || 'rgba(215,152,163,0.5)'}
            newTier={getMusicTierName(getMusicTier(levelUpNotification.newLevel))}
            onDismiss={dismissLevelUp}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            style={{
              position: 'fixed', top: 68, right: 16,
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 99,
              background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.35)',
              fontFamily: musicTheme.fontSub, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#fb923c', zIndex: 9000, backdropFilter: 'blur(8px)',
            }}
          >
            <WifiOff size={12} /> OFFLINE — SAVES LOCALLY
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
