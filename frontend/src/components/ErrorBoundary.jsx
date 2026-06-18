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
    // Log for local debugging. Hook point for Sentry et al. once added.
    console.error('[ErrorBoundary] caught a render error:', error, errorInfo);
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
