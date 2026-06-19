import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Trophy, RotateCcw, ChevronRight, CheckCircle, XCircle,
  CircleX, ArrowLeft, Swords, Star,
} from 'lucide-react';
import { useMusic } from '../../contexts/MusicContext';
import { getClusterTheme, CLUSTER_MAP } from '../../styles/musicTheme';
import { MUSIC_BOSSES } from '../../data/musicBosses';
import { MUSIC_BOSS_QUESTIONS } from '../../data/musicQuestions';

const PASS_THRESHOLD = 0.7;

// ─── Encouragement lines per cluster ─────────────────────────────────────────
const ENCOURAGEMENTS = {
  vinyl: ['Keep it locked.', 'Don\'t slip now.', 'Stay sharp.', 'This is your moment.', 'The booth is watching.'],
  neon:  ['SIGNAL STRONG.', 'MAINTAIN UPLINK.', 'PROCESSING...', 'STAY LOCKED IN.', 'SYSTEM NOMINAL.'],
  dreamy:['You know this.', 'Breathe.', 'Trust the melody.', 'The forest believes in you.', 'Almost there.'],
};

// ─── XP count-up hook ────────────────────────────────────────────────────────
function useCountUp(target, active, duration = 1400) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!active) { setCurrent(0); return; }
    const start = performance.now();
    const step  = (now) => {
      const pct = Math.min((now - start) / duration, 1);
      setCurrent(Math.round(pct * target));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return current;
}

// ─── Cluster-aware button styles ─────────────────────────────────────────────
function clusterBtn(C, theme, cluster, variant = 'primary') {
  const base = {
    width: '100%', padding: '15px',
    border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    fontFamily: theme.fontHeading,
    fontSize: cluster === 'neon' ? 14 : cluster === 'dreamy' ? 18 : 20,
    letterSpacing: cluster === 'neon' ? '1.5px' : '1.5px',
    transition: 'filter 0.2s',
  };
  if (variant === 'primary') return {
    ...base,
    background: C, color: '#000',
    borderRadius: cluster === 'neon' ? 0 : cluster === 'dreamy' ? 999 : 10,
    clipPath: cluster === 'neon'
      ? 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)'
      : 'none',
    boxShadow: `0 4px 24px ${C}60`,
  };
  return {
    ...base,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.14)',
    color: theme.textMuted,
    borderRadius: cluster === 'neon' ? 0 : cluster === 'dreamy' ? 999 : 10,
    fontFamily: theme.fontSub, fontWeight: 700, fontSize: 13,
    letterSpacing: '0.08em', textTransform: 'uppercase',
  };
}

// ─── Panel base style ─────────────────────────────────────────────────────────
function panelStyle(C, theme, cluster) {
  return {
    background: theme.bgCard,
    border: `1px solid ${C}30`,
    borderRadius: cluster === 'neon' ? 0 : cluster === 'dreamy' ? 20 : 14,
    ...(cluster === 'dreamy' ? { backdropFilter: 'blur(16px)' } : {}),
    ...(cluster === 'neon'   ? { clipPath: 'polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)' } : {}),
    boxShadow: `0 4px 30px rgba(0,0,0,0.5)`,
    padding: '24px 26px',
  };
}

// ─── Stat chip ────────────────────────────────────────────────────────────────
function StatChip({ label, value, C, theme, cluster }) {
  return (
    <div style={{
      flex: 1, padding: '12px 8px', textAlign: 'center',
      background: `${C}10`, border: `1px solid ${C}30`,
      borderRadius: cluster === 'neon' ? 0 : cluster === 'dreamy' ? 14 : 10,
    }}>
      <div style={{ fontFamily: theme.fontHeading, fontSize: cluster === 'neon' ? 20 : 24, letterSpacing: '1px', color: C, marginBottom: 4 }}>{value}</div>
      <div style={{ fontFamily: theme.fontSub, fontWeight: 600, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.textMuted }}>{label}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MusicBossBattle() {
  const { bossId } = useParams();
  const navigate   = useNavigate();

  const {
    musicCharacter, musicColor: C, musicCluster,
    awardXP,
  } = useOutletContext();

  const { addDefeatedBoss } = useMusic();

  const cluster = musicCluster || CLUSTER_MAP[musicCharacter?.id] || 'vinyl';
  const theme   = getClusterTheme(musicCharacter?.id);
  const color   = C || '#D798A3';
  const glow    = musicCharacter?.glow || `${color}80`;

  const boss      = MUSIC_BOSSES.find(b => b.id === bossId);
  const questions = MUSIC_BOSS_QUESTIONS[bossId] || [];
  const totalQ    = questions.length;
  const requiredCorrect = Math.ceil(totalQ * PASS_THRESHOLD);

  const [stage,    setStage]    = useState('briefing'); // briefing | match | victory | defeat
  const [idx,      setIdx]      = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results,  setResults]  = useState([]);

  const confettiFired = useRef(false);
  const xpAwarded     = useRef(false);

  const correctCount = results.filter(r => r.correct).length;
  const progress     = totalQ > 0 ? ((idx + (answered ? 1 : 0)) / totalQ) * 100 : 0;
  const q            = questions[idx];

  const encouragement = useMemo(() => {
    const pool = ENCOURAGEMENTS[cluster] || ENCOURAGEMENTS.vinyl;
    return pool[idx % pool.length];
  }, [cluster, idx]);

  const xpDisplay = useCountUp(
    stage === 'victory' ? boss?.xpReward || 150 : boss?.xpAttempt || 100,
    stage === 'victory' || stage === 'defeat',
  );

  // Confetti on victory
  useEffect(() => {
    if (stage !== 'victory' || confettiFired.current) return;
    confettiFired.current = true;
    const colors = boss?.confettiColors || [color, '#fff', '#fbbf24'];
    const opts   = { particleCount: 100, spread: 80, startVelocity: 55, colors };
    confetti({ ...opts, origin: { x: 0.25, y: 0.55 } });
    setTimeout(() => confetti({ ...opts, origin: { x: 0.75, y: 0.55 } }), 300);
    setTimeout(() => confetti({ particleCount: 60, spread: 120, startVelocity: 35, colors, origin: { x: 0.5, y: 0.4 } }), 700);
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Award XP once per attempt
  useEffect(() => {
    if ((stage === 'victory' || stage === 'defeat') && !xpAwarded.current) {
      xpAwarded.current = true;
      if (stage === 'victory') {
        addDefeatedBoss(bossId);
        awardXP?.(boss?.xpReward || 150);
      } else {
        awardXP?.(boss?.xpAttempt || 100);
      }
    }
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnswer(optionIdx) {
    if (answered) return;
    const correct    = optionIdx === q.correctIndex;
    const newResults = [...results, { correct }];
    setSelected(optionIdx);
    setAnswered(true);
    setResults(newResults);

    setTimeout(() => {
      if (idx < totalQ - 1) {
        setIdx(i => i + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        const passed = newResults.filter(r => r.correct).length >= requiredCorrect;
        setStage(passed ? 'victory' : 'defeat');
      }
    }, 1800);
  }

  function handleRetry() {
    setStage('briefing');
    setIdx(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    confettiFired.current = false;
    xpAwarded.current     = false;
  }

  if (!boss) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ fontFamily: theme.fontSub, color: theme.textMuted }}>Boss not found.</p>
        <button onClick={() => navigate('/music/setlist')} style={{ marginTop: 16, color: color }}>← Back to Setlist</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{ padding: '24px 20px 60px', maxWidth: 600, margin: '0 auto' }}
    >

      {/* ── Back button ── */}
      <motion.button
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/music/setlist')}
        style={{
          display: 'flex', alignItems: 'center', gap: 7, marginBottom: 28,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: theme.fontSub, fontWeight: 600, fontSize: 12,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: theme.textMuted,
        }}
      >
        <ArrowLeft size={14} /> Back to Setlist
      </motion.button>

      {/* ════════════════════════════════════════════════════════════════════════
          STAGE: BRIEFING
      ════════════════════════════════════════════════════════════════════════ */}
      {stage === 'briefing' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Boss icon */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <motion.div
              animate={{ scale: [1, 1.06, 1], boxShadow: [`0 0 30px ${glow}40`, `0 0 55px ${glow}70`, `0 0 30px ${glow}40`] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 104, height: 104, borderRadius: cluster === 'neon' ? 0 : '50%',
                margin: '0 auto 20px',
                background: `${color}18`,
                border: `2px solid ${color}`,
                clipPath: cluster === 'neon' ? 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Swords size={52} color={color} strokeWidth={1.4} />
            </motion.div>

            {/* Badge */}
            <div style={{ fontFamily: theme.fontSub, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color, marginBottom: 10 }}>
              {boss.badgeLabel}
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: theme.fontHeading,
              fontSize: cluster === 'neon' ? 20 : cluster === 'dreamy' ? 32 : 28,
              fontStyle: cluster === 'dreamy' ? 'italic' : 'normal',
              letterSpacing: cluster === 'neon' ? '2px' : '1.5px',
              color: theme.textPrimary,
              margin: '0 0 14px',
              textShadow: `0 0 24px ${glow}`,
            }}>
              {boss.name}
            </h1>

            <p style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textSecondary, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
              {boss.description}
            </p>
          </div>

          {/* Scenario panel */}
          <div style={{ ...panelStyle(color, theme, cluster), marginBottom: 18 }}>
            <div style={{ fontFamily: theme.fontSub, fontWeight: 700, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color, marginBottom: 8 }}>
              The Scenario
            </div>
            <p style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textSecondary, lineHeight: 1.7, margin: 0 }}>
              {boss.scenario}
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <StatChip label="Questions"  value={totalQ}                              C={color} theme={theme} cluster={cluster} />
            <StatChip label="To Pass"    value={`${Math.round(PASS_THRESHOLD*100)}%`} C={color} theme={theme} cluster={cluster} />
            <StatChip label="Pass XP"    value={`+${boss.xpReward}`}                 C={color} theme={theme} cluster={cluster} />
            <StatChip label="Try XP"     value={`+${boss.xpAttempt}`}                C={color} theme={theme} cluster={cluster} />
          </div>

          {/* Warning */}
          <div style={{
            padding: '10px 14px', borderRadius: 8, marginBottom: 24,
            background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.26)',
            fontFamily: theme.fontSub, fontWeight: 600, fontSize: 11, letterSpacing: '0.06em',
            color: '#fbbf24',
          }}>
            Get {requiredCorrect}/{totalQ} correct to win · Difficulty: {boss.difficulty}
          </div>

          <motion.button
            whileHover={{ filter: 'brightness(1.12)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStage('match')}
            style={clusterBtn(color, theme, cluster)}
          >
            <Swords size={18} strokeWidth={2} />
            {cluster === 'neon' ? 'INITIALIZE MATCH' : cluster === 'dreamy' ? 'Begin the Challenge' : 'BEGIN MATCH'}
          </motion.button>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          STAGE: MATCH
      ════════════════════════════════════════════════════════════════════════ */}
      {stage === 'match' && q && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${idx}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            {/* Progress header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: theme.fontSub, fontWeight: 600, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.textMuted }}>
                  QUESTION {idx + 1} / {totalQ}
                </span>
                <span style={{ fontFamily: theme.fontHeading, fontSize: 13, letterSpacing: '0.5px', color }}>
                  {correctCount} correct
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                  style={{ height: '100%', borderRadius: 3, background: color, boxShadow: `0 0 8px ${glow}` }}
                />
              </div>
            </div>

            {/* Character encouragement */}
            {musicCharacter && idx > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
                  padding: '8px 12px', borderRadius: 10,
                  background: `${color}0C`, border: `1px solid ${color}25`,
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: musicCharacter.dim, border: `1.5px solid ${color}`,
                  overflow: 'hidden',
                }}>
                  <img src={musicCharacter.chibiImage} alt={musicCharacter.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
                <span style={{ fontFamily: theme.fontBody, fontSize: 12, color: theme.textMuted, fontStyle: cluster === 'dreamy' ? 'italic' : 'normal' }}>
                  {musicCharacter.name}: "{encouragement}"
                </span>
              </motion.div>
            )}

            {/* Question */}
            <div style={{
              ...panelStyle(color, theme, cluster),
              marginBottom: 14,
              borderLeft: `3px solid ${color}`,
            }}>
              <p style={{ fontFamily: theme.fontBody, fontSize: 15, color: theme.textPrimary, lineHeight: 1.65, margin: 0 }}>
                {q.question}
              </p>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {q.options.map((opt, i) => {
                const isSel     = selected === i;
                const isCorrect = answered && i === q.correctIndex;
                const isWrong   = answered && isSel && i !== q.correctIndex;

                return (
                  <motion.button
                    key={i}
                    whileHover={!answered ? { x: 4 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(i)}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '13px 14px',
                      fontFamily: theme.fontBody, fontSize: 13.5,
                      color: isCorrect ? '#000' : isWrong ? '#fff' : theme.textSecondary,
                      background: isCorrect
                        ? '#4ade80'
                        : isWrong
                          ? 'rgba(248,113,113,0.20)'
                          : isSel ? `${color}20` : `${color}08`,
                      border: isCorrect
                        ? '1.5px solid #4ade80'
                        : isWrong
                          ? '1.5px solid rgba(248,113,113,0.7)'
                          : isSel ? `1.5px solid ${color}80` : `1px solid ${color}22`,
                      borderRadius: cluster === 'neon' ? 0 : cluster === 'dreamy' ? 12 : 10,
                      cursor: answered ? 'default' : 'pointer',
                      transition: 'all 0.18s ease',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                  >
                    {answered && isCorrect && <CheckCircle size={15} color="#000" style={{ flexShrink: 0 }} />}
                    {answered && isWrong   && <XCircle     size={15} color="#f87171" style={{ flexShrink: 0 }} />}
                    {!(answered && (isCorrect || isWrong)) && (
                      <span style={{
                        width: 22, height: 22, borderRadius: cluster === 'neon' ? 2 : 6, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isSel ? `${color}30` : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${isSel ? color : 'rgba(255,255,255,0.12)'}`,
                        fontFamily: theme.fontHeading, fontSize: 11,
                        color: isSel ? color : theme.textMuted,
                      }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                    )}
                    <span>{opt}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: 12, padding: '12px 14px',
                    borderRadius: cluster === 'neon' ? 0 : 10,
                    background: selected === q.correctIndex
                      ? 'rgba(74,222,128,0.07)' : 'rgba(248,113,113,0.07)',
                    border: `1px solid ${selected === q.correctIndex
                      ? 'rgba(74,222,128,0.28)' : 'rgba(248,113,113,0.28)'}`,
                  }}
                >
                  <p style={{ fontFamily: theme.fontBody, fontSize: 12, color: theme.textSecondary, margin: 0, lineHeight: 1.65 }}>
                    {q.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          STAGE: VICTORY
      ════════════════════════════════════════════════════════════════════════ */}
      {stage === 'victory' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          style={{ textAlign: 'center' }}
        >
          {/* Trophy */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 110, height: 110,
              borderRadius: cluster === 'neon' ? 0 : '50%',
              margin: '0 auto 22px',
              background: color, border: `2px solid ${color}`,
              boxShadow: `0 0 55px ${glow}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              clipPath: cluster === 'neon' ? 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' : 'none',
            }}
          >
            <Trophy size={56} color="#000" strokeWidth={1.5} />
          </motion.div>

          {/* Stars */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}
          >
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 400 }}
              >
                <Star size={22} color={color} fill={color} />
              </motion.div>
            ))}
          </motion.div>

          <div style={{ fontFamily: theme.fontSub, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color, marginBottom: 8 }}>
            {cluster === 'neon' ? '// CHALLENGE COMPLETE' : cluster === 'dreamy' ? 'Victory' : 'MATCH WON'}
          </div>

          <h2 style={{
            fontFamily: theme.fontHeading,
            fontSize: cluster === 'neon' ? 22 : cluster === 'dreamy' ? 40 : 34,
            fontStyle: cluster === 'dreamy' ? 'italic' : 'normal',
            letterSpacing: cluster === 'neon' ? '2px' : '2px',
            color: theme.textPrimary,
            margin: '0 0 10px',
            textShadow: `0 0 32px ${glow}`,
          }}>
            {cluster === 'neon' ? 'VICTORY!' : cluster === 'dreamy' ? 'Victory!' : 'VICTORY!'}
          </h2>

          <p style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textSecondary, marginBottom: 26, lineHeight: 1.6 }}>
            {boss.victoryMessage}
          </p>

          {/* Score + XP */}
          <div style={{ ...panelStyle(color, theme, cluster), marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div>
                <div style={{ fontFamily: theme.fontHeading, fontSize: 34, letterSpacing: '1.5px', color }}>{correctCount}/{totalQ}</div>
                <div style={{ fontFamily: theme.fontSub, fontWeight: 600, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.textMuted, marginTop: 4 }}>Score</div>
              </div>
              <div style={{ width: 1, background: `${color}25` }} />
              <div>
                <motion.div style={{ fontFamily: theme.fontHeading, fontSize: 34, letterSpacing: '1.5px', color: '#4ade80' }}>
                  +{xpDisplay}
                </motion.div>
                <div style={{ fontFamily: theme.fontSub, fontWeight: 600, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.textMuted, marginTop: 4 }}>
                  Concert Points
                </div>
              </div>
            </div>
          </div>

          {/* Season unlocked message */}
          {boss.season < 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 20,
                background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.28)',
                fontFamily: theme.fontSub, fontWeight: 600, fontSize: 11,
                letterSpacing: '0.06em', color: '#4ade80',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <CheckCircle size={13} /> Season {boss.season + 2} unlocked
            </motion.div>
          )}

          {boss.season === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 20,
                background: `${color}10`, border: `1px solid ${color}40`,
                fontFamily: theme.fontSub, fontWeight: 600, fontSize: 11,
                letterSpacing: '0.06em', color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Star size={13} fill={color} strokeWidth={0} /> Music domain fully mastered
            </motion.div>
          )}

          <motion.button
            whileHover={{ filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/music/setlist')}
            style={clusterBtn(color, theme, cluster)}
          >
            {cluster === 'neon' ? 'RETURN TO SETLIST' : 'Back to Setlist'} <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          STAGE: DEFEAT
      ════════════════════════════════════════════════════════════════════════ */}
      {stage === 'defeat' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ textAlign: 'center' }}
        >
          {/* Defeat icon */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 6, -6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5 }}
            style={{
              width: 90, height: 90, borderRadius: cluster === 'neon' ? 0 : '50%',
              margin: '0 auto 18px',
              background: 'rgba(248,113,113,0.12)',
              border: '2px solid rgba(248,113,113,0.5)',
              clipPath: cluster === 'neon' ? 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <CircleX size={46} color="#f87171" strokeWidth={1.5} />
          </motion.div>

          <div style={{ fontFamily: theme.fontSub, fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#f87171', marginBottom: 8 }}>
            {cluster === 'neon' ? '// SEQUENCE FAILED' : cluster === 'dreamy' ? 'Not this time' : 'MATCH LOST'}
          </div>

          <h2 style={{
            fontFamily: theme.fontHeading,
            fontSize: cluster === 'neon' ? 20 : cluster === 'dreamy' ? 34 : 30,
            fontStyle: cluster === 'dreamy' ? 'italic' : 'normal',
            letterSpacing: '2px', color: theme.textPrimary,
            margin: '0 0 10px',
          }}>
            {cluster === 'neon' ? 'TRY AGAIN' : cluster === 'dreamy' ? 'Almost…' : 'Not This Time'}
          </h2>

          <p style={{ fontFamily: theme.fontBody, fontSize: 13, color: theme.textSecondary, marginBottom: 22, lineHeight: 1.65 }}>
            {boss.defeatMessage}
          </p>

          {/* Score + attempt XP */}
          <div style={{ ...panelStyle(color, theme, cluster), marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div>
                <div style={{ fontFamily: theme.fontHeading, fontSize: 32, letterSpacing: '1.5px', color: '#f87171' }}>{correctCount}/{totalQ}</div>
                <div style={{ fontFamily: theme.fontSub, fontWeight: 600, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.textMuted, marginTop: 4 }}>
                  Needed {requiredCorrect}/{totalQ}
                </div>
              </div>
              <div style={{ width: 1, background: 'rgba(248,113,113,0.2)' }} />
              <div>
                <motion.div style={{ fontFamily: theme.fontHeading, fontSize: 32, letterSpacing: '1.5px', color }}>
                  +{xpDisplay}
                </motion.div>
                <div style={{ fontFamily: theme.fontSub, fontWeight: 600, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.textMuted, marginTop: 4 }}>
                  Attempt Points
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <motion.button
              whileHover={{ filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRetry}
              style={{ ...clusterBtn(color, theme, cluster), flex: 2 }}
            >
              <RotateCcw size={15} strokeWidth={2} />
              {cluster === 'neon' ? 'RETRY MATCH' : cluster === 'dreamy' ? 'Try Again' : 'RETRY MATCH'}
            </motion.button>
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/music/setlist')}
              style={{ ...clusterBtn(color, theme, cluster, 'ghost'), flex: 1 }}
            >
              Setlist
            </motion.button>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}
