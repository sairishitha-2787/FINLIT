import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Shield, ChevronRight, Check, AlertTriangle,
  Zap, Target, Trophy,
} from 'lucide-react';
import { useSports, SPORTS_CHARACTERS } from '../../contexts/SportsContext';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { sportsTheme } from '../../styles/sportsTheme';

const LS_DIFFICULTY = 'finlit_sports_difficulty';

const CHAR_ICON = { lyra: Zap, kael: Target, ian: Trophy };

const DIFFICULTIES = [
  { id: 'beginner',     label: 'Beginner',     desc: 'Easier questions, more time',   xp: 'Standard XP'  },
  { id: 'intermediate', label: 'Intermediate', desc: 'Balanced challenge and reward',  xp: '+20% XP'      },
  { id: 'advanced',     label: 'Advanced',     desc: 'Harder questions, less time',    xp: '+50% XP'      },
];

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: sportsTheme.fontSub, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)', marginBottom: 8, padding: '0 2px',
      }}>
        {Icon && <Icon size={11} strokeWidth={2} />}
        {title}
      </div>
      <div style={{
        background: 'rgba(22,22,22,0.95)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Setting row ───────────────────────────────────────────────────────────────
function SettingRow({ label, desc, right, onClick, danger, last }) {
  return (
    <motion.div
      whileHover={onClick ? { background: 'rgba(255,255,255,0.02)' } : {}}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px',
        background: 'rgba(0,0,0,0)',
        borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14, color: danger ? '#f87171' : '#fff',
          marginBottom: desc ? 2 : 0,
        }}>
          {label}
        </div>
        {desc && (
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11, color: 'rgba(255,255,255,0.35)',
          }}>
            {desc}
          </div>
        )}
      </div>
      {right}
    </motion.div>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ title, body, confirmLabel, onConfirm, onCancel, danger }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(22,22,22,0.98)',
          border: danger ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: '28px 24px',
          maxWidth: 360, width: '100%',
        }}
      >
        {danger && (
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(248,113,113,0.12)',
            border: '1px solid rgba(248,113,113,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <AlertTriangle size={20} color="#f87171" />
          </div>
        )}
        <div style={{
          fontFamily: sportsTheme.fontHeading,
          fontSize: 22, letterSpacing: '1.5px',
          color: '#fff', textAlign: 'center', marginBottom: 10,
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 24,
        }}>
          {body}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '11px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, cursor: 'pointer',
              fontFamily: sportsTheme.fontSub, fontSize: 12, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '11px',
              background: danger ? '#f87171' : '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              fontFamily: sportsTheme.fontSub, fontSize: 12, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#000',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SportsSettings() {
  const navigate = useNavigate();
  const { sportsColor: C, sportsCharacter } = useOutletContext();
  const { character, clearCharacter } = useSports();
  const { user } = useAuth();
  const { profile, updateUserProfile } = useUser();

  const CharIcon = CHAR_ICON[character?.id] || Zap;

  // Difficulty
  const [difficulty, setDifficulty] = useState(
    () => localStorage.getItem(LS_DIFFICULTY) || 'beginner'
  );

  // Name editing
  const [name,       setName]       = useState('');
  const [nameSaving, setNameSaving] = useState(false);

  React.useEffect(() => {
    if (profile) setName(profile.name || '');
  }, [profile]);

  const nameDirty = name !== (profile?.name || '');

  const handleSaveName = async () => {
    if (!nameDirty) return;
    setNameSaving(true);
    await updateUserProfile({ name, difficulty });
    setNameSaving(false);
  };

  // Modals
  const [showCharModal, setShowCharModal] = useState(false);

  const handleDifficulty = (id) => {
    setDifficulty(id);
    localStorage.setItem(LS_DIFFICULTY, id);
  };

  const handleChangeCharacter = () => {
    clearCharacter();
    // SportsLayout will automatically show character selection when character === null
    navigate('/sports');
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
      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{
          fontFamily: sportsTheme.fontSub, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: C, marginBottom: 4,
        }}>
          SPORTS DOMAIN
        </div>
        <h1 style={{
          fontFamily: sportsTheme.fontHeading,
          fontSize: 'clamp(28px, 5vw, 42px)',
          letterSpacing: '3px', color: '#fff',
          margin: '0 0 4px', lineHeight: 1,
        }}>
          THE LOCKER ROOM
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13, color: 'rgba(255,255,255,0.4)',
        }}>
          Customize your match experience
        </p>
      </motion.div>

      {/* ── CHARACTER ── */}
      <Section title="Archetype" icon={User}>
        {character ? (
          <SettingRow
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: character.dim,
                  border: `1.5px solid ${C}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: `0 0 10px ${character.glow}`,
                }}>
                  {character.chibiImage
                    ? <img src={character.chibiImage} alt={character.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                        onError={e => { e.target.style.display = 'none'; }} />
                    : <CharIcon size={22} color={C} />}
                </div>
                <div>
                  <div style={{
                    fontFamily: sportsTheme.fontHeading,
                    fontSize: 20, letterSpacing: '1.5px', color: C,
                    lineHeight: 1,
                  }}>
                    {character.name}
                  </div>
                  <div style={{
                    fontFamily: sportsTheme.fontSub, fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)', marginTop: 2,
                  }}>
                    {character.title}
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
                  background: `${C}15`,
                  border: `1px solid ${C}40`,
                  fontFamily: sportsTheme.fontSub, fontSize: 10, fontWeight: 700,
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
            label="No archetype selected"
            desc="Choose your character to begin"
            onClick={() => navigate('/sports')}
            right={<ChevronRight size={16} color="rgba(255,255,255,0.3)" />}
            last
          />
        )}
      </Section>

      {/* ── DIFFICULTY ── */}
      <Section title="Difficulty" icon={Shield}>
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
                    fontFamily: sportsTheme.fontSub, fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: isSelected ? C : 'rgba(255,255,255,0.25)',
                    padding: '2px 6px', borderRadius: 4,
                    background: isSelected ? `${C}15` : 'transparent',
                    border: `1px solid ${isSelected ? C + '40' : 'transparent'}`,
                  }}>
                    {d.xp}
                  </span>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: `2px solid ${isSelected ? C : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isSelected ? C : 'transparent',
                    flexShrink: 0,
                  }}>
                    {isSelected && <Check size={10} color="#000" strokeWidth={3} />}
                  </div>
                </div>
              }
              onClick={() => handleDifficulty(d.id)}
            />
          );
        })}
      </Section>

      {/* ── ACCOUNT ── */}
      <Section title="Account" icon={User}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '13px 16px' }}>
          <div style={{
            fontFamily: sportsTheme.fontSub, fontSize: 9, fontWeight: 700,
            letterSpacing: '1.5px', color: 'rgba(255,255,255,0.35)',
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
                fontFamily: "'Inter', sans-serif", fontSize: 14,
                color: '#fff',
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${nameDirty ? C : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 8, outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = C; }}
              onBlur={e => { e.target.style.borderColor = nameDirty ? C : 'rgba(255,255,255,0.12)'; }}
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
                    fontFamily: sportsTheme.fontSub, fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#000', flexShrink: 0,
                    opacity: nameSaving ? 0.7 : 1,
                  }}
                >
                  {nameSaving ? '...' : 'SAVE'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        <SettingRow
          label="Email"
          desc={user?.email || '—'}
        />
        <SettingRow
          label="Member since"
          desc={memberSince}
          last
        />
      </Section>

      {/* ── Change character confirm ── */}
      <AnimatePresence>
        {showCharModal && (
          <ConfirmModal
            title="CHANGE ARCHETYPE?"
            body="You'll be taken to the character selection screen. Your progress, XP, and streak are not affected."
            confirmLabel="CHANGE"
            onConfirm={handleChangeCharacter}
            onCancel={() => setShowCharModal(false)}
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
}
