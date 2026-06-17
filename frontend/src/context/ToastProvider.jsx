// ToastProvider — centralized, ephemeral notification system.
//
// One provider at the app root owns the queue, timers, and the fixed viewport.
// Components call useToast() and get a tiny API: toast.success/error/warning/
// info/celebration(message, opts?). Each call captures the current domain
// theme (via useTheme()) so the toast matches whatever domain fired it; toasts
// fired from neutral screens fall back to a default dark style.
//
// This is distinct from the persistent notification center (notificationsService
// + NotificationBell). Toasts are transient UX feedback; notifications persist.

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

const DEFAULT_DURATION = 3000;
const CELEBRATION_DURATION = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((toast) => {
    const id = ++idRef.current;
    // Cap the stack so a burst of events can't fill the screen.
    setToasts((prev) => [...prev.slice(-3), { id, ...toast }]);
    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 99999,
          display: 'flex', flexDirection: 'column', gap: 10,
          width: 'min(380px, calc(100vw - 32px))',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              type={t.type}
              message={t.message}
              theme={t.theme}
              action={t.action}
              duration={t.duration}
              onClose={() => remove(t.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// useToast — captures the current domain theme so toasts are domain-aware.
export function useToast() {
  const ctx = useContext(ToastContext);
  const theme = useTheme(); // null outside a domain layout → neutral styling

  const fire = useCallback(
    (type, message, opts = {}) => {
      if (!ctx) {
        // Provider missing — degrade gracefully rather than crash.
        if (process.env.NODE_ENV === 'development') console.warn('useToast used outside ToastProvider');
        return null;
      }
      const duration = opts.duration
        ?? (type === 'celebration' ? CELEBRATION_DURATION : DEFAULT_DURATION);
      return ctx.add({ type, message, theme, action: opts.action, duration });
    },
    [ctx, theme],
  );

  return {
    success:     (message, opts) => fire('success', message, opts),
    error:       (message, opts) => fire('error', message, opts),
    warning:     (message, opts) => fire('warning', message, opts),
    info:        (message, opts) => fire('info', message, opts),
    celebration: (message, opts) => fire('celebration', message, opts),
    dismiss:     (id) => ctx?.remove(id),
  };
}
