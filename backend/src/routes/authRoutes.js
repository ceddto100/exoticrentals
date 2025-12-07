import express from 'express';
import passport from 'passport';
import { googleCallback, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Redirects to Google's consent screen
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Handles the callback from Google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login/failed' }),
  googleCallback
);

router.get('/me', protect, getMe);

export default router;
