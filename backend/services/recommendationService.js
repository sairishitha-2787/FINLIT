// FINLIT — Smart Recommendation Service
// Scores all uncompleted topics and generates personalized reasons

const { TOPICS, TOPIC_MAP } = require('../config/topicDependencies');

// ─── Scoring weights ──────────────────────────────────────────────────────────
const W = {
  DIFFICULTY_MATCH:       40,
  DIFFICULTY_STRETCH:     20, // one level up when avg score is good
  PREREQUISITE_ALL_MET:   30,
  PREREQUISITE_PARTIAL:   15, // per met prerequisite
  RECENT_RELATED:         20, // related topic completed in last 3
  ANY_RELATED:            10,
  NO_PREREQUISITES:       15, // open / beginner-friendly
  CATEGORY_DIVERSITY:     12, // unexplored category
  CATEGORY_PENALTY:       -8, // overrepresented category
  RANDOM_JITTER:           5, // slight shuffle for variety
};

const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced'];

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * Generate ranked, enriched recommendations for a user.
 *
 * @param {object} ctx
 * @param {string[]} ctx.completedTopics  - Names of topics the user finished
 * @param {string}   ctx.interest         - User's primary interest domain
 * @param {string}   ctx.difficulty       - User's current difficulty level
 * @param {number}   ctx.avgScore         - Average quiz score 0–100
 * @param {string[]} ctx.goals            - Onboarding goals (optional)
 * @param {boolean}  ctx.shuffle          - Add extra jitter for "show different" requests
 * @param {number}   ctx.limit            - Max recommendations to return (default 5)
 * @returns {object[]} Array of enriched topic objects
 */
function generateRecommendations(ctx) {
  const {
    completedTopics = [],
    interest = 'general',
    difficulty = 'beginner',
    avgScore = 0,
    goals = [],
    shuffle = false,
    limit = 5,
  } = ctx;

  const completedSet = new Set(completedTopics);
  const recentThree = completedTopics.slice(0, 3); // most recently completed

  // Category completion counts — for diversity bonus/penalty
  const categoryCount = {};
  completedTopics.forEach(name => {
    const meta = TOPIC_MAP[name];
    if (meta) categoryCount[meta.category] = (categoryCount[meta.category] || 0) + 1;
  });

  // Filter to only uncompleted topics
  const candidates = TOPICS.filter(t => !completedSet.has(t.name));

  if (candidates.length === 0) {
    // All done — suggest retaking lowest-score topics (caller handles this case)
    return [];
  }

  const jitterRange = shuffle ? W.RANDOM_JITTER * 3 : W.RANDOM_JITTER;

  const scored = candidates.map(topic => {
    let score = 0;
    const signals = []; // used later for reason generation

    // ── 1. Difficulty fit ─────────────────────────────────────────────────
    const userLevelIdx = LEVEL_ORDER.indexOf(difficulty);
    const topicLevelIdx = LEVEL_ORDER.indexOf(topic.difficulty);

    if (topic.difficulty === difficulty) {
      score += W.DIFFICULTY_MATCH;
      signals.push('same_level');
    } else if (topicLevelIdx === userLevelIdx + 1 && avgScore >= 75) {
      score += W.DIFFICULTY_STRETCH;
      signals.push('stretch');
    } else if (topicLevelIdx < userLevelIdx) {
      score += 8; // foundation reinforcement
      signals.push('foundation');
    }

    // ── 2. Prerequisites ──────────────────────────────────────────────────
    const metPrereqs = topic.prerequisites.filter(p => completedSet.has(p));
    const totalPrereqs = topic.prerequisites.length;

    if (totalPrereqs === 0) {
      score += W.NO_PREREQUISITES;
      signals.push('open');
    } else if (metPrereqs.length === totalPrereqs) {
      score += W.PREREQUISITE_ALL_MET;
      signals.push(`prereq_met:${metPrereqs[0]}`);
    } else if (metPrereqs.length > 0) {
      score += W.PREREQUISITE_PARTIAL * metPrereqs.length;
      signals.push(`prereq_partial:${metPrereqs[0]}`);
    } else {
      score -= 15; // hard to jump into without prereqs
    }

    // ── 3. Related topic recency ──────────────────────────────────────────
    const recentRelated = topic.related.filter(r => recentThree.includes(r));
    const anyRelated = topic.related.filter(r => completedSet.has(r));

    if (recentRelated.length > 0) {
      score += W.RECENT_RELATED;
      signals.push(`recent:${recentRelated[0]}`);
    } else if (anyRelated.length > 0) {
      score += W.ANY_RELATED;
      signals.push(`related:${anyRelated[0]}`);
    }

    // ── 4. Category diversity ─────────────────────────────────────────────
    const catDone = categoryCount[topic.category] || 0;
    if (catDone === 0) {
      score += W.CATEGORY_DIVERSITY;
      signals.push('new_category');
    } else if (catDone >= 3) {
      score += W.CATEGORY_PENALTY;
    }

    // ── 5. Goal alignment (keyword match) ────────────────────────────────
    if (goals.length > 0) {
      const goalText = goals.join(' ').toLowerCase();
      const tagMatch = topic.tags.some(tag => goalText.includes(tag));
      if (tagMatch) {
        score += 8;
        signals.push('goal_match');
      }
    }

    // ── 6. Random jitter (prevents stale identical results) ───────────────
    score += Math.random() * jitterRange;

    return { topic, score, signals };
  });

  // Sort descending by score, take top N
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);

  // Build enriched result objects
  return top.map(({ topic, signals }) => ({
    name: topic.name,
    difficulty: topic.difficulty,
    category: topic.category,
    estimatedMinutes: topic.estimatedMinutes,
    reason: buildReason(topic, signals, completedTopics, interest, avgScore, difficulty),
    tags: topic.tags,
  }));
}

// ─── Reason generator ────────────────────────────────────────────────────────

function buildReason(topic, signals, completedTopics, interest, avgScore, userDifficulty) {
  // Priority order: most specific → most generic

  // 1. Prerequisite just met
  const prereqSignal = signals.find(s => s.startsWith('prereq_met:'));
  if (prereqSignal) {
    const prereq = prereqSignal.split(':')[1];
    return `Builds on your mastery of ${prereq}`;
  }

  // 2. Recently related topic
  const recentSignal = signals.find(s => s.startsWith('recent:'));
  if (recentSignal) {
    const related = recentSignal.split(':')[1];
    return `Since you completed ${related}, this is a natural next step`;
  }

  // 3. Stretch to next level
  if (signals.includes('stretch')) {
    return `You're ready for intermediate topics — your ${avgScore}% average proves it`;
  }

  // 4. Any completed related topic
  const relatedSignal = signals.find(s => s.startsWith('related:'));
  if (relatedSignal) {
    const related = relatedSignal.split(':')[1];
    return `Complements what you learned in ${related}`;
  }

  // 5. Goal alignment
  if (signals.includes('goal_match')) {
    return `Directly supports one of your financial goals`;
  }

  // 6. New category = branch out
  if (signals.includes('new_category')) {
    const catLabel = CATEGORY_LABELS[topic.category] || topic.category;
    return `Expand your skills into ${catLabel} — an area you haven't explored yet`;
  }

  // 7. New user with no completions
  if (completedTopics.length === 0) {
    return 'Highly recommended starting point for beginners';
  }

  // 8. Popular/generic fallback
  if (completedTopics.length > 0) {
    const prev = completedTopics[0];
    return `Popular choice after ${prev}`;
  }

  return `Perfect for your ${interest} interest`;
}

const CATEGORY_LABELS = {
  basics:    'Money Basics',
  investing: 'Investing',
  debt:      'Debt & Credit',
  life:      'Life Planning',
  economics: 'Economics',
};

// ─── Fallback popular topics ──────────────────────────────────────────────────

const FALLBACK_RECOMMENDATIONS = [
  { name: 'Budgeting Basics',   difficulty: 'beginner',      category: 'basics',    estimatedMinutes: 8,  reason: 'Highly recommended starting point for beginners',     tags: ['budget'] },
  { name: 'Saving Money',       difficulty: 'beginner',      category: 'basics',    estimatedMinutes: 7,  reason: 'Essential foundation for your financial journey',       tags: ['savings'] },
  { name: 'Emergency Funds',    difficulty: 'beginner',      category: 'basics',    estimatedMinutes: 9,  reason: 'Critical safety net every beginner should have',        tags: ['emergency'] },
  { name: 'Credit vs Debit',    difficulty: 'beginner',      category: 'basics',    estimatedMinutes: 8,  reason: 'Popular choice among learners',                         tags: ['credit'] },
  { name: 'Compound Interest',  difficulty: 'intermediate',  category: 'investing', estimatedMinutes: 10, reason: 'The 8th wonder of the world — you need to know this',    tags: ['interest'] },
];

function getFallbackRecommendations(completedTopics = [], limit = 5) {
  const done = new Set(completedTopics);
  return FALLBACK_RECOMMENDATIONS.filter(r => !done.has(r.name)).slice(0, limit);
}

module.exports = { generateRecommendations, getFallbackRecommendations };
