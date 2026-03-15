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

  const whereStr    = (prefs.where    || []).join(', ') || 'any';
  const whoStr      = (prefs.who      || []).join(', ') || 'any';
  const moodStr     = (prefs.mood     || []).join(', ') || 'chill';
  const durationStr = (prefs.duration || []).join(', ') || 'couple_hours';

  return `You are a personalized weekend activity planner. Analyze someone's YouTube liked videos to infer their interests, then suggest weekend activity ideas.

YOUTUBE LIKED VIDEOS:
${historyLines}

USER PREFERENCES:
- Where: ${whereStr}
- Who with: ${whoStr}
- Mood: ${moodStr}
- Duration: ${durationStr}

INSTRUCTIONS:
1. Infer 3-5 interest tags from the liked videos.
2. Generate exactly 4 broad activity ideas that match the preferences. Keep them high-level — the user taps a card to get specific details.
3. Make sure activities respect ALL the preferences — e.g. if solo + stay_in + productive, don't suggest group outings.
4. For each activity, include 2-3 relevant tags from the user's interest tags that directly relate to why this activity was suggested.

Respond ONLY with valid JSON, no markdown, no backticks:

{
  "interests": ["tag1", "tag2", "tag3"],
  "planTitle": "Punchy 3-4 word title",
  "activities": [
    {
      "title": "Short punchy activity name",
      "type": "go_out | stay_in | active | social",
      "hook": "One exciting sentence that makes them want to tap for more.",
      "why": "One short sentence — which videos or interests inspired this suggestion.",
      "tags": ["tag1", "tag2"],
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