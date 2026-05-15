export const gamingTheme = {
  // ── BACKGROUNDS ─────────────────────────────────────────────────────────────
  bgDark:      '#1E2A45',       // deepest navy
  bgMid:       '#2F3A5F',       // nav / sidebar
  bgSecondary: '#3D4E7A',       // card surface
  cardBg:      'rgba(61,78,122,0.40)',

  // ── ACCENT PALETTE ───────────────────────────────────────────────────────────
  mint:         '#9FE0D3',      // primary interactive
  seafoam:      '#CFF3E8',      // secondary text / chips
  stellarWhite: '#F0FFFA',      // headings / primary text
  mutedBlue:    '#8BB8E9',      // borders, muted labels

  // ── CHARACTER ELEMENT COLORS ─────────────────────────────────────────────────
  fire:   { primary: '#FF6B6B', secondary: '#FF8E53', glow: 'rgba(255,107,107,0.30)' },
  frost:  { primary: '#4ECDC4', secondary: '#45B7D1', glow: 'rgba(78,205,196,0.30)'  },
  nature: { primary: '#95E1D3', secondary: '#38B2AC', glow: 'rgba(149,225,211,0.30)' },

  // ── TYPOGRAPHY ───────────────────────────────────────────────────────────────
  fontHeading: '"Orbitron", sans-serif',
  fontBody:    '"Jura", sans-serif',
  fontLabel:   '"Michroma", sans-serif',

  // ── EFFECTS ──────────────────────────────────────────────────────────────────
  glowSoft:   '0 0 12px rgba(159,224,211,0.25)',
  glowMedium: '0 0 28px rgba(159,224,211,0.50)',
  shadowCard: '0 8px 32px rgba(0,0,0,0.35)',
  shadowDeep: '0 16px 48px rgba(0,0,0,0.50)',

  // ── GLASSMORPHISM ────────────────────────────────────────────────────────────
  glassBlur:   '16px',
  glassBorder: 'rgba(139,184,233,0.25)',

  // ── BORDER UTILITIES ─────────────────────────────────────────────────────────
  borderThin:   '1px solid rgba(139,184,233,0.30)',
  borderAccent: '1.5px solid rgba(159,224,211,0.80)',
};

// Helper: get element colors from character
export const getElementColors = (character) => {
  if (!character?.element) return gamingTheme.fire;
  return gamingTheme[character.element.toLowerCase()] || gamingTheme.fire;
};
