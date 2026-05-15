import React, { useEffect, useRef } from 'react';

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
};

const lerpRgb = (c1, c2, t) => ({
  r: Math.round(c1.r + (c2.r - c1.r) * t),
  g: Math.round(c1.g + (c2.g - c1.g) * t),
  b: Math.round(c1.b + (c2.b - c1.b) * t),
});

const GradientBlinds = ({
  gradientColors   = ['#EAF6FF', '#5FB3FF', '#3A8DFF'],
  noise            = 0.3,
  blindCount       = 16,
  blindMinWidth    = 60,
  mouseDampening   = 0.15,
  mirrorGradient   = false,
  spotlightRadius  = 0.5,
  spotlightSoftness = 1,
  spotlightOpacity = 1,
  distortAmount    = 0,
  shineDirection   = 'left',
}) => {
  const canvasRef    = useRef(null);
  const stateRef     = useRef({ mx: 0.5, my: 0.5, tmx: 0.5, tmy: 0.5 });
  const noiseRef     = useRef([]);
  const rafRef       = useRef(null);
  const propsRef     = useRef({});

  // Keep props accessible in animation loop without restarting it
  propsRef.current = {
    gradientColors, noise, blindCount, blindMinWidth, mouseDampening,
    mirrorGradient, spotlightRadius, spotlightSoftness, spotlightOpacity,
    distortAmount, shineDirection,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s   = stateRef.current;

    // Seed noise offsets once
    noiseRef.current = Array.from({ length: 64 }, () => (Math.random() - 0.5));

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight : window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      s.tmx = (e.clientX - rect.left) / (rect.width  || 1);
      s.tmy = (e.clientY - rect.top)  / (rect.height || 1);
    };
    window.addEventListener('mousemove', onMouseMove);

    const getColor = (t) => {
      const { gradientColors: gc, mirrorGradient: mg } = propsRef.current;
      let adj = Math.max(0, Math.min(1, t));
      if (mg) adj = adj < 0.5 ? adj * 2 : (1 - adj) * 2;
      const seg = adj * (gc.length - 1);
      const idx = Math.min(Math.floor(seg), gc.length - 2);
      const frac = seg - idx;
      const c1 = hexToRgb(gc[idx]);
      const c2 = hexToRgb(gc[idx + 1]);
      const c  = lerpRgb(c1, c2, frac);
      return `rgb(${c.r},${c.g},${c.b})`;
    };

    const draw = () => {
      const {
        blindCount: bc, blindMinWidth: bmw, mouseDampening: md,
        spotlightRadius: sr, spotlightSoftness: ss, spotlightOpacity: so,
        distortAmount: da, shineDirection: sd, noise: ns,
      } = propsRef.current;

      s.mx += (s.tmx - s.mx) * md;
      s.my += (s.tmy - s.my) * md;

      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) { rafRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, w, h);

      const blindW = Math.max(bmw, w / bc);
      const count  = Math.ceil(w / blindW) + 2;
      const shift  = (s.mx - 0.5) * blindW * 2;

      for (let i = 0; i < count; i++) {
        const baseT  = i / Math.max(count - 1, 1);
        const nOff   = noiseRef.current[i % noiseRef.current.length] * ns * (1 - Math.abs(s.mx - 0.5) * 0.6);
        const t      = Math.max(0, Math.min(1, baseT + nOff));
        const x      = i * blindW - shift;
        const distort = da > 0 ? Math.sin(i * 0.9 + s.mx * Math.PI * 2) * da * h * 0.12 : 0;

        ctx.fillStyle = getColor(t);
        ctx.beginPath();
        if (da > 0) {
          ctx.moveTo(x,           0 + distort);
          ctx.lineTo(x + blindW + 1, 0 - distort);
          ctx.lineTo(x + blindW + 1, h + distort);
          ctx.lineTo(x,           h - distort);
        } else {
          ctx.rect(x, 0, blindW + 1, h);
        }
        ctx.fill();
      }

      // Mouse spotlight
      if (so > 0) {
        const mx = s.mx * w;
        const my = s.my * h;
        const r  = Math.max(w, h) * sr;
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, r);
        grd.addColorStop(0,          `rgba(255,255,255,${so * 0.28})`);
        grd.addColorStop(ss * 0.65,  `rgba(255,255,255,${so * 0.06})`);
        grd.addColorStop(1,          'rgba(255,255,255,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      }

      // Edge shine
      if (sd) {
        const fromX = sd === 'left' ? 0 : w;
        const toX   = sd === 'left' ? w * 0.45 : w * 0.55;
        const shine = ctx.createLinearGradient(fromX, 0, toX, h * 0.6);
        shine.addColorStop(0, 'rgba(255,255,255,0.14)');
        shine.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = shine;
        ctx.fillRect(0, 0, w, h);
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []); // animation loop starts once; propsRef keeps values current

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'block', zIndex: 0 }}
    />
  );
};

export default GradientBlinds;
