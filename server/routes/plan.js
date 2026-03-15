import { Router } from 'express';
import axios from 'axios';
import { requireAuth } from '../middleware/auth.js';
import { buildPlanPrompt, buildDrillPrompt } from '../lib/prompts.js';

const router = Router();
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

async function callGroq(prompt) {
  const res = await axios.post(
    GROQ_URL,
    { model: MODEL, messages: [{ role: 'user', content: prompt }], temperature: 0.7 },
    { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' } }
  );
  return res.data.choices[0].message.content;
}

function parseJSON(raw) {
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

// Maps activity category to OSM filter
const OSM_FILTERS = {
  food:     '"amenity"="restaurant"',
  outdoors: '"leisure"="park"',
  fitness:  '"leisure"="fitness_centre"',
  social:   '"amenity"="bar"',
  music:    '"amenity"="cinema"',
  shopping: '"shop"="mall"',
  creative: '"tourism"="gallery"',
  learning: '"tourism"="museum"',
};

async function fetchNearbyPlaces(lat, lng, category) {
  const filter = OSM_FILTERS[category] || '"amenity"="restaurant"';
  const query = `
[out:json][timeout:10];
node[${filter}](around:300000,${lat},${lng});
out 6;
`;
  const res = await axios.post('https://overpass-api.de/api/interpreter', query, {
    headers: { 'Content-Type': 'text/plain' },
  });

  console.log(res);

  return (res.data.elements || [])
    .filter(p => p.tags?.name)
    .slice(0, 6)
    .map(p => ({
      name:     p.tags.name,
      vicinity: p.tags['addr:street'] || p.tags['addr:suburb'] || '',
      rating:   null,
      cuisine:  p.tags.cuisine || null,
    }));
}

// Phase 1 — broad cards
router.post('/generate', requireAuth, async (req, res) => {
  const { watchHistory, prefs } = req.body;
  if (!prefs) return res.status(400).json({ error: 'Missing prefs' });
  try {
    const plan = parseJSON(await callGroq(buildPlanPrompt(watchHistory || [], prefs)));
    res.json(plan);
  } catch (err) {
    console.error('Groq error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate plan', detail: err.response?.data || err.message });
  }
});

// Phase 2 — drill-down
router.post('/drill', requireAuth, async (req, res) => {
  const { activity, interests, lat, lng } = req.body;
  if (!activity) return res.status(400).json({ error: 'Missing activity' });

  const isGoOut = ['go_out', 'active', 'social'].includes(activity.type);
  let nearbyPlaces = [];

  if (isGoOut && lat && lng) {
    try {
      nearbyPlaces = await fetchNearbyPlaces(lat, lng, activity.category);
      console.log('OSM places:', JSON.stringify(nearbyPlaces, null, 2));
    } catch (err) {
      console.error('OSM error:', err.message); // non-fatal
    }
  }

  try {
    const detail = parseJSON(await callGroq(buildDrillPrompt(activity, interests || [], nearbyPlaces)));
    res.json({ ...detail, nearbyPlaces });
  } catch (err) {
    console.error('Groq drill error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate drill-down', detail: err.response?.data || err.message });
  }
});

export default router;