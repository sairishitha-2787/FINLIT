// badgeRules — maps trackable progress signals to each domain's badge IDs, so
// completing topics actually awards the domain badges shown on the achievements
// pages. Only signals we can reliably evaluate centrally are used:
//   • topics  — award when total completed topics >= count
//   • perfect — award when the just-finished quiz was 100% (optional minTopics)
// IDs come straight from config/badgesConfig.js + data/musicBadges.js.

export const BADGE_RULES = {
  gaming: [
    { id: 'first_lesson', name: 'First Steps',   topics: 1 },
    { id: 'topic_master', name: 'Topic Master',  topics: 10 },
    { id: 'perfect_quiz', name: 'Perfect Score', perfect: true },
  ],
  music: [
    { id: 'music_first_stream',          name: 'First Stream',         topics: 1 },
    { id: 'music_streaming_enthusiast',  name: 'Streaming Enthusiast', topics: 5 },
    { id: 'music_chart_climber',         name: 'Chart Climber',        topics: 10 },
  ],
  fashion: [
    { id: 'fashion_first_look', name: 'First Look', topics: 1 },
  ],
  sports: [
    { id: 'first_whistle',    name: 'First Whistle',    topics: 1 },
    { id: 'opening_match',    name: 'Opening Match',    topics: 2 },
    { id: 'division_climber', name: 'Division Climber', topics: 3 },
    { id: 'week_one_warrior', name: 'Week One Warrior', topics: 5 },
    { id: 'team_player',      name: 'Team Player',      topics: 5 },
    { id: 'iron_will',        name: 'Iron Will',        topics: 10 },
    { id: 'clean_sheet',      name: 'Clean Sheet',      perfect: true },
    { id: 'perfectionist',    name: 'Perfectionist',    perfect: true, topics: 5 },
    { id: 'perfect_form',     name: 'Perfect Form',     perfect: true, topics: 10 },
  ],
};

// Returns the badges (from the domain's rules) earned at this moment.
export function evaluateBadgeRules(domain, { topics = 0, isPerfect = false } = {}) {
  const rules = BADGE_RULES[domain] || [];
  return rules.filter((r) => {
    if (r.perfect && !isPerfect) return false;
    if (r.topics && topics < r.topics) return false;
    return true;
  });
}
