// FINLIT Landing Page - Cosmic Theme
// Sectioned, scrollable entry point: hero → value → domains → features → CTA → footer

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gamepad2, Sparkles, Trophy, Music, Users, Lightbulb,
  TrendingUp, ArrowRight, Check,
} from 'lucide-react';

// ── Canvas-based floating particles (fixed background) ─────────────────────────
const CosmicParticles = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    const particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2, pulseSpeed: Math.random() * 0.02 + 0.01,
        color: Math.random() > 0.7 ? 'rgba(167, 139, 250, '
          : Math.random() > 0.5 ? 'rgba(236, 72, 153, ' : 'rgba(59, 130, 246, ',
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY; p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        const o = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + o + ')'; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (o * 0.15) + ')'; ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.8 }} />;
};

const NebulaOrbs = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
      style={{ background: 'radial-gradient(circle, rgba(108,60,224,0.6) 0%, transparent 70%)', animation: 'nebulaDrift 15s ease-in-out infinite' }} />
    <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full opacity-15"
      style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)', animation: 'nebulaDrift 20s ease-in-out infinite reverse' }} />
  </div>
);

// ── Data ───────────────────────────────────────────────────────────────────────
const DOMAINS = [
  {
    key: 'gaming', name: 'Gaming', Icon: Gamepad2, color: '#5B8DEF',
    tagline: 'Master risk and strategy through competitive gameplay.',
    concepts: 'Risk Management · Investing · Portfolio Strategy',
  },
  {
    key: 'fashion', name: 'Fashion', Icon: Sparkles, color: '#EC4899',
    tagline: 'Budget, brand, and build a business with style.',
    concepts: 'Budgeting · Brand Building · Smart Spending',
  },
  {
    key: 'sports', name: 'Sports', Icon: Trophy, color: '#F59E0B',
    tagline: 'Train your money like an athlete trains to win.',
    concepts: 'Contracts · Saving · Long-term Planning',
  },
  {
    key: 'music', name: 'Music', Icon: Music, color: '#C084FC',
    tagline: 'Learn the business behind the beat.',
    concepts: 'Royalties · Revenue Streams · Brand Deals',
  },
];

const FEATURES = [
  { Icon: Trophy,      title: 'Earn While You Learn',       desc: 'Unlock 75 unique badges per domain, build streaks, and track every milestone.' },
  { Icon: Users,       title: 'Learn from Expert Mentors',  desc: 'Three distinct characters guide each domain with personalized encouragement.' },
  { Icon: Lightbulb,   title: 'Master Real Concepts',       desc: 'Every topic teaches practical knowledge you can apply to actual money decisions.' },
  { Icon: TrendingUp,  title: 'See Your Growth',            desc: 'Watch your XP, streaks, and financial literacy level up session after session.' },
];

const STATS = [
  { v: '4', l: 'Complete Domains' },
  { v: '300+', l: 'Badges' },
  { v: '12', l: 'Topics Each' },
  { v: '100%', l: 'Free' },
];

// ── Section reveal wrapper ─────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const Landing = () => {
  const navigate = useNavigate();
  const domainsRef = useRef(null);

  const goStart = () => navigate('/onboarding');
  const scrollToDomains = () =>
    domainsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen cosmic-bg relative overflow-x-hidden">
      <CosmicParticles />
      <NebulaOrbs />

      <div className="relative z-10">

        {/* ════════ HERO ════════ */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
          <motion.div initial={{ scale: 0.6, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, type: 'spring', stiffness: 100 }} className="mb-5">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-2">
                <span className="bg-gradient-to-r from-cosmic-glow via-cosmic-pink to-cosmic-cyan bg-clip-text text-transparent">
                  FINLIT
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-cosmic-glow/50" />
                <span className="text-cosmic-glow/60 text-xs font-medium tracking-[0.3em] uppercase">Financial Intelligence</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-cosmic-glow/50" />
              </div>
            </motion.div>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight max-w-4xl">
            Master Financial Literacy Through{' '}
            <span className="bg-gradient-to-r from-cosmic-glow to-cosmic-cyan bg-clip-text text-transparent">Gamified Learning</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }}
            className="text-lg md:text-xl text-white/55 mb-9 max-w-2xl leading-relaxed">
            Four interactive domains. 300+ badges to earn. Real financial knowledge,
            taught in the language you already speak.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <motion.button onClick={goStart} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="cosmic-btn text-lg px-10 py-4 font-semibold tracking-wide">
              <span className="relative z-10 flex items-center gap-2.5">Start Learning Free <ArrowRight size={20} /></span>
            </motion.button>
            <motion.button onClick={scrollToDomains} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-full font-semibold text-white/80 border border-white/20 hover:border-white/40 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              Explore Domains
            </motion.button>
          </motion.div>

          {/* Quick stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-2xl w-full">
            {STATS.map(s => (
              <div key={s.l} className="glass-card-hover px-3 py-4 text-center rounded-2xl">
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cosmic-glow to-cosmic-cyan bg-clip-text text-transparent">{s.v}</div>
                <div className="text-white/45 text-[11px] md:text-xs tracking-wider uppercase mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ════════ VALUE PROP ════════ */}
        <section className="px-4 py-16 md:py-20">
          <Reveal className="max-w-3xl mx-auto text-center">
            <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light">
              FINLIT teaches you how money actually works through immersive gameplay. Master
              <span className="text-cosmic-glow font-medium"> stocks</span>,
              <span className="text-cosmic-pink font-medium"> budgets</span>,
              <span className="text-amber-300 font-medium"> contracts</span>, and
              <span className="text-purple-300 font-medium"> industry finances</span> — earning
              badges and climbing the ranks while building skills you'll use for life.
            </p>
          </Reveal>
        </section>

        {/* ════════ DOMAIN SHOWCASE ════════ */}
        <section ref={domainsRef} className="px-4 py-16 md:py-20 scroll-mt-8">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Four Worlds, One Goal</h2>
            <p className="text-white/50 max-w-xl mx-auto">Pick a passion. Each domain turns real finance into a game you'll want to keep playing.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {DOMAINS.map((d, i) => (
              <Reveal key={d.key} delay={i * 0.08}>
                <motion.button
                  onClick={goStart}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left rounded-3xl p-6 md:p-7 relative overflow-hidden group"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderTop: `3px solid ${d.color}`,
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {/* color glow */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ background: `radial-gradient(circle, ${d.color} 0%, transparent 70%)` }} />

                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${d.color}22`, border: `1px solid ${d.color}55` }}>
                      <d.Icon size={24} style={{ color: d.color }} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-wide uppercase">{d.name}</h3>
                  </div>

                  <p className="text-white/65 text-sm mb-3 relative z-10">{d.tagline}</p>

                  <div className="text-[11px] font-mono tracking-wider mb-4 relative z-10" style={{ color: d.color }}>
                    12 Topics • 3 Bosses • 75 Badges
                  </div>

                  <div className="text-white/40 text-xs mb-5 relative z-10">
                    <span className="text-white/30 uppercase tracking-wider">Concepts: </span>{d.concepts}
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold relative z-10 group-hover:gap-3 transition-all"
                    style={{ color: d.color }}>
                    Start Learning <ArrowRight size={16} />
                  </span>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════════ FEATURES ════════ */}
        <section className="px-4 py-16 md:py-20">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Why FINLIT Works</h2>
            <p className="text-white/50 max-w-xl mx-auto">Built to keep you coming back — and actually learning.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="glass-card-hover p-6 rounded-3xl h-full text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)' }}>
                    <f.Icon size={26} className="text-cosmic-glow" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════════ FINAL CTA ════════ */}
        <section className="px-4 py-20 md:py-28">
          <Reveal className="max-w-3xl mx-auto text-center glass-card-hover rounded-[2rem] px-6 py-14 md:px-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to Level Up Your{' '}
              <span className="bg-gradient-to-r from-cosmic-glow to-cosmic-cyan bg-clip-text text-transparent">Financial Knowledge?</span>
            </h2>
            <p className="text-white/55 mb-8 text-lg">Join thousands building real money skills the fun way.</p>
            <motion.button onClick={goStart} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="cosmic-btn text-lg px-12 py-5 font-semibold tracking-wide">
              <span className="relative z-10 flex items-center gap-3">Get Started Free <ArrowRight size={20} /></span>
            </motion.button>
            <div className="flex items-center justify-center gap-5 mt-6 text-white/35 text-xs flex-wrap">
              <span className="flex items-center gap-1.5"><Check size={13} className="text-cosmic-glow" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check size={13} className="text-cosmic-glow" /> Takes 2 minutes</span>
              <span className="flex items-center gap-1.5"><Check size={13} className="text-cosmic-glow" /> 100% free</span>
            </div>
          </Reveal>
        </section>

        {/* ════════ FOOTER ════════ */}
        <footer className="px-4 py-10 border-t border-white/10">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-2xl font-black">
              <span className="bg-gradient-to-r from-cosmic-glow via-cosmic-pink to-cosmic-cyan bg-clip-text text-transparent">FINLIT</span>
            </div>
            <div className="flex items-center gap-6 text-white/45 text-sm">
              <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Log In</button>
              <button onClick={scrollToDomains} className="hover:text-white transition-colors">Domains</button>
              <button onClick={goStart} className="hover:text-white transition-colors">Get Started</button>
            </div>
            <div className="text-white/30 text-xs">© 2026 FINLIT</div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Landing;
