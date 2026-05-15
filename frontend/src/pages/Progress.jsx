import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BookOpen, Target, Flame, Zap, Trophy, Star,
  Lock, CheckCircle2, TrendingUp, TrendingDown, Minus, Calendar, Award,
  Search, BarChart2, Rocket, Crown, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import useGamification from '../hooks/useGamification';
import AnimatedIcon from '../components/shared/AnimatedIcon';
import LoadingAnimation from '../components/shared/LoadingAnimation';
import { fetchAllProgressData } from '../services/progressService';
import { getSmartRecommendations } from '../services/api';

// ─── Pure helpers ─────────────────────────────────────────────────────────────

const pct = (score, total) => (total ? Math.round((score / total) * 100) : 0);

const relDate = (iso) => {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const groupTimeline = (events) => {
  const ORDER = ['Today', 'Yesterday', 'This Week', 'Earlier'];
  const groups = {};
  events.forEach(e => {
    const diff = Math.floor((Date.now() - new Date(e.date)) / 86400000);
    const g = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : diff < 7 ? 'This Week' : 'Earlier';
    (groups[g] = groups[g] || []).push(e);
  });
  return ORDER.filter(k => groups[k]).map(k => ({ label: k, events: groups[k] }));
};

// ─── Stage config ─────────────────────────────────────────────────────────────

const STAGES = [
  { label: 'BEGINNER',     min: 0,  icon: Rocket,        color: 'bg-brutal-green', desc: 'Building foundations' },
  { label: 'STUDENT',      min: 5,  icon: BookOpen,       color: 'bg-brutal-blue',  desc: 'Growing knowledge'    },
  { label: 'EXPLORER',     min: 10, icon: Target,         color: 'bg-brutal-pink',  desc: 'Expanding horizons'   },
  { label: 'ADVANCED',     min: 20, icon: TrendingUp,     color: 'bg-brutal-pink',  desc: 'Deep expertise'       },
  { label: 'MASTER',       min: 30, icon: Crown,          color: 'bg-brutal-black', desc: 'Finance mastered'     },
];

// ─── Animated counter hook ────────────────────────────────────────────────────

const useCounter = (target, duration = 900) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(cur);
      if (cur >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return val;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ value, label, icon: Icon, anim, bg, suffix = '', delay = 0 }) => {
  const counted = useCounter(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${bg} border-4 border-brutal-black shadow-brutal p-5 rounded-none`}
    >
      <AnimatedIcon icon={Icon} size={26} animation={anim} className="text-brutal-black mb-3" />
      <div className="text-4xl font-black text-brutal-black leading-none mb-1">
        {counted}{suffix}
      </div>
      <div className="text-brutal-black/60 font-bold text-xs uppercase tracking-wider">{label}</div>
    </motion.div>
  );
};

// ─── Roadmap ─────────────────────────────────────────────────────────────────

const LearningRoadmap = ({ topicCount }) => {
  const curIdx = STAGES.reduce((acc, s, i) => topicCount >= s.min ? i : acc, 0);
  const next = STAGES[curIdx + 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="bg-brutal-white border-4 border-brutal-black shadow-brutal p-6 rounded-none"
    >
      <h2 className="text-2xl font-black text-brutal-black mb-6">YOUR LEARNING PATH</h2>

      {/* Nodes */}
      <div className="relative">
        <div className="absolute top-8 left-[8%] right-[8%] h-1.5 bg-brutal-black/15 rounded-none" />
        <div className="flex justify-between relative z-10">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const done = i < curIdx;
            const current = i === curIdx;
            const locked = i > curIdx;
            return (
              <div key={stage.label} className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  animate={current ? { scale: [1, 1.07, 1] } : {}}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className={`
                    relative w-14 h-14 md:w-16 md:h-16 border-4 border-brutal-black rounded-none
                    flex items-center justify-center
                    ${done ? 'bg-brutal-green' : current ? stage.color : 'bg-brutal-bg opacity-40'}
                  `}
                >
                  {done
                    ? <CheckCircle2 size={26} strokeWidth={2.5} className="text-brutal-black" />
                    : locked
                      ? <Lock size={20} strokeWidth={2} className="text-brutal-black/40" />
                      : <Icon size={24} strokeWidth={2} className="text-brutal-black" />
                  }
                  {current && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 border-4 border-brutal-blue rounded-none pointer-events-none"
                    />
                  )}
                </motion.div>
                <div className="text-center">
                  <div className={`text-[10px] md:text-xs font-black ${locked ? 'text-brutal-black/30' : 'text-brutal-black'}`}>
                    {stage.label}
                  </div>
                  <div className="text-[9px] text-brutal-black/35 font-bold hidden md:block">{stage.min}+</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-5 bg-brutal-bg border-2 border-brutal-black p-3 flex flex-wrap items-center justify-between gap-3">
        <span className="font-black text-brutal-black text-sm">
          {STAGES[curIdx].label} <span className="text-brutal-black/50 font-bold">— {STAGES[curIdx].desc}</span>
        </span>
        {next && (
          <div className="bg-brutal-blue border-2 border-brutal-black px-3 py-1 rounded-none">
            <span className="font-black text-brutal-white text-xs">
              <span className="flex items-center gap-1">{next.min - topicCount} topics <ArrowRight size={10} strokeWidth={2.5} /> {next.label}</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Topic card ───────────────────────────────────────────────────────────────

const TopicCard = ({ row, onRestart }) => {
  const score = pct(row.score, row.total_questions || 5);
  const stars = Math.round((score / 100) * 5);
  const scoreColor = score === 100 ? 'bg-brutal-green' : score >= 80 ? 'bg-brutal-blue' : 'bg-brutal-bg';
  const scoreTextColor = score >= 80 ? 'text-brutal-white' : 'text-brutal-black';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ x: 3, y: 3, transition: { duration: 0.1 } }}
      onClick={() => onRestart(row.topic)}
      className="bg-brutal-white border-4 border-brutal-black shadow-brutal p-4 rounded-none cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="bg-brutal-green border-2 border-brutal-black px-2 py-0.5 rounded-none flex items-center gap-1">
          <CheckCircle2 size={10} strokeWidth={3} className="text-brutal-black" />
          <span className="text-[9px] font-black">DONE</span>
        </div>
        <div className={`${scoreColor} border-2 border-brutal-black px-2 py-0.5 rounded-none`}>
          <span className={`text-[10px] font-black ${scoreTextColor}`}>{score}%</span>
        </div>
      </div>

      <h4 className="font-black text-brutal-black text-sm leading-tight mb-2 group-hover:underline">
        {row.topic}
      </h4>

      <div className="flex gap-0.5 mb-2">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} size={12} strokeWidth={2}
            className={s <= stars ? 'text-brutal-black fill-brutal-black' : 'text-brutal-black/20'} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-brutal-black/40 font-bold">{relDate(row.completed_at)}</span>
        <span className="text-[10px] font-black text-brutal-blue opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1">REVIEW <ArrowRight size={10} strokeWidth={2.5} /></span>
        </span>
      </div>
    </motion.div>
  );
};

// ─── Score breakdown bars ─────────────────────────────────────────────────────

const ScoreBreakdown = ({ distribution }) => {
  const total = distribution.reduce((s, d) => s + d.count, 0);
  const COLORS = ['bg-brutal-green', 'bg-brutal-blue', 'bg-brutal-pink', 'bg-brutal-bg'];
  const best = distribution[0];

  return (
    <div className="space-y-3">
      {distribution.map((seg, i) => {
        const p = total > 0 ? Math.round((seg.count / total) * 100) : 0;
        return (
          <div key={i}>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-bold text-brutal-black">{seg.label}</span>
              <span className="text-xs font-black text-brutal-black">{seg.count} <span className="text-brutal-black/40">({p}%)</span></span>
            </div>
            <div className="h-5 bg-brutal-bg border-2 border-brutal-black rounded-none overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p}%` }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: 'easeOut' }}
                className={`h-full ${COLORS[i]} border-r-2 border-brutal-black`}
              />
            </div>
          </div>
        );
      })}
      {total > 0 && best.count > 0 && (
        <p className="text-xs font-bold text-brutal-black/50 pt-1 border-t-2 border-brutal-black/10">
          You ace {Math.round((best.count / total) * 100)}% of topics!
        </p>
      )}
    </div>
  );
};

// ─── Difficulty bars ──────────────────────────────────────────────────────────

const DifficultyBars = ({ data }) => {
  const max = Math.max(...data.map(d => d.count), 1);
  const COLORS = { beginner: 'bg-brutal-green', intermediate: 'bg-brutal-blue', advanced: 'bg-brutal-pink' };

  return (
    <div className="space-y-3">
      {data.map(d => (
        <div key={d.label}>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-black text-brutal-black uppercase">{d.label}</span>
            <span className="text-xs font-black text-brutal-black">{d.count}</span>
          </div>
          <div className="h-7 bg-brutal-bg border-2 border-brutal-black rounded-none overflow-hidden flex items-center">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.count / max) * 100}%` }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className={`h-full ${COLORS[d.label] || 'bg-brutal-blue'} border-r-2 border-brutal-black flex items-center justify-end pr-2`}
            >
              {d.count > 0 && (
                <span className="text-[10px] font-black text-brutal-black">{d.count}</span>
              )}
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Velocity sparkline (SVG) ─────────────────────────────────────────────────

const VelocityChart = ({ data }) => {
  if (!data || data.length < 2) {
    return (
      <div className="text-xs font-bold text-brutal-black/40 text-center py-4">
        Complete more topics to see trends
      </div>
    );
  }

  const W = 280, H = 70;
  const maxVal = Math.max(...data.map(d => d.count), 1);
  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - (d.count / maxVal) * (H - 12) - 6,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="overflow-visible">
        <motion.path
          d={areaPath}
          fill="rgba(0,0,0,0.08)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#000"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill="#fff" stroke="#000" strokeWidth="2.5" />
            <text
              x={p.x}
              y={p.y - 9}
              textAnchor="middle"
              style={{ fontSize: 9, fontWeight: 900, fill: '#000', fontFamily: 'inherit' }}
            >
              {data[i].count}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] font-bold text-brutal-black/40">{data[0]?.week}</span>
        <span className="text-[9px] font-bold text-brutal-black/40">{data[data.length - 1]?.week}</span>
      </div>
    </div>
  );
};

// ─── Timeline event ───────────────────────────────────────────────────────────

const TimelineEvent = ({ event, index }) => {
  const isTopic = event.type === 'topic';
  const score = isTopic && event.totalQ ? pct(event.score, event.totalQ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-3 items-start"
    >
      <div className={`
        w-9 h-9 border-4 border-brutal-black rounded-none flex items-center justify-center shrink-0
        ${isTopic ? 'bg-brutal-green' : 'bg-brutal-pink'}
      `}>
        {isTopic
          ? <CheckCircle2 size={16} strokeWidth={2.5} className="text-brutal-black" />
          : <Award size={16} strokeWidth={2.5} className="text-brutal-black" />
        }
      </div>

      <div className="flex-1 pb-3 border-b-2 border-brutal-black/10">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-black text-brutal-black text-sm leading-tight">{event.title}</p>
            {event.subtitle && (
              <p className="text-[11px] font-bold text-brutal-black/50">{event.subtitle}</p>
            )}
          </div>
          {score !== null && (
            <div className={`
              border-2 border-brutal-black px-2 py-0.5 rounded-none shrink-0
              ${score === 100 ? 'bg-brutal-green' : score >= 80 ? 'bg-brutal-blue' : 'bg-brutal-bg'}
            `}>
              <span className={`text-[10px] font-black ${score >= 80 ? 'text-brutal-white' : 'text-brutal-black'}`}>
                {score}%
              </span>
            </div>
          )}
        </div>
        <p className="text-[10px] text-brutal-black/30 font-bold mt-0.5">{relDate(event.date)}</p>
      </div>
    </motion.div>
  );
};

// ─── Skill badge ──────────────────────────────────────────────────────────────

const SkillBadge = ({ skill, index, onReview }) => {
  const cfg = {
    Mastered:   { bg: 'bg-brutal-green',  label: 'MASTERED',   icon: Trophy },
    Proficient: { bg: 'bg-brutal-blue',   label: 'PROFICIENT', icon: Target },
    Learned:    { bg: 'bg-brutal-white',  label: 'LEARNED',    icon: BookOpen },
  };
  const { bg, label, icon: Icon } = cfg[skill.skillLevel] || cfg.Learned;
  const stars = Math.round(skill.pct * 5);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ x: 2, y: 2 }}
      onClick={() => onReview(skill.topic)}
      className={`${bg} border-4 border-brutal-black shadow-brutal-sm p-4 rounded-none cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-2">
        <Icon size={18} strokeWidth={2} className="text-brutal-black" />
        <div className="bg-brutal-black/10 border border-brutal-black px-1.5 py-0.5 rounded-none">
          <span className="text-[8px] font-black text-brutal-black">{label}</span>
        </div>
      </div>
      <h4 className="font-black text-brutal-black text-xs leading-tight mb-2">{skill.topic}</h4>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} size={9} strokeWidth={2}
            className={s <= stars ? 'text-brutal-black fill-brutal-black' : 'text-brutal-black/20'} />
        ))}
      </div>
    </motion.div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = ({ onStart }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-brutal-white border-4 border-brutal-black shadow-brutal p-12 text-center max-w-lg mx-auto mt-8"
  >
    <div className="mb-6 flex justify-center">
      <AnimatedIcon icon={Rocket} size={80} animation="float" className="text-brutal-black" />
    </div>
    <h3 className="text-4xl font-black text-brutal-black mb-3">START YOUR JOURNEY</h3>
    <p className="text-brutal-black/60 font-bold mb-8 text-base leading-relaxed">
      You haven't completed any topics yet. Finish your first lesson to see your full progress here!
    </p>
    <motion.button
      whileHover={{ x: 4, y: 4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onStart}
      className="bg-brutal-green border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover px-10 py-4 font-black text-xl text-brutal-black"
    >
      <span className="flex items-center gap-2">EXPLORE TOPICS <ArrowRight size={18} strokeWidth={2.5} /></span>
    </motion.button>
  </motion.div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const Progress = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUser();
  const { getLevelProgress, getXPForNextLevel, xp, level, streak } = useGamification();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [nextTopics, setNextTopics] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [search, setSearch] = useState('');
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [recsLoading, setRecsLoading] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchAllProgressData(user.id);
      setData(result);
      await loadRecommendations(result.progressRows, result.stats);
    } catch (err) {
      console.error('Progress load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async (rows, stats, shuffle = false) => {
    setRecsLoading(true);
    const completedNames = (rows || data?.progressRows || []).map(r => r.topic);
    const avgScore = stats?.avgScore || data?.stats?.avgScore || 0;
    try {
      const rec = await getSmartRecommendations({
        completedTopics: completedNames,
        interest: profile?.primaryInterest || 'general',
        difficulty: profile?.difficulty || 'beginner',
        avgScore,
        goals: profile?.goals || [],
        shuffle,
        limit: 3,
      });
      setAllCompleted(rec.allCompleted || false);
      setNextTopics(rec.recommendations || []);
    } catch {
      setNextTopics([]);
    } finally {
      setRecsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brutal-bg flex items-center justify-center">
        <LoadingAnimation message="Loading your learning journey..." />
      </div>
    );
  }

  const {
    progressRows = [],
    stats = {},
    scoreDistribution = [],
    difficultyBreakdown = [],
    velocityData = [],
    skills = [],
    timelineEvents = [],
  } = data || {};

  const isEmpty = progressRows.length === 0;
  const levelProgress = getLevelProgress();
  const xpNeeded = getXPForNextLevel();

  // Filtered + sorted topics
  const filteredTopics = progressRows
    .filter(r => {
      const p = pct(r.score, r.total_questions || 5);
      if (filter === 'perfect') return p === 100;
      if (filter === 'high') return p >= 80;
      return true;
    })
    .filter(r => !search || r.topic.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'score') return pct(b.score, b.total_questions || 5) - pct(a.score, a.total_questions || 5);
      if (sortBy === 'alpha') return a.topic.localeCompare(b.topic);
      return new Date(b.completed_at) - new Date(a.completed_at);
    });

  const groupedTimeline = groupTimeline(timelineEvents);
  const visibleTimeline = timelineExpanded ? groupedTimeline : groupedTimeline.slice(0, 2);

  return (
    <div className="min-h-screen bg-brutal-bg pb-16">

      {/* ── Sticky nav ─────────────────────────────────────────────────── */}
      <div className="bg-brutal-black border-b-4 border-brutal-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="border-2 border-transparent text-brutal-white hover:bg-brutal-white hover:text-brutal-black px-4 py-2 font-black text-sm transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={14} strokeWidth={2.5} /> DASHBOARD
          </button>
          <h1 className="text-xl font-black text-brutal-green">FINLIT</h1>
          <div className="bg-brutal-green border-2 border-brutal-green px-3 py-1 flex items-center gap-1.5">
            <BarChart2 size={13} strokeWidth={2.5} className="text-brutal-black" />
            <span className="font-black text-brutal-black text-xs">PROGRESS</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-8">

        {/* ── Page title ────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-5xl md:text-6xl font-black text-brutal-black leading-none">YOUR JOURNEY</h2>
          <p className="text-brutal-black/50 font-bold mt-1 text-sm">
            {profile?.name && `${profile.name} · `}
            {profile?.primaryInterest && `learning through ${profile.primaryInterest}`}
          </p>
        </motion.div>

        {isEmpty ? (
          <EmptyState onStart={() => navigate('/dashboard')} />
        ) : (
          <>
            {/* ── Stats row ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard value={stats.totalTopics} label="Topics Completed" icon={BookOpen} anim="bounce" bg="bg-brutal-green" delay={0} />
              <StatCard value={stats.avgScore} label="Avg Quiz Score" icon={Target} anim="pulse" bg="bg-brutal-blue" suffix="%" delay={0.06} />
              <StatCard value={streak} label="Day Streak" icon={Flame} anim="flicker" bg="bg-brutal-pink" delay={0.12} />
              <StatCard value={xp} label="Total XP Earned" icon={Zap} anim="flash" bg="bg-brutal-white" delay={0.18} />
            </div>

            {/* ── Level XP bar ──────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-brutal-black border-4 border-brutal-black shadow-brutal p-5 rounded-none"
            >
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-black text-brutal-white text-xl">LEVEL {level}</span>
                  <div className="bg-brutal-green border-2 border-brutal-black px-2 py-0.5">
                    <span className="font-black text-brutal-black text-xs">{xp} XP</span>
                  </div>
                </div>
                <span className="text-brutal-white/50 font-bold text-sm">{xpNeeded} XP to Level {level + 1}</span>
              </div>
              <div className="w-full h-6 bg-brutal-bg border-4 border-brutal-white/20 rounded-none overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1.1, ease: 'easeOut', delay: 0.35 }}
                  className="h-full bg-brutal-green border-r-4 border-brutal-white/20 flex items-center justify-end pr-2"
                >
                  {levelProgress > 12 && (
                    <span className="text-[10px] font-black text-brutal-black">{Math.round(levelProgress)}%</span>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* ── Roadmap ───────────────────────────────────────────────── */}
            <LearningRoadmap topicCount={stats.totalTopics} />

            {/* ── Topics grid + Analytics ───────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Topics grid — 2 cols */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="lg:col-span-2"
              >
                <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal rounded-none">
                  {/* Header */}
                  <div className="bg-brutal-black p-4 border-b-4 border-brutal-black">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <h2 className="text-xl font-black text-brutal-white">
                        COMPLETED <span className="text-brutal-green">({filteredTopics.length})</span>
                      </h2>
                      <div className="flex gap-1.5 flex-wrap">
                        {['all', 'perfect', 'high'].map(f => (
                          <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 border-2 font-black text-xs transition-colors ${
                              filter === f
                                ? 'bg-brutal-green text-brutal-black border-brutal-green'
                                : 'border-brutal-white/40 text-brutal-white hover:border-brutal-white'
                            }`}
                          >
                            {f === 'all' ? 'ALL' : f === 'perfect' ? '100%' : '80%+'}
                          </button>
                        ))}
                        <select
                          value={sortBy}
                          onChange={e => setSortBy(e.target.value)}
                          className="px-2 py-1 border-2 border-brutal-white/40 bg-brutal-black text-brutal-white font-black text-xs focus:outline-none"
                        >
                          <option value="recent">RECENT</option>
                          <option value="score">SCORE ↓</option>
                          <option value="alpha">A→Z</option>
                        </select>
                      </div>
                    </div>
                    <div className="relative">
                      <Search size={14} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-brutal-white/40" />
                      <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search topics..."
                        className="w-full bg-brutal-white/5 border-2 border-brutal-white/20 rounded-none pl-9 pr-4 py-2 text-brutal-white placeholder-brutal-white/30 font-bold text-sm focus:outline-none focus:border-brutal-green transition-colors"
                      />
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                    <AnimatePresence>
                      {filteredTopics.length > 0
                        ? filteredTopics.map((row, i) => (
                            <TopicCard
                              key={`${row.topic}-${i}`}
                              row={row}
                              onRestart={topic => navigate('/learning', { state: { topic } })}
                            />
                          ))
                        : (
                          <div className="col-span-2 text-center py-10">
                            <Search size={40} strokeWidth={1.5} className="mx-auto mb-3 text-brutal-black/20" />
                            <p className="font-black text-brutal-black/40">No topics match</p>
                          </div>
                        )
                      }
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* Analytics panel — 1 col */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
                className="space-y-4"
              >
                {/* Score breakdown */}
                <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal p-5 rounded-none">
                  <h3 className="text-lg font-black text-brutal-black mb-4">SCORE BREAKDOWN</h3>
                  <ScoreBreakdown distribution={scoreDistribution} />
                </div>

                {/* Difficulty chart */}
                <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal p-5 rounded-none">
                  <h3 className="text-lg font-black text-brutal-black mb-4">BY DIFFICULTY</h3>
                  <DifficultyBars data={difficultyBreakdown} />
                </div>

                {/* Velocity sparkline */}
                <div className="bg-brutal-green border-4 border-brutal-black shadow-brutal p-5 rounded-none">
                  <h3 className="text-lg font-black text-brutal-black mb-1">LEARNING PACE</h3>
                  <p className="text-xs font-bold text-brutal-black/60 mb-3">Topics per week</p>
                  <VelocityChart data={velocityData} />
                  {velocityData.length >= 2 && (() => {
                    const last = velocityData[velocityData.length - 1]?.count || 0;
                    const prev = velocityData[velocityData.length - 2]?.count || 0;
                    const trend = last > prev ? 'up' : last < prev ? 'down' : 'same';
                    return (
                      <p className="text-xs font-black text-brutal-black mt-3">
                        {trend === 'up'
                          ? <span className="flex items-center gap-1"><TrendingUp size={12} strokeWidth={2.5} /> Pace is increasing!</span>
                          : trend === 'down'
                          ? <span className="flex items-center gap-1"><TrendingDown size={12} strokeWidth={2.5} /> Slow week — let's pick it up!</span>
                          : <span className="flex items-center gap-1"><Minus size={12} strokeWidth={2.5} /> Steady pace</span>
                        }
                      </p>
                    );
                  })()}
                </div>
              </motion.div>
            </div>

            {/* ── Timeline ──────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-brutal-white border-4 border-brutal-black shadow-brutal rounded-none"
            >
              <div className="bg-brutal-blue border-b-4 border-brutal-black p-5 flex items-center justify-between">
                <h2 className="text-2xl font-black text-brutal-white flex items-center gap-2">
                  <Calendar size={22} strokeWidth={2.5} /> TIMELINE
                </h2>
                <span className="text-brutal-white/60 font-bold text-sm">{timelineEvents.length} events</span>
              </div>

              <div className="p-6 space-y-6">
                {timelineEvents.length === 0 ? (
                  <p className="text-brutal-black/40 font-bold text-center py-8">No events yet</p>
                ) : (
                  <>
                    {visibleTimeline.map(({ label, events }) => (
                      <div key={label}>
                        <div className="bg-brutal-black text-brutal-green font-black text-[10px] px-3 py-1 inline-block mb-4 tracking-widest">
                          {label.toUpperCase()}
                        </div>
                        <div className="space-y-0">
                          {events.map((evt, i) => (
                            <TimelineEvent key={i} event={evt} index={i} />
                          ))}
                        </div>
                      </div>
                    ))}
                    {groupedTimeline.length > 2 && (
                      <button
                        onClick={() => setTimelineExpanded(p => !p)}
                        className="flex items-center gap-2 font-black text-sm text-brutal-blue hover:underline"
                      >
                        <ChevronRight
                          size={16}
                          strokeWidth={2.5}
                          className={`transition-transform ${timelineExpanded ? 'rotate-90' : ''}`}
                        />
                        {timelineExpanded ? 'Show less' : `Show all ${timelineEvents.length} events`}
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* ── Skills grid ───────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-brutal-white border-4 border-brutal-black shadow-brutal rounded-none"
            >
              <div className="bg-brutal-pink border-b-4 border-brutal-black p-5 flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-2xl font-black text-brutal-black flex items-center gap-2">
                  <Trophy size={22} strokeWidth={2.5} /> SKILLS ACQUIRED
                </h2>
                <div className="flex gap-3 text-xs font-bold text-brutal-black/60">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-brutal-green border border-brutal-black inline-block" /> Learned</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-brutal-blue border border-brutal-black inline-block" /> Proficient</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-brutal-green border border-brutal-black inline-block" /> Mastered</span>
                </div>
              </div>

              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {skills.map((skill, i) => (
                  <SkillBadge
                    key={i}
                    skill={skill}
                    index={i}
                    onReview={topic => navigate('/learning', { state: { topic } })}
                  />
                ))}
              </div>
            </motion.div>

            {/* ── Continue learning ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-brutal-black border-4 border-brutal-black shadow-brutal rounded-none p-6"
            >
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-black text-brutal-green flex items-center gap-3">
                    <AnimatedIcon icon={Rocket} size={28} animation="float" className="text-brutal-green" />
                    RECOMMENDED FOR YOU
                  </h2>
                  <p className="text-brutal-white/40 font-bold text-sm mt-1">
                    Personalised based on your progress and interests
                  </p>
                </div>
                <motion.button
                  whileHover={{ x: 2, y: 2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => loadRecommendations(data?.progressRows, data?.stats, true)}
                  disabled={recsLoading}
                  className="border-2 border-brutal-white/30 text-brutal-white/60 hover:text-brutal-white hover:border-brutal-white px-4 py-2 font-black text-xs transition-colors disabled:opacity-40 flex items-center gap-2"
                >
                  {recsLoading
                    ? <><span className="w-3 h-3 border-2 border-brutal-white/30 border-t-brutal-white rounded-full animate-spin" /> LOADING...</>
                    : '↻ SHOW DIFFERENT'
                  }
                </motion.button>
              </div>

              {allCompleted ? (
                <div className="text-center py-8 border-4 border-brutal-white/10 bg-brutal-white/5">
                  <AnimatedIcon icon={Trophy} size={52} animation="bounce" className="text-brutal-green mb-4" />
                  <h3 className="text-2xl font-black text-brutal-white mb-2">ALL TOPICS COMPLETED!</h3>
                  <p className="text-brutal-white/50 font-bold mb-4">
                    Incredible work. Want to retake topics to push your scores higher?
                  </p>
                  <motion.button
                    whileHover={{ x: 3, y: 3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/dashboard')}
                    className="bg-brutal-green border-4 border-brutal-black px-8 py-3 font-black text-brutal-black"
                  >
                    <span className="flex items-center gap-2">VIEW ALL TOPICS <ArrowRight size={16} strokeWidth={2.5} /></span>
                  </motion.button>
                </div>
              ) : recsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="bg-brutal-white/5 border-4 border-brutal-white/10 p-5 animate-pulse h-44" />
                  ))}
                </div>
              ) : nextTopics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {nextTopics.map((rec, i) => {
                    const topicName = typeof rec === 'string' ? rec : rec.name;
                    const reason = typeof rec === 'object' ? rec.reason : null;
                    const mins = typeof rec === 'object' ? rec.estimatedMinutes : null;
                    const diff = typeof rec === 'object' ? rec.difficulty : null;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ x: 4, y: 4 }}
                        className="bg-brutal-white/5 border-4 border-brutal-white/15 p-5 rounded-none hover:border-brutal-green transition-colors flex flex-col"
                      >
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <div className="bg-brutal-green border-2 border-brutal-black px-2 py-0.5">
                            <span className="text-[10px] font-black text-brutal-black">NEXT UP</span>
                          </div>
                          {diff && (
                            <div className="border border-brutal-white/20 px-2 py-0.5">
                              <span className="text-[10px] font-bold text-brutal-white/50 uppercase">{diff}</span>
                            </div>
                          )}
                          {mins && (
                            <span className="text-[10px] font-bold text-brutal-white/30">{mins} min</span>
                          )}
                        </div>

                        <h3 className="font-black text-brutal-white text-lg mb-2 leading-tight flex-1">
                          {topicName}
                        </h3>

                        {reason && (
                          <p className="text-brutal-white/50 text-xs font-bold mb-4 leading-relaxed border-l-2 border-brutal-green/40 pl-2">
                            {reason}
                          </p>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => navigate('/learning', { state: { topic: topicName } })}
                          className="w-full bg-brutal-green border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal py-2.5 font-black text-brutal-black text-sm transition-all mt-auto"
                        >
                          <span className="flex items-center justify-center gap-2">START LEARNING <ArrowRight size={14} strokeWidth={2.5} /></span>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-brutal-white/40 font-bold text-center py-8">
                  No recommendations available right now.
                </p>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;
