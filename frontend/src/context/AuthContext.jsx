import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { isUserInactive, clearActivity, markSessionExpired, DEFAULT_INACTIVITY_MINUTES } from '../utils/activityTracker';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Auto-logout: if a session exists but the user has been inactive past
      // the threshold, sign out instead of restoring it. ProtectedRoute then
      // redirects to /login, where a flag shows the "session expired" toast.
      if (session && isUserInactive(DEFAULT_INACTIVITY_MINUTES)) {
        markSessionExpired();
        clearActivity();
        supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email, password, name) => {
    try {
      setError(null);

      // Use backend admin API so the account is auto-confirmed (no email verification needed)
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      // Auto sign-in after account creation
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      return { success: true, user: data.user };
    } catch (err) {
      const msg = formatError(err.message);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      // Route through backend so the server-side authLimiter (5 attempts/15 min) fires
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      // Hydrate the local Supabase client with the session returned by the backend
      if (json.session) {
        await supabase.auth.setSession({
          access_token:  json.session.access_token,
          refresh_token: json.session.refresh_token,
        });
      }
      return { success: true, user: json.user };
    } catch (err) {
      const msg = formatError(err.message);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    setError(null);
    clearActivity();
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error);
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      const msg = formatError(err.message);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, error, signup, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

function formatError(message) {
  if (message.includes('Invalid login credentials')) return 'Invalid email or password';
  if (message.includes('Email not confirmed')) return 'EMAIL_NOT_CONFIRMED';
  if (message.includes('User already registered') || message.includes('already registered')) return 'Email already registered';
  if (message.includes('Password should be at least')) return 'Password must be at least 8 characters';
  if (message.includes('Unable to validate email') || message.includes('valid email')) return 'Please enter a valid email address';
  return message;
}

export default AuthContext;
