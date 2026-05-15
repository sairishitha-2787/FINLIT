// frontend/src/components/achievements/hexUtils.js
// Shared hex geometry utilities for achievements components.

export const HEX_RATIO = Math.sqrt(3) / 2; // W/H ≈ 0.866

export function hexW(size) {
  return Math.round(size * HEX_RATIO);
}

export function hexPathD(w, h, r = 0) {
  const pts = [
    [w / 2, 0],
    [w, h / 4],
    [w, (h * 3) / 4],
    [w / 2, h],
    [0, (h * 3) / 4],
    [0, h / 4],
  ];
  const n = pts.length;
  const f = (v) => v.toFixed(1);
  if (r <= 0) {
    return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${f(x)} ${f(y)}`).join(' ') + 'Z';
  }
  let d = '';
  for (let i = 0; i < n; i++) {
    const [cx, cy] = pts[i];
    const [px, py] = pts[(i + n - 1) % n];
    const [nx, ny] = pts[(i + 1) % n];
    const lp = Math.hypot(px - cx, py - cy);
    const ln = Math.hypot(nx - cx, ny - cy);
    const rc = Math.min(r, lp / 2, ln / 2);
    const sx = cx + ((px - cx) / lp) * rc;
    const sy = cy + ((py - cy) / lp) * rc;
    const ex = cx + ((nx - cx) / ln) * rc;
    const ey = cy + ((ny - cy) / ln) * rc;
    d += i === 0 ? `M${f(sx)} ${f(sy)}` : `L${f(sx)} ${f(sy)}`;
    d += ` Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`;
  }
  return d + 'Z';
}
