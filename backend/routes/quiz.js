// FINLIT — Scenario Quiz Routes
// POST /api/quiz/generate        → 5-question scenario set (template or Groq)
// POST /api/quiz/evaluate-open-ended → Groq scores a Level 3 Boss Fight answer

const express = require('express');
const router  = express.Router();
const Groq    = require('groq-sdk');
const { generateScenarioQuiz } = require('../services/scenarioGenerator');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── POST /api/quiz/generate ───────────────────────────────────────────────────

router.post('/generate', async (req, res) => {
  const { topic, domain, interest, difficulty = 'beginner', variant = 0 } = req.body;
  const resolvedDomain = domain || interest || 'general';

  if (!topic) {
    return res.status(400).json({ success: false, error: 'topic is required' });
  }

  try {
    const result = await generateScenarioQuiz(topic, resolvedDomain, difficulty, Number(variant));
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('[QuizRoute] /generate error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to generate scenario quiz' });
  }
});

// ── POST /api/quiz/evaluate-open-ended ───────────────────────────────────────

router.post('/evaluate-open-ended', async (req, res) => {
  const {
    topic,
    domain,
    scenarioContext = '',
    question,
    evaluationCriteria = [],
    userAnswer,
  } = req.body;

  if (!question || !userAnswer) {
    return res.status(400).json({ success: false, error: 'question and userAnswer are required' });
  }

  try {
    const evaluation = await evaluateOpenEnded({
      topic, domain, scenarioContext, question, evaluationCriteria, userAnswer,
    });
    return res.json({ success: true, ...evaluation });
  } catch (err) {
    console.error('[QuizRoute] /evaluate-open-ended error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to evaluate answer' });
  }
});

// ── Groq Evaluator ────────────────────────────────────────────────────────────

async function evaluateOpenEnded({ topic, domain, scenarioContext, question, evaluationCriteria, userAnswer }) {
  const criteriaList = evaluationCriteria
    .map((c, i) => `  ${i + 1}. ${c}`)
    .join('\n');

  const systemPrompt = `You are a fair and encouraging financial literacy tutor evaluating a student's open-ended answer.
Score answers on depth of understanding, not grammar or word count.
Be constructive — point out what they got right before noting gaps.
Respond only with valid JSON, no prose outside the JSON.`;

  const userPrompt = `Topic: "${topic}" (domain context: ${domain || 'general'})
${scenarioContext ? `Scenario: ${scenarioContext}` : ''}

Question asked:
"${question}"

Evaluation criteria (what a complete answer must address):
${criteriaList || '  1. Demonstrates understanding of the core concept'}

Student's answer:
"${userAnswer}"

Evaluate and respond with this exact JSON schema:
{
  "score": 4,
  "passed": true,
  "feedback": "2-3 sentence overall assessment",
  "strengths": ["specific thing they got right", "another strength"],
  "missed": ["specific gap or missing point if any"]
}

Scoring guide:
  5 = Exceptional — addresses all criteria with insight and a concrete example
  4 = Good — addresses most criteria clearly
  3 = Passing — shows core understanding even if incomplete
  2 = Needs work — shows partial understanding, missing key points
  1 = Insufficient — off-topic or fundamentally incorrect

Set passed = true when score >= 3.
Keep feedback warm and motivating. The "missed" array should be empty [] if score >= 4.`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt },
    ],
    max_tokens: 600,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw);

  return {
    score:     Number(parsed.score)    || 1,
    passed:    Boolean(parsed.passed)  ?? false,
    feedback:  parsed.feedback         || 'Keep working at it!',
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    missed:    Array.isArray(parsed.missed)    ? parsed.missed    : [],
  };
}

module.exports = router;
