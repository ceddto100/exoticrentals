import express from 'express';
import passport from 'passport';
import { getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// FRONTEND URL (MUST MATCH YOUR DEPLOYED FRONTEND)
const FRONTEND_URL = process.env.FRONTEND_URL || "https://exoticrentals-eta.vercel.app";

// === GOOGLE LOGIN ===
// Redirect user to Google consent screen
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// === GOOGLE CALLBACK ===
// This runs AFTER Google sends user back to your backend
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${FRONTEND_URL}/login?error=google-auth-failed`,
  }),
  (req, res) => {
    const token = req.user.token; // token generated in passport strategy
    // Redirect user to frontend success page
    res.redirect(`${FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// === GET CURRENT LOGGED-IN USER ===
router.get('/me', protect, getMe);

export default router;
