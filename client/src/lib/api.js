/**
 * Thin wrapper around fetch that attaches Firebase ID token
 * and Google OAuth access token to every request.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function apiFetch(path, options = {}, { idToken, accessToken } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(idToken     && { Authorization: `Bearer ${idToken}` }),
    ...(accessToken && { 'X-Access-Token': accessToken }),
    ...options.headers,
  };

  const res  = await fetch(`${BASE_URL}/api${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  /** Verify token and get user info */
  getMe: (tokens) => apiFetch('/auth/me', {}, tokens),

  /** Fetch YouTube watch history */
  getHistory: (tokens) => apiFetch('/youtube/history', {}, tokens),

  /** Generate weekend plan */
  generatePlan: (body, tokens) =>
    apiFetch('/plan/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    }, tokens),

  drillDown: (body, tokens) =>
  apiFetch('/plan/drill', { method: 'POST', body: JSON.stringify(body) }, tokens),
};
