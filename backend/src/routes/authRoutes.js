import express from 'express';
import passport from 'passport';
import { googleAuth, googleCallback, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/google', googleAuth);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);
router.get('/me', protect, getMe);

export default router;
