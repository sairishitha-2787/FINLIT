// FINLIT Animated Feedback Component - Neo-Brutalist Edition
// Shows brutal honest feedback with GIF reactions

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, MessageSquare, Dumbbell, ArrowRight, Sparkles } from 'lucide-react';
import AnimatedIcon from '../shared/AnimatedIcon';
import { getCorrectGif, getWrongGif } from '../../services/api';
import LoadingAnimation from '../shared/LoadingAnimation';
import { gamingTheme } from '../../styles/gamingTheme';

const FALLBACK_GIFS = {
  correct: 'https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy.gif',
  wrong:   'https://media.giphy.com/media/l2SpZtackEqFmMT3G/giphy.gif',
};

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const AFQ = { h: "'Playfair Display',serif", ui: "'DM Sans',sans-serif" };

const AnimatedFeedback = ({
  isCorrect,
  explanation,
  brutalHonestFeedback,
  correctAnswer,
  userAnswer,
  options,
  onNext,
  onRetry,
  isLastQuestion,
  gamingMode,
  gamingColors,
  fashionMode,
}) => {
  const [gif, setGif] = useState(null);
  const [loading, setLoading] = useState(true);

  const gc = gamingColors || {};
  const domain = fashionMode ? 'fashion' : (gamingMode && gc.sports) ? 'sports' : gamingMode ? 'gaming' : '';

  useEffect(() => {
    fetchGif();
  }, [isCorrect]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGif = async () => {
    try {
      setLoading(true);
      const response = isCorrect ? await getCorrectGif(domain) : await getWrongGif(domain);
      if (response?.gif?.url) {
        setGif(response.gif);
      } else {
        setGif({ url: isCorrect ? FALLBACK_GIFS.correct : FALLBACK_GIFS.wrong });
      }
    } catch {
      setGif({ url: isCorrect ? FALLBACK_GIFS.correct : FALLBACK_GIFS.wrong });
    } finally {
      setLoading(false);
    }
  };

  const answerLabels = ['A', 'B', 'C', 'D'];
  const optText = (opt) => (opt && typeof opt === 'object' ? opt.text : opt);
  const correctAnswerText = optText(options[answerLabels.indexOf(correctAnswer)]);
  const userAnswerText = optText(options[answerLabels.indexOf(userAnswer)]);

  const feedbackText = brutalHonestFeedback || explanation || 'Keep pushing forward!';
  const gc = gamingColors || {};

  // ── Sports theme override ────────────────────────────────────────────────────
  const sm = !!(gamingMode && gc.sports);
  const xt = {
    cardBg: sm ? 'rgba(22,22,22,0.95)'            : gamingTheme.cardBg,
    fontH:  sm ? "'Bebas Neue', cursive"           : gamingTheme.fontHeading,
    fontL:  sm ? "'Barlow Condensed', sans-serif"  : gamingTheme.fontLabel,
    fontB:  sm ? "'Inter', sans-serif"             : gamingTheme.fontBody,
    text1:  sm ? '#fff'                            : gamingTheme.stellarWhite,
    text2:  sm ? 'rgba(255,255,255,0.72)'          : gamingTheme.seafoam,
    muted:  sm ? 'rgba(255,255,255,0.4)'           : gamingTheme.mutedBlue,
    border: sm ? '1px solid rgba(255,255,255,0.1)' : gamingTheme.borderThin,
    blur:   sm ? '16px'                            : gamingTheme.glassBlur,
    dark:   sm ? '#000'                            : gamingTheme.bgDark,
  };

  // ── Fashion render ──────────────────────────────────────────────────────────
  if (fashionMode) {
    const rc = isCorrect ? '#7ec9a0' : '#e87070';
    const GRAD = 'linear-gradient(135deg,#f7a0b8,#c084fc,#fbb6c4)';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Result card */}
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ borderRadius: 20, padding: 28, textAlign: 'center', background: isCorrect ? 'rgba(126,201,160,0.10)' : 'rgba(232,112,112,0.08)', backdropFilter: 'blur(16px)', border: `1.5px solid rgba(${isCorrect ? '126,201,160' : '232,112,112'},0.35)`, boxShadow: `0 0 32px rgba(${isCorrect ? '126,201,160' : '232,112,112'},0.12)` }}>
          {isCorrect
            ? <CheckCircle2 size={52} color={rc} style={{ margin: '0 auto 14px' }} />
            : <XCircle     size={52} color={rc} style={{ margin: '0 auto 14px' }} />
          }
          <h2 style={{ fontFamily: AFQ.h, fontSize: 22, fontWeight: 600, color: isCorrect ? '#4a9a6a' : '#b03030', marginBottom: 8, margin: '0 0 8px' }}>
            {isCorrect ? 'Perfectly Styled!' : 'Not Quite, Darling'}
          </h2>
          <p style={{ fontFamily: AFQ.ui, fontSize: 14, color: '#b0627a', margin: 0 }}>
            {isCorrect ? 'You got it right!' : `Correct answer: ${correctAnswer}`}
          </p>
        </motion.div>

        {/* GIF */}
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', fontFamily: AFQ.ui, fontSize: 13, color: '#c98a9e' }}>Loading reaction...</div>
        ) : gif ? (
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(247,160,184,0.30)' }}>
            <img src={gif.url} alt={gif.title || 'Feedback GIF'} style={{ width: '100%', maxHeight: 260, objectFit: 'contain', display: 'block' }} />
          </motion.div>
        ) : null}

        {/* Feedback card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(20px)', borderTop: '1.5px solid rgba(255,255,255,0.65)', borderLeft: '1.5px solid rgba(255,255,255,0.65)', borderBottom: '1.5px solid rgba(247,160,184,0.28)', borderRight: '1.5px solid rgba(247,160,184,0.28)', borderRadius: 20, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: GRAD, flexShrink: 0 }} />
            <h3 style={{ fontFamily: AFQ.ui, fontWeight: 600, fontSize: 10, color: '#9d1f4a', textTransform: 'uppercase', letterSpacing: '0.18em', margin: 0 }}>
              {isCorrect ? 'Style Notes' : 'Fashion Feedback'}
            </h3>
          </div>
          {!isCorrect && (
            <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(247,160,184,0.22)' }}>
              <p style={{ fontFamily: AFQ.ui, fontSize: 13, color: '#e87070', margin: '0 0 6px' }}>Your answer: {userAnswerText}</p>
              <p style={{ fontFamily: AFQ.ui, fontSize: 13, color: '#4a9a6a', margin: 0 }}>Correct answer: {correctAnswerText}</p>
            </div>
          )}
          <div style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(247,160,184,0.18)' }}>
            <p style={{ fontFamily: AFQ.ui, fontSize: 14, color: '#b0627a', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{feedbackText}</p>
          </div>
          {!isCorrect && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(247,160,184,0.08)', border: '1px solid rgba(247,160,184,0.28)', textAlign: 'center' }}>
              <p style={{ fontFamily: AFQ.ui, fontSize: 11, color: '#d4537e', letterSpacing: '0.08em', margin: 0 }}>
                Every icon stumbles before they shine. Keep going!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Next / Retry buttons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {isLastQuestion && onRetry && (
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={onRetry}
              style={{ background: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(247,160,184,0.50)', color: '#9d1f4a', fontFamily: AFQ.ui, fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: 14, cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
              Try Again
            </motion.button>
          )}
          <motion.button whileHover={{ y: -2, boxShadow: '0 10px 28px rgba(192,132,252,0.38)' }} whileTap={{ scale: 0.96 }} onClick={onNext}
            style={{ background: GRAD, border: 'none', color: '#fff', fontFamily: AFQ.ui, fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 40px', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 20px rgba(192,132,252,0.28)' }}>
            {isLastQuestion ? <><Sparkles size={16} /> See Results</> : <>Next Look <ArrowRight size={16} /></>}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (gamingMode && gc.primary) {
    const resultColor = isCorrect ? '#4ECDC4' : '#F87171';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Result card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ borderRadius: '16px', padding: '32px', textAlign: 'center', background: `rgba(${hexToRgbStr(resultColor)},0.1)`, border: `1.5px solid rgba(${hexToRgbStr(resultColor)},0.4)`, boxShadow: `0 0 32px rgba(${hexToRgbStr(resultColor)},0.15)` }}
        >
          {isCorrect
            ? <CheckCircle2 size={60} color={resultColor} style={{ margin: '0 auto 16px' }} />
            : <XCircle     size={60} color={resultColor} style={{ margin: '0 auto 16px' }} />
          }
          <h2 style={{ fontFamily: xt.fontH, fontSize: '24px', fontWeight: 800, color: resultColor, textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 10px' }}>
            {isCorrect ? 'Crushed It!' : 'Not Quite!'}
          </h2>
          <p style={{ fontFamily: xt.fontB, fontSize: '15px', color: xt.text2, margin: 0 }}>
            {isCorrect ? 'You got it right!' : `Correct answer: ${correctAnswer}`}
          </p>
        </motion.div>

        {/* GIF */}
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center' }}><LoadingAnimation message="Loading reaction..." /></div>
        ) : gif ? (
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} style={{ borderRadius: '14px', overflow: 'hidden', border: xt.border }}>
            <img src={gif.url} alt={gif.title || 'Feedback GIF'} style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', display: 'block' }} />
          </motion.div>
        ) : null}

        {/* Feedback card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: xt.cardBg, border: xt.border, borderRadius: '14px', padding: '20px', backdropFilter: `blur(${xt.blur})` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: gc.primary, flexShrink: 0 }} />
            <h3 style={{ fontFamily: xt.fontH, fontSize: '11px', fontWeight: 600, color: xt.text1, textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Feedback</h3>
          </div>

          {!isCorrect && (
            <div style={{ marginBottom: '14px', padding: '12px 14px', borderRadius: '10px', background: xt.cardBg, border: xt.border }}>
              <p style={{ fontFamily: xt.fontB, fontSize: '13px', color: '#F87171', margin: '0 0 6px' }}>Your answer: {userAnswerText}</p>
              <p style={{ fontFamily: xt.fontB, fontSize: '13px', color: '#4ECDC4', margin: 0 }}>Correct answer: {correctAnswerText}</p>
            </div>
          )}

          <div style={{ padding: '14px', borderRadius: '10px', background: xt.cardBg, border: xt.border }}>
            <p style={{ fontFamily: xt.fontB, fontSize: '14px', color: xt.text2, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{feedbackText}</p>
          </div>

          {!isCorrect && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '10px', background: `rgba(${hexToRgbStr(gc.primary)},0.08)`, border: `1px solid rgba(${hexToRgbStr(gc.primary)},0.25)` }}>
              <p style={{ fontFamily: xt.fontL, fontSize: '10px', color: gc.primary, letterSpacing: '1px', textAlign: 'center', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Dumbbell size={13} /> MISTAKES = LEARNING. You're leveling up right now. Keep going!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Next / Retry buttons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {isLastQuestion && onRetry && (
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onRetry}
              style={{ background: xt.cardBg, border: `1px solid rgba(${hexToRgbStr(gc.primary)},0.40)`, color: gc.primary, fontFamily: xt.fontH, fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '14px 32px', borderRadius: '10px', cursor: 'pointer' }}
            >
              Try Again
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNext}
            style={{ background: `linear-gradient(135deg, ${gc.primary}, ${gc.secondary || gc.primary})`, border: 'none', color: xt.dark, fontFamily: xt.fontH, fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '14px 40px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 0 20px ${gc.glow}` }}
          >
            {isLastQuestion ? <><Sparkles size={16} /> See Results</> : <>Next Question <ArrowRight size={16} /></>}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Brutalist render
  return (
    <div className="space-y-6">
      {/* Result Card - Neo-Brutalist */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`
          border-4 border-brutal-black shadow-brutal rounded-none p-8 text-center
          ${isCorrect ? 'bg-brutal-green' : 'bg-brutal-pink'}
        `}
      >
        <AnimatedIcon
          icon={isCorrect ? CheckCircle2 : XCircle}
          size={80}
          animation="pulse"
          className={`mb-4 ${isCorrect ? 'text-brutal-black' : 'text-brutal-black'}`}
        />

        <h2 className="text-4xl font-black text-brutal-black mb-3 flex items-center justify-center gap-2">
          {isCorrect ? <><AnimatedIcon icon={Sparkles} size={28} animation="pulse" /> CRUSHED IT!</> : 'NOT QUITE!'}
        </h2>

        <p className="text-xl font-bold text-brutal-black">
          {isCorrect
            ? 'You got it right!'
            : `Correct answer: ${correctAnswer}`
          }
        </p>
      </motion.div>

      {/* GIF Display */}
      {loading ? (
        <div className="py-8">
          <LoadingAnimation message="Loading reaction..." />
        </div>
      ) : gif ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-4 border-brutal-black shadow-brutal rounded-none overflow-hidden bg-brutal-white"
        >
          <img
            src={gif.url}
            alt={gif.title || 'Feedback GIF'}
            className="w-full max-h-80 object-contain"
          />
        </motion.div>
      ) : null}

      {/* Brutal Honest Feedback Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-brutal-white border-4 border-brutal-black shadow-brutal rounded-none p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <AnimatedIcon icon={MessageSquare} size={36} animation="none" className="text-brutal-black shrink-0" />
          <h3 className="text-2xl font-black text-brutal-black">
            BRUTAL HONEST FEEDBACK
          </h3>
        </div>

        {!isCorrect && (
          <div className="mb-4 p-4 bg-brutal-bg border-2 border-brutal-black rounded-none">
            <p className="text-brutal-black font-bold">
              <span className="font-black text-red-600">Your answer:</span> {userAnswerText}
            </p>
            <p className="text-brutal-black font-bold mt-2">
              <span className="font-black text-brutal-green">Correct answer:</span> {correctAnswerText}
            </p>
          </div>
        )}

        <div className="bg-brutal-black border-2 border-brutal-black rounded-none p-4">
          <p className="text-brutal-white text-lg leading-relaxed font-medium whitespace-pre-wrap">
            {feedbackText}
          </p>
        </div>

        {!isCorrect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-4 bg-brutal-blue border-2 border-brutal-black rounded-none"
          >
            <p className="text-brutal-white font-black text-center flex items-center justify-center gap-2">
              <Dumbbell size={18} strokeWidth={2.5} /> MISTAKES = LEARNING. You're leveling up right now. Keep going!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Next / Retry Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-4 flex-wrap"
      >
        {isLastQuestion && onRetry && (
          <motion.button
            whileHover={{ x: 4, y: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="bg-brutal-white border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover px-8 py-4 rounded-none font-black text-xl text-brutal-black"
          >
            TRY AGAIN
          </motion.button>
        )}
        <motion.button
          whileHover={{ x: 4, y: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="bg-brutal-green border-4 border-brutal-black shadow-brutal hover:shadow-brutal-hover px-12 py-4 rounded-none font-black text-2xl text-brutal-black"
        >
          <span className="flex items-center gap-2">{isLastQuestion ? <><Sparkles size={20} strokeWidth={2.5} /> SEE RESULTS</> : <>NEXT QUESTION <ArrowRight size={20} strokeWidth={2.5} /></>}</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AnimatedFeedback;
