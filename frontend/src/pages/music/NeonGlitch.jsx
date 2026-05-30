// Neon Glitch cluster — Electronic / EDM / Techno

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NeonGlitch() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#1D0225,#260B68 90%)', color: '#EAD9FF', fontFamily: "'Orbitron', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 1px, transparent 1px 3px)' }} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: 3, textShadow: '3px 0 #C231C9, -3px 0 #6BA2EB', marginBottom: 12 }}>NEON GLITCH</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, color: '#6BA2EB', marginBottom: 28 }}>ELECTRONIC · EDM · TECHNO · FULL DASHBOARD COMING SOON</div>
        <button onClick={() => navigate('/music')} style={{ padding: '12px 24px', background: '#C231C9', color: '#0a0010', border: 'none', fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 12, letterSpacing: 2, cursor: 'pointer', boxShadow: '0 0 20px rgba(194,49,201,.6)' }}>← BACK TO HUB</button>
      </motion.div>
    </div>
  );
}
