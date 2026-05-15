const express = require('express');
const router  = express.Router();
const { LEARNING_PATHS } = require('../config/learningPaths');
const supabase = require('../config/supabase');

const VALID_DOMAINS = Object.keys(LEARNING_PATHS);

async function getAuthUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return error || !user ? null : user;
}

// ─── GET /api/chapters/:domain ────────────────────────────────────────────────
// Returns chapters enriched with user progress (completed topics from DB)

router.get('/:domain', async (req, res) => {
  try {
    const domain = req.params.domain.toLowerCase();
    if (!VALID_DOMAINS.includes(domain)) {
      return res.status(404).json({ success: false, error: `Unknown domain: ${domain}` });
    }

    const path = LEARNING_PATHS[domain];

    // Try to get user's completed topics from DB
    let completedTopics = [];
    const user = await getAuthUser(req);
    if (user) {
      const { data } = await supabase
        .from('progress')
        .select('topic')
        .eq('user_id', user.id);
      if (data) completedTopics = data.map(r => r.topic);
    }

    const done = new Set(completedTopics);

    const enrichedChapters = path.chapters.map((chapter, idx) => {
      const topicsCompleted = chapter.topics.filter(t => done.has(t)).length;
      const isComplete      = topicsCompleted === chapter.topics.length;
      const prevChapter     = idx > 0 ? path.chapters[idx - 1] : null;
      const prevDone        = prevChapter ? prevChapter.topics.every(t => done.has(t)) : true;
      const isUnlocked      = idx === 0 || prevDone;

      let status;
      if (!isUnlocked)            status = 'locked';
      else if (isComplete)        status = 'completed';
      else if (topicsCompleted > 0) status = 'in_progress';
      else                        status = 'available';

      return {
        ...chapter,
        topicsCompleted,
        topicsTotal: chapter.topics.length,
        isComplete,
        isUnlocked,
        status,
        topicDetails: chapter.topics.map(name => ({
          name,
          alias: chapter.topicAliases?.[name] || null,
          completed: done.has(name),
        })),
      };
    });

    res.json({
      success: true,
      data: {
        domain,
        domainName: path.domainName,
        campaignTitle: path.campaignTitle,
        tagline: path.tagline,
        chapters: enrichedChapters,
      },
    });
  } catch (err) {
    console.error('[Chapters] GET error:', err);
    res.status(500).json({ success: false, error: 'Chapter service unavailable' });
  }
});

// ─── GET /api/chapters/:domain/current ───────────────────────────────────────
// Returns the single active chapter + next topic (lightweight for dashboard widget)

router.get('/:domain/current', async (req, res) => {
  try {
    const domain = req.params.domain.toLowerCase();
    const path   = LEARNING_PATHS[domain];
    if (!path) return res.status(404).json({ success: false, error: 'Unknown domain' });

    let completedTopics = [];
    const user = await getAuthUser(req);
    if (user) {
      const { data } = await supabase.from('progress').select('topic').eq('user_id', user.id);
      if (data) completedTopics = data.map(r => r.topic);
    }

    const done = new Set(completedTopics);

    // Find current chapter
    let currentChapter = null;
    for (let i = 0; i < path.chapters.length; i++) {
      const ch = path.chapters[i];
      const prev = i > 0 ? path.chapters[i - 1] : null;
      const unlocked = i === 0 || (prev && prev.topics.every(t => done.has(t)));
      if (!unlocked) break;

      const chCompleted = ch.topics.every(t => done.has(t));
      if (!chCompleted) { currentChapter = ch; break; }
    }

    if (!currentChapter) {
      return res.json({ success: true, data: { allComplete: true, domain } });
    }

    const nextTopic = currentChapter.topics.find(t => !done.has(t));
    const topicsCompleted = currentChapter.topics.filter(t => done.has(t)).length;

    res.json({
      success: true,
      data: {
        domain,
        campaignTitle: path.campaignTitle,
        chapter: {
          id: currentChapter.id,
          number: currentChapter.number,
          title: currentChapter.title,
          subtitle: currentChapter.subtitle,
          topicsCompleted,
          topicsTotal: currentChapter.topics.length,
        },
        nextTopic,
        nextTopicAlias: currentChapter.topicAliases?.[nextTopic] || null,
      },
    });
  } catch (err) {
    console.error('[Chapters] current error:', err);
    res.status(500).json({ success: false, error: 'Chapter service unavailable' });
  }
});

module.exports = router;
