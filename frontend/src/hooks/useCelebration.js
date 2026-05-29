// Domain-themed celebration effects triggered on lesson completion.
// Pass the character's accent color so particles match their chosen character.

import { useCallback } from 'react';
import confetti from 'canvas-confetti';

function hex(color) {
  // Return the hex string — confetti accepts hex colors directly
  return color || '#ffffff';
}

export function useCelebration(domain = 'gaming', accentColor = null) {

  const celebrate = useCallback(() => {
    switch (domain) {
      case 'fashion':  celebrateFashion(accentColor);  break;
      case 'sports':   celebrateSports(accentColor);   break;
      case 'gaming':   celebrateGaming(accentColor);   break;
      default:         celebrateDefault();              break;
    }
  }, [domain, accentColor]);

  return { celebrate };
}

// ── Fashion ──────────────────────────────────────────────────────────────────
// Elegant confetti cascade — character color + soft cream/gold
function celebrateFashion(accent) {
  const a = accent || '#f7a0b8';
  const light = '#fde68a';
  const cream = '#faf5ec';

  confetti({
    particleCount: 120,
    spread: 70,
    origin: { x: 0.5, y: 0 },
    colors: [a, '#c084fc', light, cream, '#fbb6c4'],
    gravity: 0.55,
    scalar: 1.1,
    drift: 1.2,
    ticks: 280,
  });

  setTimeout(() =>
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { x: 0.25, y: 0.1 },
      colors: [a, light],
      gravity: 0.65,
      scalar: 0.85,
      drift: -1,
    }), 220);

  setTimeout(() =>
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { x: 0.75, y: 0.1 },
      colors: [a, '#c084fc'],
      gravity: 0.65,
      scalar: 0.85,
      drift: 1,
    }), 380);
}

// ── Sports ───────────────────────────────────────────────────────────────────
// Goal-net burst — character color + gold + white
function celebrateSports(accent) {
  const a = accent || '#E8457A';

  // Big centre burst
  confetti({
    particleCount: 180,
    spread: 100,
    origin: { x: 0.5, y: 0.55 },
    colors: [a, '#fbbf24', '#fff', '#4ade80'],
    gravity: 0.6,
    scalar: 1.3,
    ticks: 320,
  });

  // Left cannon
  setTimeout(() =>
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 52,
      origin: { x: 0, y: 0.65 },
      colors: [a, '#fbbf24'],
      gravity: 0.7,
    }), 80);

  // Right cannon
  setTimeout(() =>
    confetti({
      particleCount: 70,
      angle: 120,
      spread: 52,
      origin: { x: 1, y: 0.65 },
      colors: [a, '#fff'],
      gravity: 0.7,
    }), 80);

  // Ticker-tape rain from top
  setTimeout(() =>
    confetti({
      particleCount: 90,
      spread: 120,
      origin: { x: 0.5, y: 0 },
      colors: [a, '#fbbf24', '#fff'],
      gravity: 0.45,
      scalar: 0.7,
      ticks: 400,
    }), 350);
}

// ── Gaming ───────────────────────────────────────────────────────────────────
// Cyberpunk fireworks — character colour + neon accents
function celebrateGaming(accent) {
  const a = accent || '#9FE0D3';

  // Central explosion
  confetti({
    particleCount: 220,
    spread: 110,
    origin: { x: 0.5, y: 0.5 },
    colors: [a, '#c084fc', '#fbbf24', '#f472b6'],
    gravity: 0.45,
    scalar: 1.4,
    ticks: 450,
  });

  // 360° starburst
  setTimeout(() =>
    confetti({
      particleCount: 120,
      spread: 360,
      startVelocity: 28,
      origin: { x: 0.5, y: 0.5 },
      colors: [a, '#c084fc'],
      gravity: 0.3,
      scalar: 1.0,
      ticks: 300,
    }), 180);

  // Top waterfall
  setTimeout(() =>
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { x: 0.5, y: 0 },
      colors: [a, '#fbbf24', '#f472b6'],
      gravity: 0.6,
      scalar: 0.85,
    }), 380);
}

function celebrateDefault() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.55 },
    colors: ['#fbbf24', '#f472b6', '#60a5fa'],
    gravity: 0.6,
  });
}
