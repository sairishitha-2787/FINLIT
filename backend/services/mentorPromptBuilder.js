// FINLIT — Mentor Prompt Builder
// Builds personality-injected system prompts for FINN across 6 domains.

const { getPersonality, normalizeDomain } = require('../config/finnPersonalities');
const { enforceVocabulary } = require('../utils/vocabularyEnforcer');

// ── System prompt builder ─────────────────────────────────────────────────────

function buildSystemPrompt(context) {
  const {
    userName = 'Student',
    interest = 'gaming',
    difficulty = 'beginner',
    userLevel = 1,
    totalXP = 0,
    completedCount = 0,
    currentTopic = null,
  } = context;

  const domain = normalizeDomain(interest);
  const personality = getPersonality(domain);

  const topicLine = currentTopic
    ? `The user is currently studying "${currentTopic}".`
    : 'The user is browsing — not in a specific topic right now.';

  return `${personality.systemPrompt}

USER PROFILE:
- Name: ${userName}
- Domain: ${domain}
- Difficulty: ${difficulty}
- Level: ${userLevel} (${totalXP} XP total)
- Topics completed: ${completedCount}
- ${topicLine}

STRICT RULES:
- Stay fully in ${domain} personality — every response, every sentence
- Keep responses to 3–5 sentences unless they explicitly ask for deep detail
- No emojis whatsoever — the UI provides visual elements
- No generic phrases: "Great question!", "Certainly!", "Absolutely!", "I hope this helps", "Feel free to", "Don't hesitate"
- If asked something unrelated to finance, deflect warmly in character: "Ha, outside my lane — I'm your money ${domain === 'sports' ? 'coach' : domain === 'food' ? 'chef' : domain === 'movies' ? 'director' : domain === 'music' ? 'maestro' : domain === 'fashion' ? 'stylist' : 'guide'}. What's confusing you financially?"
- End with an engaging hook or question when it feels natural`;
}

// ── Messages builder ──────────────────────────────────────────────────────────

function buildMessages(message, context, conversationHistory = []) {
  const systemPrompt = buildSystemPrompt(context);

  const messages = [{ role: 'system', content: systemPrompt }];

  for (const turn of conversationHistory.slice(-10)) {
    messages.push({
      role: turn.role === 'user' ? 'user' : 'assistant',
      content: turn.message,
    });
  }

  messages.push({ role: 'user', content: message });
  return messages;
}

// ── Post-process Groq output ──────────────────────────────────────────────────

function postProcess(text, domain) {
  if (!text) return text;
  return enforceVocabulary(text, domain);
}

// ── Domain-specific fallbacks (no emojis) ────────────────────────────────────

const FALLBACKS = {
  gaming: [
    `Think of compound interest like an XP multiplier — your gold earns returns, and those returns earn MORE returns, so the number snowballs insanely fast. Start early and you're basically speedrunning wealth. Want the actual math?`,
    `Your savings account is like a passive income stat in an RPG — it generates gold while you're AFK. Compound interest means that gold also generates gold. The longer you leave it, the more broken it gets. It's the meta build.`,
    `Compound interest is the difference between a flat +10 sword and one that scales with your level. The scaling weapon is always better long-term — same principle here, just with your actual money.`,
  ],
  fashion: [
    `Compound interest is cost-per-wear logic applied to money — a quality investment that grows over time beats any impulse spend. Your capital earns returns, those returns earn returns, and suddenly your financial wardrobe builds itself.`,
    `Think of it like a capsule wardrobe that adds timeless pieces every year automatically — you put in the initial investment, and it keeps compounding into something more valuable without you doing more work.`,
    `Your savings compounding is like a classic investment piece gaining value over decades — the earlier you acquire it, the more it appreciates. Waiting is quite literally leaving value on the table.`,
  ],
  sports: [
    `Compound interest is progressive overload for your money — every month you're building slightly more strength without adding extra effort. Start your training early and by year 30 you're lifting things most people can't touch.`,
    `Think of it as the conditioning effect — consistent training beats sporadic intensity every time. Same with your capital: consistent saving plus compound interest beats trying to catch up later.`,
    `It's the difference between sprinting and building your aerobic base — compound interest rewards patience and consistency, not intensity. Start now, even with small amounts, and let the compounding do the work.`,
  ],
  movies: [
    `Compound interest is a plot that builds momentum — slow development in the first act, but by the third act it's moving faster than you can control. Start the story early and let it write itself into a blockbuster.`,
    `Think of it like building a franchise from the first film — each sequel builds on the last, bigger budget, bigger returns. Your money compounds the same way: returns on returns, building into something epic.`,
    `Your savings compounding is like a screenplay that improves with every draft — except the revisions happen automatically, every month, without you touching it. Start early and let the production value compound.`,
  ],
  food: [
    `Compound interest works like aging a fine ingredient — the longer it develops, the richer and more complex it becomes. Start building your pantry early and let the flavors develop into something extraordinary.`,
    `Think of it like mise en place for your future self — every dollar you set aside is prepped and ready to work harder over time. Compound interest is what happens when your preparation compounds on itself.`,
    `Your savings compounding is like a stock that deepens with age — slow at first, then unmistakably complex. The technique is identical: quality ingredients, proper technique, and patience. Time is the secret recipe.`,
  ],
  music: [
    `Compound interest works like royalties — you compose something once, and it keeps paying you. Then the royalties from your royalties pay you more. Stack enough of those and your money performs while you sleep.`,
    `Think of it like a fanbase that compounds on itself — each listener brings two more. Your money does the same thing when it compounds. The earlier you start performing, the bigger the audience by the finale.`,
    `Your savings compounding is like a symphony building through its movements — quiet and measured at first, then a full crescendo you didn't see coming. Start the first movement early and let it build to something magnificent.`,
  ],
  default: [
    `Compound interest means your money earns returns, and then those returns also earn returns — it snowballs over time. The earlier you start, the bigger the snowball gets by the time you need it.`,
    `Here's the core idea: $1,000 at 7% annual interest becomes $1,070 after year 1. But year 2 you earn 7% on $1,070, not the original $1,000 — that gap keeps widening every single year.`,
    `Think of it as money that generates more money automatically — you put it in once, and it keeps compounding without extra effort. Time is the single most powerful variable. Start early.`,
  ],
};

function getFallbackResponse(message, context) {
  const { interest = 'general' } = context;
  const key = normalizeDomain(interest);
  const pool = FALLBACKS[key] || FALLBACKS.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Greeting builder ──────────────────────────────────────────────────────────

function buildGreeting(userName, interest, currentTopic, userLevel, completedCount) {
  const domain = normalizeDomain(interest);
  const personality = getPersonality(domain);
  const name = userName || 'there';
  const count = completedCount || 0;

  if (count === 0) {
    const intros = {
      gaming: `Yo ${name}! I'm FINN, your financial gaming buddy. I explain every money concept through gaming — no textbooks, just mechanics that make sense. What boss are we taking on first?`,
      fashion: `Darling ${name}! I'm FINN, your financial style curator. I'll explain every money concept through the world of fashion — timeless thinking, not fast trends. What shall we curate first?`,
      sports: `Coach is in, ${name}! I'm FINN — your financial head coach. I explain money through sport strategy: fundamentals, preparation, and championship execution. What's today's practice focus?`,
      movies: `Action! ${name}, I'm FINN — your financial creative director. I see your financial life as the greatest story you'll ever produce. Ready to start writing? What's our first scene?`,
      food: `Chef ${name}! I'm FINN, your financial head chef. I explain money through culinary craft — quality ingredients, proper technique, patience. What are we learning to cook first?`,
      music: `Maestro ${name}! I'm FINN, your financial conductor. I explain money through music — composition, rhythm, and building toward your grand finale. Ready to start the first movement?`,
    };
    return intros[domain] || intros.gaming;
  }

  const idx = (count + new Date().getDate()) % personality.greetings.length;
  let greeting = personality.greetings[idx].replace('{name}', name);

  if (currentTopic) {
    const topicAddons = {
      gaming: ` Working on "${currentTopic}" today — ask me anything and I'll break it down through ${domain}.`,
      fashion: ` "${currentTopic}" is on our fitting schedule today — ask me anything.`,
      sports: ` "${currentTopic}" is in today's game plan — what do you need from the playbook?`,
      movies: ` "${currentTopic}" is today's scene — what's your first question, director?`,
      food: ` "${currentTopic}" is on today's menu — what technique can I walk you through?`,
      music: ` "${currentTopic}" is today's movement — what passage would you like to rehearse?`,
    };
    greeting += topicAddons[domain] || '';
  }

  return greeting;
}

module.exports = { buildMessages, getFallbackResponse, buildGreeting, postProcess };
