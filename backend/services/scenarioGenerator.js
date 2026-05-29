// FINLIT — Scenario Quiz Generator
// Template-first: returns pre-built scenarios when available.
// Groq fallback: generates domain-adapted scenarios on-the-fly for any topic/domain combo.

const Groq = require('groq-sdk');
const { getTemplate, normalizeTopic, normalizeDomain } = require('../config/scenarioTemplates');
const { DOMAIN_VOCABULARY } = require('../config/domainVocabulary');
const { TOPIC_MAP } = require('../config/topics');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Template normalizer ───────────────────────────────────────────────────────
// Templates store `correct: 'A'` but ScenarioQuizEnvironment expects `correctIndex: 0`.
// This converts letter identifiers to 0-based indices at the source.

function normalizeTemplateQuestion(q) {
  const out = { ...q };

  // MC: convert `correct: 'A'` → `correctIndex: 0`
  if (q.type === 'multiple_choice') {
    if (out.correctIndex === undefined && typeof q.correct === 'string' && q.correct.length === 1) {
      out.correctIndex = q.correct.toUpperCase().charCodeAt(0) - 65; // 'A'→0, 'B'→1, etc.
    }
  }

  // Safety: if question text is missing, fall back to scenario text
  if (!out.question && out.scenario) {
    out.question = out.scenario;
  }

  return out;
}

// ── Main export ───────────────────────────────────────────────────────────────

async function generateScenarioQuiz(topic, domain, difficulty = 'beginner', variant = 0) {
  const normTopic  = normalizeTopic(topic);
  const normDomain = normalizeDomain(domain);

  console.log(`[ScenarioGen] topic="${normTopic}" domain="${normDomain}" difficulty="${difficulty}" variant=${variant}`);

  // 1. Try pre-built template first (zero latency, highest quality)
  const template = getTemplate(normTopic, normDomain, variant);
  if (template) {
    console.log(`[ScenarioGen] Template hit — returning pre-built scenario`);
    return {
      source: 'template',
      topic,
      domain: normDomain,
      difficulty,
      questions: template.questions.map(normalizeTemplateQuestion),
      scenarioTitle: template.scenarioTitle,
      scenarioContext: template.scenarioContext,
    };
  }

  // 2. Groq fallback for any missing topic/domain combo
  console.log(`[ScenarioGen] No template — generating via Groq`);
  return await generateViaGroq(topic, normTopic, normDomain, difficulty, variant);
}

// ── Groq Generation ───────────────────────────────────────────────────────────

async function generateViaGroq(topic, normTopic, normDomain, difficulty, variant) {
  const vocab    = DOMAIN_VOCABULARY[normDomain] || DOMAIN_VOCABULARY.gaming;
  const topicMeta = TOPIC_MAP[normTopic] || TOPIC_MAP[topic?.toLowerCase()] || null;

  const systemPrompt = buildSystemPrompt(normDomain, vocab);
  const userPrompt   = buildUserPrompt(topic, normDomain, vocab, topicMeta, difficulty, variant);

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt },
    ],
    max_tokens: 3000,
    temperature: 0.6,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw);

  const questions = normalizeGroqOutput(parsed);
  if (!questions || questions.length < 5) {
    throw new Error(`[ScenarioGen] Groq returned incomplete questions (got ${questions?.length ?? 0})`);
  }

  return {
    source: 'groq',
    topic,
    domain: normDomain,
    difficulty,
    questions,
    scenarioTitle: parsed.scenarioTitle || `${topic} Challenge`,
    scenarioContext: parsed.scenarioContext || '',
  };
}

// ── Prompt Builders ───────────────────────────────────────────────────────────

function buildSystemPrompt(domain, vocab) {
  const moneyWord = vocab.moneyWord || 'money';
  const timeWord  = vocab.timeWord  || 'time';
  const growthWord = vocab.growthWord || 'growth';
  const coreTerms = (vocab.coreTerms || []).slice(0, 5).join(', ');

  return `You are an expert financial literacy quiz designer who creates scenario-based learning challenges.
Your scenarios are deeply embedded in the user's interest domain: ${domain}.
You use domain-specific vocabulary naturally: ${coreTerms}.
Think of ${moneyWord} instead of "money", ${timeWord} for time, ${growthWord} for growth.

You create 3-level quiz challenges:
- Level 1 (Understanding): 2 multiple-choice questions testing conceptual grasp
- Level 2 (Application): 2 calculation questions requiring real math with a formula
- Level 3 (Boss Fight): 1 open-ended question requiring synthesis and reasoning

You MUST respond with valid JSON matching the exact schema provided. No prose outside JSON.`;
}

function buildUserPrompt(topic, domain, vocab, topicMeta, difficulty, variant) {
  const difficultyNote = {
    beginner: 'Use simple numbers and straightforward scenarios. Avoid jargon beyond basic domain terms.',
    intermediate: 'Use realistic numbers. Introduce 1-2 compounding factors. Require multi-step reasoning.',
    advanced: 'Use complex scenarios. Mix multiple financial concepts. Require nuanced analysis.',
  }[difficulty] || 'Use simple numbers and straightforward scenarios.';

  const metaNote = topicMeta
    ? `Topic formula: ${topicMeta.keyFormula || 'N/A'}. Example: ${topicMeta.realWorldExample || 'N/A'}.`
    : '';

  const variantNote = variant === 1
    ? 'Use an unexpected angle or framing — surprise the learner.'
    : variant === 2
    ? 'Focus on the habit and system, not just the outcome.'
    : 'Use the most direct, vivid scenario for this domain.';

  const analogies = vocab.analogies || {};
  const analogyHints = Object.entries(analogies)
    .slice(0, 3)
    .map(([k, v]) => `  - ${k}: "${v}"`)
    .join('\n');

  return `Create a 5-question scenario quiz about "${topic}" for someone interested in ${domain}.
Difficulty: ${difficulty}. ${difficultyNote}
${metaNote}
Framing: ${variantNote}

Domain analogies you can draw from:
${analogyHints || '  (use your best judgment)'}

Return ONLY valid JSON in this exact schema:
{
  "scenarioTitle": "short catchy title (max 8 words)",
  "scenarioContext": "1-2 sentence setup story using ${domain} context",
  "questions": [
    {
      "id": "l1q1",
      "level": 1,
      "type": "multiple_choice",
      "question": "question text",
      "choices": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctIndex": 0,
      "explanation": "why this answer is correct"
    },
    {
      "id": "l1q2",
      "level": 1,
      "type": "multiple_choice",
      "question": "question text",
      "choices": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctIndex": 0,
      "explanation": "why this answer is correct"
    },
    {
      "id": "l2q1",
      "level": 2,
      "type": "calculation",
      "question": "question text with specific numbers",
      "formula": "formula name and equation",
      "hints": ["step 1: ...", "step 2: ...", "step 3: ..."],
      "correctAnswer": 0,
      "acceptableRange": [0, 0],
      "feedback": {
        "correct": "great job message",
        "wrong": "step-by-step breakdown showing how to reach the answer"
      }
    },
    {
      "id": "l2q2",
      "level": 2,
      "type": "calculation",
      "question": "question text with specific numbers",
      "formula": "formula name and equation",
      "hints": ["step 1: ...", "step 2: ...", "step 3: ..."],
      "correctAnswer": 0,
      "acceptableRange": [0, 0],
      "feedback": {
        "correct": "great job message",
        "wrong": "step-by-step breakdown showing how to reach the answer"
      }
    },
    {
      "id": "l3q1",
      "level": 3,
      "type": "open_ended",
      "question": "open-ended synthesis question",
      "minWords": 30,
      "evaluationCriteria": [
        "criterion 1 the answer must address",
        "criterion 2 the answer must address",
        "criterion 3 the answer must address"
      ],
      "placeholder": "Share your reasoning..."
    }
  ]
}

Rules:
- correctAnswer for calculations must be a real number (no strings)
- acceptableRange must bracket correctAnswer with ±5-10% tolerance: [lowerBound, upperBound]
- All 5 questions must be present with the IDs: l1q1, l1q2, l2q1, l2q2, l3q1
- Make the scenario cohesive — all 5 questions should feel part of the same story`;
}

// ── Output Normalizer ─────────────────────────────────────────────────────────

function normalizeGroqOutput(parsed) {
  const raw = parsed.questions;
  if (!Array.isArray(raw)) return null;

  return raw.map((q, i) => {
    const base = {
      id:       q.id       || ['l1q1','l1q2','l2q1','l2q2','l3q1'][i] || `q${i}`,
      level:    q.level    || (i < 2 ? 1 : i < 4 ? 2 : 3),
      type:     q.type     || (i < 2 ? 'multiple_choice' : i < 4 ? 'calculation' : 'open_ended'),
      question: q.question || '',
    };

    if (base.type === 'multiple_choice') {
      return {
        ...base,
        choices:      q.choices      || [],
        correctIndex: q.correctIndex ?? 0,
        explanation:  q.explanation  || '',
      };
    }

    if (base.type === 'calculation') {
      const correct = Number(q.correctAnswer) || 0;
      const lo = q.acceptableRange?.[0] ?? Math.floor(correct * 0.95);
      const hi = q.acceptableRange?.[1] ?? Math.ceil(correct  * 1.05);
      return {
        ...base,
        formula:        q.formula        || '',
        hints:          q.hints          || [],
        correctAnswer:  correct,
        acceptableRange: [lo, hi],
        feedback: {
          correct: q.feedback?.correct || 'Correct!',
          wrong:   q.feedback?.wrong   || 'Check your calculation and try again.',
        },
      };
    }

    // open_ended
    return {
      ...base,
      minWords:           q.minWords           || 30,
      evaluationCriteria: q.evaluationCriteria || [],
      placeholder:        q.placeholder        || 'Share your reasoning...',
    };
  });
}

module.exports = { generateScenarioQuiz };
