// Calculator — lightweight in-quiz calculator modal for calculation questions.
// Opens over the quiz; "Use answer" copies the result into the quiz input.
// Self-contained dark UI; operator/accent buttons pick up the domain accent
// via useTheme() when available.

import React, { useState, useCallback, useEffect } from 'react';
import { X, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const OPS = ['+', '−', '×', '÷'];

function compute(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? NaN : a / b;
    default:  return b;
  }
}

// Trim float noise (0.1+0.2 → 0.3) without forcing decimals on integers.
const fmt = (n) => {
  if (!Number.isFinite(n)) return 'Error';
  return String(Math.round((n + Number.EPSILON) * 1e10) / 1e10);
};

export default function Calculator({ isOpen, onClose, onCopyResult }) {
  const theme = useTheme();
  const accent = theme?.accent || '#6366f1';

  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);          // operand before the operator
  const [op, setOp] = useState(null);
  const [waiting, setWaiting] = useState(false);    // next digit starts a fresh operand

  const reset = useCallback(() => { setDisplay('0'); setPrev(null); setOp(null); setWaiting(false); }, []);

  const inputDigit = (d) => {
    if (waiting) { setDisplay(d); setWaiting(false); return; }
    setDisplay((cur) => (cur === '0' ? d : cur + d));
  };
  const inputDot = () => {
    if (waiting) { setDisplay('0.'); setWaiting(false); return; }
    setDisplay((cur) => (cur.includes('.') ? cur : cur + '.'));
  };
  const chooseOp = (nextOp) => {
    const cur = parseFloat(display);
    if (op && prev !== null && !waiting) {
      const result = compute(prev, cur, op);
      setDisplay(fmt(result));
      setPrev(Number.isFinite(result) ? result : null);
    } else {
      setPrev(cur);
    }
    setOp(nextOp);
    setWaiting(true);
  };
  const equals = () => {
    if (op && prev !== null) {
      setDisplay(fmt(compute(prev, parseFloat(display), op)));
      setPrev(null); setOp(null); setWaiting(true);
    }
  };
  const del = () => setDisplay((cur) => (cur.length > 1 ? cur.slice(0, -1) : '0'));

  const press = (btn) => {
    if (btn === '=') equals();
    else if (OPS.includes(btn)) chooseOp(btn);
    else if (btn === '.') inputDot();
    else inputDigit(btn);
  };

  // Reset whenever the modal closes so each open starts clean.
  useEffect(() => { if (!isOpen) reset(); }, [isOpen, reset]);

  const useAnswer = () => {
    if (display !== 'Error') onCopyResult?.(display);
    onClose?.();
  };

  const keyStyle = (isOp) => ({
    padding: 14, fontSize: 18, fontWeight: 700, cursor: 'pointer',
    border: 'none', borderRadius: 10,
    background: isOp ? accent : 'rgba(255,255,255,0.08)',
    color: '#fff',
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 16 }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#16161c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 18, width: '100%', maxWidth: 300, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: '0.02em' }}>Calculator</h3>
              <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', padding: 2 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px', marginBottom: 14, textAlign: 'right', fontSize: 26, color: '#fff', fontWeight: 700, fontFamily: "'Inter', sans-serif", overflowX: 'auto', minHeight: 30 }}>
              {display}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8 }}>
              <button onClick={reset} style={{ ...keyStyle(false), gridColumn: 'span 2', background: 'rgba(255,255,255,0.14)' }}>Clear</button>
              <button onClick={del} aria-label="Delete" style={{ ...keyStyle(false), background: 'rgba(255,255,255,0.14)' }}>⌫</button>
              <button onClick={() => press('÷')} style={keyStyle(true)}>÷</button>

              {['7', '8', '9'].map((b) => <button key={b} onClick={() => press(b)} style={keyStyle(false)}>{b}</button>)}
              <button onClick={() => press('×')} style={keyStyle(true)}>×</button>

              {['4', '5', '6'].map((b) => <button key={b} onClick={() => press(b)} style={keyStyle(false)}>{b}</button>)}
              <button onClick={() => press('−')} style={keyStyle(true)}>−</button>

              {['1', '2', '3'].map((b) => <button key={b} onClick={() => press(b)} style={keyStyle(false)}>{b}</button>)}
              <button onClick={() => press('+')} style={keyStyle(true)}>+</button>

              <button onClick={() => press('0')} style={{ ...keyStyle(false), gridColumn: 'span 2' }}>0</button>
              <button onClick={() => press('.')} style={keyStyle(false)}>.</button>
              <button onClick={() => press('=')} style={keyStyle(true)}>=</button>
            </div>

            <button onClick={useAnswer} style={{ width: '100%', marginTop: 8, padding: 13, background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <CornerDownLeft size={16} /> Use answer
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
