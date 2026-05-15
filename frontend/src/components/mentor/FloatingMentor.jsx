import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Lightbulb, Target, GraduationCap, TrendingUp, Timer, Send, X,
  Gamepad2, Sparkles, Award, Film, ChefHat, Music,
} from 'lucide-react';
import AnimatedIcon from '../shared/AnimatedIcon';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import useGamification from '../../hooks/useGamification';
import { sendMentorMessage, loadMentorHistory } from '../../services/mentorService';
import { getDomainPersonality, getDomainGreeting, getDomainError, normalizeDomain } from '../../config/domainIcons';
import { gamingTheme } from '../../styles/gamingTheme';

function hexToRgbStr(hex) {
  const h = (hex || '#000000').replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const MAX_CHARS = 500;
const RATE_LIMIT = 10;

const FloatingMentor = ({ currentTopic, nextRecommendation, userInterest, isVisible = true, externalOpen = false, onExternalClose, gamingMode, gamingColors }) => {
  const { user, session } = useAuth();
  const { profile, completedTopics } = useUser();
  const { xp, level, awardXP } = useGamification();

  const effectiveInterest = userInterest || profile?.primaryInterest || 'gaming';
  const domain = normalizeDomain(effectiveInterest);
  const domainPersonality = getDomainPersonality(domain);
  const userName = profile?.name || 'there';
  const completedCount = completedTopics?.length || 0;

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

  // ── Load history once when user is available ──────────────────────────────
  useEffect(() => {
    if (!user || !session || messages !== null) return;
    (async () => {
      try {
        const result = await loadMentorHistory(user.id, session.access_token);
        if (result.success && result.history.length > 0) {
          setMessages(
            result.history.map(m => ({
              role: m.role,
              content: m.message,
              timestamp: m.created_at,
            }))
          );
        } else {
          setMessages([{
            role: 'assistant',
            content: getDomainGreeting(domain, userName, completedCount),
            timestamp: new Date().toISOString(),
          }]);
        }
      } catch {
        setMessages([{
          role: 'assistant',
          content: getDomainGreeting(domain, userName, completedCount),
          timestamp: new Date().toISOString(),
        }]);
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

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  const isRateLimited = () => {
    const now = Date.now();
    return msgTimestamps.filter(t => now - t < 60000).length >= RATE_LIMIT;
  };

  const handleSend = async (customText = null) => {
    const text = (customText ?? input).trim();
    if (!text || text.length < 2 || isLoading || isRateLimited()) return;
    if (!user || !session) return;

    setError(null);
    setInput('');
    setMsgTimestamps(prev => [...prev, Date.now()]);

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...(prev || []), userMsg]);
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

    const recentHistory = (messages || []).slice(-10).map(m => ({
      role: m.role,
      message: m.content,
    }));

    try {
      const result = await sendMentorMessage(text, msgContext, recentHistory, session.access_token);
      setMessages(prev => [...(prev || []), {
        role: 'assistant',
        content: result.response,
        timestamp: new Date().toISOString(),
      }]);
    } catch {
      setError(getDomainError(domain));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const nextTopicName = typeof nextRecommendation === 'string'
    ? nextRecommendation
    : nextRecommendation?.name || null;
  const nextTopicReason = nextRecommendation?.reason || null;

  const nextStepPrompt = nextTopicName
    ? `My recommended next topic is "${nextTopicName}"${nextTopicReason ? ` (${nextTopicReason})` : ''}. Can you give me a quick overview of what I'll learn and why it matters for someone into ${effectiveInterest}?`
    : `Based on where I am in my financial learning, what should I focus on next? I'm into ${effectiveInterest}.`;

  // Domain-aware quick actions
  const quickActions = [
    { Icon: Lightbulb,     label: 'Simplify',                   prompt: `Explain ${currentTopic || 'this concept'} as simply as possible — plain language, no jargon.` },
    { Icon: Target,        label: `${effectiveInterest} take`,  prompt: `Give me a ${effectiveInterest} analogy for ${currentTopic || 'personal finance'}.` },
    { Icon: GraduationCap, label: 'Why care?',                  prompt: `Why should someone who loves ${effectiveInterest} care about ${currentTopic || 'financial literacy'}? Be specific and practical.` },
    { Icon: TrendingUp,    label: "What's next?",               prompt: nextStepPrompt },
  ];

  // Domain-specific icon and colors
  const DomainIcon = domainPersonality.primaryIconComponent;
  const fabBgClass = domainPersonality.fabBg;
  const headerBgClass = domainPersonality.headerBg;
  const headerTextClass = domainPersonality.headerText;
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={gamingMode ? undefined : `fixed bottom-8 right-8 w-16 h-16 ${fabBgClass} border-4 border-brutal-black shadow-brutal rounded-none flex items-center justify-center cursor-pointer z-50`}
            style={gamingMode && gamingColors ? {
              position: 'fixed', bottom: '32px', right: '32px',
              width: 56, height: 56, borderRadius: '50%',
              background: gamingTheme.cardBg,
              backdropFilter: `blur(${gamingTheme.glassBlur})`,
              border: `2px solid ${gamingColors.primary}`,
              boxShadow: `0 0 20px ${gamingColors.glow}, 0 4px 16px rgba(0,0,0,0.4)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 50, position: 'fixed',
            } : undefined}
          >
            {gamingMode
              ? <DomainIcon size={24} color={gamingColors?.primary || gamingTheme.mint} />
              : <AnimatedIcon icon={DomainIcon} size={30} animation={iconAnimation} className={headerTextClass} />
            }
            {unreadCount > 0 && (
              <span
                className={gamingMode ? undefined : 'absolute -top-2 -right-2 w-6 h-6 bg-brutal-pink border-2 border-brutal-black rounded-none flex items-center justify-center text-xs font-black text-brutal-black'}
                style={gamingMode && gamingColors ? {
                  position: 'absolute', top: -6, right: -6,
                  width: 20, height: 20, borderRadius: '50%',
                  background: gamingColors.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontFamily: gamingTheme.fontLabel,
                  color: gamingTheme.bgDark, fontWeight: 700,
                } : undefined}
              >
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
            className={gamingMode ? undefined : 'fixed bottom-8 right-8 w-96 h-[600px] bg-brutal-white border-4 border-brutal-black shadow-brutal-lg rounded-none flex flex-col z-50'}
            style={gamingMode && gamingColors ? {
              position: 'fixed', bottom: '32px', right: '32px',
              width: '380px', height: '580px',
              background: gamingTheme.bgMid,
              border: `1.5px solid rgba(${hexToRgbStr(gamingColors.primary)},0.5)`,
              borderRadius: '20px',
              boxShadow: `0 0 48px rgba(${hexToRgbStr(gamingColors.primary)},0.18), 0 16px 48px rgba(0,0,0,0.5)`,
              backdropFilter: `blur(${gamingTheme.glassBlur})`,
              display: 'flex', flexDirection: 'column', zIndex: 50,
              overflow: 'hidden',
            } : undefined}
          >
            {/* Header */}
            <div
              className={gamingMode ? undefined : `${headerBgClass} border-b-4 border-brutal-black p-4 flex items-center justify-between shrink-0`}
              style={gamingMode && gamingColors ? {
                padding: '16px 20px',
                borderBottom: `1px solid rgba(${hexToRgbStr(gamingColors.primary)},0.25)`,
                background: `linear-gradient(135deg, rgba(${hexToRgbStr(gamingColors.primary)},0.12) 0%, transparent 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0,
              } : undefined}
            >
              <div className={gamingMode ? undefined : 'flex items-center gap-3'} style={gamingMode ? { display: 'flex', alignItems: 'center', gap: '12px' } : undefined}>
                {gamingMode
                  ? <DomainIcon size={22} color={gamingColors?.primary || gamingTheme.mint} />
                  : <AnimatedIcon icon={DomainIcon} size={28} animation={iconAnimation} className={headerTextClass} />
                }
                <div>
                  <h3 style={gamingMode ? { fontFamily: gamingTheme.fontHeading, fontSize: '14px', fontWeight: 700, color: gamingTheme.stellarWhite, textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0 } : undefined}
                    className={gamingMode ? undefined : `font-black ${headerTextClass} text-base leading-none`}>
                    FINN — FINLIT MENTOR
                  </h3>
                  <p style={gamingMode ? { fontFamily: gamingTheme.fontLabel, fontSize: '9px', color: gamingColors?.primary, letterSpacing: '1px', marginTop: '3px' } : undefined}
                    className={gamingMode ? undefined : `${headerTextClass} opacity-60 text-xs mt-0.5`}>
                    {domainPersonality.tagline} · Level {level}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className={gamingMode ? undefined : 'w-8 h-8 bg-brutal-white border-2 border-brutal-black flex items-center justify-center text-brutal-black hover:bg-brutal-pink transition-colors'}
                style={gamingMode ? {
                  width: 30, height: 30, borderRadius: '8px',
                  background: 'rgba(61,78,122,0.5)',
                  border: '1px solid rgba(139,184,233,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                } : undefined}
              >
                <X size={14} color={gamingMode ? gamingTheme.seafoam : undefined} strokeWidth={2.5} />
              </button>
            </div>

            {/* Messages */}
            <div
              className={gamingMode ? undefined : 'flex-1 overflow-y-auto p-4 space-y-3 bg-brutal-bg'}
              style={gamingMode ? { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(10,14,30,0.5)' } : undefined}
            >
              {messages === null && (
                <div className="flex justify-center items-center h-full">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 bg-brutal-blue border-2 border-brutal-black"
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
                  className={gamingMode ? undefined : `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                  style={gamingMode ? { display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px' } : undefined}
                >
                  {msg.role === 'assistant' && (
                    gamingMode && gamingColors
                      ? <DomainIcon size={16} color={gamingColors.primary} style={{ flexShrink: 0, marginTop: 3 }} />
                      : <DomainIcon size={18} strokeWidth={2.5} className="text-brutal-blue shrink-0 mt-1" />
                  )}
                  <div
                    className={gamingMode ? undefined : `max-w-[78%] px-3 py-2 border-4 border-brutal-black shadow-brutal-sm rounded-none ${msg.role === 'user' ? 'bg-brutal-pink' : 'bg-brutal-white'}`}
                    style={gamingMode && gamingColors ? {
                      maxWidth: '78%', padding: '10px 14px', borderRadius: '12px',
                      background: msg.role === 'user'
                        ? `rgba(${hexToRgbStr(gamingColors.primary)},0.15)`
                        : 'rgba(30,42,69,0.7)',
                      border: msg.role === 'user'
                        ? `1px solid rgba(${hexToRgbStr(gamingColors.primary)},0.4)`
                        : '1px solid rgba(139,184,233,0.15)',
                    } : undefined}
                  >
                    <p
                      className={gamingMode ? undefined : 'text-sm font-bold text-brutal-black leading-relaxed whitespace-pre-wrap'}
                      style={gamingMode ? { fontFamily: gamingTheme.fontBody, fontSize: '13px', color: gamingTheme.seafoam, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 } : undefined}
                    >
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start gap-2"
                >
                  <DomainIcon size={18} strokeWidth={2.5} className="text-brutal-blue shrink-0 mt-1" />
                  <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal-sm rounded-none px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [-3, 3, -3] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.18 }}
                          className="w-2 h-2 bg-brutal-black rounded-none"
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
                  className="flex justify-start gap-2"
                >
                  <DomainIcon size={18} strokeWidth={2.5} className="text-brutal-blue shrink-0 mt-1" />
                  <div className="bg-brutal-pink border-4 border-brutal-black shadow-brutal-sm rounded-none px-3 py-2">
                    <p className="text-sm font-bold text-brutal-black">{error}</p>
                    <button onClick={() => setError(null)} className="mt-1 text-xs font-black text-brutal-black/50 underline">
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick actions */}
            <div
              className={gamingMode ? undefined : 'border-t-4 border-brutal-black p-3 bg-brutal-bg shrink-0'}
              style={gamingMode ? { borderTop: `1px solid rgba(139,184,233,0.15)`, padding: '12px 16px', flexShrink: 0, background: 'rgba(10,14,30,0.4)' } : undefined}
            >
              <p
                className={gamingMode ? undefined : 'text-[10px] font-black text-brutal-black/50 uppercase tracking-wider mb-2'}
                style={gamingMode ? { fontFamily: gamingTheme.fontLabel, fontSize: '8px', letterSpacing: '2px', color: gamingTheme.mutedBlue, textTransform: 'uppercase', marginBottom: '8px' } : undefined}
              >Quick actions</p>
              <div className={gamingMode ? undefined : 'flex flex-wrap gap-1.5'} style={gamingMode ? { display: 'flex', flexWrap: 'wrap', gap: '6px' } : undefined}>
                {quickActions.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(a.prompt)}
                    disabled={isLoading || isRateLimited()}
                    className={gamingMode ? undefined : 'bg-brutal-green border-2 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-2.5 py-1 text-xs font-black text-brutal-black disabled:opacity-40 transition-all flex items-center gap-1'}
                    style={gamingMode && gamingColors ? {
                      padding: '5px 10px', borderRadius: '6px',
                      background: `rgba(${hexToRgbStr(gamingColors.primary)},0.10)`,
                      border: `1px solid rgba(${hexToRgbStr(gamingColors.primary)},0.3)`,
                      fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                      color: gamingColors.primary, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '5px',
                      opacity: isLoading || isRateLimited() ? 0.4 : 1,
                      letterSpacing: '0.5px',
                    } : undefined}
                  >
                    <a.Icon size={11} strokeWidth={2.5} color={gamingMode && gamingColors ? gamingColors.primary : undefined} />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div
              className={gamingMode ? undefined : 'border-t-4 border-brutal-black p-3 bg-brutal-white shrink-0'}
              style={gamingMode ? { borderTop: `1px solid rgba(139,184,233,0.15)`, padding: '12px 16px', background: gamingTheme.bgMid, flexShrink: 0 } : undefined}
            >
              {isRateLimited() && (
                <p
                  className={gamingMode ? undefined : 'text-xs font-bold text-red-500 mb-2 flex items-center gap-1'}
                  style={gamingMode ? { fontFamily: gamingTheme.fontBody, fontSize: '11px', color: '#F87171', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' } : undefined}
                >
                  <Timer size={12} strokeWidth={2.5} /> Slow down! Max 10 messages/minute.
                </p>
              )}
              <div className={gamingMode ? undefined : 'flex gap-2 items-end'} style={gamingMode ? { display: 'flex', gap: '8px', alignItems: 'flex-end' } : undefined}>
                <div className={gamingMode ? undefined : 'flex-1'} style={gamingMode ? { flex: 1 } : undefined}>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value.slice(0, MAX_CHARS))}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask FINN anything… (Shift+Enter for new line)"
                    disabled={isLoading || isRateLimited()}
                    rows={2}
                    className={gamingMode ? undefined : 'w-full border-4 border-brutal-black rounded-none px-3 py-2 text-sm focus:outline-none font-bold text-brutal-black placeholder-brutal-black/30 disabled:opacity-50 resize-none leading-snug'}
                    style={gamingMode ? {
                      width: '100%', padding: '10px 12px', borderRadius: '10px',
                      background: 'rgba(30,42,69,0.7)',
                      border: '1px solid rgba(139,184,233,0.25)',
                      fontFamily: gamingTheme.fontBody, fontSize: '13px',
                      color: gamingTheme.stellarWhite, outline: 'none',
                      resize: 'none', lineHeight: 1.5, boxSizing: 'border-box',
                      opacity: isLoading || isRateLimited() ? 0.5 : 1,
                    } : undefined}
                  />
                  <p
                    className={gamingMode ? undefined : `text-[10px] font-bold text-right mt-0.5 ${input.length > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-brutal-black/30'}`}
                    style={gamingMode ? { fontFamily: gamingTheme.fontLabel, fontSize: '9px', color: input.length > MAX_CHARS * 0.9 ? '#F87171' : gamingTheme.mutedBlue, textAlign: 'right', marginTop: '3px' } : undefined}
                  >
                    {input.length}/{MAX_CHARS}
                  </p>
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim() || input.trim().length < 2 || isRateLimited()}
                  className={gamingMode ? undefined : `${headerBgClass} border-4 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-4 py-3 ${headerTextClass} disabled:opacity-40 transition-all self-start flex items-center justify-center`}
                  style={gamingMode && gamingColors ? {
                    padding: '10px 14px', borderRadius: '10px', alignSelf: 'flex-start',
                    background: `linear-gradient(135deg, ${gamingColors.primary}, ${gamingColors.secondary || gamingColors.primary})`,
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: isLoading || !input.trim() || input.trim().length < 2 || isRateLimited() ? 0.4 : 1,
                    boxShadow: `0 0 12px ${gamingColors.glow}`,
                  } : undefined}
                >
                  <Send size={16} color={gamingMode ? gamingTheme.bgDark : undefined} strokeWidth={2.5} />
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
