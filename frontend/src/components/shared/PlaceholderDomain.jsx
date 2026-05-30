import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';
import { Music, Activity, Code2, Briefcase, PenLine, Palette, GraduationCap } from 'lucide-react';

const DOMAIN_CONFIG = {
  music: {
    name: 'Music',
    Icon: Music,
    tagline: 'Master money through the rhythm of sound',
    color: '#8B5CF6',
    lightBg: 'from-violet-50 to-purple-50/60',
    accent: '#7C3AED',
    features: [
      'Manage finances like a music artist',
      'Understand royalties and streaming revenue',
      'Plan income like a touring musician',
    ],
  },
  sports: {
    name: 'Sports',
    Icon: Activity,
    tagline: 'Train your financial fitness',
    color: '#3B82F6',
    lightBg: 'from-blue-50 to-indigo-50/60',
    accent: '#2563EB',
    features: [
      'Manage money like an athlete',
      'Understand contracts and endorsements',
      'Plan for peak performance and beyond',
    ],
  },
  coding: {
    name: 'Tech',
    Icon: Code2,
    tagline: 'Ship your financial future',
    color: '#6366F1',
    lightBg: 'from-indigo-50 to-violet-50/60',
    accent: '#4F46E5',
    features: [
      'Finance through a developer lens',
      'Equity, options, and startup economics',
      'Build wealth like a tech founder',
    ],
  },
  business: {
    name: 'Business',
    Icon: Briefcase,
    tagline: 'Run the numbers, own the game',
    color: '#0EA5E9',
    lightBg: 'from-sky-50 to-cyan-50/60',
    accent: '#0284C7',
    features: [
      'Finance through entrepreneurship',
      'Understand P&L and cash flow',
      'Think like a CEO from day one',
    ],
  },
  writing: {
    name: 'Writing',
    Icon: PenLine,
    tagline: 'Write your path to financial freedom',
    color: '#EC4899',
    lightBg: 'from-pink-50 to-rose-50/60',
    accent: '#DB2777',
    features: [
      'Finance for the creative economy',
      'Freelance income and tax basics',
      'Build a writing business that pays',
    ],
  },
  art: {
    name: 'Art',
    Icon: Palette,
    tagline: 'Create and build your financial canvas',
    color: '#F97316',
    lightBg: 'from-orange-50 to-red-50/60',
    accent: '#EA580C',
    features: [
      'Finance for creative professionals',
      'Sell, license, and earn from your work',
      'Sustain a creative career long-term',
    ],
  },
  education: {
    name: 'Education',
    Icon: GraduationCap,
    tagline: 'Invest in the knowledge that pays',
    color: '#14B8A6',
    lightBg: 'from-teal-50 to-cyan-50/60',
    accent: '#0D9488',
    features: [
      'Finance through an education lens',
      'Student loans, ROI of degrees',
      'Budget for lifelong learning',
    ],
  },
};

const DEFAULT_CONFIG = {
  name: 'Your Domain',
  Icon: Sparkles,
  tagline: 'A personalized new way to master finance',
  color: '#6366F1',
  lightBg: 'from-indigo-50 to-purple-50/60',
  accent: '#4F46E5',
  features: [
    'Personalized lessons tied to your interests',
    'Domain-specific scenarios and examples',
    'Unique achievements and collectibles',
  ],
};

const IN_DEV_ITEMS = ['Domain Map', 'Collectibles', 'Achievements', 'Story Mode'];
const IN_DEV_PROGRESS = [65, 40, 30, 20];

const PlaceholderDomain = ({ domain, onStartLearning }) => {
  const cfg = DOMAIN_CONFIG[domain?.toLowerCase()] || DEFAULT_CONFIG;
  const { Icon } = cfg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.45 }}
      className="max-w-7xl mx-auto"
    >
      <div className={`bg-gradient-to-br ${cfg.lightBg} border border-white/70 rounded-2xl overflow-hidden shadow-sm`}>
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* Left: content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/70 border border-white/80 shadow-sm"
                >
                  <Icon size={24} strokeWidth={1.8} style={{ color: cfg.color }} />
                </div>
                <div>
                  <div
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-1"
                    style={{ color: cfg.color, background: `${cfg.color}18` }}
                  >
                    <Lock size={9} strokeWidth={2.5} />
                    Coming Soon
                  </div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {cfg.name} World
                  </h2>
                </div>
              </div>

              <p className="text-slate-500 font-medium mb-5 leading-snug text-sm">
                {cfg.tagline} — we're building something amazing for you.
              </p>

              <ul className="space-y-2 mb-6">
                {cfg.features.map((f, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.08 }}
                    className="flex items-center gap-2.5 text-sm text-slate-600"
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${cfg.color}22` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                    </div>
                    {f}
                  </motion.li>
                ))}
              </ul>

              {onStartLearning && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onStartLearning}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm transition-all"
                  style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.accent})` }}
                >
                  Start Finance Learning
                  <ArrowRight size={14} strokeWidth={2.5} />
                </motion.button>
              )}
            </div>

            {/* Right: in-development card */}
            <div className="shrink-0 w-full md:w-56 bg-white/65 backdrop-blur-sm rounded-xl border border-white/80 p-4 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                In development
              </p>
              <div className="space-y-3">
                {IN_DEV_ITEMS.map((item, i) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />
                    <span className="text-xs text-slate-500 font-medium w-24 truncate">{item}</span>
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${IN_DEV_PROGRESS[i]}%` }}
                        transition={{ delay: 0.55 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: cfg.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-4 font-medium leading-snug">
                You'll be notified when your personalized experience is ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceholderDomain;
