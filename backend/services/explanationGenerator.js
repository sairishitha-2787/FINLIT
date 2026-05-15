// FINLIT — Deep Explanation Generator
// Produces structured 4-section explanations via Groq, domain-vocabulary-enforced.

const Groq = require('groq-sdk');
const { DOMAIN_VOCABULARY, normalizeDomain } = require('../config/domainVocabulary');
const { TOPIC_MAP } = require('../config/topics');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Variation 0 = direct core analogy
// Variation 1 = unexpected angle / flip the framing
// Variation 2 = focus on habit/system over outcome
const VARIATION_FRAMES = [
  'Use the most direct, vivid analogy for this domain. Make it instantly recognizable to someone deep in this space.',
  'Flip the typical framing. Approach it from an angle that someone in this domain would NOT expect — surprise them.',
  'Focus on the habit and system, not just the result. Emphasize the process and consistency over the big payoff.',
];

// ── Main export ───────────────────────────────────────────────────────────────

async function generateDeepExplanation(topic, domain, { difficulty = 'beginner', variation = 0 } = {}) {
  const normalizedDomain = normalizeDomain(domain);
  const vocab = DOMAIN_VOCABULARY[normalizedDomain] || DOMAIN_VOCABULARY.gaming;
  const topicMeta = TOPIC_MAP[topic] || TOPIC_MAP[topic?.toLowerCase()] || null;

  console.log(`[ExplainGen] "${topic}" | domain="${normalizedDomain}" | variation=${variation}`);

  let rawText = null;

  try {
    const sysPrompt = buildSystemPrompt(normalizedDomain, vocab);
    const userPrompt = buildUserPrompt(topic, normalizedDomain, vocab, topicMeta, difficulty, variation);

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: sysPrompt },
        { role: 'user',   content: userPrompt },
      ],
      max_tokens: 2000,
      temperature: variation === 0 ? 0.65 : 0.75,
    });

    rawText = completion.choices[0]?.message?.content?.trim() || null;
    console.log(`[ExplainGen] Groq returned ${rawText?.length || 0} chars`);
  } catch (err) {
    console.error('[ExplainGen] Groq error:', err.message);
  }

  // Parse sections from AI output
  if (rawText && rawText.length > 300) {
    const sections = parseSections(rawText);
    if (sections.analogy && sections.analogy.length > 80) {
      return buildResponse(topic, normalizedDomain, sections, topicMeta, difficulty);
    }
    console.warn('[ExplainGen] Parse produced thin sections, using fallback');
  }

  // Static fallback — always has substance
  return generateStaticFallback(topic, normalizedDomain, vocab, topicMeta, difficulty);
}

// ── Prompt builders ───────────────────────────────────────────────────────────

function buildSystemPrompt(domain, vocab) {
  return `You are FINN, FINLIT's AI financial educator. You specialize in explaining personal finance through ${domain} analogies.

PERSONA: ${vocab.tone}

DOMAIN LANGUAGE RULES:
- Use "${vocab.moneyWord}" naturally instead of "money" where it fits
- Use "${vocab.timeWord}" naturally instead of generic time references
- Core terms you MUST weave in (at least 5): ${vocab.coreTerms.join(', ')}

BANNED PHRASES — never write any of these:
"Let me break that down", "Great question", "Hope this helps", "Let me know if you have questions",
"In conclusion", "In summary", "As you can see", "It is important to note", "It is worth mentioning",
"I hope", "Feel free to", "Don't hesitate to", "Absolutely!", "Certainly!", "Of course!"

WRITING RULES:
- Speak directly to the user as "you" — never use third-person hypotheticals
- End statements with conviction ("you will" not "you might consider")
- Every paragraph must contain a new piece of information the user did not know
- No padding, no restating the topic name as content
- The MATH section must show real arithmetic steps — not just concepts`;
}

function buildUserPrompt(topic, domain, vocab, topicMeta, difficulty, variation) {
  const frame = VARIATION_FRAMES[variation % VARIATION_FRAMES.length];

  let metaBlock = '';
  if (topicMeta) {
    metaBlock = `
TOPIC DATA — use these real numbers in your explanation:
Formula: ${topicMeta.keyFormula}
Real example: ${topicMeta.realWorldExample}
Common mistake to address: ${topicMeta.commonMistakes[0]}
Math scenario: ${topicMeta.mathExample.scenario}
Numbers: ${JSON.stringify(topicMeta.mathExample.values)}
`;
  }

  return `Explain "${topic}" to someone who lives and breathes ${domain}. Difficulty: ${difficulty}.

FRAMING: ${frame}
${metaBlock}
Use EXACTLY these section markers (no asterisks, no markdown headers, no bullet points):

===ANALOGY===
[2–3 paragraphs. Lead with a specific ${domain} situation the user will immediately recognize. Use domain vocabulary naturally — not forced. Connect the scenario concretely to the financial concept. Visual and specific beats abstract and general.]

===MATH===
[Show the actual numbers step by step. Use "${vocab.moneyWord}" terminology where natural. Label each step clearly. Show the progression: what changes year 1, year 3, year 10. Include the formula in action with real values. 3–5 calculation blocks.]

===WHY===
[2 paragraphs. Specific dollar amounts and real stakes — not abstract. Show what happens to someone who ignores this for 5 years vs acts now. Address the most common mistake head-on. Make the consequence feel real and immediate.]

===NEXT===
[1 paragraph. One action the user can take TODAY — specific and concrete. One challenge question with the answer included. Name the single best next topic to study after this one and why it connects.]`;
}

// ── Section parser ────────────────────────────────────────────────────────────

function parseSections(text) {
  const sections = { analogy: '', math: '', whyItMatters: '', nextSteps: '' };

  try {
    const analogyM = text.match(/===ANALOGY===\s*([\s\S]*?)(?====MATH===)/i);
    const mathM    = text.match(/===MATH===\s*([\s\S]*?)(?====WHY===)/i);
    const whyM     = text.match(/===WHY===\s*([\s\S]*?)(?====NEXT===)/i);
    const nextM    = text.match(/===NEXT===\s*([\s\S]*?)$/i);

    sections.analogy       = analogyM ? cleanSection(analogyM[1]) : '';
    sections.math          = mathM    ? cleanSection(mathM[1])    : '';
    sections.whyItMatters  = whyM     ? cleanSection(whyM[1])     : '';
    sections.nextSteps     = nextM    ? cleanSection(nextM[1])    : '';
  } catch (e) {
    console.error('[ExplainGen] Parse error:', e.message);
  }

  return sections;
}

function cleanSection(text) {
  return text
    .trim()
    // Strip leading/trailing markdown headers
    .replace(/^#{1,4}\s.*\n?/gm, '')
    // Collapse 3+ blank lines to 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ── Response builder ──────────────────────────────────────────────────────────

function buildResponse(topic, domain, sections, topicMeta, difficulty) {
  const wordCount = Object.values(sections).join(' ').split(/\s+/).length;
  const readingTime = Math.max(2, Math.round(wordCount / 230));

  return {
    success: true,
    explanation: {
      topic,
      domain,
      sections,
      readingTime,
      difficulty: topicMeta?.difficulty || difficulty,
      relatedTopics: topicMeta?.prerequisites?.slice(0, 3) || [],
      keyFormula: topicMeta?.keyFormula || null,
    },
  };
}

// ── Static fallback — substantive, domain-aware ───────────────────────────────

function generateStaticFallback(topic, domain, vocab, topicMeta, difficulty) {
  const money = vocab.moneyWord;
  const time  = vocab.timeWord;
  const core  = vocab.coreTerms.slice(0, 4).join(', ');
  const formula = topicMeta?.keyFormula || null;
  const mistake = topicMeta?.commonMistakes?.[0] || null;
  const example = topicMeta?.realWorldExample || null;

  const sections = {
    analogy: `In ${domain}, mastery does not come from one spectacular move — it comes from understanding systems and executing them consistently. ${topic} works exactly the same way. The people who understand it are not smarter than you; they just have a framework that makes decisions automatic.

Think about how the best in ${domain} talk about ${time}. They use ${core} as tools, not goals. ${topic} is one of those tools. Once you understand how it works, you apply it without thinking, and that automatic execution is where the real advantage lives.`,

    math: formula
      ? `The formula at the core of ${topic}: ${formula}\n\n${example ? `Real-world example: ${example}` : ''}\n\nApplying this to your actual numbers:\nStart with what you currently have — your baseline.\nApply the formula at the rate that applies to your situation.\nProject forward: year 1, year 3, year 10.\n\nThe numbers will tell you whether you are building toward something or just maintaining the status quo. Calculate it now. Not tomorrow.`
      : `The math behind ${topic} is straightforward once you see it clearly.\n\n${example ? `Real-world example: ${example}\n\n` : ''}Start with your actual current numbers — not hypotheticals. Apply consistent inputs over time. Track the output each period.\n\nSmall consistent inputs create outsized outputs over 5–10 years. The arithmetic is not complicated; it is the consistency that most people fail to execute.`,

    whyItMatters: `Every month you are not applying ${topic} is a month of compounding you cannot get back. This is not abstract financial advice — it is math. The ${money} you do not optimize today will not be there when you need it, regardless of how much you earn in the future.\n\n${mistake ? `The most common mistake: ${mistake}. Do not let this be you.` : `The most common mistake is waiting until you feel "ready." There is no ready — there is only now and later, and later costs more.`}`,

    nextSteps: `One thing you can do in the next 10 minutes: apply ${topic} to your actual current numbers. Open your most recent bank statement. Run the calculation. See where you stand. That single action will tell you more than anything else you could read.\n\nChallenge question: if you applied ${topic} consistently for the next 5 years, what would your financial position look like? Calculate it — the answer is the reason to start. After this, the most important next topic is ${topicMeta?.prerequisites?.[0] || 'Compound Interest'} — they are directly connected and one reinforces the other.`,
  };

  return buildResponse(topic, domain, sections, topicMeta, difficulty);
}

// ── Quiz generator (Groq) ─────────────────────────────────────────────────────

async function generateQuizWithGroq(topic, domain, difficulty = 'beginner') {
  const normalizedDomain = normalizeDomain(domain);
  const vocab = DOMAIN_VOCABULARY[normalizedDomain] || DOMAIN_VOCABULARY.gaming;

  console.log(`[QuizGen] "${topic}" | domain="${normalizedDomain}" | difficulty=${difficulty}`);

  const systemPrompt = `You are FINN, FINLIT's quiz master. Generate exactly 5 multiple-choice questions about a personal finance topic, framed through ${normalizedDomain} analogies.

Rules:
- Each question must have exactly 4 options labeled A, B, C, D
- One option is clearly correct
- Options must be plain text strings (no letter prefix like "A)")
- Respond ONLY with a valid JSON array, no prose outside the JSON
- The correctAnswer field must be a single letter: A, B, C, or D`;

  const userPrompt = `Create 5 quiz questions about "${topic}" for a ${difficulty}-level learner who is passionate about ${normalizedDomain}.

Use ${normalizedDomain} context and terminology naturally (e.g., "${vocab.moneyWord}" for money, "${vocab.timeWord}" for time).

Respond with this exact JSON array structure:
[
  {
    "question": "Question text here?",
    "options": ["First option", "Second option", "Third option", "Fourth option"],
    "correctAnswer": "A",
    "explanation": "Brief explanation of why this answer is correct (1-2 sentences, encouraging tone)."
  }
]

Make questions progressively harder (Q1 easy concept, Q3 application, Q5 scenario-based).`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      max_tokens: 1800,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '';
    console.log(`[QuizGen] Groq returned ${raw.length} chars`);

    // Groq returns a JSON object when response_format is json_object.
    // The model may wrap the array under a key; handle both cases.
    const parsed = JSON.parse(raw);
    const questions = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.quiz || Object.values(parsed)[0]);

    if (!Array.isArray(questions) || questions.length < 3) {
      throw new Error('Parsed fewer than 3 questions');
    }

    // Normalise: ensure correctAnswer is a single letter A-D
    const normalised = questions.slice(0, 5).map(q => ({
      question:      q.question    || '',
      options:       Array.isArray(q.options) ? q.options.slice(0, 4) : [],
      correctAnswer: String(q.correctAnswer ?? 'A').trim()[0].toUpperCase(),
      explanation:   q.explanation || '',
    }));

    return { success: true, questions: normalised };
  } catch (err) {
    console.error('[QuizGen] Groq error:', err.message);
    return { success: false, questions: [] };
  }
}

module.exports = { generateDeepExplanation, generateQuizWithGroq };
