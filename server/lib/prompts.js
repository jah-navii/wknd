const VIBE_LABELS = {
  go_out:  'Going Out',
  stay_in: 'Staying In',
  active:  'Active / Physical',
  social:  'Social Activities',
};

export function buildPlanPrompt(watchHistory, prefs) {
  const historyLines = watchHistory.length > 0
    ? watchHistory.slice(0, 35).map(v => `- "${v.title}" by ${v.channelTitle || 'unknown channel'}`).join('\n')
    : 'No history available — generate a well-rounded general plan.';

  const vibeString = (prefs.vibes || []).map(v => VIBE_LABELS[v] || v).join(', ') || 'Any';

  return `You are a personalized weekend activity planner. Analyze someone's YouTube liked videos to infer their interests, then suggest broad weekend activity ideas.

YOUTUBE LIKED VIDEOS:
${historyLines}

USER PREFERENCES:
- Activity types: ${vibeString}
- Vibe: ${prefs.vibe || 'chill'}

INSTRUCTIONS:
1. Infer 3-5 interest tags from the liked videos.
2. Generate exactly 4 broad activity ideas. Keep them high-level and intriguing, NOT overly specific. The user taps a card to get details.
3. Each activity type must match one of the user's chosen activity types.

Respond ONLY with valid JSON, no markdown, no backticks:

{
  "interests": ["tag1", "tag2", "tag3"],
  "planTitle": "Punchy 3-4 word title",
  "activities": [
    {
      "title": "Short punchy activity name",
      "type": "go_out | stay_in | active | social",
      "hook": "One exciting sentence that makes them want to tap for more.",
      "why": "One short sentence — which videos inspired this suggestion.",
      "category": "food | outdoors | creative | gaming | fitness | music | shopping | learning | social"
    }
  ]
}`;
}

export function buildDrillPrompt(activity, interests, nearbyPlaces) {
  const isGoOut = ['go_out', 'active', 'social'].includes(activity.type);

  const placesText = nearbyPlaces.length > 0
    ? nearbyPlaces.map(p => `- ${p.name} (${p.vicinity}) — rating: ${p.rating || 'N/A'}`).join('\n')
    : 'No nearby places available.';

  const goOutSchema = `"places": [{ "name": "Place name from nearby list", "reason": "Why this fits", "tip": "Specific visit tip" }]`;
  const stayInSchema = `"shoppingList": [{ "item": "Specific product name", "why": "What it is for" }]`;

  return `You are a weekend activity specialist. The user picked an activity and wants a specific actionable plan.

CHOSEN ACTIVITY: "${activity.title}"
TYPE: ${activity.type}
USER INTERESTS: ${interests.join(', ')}

${isGoOut ? `NEARBY PLACES (real Google Places results):
${placesText}

Use these actual places in your recommendations.` : ''}

For stay_in: suggest specific projects, exact products to buy, tutorials to follow, recipes to try.
For go_out/active/social: recommend specific places from the nearby list, what to do there, tips.

Respond ONLY with valid JSON, no markdown, no backticks:

{
  "title": "Specific catchy title",
  "overview": "2-3 sentence exciting overview",
  "steps": [
    { "step": "Step title", "detail": "Specific actionable detail" }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  ${isGoOut ? goOutSchema : stayInSchema},
  "timeEstimate": "e.g. 2-3 hours"
}`;
}