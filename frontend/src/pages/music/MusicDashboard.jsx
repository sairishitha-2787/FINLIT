// frontend/src/pages/music/MusicDashboard.jsx
// Music domain hub — 3 genre cluster selection cards
// Faithfully implements the index.html design from Claude Design

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// ── Spinning vinyl disc (CSS-drawn) ──────────────────────────────────────────
function VinylDisc({ style = {} }) {
  return (
    <div style={{
      position: 'absolute', borderRadius: '50%',
      background: `
        repeating-radial-gradient(circle at center,
          rgba(0,0,0,0) 0 2px, rgba(85,31,34,.10) 2px 3px, rgba(0,0,0,0) 3px 6px),
        radial-gradient(circle at center, #1c1614 0 28%, #0c0a09 28% 30%, #161210 30% 100%)`,
      ...style,
    }}>
      {/* label */}
      <div style={{
        position: 'absolute', inset: '42%', borderRadius: '50%',
        background: 'radial-gradient(circle at center, #8A2D31 0 60%, #301415 60% 100%)',
        boxShadow: '0 0 0 6px rgba(0,0,0,.4)',
      }} />
      {/* spindle */}
      <div style={{
        position: 'absolute', inset: '48%', borderRadius: '50%',
        background: '#0a0807', zIndex: 2,
      }} />
    </div>
  );
}

// ── Equalizer bars ────────────────────────────────────────────────────────────
const DELAYS = [0, 0.1, 0.2, 0.3, 0.15, 0.25];
function EqBars() {
  return (
    <div style={{
      position: 'absolute', top: 60, right: 28,
      display: 'flex', alignItems: 'flex-end', gap: 4, height: 90, opacity: 0.7,
    }}>
      {DELAYS.map((d, i) => (
        <div key={i} style={{
          width: 7,
          background: 'linear-gradient(180deg,#6BA2EB,#C231C9)',
          borderRadius: '2px 2px 0 0',
          animation: `musicEq 1.1s ease-in-out ${d}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes musicEq {
          0%,100% { height: 14%; }
          50%      { height: 100%; }
        }
        @keyframes musicSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes musicMoonPulse {
          0%,100% { box-shadow: 0 0 60px 20px rgba(215,152,163,.35); }
          50%      { box-shadow: 0 0 90px 36px rgba(215,152,163,.55); }
        }
        @keyframes musicVinylBg {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MusicDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      key: 'vinyl',
      num: '01',
      genre: 'Urban · Hip-Hop · K-Pop',
      title: ['Vinyl', 'Records'],
      desc: 'Warm, vintage, street-style album cards layered over a spinning record.',
      swatches: ['#130F0D', '#C4C1B8', '#551F22', '#635B51'],
      path: '/music/vinyl',
      bg: 'radial-gradient(circle at 80% 10%, #2a1213, #130F0D 60%)',
      textColor: '#C4C1B8',
      titleFont: "'Bebas Neue', sans-serif",
      titleSize: 48,
      btnBg: '#C4C1B8',
      btnColor: '#130F0D',
      hoverShadow: '0 26px 60px rgba(85,31,34,.5)',
      accent: () => (
        <div style={{
          position: 'absolute', top: -50, right: -50,
          width: 200, height: 200, opacity: 0.5,
          animation: 'musicVinylBg 16s linear infinite',
        }}>
          <VinylDisc style={{ width: '100%', height: '100%' }} />
        </div>
      ),
    },
    {
      key: 'neon',
      num: '02',
      genre: 'Electronic · EDM · Techno',
      title: ['Neon', 'Glitch'],
      desc: 'Cyberpunk DJ lab with scan lines, glitch text and glowing neon cards.',
      swatches: ['#1D0225', '#C231C9', '#6BA2EB', '#FFD60A'],
      path: '/music/neon',
      bg: 'linear-gradient(160deg, #1D0225, #260B68 90%)',
      textColor: '#EAD9FF',
      titleFont: "'Orbitron', sans-serif",
      titleSize: 30,
      titleStyle: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, textShadow: '2px 0 #C231C9, -2px 0 #6BA2EB' },
      btnBg: '#C231C9',
      btnColor: '#0a0010',
      btnShadow: '0 0 20px rgba(194,49,201,.6)',
      hoverShadow: '0 26px 60px rgba(194,49,201,.45)',
      accent: () => (
        <>
          {/* scan lines */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.2) 0 1px, transparent 1px 4px)',
          }} />
          <EqBars />
        </>
      ),
    },
    {
      key: 'forest',
      num: '03',
      genre: 'Ballads · Country · Blues',
      title: ['Dreamy', 'Forest'],
      desc: 'Moonlit glassmorphism, floating butterflies and soft, ethereal glow.',
      swatches: ['#2C1F1B', '#D798A3', '#9B666B', '#70494A'],
      path: '/music/forest',
      bg: 'radial-gradient(circle at 50% 8%, rgba(215,152,163,.28), #2C1F1B 55%)',
      textColor: '#F3E6E9',
      titleFont: "'Cormorant Garamond', serif",
      titleSize: 42,
      titleStyle: { fontWeight: 300, fontStyle: 'italic' },
      btnBg: 'rgba(215,152,163,.92)',
      btnColor: '#4D3230',
      hoverShadow: '0 26px 60px rgba(215,152,163,.4)',
      accent: () => (
        <div style={{
          position: 'absolute', top: -40, right: -30,
          width: 150, height: 150, borderRadius: '50%',
          background: 'radial-gradient(circle at 42% 40%, #f6e7e9, #c79aa3 70%, #a87a82)',
          boxShadow: '0 0 60px 20px rgba(215,152,163,.35)',
          animation: 'musicMoonPulse 6s ease-in-out infinite',
        }} />
      ),
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0e0c0b',
      color: '#EDE9E3',
      fontFamily: "'Jost', sans-serif",
      fontWeight: 300,
      WebkitFontSmoothing: 'antialiased',
    }}>
      <div style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: 'clamp(40px,8vh,90px) clamp(20px,5vw,40px) 60px',
      }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{ textAlign: 'center', marginBottom: 54 }}
        >
          <div style={{ fontSize: 12, letterSpacing: 6, textTransform: 'uppercase', color: '#7a736b', marginBottom: 14 }}>
            Music Learning · FINLIT
          </div>
          <h1 style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(34px, 6vw, 60px)',
            lineHeight: 1.05,
            margin: '0 0 12px',
            letterSpacing: '.5px',
          }}>
            Three <span style={{ fontWeight: 500 }}>worlds</span>, three feelings of sound
          </h1>
          <p style={{ fontSize: 15, color: '#9a948c', maxWidth: '54ch', margin: '0 auto', lineHeight: 1.6 }}>
            Each genre family gets its own atmosphere, palette and motion. Pick a world to enter its full interactive dashboard.
          </p>
        </motion.div>

        {/* ── Card grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 22,
        }}
          className="music-cluster-grid"
        >
          {cards.map((c, i) => (
            <ClusterCard key={c.key} card={c} index={i} navigate={navigate} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 54, fontSize: 12, color: '#6f6962', letterSpacing: 1 }}>
          Three standalone, responsive, interactive music worlds
        </div>
      </div>

      {/* responsive override */}
      <style>{`
        @media (max-width: 880px) {
          .music-cluster-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function ClusterCard({ card: c, index, navigate }) {
  const [hovered, setHovered] = React.useState(false);
  const AccentEl = c.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => navigate(c.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 18,
        overflow: 'hidden',
        minHeight: 440,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 30,
        border: '1px solid rgba(255,255,255,.08)',
        background: c.bg,
        color: c.textColor,
        cursor: 'pointer',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? c.hoverShadow : 'none',
        transition: 'transform .35s ease, box-shadow .35s ease',
      }}
    >
      {/* accent visual (vinyl / scan lines / moon) */}
      <AccentEl />

      {/* number + genre label */}
      <div style={{ position: 'absolute', top: 24, left: 28, fontSize: 13, letterSpacing: 2, opacity: 0.7 }}>
        {c.num}
      </div>
      <div style={{ position: 'absolute', top: 24, right: 28, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.8 }}>
        {c.genre}
      </div>

      {/* colour swatches */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {c.swatches.map(col => (
          <div key={col} style={{
            width: 26, height: 26, borderRadius: 6,
            background: col,
            border: '1px solid rgba(255,255,255,.15)',
          }} />
        ))}
      </div>

      {/* title */}
      <h2 style={{
        fontFamily: c.titleFont,
        fontSize: c.titleSize,
        lineHeight: 0.95,
        marginBottom: 10,
        ...(c.titleStyle || {}),
      }}>
        {c.title[0]}<br />{c.title[1]}
      </h2>

      {/* description */}
      <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.82, maxWidth: '34ch', marginBottom: 20 }}>
        {c.desc}
      </p>

      {/* CTA */}
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 500,
        padding: '12px 20px',
        borderRadius: 999,
        background: c.btnBg,
        color: c.btnColor,
        boxShadow: c.btnShadow || 'none',
        alignSelf: 'flex-start',
        transition: '.3s',
        userSelect: 'none',
      }}>
        Open dashboard →
      </span>
    </motion.div>
  );
}
