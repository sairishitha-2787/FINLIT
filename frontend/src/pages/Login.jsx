import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import GridDistortion from '../components/effects/GridDistortion';
import GlassCard from '../components/core/GlassCard';
import { glass } from '../styles/coreTheme';

const Login = () => {
  const navigate = useNavigate();
  const { login, user, loading: authLoading } = useAuth();
  const { onboardingComplete, loading: userLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !userLoading && user) {
      navigate(onboardingComplete ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [user, authLoading, userLoading, onboardingComplete, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password)     { setError('Please enter your password'); return; }
    setLoading(true);
    const result = await login(email.trim(), password);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className={`${glass.page} flex items-center justify-center p-4`}>
      <GridDistortion grid={15} mouse={0.1} strength={0.15} relaxation={0.9} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-5xl font-black tracking-tight hover:opacity-75 transition-opacity cursor-pointer" style={{ color: '#1a2e4a' }}>
              FIN<span style={{ color: '#3A8DFF' }}>LIT</span>
            </h1>
          </Link>
          <p className="mt-2 text-sm" style={{ color: '#64748b' }}>Master your financial future</p>
        </div>

        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#1e293b' }}>Welcome back</h2>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>Sign in to continue your learning</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={`px-4 py-3 rounded-xl mb-5 text-sm font-medium ${
                error === 'EMAIL_NOT_CONFIRMED'
                  ? 'bg-amber-50 border border-amber-200 text-amber-700'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}
            >
              {error === 'EMAIL_NOT_CONFIRMED' ? (
                <>Email not confirmed. <span className="font-bold">Check your inbox</span> for a confirmation link.</>
              ) : error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={glass.label}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email" className={glass.input} />
            </div>

            <div>
              <label className={glass.label}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`${glass.input} pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#94a3b8' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-semibold transition-colors" style={{ color: '#3A8DFF' }}>
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading  ? { scale: 0.98 } : {}}
              className={`w-full py-3 text-sm ${glass.accentBtn}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: '#94a3b8' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold transition-colors" style={{ color: '#3A8DFF' }}>Create one</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
