import admin from '../lib/firebase.js';

/**
 * Middleware: verifies the Firebase ID token sent in Authorization header.
 * On success, attaches req.user = { uid, email, name, accessToken }
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
    };

    // The Google OAuth access token (for YouTube API) is passed separately
    // in X-Access-Token header — it cannot be retrieved from the ID token
    const accessToken = req.headers['x-access-token'];
    if (accessToken) req.user.accessToken = accessToken;

    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
