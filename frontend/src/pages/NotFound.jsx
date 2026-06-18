// NotFound — 404 screen for undefined routes (top-level and per-domain).
// Rendered inside the Router, so useNavigate/useLocation are available here.

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Home, ArrowRight } from 'lucide-react';

const DOMAINS = ['gaming', 'fashion', 'sports', 'music'];
const DOMAIN_LABEL = { gaming: 'Gaming', fashion: 'Fashion', sports: 'Sports', music: 'Music' };

const BTN_BASE = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '11px 20px', borderRadius: 10, cursor: 'pointer',
  fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
  border: '1px solid transparent',
};

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // If the bad URL is under a domain, offer a shortcut back to its dashboard.
  const domain = DOMAINS.find((d) => pathname.startsWith(`/${d}`)) || null;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed', inset: 0,
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
        background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.4)',
        marginBottom: 20,
      }}>
        <Compass size={34} color="#a78bfa" strokeWidth={2} />
      </div>

      <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', color: '#a78bfa', marginBottom: 8 }}>
        404
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
        Page not found
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.65)', maxWidth: 420, margin: '0 0 18px' }}>
        Sorry, we couldn't find the page you're looking for.
      </p>

      <code style={{
        display: 'inline-block', maxWidth: '90vw', overflowX: 'auto',
        padding: '6px 12px', borderRadius: 8, marginBottom: 28,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.55)', fontSize: 12.5,
      }}>
        {pathname}
      </code>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/')}
          style={{ ...BTN_BASE, background: '#a78bfa', color: '#1a1530' }}
        >
          <Home size={16} strokeWidth={2.4} /> Go Home
        </button>
        {domain && (
          <button
            onClick={() => navigate(`/${domain}`)}
            style={{ ...BTN_BASE, background: 'transparent', borderColor: 'rgba(255,255,255,0.22)', color: '#fff' }}
          >
            Go to {DOMAIN_LABEL[domain]} <ArrowRight size={16} strokeWidth={2.4} />
          </button>
        )}
      </div>
    </div>
  );
}
