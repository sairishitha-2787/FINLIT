// ErrorFallback — the full-screen UI shown when ErrorBoundary catches a crash.
//
// Intentionally self-contained: no theme/router/context dependencies, because
// it renders OUTSIDE the providers (a crash may have come from any of them).
// Navigation uses window.location rather than useNavigate so it works even if
// React Router state is the thing that broke.

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const BTN_BASE = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '11px 20px', borderRadius: 10, cursor: 'pointer',
  fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
  border: '1px solid transparent',
};

export default function ErrorFallback({ error }) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div
      role="alert"
      style={{
        position: 'fixed', inset: 0, zIndex: 100000,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: 24,
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #1a1530 0%, #0b0a12 60%)',
        fontFamily: "'Inter', sans-serif", color: '#fff',
      }}
    >
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)',
        marginBottom: 24,
      }}>
        <AlertTriangle size={34} color="#EF4444" strokeWidth={2} />
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
        Something went wrong
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.65)', maxWidth: 420, margin: '0 0 28px' }}>
        We're sorry — an unexpected error occurred. Try refreshing the page, and
        if it keeps happening, head back home.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => window.location.reload()}
          style={{ ...BTN_BASE, background: '#a78bfa', color: '#1a1530' }}
        >
          <RefreshCw size={16} strokeWidth={2.4} /> Refresh Page
        </button>
        <button
          onClick={() => { window.location.href = '/'; }}
          style={{ ...BTN_BASE, background: 'transparent', borderColor: 'rgba(255,255,255,0.22)', color: '#fff' }}
        >
          <Home size={16} strokeWidth={2.4} /> Go Home
        </button>
      </div>

      {/* Dev-only: surface the message to speed up debugging. Hidden in prod. */}
      {isDev && error?.message && (
        <pre style={{
          marginTop: 28, maxWidth: '90vw', overflowX: 'auto',
          padding: '10px 14px', borderRadius: 8,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.55)', fontSize: 12, textAlign: 'left',
        }}>
          {String(error.message)}
        </pre>
      )}
    </div>
  );
}
