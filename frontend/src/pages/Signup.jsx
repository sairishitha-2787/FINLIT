import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import GridDistortion from '../components/effects/GridDistortion';
import GlassCard from '../components/core/GlassCard';
import { glass } from '../styles/coreTheme';

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['', '#f87171', '#fbbf24', '#60a5fa', '#34d399'];

const Signup = () => {
  const navigate = useNavigate();
  const { signup, user, loading: authLoading } = useAuth();
  const { onboardingComplete, loading: userLoading } = useUser();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !userLoading && user) {
      navigate(onboardingComplete ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [user, authLoading, userLoading, onboardingComplete, navigate]);

  const strength = getStrength(form.password);
  const update   = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim())                        { setError('Please enter your name'); return; }
    if (!form.email.trim())                       { setError('Please enter your email'); return; }
    if (form.password.length < 8)                 { setError('Password must be at least 8 characters'); return; }
    if (form.password !== form.confirm)           { setError("Passwords don't match"); return; }
    setLoading(true);
    const result = await signup(form.email.trim(), form.password, form.name.trim());
    if (result.success) {
      navigate('/onboarding', { replace: true });
    } else {
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
          <p className="mt-2 text-sm" style={{ color: '#64748b' }}>Start your financial learning journey</p>
        </div>

        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#1e293b' }}>Create account</h2>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>Free forever. No credit card needed.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={glass.label}>Name</label>
              <input type="text" value={form.name} onChange={update('name')} placeholder="Your name" autoComplete="name" className={glass.input} />
            </div>
            <div>
              <label className={glass.label}>Email</label>
              <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" autoComplete="email" className={glass.input} />
            </div>
            <div>
              <label className={glass.label}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className={`${glass.input} pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#94a3b8' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(l => (
                      <div key={l} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{ background: strength >= l ? strengthColors[strength] : '#e2e8f0' }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>
                    Strength: <span className="font-semibold" style={{ color: '#475569' }}>{strengthLabels[strength]}</span>
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className={glass.label}>Confirm Password</label>
              <input type="password" value={form.confirm} onChange={update('confirm')} placeholder="Repeat your password" autoComplete="new-password" className={glass.input} />
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs mt-1 font-medium" style={{ color: '#ef4444' }}>Passwords don't match</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading  ? { scale: 0.98 } : {}}
              className={`w-full py-3 text-sm mt-2 ${glass.accentBtn}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors" style={{ color: '#3A8DFF' }}>Sign in</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Signup;
