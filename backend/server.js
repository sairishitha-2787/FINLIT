// FINLIT Backend Server
// Express API for AI-powered financial literacy platform

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateExplanation, generateQuiz } = require('./services/huggingfaceService');
const { getCorrectGif, getWrongGif, getCelebrationGif } = require('./services/giphyService');
const { interestDomains, financialTopics } = require('./config/interestDomains');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FINLIT Backend'
  });
});

// Get all interest domains
app.get('/api/interests', (req, res) => {
  res.json({
    success: true,
    interests: interestDomains
  });
});

// Get financial topics by difficulty
app.get('/api/topics', (req, res) => {
  const { difficulty } = req.query;

  if (difficulty && financialTopics[difficulty]) {
    res.json({
      success: true,
      topics: financialTopics[difficulty],
      difficulty
    });
  } else {
    res.json({
      success: true,
      topics: financialTopics
    });
  }
});

// Generate personalized explanation
app.post('/api/explain', async (req, res) => {
  try {
    const { topic, interest, difficulty } = req.body;

    // Validation
    if (!topic || !interest) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: topic and interest'
      });
    }

    console.log(`Generating explanation for: ${topic} (${interest}, ${difficulty || 'beginner'})`);

    const result = await generateExplanation(topic, interest, difficulty || 'beginner');

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to generate explanation',
        details: result.error
      });
    }

  } catch (error) {
    console.error('Error in /api/explain:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Generate quiz questions
app.post('/api/quiz', async (req, res) => {
  try {
    const { topic, interest, difficulty } = req.body;

    // Validation
    if (!topic || !interest) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: topic and interest'
      });
    }

    console.log(`Generating quiz for: ${topic} (${interest}, ${difficulty || 'beginner'})`);

    const result = await generateQuiz(topic, interest, difficulty || 'beginner');

    if (result.success && result.questions.length > 0) {
      res.json(result);
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to generate quiz questions',
        details: result.error
      });
    }

  } catch (error) {
    console.error('Error in /api/quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Get GIF for correct answer
app.get('/api/gifs/correct', async (req, res) => {
  try {
    const result = await getCorrectGif();
    res.json(result);
  } catch (error) {
    console.error('Error in /api/gifs/correct:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GIF'
    });
  }
});

// Get GIF for wrong answer
app.get('/api/gifs/wrong', async (req, res) => {
  try {
    const result = await getWrongGif();
    res.json(result);
  } catch (error) {
    console.error('Error in /api/gifs/wrong:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GIF'
    });
  }
});

// Get celebration GIF
app.get('/api/gifs/celebration', async (req, res) => {
  try {
    const result = await getCelebrationGif();
    res.json(result);
  } catch (error) {
    console.error('Error in /api/gifs/celebration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GIF'
    });
  }
});

// Get recommended topics based on user profile
app.post('/api/recommend', async (req, res) => {
  try {
    const { difficulty, completedTopics } = req.body;
    const level = difficulty || 'beginner';

    // Get topics for the user's level
    let availableTopics = financialTopics[level] || financialTopics.beginner;

    // Filter out completed topics
    if (completedTopics && Array.isArray(completedTopics)) {
      availableTopics = availableTopics.filter(
        topic => !completedTopics.includes(topic)
      );
    }

    // Return top 3 recommendations
    const recommendations = availableTopics.slice(0, 3);

    res.json({
      success: true,
      recommendations,
      totalAvailable: availableTopics.length
    });

  } catch (error) {
    console.error('Error in /api/recommend:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║           FINLIT Backend Server           ║
║    AI-Powered Financial Literacy          ║
║                                           ║
╚═══════════════════════════════════════════╝

🚀 Server running on port ${PORT}
🌐 Frontend URL: ${process.env.FRONTEND_URL}
📚 API endpoints ready:
   - POST /api/explain
   - POST /api/quiz
   - GET  /api/gifs/correct
   - GET  /api/gifs/wrong
   - GET  /api/gifs/celebration
   - GET  /api/interests
   - GET  /api/topics
   - POST /api/recommend

✨ Ready to teach finance!
  `);
});

module.exports = app;
