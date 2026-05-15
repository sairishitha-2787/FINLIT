import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, BarChart2, Trophy, X, Settings } from 'lucide-react';
import { sportsTheme } from '../../styles/sportsTheme';

const NAV_ITEMS = [
  { path: '/sports',            Icon: Home,      label: 'The Dugout'    },
  { path: '/sports/playbook',   Icon: BookOpen,  label: 'The Playbook'  },
  { path: '/sports/progress',   Icon: BarChart2, label: 'The Scoreboard'},
  { path: '/sports/achievements', Icon: Trophy,  label: 'Trophy Case'   },
];

const W = 220;

export default function SportsSidebar({ character, isMobile, isOpen, onClose, onOpenSettings }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const C = character?.color || '#E8457A';

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const sidebar = (
    <motion.div
      key="sports-sidebar"
      initial={isMobile ? { x: -W - 20 } : false}
      animate={{ x: 0 }}
      exit={{ x: -W - 20 }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      style={{
        width: `${W}px`, flexShrink: 0,
        height: '100%',
        background: 'rgba(13,13,13,0.98)',
        borderRight: sportsTheme.borderFaint,
        display: 'flex', flexDirection: 'column',
        position: isMobile ? 'fixed' : 'relative',
        top: 0, left: 0, bottom: 0,
        zIndex: isMobile ? 500 : 'auto',
      }}
    >
      {/* Sidebar top */}
      <div style={{
        padding: '18px 16px 14px',
        borderBottom: sportsTheme.borderFaint,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontFamily: sportsTheme.fontHeading,
            fontSize: '20px', color: C, letterSpacing: '1.5px',
          }}>
            FINLIT
          </div>
          {character && (
            <div style={{
              fontFamily: sportsTheme.fontSub,
              fontSize: '9px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)', marginTop: '1px',
            }}>
              {character.name} · Active
            </div>
          )}
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <X size={18} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ path, Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <motion.button
              key={path}
              whileHover={{ x: isActive ? 0 : 3 }}
              onClick={() => handleNav(path)}
              style={{
                width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '6px',
                marginBottom: '2px',
                background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderLeft: `3px solid ${isActive ? C : 'transparent'}`,
                border: `0`,
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                // Override border-left from above
                boxShadow: isActive ? `inset 3px 0 0 ${C}` : 'none',
              }}
            >
              <Icon
                size={16}
                strokeWidth={isActive ? 2.2 : 1.8}
                color={isActive ? C : 'rgba(255,255,255,0.35)'}
              />
              <span style={{
                fontFamily: sportsTheme.fontSub,
                fontSize: '13px', fontWeight: 700,
                letterSpacing: '0.05em', textTransform: 'uppercase',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
              }}>
                {label}
              </span>
              {isActive && (
                <div style={{
                  marginLeft: 'auto',
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: C,
                  boxShadow: `0 0 5px ${character?.glow || 'rgba(232,69,122,0.5)'}`,
                }} />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom: character info + settings */}
      <div style={{
        padding: '12px',
        borderTop: sportsTheme.borderFaint,
      }}>
        {character && (
          <div style={{
            background: character.dim,
            borderLeft: `3px solid ${C}`,
            borderRadius: '6px',
            padding: '10px 12px',
            marginBottom: '8px',
          }}>
            <div style={{
              fontFamily: sportsTheme.fontSub,
              fontSize: '9px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C, marginBottom: '2px',
            }}>
              {character.role}
            </div>
            <div style={{
              fontFamily: sportsTheme.fontHeading,
              fontSize: '17px', letterSpacing: '1px',
              color: '#fff',
            }}>
              {character.name}
            </div>
          </div>
        )}
        <button
          onClick={onOpenSettings}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 12px', borderRadius: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          <Settings size={14} strokeWidth={1.8} />
          <span style={{
            fontFamily: sportsTheme.fontSub,
            fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            The Locker Room
          </span>
        </button>
      </div>
    </motion.div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(2px)',
                zIndex: 499,
              }}
            />
            {sidebar}
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && sidebar}
    </AnimatePresence>
  );
}
