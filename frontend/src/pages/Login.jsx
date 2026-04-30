import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, user, loading: authLoading } = useAuth();
  const { onboardingComplete, loading: userLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect already-logged-in users to the right place
  useEffect(() => {
    if (!authLoading && !userLoading && user) {
      navigate(onboardingComplete ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [user, authLoading, userLoading, onboardingComplete, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password) { setError('Please enter your password'); return; }

    setLoading(true);
    const result = await login(email.trim(), password);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
    // Navigation is handled by the useEffect below once auth state confirms the user
  };

  return (
    <div className="min-h-screen bg-cosmic-navy flex items-center justify-center p-4 relative overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cosmic-purple/20 animate-float pointer-events-none"
          style={{
            width: (i % 3 + 2) + 'px',
            height: (i % 3 + 2) + 'px',
            left: ((i * 37 + 10) % 100) + '%',
            top: ((i * 53 + 5) % 100) + '%',
            animationDelay: (i * 0.3) % 3 + 's',
            animationDuration: (i % 3 + 3) + 's'
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-5xl font-black text-brutal-green hover:opacity-80 transition-opacity cursor-pointer">
              FINLIT
            </h1>
          </Link>
          <p className="text-cosmic-white/50 mt-2 text-sm">Master your financial future</p>
        </div>

        <div
          className="bg-cosmic-deep/90 backdrop-blur-sm rounded-2xl p-8"
          style={{ border: '1px solid rgba(108, 60, 224, 0.4)', boxShadow: '0 0 40px rgba(108, 60, 224, 0.2)' }}
        >
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-cosmic-white/40 text-sm mb-6">Sign in to continue your learning</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={`px-4 py-3 rounded-lg mb-5 text-sm ${
                error === 'EMAIL_NOT_CONFIRMED'
                  ? 'bg-yellow-500/15 border border-yellow-500/40 text-yellow-300'
                  : 'bg-red-500/15 border border-red-500/40 text-red-300'
              }`}
            >
              {error === 'EMAIL_NOT_CONFIRMED' ? (
                <>
                  Email not confirmed.{' '}
                  <span className="font-semibold">Check your inbox</span> for a confirmation link,
                  or ask your admin to disable email confirmation in Supabase.
                </>
              ) : error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-cosmic-white/60 text-xs font-medium uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full bg-cosmic-violet/30 border border-cosmic-purple/30 text-white placeholder-cosmic-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cosmic-indigo focus:ring-1 focus:ring-cosmic-indigo/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-cosmic-white/60 text-xs font-medium uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-cosmic-violet/30 border border-cosmic-purple/30 text-white placeholder-cosmic-white/20 rounded-xl px-4 py-3 pr-16 text-sm focus:outline-none focus:border-cosmic-indigo focus:ring-1 focus:ring-cosmic-indigo/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cosmic-white/40 hover:text-cosmic-white/70 transition-colors text-xs font-medium"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-cosmic-glow/80 text-xs hover:text-cosmic-cyan transition-colors">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? 'rgba(108, 60, 224, 0.5)'
                  : 'linear-gradient(135deg, #6c3ce0, #4f46e5)'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-cosmic-white/40 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-cosmic-glow hover:text-cosmic-cyan transition-colors font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
