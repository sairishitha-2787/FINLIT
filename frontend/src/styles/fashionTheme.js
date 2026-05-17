// ─────────────────────────────────────────────────────────────────────────────
// Fashion Theme  —  "Bubblegum Glam"
// Soft, premium, candy-like. Light cream base with pink/purple glassmorphism.
// ─────────────────────────────────────────────────────────────────────────────
import { ShoppingBag, Scissors, Crown } from 'lucide-react';

// ── COLORS ───────────────────────────────────────────────────────────────────
export const fashionColors = {
  background:   '#faf5ec',
  primaryPink:  '#f7a0b8',
  brightAccent: '#fbb6c4',
  softPeach:    '#fae9d7',
  deepRose:     '#9d1f4a',
  midRose:      '#d4537e',
  bodyText:     '#b0627a',
  label:        '#c98a9e',
  iridPurple:   '#c084fc',
  warmGold:     '#fde68a',
  success:      '#7ec9a0',
  warning:      '#f0c060',
  error:        '#e87070',
  info:         '#93b5cf',
};

// ── CHARACTER ARCHETYPES ──────────────────────────────────────────────────────
export const fashionArchetypes = {
  trendsetter: {
    name:      'Trendsetter',
    subtitle:  'Bold & Daring',
    primary:   '#e85d75',
    secondary: '#ff8fa3',
    accent:    '#fde68a',
    glow:      'rgba(232,93,117,0.35)',
    gradient:  'linear-gradient(135deg, #e85d75, #ff8fa3, #fde68a)',
  },
  classic: {
    name:      'Classic',
    subtitle:  'Timeless Elegance',
    primary:   '#c084fc',
    secondary: '#d8b4fe',
    accent:    '#fae9d7',
    glow:      'rgba(192,132,252,0.35)',
    gradient:  'linear-gradient(135deg, #c084fc, #d8b4fe, #fae9d7)',
  },
  avantGarde: {
    name:      'Avant-Garde',
    subtitle:  'Fearlessly Forward',
    primary:   '#f7a0b8',
    secondary: '#fbb6c4',
    accent:    '#c084fc',
    glow:      'rgba(247,160,184,0.35)',
    gradient:  'linear-gradient(135deg, #f7a0b8, #fbb6c4, #c084fc)',
  },
};

// ── RUNWAY MAP ZONES ──────────────────────────────────────────────────────────
export const fashionZones = {
  boutique: {
    name:       'The Boutique',
    subtitle:   'foundation',
    background: '#fae9d7',
    accent:     '#f7a0b8',
    icon:       ShoppingBag,
  },
  atelier: {
    name:       'The Atelier',
    subtitle:   'collection',
    background: '#fbb6c4',
    accent:     '#c084fc',
    icon:       Scissors,
  },
  runway: {
    name:       'The Runway',
    subtitle:   'haute couture',
    background: '#c084fc',
    accent:     '#9d1f4a',
    icon:       Crown,
  },
};

// ── TYPOGRAPHY ────────────────────────────────────────────────────────────────
export const fashionTypography = {
  googleFontsUrl:
    'https://fonts.googleapis.com/css2?family=Petit+Formal+Script&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Sacramento&family=DM+Sans:wght@300;400;500;600;700&display=swap',

  families: {
    logo:      "'Petit Formal Script', cursive",
    heading:   "'Playfair Display', serif",
    italicSub: "'Sacramento', cursive",
    body:      "'DM Sans', sans-serif",
  },

  // Card content hierarchy:
  // 1. sectionLabel  — smallest, most muted, wide letter-spacing
  // 2. h1/h2/h3      — dominant, Playfair, tight tracking
  // 3. italicSub     — Sacramento, airy
  // 4. body          — standard weight, least visual noise
  styles: {
    h1: {
      fontFamily:    "'Playfair Display', serif",
      fontWeight:    600,
      fontSize:      '28px',
      letterSpacing: '-0.02em',
      lineHeight:    1.15,
      color:         '#9d1f4a',
    },
    h2: {
      fontFamily:    "'Playfair Display', serif",
      fontWeight:    600,
      fontSize:      '24px',
      letterSpacing: '-0.02em',
      lineHeight:    1.15,
      color:         '#9d1f4a',
    },
    h3: {
      fontFamily:    "'Playfair Display', serif",
      fontWeight:    500,
      fontSize:      '20px',
      letterSpacing: '-0.01em',
      lineHeight:    1.15,
      color:         '#9d1f4a',
    },
    italicSub: {
      fontFamily: "'Sacramento', cursive",
      fontWeight: 400,
      fontSize:   '20px',
      lineHeight: 1.4,
      color:      '#d4537e',
    },
    sectionLabel: {
      fontFamily:    "'DM Sans', sans-serif",
      fontWeight:    500,
      fontSize:      '10px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color:         '#c98a9e',
    },
    body: {
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 400,
      fontSize:   '13px',
      lineHeight: 1.7,
      color:      '#b0627a',
    },
    bodyLarge: {
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 400,
      fontSize:   '15px',
      lineHeight: 1.7,
      color:      '#b0627a',
    },
    stat: {
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 600,
      fontSize:   '18px',
      color:      '#9d1f4a',
    },
    logo: {
      fontFamily: "'Petit Formal Script', cursive",
      fontWeight: 400,
      fontSize:   '22px',
      color:      '#9d1f4a',
    },
  },
};

// ── GLASSMORPHISM ─────────────────────────────────────────────────────────────
export const fashionGlass = {
  card: {
    background:          'rgba(255,255,255,0.20)',
    backdropFilter:      'blur(24px) saturate(200%)',
    WebkitBackdropFilter:'blur(24px) saturate(200%)',
    borderTop:           '1.5px solid rgba(255,255,255,0.60)',
    borderLeft:          '1.5px solid rgba(255,255,255,0.60)',
    borderBottom:        '1.5px solid rgba(247,160,184,0.30)',
    borderRight:         '1.5px solid rgba(247,160,184,0.30)',
    borderRadius:        '28px',
    boxShadow:           '0 16px 48px rgba(247,160,184,0.25), 0 6px 20px rgba(192,132,252,0.15)',
  },
  // Pseudo-element rim lights (apply via ::before / ::after)
  rimTopEdge:  'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
  rimLeftEdge: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.45), transparent)',

  pill: {
    background:          'rgba(255,255,255,0.32)',
    backdropFilter:      'blur(12px)',
    WebkitBackdropFilter:'blur(12px)',
    border:              '1px solid rgba(255,255,255,1)',
    borderRadius:        '99px',
  },
  modal: {
    background:          'rgba(255,255,255,0.30)',
    backdropFilter:      'blur(32px) saturate(220%)',
    WebkitBackdropFilter:'blur(32px) saturate(220%)',
    borderTop:           '1.5px solid rgba(255,255,255,0.75)',
    borderLeft:          '1.5px solid rgba(255,255,255,0.75)',
    borderBottom:        '1.5px solid rgba(247,160,184,0.40)',
    borderRight:         '1.5px solid rgba(247,160,184,0.40)',
    borderRadius:        '28px',
    boxShadow:           '0 24px 64px rgba(247,160,184,0.35), 0 8px 32px rgba(192,132,252,0.20)',
  },
  sidebar: {
    background:          'rgba(255,255,255,0.15)',
    backdropFilter:      'blur(20px) saturate(180%)',
    WebkitBackdropFilter:'blur(20px) saturate(180%)',
    borderRight:         '1.5px solid rgba(255,255,255,0.50)',
  },
};

// ── BACKGROUND ────────────────────────────────────────────────────────────────
export const fashionBackground = {
  base: '#faf5ec',
  blobs: [
    // Dominant — top-right
    {
      size:     380,
      position: { top: '-60px', right: '-80px' },
      radial:   'radial-gradient(circle 380px at 100% 0%, rgba(247,160,184,0.50), transparent 70%)',
    },
    // Medium — bottom-left
    {
      size:     240,
      position: { bottom: '-40px', left: '-60px' },
      radial:   'radial-gradient(circle 240px at 0% 100%, rgba(192,132,252,0.40), transparent 70%)',
    },
    // Small accent — center-right
    {
      size:     100,
      position: { top: '45%', right: '20%' },
      radial:   'radial-gradient(circle 100px at 80% 50%, rgba(251,182,196,0.55), transparent 70%)',
    },
  ],
};

export const getBackgroundStyle = () => ({
  backgroundColor: fashionBackground.base,
  backgroundImage: fashionBackground.blobs.map((b) => b.radial).join(', '),
});

// ── BUTTONS ───────────────────────────────────────────────────────────────────
export const fashionButtons = {
  primary: {
    background:   'linear-gradient(135deg, #f7a0b8, #c084fc, #fbb6c4)',
    color:        '#fff',
    borderRadius: '16px',
    boxShadow:    '0 6px 20px rgba(192,132,252,0.35)',
    fontFamily:   "'DM Sans', sans-serif",
    fontWeight:   600,
    border:       'none',
    position:     'relative',
    overflow:     'hidden',
  },
  primaryHover: {
    transform:  'translateY(-1px)',
    boxShadow:  '0 10px 28px rgba(192,132,252,0.45)',
  },
  primaryActive: {
    transform:  'scale(0.97)',
  },
  secondary: {
    background:          'rgba(255,255,255,0.25)',
    backdropFilter:      'blur(12px)',
    WebkitBackdropFilter:'blur(12px)',
    color:               '#9d1f4a',
    border:              '1.5px solid rgba(247,160,184,0.60)',
    borderRadius:        '16px',
    fontFamily:          "'DM Sans', sans-serif",
    fontWeight:          500,
  },
  icon: {
    background:          'rgba(255,255,255,0.25)',
    backdropFilter:      'blur(12px)',
    WebkitBackdropFilter:'blur(12px)',
    width:               '44px',
    height:              '44px',
    borderRadius:        '50%',
    color:               '#9d1f4a',
    border:              '1px solid rgba(255,255,255,0.55)',
    display:             'flex',
    alignItems:          'center',
    justifyContent:      'center',
  },
  pill: {
    background:          'rgba(255,255,255,0.32)',
    backdropFilter:      'blur(12px)',
    WebkitBackdropFilter:'blur(12px)',
    borderRadius:        '99px',
    border:              '1px solid rgba(255,255,255,0.60)',
    fontFamily:          "'DM Sans', sans-serif",
    fontWeight:          500,
    fontSize:            '12px',
    color:               '#9d1f4a',
  },
};

// ::before pseudo-element — inner top-edge rim highlight for primary button
export const buttonRimHighlight = {
  content:      '""',
  position:     'absolute',
  top:          0,
  left:         0,
  right:        0,
  height:       '1px',
  background:   'linear-gradient(90deg, transparent, rgba(255,255,255,0.70), transparent)',
  borderRadius: '16px 16px 0 0',
  pointerEvents:'none',
};

// ── XP / STYLE POINTS BAR ─────────────────────────────────────────────────────
export const fashionXpBar = {
  track: {
    background:          'rgba(255,255,255,0.25)',
    backdropFilter:      'blur(8px)',
    WebkitBackdropFilter:'blur(8px)',
    borderRadius:        '99px',
    height:              '12px',
    border:              '1px solid rgba(255,255,255,0.55)',
  },
  fill: {
    background:   'linear-gradient(135deg, #f7a0b8, #c084fc, #fbb6c4)',
    borderRadius: '99px',
    boxShadow:    '0 0 12px rgba(247,160,184,0.55)',
    height:       '100%',
  },
  label: {
    fontFamily:    "'DM Sans', sans-serif",
    fontWeight:    600,
    fontSize:      '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color:         '#d4537e',
  },
  fillAnimation: {
    type:               'spring',
    stiffness:          180,
    damping:            18,
    overshootClamping:  false,
  },
};

// ── DECORATIVE 3D GLOSSY ACCENTS ──────────────────────────────────────────────
export const fashionAccents = {
  // Apply sharedStyle to every accent wrapper div
  sharedStyle: {
    position:      'absolute',
    pointerEvents: 'none',
    zIndex:        0,
    filter:        'blur(1px)',
  },

  // SVG radialGradient colour stops (white core → champagne → lavender → pink → deep rose)
  iridescentStops: [
    { offset: '0%',   color: '#ffffff' },
    { offset: '25%',  color: '#fde68a' },
    { offset: '50%',  color: '#d8b4fe' },
    { offset: '75%',  color: '#f7a0b8' },
    { offset: '100%', color: '#9d1f4a' },
  ],
  silverRim:           'rgba(255,255,255,0.80)',
  silverRimWidth:      '1.5px',
  specularHighlight:   'rgba(255,255,255,0.55)',

  // SVG path data for each fashion object
  objects: {
    handbag: {
      viewBox: '0 0 80 80',
      size: 80,
      paths: {
        handle: { d: 'M28 28 Q40 16 52 28', fill: 'none' },
        body:   { d: 'M20 28 Q18 52 20 60 Q40 68 60 60 Q62 52 60 28 Z' },
        clasp:  { d: 'M36 44 h8 v4 h-8 z' },
      },
    },
    crown: {
      viewBox: '0 0 80 60',
      size: 80,
      paths: {
        body: { d: 'M8 52 L16 20 L32 36 L40 12 L48 36 L64 20 L72 52 Z' },
        base: { d: 'M8 52 h64 v4 h-64 z' },
      },
    },
    lipstick: {
      viewBox: '0 0 40 80',
      size: 60,
      paths: {
        tube:   { d: 'M14 50 h12 v24 h-12 z' },
        cap:    { d: 'M12 50 h16 v-4 h-16 z' },
        bullet: { d: 'M14 20 Q14 8 20 6 Q26 8 26 20 L26 50 h-12 z' },
      },
    },
    perfume: {
      viewBox: '0 0 60 80',
      size: 70,
      paths: {
        bottle:  { d: 'M18 32 Q16 60 18 72 Q30 78 42 72 Q44 60 42 32 Z' },
        neck:    { d: 'M24 20 h12 v12 h-12 z' },
        cap:     { d: 'M20 16 h20 v4 h-20 z' },
        sprayer: { d: 'M36 12 h8 v4 h-2 v-2 h-6 z' },
      },
    },
    highHeel: {
      viewBox: '0 0 80 60',
      size: 80,
      paths: {
        shoe: { d: 'M10 44 Q20 20 52 24 Q68 26 70 36 Q70 44 60 44 Z' },
        heel: { d: 'M10 44 Q8 50 12 54 Q16 56 18 52 Q16 48 14 44 Z' },
        sole: { d: 'M18 52 h42 v2 h-42 z' },
      },
    },
    diamond: {
      viewBox: '0 0 60 60',
      size: 60,
      paths: {
        top:     { d: 'M30 8 L50 24 L30 20 L10 24 Z' },
        bottom:  { d: 'M10 24 L30 20 L50 24 L30 52 Z' },
        facets:  { d: 'M10 24 L30 20 M50 24 L30 20 M30 52 L30 20', fill: 'none' },
      },
    },
    priceTag: {
      viewBox: '0 0 60 80',
      size: 65,
      paths: {
        tag:   { d: 'M10 16 Q10 8 18 8 h24 l8 12 L42 68 Q42 76 34 76 H18 Q10 76 10 68 Z' },
        hole:  { d: 'M30 14 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0' },
        line1: { d: 'M20 36 h20', fill: 'none' },
        line2: { d: 'M20 46 h16', fill: 'none' },
        line3: { d: 'M20 56 h12', fill: 'none' },
      },
    },
    shoppingBag: {
      viewBox: '0 0 70 80',
      size: 70,
      paths: {
        handles: { d: 'M24 24 Q24 14 35 14 Q46 14 46 24', fill: 'none' },
        bag:     { d: 'M12 24 h46 Q60 60 58 72 Q35 78 12 72 Q10 60 12 24 Z' },
        logo:    { d: 'M28 52 h14 v-10 h-14 z' },
      },
    },
  },

  // Per-page placement presets — objects lead the eye toward centre content
  placements: {
    dashboard: [
      { object: 'handbag',     opacity: 0.45, rotation: -15, size: 90, position: { top: '8%',    right: '3%'  } },
      { object: 'diamond',     opacity: 0.38, rotation:  10, size: 65, position: { top: '60%',   left: '2%'   } },
      { object: 'crown',       opacity: 0.42, rotation:  -8, size: 80, position: { bottom: '12%',right: '5%'  } },
      { object: 'perfume',     opacity: 0.35, rotation:  20, size: 70, position: { top: '35%',   right: '2%'  } },
    ],
    map: [
      { object: 'highHeel',    opacity: 0.48, rotation: -12, size: 88, position: { top: '5%',    left: '3%'   } },
      { object: 'priceTag',    opacity: 0.40, rotation:  18, size: 65, position: { bottom: '8%', right: '4%'  } },
      { object: 'shoppingBag', opacity: 0.44, rotation:  -6, size: 75, position: { top: '50%',   left: '1%'   } },
      { object: 'lipstick',    opacity: 0.38, rotation:  22, size: 60, position: { top: '20%',   right: '3%'  } },
      { object: 'diamond',     opacity: 0.42, rotation:  -5, size: 58, position: { bottom: '20%',left: '4%'   } },
    ],
    quiz: [
      { object: 'crown',       opacity: 0.50, rotation: -10, size: 85, position: { top: '4%',    right: '2%'  } },
      { object: 'lipstick',    opacity: 0.40, rotation:  15, size: 62, position: { bottom: '6%', left: '3%'   } },
      { object: 'perfume',     opacity: 0.38, rotation: -20, size: 72, position: { top: '45%',   left: '1%'   } },
    ],
    learning: [
      { object: 'handbag',     opacity: 0.42, rotation:  12, size: 82, position: { top: '6%',    left: '2%'   } },
      { object: 'shoppingBag', opacity: 0.38, rotation: -18, size: 70, position: { bottom: '10%',right: '3%'  } },
      { object: 'priceTag',    opacity: 0.45, rotation:   8, size: 60, position: { top: '55%',   right: '2%'  } },
      { object: 'diamond',     opacity: 0.40, rotation: -12, size: 55, position: { bottom: '30%',left: '2%'   } },
    ],
    bossBattle: [
      { object: 'crown',       opacity: 0.52, rotation:   0, size: 95, position: { top: '2%',    right: '2%'  } },
      { object: 'diamond',     opacity: 0.48, rotation: -15, size: 72, position: { top: '2%',    left: '2%'   } },
      { object: 'highHeel',    opacity: 0.44, rotation:  20, size: 86, position: { bottom: '5%', left: '3%'   } },
      { object: 'priceTag',    opacity: 0.40, rotation: -22, size: 65, position: { bottom: '5%', right: '4%'  } },
      { object: 'perfume',     opacity: 0.38, rotation:  10, size: 68, position: { top: '40%',   right: '1%'  } },
      { object: 'lipstick',    opacity: 0.36, rotation: -10, size: 58, position: { top: '40%',   left: '1%'   } },
      { object: 'shoppingBag', opacity: 0.42, rotation:   5, size: 78, position: { top: '22%',   right: '3%'  } },
    ],
  },
};

// ── IRIDESCENT STAR MOTIF ─────────────────────────────────────────────────────
// Used as chapter/XP badges only — always anchored inside a card with a label.
export const fashionStar = {
  gradient:          'linear-gradient(135deg, #ffffff, #fde68a, #f7a0b8, #c084fc, #9d1f4a)',
  glowFilter:        'drop-shadow(0 0 6px rgba(247,160,184,0.70)) drop-shadow(0 0 12px rgba(192,132,252,0.50))',
  specularHighlight: 'rgba(255,255,255,0.55)',
  labelStyle: {
    fontFamily:    "'DM Sans', sans-serif",
    fontWeight:    600,
    fontSize:      '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color:         '#c98a9e',
  },
};

// ── FASHION VOCABULARY ────────────────────────────────────────────────────────
export const fashionVocabulary = {
  xp:              'Style Points',
  level:           'Fashion Tier',
  skills:          'Wardrobe Pieces',
  badges:          'Designer Labels',
  boss:            'Fashion Critic',
  bossAlt:         'Runway Show',
  island:          'District',
  chapter:         'Collection',
  topic:           'Look',
  complete:        'Styled',
  locked:          'Behind Velvet Rope',
  mascotGreeting:  'Darling!',
  encouragement:   'Absolutely stunning work!',
  farewell:        'Stay chic!',
};

// ── RADII ─────────────────────────────────────────────────────────────────────
export const fashionRadii = {
  card:   '28px',
  button: '16px',
  pill:   '99px',
  avatar: '50%',
  input:  '14px',
  small:  '10px',
};

// ── SHADOWS ───────────────────────────────────────────────────────────────────
export const fashionShadows = {
  card:   '0 16px 48px rgba(247,160,184,0.25), 0 6px 20px rgba(192,132,252,0.15)',
  button: '0 6px 20px rgba(192,132,252,0.35)',
  modal:  '0 24px 64px rgba(247,160,184,0.35), 0 8px 32px rgba(192,132,252,0.20)',
  subtle: '0 4px 12px rgba(247,160,184,0.15)',
  glow:   '0 0 24px rgba(192,132,252,0.40)',
};

// ── ANIMATIONS (Framer Motion) ────────────────────────────────────────────────
export const fashionAnimations = {
  pageEnter: {
    initial:    { opacity: 0, y: 20 },
    animate:    { opacity: 1, y: 0  },
    exit:       { opacity: 0, y: -20 },
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },

  cardContainer: {
    animate: { transition: { staggerChildren: 0.08 } },
  },
  cardItem: {
    initial:    { opacity: 0, y: 16, scale: 0.97 },
    animate:    { opacity: 1, y: 0,  scale: 1    },
    transition: { type: 'spring', stiffness: 220, damping: 22 },
  },

  // Decorative accent objects: gentle bob + slight rotation, infinite
  accentFloat: {
    animate: {
      y:          [0, -10, 0],
      rotate:     [-1, 1, -1],
      transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
    },
  },

  // Style Points bar fill: spring with gentle overshoot
  xpFill: {
    type:              'spring',
    stiffness:         180,
    damping:           18,
    overshootClamping: false,
  },

  // Star badge pulse: scale + glow, 1.5 s loop
  starPulse: {
    animate: {
      scale: [1, 1.08, 1],
      filter: [
        'drop-shadow(0 0 6px rgba(247,160,184,0.70))',
        'drop-shadow(0 0 14px rgba(192,132,252,0.80))',
        'drop-shadow(0 0 6px rgba(247,160,184,0.70))',
      ],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
  },

  // Button hover lift + tap scale
  buttonTap: {
    whileHover: { y: -1, boxShadow: '0 10px 28px rgba(192,132,252,0.45)' },
    whileTap:   { scale: 0.97 },
  },

  bossEntrance: {
    initial:    { opacity: 0, scale: 0.8, rotate: -5 },
    animate:    { opacity: 1, scale: 1,   rotate: 0  },
    transition: { type: 'spring', stiffness: 160, damping: 18, duration: 0.7 },
  },

  victoryBurst: {
    initial:    { scale: 0,          opacity: 0 },
    animate:    { scale: [0, 1.2, 1], opacity: 1 },
    transition: { duration: 0.55, ease: [0.22, 1.5, 0.55, 1] },
  },

  // Shimmer sweep for loading states
  shimmer: {
    animate: {
      backgroundPosition: ['200% center', '-200% center'],
      transition: { duration: 2.5, repeat: Infinity, ease: 'linear' },
    },
  },
};

// ── LAYOUT ────────────────────────────────────────────────────────────────────
export const fashionLayout = {
  maxWidth:     '1200px',
  contentWidth: '800px',
  narrowWidth:  '480px',
  spacing: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  32,
    xxl: 48,
  },
  mobileBreak:  768,
  tapTarget:    44,
  cardPadding: {
    desktop: 32,
    mobile:  20,
  },
  sidebarWidth: '260px',
};

// ── DEFAULT EXPORT — combined fashionTheme ────────────────────────────────────
const fashionTheme = {
  domain:           'fashion',
  name:             'Bubblegum Glam',
  colors:           fashionColors,
  archetypes:       fashionArchetypes,
  zones:            fashionZones,
  typography:       fashionTypography,
  glass:            fashionGlass,
  background:       fashionBackground,
  buttons:          fashionButtons,
  buttonRimHighlight,
  xpBar:            fashionXpBar,
  accents:          fashionAccents,
  star:             fashionStar,
  vocabulary:       fashionVocabulary,
  radii:            fashionRadii,
  shadows:          fashionShadows,
  animations:       fashionAnimations,
  layout:           fashionLayout,
  getBackgroundStyle,
};

export default fashionTheme;
