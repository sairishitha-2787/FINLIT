import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Zap, Gamepad2, Music, Award, Sparkles } from 'lucide-react';
import GridDistortion from '../components/effects/GridDistortion';
import GlassCard from '../components/core/GlassCard';
import { glass } from '../styles/coreTheme';

const features = [
  { Icon: Brain,      title: 'Adaptive Explanations', desc: 'Pick your pace — quick overview or deep dive. Re-explain any concept until it clicks.' },
  { Icon: Sparkles,   title: 'Your Interests, Your Language', desc: 'Finance through gaming, sports, music, or fashion. FINN speaks your dialect.' },
  { Icon: TrendingUp, title: 'Gamified Progress', desc: 'Earn XP, level up, maintain streaks, and unlock badges as you master each concept.' },
];

const domainIcons = [
  { Icon: Gamepad2, label: 'Gaming' },
  { Icon: Sparkles, label: 'Fashion'},
  { Icon: Award,    label: 'Sports' },
  { Icon: Music,    label: 'Music'  },
];

const Welcome = () => (
  <div className={`${glass.page} flex flex-col items-center justify-center p-6`}>
    <GridDistortion grid={15} mouse={0.1} strength={0.15} relaxation={0.9} />

    <div className="relative z-10 max-w-2xl w-full text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="mb-10"
      >
        <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none mb-4" style={{ color: '#1a2e4a' }}>
          FIN<span style={{ color: '#3A8DFF' }}>LIT</span>
        </h1>
        <p className="text-lg font-medium mb-2" style={{ color: '#334155' }}>
          Financial literacy that speaks your language.
        </p>
        <p className="text-sm" style={{ color: '#64748b' }}>
          Learn money fundamentals through what you already love.
        </p>
      </motion.div>

      {/* Domain chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-center justify-center gap-2 flex-wrap mb-10"
      >
        {domainIcons.map(({ Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.07 }}
            className="gl-chip"
          >
            <Icon size={13} style={{ color: '#3A8DFF' }} strokeWidth={2.5} />
            {label}
          </motion.div>
        ))}
      </motion.div>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
      >
        {features.map(({ Icon, title, desc }, i) => (
          <GlassCard key={i} className="p-5 text-left">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(58,141,255,0.10)', border: '1px solid rgba(58,141,255,0.18)' }}>
              <Icon size={18} style={{ color: '#3A8DFF' }} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-sm mb-1.5" style={{ color: '#1e293b' }}>{title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
          </GlassCard>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Link to="/signup" className={`${glass.accentBtn} px-8 py-4 text-sm`}>
          <Zap size={16} strokeWidth={2.5} />
          Get Started — It's Free
        </Link>
        <Link to="/login" className={`${glass.ghostBtn} px-8 py-4 text-sm`}>
          Sign In
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs mt-8"
        style={{ color: '#94a3b8' }}
      >
        No credit card. No jargon. Just learning that actually sticks.
      </motion.p>
    </div>
  </div>
);

export default Welcome;
