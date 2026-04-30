import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-400', 'bg-green-400'];

const Signup = () => {
  const navigate = useNavigate();
  const { signup, user, loading: authLoading } = useAuth();
  const { onboardingComplete, loading: userLoading } = useUser();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect already-logged-in users to the right place
  useEffect(() => {
    if (!authLoading && !userLoading && user) {
      navigate(onboardingComplete ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [user, authLoading, userLoading, onboardingComplete, navigate]);

  const passwordStrength = getStrength(form.password);
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Please enter your name'); return; }
    if (!form.email.trim()) { setError('Please enter your email'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (form.password !== form.confirm) { setError("Passwords don't match"); return; }

    setLoading(true);
    const result = await signup(form.email.trim(), form.password, form.name.trim());
    if (result.success) {
      navigate('/onboarding', { replace: true });
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-cosmic-violet/30 border border-cosmic-purple/30 text-white placeholder-cosmic-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cosmic-indigo focus:ring-1 focus:ring-cosmic-indigo/30 transition-all";
  const labelClass = "block text-cosmic-white/60 text-xs font-medium uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-cosmic-navy flex items-center justify-center p-4 relative overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cosmic-purple/20 animate-float pointer-events-none"
          style={{
            width: (i % 3 + 2) + 'px',
            height: (i % 3 + 2) + 'px',
            left: ((i * 41 + 8) % 100) + '%',
            top: ((i * 59 + 12) % 100) + '%',
            animationDelay: (i * 0.25) % 3 + 's',
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
          <p className="text-cosmic-white/50 mt-2 text-sm">Start your financial learning journey</p>
        </div>

        <div
          className="bg-cosmic-deep/90 backdrop-blur-sm rounded-2xl p-8"
          style={{ border: '1px solid rgba(108, 60, 224, 0.4)', boxShadow: '0 0 40px rgba(108, 60, 224, 0.2)' }}
        >
          <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
          <p className="text-cosmic-white/40 text-sm mb-6">Free forever. No credit card needed.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/15 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg mb-5 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="Your name"
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className={inputClass + ' pr-16'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cosmic-white/40 hover:text-cosmic-white/70 transition-colors text-xs font-medium"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>

              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-cosmic-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-cosmic-white/40">
                    Strength: <span className="text-cosmic-white/70">{strengthLabels[passwordStrength]}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={update('confirm')}
                placeholder="Repeat your password"
                autoComplete="new-password"
                className={inputClass}
              />
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-red-400 mt-1">Passwords don't match</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                background: loading
                  ? 'rgba(108, 60, 224, 0.5)'
                  : 'linear-gradient(135deg, #6c3ce0, #4f46e5)'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-cosmic-white/40 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-cosmic-glow hover:text-cosmic-cyan transition-colors font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
