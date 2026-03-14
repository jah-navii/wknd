import { Router } from 'express';
import axios from 'axios';
import { requireAuth } from '../middleware/auth.js';
import { buildPlanPrompt } from '../lib/prompts.js';

const router = Router();

router.post('/generate', requireAuth, async (req, res) => {
  const { watchHistory, prefs } = req.body;

  if (!prefs) {
    return res.status(400).json({ error: 'Missing prefs in request body' });
  }

  const prompt = buildPlanPrompt(watchHistory || [], prefs);

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const raw = response.data.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, '').trim();

    let plan;
    try {
      plan = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse Groq response:', raw);
      return res.status(500).json({ error: 'AI returned malformed JSON. Try again.' });
    }

    res.json(plan);

  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error('Groq error:', detail);
    res.status(500).json({ error: 'Failed to generate plan', detail });
  }
});

export default router;