// ThemeContext — distributes the normalized domain theme (see normalizeTheme.js)
// to any descendant. Domain layouts wrap their <Outlet> with <ThemeProvider>;
// shared components call useTheme() to style themselves with zero per-domain
// prop wiring.
//
// useTheme() returns null when used outside a provider (e.g. on the shared
// /glossary page). Components should treat null as "no domain context" and fall
// back to their own defaults rather than crashing.

import React, { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ value, children }) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
