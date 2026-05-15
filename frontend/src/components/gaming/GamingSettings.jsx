import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, RefreshCw, ChevronDown, Sprout, Swords, Flame, Snowflake, Leaf } from 'lucide-react';
import { gamingTheme, getElementColors } from '../../styles/gamingTheme';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

const DIFFICULTIES = [
  { value: 'beginner',     label: 'Novice',   desc: 'Just starting out',       Icon: Sprout },
  { value: 'intermediate', label: 'Adept',    desc: 'Know the basics',          Icon: Swords },
  { value: 'advanced',     label: 'Master',   desc: 'Ready for a challenge',    Icon: Zap    },
];

const ELEM_FALLBACK = { Fire: Flame, Frost: Snowflake, Nature: Leaf };

export default function GamingSettings({ isOpen, onClose, character, onChangeCharacter }) {
  const { profile, updateUserProfile } = useUser();
  const { user } = useAuth();
  const colors = getElementColors(character);

  const [name, setName]           = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [openSections, setOpenSections] = useState({ guardian: true, profile: true });

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setDifficulty(profile.difficulty || 'beginner');
    }
  }, [profile]);

  const isDirty = name !== (profile?.name || '') || difficulty !== (profile?.difficulty || 'beginner');

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    await updateUserProfile({ name, difficulty });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const toggleSection = (key) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(15,20,40,0.55)',
              backdropFilter: 'blur(3px)',
              zIndex: 500,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', top: 0, left: 0,
              width: '320px', height: '100vh',
              background: gamingTheme.bgMid,
              borderRight: `1px solid rgba(${hexToRgbStr(colors.primary)},0.35)`,
              boxShadow: `8px 0 48px rgba(0,0,0,0.65)`,
              zIndex: 600, overflowY: 'auto',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 20px 16px',
              borderBottom: gamingTheme.borderThin,
              flexShrink: 0,
              background: `linear-gradient(135deg, rgba(${hexToRgbStr(colors.primary)},0.07) 0%, transparent 100%)`,
            }}>
              <div>
                <div style={{
                  fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                  letterSpacing: '2.5px', color: gamingTheme.mutedBlue,
                  textTransform: 'uppercase', marginBottom: '3px',
                }}>Control Panel</div>
                <h2 style={{
                  fontFamily: gamingTheme.fontHeading, fontSize: '18px',
                  fontWeight: 700, color: gamingTheme.stellarWhite, margin: 0,
                }}>Settings</h2>
              </div>
              <button onClick={onClose} style={iconBtnStyle}>
                <X size={15} color={gamingTheme.seafoam} />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

              {/* ── Guardian Section ───────────────────────────────────── */}
              <CollapsibleSection
                title="Your Guardian"
                colors={colors}
                isOpen={openSections.guardian}
                onToggle={() => toggleSection('guardian')}
              >
                {/* Character card */}
                <div style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: `rgba(${hexToRgbStr(colors.primary)},0.07)`,
                  border: `1px solid rgba(${hexToRgbStr(colors.primary)},0.22)`,
                  display: 'flex', alignItems: 'center', gap: '14px',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '12px', flexShrink: 0,
                    background: `linear-gradient(135deg, rgba(${hexToRgbStr(colors.primary)},0.18) 0%, ${gamingTheme.bgSecondary} 100%)`,
                    border: `2px solid ${colors.primary}`,
                    overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 16px ${colors.glow}`,
                  }}>
                    {character?.chibiImage ? (
                      <img
                        src={character.chibiImage}
                        alt={character?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (() => { const FbIcon = ELEM_FALLBACK[character?.element] || Flame; return <FbIcon size={26} color={colors.primary} />; })()}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: gamingTheme.fontHeading, fontSize: '17px',
                      fontWeight: 700, color: gamingTheme.stellarWhite, marginBottom: '3px',
                    }}>
                      {character?.name || 'No Guardian'}
                    </div>
                    <div style={{
                      fontFamily: gamingTheme.fontLabel, fontSize: '10px',
                      letterSpacing: '1.5px', color: colors.primary, textTransform: 'uppercase',
                    }}>
                      {character?.element || '—'} Guardian
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onChangeCharacter}
                  style={{
                    width: '100%', padding: '11px',
                    fontFamily: gamingTheme.fontHeading,
                    fontSize: '11px', fontWeight: 600,
                    letterSpacing: '1.5px', textTransform: 'uppercase',
                    color: colors.primary,
                    background: `rgba(${hexToRgbStr(colors.primary)},0.09)`,
                    border: `1px solid rgba(${hexToRgbStr(colors.primary)},0.35)`,
                    borderRadius: '10px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                  }}
                >
                  <RefreshCw size={12} /> Change Guardian
                </motion.button>
              </CollapsibleSection>

              {/* ── Personal Details Section ──────────────────────────── */}
              <CollapsibleSection
                title="Personal Details"
                colors={colors}
                isOpen={openSections.profile}
                onToggle={() => toggleSection('profile')}
              >
                {/* Display Name */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{
                    display: 'block',
                    fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                    letterSpacing: '1.5px', color: gamingTheme.mutedBlue,
                    textTransform: 'uppercase', marginBottom: '7px',
                  }}>Display Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    style={{
                      width: '100%', padding: '10px 14px',
                      fontFamily: gamingTheme.fontBody, fontSize: '14px',
                      color: gamingTheme.stellarWhite,
                      background: 'rgba(47,58,95,0.7)',
                      border: '1px solid rgba(139,184,233,0.3)',
                      borderRadius: '10px', outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = colors.primary; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(139,184,233,0.3)'; }}
                  />
                </div>

                {/* Difficulty */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{
                    display: 'block',
                    fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                    letterSpacing: '1.5px', color: gamingTheme.mutedBlue,
                    textTransform: 'uppercase', marginBottom: '7px',
                  }}>Difficulty</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {DIFFICULTIES.map((d) => {
                      const isActive = difficulty === d.value;
                      return (
                        <motion.div
                          key={d.value}
                          whileHover={{ x: 3 }}
                          onClick={() => setDifficulty(d.value)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '11px',
                            padding: '9px 12px',
                            borderRadius: '10px', cursor: 'pointer',
                            background: isActive
                              ? `rgba(${hexToRgbStr(colors.primary)},0.10)`
                              : 'rgba(47,58,95,0.5)',
                            border: isActive
                              ? `1px solid rgba(${hexToRgbStr(colors.primary)},0.5)`
                              : gamingTheme.borderThin,
                            transition: 'all 0.18s ease',
                          }}
                        >
                          <d.Icon size={16} color={isActive ? colors.primary : gamingTheme.mutedBlue} />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontFamily: gamingTheme.fontBody, fontWeight: 600,
                              fontSize: '13px',
                              color: isActive ? gamingTheme.stellarWhite : gamingTheme.seafoam,
                            }}>{d.label}</div>
                            <div style={{
                              fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                              color: gamingTheme.mutedBlue, letterSpacing: '0.5px',
                            }}>{d.desc}</div>
                          </div>
                          <motion.div
                            initial={false}
                            animate={{ scale: isActive ? 1 : 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                            style={{
                              width: 18, height: 18, borderRadius: '50%',
                              background: colors.primary, flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <Check size={10} strokeWidth={3} color={gamingTheme.bgDark} />
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Email (read-only) */}
                {user?.email && (
                  <div style={{
                    padding: '9px 13px',
                    borderRadius: '10px',
                    background: 'rgba(47,58,95,0.4)',
                    border: gamingTheme.borderThin,
                    marginBottom: '14px',
                  }}>
                    <div style={{
                      fontFamily: gamingTheme.fontLabel, fontSize: '9px',
                      letterSpacing: '1.5px', color: gamingTheme.mutedBlue,
                      textTransform: 'uppercase', marginBottom: '3px',
                    }}>Account Email</div>
                    <div style={{
                      fontFamily: gamingTheme.fontBody, fontSize: '13px',
                      color: gamingTheme.seafoam,
                    }}>{user.email}</div>
                  </div>
                )}

                {/* Save button */}
                <motion.button
                  whileHover={isDirty && !saving ? { scale: 1.02 } : {}}
                  whileTap={isDirty && !saving ? { scale: 0.96 } : {}}
                  onClick={handleSave}
                  disabled={!isDirty || saving}
                  style={{
                    width: '100%', padding: '12px',
                    fontFamily: gamingTheme.fontHeading,
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '1.5px', textTransform: 'uppercase',
                    color: isDirty ? gamingTheme.bgDark : gamingTheme.mutedBlue,
                    background: saved
                      ? `linear-gradient(135deg, ${gamingTheme.mint} 0%, #38B2AC 100%)`
                      : isDirty
                        ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                        : 'rgba(47,58,95,0.5)',
                    border: 'none', borderRadius: '10px',
                    cursor: isDirty && !saving ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                    boxShadow: isDirty && !saved ? `0 4px 18px ${colors.glow}` : 'none',
                    transition: 'all 0.25s ease',
                    opacity: saving ? 0.75 : 1,
                  }}
                >
                  {saved
                    ? <><Check size={13} /> Saved!</>
                    : saving
                      ? 'Saving...'
                      : <><Zap size={13} /> Save Changes</>
                  }
                </motion.button>
              </CollapsibleSection>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CollapsibleSection({ title, colors, isOpen, onToggle, children }) {
  return (
    <div style={{
      borderRadius: '14px',
      border: gamingTheme.borderThin,
      background: 'rgba(47,58,95,0.3)',
      overflow: 'hidden',
    }}>
      {/* Section header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '13px 16px',
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          borderBottom: isOpen ? gamingTheme.borderThin : 'none',
        }}
      >
        <div style={{ width: 3, height: 14, borderRadius: 2, background: colors.primary, flexShrink: 0 }} />
        <h4 style={{
          flex: 1, margin: 0, textAlign: 'left',
          fontFamily: gamingTheme.fontHeading, fontSize: '12px', fontWeight: 600,
          color: gamingTheme.stellarWhite, textTransform: 'uppercase', letterSpacing: '1.5px',
        }}>{title}</h4>
        <motion.div animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} color={gamingTheme.mutedBlue} />
        </motion.div>
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '14px 16px 16px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const iconBtnStyle = {
  width: 32, height: 32, borderRadius: '8px',
  background: 'rgba(61,78,122,0.4)',
  border: '1px solid rgba(139,184,233,0.25)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}
