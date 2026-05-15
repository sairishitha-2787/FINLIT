import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Flame, Snowflake, Leaf } from 'lucide-react';
import { gamingTheme } from '../../styles/gamingTheme';
import { useIsMobile } from '../../hooks/useIsMobile';

const CHARACTERS = [
  {
    id: 'raeveth',
    name: 'Raeveth',
    element: 'Fire',
    title: 'THE AGGRESSIVE INVESTOR',
    description: 'Master of high-growth strategies. Bold moves, maximum returns.',
    playstyle: 'High Risk · High Reward',
    fullImage: '/CHARACTERS/GAMING_A-Raeveth_Character.png',
    chibiImage: '/CHARACTERS/GAMING_CHIBI_VER-_A-Raeveth.png',
    skills: ['Aggressive Budgeting', 'Risk Tolerance', 'Market Momentum'],
  },
  {
    id: 'thessiveil',
    name: 'Thessiveil',
    element: 'Frost',
    title: 'THE CALCULATED STRATEGIST',
    description: 'Expert in risk management and capital preservation. Cool, methodical, unstoppable.',
    playstyle: 'Balanced · Defensive',
    fullImage: '/CHARACTERS/GAMING_F-Thessiveil_Character.png',
    chibiImage: '/CHARACTERS/GAMING_CHIBI_VER-_F-_Thessiveil.png',
    skills: ['Capital Preservation', 'Risk Management', 'Value Investing'],
  },
  {
    id: 'caeldryn',
    name: 'Caeldryn',
    element: 'Nature',
    title: 'THE PATIENT CULTIVATOR',
    description: 'Specialist in sustainable, long-term wealth building. Slow gains compound into empires.',
    playstyle: 'Low Risk · Steady Growth',
    fullImage: '/CHARACTERS/GAMING_M-Caeldryn_Character.png',
    chibiImage: '/CHARACTERS/GAMING_CHIBI_VER-M-_Caeldryn.png',
    skills: ['Compound Patience', 'ESG Portfolio', 'Sustainable Growth'],
  },
];

const ELEMENT_FALLBACK = {
  Fire:   Flame,
  Frost:  Snowflake,
  Nature: Leaf,
};

const CharacterAvatar = ({ character, isSelected, isMobile }) => {
  const colors = gamingTheme[character.element.toLowerCase()];
  const [loaded, setLoaded] = React.useState(false);
  const FallbackIcon = ELEMENT_FALLBACK[character.element] || Flame;
  return (
    <motion.div
      animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: isMobile ? 56 : 100,
        height: isMobile ? 72 : 130,
        margin: '0 auto',
        borderRadius: '14px',
        background: `linear-gradient(160deg, rgba(${hexToRgbStr(colors.primary)},0.18) 0%, ${gamingTheme.bgSecondary} 100%)`,
        border: `2px solid ${isSelected ? colors.primary : 'rgba(139,184,233,0.25)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: isSelected ? `0 0 28px ${colors.glow}, 0 0 56px ${colors.glow}` : 'none',
        transition: 'border 0.25s, box-shadow 0.25s',
      }}
    >
      <img
        src={character.fullImage}
        alt={character.name}
        onLoad={() => setLoaded(true)}
        onError={(e) => { e.target.style.display = 'none'; }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center bottom',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />
      {!loaded && (
        <FallbackIcon size={36} color={colors.primary} style={{ position: 'absolute' }} />
      )}
    </motion.div>
  );
};

export default function CharacterSelection({ isOpen, onSelect }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { isMobile } = useIsMobile();

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    setTimeout(() => {
      onSelect({ ...selected, powerColor: gamingTheme[selected.element.toLowerCase()].primary });
    }, 900);
  };

  const selColors = selected ? gamingTheme[selected.element.toLowerCase()] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(20,28,52,0.96)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px', overflowY: 'auto',
          }}
        >
          <motion.div
            initial={{ scale: 0.88, y: 30, opacity: 0 }}
            animate={confirmed ? { scale: 1.04, opacity: 0 } : { scale: 1, y: 0, opacity: 1 }}
            transition={confirmed ? { duration: 0.9 } : { type: 'spring', stiffness: 220, damping: 22 }}
            style={{
              background: gamingTheme.cardBg,
              backdropFilter: `blur(${gamingTheme.glassBlur})`,
              border: gamingTheme.borderThin,
              borderRadius: isMobile ? '16px' : '24px',
              padding: isMobile ? '28px 16px 24px' : '48px 40px 40px',
              maxWidth: '960px', width: '100%',
              boxShadow: gamingTheme.shadowDeep,
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '4px 14px',
                  background: 'rgba(159,224,211,0.12)',
                  border: '1px solid rgba(159,224,211,0.35)',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontFamily: gamingTheme.fontLabel,
                  color: gamingTheme.mint,
                  letterSpacing: '2px',
                  marginBottom: '16px',
                }}
              >
                <Sparkles size={11} /> ONE TIME SELECTION
              </motion.div>
              <h2 style={{
                fontFamily: gamingTheme.fontHeading,
                fontSize: '32px', fontWeight: 800,
                color: gamingTheme.stellarWhite,
                textTransform: 'uppercase', letterSpacing: '3px',
                marginBottom: '10px',
              }}>
                Choose Your Guardian
              </h2>
              <p style={{ fontFamily: gamingTheme.fontBody, fontSize: '15px', color: gamingTheme.seafoam }}>
                Your character shapes how you experience financial learning. Choose wisely.
              </p>
            </div>

            {/* Character Cards — single column on mobile, 3-column on desktop */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: isMobile ? '12px' : '20px',
              marginBottom: isMobile ? '20px' : '36px',
              alignItems: 'stretch',
            }}>
              {CHARACTERS.map((char) => {
                const isSelected = selected?.id === char.id;
                const c = gamingTheme[char.element.toLowerCase()];
                return (
                  <motion.div
                    key={char.id}
                    whileHover={{ scale: isMobile ? 1.01 : 1.03, y: isMobile ? 0 : -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelected(char)}
                    style={{
                      padding: isMobile ? '16px' : '24px 20px 20px',
                      borderRadius: '18px',
                      cursor: 'pointer',
                      border: isSelected ? `2px solid ${c.primary}` : gamingTheme.borderThin,
                      background: isSelected
                        ? `linear-gradient(160deg, rgba(${hexToRgbStr(c.primary)},0.14) 0%, rgba(${hexToRgbStr(c.secondary)},0.06) 100%)`
                        : 'rgba(94,134,193,0.12)',
                      boxShadow: isSelected ? `0 0 32px ${c.glow}, inset 0 0 24px ${c.glow}` : 'none',
                      transition: 'all 0.3s ease',
                      textAlign: isMobile ? 'left' : 'center',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: isMobile ? 'row' : 'column',
                      alignItems: isMobile ? 'center' : 'stretch',
                      gap: isMobile ? '16px' : '0',
                    }}
                  >
                    {/* Selected check */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          position: 'absolute', top: 12, right: 12,
                          width: 22, height: 22, borderRadius: '50%',
                          background: c.primary,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Check size={12} strokeWidth={3} color={gamingTheme.bgDark} />
                      </motion.div>
                    )}

                    {/* ── Portrait ── */}
                    <div style={{
                      height: isMobile ? '80px' : '150px',
                      width: isMobile ? '64px' : 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <CharacterAvatar character={char} isSelected={isSelected} isMobile={isMobile} />
                    </div>

                    {/* ── Text content ── */}
                    {isMobile ? (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: gamingTheme.fontLabel, fontSize: '9px', letterSpacing: '1.5px', color: c.primary, textTransform: 'uppercase', margin: '0 0 2px' }}>{char.element}</p>
                        <h3 style={{ fontFamily: gamingTheme.fontHeading, fontSize: '18px', fontWeight: 700, color: gamingTheme.stellarWhite, margin: '0 0 4px' }}>{char.name}</h3>
                        <p style={{ fontFamily: gamingTheme.fontBody, fontSize: '12px', color: gamingTheme.seafoam, lineHeight: 1.5, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{char.description}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {char.skills.map(s => (
                            <span key={s} style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '9px', fontFamily: gamingTheme.fontLabel, color: c.primary, background: `rgba(${hexToRgbStr(c.primary)},0.12)`, border: `1px solid rgba(${hexToRgbStr(c.primary)},0.3)` }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* ── Title — fixed height ── */}
                        <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', flexShrink: 0 }}>
                          <p style={{ fontFamily: gamingTheme.fontLabel, fontSize: '10px', letterSpacing: '2px', color: c.primary, textTransform: 'uppercase', lineHeight: 1.3, margin: 0 }}>{char.title}</p>
                        </div>
                        {/* ── Name — fixed height ── */}
                        <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <h3 style={{ fontFamily: gamingTheme.fontHeading, fontSize: '22px', fontWeight: 700, color: gamingTheme.stellarWhite, margin: 0 }}>{char.name}</h3>
                        </div>
                        {/* ── Element/Playstyle — fixed height ── */}
                        <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <p style={{ fontFamily: gamingTheme.fontLabel, fontSize: '11px', color: c.primary, letterSpacing: '1px', margin: 0 }}>{char.element} · {char.playstyle}</p>
                        </div>
                        {/* ── Description — fixed height ── */}
                        <div style={{ height: '72px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                          <p style={{ fontFamily: gamingTheme.fontBody, fontSize: '13px', color: gamingTheme.seafoam, lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{char.description}</p>
                        </div>
                        {/* ── Skill tags ── */}
                        <div style={{ marginTop: 'auto', paddingTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', flexShrink: 0 }}>
                          {char.skills.map(s => (
                            <span key={s} style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '10px', fontFamily: gamingTheme.fontLabel, color: c.primary, background: `rgba(${hexToRgbStr(c.primary)},0.12)`, border: `1px solid rgba(${hexToRgbStr(c.primary)},0.3)`, letterSpacing: '0.5px' }}>{s}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Confirm Button */}
            <motion.button
              whileHover={selected ? { scale: 1.02 } : {}}
              whileTap={selected ? { scale: 0.97 } : {}}
              onClick={handleConfirm}
              disabled={!selected || confirmed}
              style={{
                width: '100%', padding: isMobile ? '14px 18px' : '18px',
                minHeight: '48px',
                fontFamily: gamingTheme.fontHeading,
                fontSize: isMobile ? '14px' : '16px', fontWeight: 700,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: selected ? gamingTheme.bgDark : gamingTheme.mutedBlue,
                background: selected
                  ? `linear-gradient(135deg, ${selColors.primary} 0%, ${selColors.secondary} 100%)`
                  : 'rgba(94,134,193,0.18)',
                border: 'none',
                borderRadius: '14px', cursor: selected ? 'pointer' : 'not-allowed',
                opacity: !selected || confirmed ? 0.6 : 1,
                boxShadow: selected ? `0 4px 24px ${selColors.glow}` : 'none',
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              }}
            >
              <Sparkles size={16} />
              {confirmed ? 'Awakening...' : selected ? `Awaken ${selected.name}` : 'Select a Guardian First'}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}
