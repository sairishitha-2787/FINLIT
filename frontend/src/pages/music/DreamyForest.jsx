// Dreamy Forest cluster — Ballads / Country / Blues

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DreamyForest() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 30%, rgba(215,152,163,.22), transparent 38%), linear-gradient(180deg,#2C1F1B,#1a120f 80%)', color: '#F3E6E9', fontFamily: "'Jost', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      {/* moon */}
      <div style={{ position: 'fixed', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle at 42% 40%, #f6e7e9, #c79aa3 70%, #a87a82)', boxShadow: '0 0 90px 30px rgba(215,152,163,.35)', animation: 'forestMoon 7s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 56, marginBottom: 12, textShadow: '0 0 24px rgba(215,152,163,.4)' }}>Dreamy Forest</div>
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#D798A3', marginBottom: 28, textTransform: 'uppercase' }}>Ballads · Country · Blues · Full Dashboard Coming Soon</div>
        <button onClick={() => navigate('/music')} style={{ padding: '14px 28px', background: 'rgba(215,152,163,.92)', color: '#4D3230', border: 'none', borderRadius: 999, fontFamily: "'Jost'", fontWeight: 500, fontSize: 13, cursor: 'pointer', boxShadow: '0 0 22px rgba(215,152,163,.4)' }}>← Back to Hub</button>
      </motion.div>
      <style>{`@keyframes forestMoon { 0%,100% { box-shadow: 0 0 90px 30px rgba(215,152,163,.35); } 50% { box-shadow: 0 0 110px 44px rgba(215,152,163,.5); } }`}</style>
    </div>
  );
}
