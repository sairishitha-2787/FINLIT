import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenLine, Film, Gamepad2, Music, Shirt, Code2,
  Briefcase, UtensilsCrossed, GraduationCap, Palette, Activity, Check,
} from 'lucide-react';
import { getInterests } from '../../services/api';

const INTEREST_ICON_MAP = {
  PenLine, Film, Gamepad2, Music, Shirt, Code2,
  Briefcase, UtensilsCrossed, GraduationCap, Palette, Activity,
};

const Loader = () => (
  <div className="flex items-center justify-center py-12 gap-2">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        style={{ width: 10, height: 10, borderRadius: '50%', background: '#3A8DFF' }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
      />
    ))}
  </div>
);

const InterestSelector = ({ selectedInterest, onSelect }) => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await getInterests();
        if (r.success) setInterests(r.interests);
      } catch { setError('Failed to load interests'); }
      finally  { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader />;
  if (error)   return <p className="text-center py-8 text-sm" style={{ color: '#ef4444' }}>{error}</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {interests.map((interest, index) => {
        const isSelected = selectedInterest === interest.id;
        const I = INTEREST_ICON_MAP[interest.icon];

        return (
          <motion.div
            key={interest.id}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 220, damping: 22 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(interest.id)}
            style={{
              position: 'relative',
              padding: '16px',
              borderRadius: '16px',
              cursor: 'pointer',
              overflow: 'hidden',
              border: isSelected ? '1.5px solid #3A8DFF' : '1px solid rgba(203,213,225,0.6)',
              background: isSelected ? 'rgba(58,141,255,0.08)' : 'rgba(255,255,255,0.55)',
              boxShadow: isSelected ? '0 4px 16px rgba(58,141,255,0.18)' : 'none',
              transition: 'all 0.25s ease',
            }}
          >
            <div className="text-center">
              {I && (
                <motion.div
                  className="flex justify-center mb-2.5"
                  animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <I size={32} strokeWidth={1.8} style={{ color: isSelected ? '#3A8DFF' : '#64748b' }} />
                </motion.div>
              )}
              <h3 className="font-bold text-sm mb-0.5" style={{ color: isSelected ? '#1e3a8a' : '#374151' }}>
                {interest.name}
              </h3>
              <p className="text-xs leading-tight line-clamp-2" style={{ color: isSelected ? '#3A8DFF' : '#94a3b8' }}>
                {interest.description}
              </p>
            </div>

            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 20, height: 20, borderRadius: '50%',
                    background: '#3A8DFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Check size={10} strokeWidth={3} style={{ color: '#fff' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default InterestSelector;
