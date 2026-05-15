import React, { useEffect, useRef } from 'react';

const EASING = {
  'ease-out':    (t) => 1 - Math.pow(1 - t, 3),
  'ease-in':     (t) => Math.pow(t, 3),
  'ease-in-out': (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  'linear':      (t) => t,
};

const ClickSpark = ({
  sparkColor   = '#ffffff',
  sparkSize    = 10,
  sparkRadius  = 15,
  sparkCount   = 8,
  duration     = 400,
  easing       = 'ease-out',
  extraScale   = 1,
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const easeFn = EASING[easing] || EASING['ease-out'];

    const handleClick = (e) => {
      const now = performance.now();
      for (let i = 0; i < sparkCount; i++) {
        const angle = (2 * Math.PI * i) / sparkCount - Math.PI / 2;
        sparksRef.current.push({ x: e.clientX, y: e.clientY, angle, startTime: now });
      }
    };
    window.addEventListener('click', handleClick);

    const animate = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const raw = (now - spark.startTime) / duration;
        if (raw >= 1) return false;

        const p    = easeFn(Math.min(raw, 1));
        const dist = sparkRadius * extraScale * p;
        const alpha = 1 - raw;
        const size  = sparkSize * (1 - raw * 0.4);
        const sx    = spark.x + Math.cos(spark.angle) * dist;
        const sy    = spark.y + Math.sin(spark.angle) * dist;

        ctx.save();
        ctx.globalAlpha  = Math.max(0, alpha);
        ctx.shadowBlur   = size * 2.5;
        ctx.shadowColor  = '#3A8DFF';
        ctx.fillStyle    = sparkColor;
        ctx.beginPath();
        ctx.arc(sx, sy, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        pointerEvents: 'none',
        zIndex:        99999,
      }}
    />
  );
};

export default ClickSpark;
