const express = require('express');
const router = express.Router();
const { generateRecommendations, getFallbackRecommendations } = require('../services/recommendationService');

const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

// ─── POST /api/recommend ──────────────────────────────────────────────────────
// Full smart recommendations with personalized reasons

router.post('/', (req, res) => {
  try {
    const {
      completedTopics = [],
      interest = 'general',
      difficulty = 'beginner',
      avgScore = 0,
      goals = [],
      shuffle = false,
      limit = 5,
    } = req.body;

    const safeDifficulty = VALID_DIFFICULTIES.includes(difficulty) ? difficulty : 'beginner';
    const safeLimit = Math.min(Math.max(1, parseInt(limit) || 5), 10);

    let recommendations;
    try {
      recommendations = generateRecommendations({
        completedTopics: Array.isArray(completedTopics) ? completedTopics : [],
        interest: String(interest || 'general'),
        difficulty: safeDifficulty,
        avgScore: Number(avgScore) || 0,
        goals: Array.isArray(goals) ? goals : [],
        shuffle: Boolean(shuffle),
        limit: safeLimit,
      });

      // All topics done — suggest retaking low-score ones or celebrate
      if (recommendations.length === 0) {
        return res.json({
          success: true,
          recommendations: [],
          allCompleted: true,
          userContext: buildUserContext(completedTopics, avgScore, safeDifficulty),
        });
      }
    } catch (err) {
      console.error('[Recommend] Algorithm error, using fallback:', err.message);
      recommendations = getFallbackRecommendations(completedTopics, safeLimit);
    }

    res.json({
      success: true,
      recommendations,
      userContext: buildUserContext(completedTopics, avgScore, safeDifficulty),
    });
  } catch (err) {
    console.error('[Recommend] Error:', err);
    res.status(500).json({ success: false, error: 'Recommendation service unavailable' });
  }
});

// ─── GET /api/recommend/next-topic ────────────────────────────────────────────
// Returns just the single #1 recommendation — for quick dashboard widgets

router.get('/next-topic', (req, res) => {
  try {
    const {
      completedTopics,
      interest = 'general',
      difficulty = 'beginner',
      avgScore = '0',
    } = req.query;

    const completed = completedTopics
      ? completedTopics.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const safeDifficulty = VALID_DIFFICULTIES.includes(difficulty) ? difficulty : 'beginner';

    let recs;
    try {
      recs = generateRecommendations({
        completedTopics: completed,
        interest,
        difficulty: safeDifficulty,
        avgScore: parseFloat(avgScore) || 0,
        limit: 1,
      });
    } catch {
      recs = getFallbackRecommendations(completed, 1);
    }

    if (recs.length === 0) {
      return res.json({ success: true, topic: null, allCompleted: true });
    }

    res.json({ success: true, topic: recs[0] });
  } catch (err) {
    console.error('[Recommend] next-topic error:', err);
    res.status(500).json({ success: false, error: 'Recommendation service unavailable' });
  }
});

function buildUserContext(completedTopics, avgScore, difficulty) {
  return {
    completedCount: completedTopics.length,
    avgScore: Math.round(Number(avgScore) || 0),
    currentLevel: difficulty,
  };
}

module.exports = router;
