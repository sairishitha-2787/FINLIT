// FINLIT Backend Server
// Express API for AI-powered financial literacy platform

require('dotenv').config();

// ── Validate required env vars before anything else ──────────────────────────
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'GROQ_API_KEY'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[STARTUP] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const cron    = require('node-cron');

const { generateDeepExplanation, generateQuizWithGroq } = require('./services/explanationGenerator');
const { getCorrectGif, getWrongGif, getCelebrationGif } = require('./services/giphyService');
const { interestDomains, financialTopics }  = require('./config/interestDomains');
const authRoutes     = require('./routes/auth');
const mentorRoutes   = require('./routes/mentor');
const recommendRoutes = require('./routes/recommendations');
const chapterRoutes  = require('./routes/chapters');
const quizRoutes     = require('./routes/quiz');
const { deleteStaleUnonboardedUsers } = require('./services/cleanupService');
const { reExplain }  = require('./services/adaptiveExplainer');
const { authLimiter, apiLimiter, aiLimiter } = require('./middleware/rateLimiter');
const requireAuth    = require('./middleware/requireAuth');
const errorHandler   = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:      ["'self'"],
      scriptSrc:       ["'self'"],                          // no unsafe-inline
      styleSrc:        ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc:         ["'self'", 'fonts.gstatic.com'],
      imgSrc:          ["'self'", 'data:', 'https://media.giphy.com', 'https://media0.giphy.com', 'https://media1.giphy.com', 'https://media2.giphy.com', 'https://media3.giphy.com', 'https://media4.giphy.com'],
      connectSrc:      ["'self'", process.env.SUPABASE_URL, 'https://api.groq.com'],
      frameAncestors:  ["'none'"],                          // clickjacking
      baseUri:         ["'self'"],
      formAction:      ["'self'"],
      objectSrc:       ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// Permissions-Policy — disable sensitive browser features we don't use
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  next();
});

// ── HTTPS redirect in production ─────────────────────────────────────────────
if (isProd) {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(301, `https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

// ── CORS — whitelist only known origins ──────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // In production: reject requests with no origin (prevents server-side abuse)
    // In development: allow no-origin for curl/Postman convenience
    if (!origin) {
      if (isProd) return callback(new Error('CORS: direct server-to-server calls not permitted'));
      return callback(null, true);
    }
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50kb' })); // Cap payload size

// ── Request logging ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api/', apiLimiter);
app.use('/api/auth/login',  authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/explain',     aiLimiter);
app.use('/api/quiz/generate', aiLimiter);

// ── Auth gate on all AI generation routes ────────────────────────────────────
app.use('/api/explain',    requireAuth);
app.use('/api/quiz',       requireAuth);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/mentor',    mentorRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/chapters',  chapterRoutes);
app.use('/api/quiz',      quizRoutes);

// Health check — minimal info in production
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), ...(isProd ? {} : { service: 'FINLIT Backend' }) });
});

// Interest domains
app.get('/api/interests', (_req, res) => {
  res.json({ success: true, interests: interestDomains });
});

// Topics by difficulty
app.get('/api/topics', (req, res) => {
  const { difficulty } = req.query;
  res.json({
    success: true,
    topics: difficulty && financialTopics[difficulty] ? financialTopics[difficulty] : financialTopics,
    ...(difficulty && { difficulty }),
  });
});

// Adaptive re-explanation
app.post('/api/explain/adaptive', async (req, res, next) => {
  try {
    const { topic, domain, confusionPoint, previousExplanation, question } = req.body;
    if (!topic || !domain || (!confusionPoint && !question)) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    console.log(`[Adaptive] "${topic}" | ${domain} | confusion="${confusionPoint || 'question'}"`);
    const result = await reExplain(topic, domain, {
      confusionPoint: confusionPoint || 'concept',
      previousExplanation: previousExplanation || '',
      question: question || null,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Deep explanation (AI)
app.post('/api/explain', async (req, res, next) => {
  try {
    const { topic, interest, difficulty, variation } = req.body;
    if (!topic || !interest) {
      return res.status(400).json({ success: false, error: 'Missing required fields: topic and interest' });
    }
    const safeVariation = Math.max(0, Math.min(2, parseInt(variation) || 0));
    console.log(`[Explain] "${topic}" | ${interest} | ${difficulty || 'beginner'} | variation=${safeVariation}`);
    const result = await generateDeepExplanation(topic, interest, {
      difficulty: difficulty || 'beginner',
      variation: safeVariation,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Quiz generation
app.post('/api/quiz', async (req, res, next) => {
  try {
    const { topic, interest, difficulty } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, error: 'Missing required field: topic' });
    }
    const domain = interest || 'general';
    console.log(`[Quiz] "${topic}" | ${domain} | ${difficulty || 'beginner'}`);
    const result = await generateQuizWithGroq(topic, domain, difficulty || 'beginner');
    if (result.success && result.questions.length > 0) {
      res.json(result);
    } else {
      res.status(500).json({ success: false, error: 'Failed to generate quiz questions' });
    }
  } catch (err) {
    next(err);
  }
});

// GIF endpoints — optional ?domain=gaming|fashion|sports
app.get('/api/gifs/correct',     async (req, res, next) => { try { res.json(await getCorrectGif(req.query.domain));     } catch (e) { next(e); } });
app.get('/api/gifs/wrong',       async (req, res, next) => { try { res.json(await getWrongGif(req.query.domain));       } catch (e) { next(e); } });
app.get('/api/gifs/celebration', async (_req, res, next) => { try { res.json(await getCelebrationGif());                } catch (e) { next(e); } });

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Scheduled cleanup ─────────────────────────────────────────────────────────
cron.schedule('0 3 * * *', () => {
  deleteStaleUnonboardedUsers().catch(err =>
    console.error('[Cleanup] Cron job failed:', err.message)
  );
});
console.log('[Cleanup] Stale-user cron scheduled — runs daily at 03:00');

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║           FINLIT Backend Server           ║
║    AI-Powered Financial Literacy          ║
║                                           ║
╚═══════════════════════════════════════════╝

Server running on port ${PORT}
Environment: ${process.env.NODE_ENV || 'development'}
Frontend URL: ${process.env.FRONTEND_URL || '(not set)'}
  `);
});

module.exports = app;
