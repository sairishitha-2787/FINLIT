import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import AnimatedIcon from '../components/shared/AnimatedIcon';
import { useAuth } from '../context/AuthContext';
import GridDistortion from '../components/effects/GridDistortion';
import GlassCard from '../components/core/GlassCard';
import { glass } from '../styles/coreTheme';

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
    if (result.success) { setSuccess(true); }
    else { setError(result.error || 'Failed to send reset email. Please try again.'); }
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
        </div>

        <GlassCard className="p-8">
          {!success ? (
            <>
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#1e293b' }}>Reset password</h2>
              <p className="text-sm mb-6" style={{ color: '#64748b' }}>Enter your email and we'll send you a reset link</p>

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
                  <label className={glass.label}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" autoComplete="email" className={glass.input} />
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
              <div className="flex justify-center mb-4" style={{ color: '#3A8DFF' }}>
                <AnimatedIcon icon={Mail} size={52} animation="bounce" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#1e293b' }}>Check your inbox</h2>
              <p className="text-sm mb-6" style={{ color: '#64748b' }}>
                We sent a password reset link to{' '}
                <span className="font-semibold" style={{ color: '#3A8DFF' }}>{email}</span>
              </p>
              <p className="text-xs" style={{ color: '#94a3b8' }}>
                Didn't get it? Check your spam folder or{' '}
                <button onClick={() => setSuccess(false)} className="underline transition-colors" style={{ color: '#3A8DFF' }}>
                  try again
                </button>
              </p>
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm inline-flex items-center gap-1.5 transition-colors" style={{ color: '#94a3b8' }}>
              <ArrowLeft size={14} strokeWidth={2.5} />
              Back to sign in
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
