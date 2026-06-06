import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Flame, Snowflake, Leaf } from 'lucide-react';
import { gamingTheme, getElementColors } from '../../styles/gamingTheme';
import { useDomain } from '../../contexts/DomainContext';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { loadSRPref, saveSRPref } from '../../services/spacedRepetition';

const DIFFICULTIES = [
  { id: 'beginner',     label: 'Novice',  desc: 'Easier quests, more time',        xp: 'Standard XP' },
  { id: 'intermediate', label: 'Adept',   desc: 'Balanced challenge and reward',    xp: '+20% XP'     },
  { id: 'advanced',     label: 'Master',  desc: 'Harder quests, full rewards',      xp: '+50% XP'     },
];

const CHAR_ICON = { Fire: Flame, Frost: Snowflake, Nature: Leaf };

function rgb(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontFamily: gamingTheme.fontLabel, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(139,184,233,0.45)', marginBottom: 8, padding: '0 2px',
      }}>
        {title}
      </div>
      <div style={{
        background: 'rgba(30,42,69,0.55)',
        border: gamingTheme.borderThin,
        borderRadius: 10, overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, desc, right, onClick, last }) {
  return (
    <motion.div
      whileHover={onClick ? { background: 'rgba(255,255,255,0.02)' } : {}}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px',
        background: 'rgba(0,0,0,0)',
        borderBottom: last ? 'none' : '1px solid rgba(139,184,233,0.07)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
        {typeof label === 'string' ? (
          <div style={{
            fontFamily: gamingTheme.fontBody, fontSize: 14,
            color: gamingTheme.stellarWhite, marginBottom: desc ? 2 : 0,
          }}>
            {label}
          </div>
        ) : label}
        {desc && (
          <div style={{ fontFamily: gamingTheme.fontBody, fontSize: 11, color: gamingTheme.mutedBlue }}>
            {desc}
          </div>
        )}
      </div>
      {right}
    </motion.div>
  );
}

function ConfirmModal({ title, body, onConfirm, onCancel, C }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: gamingTheme.bgMid,
          border: gamingTheme.borderThin,
          borderRadius: 14, padding: '28px 24px',
          maxWidth: 360, width: '100%',
        }}
      >
        <div style={{
          fontFamily: gamingTheme.fontHeading, fontSize: 22, letterSpacing: '2px',
          color: gamingTheme.stellarWhite, textAlign: 'center', marginBottom: 10,
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: gamingTheme.fontBody, fontSize: 13, lineHeight: 1.6,
          color: gamingTheme.mutedBlue, textAlign: 'center', marginBottom: 24,
        }}>
          {body}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: 11,
            background: 'rgba(255,255,255,0.06)', border: gamingTheme.borderThin,
            borderRadius: 8, cursor: 'pointer',
            fontFamily: gamingTheme.fontLabel, fontSize: 12, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: gamingTheme.mutedBlue,
          }}>CANCEL</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: 11,
            background: C, border: 'none',
            borderRadius: 8, cursor: 'pointer',
            fontFamily: gamingTheme.fontLabel, fontSize: 12, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: gamingTheme.bgDark,
          }}>CHANGE</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GamingSettings() {
  const navigate = useNavigate();
  const { character, clearCharacter } = useDomain();
  const { profile, updateUserProfile } = useUser();
  const { user } = useAuth();
  const colors = getElementColors(character);
  const C = colors.primary;
  const CharIcon = CHAR_ICON[character?.element] || Flame;

  const [difficulty,   setDifficulty]   = useState('beginner');
  const [srEnabled,    setSrEnabled]    = useState(loadSRPref);
  const [name,         setName]         = useState('');
  const [nameSaving,   setNameSaving]   = useState(false);
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

  const handleChangeGuardian = () => {
    clearCharacter();
    navigate('/gaming');
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
          fontFamily: gamingTheme.fontLabel, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: C, marginBottom: 4,
        }}>
          GAMING DOMAIN
        </div>
        <h1 style={{
          fontFamily: gamingTheme.fontHeading,
          fontSize: 'clamp(28px, 5vw, 42px)',
          letterSpacing: '3px', color: gamingTheme.stellarWhite,
          margin: '0 0 4px', lineHeight: 1,
        }}>
          CONTROL PANEL
        </h1>
        <p style={{ fontFamily: gamingTheme.fontBody, fontSize: 13, color: gamingTheme.mutedBlue }}>
          Customize your quest experience
        </p>
      </motion.div>

      {/* Guardian */}
      <Section title="Guardian">
        {character ? (
          <SettingRow
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(${rgb(C)},0.2), ${gamingTheme.bgSecondary})`,
                  border: `1.5px solid ${C}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: `0 0 10px ${colors.glow}`,
                }}>
                  {character.chibiImage
                    ? <img src={character.chibiImage} alt={character.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; }} />
                    : <CharIcon size={22} color={C} />}
                </div>
                <div>
                  <div style={{
                    fontFamily: gamingTheme.fontHeading,
                    fontSize: 20, letterSpacing: '1.5px', color: C, lineHeight: 1,
                  }}>
                    {character.name}
                  </div>
                  <div style={{
                    fontFamily: gamingTheme.fontLabel, fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: gamingTheme.mutedBlue, marginTop: 2,
                  }}>
                    {character.element} Guardian
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
                  background: `rgba(${rgb(C)},0.12)`,
                  border: `1px solid rgba(${rgb(C)},0.35)`,
                  fontFamily: gamingTheme.fontLabel, fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: C, cursor: 'pointer', flexShrink: 0,
                }}
              >
                CHANGE <ChevronRight size={12} />
              </motion.button>
            }
            last
          />
        ) : (
          <SettingRow
            label="No guardian selected"
            desc="Return to base camp to choose your guardian"
            onClick={() => navigate('/gaming')}
            right={<ChevronRight size={16} color={gamingTheme.mutedBlue} />}
            last
          />
        )}
      </Section>

      {/* Difficulty */}
      <Section title="Difficulty">
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
                    fontFamily: gamingTheme.fontLabel, fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: isSelected ? C : gamingTheme.mutedBlue,
                    padding: '2px 6px', borderRadius: 4,
                    background: isSelected ? `rgba(${rgb(C)},0.12)` : 'transparent',
                    border: `1px solid ${isSelected ? `rgba(${rgb(C)},0.35)` : 'transparent'}`,
                  }}>
                    {d.xp}
                  </span>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: `2px solid ${isSelected ? C : 'rgba(139,184,233,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isSelected ? C : 'transparent',
                    flexShrink: 0,
                  }}>
                    {isSelected && <Check size={10} color={gamingTheme.bgDark} strokeWidth={3} />}
                  </div>
                </div>
              }
              onClick={() => handleDifficulty(d.id)}
            />
          );
        })}
      </Section>

      {/* Learning */}
      <Section title="Learning">
        <SettingRow
          last
          label="Spaced Repetition"
          desc="Smart suggestions for topics to review"
          right={
            <button onClick={() => { const v = !srEnabled; setSrEnabled(v); saveSRPref(v); }}
              role="switch" aria-checked={srEnabled}
              style={{ width: 42, height: 24, borderRadius: 99, cursor: 'pointer', position: 'relative',
                border: `1px solid ${srEnabled ? C : 'rgba(139,184,233,0.3)'}`, background: srEnabled ? C : 'rgba(255,255,255,0.08)' }}>
              <span style={{ position: 'absolute', top: 2, left: srEnabled ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: srEnabled ? gamingTheme.bgDark : '#fff', transition: 'left 0.2s' }} />
            </button>
          }
        />
      </Section>

      {/* Account */}
      <Section title="Account">
        <div style={{ borderBottom: '1px solid rgba(139,184,233,0.07)', padding: '13px 16px' }}>
          <div style={{
            fontFamily: gamingTheme.fontLabel, fontSize: 9,
            letterSpacing: '1.5px', color: gamingTheme.mutedBlue,
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
                fontFamily: gamingTheme.fontBody, fontSize: 14,
                color: gamingTheme.stellarWhite,
                background: 'rgba(47,58,95,0.7)',
                border: `1px solid ${nameDirty ? C : 'rgba(139,184,233,0.2)'}`,
                borderRadius: 8, outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = C; }}
              onBlur={e => { e.target.style.borderColor = nameDirty ? C : 'rgba(139,184,233,0.2)'; }}
            />
            <AnimatePresence>
              {nameDirty && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSaveName}
                  disabled={nameSaving}
                  style={{
                    padding: '8px 14px', borderRadius: 8,
                    background: C, border: 'none', cursor: 'pointer',
                    fontFamily: gamingTheme.fontLabel, fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: gamingTheme.bgDark, flexShrink: 0,
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
            title="CHANGE GUARDIAN?"
            body="You'll be taken to the guardian selection screen. Your progress, XP, and streak are not affected."
            C={C}
            onConfirm={handleChangeGuardian}
            onCancel={() => setShowCharModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
