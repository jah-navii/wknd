import { Router } from 'express';
import axios from 'axios';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const YT_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * GET /api/youtube/history
 * Fetches the user's liked videos using their Google OAuth access token.
 */
router.get('/history', requireAuth, async (req, res) => {
  const accessToken = req.user.accessToken;

  if (!accessToken) {
    return res.status(400).json({ error: 'Google OAuth access token required (X-Access-Token header)' });
  }

  try {
    const response = await axios.get(`${YT_BASE}/videos`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        part: 'snippet',
        myRating: 'like',
        maxResults: 50,
      },
    });

    const items = (response.data.items || []).map(v => ({
      title: v.snippet?.title,
      channelTitle: v.snippet?.channelTitle,
      videoId: v.id,
      publishedAt: v.snippet?.publishedAt,
    }));

    res.json({ source: 'liked', items });

  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.error?.message || err.message;
    console.error('YouTube API error:', status, message);

    if (status === 401 || status === 403) {
      return res.status(403).json({
        error: 'YouTube access denied. Make sure the YouTube Data API v3 scope was granted.',
        detail: message,
      });
    }

    res.status(500).json({ error: 'Failed to fetch liked videos', detail: message });
  }
});

export default router;