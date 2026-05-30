// FINLIT — Chapter Service
// All chapter progress logic derived from completedTopics (no extra API calls)

import { LEARNING_PATHS } from '../config/learningPaths';

// ── Core calculation ──────────────────────────────────────────────────────────

/**
 * Returns enriched chapter array for a domain.
 * Each chapter gets: topicsCompleted, topicsTotal, isComplete, isUnlocked, status
 */
export function getChapterProgress(completedTopics, domain) {
  const path = LEARNING_PATHS[normalizeDomain(domain)];
  if (!path) return null;

  const done = new Set(completedTopics || []);

  return path.chapters.map((chapter, idx) => {
    const topicsCompleted = chapter.topics.filter(t => done.has(t)).length;
    const topicsTotal     = chapter.topics.length;
    const isComplete      = topicsCompleted === topicsTotal;

    // Chapter 1 always unlocked; each subsequent chapter requires previous complete
    const prevChapter = idx > 0 ? path.chapters[idx - 1] : null;
    const isUnlocked  = idx === 0 || _isChapterComplete(done, prevChapter);

    let status;
    if (!isUnlocked)       status = 'locked';
    else if (isComplete)   status = 'completed';
    else if (topicsCompleted > 0) status = 'in_progress';
    else                   status = 'available';

    return { ...chapter, topicsCompleted, topicsTotal, isComplete, isUnlocked, status };
  });
}

/** Returns the currently active chapter (first in_progress → available → last) */
export function getCurrentChapter(completedTopics, domain) {
  const chapters = getChapterProgress(completedTopics, domain);
  if (!chapters) return null;
  return (
    chapters.find(c => c.status === 'in_progress') ||
    chapters.find(c => c.status === 'available')   ||
    chapters[chapters.length - 1]
  );
}

/** Returns { topic, chapter } for the next uncompleted topic in the sequence */
export function getNextChapterTopic(completedTopics, domain) {
  const chapter = getCurrentChapter(completedTopics, domain);
  if (!chapter || chapter.status === 'locked') return null;

  const done = new Set(completedTopics || []);
  const next = chapter.topics.find(t => !done.has(t));
  return next ? { topic: next, chapter } : null;
}

/** Returns true if a topic is in an unlocked chapter (or not in any chapter at all) */
export function isTopicUnlocked(completedTopics, domain, topicName) {
  const chapters = getChapterProgress(completedTopics, domain);
  if (!chapters) return true;

  for (const ch of chapters) {
    if (ch.topics.includes(topicName)) return ch.isUnlocked;
  }
  return true; // not in any chapter → always accessible
}

/** Find which chapter + position a topic belongs to */
export function getTopicChapterInfo(domain, topicName) {
  const path = LEARNING_PATHS[normalizeDomain(domain)];
  if (!path) return null;

  for (const chapter of path.chapters) {
    const idx = chapter.topics.indexOf(topicName);
    if (idx !== -1) {
      return {
        chapter,
        topicIndex: idx,
        topicTotal: chapter.topics.length,
        position: idx + 1,
      };
    }
  }
  return null;
}

/**
 * Given a topic that was just completed, check whether it finished a chapter.
 * Returns the completed chapter object, or null.
 */
export function checkChapterCompletion(previousCompleted, newTopicName, domain) {
  const info = getTopicChapterInfo(domain, newTopicName);
  if (!info) return null;

  const newCompleted = [...(previousCompleted || []), newTopicName];
  const done = new Set(newCompleted);
  const wasComplete = _isChapterComplete(new Set(previousCompleted || []), info.chapter);
  const isNowComplete = _isChapterComplete(done, info.chapter);

  return !wasComplete && isNowComplete ? info.chapter : null;
}

/** Get domain path metadata (title, tagline) */
export function getDomainPath(domain) {
  return LEARNING_PATHS[normalizeDomain(domain)] || null;
}

/** All topic names that belong to chapters (across all chapters for a domain) */
export function getChapterTopicSet(domain) {
  const path = LEARNING_PATHS[normalizeDomain(domain)];
  if (!path) return new Set();
  const all = path.chapters.flatMap(ch => ch.topics);
  return new Set(all);
}

/** Overall domain completion percentage */
export function getDomainCompletion(completedTopics, domain) {
  const chapters = getChapterProgress(completedTopics, domain);
  if (!chapters) return 0;
  const total     = chapters.reduce((s, c) => s + c.topicsTotal, 0);
  const completed = chapters.reduce((s, c) => s + c.topicsCompleted, 0);
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

// ── Internal ──────────────────────────────────────────────────────────────────

function _isChapterComplete(doneSet, chapter) {
  return chapter.topics.every(t => doneSet.has(t));
}

// Normalize domain string to the keys used in LEARNING_PATHS
function normalizeDomain(domain) {
  const d = (domain || '').toLowerCase().trim();
  const aliases = {
    'video games': 'gaming', 'esports': 'gaming', 'games': 'gaming',
    'clothes': 'fashion', 'style': 'fashion',
    'sound': 'music', 'beats': 'music',
    'exercise': 'sports', 'fitness': 'sports', 'gym': 'sports',
    'song': 'music', 'songs': 'music', 'instruments': 'music',
  };
  return aliases[d] || (LEARNING_PATHS[d] ? d : d);
}
