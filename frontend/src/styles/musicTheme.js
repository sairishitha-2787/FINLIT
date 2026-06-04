// FINLIT Music Domain — Design Tokens
// Dark studio aesthetic. Deep, rich, intimate.

export const musicTheme = {
  // ── BACKGROUNDS ──────────────────────────────────────────────────────────────
  bgDark:      '#0d0b0c',
  bgSecondary: '#171215',
  bgCard:      'rgba(23,18,21,0.95)',

  // ── TEXT ─────────────────────────────────────────────────────────────────────
  textPrimary:   '#ffffff',
  textSecondary: 'rgba(255,255,255,0.70)',
  textMuted:     'rgba(255,255,255,0.40)',
  textDim:       'rgba(255,255,255,0.25)',

  // ── BORDERS ──────────────────────────────────────────────────────────────────
  borderThin:  '1px solid rgba(255,255,255,0.10)',
  borderFaint: '1px solid rgba(255,255,255,0.06)',
  borderCard:  '1px solid rgba(255,255,255,0.07)',

  // ── TYPOGRAPHY ───────────────────────────────────────────────────────────────
  fontHeading: "'Bebas Neue', cursive",
  fontSub:     "'Barlow Condensed', sans-serif",
  fontBody:    "'Inter', sans-serif",

  // ── EFFECTS ──────────────────────────────────────────────────────────────────
  cardShadow:     '0 4px 24px rgba(0,0,0,0.60)',
  cardShadowDeep: '0 8px 40px rgba(0,0,0,0.80)',
};

// ── CHARACTER → CLUSTER MAPPING ──────────────────────────────────────────────
export const CLUSTER_MAP = {
  jay:    'vinyl',
  cypher: 'neon',
  luna:   'dreamy',
};

// ── PER-CLUSTER THEME OVERRIDES ───────────────────────────────────────────────
// Spreads over musicTheme so only changed fields are listed here.
export const CLUSTER_THEMES = {
  vinyl: {
    bgDark:        '#130F0D',
    bgCard:        'rgba(19,15,13,0.97)',
    textPrimary:   '#C4C1B8',
    textSecondary: 'rgba(196,193,184,0.72)',
    textMuted:     'rgba(196,193,184,0.48)',
    textDim:       'rgba(196,193,184,0.28)',
    borderFaint:   '1px solid rgba(196,193,184,0.10)',
    borderThin:    '1px solid rgba(196,193,184,0.15)',
    fontHeading:   "'Bebas Neue', cursive",
    fontSub:       "'Barlow Condensed', sans-serif",
    fontBody:      "'Inter', sans-serif",
  },
  neon: {
    bgDark:        '#1D0225',
    bgCard:        'rgba(29,2,37,0.97)',
    textPrimary:   '#EAD9FF',
    textSecondary: 'rgba(234,217,255,0.72)',
    textMuted:     'rgba(234,217,255,0.42)',
    textDim:       'rgba(234,217,255,0.25)',
    borderFaint:   '1px solid rgba(194,49,201,0.18)',
    borderThin:    '1px solid rgba(194,49,201,0.28)',
    fontHeading:   "'Orbitron', sans-serif",
    fontSub:       "'Barlow Condensed', sans-serif",
    fontBody:      "'Space Mono', monospace",
  },
  dreamy: {
    bgDark:        '#2C1F1B',
    bgCard:        'rgba(44,31,27,0.97)',
    textPrimary:   '#F3E6E9',
    textSecondary: 'rgba(243,230,233,0.72)',
    textMuted:     'rgba(243,230,233,0.48)',
    textDim:       'rgba(243,230,233,0.28)',
    borderFaint:   '1px solid rgba(215,152,163,0.14)',
    borderThin:    '1px solid rgba(215,152,163,0.22)',
    fontHeading:   "'Cormorant Garamond', serif",
    fontSub:       "'DM Sans', sans-serif",
    fontBody:      "'DM Sans', sans-serif",
  },
};

// Returns a merged theme: musicTheme base + cluster overrides
export const getClusterTheme = (characterId) => ({
  ...musicTheme,
  ...(CLUSTER_THEMES[CLUSTER_MAP[characterId]] || {}),
});

// ── TIER SYSTEM ───────────────────────────────────────────────────────────────
export const getMusicTier     = (level) => Math.max(1, 11 - Math.min(level, 10));
export const getMusicTierName = (tier) => {
  const names = {
    1: 'Platinum', 2: 'Gold',      3: 'Silver',    4: 'Bronze',
    5: 'Indie',    6: 'Studio',    7: 'Rehearsal', 8: 'Busker',
    9: 'Amateur', 10: 'Listener',
  };
  return names[tier] || 'Listener';
};
