// Unified topic registry for the Daily Cipher (daily challenge).
// Flattens every domain's learnable topics into one list with the info needed
// to (a) randomize a daily pick and (b) launch that domain's learning flow.
//
// Each entry: { domain, name, topicId|null, difficulty, learnPath }
//   - learnPath + buildLearnState() reproduce each domain's existing navigate()
//     call so "Start Challenge" drops the user straight into the lesson.

import { MUSIC_TOPICS } from './musicTopics';

// difficulty buckets used for weighted random selection
// (easy ~60%, medium ~30%, hard ~10%)
const DIFF_WEIGHT = { easy: 6, medium: 3, hard: 1 };

// ── Gaming — names only; /gaming/learn { topic, nextTopic } ───────────────────
const GAMING_NAMES = [
  'Budgeting Basics', 'Saving Money', 'Emergency Funds', 'Simple Interest',
  'Compound Interest', 'Credit Scores', 'Investing Basics', 'Stocks & Bonds',
  'Retirement Accounts', 'Tax Fundamentals', 'Debt Management', 'Portfolio Diversification',
];

// ── Fashion — names only; /fashion/learn { topic, nextTopic } ─────────────────
const FASHION_NAMES = [
  'Budgeting Basics', 'Saving Money', 'Emergency Funds', 'Simple Interest',
  'Compound Interest', 'Credit Scores', 'Investing Basics', 'Stocks & Bonds',
  'Debt Management', 'Retirement Accounts', 'Tax Fundamentals',
  'Portfolio Diversification', 'Advanced Planning',
];

// ── Sports — id + name; /sports/learn { topic, topicId, nextTopic, nextTopicId } ─
const SPORTS_TOPICS = [
  { id: 's0t0', name: 'Budgeting Basics' },   { id: 's0t1', name: 'Saving 101' },
  { id: 's0t2', name: 'Income Tracking' },    { id: 's0t3', name: 'Emergency Funds' },
  { id: 's1t0', name: 'Investment Basics' },  { id: 's1t1', name: 'Debt Management' },
  { id: 's1t2', name: 'Credit Scores' },      { id: 's1t3', name: 'Tax Fundamentals' },
  { id: 's2t0', name: 'Portfolio Building' }, { id: 's2t1', name: 'Retirement Planning' },
  { id: 's2t2', name: 'Real Estate' },        { id: 's2t3', name: 'Wealth Building' },
];

// Assign a difficulty tier by position in a domain's ordered list.
function tierByIndex(i, total) {
  if (i < total * 0.42) return 'easy';
  if (i < total * 0.75) return 'medium';
  return 'hard';
}

const DOMAIN_META = {
  gaming:  { color: '#5B8DEF', label: 'Gaming',  learnPath: '/gaming/learn'  },
  fashion: { color: '#EC4899', label: 'Fashion', learnPath: '/fashion/learn' },
  sports:  { color: '#E8457A', label: 'Sports',  learnPath: '/sports/learn'  },
  music:   { color: '#D798A3', label: 'Music',   learnPath: '/music/learn'   },
};

// Build the flat registry
const REGISTRY = [
  ...GAMING_NAMES.map((name, i) => ({
    domain: 'gaming', name, topicId: null,
    difficulty: tierByIndex(i, GAMING_NAMES.length),
  })),
  ...FASHION_NAMES.map((name, i) => ({
    domain: 'fashion', name, topicId: null,
    difficulty: tierByIndex(i, FASHION_NAMES.length),
  })),
  ...SPORTS_TOPICS.map((t, i) => ({
    domain: 'sports', name: t.name, topicId: t.id,
    difficulty: tierByIndex(i, SPORTS_TOPICS.length),
  })),
  ...MUSIC_TOPICS.map((t, i) => ({
    domain: 'music', name: t.name, topicId: t.id,
    difficulty: tierByIndex(i, MUSIC_TOPICS.length),
  })),
].map((t) => ({
  ...t,
  // Stable unique key for a topic across domains (same name can repeat per domain)
  key: `${t.domain}:${t.topicId || t.name}`,
  color: DOMAIN_META[t.domain].color,
  domainLabel: DOMAIN_META[t.domain].label,
  learnPath: DOMAIN_META[t.domain].learnPath,
}));

export const DAILY_CHALLENGE_TOPICS = REGISTRY;

export const getTopicByKey = (key) => REGISTRY.find((t) => t.key === key) || null;

export const getTopicsForDomain = (domain) => REGISTRY.filter((t) => t.domain === domain);

// Reproduce each domain's navigate() state so the lesson opens correctly.
export function buildLearnState(topic) {
  if (!topic) return {};
  if (topic.domain === 'sports' || topic.domain === 'music') {
    return { topic: topic.name, topicId: topic.topicId, nextTopic: null, nextTopicId: null };
  }
  // gaming + fashion
  return { topic: topic.name, nextTopic: null };
}

// ── Weighted, no-repeat random pick ───────────────────────────────────────────
// Prefers topics the user hasn't completed; never repeats the previous key;
// weights by difficulty (easy more likely). `rng` defaults to Math.random.
export function pickDailyTopic({ domain = null, completedNames = [], excludeKey = null, rng = Math.random } = {}) {
  let pool = REGISTRY.filter((t) => t.key !== excludeKey);
  if (domain) pool = pool.filter((t) => t.domain === domain);
  if (!pool.length) pool = REGISTRY.filter((t) => !domain || t.domain === domain); // ignore excludeKey if it emptied the pool
  const fresh = pool.filter((t) => !completedNames.includes(t.name));
  const candidates = fresh.length ? fresh : pool; // fall back to any if all done

  const weighted = [];
  candidates.forEach((t) => {
    const w = DIFF_WEIGHT[t.difficulty] || 3;
    for (let i = 0; i < w; i++) weighted.push(t);
  });
  return weighted[Math.floor(rng() * weighted.length)] || candidates[0];
}
