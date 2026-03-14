import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/auth/me — verifies token and returns user info
router.get('/me', requireAuth, (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email,
    name: req.user.name,
  });
});

export default router;
