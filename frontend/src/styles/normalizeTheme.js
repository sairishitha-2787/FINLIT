// normalizeTheme — adapters that map each domain's bespoke theme keys onto ONE
// normalized shape, so shared components (DailyGlossaryCard, future
// notifications/profiles) can read a single object via useTheme() without
// knowing any domain-specific key names.
//
// Per-character / per-cluster variation is preserved: the live theme object is
// passed in at render time (see normalizeMusicTheme), and the accent is the
// user's selected character color — not a frozen per-domain constant.
//
// Normalized shape:
//   { accent, surface, surfaceAlt, border, textPrimary, textSecondary,
//     textMuted, radius, fonts: { heading, body }, domain, character }

import { gamingTheme } from './gamingTheme';
import { fashionColors, fashionTypography } from './fashionTheme';
import { sportsTheme } from './sportsTheme';

// Several themes store borders as full CSS shorthand ("1px solid rgba(...)").
// The normalized `border` is just the color so callers can compose it freely.
const colorOnly = (b) =>
  typeof b === 'string' ? b.replace(/^[\d.]+px\s+solid\s+/i, '') : b;

export const normalizeGamingTheme = (accent, character = null) => ({
  accent,
  surface:       gamingTheme.cardBg,
  surfaceAlt:    gamingTheme.bgSecondary,
  border:        gamingTheme.glassBorder,
  textPrimary:   gamingTheme.stellarWhite,
  textSecondary: gamingTheme.seafoam,
  textMuted:     gamingTheme.mutedBlue,
  radius:        14,
  fonts:         { heading: gamingTheme.fontHeading, body: gamingTheme.fontBody },
  domain:        'gaming',
  character,
});

// Receives the LIVE cluster theme from getClusterTheme(characterId), so the
// vinyl / neon / dreamy fonts and colors flow through unchanged. `cluster` also
// drives the corner radius (neon = sharp, dreamy = soft) to match the original
// per-cluster styling.
export const normalizeMusicTheme = (liveTheme, accent, character = null, cluster = null) => ({
  accent,
  surface:       liveTheme.bgCard,
  surfaceAlt:    liveTheme.bgSecondary,
  border:        colorOnly(liveTheme.borderCard || liveTheme.borderThin),
  textPrimary:   liveTheme.textPrimary,
  textSecondary: liveTheme.textSecondary,
  textMuted:     liveTheme.textMuted,
  radius:        cluster === 'neon' ? 0 : cluster === 'dreamy' ? 16 : 8,
  fonts:         { heading: liveTheme.fontHeading, body: liveTheme.fontBody },
  domain:        'music',
  character,
});

export const normalizeFashionTheme = (accent, character = null) => ({
  accent,
  // Fashion is a light glassmorphism domain — readable card surfaces, not the
  // ultra-transparent sidebar glass.
  surface:       'rgba(255,255,255,0.70)',
  surfaceAlt:    'rgba(255,255,255,0.50)',
  border:        'rgba(247,160,184,0.40)',
  textPrimary:   fashionColors.deepRose, // #9d1f4a
  textSecondary: fashionColors.bodyText, // #b0627a
  textMuted:     fashionColors.label,    // #c98a9e
  radius:        18,
  fonts:         {
    heading: fashionTypography.families.heading, // Playfair Display
    body:    fashionTypography.families.body,     // DM Sans
  },
  domain:        'fashion',
  character,
});

export const normalizeSportsTheme = (accent, character = null) => ({
  accent,
  surface:       sportsTheme.bgCard,
  surfaceAlt:    sportsTheme.bgSecondary,
  border:        colorOnly(sportsTheme.borderCard),
  textPrimary:   sportsTheme.textPrimary,
  textSecondary: sportsTheme.textSecondary,
  textMuted:     sportsTheme.textMuted,
  radius:        8,
  fonts:         { heading: sportsTheme.fontHeading, body: sportsTheme.fontBody },
  domain:        'sports',
  character,
});
