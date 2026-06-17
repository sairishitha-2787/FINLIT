import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb, Target, GraduationCap, TrendingUp, Timer, Send, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import useGamification from '../../hooks/useGamification';
import { sendMentorMessage, loadMentorHistory } from '../../services/mentorService';
import { supabase } from '../../config/supabase';
import { getDomainPersonality, getDomainGreeting, getDomainError, normalizeDomain } from '../../config/domainIcons';
import { gamingTheme } from '../../styles/gamingTheme';

function hexToRgbStr(hex) {
  const h = (hex || '#000000').replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const MAX_CHARS = 500;
const RATE_LIMIT = 10;

// ── Domain style factory ──────────────────────────────────────────────────────
function buildStyles(domain, domainColors) {
  const accent = domainColors?.primary;

  if (domain === 'fashion') {
    return {
      fab: {
        position: 'fixed', bottom: 32, right: 32,
        width: 56, height: 56, borderRadius: '50%',
        background: 'linear-gradient(135deg, #f7a0b8, #c084fc)',
        boxShadow: '0 6px 24px rgba(192,132,252,0.45), 0 2px 8px rgba(247,160,184,0.30)',
        border: '1.5px solid rgba(255,255,255,0.60)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 50,
      },
      fabIconColor: '#fff',
      fabBadge: {
        position: 'absolute', top: -5, right: -5,
        width: 18, height: 18, borderRadius: '50%',
        background: '#d4537e',
        border: '1.5px solid rgba(255,255,255,0.80)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontFamily: "'DM Sans', sans-serif",
        color: '#fff', fontWeight: 700,
      },
      chatWindow: {
        position: 'fixed', bottom: 32, right: 32,
        width: 380, height: 580,
        background: 'rgba(255,255,255,0.30)',
        backdropFilter: 'blur(32px) saturate(220%)',
        WebkitBackdropFilter: 'blur(32px) saturate(220%)',
        borderTop: '1.5px solid rgba(255,255,255,0.75)',
        borderLeft: '1.5px solid rgba(255,255,255,0.75)',
        borderBottom: '1.5px solid rgba(247,160,184,0.40)',
        borderRight: '1.5px solid rgba(247,160,184,0.40)',
        borderRadius: 28,
        boxShadow: '0 24px 64px rgba(247,160,184,0.35), 0 8px 32px rgba(192,132,252,0.20)',
        display: 'flex', flexDirection: 'column', zIndex: 50,
        overflow: 'hidden',
      },
      header: {
        padding: '16px 20px',
        borderBottom: '1px solid rgba(247,160,184,0.25)',
        background: 'linear-gradient(135deg, rgba(247,160,184,0.18) 0%, rgba(192,132,252,0.10) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      },
      headerTitle: {
        fontFamily: "'Playfair Display', serif",
        fontSize: 14, fontWeight: 600,
        color: '#9d1f4a', letterSpacing: '0.2px', margin: 0,
      },
      headerSub: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 9, color: '#d4537e',
        letterSpacing: '0.08em', marginTop: 3,
      },
      headerIconColor: '#d4537e',
      closeBtn: {
        width: 28, height: 28, borderRadius: '50%',
        background: 'rgba(255,255,255,0.40)',
        border: '1px solid rgba(247,160,184,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      },
      closeBtnColor: '#9d1f4a',
      messageArea: {
        flex: 1, overflowY: 'auto', padding: '16px',
        display: 'flex', flexDirection: 'column', gap: 12,
        background: 'rgba(255,255,255,0.08)',
      },
      userBubble: {
        maxWidth: '78%', padding: '10px 14px', borderRadius: 16,
        background: 'rgba(247,160,184,0.22)',
        border: '1px solid rgba(247,160,184,0.50)',
      },
      asstBubble: {
        maxWidth: '78%', padding: '10px 14px', borderRadius: 16,
        background: 'rgba(255,255,255,0.50)',
        border: '1px solid rgba(255,255,255,0.65)',
      },
      msgText: {
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: '#9d1f4a', lineHeight: 1.65, whiteSpace: 'pre-wrap', margin: 0,
      },
      typingBubble: {
        background: 'rgba(255,255,255,0.50)',
        border: '1px solid rgba(255,255,255,0.65)',
        padding: '10px 14px', borderRadius: 16,
      },
      typingDot: { background: '#d4537e' },
      errorBubble: {
        maxWidth: '78%', padding: '10px 14px', borderRadius: 16,
        background: 'rgba(232,112,112,0.15)',
        border: '1px solid rgba(232,112,112,0.45)',
      },
      quickArea: {
        borderTop: '1px solid rgba(247,160,184,0.20)',
        padding: '12px 16px', flexShrink: 0,
        background: 'rgba(255,255,255,0.12)',
      },
      quickLabel: {
        fontFamily: "'DM Sans', sans-serif", fontSize: 9,
        letterSpacing: '0.18em', color: '#c98a9e',
        textTransform: 'uppercase', marginBottom: 8,
      },
      quickBtn: {
        padding: '5px 12px', borderRadius: 99,
        background: 'rgba(255,255,255,0.35)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.62)',
        fontFamily: "'DM Sans', sans-serif", fontSize: 11,
        color: '#9d1f4a', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 5,
      },
      quickBtnIconColor: '#d4537e',
      inputArea: {
        borderTop: '1px solid rgba(247,160,184,0.20)',
        padding: '12px 16px', flexShrink: 0,
        background: 'rgba(255,255,255,0.18)',
      },
      textarea: {
        width: '100%', padding: '10px 12px', borderRadius: 14,
        background: 'rgba(255,255,255,0.45)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(247,160,184,0.45)',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: '#9d1f4a', outline: 'none',
        resize: 'none', lineHeight: 1.5, boxSizing: 'border-box',
      },
      charCount: (over) => ({
        fontFamily: "'DM Sans', sans-serif", fontSize: 9,
        color: over ? '#e87070' : '#c98a9e',
        textAlign: 'right', marginTop: 3,
      }),
      sendBtn: {
        padding: '10px 14px', borderRadius: 14, alignSelf: 'flex-start',
        background: 'linear-gradient(135deg, #f7a0b8, #c084fc)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(192,132,252,0.40)',
      },
      sendBtnIconColor: '#fff',
      rateLimitText: {
        fontFamily: "'DM Sans', sans-serif", fontSize: 11,
        color: '#e87070', marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 4,
      },
    };
  }

  // Sports / Gaming (dark themes)
  const isSports = domain === 'sports';
  const accentHex = accent || (isSports ? '#E8457A' : '#9FE0D3');
  const accentRgb = hexToRgbStr(accentHex);
  const panelBg   = isSports ? 'rgba(15,15,15,0.96)' : gamingTheme.bgMid;
  const msgDarkBg = isSports ? 'rgba(26,26,26,0.90)' : 'rgba(30,42,69,0.7)';
  const fontHeading = isSports ? "'Bebas Neue', cursive" : gamingTheme.fontHeading;
  const fontLabel   = isSports ? "'Barlow Condensed', sans-serif" : gamingTheme.fontLabel;
  const fontBody    = isSports ? "'Inter', sans-serif" : gamingTheme.fontBody;
  const textColor   = isSports ? '#ffffff' : gamingTheme.seafoam;

  return {
    fab: {
      position: 'fixed', bottom: 32, right: 32,
      width: 56, height: 56, borderRadius: '50%',
      background: isSports ? 'rgba(15,15,15,0.90)' : gamingTheme.cardBg,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: `2px solid ${accentHex}`,
      boxShadow: `0 0 20px ${domainColors?.glow || accentHex + '55'}, 0 4px 16px rgba(0,0,0,0.4)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', zIndex: 50,
    },
    fabIconColor: accentHex,
    fabBadge: {
      position: 'absolute', top: -6, right: -6,
      width: 20, height: 20, borderRadius: '50%',
      background: accentHex,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontFamily: fontLabel,
      color: isSports ? '#000' : gamingTheme.bgDark, fontWeight: 700,
    },
    chatWindow: {
      position: 'fixed', bottom: 32, right: 32,
      width: 380, height: 580,
      background: panelBg,
      border: `1.5px solid rgba(${accentRgb},0.40)`,
      borderRadius: isSports ? 16 : 20,
      boxShadow: `0 0 48px rgba(${accentRgb},0.18), 0 16px 48px rgba(0,0,0,0.5)`,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', zIndex: 50,
      overflow: 'hidden',
    },
    header: {
      padding: '16px 20px',
      borderBottom: `1px solid rgba(${accentRgb},0.25)`,
      background: `linear-gradient(135deg, rgba(${accentRgb},0.12) 0%, transparent 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
    },
    headerTitle: {
      fontFamily: fontHeading,
      fontSize: isSports ? 16 : 14,
      fontWeight: isSports ? 400 : 700,
      color: '#ffffff',
      letterSpacing: isSports ? '1.5px' : '1px',
      textTransform: 'uppercase', margin: 0,
    },
    headerSub: {
      fontFamily: fontLabel,
      fontSize: isSports ? 10 : 9,
      color: accentHex,
      letterSpacing: isSports ? '0.10em' : '1px',
      marginTop: 3,
      textTransform: 'uppercase',
    },
    headerIconColor: accentHex,
    closeBtn: {
      width: 30, height: 30, borderRadius: 8,
      background: 'rgba(61,78,122,0.5)',
      border: `1px solid rgba(${accentRgb},0.25)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    },
    closeBtnColor: isSports ? 'rgba(255,255,255,0.70)' : gamingTheme.seafoam,
    messageArea: {
      flex: 1, overflowY: 'auto', padding: 16,
      display: 'flex', flexDirection: 'column', gap: 12,
      background: 'rgba(10,14,30,0.5)',
    },
    userBubble: {
      maxWidth: '78%', padding: '10px 14px',
      borderRadius: isSports ? 10 : 12,
      background: `rgba(${accentRgb},0.15)`,
      border: `1px solid rgba(${accentRgb},0.40)`,
    },
    asstBubble: {
      maxWidth: '78%', padding: '10px 14px',
      borderRadius: isSports ? 10 : 12,
      background: msgDarkBg,
      border: '1px solid rgba(255,255,255,0.08)',
    },
    msgText: {
      fontFamily: fontBody, fontSize: 13,
      color: textColor, lineHeight: 1.6,
      whiteSpace: 'pre-wrap', margin: 0,
    },
    typingBubble: {
      background: msgDarkBg,
      border: '1px solid rgba(255,255,255,0.08)',
      padding: '10px 16px', borderRadius: isSports ? 10 : 12,
    },
    typingDot: { background: accentHex },
    errorBubble: {
      maxWidth: '78%', padding: '10px 14px',
      borderRadius: isSports ? 10 : 12,
      background: 'rgba(248,113,113,0.10)',
      border: '1px solid rgba(248,113,113,0.30)',
    },
    quickArea: {
      borderTop: `1px solid rgba(${accentRgb},0.15)`,
      padding: '12px 16px', flexShrink: 0,
      background: 'rgba(10,14,30,0.4)',
    },
    quickLabel: {
      fontFamily: fontLabel, fontSize: isSports ? 9 : 8,
      letterSpacing: '2px', color: isSports ? 'rgba(255,255,255,0.35)' : gamingTheme.mutedBlue,
      textTransform: 'uppercase', marginBottom: 8,
    },
    quickBtn: {
      padding: '5px 10px', borderRadius: isSports ? 6 : 6,
      background: `rgba(${accentRgb},0.10)`,
      border: `1px solid rgba(${accentRgb},0.30)`,
      fontFamily: fontLabel, fontSize: isSports ? 10 : 9,
      color: accentHex, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 5,
      letterSpacing: '0.5px',
      textTransform: isSports ? 'uppercase' : 'none',
    },
    quickBtnIconColor: accentHex,
    inputArea: {
      borderTop: `1px solid rgba(${accentRgb},0.15)`,
      padding: '12px 16px', flexShrink: 0,
      background: isSports ? 'rgba(15,15,15,0.60)' : gamingTheme.bgMid,
    },
    textarea: {
      width: '100%', padding: '10px 12px', borderRadius: 10,
      background: 'rgba(30,42,69,0.7)',
      border: '1px solid rgba(139,184,233,0.25)',
      fontFamily: fontBody, fontSize: 13,
      color: '#ffffff', outline: 'none',
      resize: 'none', lineHeight: 1.5, boxSizing: 'border-box',
    },
    charCount: (over) => ({
      fontFamily: fontLabel, fontSize: 9,
      color: over ? '#F87171' : (isSports ? 'rgba(255,255,255,0.30)' : gamingTheme.mutedBlue),
      textAlign: 'right', marginTop: 3,
    }),
    sendBtn: {
      padding: '10px 14px', borderRadius: 10, alignSelf: 'flex-start',
      background: `linear-gradient(135deg, ${accentHex}, ${domainColors?.secondary || accentHex})`,
      border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 12px ${domainColors?.glow || accentHex + '55'}`,
    },
    sendBtnIconColor: isSports ? '#000' : gamingTheme.bgDark,
    rateLimitText: {
      fontFamily: fontBody, fontSize: 11,
      color: '#F87171', marginBottom: 8,
      display: 'flex', alignItems: 'center', gap: 4,
    },
  };
}

// ── FloatingMentor ────────────────────────────────────────────────────────────
const FloatingMentor = ({
  currentTopic,
  nextRecommendation,
  userInterest,
  isVisible = true,
  externalOpen = false,
  onExternalClose,
  gamingColors,        // kept for backward compat (gaming/sports pass this)
  domainColors,        // preferred alias
}) => {
  const { user, session } = useAuth();
  const { profile, completedTopics } = useUser();
  const { xp, level, awardXP } = useGamification();

  const effectiveInterest = userInterest || profile?.primaryInterest || 'gaming';
  const domain = normalizeDomain(effectiveInterest);
  const domainPersonality = getDomainPersonality(domain);
  const userName = profile?.name || 'there';
  const completedCount = completedTopics?.length || 0;

  const colors = domainColors || gamingColors || null;
  const S = buildStyles(domain, colors);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (externalOpen) setIsOpen(true);
  }, [externalOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onExternalClose?.();
  };

  const [messages, setMessages] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [msgTimestamps, setMsgTimestamps] = useState([]);
  const [error, setError] = useState(null);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const prevMsgLenRef = useRef(0);
  const historyLoadedRef = useRef(false);

  useEffect(() => {
    if (!user || !session || messages !== null || historyLoadedRef.current) return;
    historyLoadedRef.current = true;
    (async () => {
      try {
        // Pull a fresh (auto-refreshed) token rather than the possibly-stale
        // one held in context — avoids a 401 when the stored token has expired.
        const { data: { session: fresh } } = await supabase.auth.getSession();
        const token = fresh?.access_token || session.access_token;
        const result = await loadMentorHistory(user.id, token);
        if (result.success && result.history.length > 0) {
          setMessages(result.history.map(m => ({
            role: m.role,
            content: m.message,
            timestamp: m.created_at,
          })));
        } else {
          setMessages([{ role: 'assistant', content: getDomainGreeting(domain, userName, completedCount), timestamp: new Date().toISOString() }]);
        }
      } catch {
        setMessages([{ role: 'assistant', content: getDomainGreeting(domain, userName, completedCount), timestamp: new Date().toISOString() }]);
      }
    })();
  }, [user?.id, session]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (!messages) return;
    if (!isOpen && messages.length > prevMsgLenRef.current) {
      setUnreadCount(c => c + (messages.length - prevMsgLenRef.current));
    }
    prevMsgLenRef.current = messages.length;
  }, [messages, isOpen]);

  useEffect(() => { if (isOpen) setUnreadCount(0); }, [isOpen]);

  const isRateLimited = () =>
    msgTimestamps.filter(t => Date.now() - t < 60000).length >= RATE_LIMIT;

  const handleSend = async (customText = null) => {
    const text = (customText ?? input).trim();
    if (!text || text.length < 2 || isLoading || isRateLimited()) return;
    if (!user || !session) return;

    setError(null);
    setInput('');
    setMsgTimestamps(prev => [...prev, Date.now()]);
    setMessages(prev => [...(prev || []), { role: 'user', content: text, timestamp: new Date().toISOString() }]);
    setIsLoading(true);
    awardXP.useChat();

    const msgContext = {
      userName,
      interest: effectiveInterest,
      difficulty: profile?.difficulty || 'beginner',
      userLevel: level,
      totalXP: xp,
      completedCount,
      currentTopic: currentTopic || null,
    };

    const recentHistory = (messages || []).slice(-10).map(m => ({ role: m.role, message: m.content }));

    try {
      const result = await sendMentorMessage(text, msgContext, recentHistory, session.access_token);
      setMessages(prev => [...(prev || []), { role: 'assistant', content: result.response, timestamp: new Date().toISOString() }]);
    } catch {
      setError(getDomainError(domain));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const nextTopicName = typeof nextRecommendation === 'string'
    ? nextRecommendation : nextRecommendation?.name || null;
  const nextTopicReason = nextRecommendation?.reason || null;

  const nextStepPrompt = nextTopicName
    ? `My recommended next topic is "${nextTopicName}"${nextTopicReason ? ` (${nextTopicReason})` : ''}. Can you give me a quick overview of what I'll learn and why it matters for someone into ${effectiveInterest}?`
    : `Based on where I am in my financial learning, what should I focus on next? I'm into ${effectiveInterest}.`;

  const quickActions = [
    { Icon: Lightbulb,     label: 'Simplify',                  prompt: `Explain ${currentTopic || 'this concept'} as simply as possible — plain language, no jargon.` },
    { Icon: Target,        label: `${effectiveInterest} take`, prompt: `Give me a ${effectiveInterest} analogy for ${currentTopic || 'personal finance'}.` },
    { Icon: GraduationCap, label: 'Why care?',                 prompt: `Why should someone who loves ${effectiveInterest} care about ${currentTopic || 'financial literacy'}? Be specific and practical.` },
    { Icon: TrendingUp,    label: "What's next?",              prompt: nextStepPrompt },
  ];

  const DomainIcon = domainPersonality.primaryIconComponent;
  const iconAnimation = domainPersonality.animation;

  if (!isVisible) return null;

  return (
    <>
      {/* ── Floating button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsOpen(true)}
            style={S.fab}
          >
            <DomainIcon size={24} color={S.fabIconColor} />
            {unreadCount > 0 && (
              <span style={S.fabBadge}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            style={S.chatWindow}
          >
            {/* Header */}
            <div style={S.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <DomainIcon size={22} color={S.headerIconColor} />
                <div>
                  <h3 style={S.headerTitle}>FINN — FINLIT MENTOR</h3>
                  <p style={S.headerSub}>
                    {domainPersonality.tagline} · Level {level}
                  </p>
                </div>
              </div>
              <button onClick={handleClose} style={S.closeBtn}>
                <X size={14} color={S.closeBtnColor} strokeWidth={2.5} />
              </button>
            </div>

            {/* Messages */}
            <div style={S.messageArea}>
              {messages === null && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                        style={{ width: 8, height: 8, borderRadius: '50%', ...S.typingDot }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {(messages || []).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}
                >
                  {msg.role === 'assistant' && (
                    <DomainIcon size={16} color={S.headerIconColor} style={{ flexShrink: 0, marginTop: 3 }} />
                  )}
                  <div style={msg.role === 'user' ? S.userBubble : S.asstBubble}>
                    <p style={S.msgText}>{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', justifyContent: 'flex-start', gap: 8 }}
                >
                  <DomainIcon size={16} color={S.headerIconColor} style={{ flexShrink: 0, marginTop: 3 }} />
                  <div style={S.typingBubble}>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [-3, 3, -3] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.18 }}
                          style={{ width: 7, height: 7, borderRadius: '50%', ...S.typingDot }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', justifyContent: 'flex-start', gap: 8 }}
                >
                  <DomainIcon size={16} color={S.headerIconColor} style={{ flexShrink: 0, marginTop: 3 }} />
                  <div style={S.errorBubble}>
                    <p style={{ ...S.msgText, color: domain === 'fashion' ? '#e87070' : '#F87171' }}>{error}</p>
                    <button
                      onClick={() => setError(null)}
                      style={{ marginTop: 4, fontSize: 11, color: S.headerIconColor, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick actions */}
            <div style={S.quickArea}>
              <p style={S.quickLabel}>Quick actions</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {quickActions.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(a.prompt)}
                    disabled={isLoading || isRateLimited()}
                    style={{
                      ...S.quickBtn,
                      opacity: isLoading || isRateLimited() ? 0.4 : 1,
                    }}
                  >
                    <a.Icon size={11} strokeWidth={2.5} color={S.quickBtnIconColor} />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div style={S.inputArea}>
              {isRateLimited() && (
                <p style={S.rateLimitText}>
                  <Timer size={12} strokeWidth={2.5} /> Slow down! Max 10 messages/minute.
                </p>
              )}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value.slice(0, MAX_CHARS))}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask FINN anything… (Shift+Enter for new line)"
                    disabled={isLoading || isRateLimited()}
                    rows={2}
                    style={{
                      ...S.textarea,
                      opacity: isLoading || isRateLimited() ? 0.5 : 1,
                    }}
                  />
                  <p style={S.charCount(input.length > MAX_CHARS * 0.9)}>
                    {input.length}/{MAX_CHARS}
                  </p>
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim() || input.trim().length < 2 || isRateLimited()}
                  style={{
                    ...S.sendBtn,
                    opacity: isLoading || !input.trim() || input.trim().length < 2 || isRateLimited() ? 0.4 : 1,
                  }}
                >
                  <Send size={16} color={S.sendBtnIconColor} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingMentor;
