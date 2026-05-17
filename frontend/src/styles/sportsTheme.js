// FINLIT Sports Domain — Design Tokens
// Broadcast overlay aesthetic. Dark, urgent, kinetic.

export const sportsTheme = {
  // ── BACKGROUNDS ──────────────────────────────────────────────────────────────
  bgDark:      '#0f0f0f',                   // near-black base
  bgSecondary: '#1a1a1a',                   // secondary surfaces
  bgCard:      'rgba(26,26,26,0.95)',        // broadcast panel cards

  // ── TEXT ─────────────────────────────────────────────────────────────────────
  textPrimary:   '#ffffff',
  textSecondary: 'rgba(255,255,255,0.70)',
  textMuted:     'rgba(255,255,255,0.40)',
  textDim:       'rgba(255,255,255,0.25)',

  // ── BORDERS ──────────────────────────────────────────────────────────────────
  borderThin:    '1px solid rgba(255,255,255,0.10)',
  borderFaint:   '1px solid rgba(255,255,255,0.06)',
  borderCard:    '1px solid rgba(255,255,255,0.07)',

  // ── TYPOGRAPHY ───────────────────────────────────────────────────────────────
  fontHeading: "'Bebas Neue', cursive",
  fontSub:     "'Barlow Condensed', sans-serif",
  fontBody:    "'Inter', sans-serif",

  // ── EFFECTS ──────────────────────────────────────────────────────────────────
  cardShadow:     '0 4px 24px rgba(0,0,0,0.60)',
  cardShadowDeep: '0 8px 40px rgba(0,0,0,0.80)',
  backdropBlur:   'blur(12px)',
};

// ── CHARACTER COLOR SIGNATURES ───────────────────────────────────────────────
export const CHARACTER_COLORS = {
  lyra: {
    primary: '#E8457A',
    glow:    'rgba(232,69,122,0.50)',
    dim:     'rgba(232,69,122,0.12)',
    border:  'rgba(232,69,122,0.30)',
  },
  kael: {
    primary: '#0F3BBC',
    glow:    'rgba(15,59,188,0.50)',
    dim:     'rgba(15,59,188,0.12)',
    border:  'rgba(15,59,188,0.30)',
  },
  ian: {
    primary: '#F5C842',
    glow:    'rgba(245,200,66,0.50)',
    dim:     'rgba(245,200,66,0.12)',
    border:  'rgba(245,200,66,0.30)',
  },
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
export const getCharacterColors = (character) =>
  CHARACTER_COLORS[character?.id] || CHARACTER_COLORS.lyra;

export const getDivision = (level) => Math.max(1, 11 - Math.min(level, 10));

export const getDivisionName = (division) => {
  const names = {
    1: 'Premier',  2: 'Championship', 3: 'League One', 4: 'League Two',
    5: 'National', 6: 'Regional',     7: 'County A',   8: 'County B',
    9: 'County C', 10: 'Amateur',
  };
  return names[division] || 'Amateur';
};
