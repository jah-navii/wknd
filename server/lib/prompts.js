const VIBE_LABELS = {
  go_out: 'Going Out',
  stay_in: 'Staying In',
  active: 'Active / Physical',
  social: 'Social Activities',
};

const ENERGY_LABELS = {
  low: 'chill and relaxed',
  medium: 'moderate energy',
  high: 'high energy',
};

const BUDGET_LABELS = {
  free: 'free or near-free',
  low: 'low budget (under $20)',
  medium: 'medium budget ($20–$60)',
  high: 'willing to splurge ($60+)',
};

/**
 * Builds the system + user prompt for Claude.
 * @param {Array} watchHistory - [{ title, channelTitle }]
 * @param {Object} prefs - { vibes, duration, energy, budget }
 * @returns {string}
 */
export function buildPlanPrompt(watchHistory, prefs) {
  const historyLines = watchHistory.length > 0
    ? watchHistory
        .slice(0, 35)
        .map(v => `- "${v.title}" by ${v.channelTitle || 'unknown channel'}`)
        .join('\n')
    : 'No history available — generate a well-rounded general plan.';

  const vibeString = (prefs.vibes || [])
    .map(v => VIBE_LABELS[v] || v)
    .join(', ') || 'Any';

  const energyString = ENERGY_LABELS[prefs.energy] || prefs.energy;
  const budgetString = BUDGET_LABELS[prefs.budget] || prefs.budget;
  const duration = prefs.duration || 3;

  return `You are a personalized weekend activity planner. Your job is to analyze someone's YouTube watch history to infer their genuine interests and passions, then create a tailored weekend plan that feels personal and exciting.

YOUTUBE WATCH HISTORY (recent videos):
${historyLines}

USER PREFERENCES:
- Activity types wanted: ${vibeString}
- Time available: ${duration} hours
- Energy level: ${energyString}
- Budget: ${budgetString}

INSTRUCTIONS:
1. Analyze the watch history carefully. Look for patterns: topics they keep returning to, channels they follow, skills they're learning, hobbies they're exploring. Don't just look at surface titles — infer the underlying interest (e.g. "How to sharpen a knife" → cooking / culinary skills).
2. Extract 4–6 interest tags that best represent this person.
3. Generate 4–6 specific activity suggestions. Each activity must:
   - Match the user's preferred activity types and be realistic for the time/energy/budget given
   - Feel genuinely tailored to THIS person's interests, not generic
   - Include a clear connection back to their watch history

Respond ONLY with valid JSON. No markdown, no backticks, no extra text. Use this exact schema:

{
  "interests": ["tag1", "tag2", "tag3", "tag4"],
  "planTitle": "A short, punchy, personalized title for their weekend plan (5 words max)",
  "activities": [
    {
      "title": "Activity name (short, punchy)",
      "type": "go_out | stay_in | active | social",
      "duration": "e.g. 1.5 hours",
      "description": "2–3 sentences. What exactly to do, why it'll be great, any specific tips.",
      "why": "One sentence connecting this activity to something specific in their watch history."
    }
  ]
}`;
}
