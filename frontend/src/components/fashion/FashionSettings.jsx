// FINLIT — Fashion Settings Drawer
// Character swap + display name + difficulty + email (read-only)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RefreshCw, ChevronDown, Sparkles, Star, Zap } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

const F = {
  heading: "'Playfair Display', serif",
  italic:  "'Playfair Display', serif",
  ui:      "'DM Sans', sans-serif",
  script:  "'Sacramento', cursive",
};
const C = { deepRose: '#9d1f4a', midRose: '#d4537e', body: '#b0627a', label: '#c98a9e', pink: '#f7a0b8', purple: '#c084fc' };
const GRAD = 'linear-gradient(135deg, #f7a0b8, #c084fc, #fbb6c4)';

function rgb(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const DIFFICULTIES = [
  { value: 'beginner',     label: 'Apprentice', desc: 'Just starting your style journey', Icon: Sparkles },
  { value: 'intermediate', label: 'Stylist',    desc: 'Know the basics',                  Icon: Star     },
  { value: 'advanced',     label: 'Couturier',  desc: 'Ready for complex pieces',          Icon: Zap      },
];

// ── Collapsible section ────────────────────────────────────────────────────────
function Section({ title, isOpen, onToggle, children }) {
  return (
    <div style={{
      borderRadius: 16,
      background: 'rgba(255,255,255,0.18)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.40)',
      overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'transparent', border: 'none', cursor: 'pointer',
          borderBottom: isOpen ? '1px solid rgba(247,160,184,0.18)' : 'none',
        }}
      >
        <div style={{ width: 3, height: 14, borderRadius: 2, background: GRAD, flexShrink: 0 }} />
        <span style={{
          flex: 1, textAlign: 'left',
          fontFamily: F.ui, fontWeight: 600, fontSize: 11,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.deepRose,
        }}>{title}</span>
        <motion.div animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} color={C.label} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '16px 18px 18px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FashionSettings({ isOpen, onClose, character, onChangeCharacter }) {
  const { profile, updateUserProfile } = useUser();
  const { user } = useAuth();

  const [name, setName]             = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [openSections, setOpenSections] = useState({ stylist: true, profile: true });

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

  const toggle = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));

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
              background: 'rgba(157,31,74,0.18)',
              backdropFilter: 'blur(4px)',
              zIndex: 700,
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
              width: 320, height: '100vh',
              background: 'rgba(250,245,236,0.92)',
              backdropFilter: 'blur(28px) saturate(200%)',
              WebkitBackdropFilter: 'blur(28px) saturate(200%)',
              borderRight: '1px solid rgba(247,160,184,0.40)',
              boxShadow: '8px 0 48px rgba(157,31,74,0.14)',
              zIndex: 800,
              overflowY: 'auto',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Shimmer top edge */}
            <div style={{ height: 2, background: GRAD, flexShrink: 0 }} />

            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 20px 16px',
              borderBottom: '1px solid rgba(247,160,184,0.18)',
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.label, marginBottom: 2 }}>
                  Atelier
                </div>
                <h2 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 20, letterSpacing: '-0.01em', color: C.deepRose, margin: 0 }}>
                  Settings
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(255,255,255,0.45)',
                  border: '1px solid rgba(255,255,255,0.60)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={14} color={C.midRose} />
              </motion.button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* ── Your Stylist ─────────────────────────────────────────── */}
              <Section title="Your Stylist" isOpen={openSections.stylist} onToggle={() => toggle('stylist')}>
                {character ? (
                  <>
                    {/* Character card */}
                    <div style={{
                      padding: '12px 14px', borderRadius: 14, marginBottom: 12,
                      background: `rgba(${rgb(character.colors.primary)},0.07)`,
                      border: `1px solid rgba(${rgb(character.colors.primary)},0.22)`,
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                        background: character.colors.gradient,
                        border: `2px solid rgba(${rgb(character.colors.primary)},0.55)`,
                        boxShadow: `0 0 16px ${character.colors.glow}`,
                        overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <img
                          src={character.chibiImage}
                          alt={character.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'screen' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 16, color: C.deepRose, marginBottom: 2 }}>
                          {character.name}
                        </div>
                        <div style={{ fontFamily: F.italic, fontStyle: 'italic', fontSize: 13, color: C.midRose }}>
                          {character.archetype}
                        </div>
                      </div>
                    </div>

                    {/* Change stylist button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                      onClick={onChangeCharacter}
                      style={{
                        width: '100%', padding: 11,
                        fontFamily: F.ui, fontSize: 11, fontWeight: 600,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: C.midRose,
                        background: 'rgba(247,160,184,0.08)',
                        border: '1px solid rgba(247,160,184,0.35)',
                        borderRadius: 10, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      }}
                    >
                      <RefreshCw size={12} /> Change Stylist
                    </motion.button>
                  </>
                ) : (
                  <p style={{ fontFamily: F.ui, fontSize: 13, color: C.label, margin: 0 }}>
                    No stylist selected yet.
                  </p>
                )}
              </Section>

              {/* ── Style Profile ─────────────────────────────────────────── */}
              <Section title="Style Profile" isOpen={openSections.profile} onToggle={() => toggle('profile')}>

                {/* Display name */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{
                    display: 'block',
                    fontFamily: F.ui, fontWeight: 500, fontSize: 9,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: C.label, marginBottom: 7,
                  }}>Display Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name or nickname"
                    style={{
                      width: '100%', padding: '10px 14px',
                      fontFamily: F.ui, fontSize: 14,
                      color: C.deepRose,
                      background: 'rgba(255,255,255,0.55)',
                      border: '1px solid rgba(247,160,184,0.35)',
                      borderRadius: 10, outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = C.pink; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(247,160,184,0.35)'; }}
                  />
                </div>

                {/* Difficulty */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{
                    display: 'block',
                    fontFamily: F.ui, fontWeight: 500, fontSize: 9,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: C.label, marginBottom: 7,
                  }}>Difficulty Level</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {DIFFICULTIES.map((d) => {
                      const active = difficulty === d.value;
                      return (
                        <motion.div
                          key={d.value}
                          whileHover={{ x: 3 }}
                          onClick={() => setDifficulty(d.value)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 11,
                            padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
                            background: active ? 'rgba(247,160,184,0.10)' : 'rgba(255,255,255,0.35)',
                            border: active ? '1px solid rgba(247,160,184,0.50)' : '1px solid rgba(255,255,255,0.50)',
                            transition: 'all 0.18s ease',
                          }}
                        >
                          <d.Icon size={16} color={active ? C.pink : C.label} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: active ? C.deepRose : C.midRose }}>
                              {d.label}
                            </div>
                            <div style={{ fontFamily: F.ui, fontSize: 10, color: C.label, letterSpacing: '0.02em' }}>
                              {d.desc}
                            </div>
                          </div>
                          <motion.div
                            initial={false}
                            animate={{ scale: active ? 1 : 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                            style={{
                              width: 18, height: 18, borderRadius: '50%',
                              background: GRAD, flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <Check size={10} strokeWidth={3} color="#fff" />
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Email (read-only) */}
                {user?.email && (
                  <div style={{
                    padding: '9px 13px', borderRadius: 10, marginBottom: 14,
                    background: 'rgba(255,255,255,0.38)',
                    border: '1px solid rgba(255,255,255,0.50)',
                  }}>
                    <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label, marginBottom: 3 }}>
                      Account Email
                    </div>
                    <div style={{ fontFamily: F.ui, fontSize: 13, color: C.body }}>
                      {user.email}
                    </div>
                  </div>
                )}

                {/* Save button */}
                <motion.button
                  whileHover={isDirty && !saving ? { y: -1, boxShadow: '0 8px 24px rgba(192,132,252,0.32)' } : {}}
                  whileTap={isDirty && !saving ? { scale: 0.96 } : {}}
                  onClick={handleSave}
                  disabled={!isDirty || saving}
                  style={{
                    width: '100%', padding: 12,
                    fontFamily: F.ui, fontWeight: 600,
                    fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: '#fff',
                    background: saved
                      ? 'linear-gradient(135deg, #7ec9a0, #38B2AC)'
                      : isDirty
                        ? GRAD
                        : 'rgba(200,160,175,0.28)',
                    border: 'none', borderRadius: 10,
                    cursor: isDirty && !saving ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    boxShadow: isDirty && !saved ? '0 4px 18px rgba(192,132,252,0.26)' : 'none',
                    transition: 'all 0.25s ease',
                    opacity: saving ? 0.75 : 1,
                  }}
                >
                  {saved
                    ? <><Check size={13} /> Saved!</>
                    : saving
                      ? 'Saving...'
                      : <><Sparkles size={13} /> Save Changes</>
                  }
                </motion.button>
              </Section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
