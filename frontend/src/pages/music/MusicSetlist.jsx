import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { musicTheme } from '../../styles/musicTheme';

export default function MusicSetlist() {
  const { musicColor: C } = useOutletContext();
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22 }}
      style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center' }}
    >
      <BookOpen size={48} color={C} strokeWidth={1} />
      <div style={{ fontFamily: musicTheme.fontHeading, fontSize: 36, letterSpacing: 3, color: musicTheme.textPrimary }}>THE SETLIST</div>
      <div style={{ fontFamily: musicTheme.fontSub, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C }}>
        Coming Soon
      </div>
      <p style={{ fontFamily: musicTheme.fontBody, fontSize: 14, color: musicTheme.textMuted, maxWidth: 360 }}>
        Browse all financial lessons, unlock new tracks, and track your learning journey.
      </p>
    </motion.div>
  );
}
