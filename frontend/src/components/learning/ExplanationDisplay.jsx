// FINLIT — Deep Explanation Display
// 4-section collapsible layout: Analogy → Math → Why → Next Steps
// Supports per-section comprehension checks and adaptive re-explanation.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, BarChart2, Target, Zap,
  Clock, ChevronDown, ChevronUp, RefreshCw,
  Gamepad2, Shirt, Trophy, Music,
} from 'lucide-react';
import AnimatedIcon from '../shared/AnimatedIcon';
import ComprehensionCheck from './ComprehensionCheck';
import ConfusionIdentifier from './ConfusionIdentifier';
import AskFinnAnything from './AskFinnAnything';
import { gamingTheme } from '../../styles/gamingTheme';

function hexToRgbStr(hex = '#000000') {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const GAMING_SECTION_COLORS = {
  analogy:      null,       // set dynamically from gamingColors.primary
  math:         '#4ECDC4',
  whyItMatters: '#F87171',
  nextSteps:    '#9FE0D3',
};

// Domain badge icons (Lucide only, no emoji)
const DOMAIN_ICON_MAP = {
  gaming:  Gamepad2,
  fashion: Shirt,
  sports:  Trophy,
  music:   Music,
};

const SECTION_CONFIG = [
  {
    key:       'analogy',
    title:     'THE ANALOGY',
    icon:      Brain,
    animation: 'wiggle',
    headerBg:  'bg-brutal-blue',
    bodyBg:    'bg-brutal-blue',
    border:    'border-brutal-black',
    textColor: 'text-brutal-white',
    chevronColor: 'text-brutal-white',
    mono:      false,
  },
  {
    key:       'math',
    title:     'THE MATH',
    icon:      BarChart2,
    animation: 'none',
    headerBg:  'bg-brutal-black',
    bodyBg:    'bg-brutal-black',
    border:    'border-brutal-black',
    textColor: 'text-brutal-green',
    chevronColor: 'text-brutal-green',
    mono:      true,
  },
  {
    key:       'whyItMatters',
    title:     'WHY IT MATTERS',
    icon:      Target,
    animation: 'bounce',
    headerBg:  'bg-brutal-pink',
    bodyBg:    'bg-brutal-pink',
    border:    'border-brutal-black',
    textColor: 'text-brutal-black',
    chevronColor: 'text-brutal-black',
    mono:      false,
  },
  {
    key:       'nextSteps',
    title:     'NEXT STEPS',
    icon:      Zap,
    animation: 'flash',
    headerBg:  'bg-brutal-green',
    bodyBg:    'bg-brutal-green',
    border:    'border-brutal-black',
    textColor: 'text-brutal-black',
    chevronColor: 'text-brutal-black',
    mono:      false,
  },
];

// ── Main component ────────────────────────────────────────────────────────────

const ExplanationDisplay = ({
  explanation,
  topic,
  interest,
  onRegenerate,
  isRegenerating,
  // Adaptive learning props (all optional — passed from Learning.jsx)
  pacing,
  comprehensionState,
  onComprehension,
  adaptiveContent,
  adaptiveLoading,
  onRequestAdaptive,
  // Gaming mode
  gamingMode,
  gamingColors,
}) => {
  const [collapsed, setCollapsed] = useState({
    analogy: false,
    math: false,
    whyItMatters: false,
    nextSteps: false,
  });

  const toggle = (key) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

  const adaptiveProps = {
    pacing,
    comprehensionState:   comprehensionState   || {},
    onComprehension:      onComprehension      || (() => {}),
    adaptiveContent:      adaptiveContent      || {},
    adaptiveLoading:      adaptiveLoading      || {},
    onRequestAdaptive:    onRequestAdaptive    || (() => {}),
  };

  // New structured format
  if (explanation && explanation.sections) {
    return (
      <NewFormatDisplay
        explanation={explanation}
        topic={topic}
        interest={interest}
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
        collapsed={collapsed}
        toggle={toggle}
        gamingMode={gamingMode}
        gamingColors={gamingColors}
        {...adaptiveProps}
      />
    );
  }

  // Legacy format fallback (old { analogy, meaning, example, takeaway })
  return <LegacyDisplay explanation={explanation} topic={topic} interest={interest} />;
};

// ── New 4-section display ─────────────────────────────────────────────────────

const NewFormatDisplay = ({
  explanation,
  topic,
  interest,
  onRegenerate,
  isRegenerating,
  collapsed,
  toggle,
  // adaptive
  pacing,
  comprehensionState,
  onComprehension,
  adaptiveContent,
  adaptiveLoading,
  onRequestAdaptive,
  // gaming
  gamingMode,
  gamingColors,
}) => {
  const { sections, readingTime, domain, keyFormula, difficulty } = explanation;

  const DomainIcon = DOMAIN_ICON_MAP[domain] || Brain;
  const domainLabel = domain
    ? domain.charAt(0).toUpperCase() + domain.slice(1)
    : (interest || 'General');

  // Which section indices get comprehension checks
  const checksActive = pacing && pacing !== 'quick';
  const getSectionCheck = (i) => {
    if (!checksActive) return false;
    if (pacing === 'deep_dive') return true;
    // standard: last 2 sections
    return i >= 2;
  };

  const gc = gamingColors || {};

  // ── Gaming render ──────────────────────────────────────────────────────────
  if (gamingMode && gc.primary) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Topic header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: gamingTheme.cardBg,
            border: gamingTheme.borderThin,
            borderRadius: '16px',
            padding: '20px 24px',
            backdropFilter: `blur(${gamingTheme.glassBlur})`,
            boxShadow: gamingTheme.shadowCard,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
              <div style={{ width: 4, height: 44, borderRadius: 2, background: gc.primary, flexShrink: 0, boxShadow: gc.glow }} />
              <div style={{ minWidth: 0 }}>
                <h2 style={{ fontFamily: gamingTheme.fontHeading, fontSize: '18px', fontWeight: 800, color: gamingTheme.stellarWhite, textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0, lineHeight: 1.2 }}>{topic}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: `rgba(${hexToRgbStr(gc.primary)},0.15)`, border: `1px solid rgba(${hexToRgbStr(gc.primary)},0.4)`, color: gc.primary, fontFamily: gamingTheme.fontLabel, fontSize: '9px', letterSpacing: '2px', padding: '3px 9px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <DomainIcon size={9} strokeWidth={2.5} />
                    {domainLabel.toUpperCase()}
                  </span>
                  {difficulty && (
                    <span style={{ background: 'rgba(61,78,122,0.6)', border: gamingTheme.borderThin, color: gamingTheme.seafoam, fontFamily: gamingTheme.fontLabel, fontSize: '9px', letterSpacing: '2px', padding: '3px 9px', borderRadius: '4px' }}>
                      {difficulty.toUpperCase()}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: gamingTheme.fontLabel, fontSize: '9px', color: gamingTheme.mutedBlue }}>
                    <Clock size={10} strokeWidth={2.5} />
                    {readingTime} min read
                  </span>
                </div>
              </div>
            </div>
            {onRegenerate && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRegenerate}
                disabled={isRegenerating}
                style={{ background: 'rgba(61,78,122,0.5)', border: `1px solid rgba(${hexToRgbStr(gc.primary)},0.4)`, color: gc.primary, fontFamily: gamingTheme.fontLabel, fontSize: '9px', letterSpacing: '1.5px', padding: '8px 14px', borderRadius: '8px', cursor: isRegenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, opacity: isRegenerating ? 0.5 : 1 }}
              >
                <RefreshCw size={11} strokeWidth={2.5} style={{ animation: isRegenerating ? 'spin 1s linear infinite' : 'none' }} />
                {isRegenerating ? 'LOADING...' : 'EXPLAIN DIFFERENTLY'}
              </motion.button>
            )}
          </div>
          {keyFormula && (
            <div style={{ marginTop: '14px', background: 'rgba(30,42,69,0.7)', border: gamingTheme.borderThin, borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ fontFamily: gamingTheme.fontLabel, fontSize: '8px', color: gamingTheme.mutedBlue, letterSpacing: '2px', textTransform: 'uppercase', flexShrink: 0, paddingTop: '2px' }}>FORMULA</span>
              <span style={{ fontFamily: 'monospace', fontSize: '13px', color: gc.primary, fontWeight: 600 }}>{keyFormula}</span>
            </div>
          )}
        </motion.div>

        {/* 4 Sections */}
        {SECTION_CONFIG.map((cfg, i) => {
          const content = sections[cfg.key];
          if (!content) return null;
          const isCollapsed = collapsed[cfg.key];
          const showCheck = getSectionCheck(i);
          const checkResponse = comprehensionState[cfg.key] || null;
          const showConfusion = showCheck && (checkResponse === 'sortof' || checkResponse === 'no');
          const adaptive = adaptiveContent[cfg.key] || null;
          const isAdaptiveLoading = adaptiveLoading[cfg.key] || false;
          const sColor = GAMING_SECTION_COLORS[cfg.key] || gc.primary;

          return (
            <motion.div
              key={cfg.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ borderRadius: '14px', overflow: 'hidden', background: 'rgba(30,42,69,0.55)', border: `1px solid rgba(${hexToRgbStr(sColor)},0.22)`, backdropFilter: 'blur(12px)' }}
            >
              <button
                onClick={() => toggle(cfg.key)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'transparent', border: 'none', borderBottom: isCollapsed ? 'none' : `1px solid rgba(${hexToRgbStr(sColor)},0.2)`, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 3, height: 18, borderRadius: 2, background: sColor, flexShrink: 0 }} />
                  <cfg.icon size={16} color={sColor} />
                  <h3 style={{ fontFamily: gamingTheme.fontHeading, fontSize: '11px', fontWeight: 600, color: gamingTheme.stellarWhite, textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>{cfg.title}</h3>
                </div>
                {isCollapsed
                  ? <ChevronDown size={16} color={gamingTheme.mutedBlue} />
                  : <ChevronUp   size={16} color={gamingTheme.mutedBlue} />
                }
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '16px 20px' }}>
                      <SectionContent content={content} cfg={cfg} gamingMode={true} gamingColor={sColor} />
                      {pacing === 'deep_dive' && (
                        <AskFinnAnything topic={topic} domain={domain || interest} sectionContent={content} isDark={true} />
                      )}
                      {showCheck && (
                        <ComprehensionCheck sectionKey={cfg.key} response={checkResponse} onResponse={onComprehension} isDark={true} />
                      )}
                      {showConfusion && (
                        <ConfusionIdentifier sectionKey={cfg.key} onSelect={onRequestAdaptive} isLoading={isAdaptiveLoading} adaptiveContent={adaptive} />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {pacing === 'standard' && (
          <AskFinnAnything topic={topic} domain={domain || interest} sectionContent={sections.nextSteps || sections.whyItMatters || ''} isDark={true} />
        )}
      </div>
    );
  }

  // ── Brutalist render ───────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* ── Topic header card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brutal-white border-4 border-brutal-black shadow-brutal p-5"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <AnimatedIcon icon={Brain} size={42} animation="wiggle" className="text-brutal-blue shrink-0" />
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-brutal-black leading-none truncate">{topic}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">

                {/* Domain badge */}
                <span className="bg-brutal-blue text-brutal-white text-[10px] font-black px-2 py-0.5 border-2 border-brutal-black flex items-center gap-1">
                  <DomainIcon size={10} strokeWidth={2.5} />
                  {domainLabel.toUpperCase()}
                </span>

                {/* Difficulty badge */}
                {difficulty && (
                  <span className={`text-[10px] font-black px-2 py-0.5 border-2 border-brutal-black ${
                    difficulty === 'beginner'     ? 'bg-brutal-green text-brutal-black' :
                    difficulty === 'intermediate' ? 'bg-brutal-white text-brutal-black' :
                                                   'bg-brutal-pink text-brutal-black'
                  }`}>
                    {difficulty.toUpperCase()}
                  </span>
                )}

                {/* Reading time */}
                <span className="flex items-center gap-1 text-xs font-bold text-brutal-black/50">
                  <Clock size={11} strokeWidth={2.5} />
                  {readingTime} min read
                </span>
              </div>
            </div>
          </div>

          {/* Explain Differently */}
          {onRegenerate && (
            <motion.button
              whileHover={{ x: 2, y: 2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="shrink-0 bg-brutal-bg border-2 border-brutal-black px-3 py-2 font-black text-xs text-brutal-black flex items-center gap-1.5 shadow-brutal-sm hover:shadow-brutal transition-all disabled:opacity-40"
            >
              <RefreshCw size={12} strokeWidth={2.5} className={isRegenerating ? 'animate-spin' : ''} />
              {isRegenerating ? 'LOADING...' : 'EXPLAIN DIFFERENTLY'}
            </motion.button>
          )}
        </div>

        {/* Key formula */}
        {keyFormula && (
          <div className="mt-3 bg-brutal-bg border-2 border-brutal-black px-3 py-2 flex items-start gap-2">
            <span className="text-[10px] font-black text-brutal-black/40 uppercase tracking-wider shrink-0 pt-0.5">Formula</span>
            <span className="font-mono text-sm font-bold text-brutal-black leading-snug">{keyFormula}</span>
          </div>
        )}
      </motion.div>

      {/* ── 4 Sections ── */}
      {SECTION_CONFIG.map((cfg, i) => {
        const content = sections[cfg.key];
        if (!content) return null;
        const isCollapsed = collapsed[cfg.key];
        const showCheck = getSectionCheck(i);
        const checkResponse = comprehensionState[cfg.key] || null;
        const showConfusion = showCheck && (checkResponse === 'sortof' || checkResponse === 'no');
        const adaptive = adaptiveContent[cfg.key] || null;
        const isAdaptiveLoading = adaptiveLoading[cfg.key] || false;

        return (
          <motion.div
            key={cfg.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="border-4 border-brutal-black shadow-brutal overflow-hidden"
          >
            {/* Section header — click to collapse */}
            <button
              onClick={() => toggle(cfg.key)}
              className={`${cfg.headerBg} w-full flex items-center justify-between px-5 py-4 ${!isCollapsed ? 'border-b-4 border-brutal-black' : ''} transition-all`}
            >
              <div className="flex items-center gap-3">
                <AnimatedIcon
                  icon={cfg.icon}
                  size={24}
                  animation={isCollapsed ? 'none' : cfg.animation}
                  className={cfg.textColor}
                />
                <h3 className={`text-lg font-black ${cfg.textColor}`}>{cfg.title}</h3>
              </div>
              {isCollapsed
                ? <ChevronDown size={18} strokeWidth={2.5} className={cfg.chevronColor} />
                : <ChevronUp   size={18} strokeWidth={2.5} className={cfg.chevronColor} />
              }
            </button>

            {/* Collapsible body */}
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className={`${cfg.bodyBg} px-6 py-5`}>
                    <SectionContent content={content} cfg={cfg} />

                    {/* AskFinnAnything — deep dive only */}
                    {pacing === 'deep_dive' && (
                      <AskFinnAnything
                        topic={topic}
                        domain={domain || interest}
                        sectionContent={content}
                        isDark={cfg.bodyBg === 'bg-brutal-blue' || cfg.bodyBg === 'bg-brutal-black'}
                      />
                    )}

                    {/* Comprehension check */}
                    {showCheck && (
                      <ComprehensionCheck
                        sectionKey={cfg.key}
                        response={checkResponse}
                        onResponse={onComprehension}
                        isDark={cfg.bodyBg === 'bg-brutal-blue' || cfg.bodyBg === 'bg-brutal-black'}
                      />
                    )}

                    {/* Confusion identifier + adaptive re-explanation */}
                    {showConfusion && (
                      <ConfusionIdentifier
                        sectionKey={cfg.key}
                        onSelect={onRequestAdaptive}
                        isLoading={isAdaptiveLoading}
                        adaptiveContent={adaptive}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* AskFinnAnything for standard pacing (single global one at the bottom) */}
      {pacing === 'standard' && (
        <AskFinnAnything
          topic={topic}
          domain={domain || interest}
          sectionContent={sections.nextSteps || sections.whyItMatters || ''}
        />
      )}
    </div>
  );
};

// ── Section content renderer ──────────────────────────────────────────────────

const SectionContent = ({ content, cfg, gamingMode, gamingColor }) => {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  if (gamingMode) {
    return (
      <>
        {paragraphs.map((para, i) => {
          const isCalcBlock = cfg.mono || /\$[\d,]+|[\d]+%|=\s*[\d]/.test(para);
          return (
            <p key={i} style={{
              fontFamily: isCalcBlock ? 'monospace' : gamingTheme.fontBody,
              fontSize: isCalcBlock ? '13px' : '15px',
              color: gamingTheme.seafoam,
              lineHeight: 1.75,
              margin: i > 0 ? '14px 0 0' : 0,
              whiteSpace: isCalcBlock ? 'pre-wrap' : 'normal',
            }}>{para}</p>
          );
        })}
      </>
    );
  }

  return (
    <>
      {paragraphs.map((para, i) => {
        const isCalcBlock = cfg.mono || /\$[\d,]+|[\d]+%|=\s*[\d]/.test(para);

        return (
          <p
            key={i}
            className={[
              cfg.textColor,
              isCalcBlock ? 'font-mono text-sm leading-relaxed whitespace-pre-wrap' : 'text-base font-medium leading-relaxed',
              i > 0 ? 'mt-4' : '',
              cfg.mono && i === 0 ? 'mt-0' : '',
            ].join(' ')}
          >
            {para}
          </p>
        );
      })}
    </>
  );
};

// ── Legacy format fallback ────────────────────────────────────────────────────

const LegacyDisplay = ({ explanation, topic, interest }) => {
  if (!explanation) return null;

  const sections = [
    { title: 'THE ANALOGY',              content: explanation.analogy,  bg: 'bg-brutal-blue',  text: 'text-brutal-white' },
    { title: 'WHAT THIS ACTUALLY MEANS', content: explanation.meaning,  bg: 'bg-brutal-white', text: 'text-brutal-black' },
    { title: 'REAL-LIFE EXAMPLE',        content: explanation.example,  bg: 'bg-brutal-pink',  text: 'text-brutal-black' },
    { title: 'KEY TAKEAWAY',             content: explanation.takeaway, bg: 'bg-brutal-green', text: 'text-brutal-black' },
  ];

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brutal-white border-4 border-brutal-black shadow-brutal p-5 flex items-center gap-3"
      >
        <AnimatedIcon icon={Brain} size={40} animation="wiggle" className="text-brutal-blue" />
        <div>
          <h2 className="text-2xl font-black text-brutal-black">{topic}</h2>
          <p className="text-sm font-bold text-brutal-black/60">Explained through {interest}</p>
        </div>
      </motion.div>

      {sections.map((s, i) => s.content ? (
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`${s.bg} border-4 border-brutal-black shadow-brutal p-5`}
        >
          <h3 className={`text-lg font-black mb-3 ${s.text}`}>{s.title}</h3>
          <p className={`${s.text} text-base font-medium leading-relaxed whitespace-pre-wrap`}>{s.content}</p>
        </motion.div>
      ) : null)}
    </div>
  );
};

export default ExplanationDisplay;
