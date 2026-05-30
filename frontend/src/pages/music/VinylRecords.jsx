// Vinyl Records cluster — Urban / Hip-Hop / K-Pop
// Full dashboard coming next iteration

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function VinylRecords() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#130F0D', color: '#C4C1B8', fontFamily: "'Bebas Neue', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 28px', background: 'repeating-radial-gradient(circle at center, #161210 0 3px, #0c0a09 3px 5px)', border: '2px solid #551F22', position: 'relative', animation: 'vinylSpin 8s linear infinite' }}>
          <div style={{ position: 'absolute', inset: '42%', borderRadius: '50%', background: '#8A2D31' }} />
        </div>
        <div style={{ fontSize: 60, letterSpacing: 2, marginBottom: 12 }}>VINYL RECORDS</div>
        <div style={{ fontFamily: 'sans-serif', fontWeight: 400, fontSize: 14, color: '#635B51', letterSpacing: 2, marginBottom: 28 }}>URBAN · HIP-HOP · K-POP · FULL DASHBOARD COMING SOON</div>
        <button onClick={() => navigate('/music')} style={{ padding: '12px 24px', background: '#C4C1B8', color: '#130F0D', border: 'none', borderRadius: 8, fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>← BACK TO HUB</button>
      </motion.div>
      <style>{`@keyframes vinylSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
