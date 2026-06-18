// ErrorBoundary — catches render/lifecycle crashes in any descendant and shows
// a friendly fallback instead of a blank white screen.
//
// Must be a class component (React only supports error boundaries via the
// getDerivedStateFromError / componentDidCatch lifecycle, not hooks).
//
// Limitations (handle these separately): does NOT catch errors in event
// handlers, async code (promises/setTimeout), or the boundary itself. Those
// need their own try/catch.

import React from 'react';
import * as Sentry from '@sentry/react';
import ErrorFallback from './ErrorFallback';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log for local debugging.
    console.error('[ErrorBoundary] caught a render error:', error, errorInfo);
    // Report to Sentry. Safe to call unconditionally — it's a no-op when
    // Sentry wasn't initialized (no DSN configured).
    Sentry.captureException(error, { extra: { componentStack: errorInfo?.componentStack } });
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (fallback) return fallback;
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
