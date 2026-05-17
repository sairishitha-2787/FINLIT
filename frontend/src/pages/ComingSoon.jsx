import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, ChefHat, Music, ArrowLeft, Wrench } from 'lucide-react';

const DOMAIN_CONFIG = {
  movies: { label: 'Movies',  Icon: Film,    color: '#DC2626', bg: '#1a0505' },
  food:   { label: 'Food',    Icon: ChefHat, color: '#FB923C', bg: '#1a0e05' },
  music:  { label: 'Music',   Icon: Music,   color: '#A78BFA', bg: '#0e0519' },
};

export default function ComingSoon({ domain }) {
  const navigate  = useNavigate();
  const config    = DOMAIN_CONFIG[domain] || { label: domain, Icon: Wrench, color: '#6b7280', bg: '#111' };
  const { label, Icon, color, bg } = config;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: bg,
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${color}18 0%, transparent 70%)`,
      }} />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(${color}08 1px, transparent 1px),
          linear-gradient(90deg, ${color}08 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px 24px', maxWidth: 480 }}
      >
        {/* Domain icon */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 96, height: 96, borderRadius: 24,
            background: `${color}18`,
            border: `2px solid ${color}40`,
            boxShadow: `0 0 40px ${color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
          }}
        >
          <Icon size={44} color={color} strokeWidth={1.5} />
        </motion.div>

        {/* FINLIT wordmark */}
        <div style={{
          fontFamily: "'Orbitron', 'Rajdhani', 'Barlow Condensed', sans-serif",
          fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: `${color}90`, marginBottom: 12,
        }}>
          FINLIT · {label.toUpperCase()}
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em',
          color: '#fff', margin: '0 0 14px',
          lineHeight: 1.15,
        }}>
          Coming Soon
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 15, lineHeight: 1.65,
          color: 'rgba(255,255,255,0.48)',
          margin: '0 0 36px',
        }}>
          The <span style={{ color, fontWeight: 600 }}>{label}</span> domain is currently in development.
          <br />Check back soon for a brand-new experience.
        </p>

        {/* Wrench badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 18px', borderRadius: 99,
          background: `${color}14`,
          border: `1px solid ${color}30`,
          marginBottom: 36,
        }}>
          <Wrench size={13} color={color} strokeWidth={2} />
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
            color: color, textTransform: 'uppercase',
          }}>
            In Development
          </span>
        </div>

        {/* Back button */}
        <div>
          <motion.button
            whileHover={{ y: -2, boxShadow: `0 8px 24px ${color}40` }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 12,
              background: color,
              border: 'none', cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
              fontSize: 14, fontWeight: 600,
              color: '#fff',
              boxShadow: `0 4px 16px ${color}50`,
            }}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back to Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
