import React, { useEffect, useRef } from 'react';

const VERT = `
  attribute vec2 a_pos;
  attribute vec2 a_uv;
  varying vec2 v_uv;
  void main() {
    v_uv = a_uv;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

const FRAG = `
  precision mediump float;
  uniform sampler2D u_tex;
  uniform sampler2D u_disp;
  uniform float u_strength;
  varying vec2 v_uv;
  void main() {
    vec2 d = texture2D(u_disp, v_uv).rg * 2.0 - 1.0;
    vec2 uv = clamp(v_uv + d * u_strength, 0.0, 1.0);
    gl_FragColor = texture2D(u_tex, uv);
  }
`;

const buildGradient = (colors) => {
  const sz = 512;
  const oc = document.createElement('canvas');
  oc.width = oc.height = sz;
  const cx = oc.getContext('2d');

  // Diagonal multi-stop gradient
  const lg = cx.createLinearGradient(0, 0, sz, sz);
  colors.forEach((c, i) => lg.addColorStop(i / (colors.length - 1), c));
  cx.fillStyle = lg;
  cx.fillRect(0, 0, sz, sz);

  // Soft white radial highlight top-left
  const rg1 = cx.createRadialGradient(sz * 0.18, sz * 0.18, 0, sz * 0.18, sz * 0.18, sz * 0.62);
  rg1.addColorStop(0, 'rgba(255,255,255,0.30)');
  rg1.addColorStop(1, 'rgba(255,255,255,0)');
  cx.fillStyle = rg1;
  cx.fillRect(0, 0, sz, sz);

  // Subtle depth bottom-right
  const rg2 = cx.createRadialGradient(sz * 0.88, sz * 0.88, 0, sz * 0.88, sz * 0.88, sz * 0.5);
  rg2.addColorStop(0, 'rgba(8,24,72,0.16)');
  rg2.addColorStop(1, 'rgba(8,24,72,0)');
  cx.fillStyle = rg2;
  cx.fillRect(0, 0, sz, sz);

  return oc;
};

const mkShader = (gl, type, src) => {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
};

const GridDistortion = ({
  imageSrc   = null,
  colors     = ['#EAF6FF', '#ffffff', '#7AE1FF', '#5FB3FF', '#3A8DFF'],
  grid       = 15,
  mouse      = 0.1,
  strength   = 0.15,
  relaxation = 0.9,
}) => {
  const canvasRef = useRef(null);
  const propsRef  = useRef({});
  propsRef.current = { mouse, strength, relaxation };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs   = mkShader(gl, gl.VERTEX_SHADER,   VERT);
    const fs   = mkShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Full-screen quad [x, y, u, v]
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  0, 0,
       1, -1,  1, 0,
      -1,  1,  0, 1,
       1,  1,  1, 1,
    ]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    const aUv  = gl.getAttribLocation(prog, 'a_uv');
    gl.enableVertexAttribArray(aPos);
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(aUv,  2, gl.FLOAT, false, 16, 8);

    // Main texture
    const texMain = gl.createTexture();
    const uploadMain = (src) => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texMain);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    };
    uploadMain(buildGradient(colors));
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => uploadMain(img);
      img.src = imageSrc;
    }

    // Displacement texture (NxN grid)
    const N    = Math.max(2, Math.floor(grid));
    const vel  = new Float32Array(N * N * 2);  // [vx, vy] per cell
    const disp = new Uint8Array(N * N * 4);
    for (let k = 0; k < N * N; k++) {
      disp[k * 4]     = 128;  // vx = 0
      disp[k * 4 + 1] = 128;  // vy = 0
      disp[k * 4 + 2] = 0;
      disp[k * 4 + 3] = 255;
    }
    const texDisp = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texDisp);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, disp);

    gl.uniform1i(gl.getUniformLocation(prog, 'u_tex'),  0);
    gl.uniform1i(gl.getUniformLocation(prog, 'u_disp'), 1);
    const uStr = gl.getUniformLocation(prog, 'u_strength');

    // Mouse state (0–1 normalized, -1 = off-screen)
    let mx = -1, my = -1;

    const resize = () => {
      const p = canvas.parentElement;
      canvas.width  = p ? p.offsetWidth  : window.innerWidth;
      canvas.height = p ? p.offsetHeight : window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove  = (e) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / (r.width  || 1);
      my = (e.clientY - r.top)  / (r.height || 1);
    };
    const onLeave = () => { mx = -1; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    let raf;
    const draw = () => {
      const { mouse: mr, strength: str, relaxation: rlx } = propsRef.current;

      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const vi = (j * N + i) * 2;

          if (mx >= 0) {
            const gx = i / (N - 1);
            const gy = j / (N - 1);
            const dx = gx - mx;
            const dy = gy - my;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < mr) {
              const f = (1 - d / mr) * 0.05;
              vel[vi]   += dx * f;
              vel[vi+1] += dy * f;
            }
          }

          // Decay toward zero; clamp to [-1, 1]
          vel[vi]   = Math.max(-1, Math.min(1, vel[vi]   * rlx));
          vel[vi+1] = Math.max(-1, Math.min(1, vel[vi+1] * rlx));

          // Pack [-1,1] → [0,255]
          const di = (j * N + i) * 4;
          disp[di]   = Math.round((vel[vi]   + 1) * 0.5 * 255);
          disp[di+1] = Math.round((vel[vi+1] + 1) * 0.5 * 255);
        }
      }

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texDisp);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, disp);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texMain);
      gl.uniform1f(uStr, str);
      gl.clearColor(0.93, 0.96, 1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(prog);
      gl.deleteTexture(texMain);
      gl.deleteTexture(texDisp);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'block', zIndex: 0,
      }}
    />
  );
};

export default GridDistortion;
