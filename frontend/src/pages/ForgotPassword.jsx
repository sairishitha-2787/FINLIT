import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address'); return; }

    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-navy flex items-center justify-center p-4 relative overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cosmic-purple/20 animate-float pointer-events-none"
          style={{
            width: (i % 3 + 2) + 'px',
            height: (i % 3 + 2) + 'px',
            left: ((i * 43 + 7) % 100) + '%',
            top: ((i * 61 + 11) % 100) + '%',
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
        </div>

        <div
          className="bg-cosmic-deep/90 backdrop-blur-sm rounded-2xl p-8"
          style={{ border: '1px solid rgba(108, 60, 224, 0.4)', boxShadow: '0 0 40px rgba(108, 60, 224, 0.2)' }}
        >
          {!success ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">Reset password</h2>
              <p className="text-cosmic-white/40 text-sm mb-6">
                Enter your email and we'll send you a reset link
              </p>

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
                      Sending...
                    </span>
                  ) : 'Send Reset Link'}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="text-5xl mb-4">📬</div>
              <h2 className="text-2xl font-bold text-white mb-2">Check your inbox</h2>
              <p className="text-cosmic-white/50 text-sm mb-6">
                We sent a password reset link to{' '}
                <span className="text-cosmic-glow">{email}</span>
              </p>
              <p className="text-cosmic-white/30 text-xs">
                Didn't get it? Check your spam folder or{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-cosmic-glow hover:text-cosmic-cyan transition-colors underline"
                >
                  try again
                </button>
              </p>
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-cosmic-white/40 text-sm hover:text-cosmic-white/70 transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
