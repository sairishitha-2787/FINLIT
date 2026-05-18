const rateLimit = require('express-rate-limit');

// NOTE: Default in-memory store resets on restart and doesn't work across
// multiple instances. For production with pm2 clusters or multi-pod deploys,
// replace the store with a Redis adapter (e.g. rate-limit-redis) so limits
// are shared across all processes.

// Auth endpoints — strict (5 per 15 min) to block brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// General API — 100 per 15 min
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI generation endpoints — 30 per hour (generous for dev, tighten in prod)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { success: false, error: 'AI generation limit reached. Please wait before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter, aiLimiter };
