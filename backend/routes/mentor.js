const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const supabase = require('../config/supabase');
const { buildMessages, getFallbackResponse, postProcess } = require('../services/mentorPromptBuilder');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getAuthUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// POST /api/mentor/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, context = {}, conversationHistory = [] } = req.body;

    if (!message || message.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Message too short' });
    }

    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const messages = buildMessages(message.trim(), context, conversationHistory);

    let responseText = null;

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      responseText = completion.choices[0]?.message?.content?.trim() || null;
      if (responseText) responseText = postProcess(responseText, context.interest || 'gaming');
      console.log(`[Mentor] Groq response received (${responseText?.length ?? 0} chars)`);
    } catch (aiErr) {
      console.error('[Mentor] Groq error:', aiErr.message);
    }

    // Fall back to interest-specific templates if OpenAI fails
    if (!responseText || responseText.length < 10) {
      responseText = getFallbackResponse(message, context);
      console.log('[Mentor] Using fallback response');
    }

    // Save both messages to DB asynchronously — don't block the response
    const now = Date.now();
    supabase.from('mentor_conversations').insert([
      {
        user_id: user.id,
        role: 'user',
        message: message.trim(),
        topic_context: context.currentTopic || null,
        interest_context: context.interest || null,
        created_at: new Date(now).toISOString(),
      },
      {
        user_id: user.id,
        role: 'assistant',
        message: responseText,
        topic_context: context.currentTopic || null,
        interest_context: context.interest || null,
        created_at: new Date(now + 1).toISOString(),
      },
    ]).then(({ error }) => {
      if (error) console.error('[Mentor] DB save error:', error.message);
    });

    res.json({ success: true, response: responseText });
  } catch (err) {
    console.error('[Mentor] chat error:', err);
    res.status(500).json({ success: false, error: 'Mentor unavailable right now. Try again!' });
  }
});

// GET /api/mentor/history/:userId
router.get('/history/:userId', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user || user.id !== req.params.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('mentor_conversations')
      .select('id, role, message, topic_context, created_at')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: true })
      .limit(40);

    if (error) throw error;

    res.json({ success: true, history: data || [] });
  } catch (err) {
    console.error('[Mentor] history error:', err);
    res.status(500).json({ success: false, error: 'Failed to load conversation history' });
  }
});

module.exports = router;
