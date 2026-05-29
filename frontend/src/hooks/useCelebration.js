// Domain-themed celebration effects on lesson completion.
// Returns a celebrate() function that fires immediately — no useCallback
// so it always uses the latest accentColor without stale-closure issues.

import confetti from 'canvas-confetti';

export function useCelebration(domain = 'gaming', accentColor = null) {

  function celebrate() {
    const accent = accentColor || null;
    try {
      if (domain === 'fashion')  { fireFashion(accent);  return; }
      if (domain === 'sports')   { fireSports(accent);   return; }
      if (domain === 'gaming')   { fireGaming(accent);   return; }
      fireDefault();
    } catch (e) {
      // confetti is non-critical — fail silently
    }
  }

  return { celebrate };
}

// ── Fashion ───────────────────────────────────────────────────────────────────
function fireFashion(accent) {
  const a = accent || '#f7a0b8';
  confetti({ particleCount: 120, spread: 70, origin: { x: 0.5, y: 0 },
    colors: [a, '#c084fc', '#fde68a', '#faf5ec', '#fbb6c4'],
    gravity: 0.55, scalar: 1.1, drift: 1.2, ticks: 280 });
  setTimeout(() =>
    confetti({ particleCount: 60, spread: 55, origin: { x: 0.2, y: 0.1 },
      colors: [a, '#fde68a'], gravity: 0.65, scalar: 0.85, drift: -1 }), 220);
  setTimeout(() =>
    confetti({ particleCount: 60, spread: 55, origin: { x: 0.8, y: 0.1 },
      colors: [a, '#c084fc'], gravity: 0.65, scalar: 0.85, drift: 1 }), 380);
}

// ── Sports ────────────────────────────────────────────────────────────────────
function fireSports(accent) {
  const a = accent || '#E8457A';
  // Big centre burst
  confetti({ particleCount: 180, spread: 100, origin: { x: 0.5, y: 0.55 },
    colors: [a, '#fbbf24', '#fff', '#4ade80'], gravity: 0.6, scalar: 1.3, ticks: 320 });
  // Left + right cannons
  setTimeout(() => {
    confetti({ particleCount: 70, angle: 60,  spread: 52, origin: { x: 0, y: 0.65 }, colors: [a, '#fbbf24'], gravity: 0.7 });
    confetti({ particleCount: 70, angle: 120, spread: 52, origin: { x: 1, y: 0.65 }, colors: [a, '#fff'],    gravity: 0.7 });
  }, 80);
  // Ticker-tape from top
  setTimeout(() =>
    confetti({ particleCount: 90, spread: 120, origin: { x: 0.5, y: 0 },
      colors: [a, '#fbbf24', '#fff'], gravity: 0.45, scalar: 0.7, ticks: 400 }), 380);
}

// ── Gaming ────────────────────────────────────────────────────────────────────
function fireGaming(accent) {
  const a = accent || '#9FE0D3';
  // Central explosion
  confetti({ particleCount: 200, spread: 110, origin: { x: 0.5, y: 0.5 },
    colors: [a, '#c084fc', '#fbbf24', '#f472b6'], gravity: 0.45, scalar: 1.4, ticks: 450 });
  // 360° starburst
  setTimeout(() =>
    confetti({ particleCount: 120, spread: 360, startVelocity: 28, origin: { x: 0.5, y: 0.5 },
      colors: [a, '#c084fc'], gravity: 0.3, scalar: 1.0, ticks: 300 }), 180);
  // Top waterfall
  setTimeout(() =>
    confetti({ particleCount: 80, spread: 90, origin: { x: 0.5, y: 0 },
      colors: [a, '#fbbf24', '#f472b6'], gravity: 0.6, scalar: 0.85 }), 400);
}

function fireDefault() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 },
    colors: ['#fbbf24', '#f472b6', '#60a5fa'], gravity: 0.6 });
}
