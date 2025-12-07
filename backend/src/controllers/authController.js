import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generates a JWT for the user
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'development-secret', {
    expiresIn: '7d',
  });

// This function is now the callback for the Google OAuth flow
export const googleCallback = (req, res) => {
  // Passport.js attaches the user to req.user after successful authentication
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const user = req.user;
  const token = signToken(user);

  // Redirect to the frontend with the JWT
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${token}`;
  res.redirect(redirectUrl);
};

// Fetches the current user's profile
export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({ user: req.user });
};
