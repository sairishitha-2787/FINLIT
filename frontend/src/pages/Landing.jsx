// FINLIT Landing Page - Cosmic Theme
// Futuristic, immersive entry point

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Canvas-based floating particles
const CosmicParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    const particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        color: Math.random() > 0.7
          ? 'rgba(167, 139, 250, '
          : Math.random() > 0.5
            ? 'rgba(236, 72, 153, '
            : 'rgba(59, 130, 246, '
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const o = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + o + ')';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (o * 0.15) + ')';
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.8 }} />;
};

const NebulaOrbs = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div
      className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
      style={{
        background: 'radial-gradient(circle, rgba(108,60,224,0.6) 0%, transparent 70%)',
        animation: 'nebulaDrift 15s ease-in-out infinite',
      }}
    />
    <div
      className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full opacity-15"
      style={{
        background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)',
        animation: 'nebulaDrift 20s ease-in-out infinite reverse',
      }}
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
      style={{
        background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 60%)',
        animation: 'nebulaDrift 25s ease-in-out 2s infinite',
      }}
    />
  </div>
);

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🧠',
      title: 'AI-Powered',
      description: 'Learn finance through your passions',
    },
    {
      icon: '🎮',
      title: 'Gamified',
      description: 'Level up with XP, badges & streaks',
    },
    {
      icon: '🚀',
      title: 'Adaptive',
      description: '3-level quizzes that grow with you',
    },
  ];

  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center p-4 relative">
      <CosmicParticles />
      <NebulaOrbs />

      <div className="max-w-5xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          {/* Floating logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 100 }}
            className="mb-6"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <h1 className="text-7xl md:text-9xl font-black tracking-tight mb-2">
                <span className="bg-gradient-to-r from-cosmic-glow via-cosmic-pink to-cosmic-cyan bg-clip-text text-transparent">
                  FINLIT
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-cosmic-glow/50" />
                <span className="text-cosmic-glow/60 text-sm font-medium tracking-[0.3em] uppercase">
                  Financial Intelligence
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-cosmic-glow/50" />
              </div>
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-2xl md:text-4xl font-semibold text-white mb-4 leading-tight"
          >
            Learn Money Through
            <span className="text-glow bg-gradient-to-r from-cosmic-glow to-cosmic-cyan bg-clip-text text-transparent">
              {' '}What You Love
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Whether it's gaming, coding, music, or sports — we teach finance
            using the language you already speak.
          </motion.p>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14 max-w-3xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.15 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card-hover p-6 text-center"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  className="text-4xl mb-3"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-white/45 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <motion.button
              onClick={() => navigate('/onboarding')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="cosmic-btn text-lg md:text-xl px-12 py-5 font-semibold tracking-wide"
            >
              <span className="relative z-10 flex items-center gap-3">
                Begin Your Journey
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-sm text-white/25 mt-10 tracking-wide"
          >
            2 minutes to personalize your experience
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
