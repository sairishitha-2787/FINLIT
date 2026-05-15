import { supabase } from '../config/supabase';

// ─── Write ───────────────────────────────────────────────────────────────────

export const saveTopicProgress = async (userId, { topic, score, totalQuestions }) => {
  const { data, error } = await supabase
    .from('progress')
    .insert([{
      user_id: userId,
      topic,
      score: score ?? null,
      total_questions: totalQuestions ?? null,
      completed_at: new Date().toISOString(),
    }])
    .select()
    .single();
  return { data, error };
};

export const saveQuizResult = async (userId, topic) => {
  const { data, error } = await supabase
    .from('quiz_results')
    .insert([{ user_id: userId, topic, created_at: new Date().toISOString() }])
    .select()
    .single();
  return { data, error };
};

// ─── Read ────────────────────────────────────────────────────────────────────

export const fetchUserProgress = async (userId) => {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  return { data: data || [], error };
};

// Fetch everything needed for the Progress page in parallel
export const fetchAllProgressData = async (userId) => {
  const [
    { data: progressRows },
    { data: badgeRows },
    { data: streakRow },
  ] = await Promise.all([
    supabase.from('progress').select('*').eq('user_id', userId).order('completed_at', { ascending: false }),
    supabase.from('user_badges').select('*').eq('user_id', userId).order('earned_at', { ascending: false }),
    supabase.from('user_streaks').select('*').eq('user_id', userId).single(),
  ]);

  const rows = progressRows || [];
  const badges = badgeRows || [];

  return {
    progressRows: rows,
    badges,
    streakData: streakRow || null,
    stats: deriveStats(rows, streakRow),
    scoreDistribution: deriveScoreDistribution(rows),
    difficultyBreakdown: deriveDifficultyBreakdown(rows),
    velocityData: deriveVelocityData(rows),
    interestBreakdown: deriveInterestBreakdown(rows),
    skills: deriveSkills(rows),
    timelineEvents: deriveTimeline(rows, badges),
  };
};

// ─── Boss persistence ─────────────────────────────────────────────────────────

export const saveDefeatedBoss = async (userId, bossId) => {
  const { data, error } = await supabase
    .from('defeated_bosses')
    .upsert([{ user_id: userId, boss_id: bossId, defeated_at: new Date().toISOString() }], { onConflict: 'user_id,boss_id' })
    .select('boss_id')
    .single();
  return { data, error };
};

export const fetchDefeatedBosses = async (userId) => {
  const { data, error } = await supabase
    .from('defeated_bosses')
    .select('boss_id')
    .eq('user_id', userId);
  return { data: data || [], error };
};

// ─── Derived analytics (pure functions, no extra network calls) ───────────────

const scorePercent = (score, total) => (total ? Math.round((score / total) * 100) : 0);

const deriveStats = (rows, streakRow) => ({
  totalTopics: rows.length,
  avgScore: rows.length > 0
    ? Math.round(rows.reduce((s, r) => s + scorePercent(r.score, r.total_questions || 5), 0) / rows.length)
    : 0,
  currentStreak: streakRow?.current_streak || 0,
  longestStreak: streakRow?.longest_streak || 0,
  totalXP: streakRow?.total_xp || 0,
  level: streakRow?.current_level || 1,
});

const deriveScoreDistribution = (rows) => [
  { label: 'Perfect (100%)', count: rows.filter(r => scorePercent(r.score, r.total_questions || 5) === 100).length },
  { label: 'Great (80–99%)', count: rows.filter(r => { const p = scorePercent(r.score, r.total_questions || 5); return p >= 80 && p < 100; }).length },
  { label: 'Good (60–79%)', count: rows.filter(r => { const p = scorePercent(r.score, r.total_questions || 5); return p >= 60 && p < 80; }).length },
  { label: 'Keep Going (<60%)', count: rows.filter(r => scorePercent(r.score, r.total_questions || 5) < 60).length },
];

const deriveDifficultyBreakdown = (rows) =>
  ['beginner', 'intermediate', 'advanced'].map(d => ({
    label: d,
    count: rows.filter(r => (r.difficulty_level || 'beginner') === d).length,
  }));

const deriveVelocityData = (rows) => {
  const weekMap = {};
  [...rows].reverse().forEach(r => {
    const date = new Date(r.completed_at);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const key = weekStart.toISOString().split('T')[0];
    weekMap[key] = (weekMap[key] || 0) + 1;
  });
  return Object.entries(weekMap)
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-8);
};

const deriveInterestBreakdown = (rows) => {
  const map = {};
  rows.forEach(r => {
    const d = r.interest_domain || 'general';
    map[d] = (map[d] || 0) + 1;
  });
  return Object.entries(map)
    .map(([interest, count]) => ({ interest, count }))
    .sort((a, b) => b.count - a.count);
};

export const deriveSkills = (rows) => {
  const topicMap = {};
  rows.forEach(r => {
    const pct = r.total_questions ? r.score / r.total_questions : 0;
    if (!topicMap[r.topic] || pct > topicMap[r.topic].pct) {
      let skillLevel;
      if (pct >= 1) skillLevel = 'Mastered';
      else if (pct >= 0.8) skillLevel = 'Proficient';
      else skillLevel = 'Learned';
      topicMap[r.topic] = {
        topic: r.topic,
        pct,
        score: r.score,
        total: r.total_questions || 5,
        skillLevel,
        domain: r.interest_domain || null,
      };
    }
  });
  return Object.values(topicMap).sort((a, b) => b.pct - a.pct);
};

const deriveTimeline = (rows, badges) => {
  const events = [
    ...rows.map(r => ({
      type: 'topic',
      title: r.topic,
      subtitle: r.score !== null ? `Quiz: ${r.score}/${r.total_questions || 5}` : null,
      date: r.completed_at,
      score: r.score,
      totalQ: r.total_questions || 5,
    })),
    ...badges.map(b => ({
      type: 'badge',
      title: b.badge_name,
      subtitle: 'Badge unlocked',
      date: b.earned_at || b.created_at,
    })),
  ];
  return events.sort((a, b) => new Date(b.date) - new Date(a.date));
};
