import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Heart } from 'lucide-react';
import { useFashion } from '../../contexts/FashionContext';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { loadSRPref, saveSRPref } from '../../services/spacedRepetition';

const F = {
  heading: "'Playfair Display', serif",
  ui:      "'DM Sans', sans-serif",
};
const C = { deepRose: '#9d1f4a', midRose: '#d4537e', label: '#c98a9e', pink: '#f7a0b8' };

const DIFFICULTIES = [
  { id: 'beginner',     label: 'Apprentice', desc: 'Easier challenges, more guidance',  xp: 'Standard XP' },
  { id: 'intermediate', label: 'Stylist',    desc: 'Balanced challenge and reward',      xp: '+20% XP'     },
  { id: 'advanced',     label: 'Couturier',  desc: 'Expert pieces, full rewards',        xp: '+50% XP'     },
];

function rgb(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontFamily: F.ui, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: C.label, marginBottom: 8, padding: '0 2px',
      }}>
        {title}
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.38)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, desc, right, onClick, last, accent }) {
  return (
    <motion.div
      whileHover={onClick ? { background: 'rgba(255,255,255,0.06)' } : {}}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px',
        background: 'rgba(0,0,0,0)',
        borderBottom: last ? 'none' : '1px solid rgba(247,160,184,0.12)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
        {typeof label === 'string' ? (
          <div style={{
            fontFamily: F.ui, fontSize: 14,
            color: C.deepRose, marginBottom: desc ? 2 : 0,
          }}>
            {label}
          </div>
        ) : label}
        {desc && (
          <div style={{ fontFamily: F.ui, fontSize: 11, color: C.label }}>
            {desc}
          </div>
        )}
      </div>
      {right}
    </motion.div>
  );
}

function ConfirmModal({ title, body, onConfirm, onCancel, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(157,31,74,0.15)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.60)',
          borderRadius: 16, padding: '28px 24px',
          maxWidth: 360, width: '100%',
        }}
      >
        <div style={{
          fontFamily: F.heading, fontSize: 22,
          color: C.deepRose, textAlign: 'center', marginBottom: 10,
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: F.ui, fontSize: 13, lineHeight: 1.6,
          color: C.label, textAlign: 'center', marginBottom: 24,
        }}>
          {body}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: 11,
            background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(247,160,184,0.35)',
            borderRadius: 8, cursor: 'pointer',
            fontFamily: F.ui, fontSize: 12, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: C.label,
          }}>CANCEL</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: 11,
            background: accent, border: 'none',
            borderRadius: 8, cursor: 'pointer',
            fontFamily: F.ui, fontSize: 12, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#fff',
          }}>CHANGE</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FashionSettings() {
  const navigate = useNavigate();
  const { fashionCharacter, clearFashionCharacter } = useFashion();
  const { profile, updateUserProfile } = useUser();
  const { user } = useAuth();

  const accent = fashionCharacter?.colors?.primary || C.pink;
  const glow   = fashionCharacter?.colors?.glow    || 'rgba(247,160,184,0.35)';

  const [difficulty,    setDifficulty]    = useState('beginner');
  const [srEnabled,     setSrEnabled]     = useState(loadSRPref);
  const [name,          setName]          = useState('');
  const [nameSaving,    setNameSaving]    = useState(false);
  const [imgLoaded,     setImgLoaded]     = useState(false);
  const [showCharModal, setShowCharModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setDifficulty(profile.difficulty || 'beginner');
    }
  }, [profile]);

  const nameDirty = name !== (profile?.name || '');

  const handleDifficulty = async (id) => {
    setDifficulty(id);
    await updateUserProfile({ name, difficulty: id });
  };

  const handleSaveName = async () => {
    if (!nameDirty) return;
    setNameSaving(true);
    await updateUserProfile({ name, difficulty });
    setNameSaving(false);
  };

  const handleChangeStylist = () => {
    clearFashionCharacter();
    navigate('/fashion');
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '20px 16px 60px', maxWidth: 640, margin: '0 auto' }}
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: F.ui, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: accent, marginBottom: 4,
        }}>
          FASHION DOMAIN
        </div>
        <h1 style={{
          fontFamily: F.heading, fontWeight: 700,
          fontSize: 'clamp(28px, 5vw, 42px)',
          color: C.deepRose,
          margin: '0 0 4px', lineHeight: 1,
          textShadow: `0 0 24px ${glow}`,
        }}>
          The Dressing Room
        </h1>
        <p style={{ fontFamily: F.ui, fontSize: 13, color: C.label }}>
          Customize your runway experience
        </p>
      </motion.div>

      {/* Stylist */}
      <Section title="Stylist" accent={accent}>
        {fashionCharacter ? (
          <SettingRow
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: `radial-gradient(circle at 40% 35%, rgba(${rgb(accent)},0.30), rgba(${rgb(accent)},0.08) 70%, transparent)`,
                  border: `1.5px solid ${accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: `0 0 10px ${glow}`,
                }}>
                  {fashionCharacter.chibiImage ? (
                    <img
                      src={fashionCharacter.chibiImage}
                      alt={fashionCharacter.name}
                      onLoad={() => setImgLoaded(true)}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top',
                        opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s',
                        mixBlendMode: 'screen',
                      }}
                    />
                  ) : (
                    <Heart size={22} color={accent} strokeWidth={1.5} />
                  )}
                </div>
                <div>
                  <div style={{
                    fontFamily: F.heading, fontSize: 20, fontWeight: 700,
                    color: accent, lineHeight: 1,
                  }}>
                    {fashionCharacter.name}
                  </div>
                  <div style={{
                    fontFamily: F.ui, fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: C.label, marginTop: 2,
                  }}>
                    {fashionCharacter.archetype}
                  </div>
                </div>
              </div>
            }
            right={
              <motion.button
                whileHover={{ x: 2 }}
                onClick={() => setShowCharModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px', borderRadius: 6,
                  background: `rgba(${rgb(accent)},0.10)`,
                  border: `1px solid rgba(${rgb(accent)},0.35)`,
                  fontFamily: F.ui, fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: accent, cursor: 'pointer', flexShrink: 0,
                }}
              >
                CHANGE <ChevronRight size={12} />
              </motion.button>
            }
            last
          />
        ) : (
          <SettingRow
            label="No stylist selected"
            desc="Return to studio to choose your stylist"
            onClick={() => navigate('/fashion')}
            right={<ChevronRight size={16} color={C.label} />}
            last
          />
        )}
      </Section>

      {/* Difficulty */}
      <Section title="Difficulty" accent={accent}>
        {DIFFICULTIES.map((d, i) => {
          const isSelected = difficulty === d.id;
          return (
            <SettingRow
              key={d.id}
              last={i === DIFFICULTIES.length - 1}
              label={d.label}
              desc={d.desc}
              right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontFamily: F.ui, fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: isSelected ? accent : C.label,
                    padding: '2px 6px', borderRadius: 4,
                    background: isSelected ? `rgba(${rgb(accent)},0.12)` : 'transparent',
                    border: `1px solid ${isSelected ? `rgba(${rgb(accent)},0.35)` : 'transparent'}`,
                  }}>
                    {d.xp}
                  </span>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: `2px solid ${isSelected ? accent : 'rgba(247,160,184,0.3)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isSelected ? accent : 'transparent',
                    flexShrink: 0,
                  }}>
                    {isSelected && <Check size={10} color="#fff" strokeWidth={3} />}
                  </div>
                </div>
              }
              onClick={() => handleDifficulty(d.id)}
            />
          );
        })}
      </Section>

      {/* Learning */}
      <Section title="Learning" accent={accent}>
        <SettingRow
          last accent={accent}
          label="Spaced Repetition"
          desc="Smart suggestions for topics to review"
          right={
            <button onClick={() => { const v = !srEnabled; setSrEnabled(v); saveSRPref(v); }}
              role="switch" aria-checked={srEnabled}
              style={{ width: 42, height: 24, borderRadius: 99, cursor: 'pointer', position: 'relative',
                border: `1px solid ${srEnabled ? accent : 'rgba(157,31,74,0.25)'}`, background: srEnabled ? accent : 'rgba(157,31,74,0.08)' }}>
              <span style={{ position: 'absolute', top: 2, left: srEnabled ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
            </button>
          }
        />
      </Section>

      {/* Account */}
      <Section title="Account" accent={accent}>
        <div style={{ borderBottom: '1px solid rgba(247,160,184,0.12)', padding: '13px 16px' }}>
          <div style={{
            fontFamily: F.ui, fontSize: 9,
            letterSpacing: '1.5px', color: C.label,
            textTransform: 'uppercase', marginBottom: 6,
          }}>
            Display Name
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{
                flex: 1, padding: '8px 12px',
                fontFamily: F.ui, fontSize: 14,
                color: C.deepRose,
                background: 'rgba(255,255,255,0.55)',
                border: `1px solid ${nameDirty ? accent : 'rgba(247,160,184,0.3)'}`,
                borderRadius: 8, outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = accent; }}
              onBlur={e => { e.target.style.borderColor = nameDirty ? accent : 'rgba(247,160,184,0.3)'; }}
            />
            <AnimatePresence>
              {nameDirty && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSaveName}
                  disabled={nameSaving}
                  style={{
                    padding: '8px 14px', borderRadius: 8,
                    background: accent, border: 'none', cursor: 'pointer',
                    fontFamily: F.ui, fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#fff', flexShrink: 0,
                    opacity: nameSaving ? 0.7 : 1,
                  }}
                >
                  {nameSaving ? '...' : 'SAVE'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        <SettingRow label="Email" desc={user?.email || '—'} />
        <SettingRow label="Member since" desc={memberSince} last />
      </Section>

      {/* Confirm modal */}
      <AnimatePresence>
        {showCharModal && (
          <ConfirmModal
            title="Change Stylist?"
            body="You'll be taken to the stylist selection screen. Your progress, XP, and streak are not affected."
            accent={accent}
            onConfirm={handleChangeStylist}
            onCancel={() => setShowCharModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
