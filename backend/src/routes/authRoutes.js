
import express from 'express';
import passport from 'passport';
import { googleCallback, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to initiate Google OAuth flow
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // Request profile and email access
    session: false, // We are using JWTs, so no server session is needed
  })
);

// Google callback URL
// This is where Google redirects the user after they grant permission.
router.get(
  '/google/callback',
  // Authenticate with Google and disable sessions
  passport.authenticate('google', { session: false, failureRedirect: '/login/failed' }),
  // If authentication is successful, the googleCallback controller is executed.
  googleCallback
);

// Route to get the currently authenticated user's data
// The 'protect' middleware ensures only authenticated users can access this.
router.get('/me', protect, getMe);

export default router;
