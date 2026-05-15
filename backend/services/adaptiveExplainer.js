// FINLIT — Adaptive Re-Explainer
// Targeted re-explanation in FINN's domain personality voice.
// Handles both confusion-type re-explanations and inline Q&A.

const Groq = require('groq-sdk');
const { DOMAIN_VOCABULARY, normalizeDomain: normVocab } = require('../config/domainVocabulary');
const { getPersonality, normalizeDomain, getConfusionPrefix } = require('../config/finnPersonalities');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const APPROACH_MAP = {
  analogy: {
    label: 'different analogy',
    instruction: 'The user did not connect with the original analogy. Create a completely different one — use a universal everyday experience (cooking, commuting, building something) that anyone can picture. Make it vivid and concrete. Keep the domain personality but use a simpler comparison.',
  },
  math: {
    label: 'step-by-step math',
    instruction: 'The user is confused by the numbers or formula. Break it down step-by-step using small, round numbers. Show each calculation on its own line. Explain what each number represents before doing any arithmetic. Use domain-specific examples for the numbers (e.g., "imagine this is your loot drop" for gaming).',
  },
  vocabulary: {
    label: 'plain language',
    instruction: 'The user does not understand the terminology. Define each key term in plain everyday language first. Avoid jargon. Only reintroduce technical terms after explaining them in plain words. Keep domain personality but strip out finance jargon.',
  },
  concept: {
    label: 'big picture first',
    instruction: 'The user is lost on the overall concept. Start with the big picture — why it matters and how it fits into their life. Then zoom in on the mechanism. Connect it to something the user already knows via the domain.',
  },
};

const FALLBACKS = {
  analogy: (t) => `Think of ${t} like a simple trade — you give something now to get something better later. The core idea is always about making a smart exchange with your resources.`,
  math:    ()  => `Focus on the percentage first — it tells you how much things grow or shrink. Start with 10% of 100 to see the pattern, then scale from there.`,
  vocabulary: (t) => `The technical terms can feel like a wall at first. The most important idea: ${t} is about managing how your resources move over time. Everything else is just naming the parts.`,
  concept: (t) => `Big picture: ${t} is one of the tools that makes your money work for you instead of sitting still. Once that clicks, the specific mechanics start to make sense.`,
};

const BANNED = `NEVER say: "I hope", "Let me break that down", "Great question", "As you can see", "Feel free to", "Don't hesitate", "Absolutely!", "Certainly!", "Of course!"`;

// ── Main export ───────────────────────────────────────────────────────────────

async function reExplain(topic, domain, { confusionPoint, previousExplanation = '', question = null } = {}) {
  const normalizedDomain = normalizeDomain(domain);
  const personality = getPersonality(normalizedDomain);

  if (question) {
    return _answerQuestion(topic, normalizedDomain, personality, previousExplanation, question);
  }

  const approach = APPROACH_MAP[confusionPoint] || APPROACH_MAP.concept;
  const confusionPrefix = getConfusionPrefix(normalizedDomain, confusionPoint || 'concept');

  console.log(`[AdaptiveExplain] "${topic}" | confusion="${confusionPoint}" | domain="${normalizedDomain}"`);

  const systemPrompt = `${personality.systemPrompt}

You are re-explaining a concept because the student indicated confusion. Stay in ${normalizedDomain} personality throughout.

RE-EXPLANATION APPROACH: ${approach.instruction}

RESPONSE FORMAT:
- Write 2–4 short paragraphs (no headers, no bullet points, flowing prose)
- Start with this exact phrase to signal a fresh take: "${confusionPrefix}"
- Keep under 200 words
- Be warm and encouraging — they're almost there
${BANNED}`;

  const previousSnippet = previousExplanation
    ? `\nWhat was already explained (don't repeat it):\n"""\n${previousExplanation.slice(0, 600)}\n"""`
    : '';

  const userPrompt = `Topic: "${topic}" | Student confusion type: ${confusionPoint}${previousSnippet}

Write a fresh ${approach.label} re-explanation. Start with the prefix already provided in the system prompt.`;

  return _callGroq(systemPrompt, userPrompt, confusionPoint, approach.label, topic, normalizedDomain);
}

// ── Private: answer a custom inline question ──────────────────────────────────

async function _answerQuestion(topic, domain, personality, sectionContent, question) {
  console.log(`[AdaptiveExplain] Q&A: "${question.slice(0, 60)}" about "${topic}" (${domain})`);

  const systemPrompt = `${personality.systemPrompt}

You are answering a specific question the student has while reading a lesson section. Stay in ${domain} personality.
Keep your answer under 150 words. Be direct and answer exactly what they asked.
${BANNED}`;

  const contextSnippet = sectionContent
    ? `\nSection the student is reading:\n"""\n${sectionContent.slice(0, 500)}\n"""`
    : '';

  const userPrompt = `Topic: "${topic}"${contextSnippet}\n\nStudent's question: "${question}"`;

  return _callGroq(systemPrompt, userPrompt, 'question', 'direct answer', topic, domain);
}

// ── Private: Groq call with fallback ─────────────────────────────────────────

async function _callGroq(systemPrompt, userPrompt, confusionPoint, approachLabel, topic, domain) {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt  },
      ],
      max_tokens: 500,
      temperature: 0.72,
    });

    const text = completion.choices[0]?.message?.content?.trim() || '';
    if (text.length > 40) {
      return { success: true, reExplanation: text, confusionPoint, approach: approachLabel, domain };
    }
    throw new Error('Groq returned empty response');
  } catch (err) {
    console.error('[AdaptiveExplain] Groq error:', err.message);
    const fallbackFn = FALLBACKS[confusionPoint] || FALLBACKS.concept;
    return {
      success: false,
      reExplanation: fallbackFn(topic),
      confusionPoint,
      approach: approachLabel,
      domain,
    };
  }
}

module.exports = { reExplain };
