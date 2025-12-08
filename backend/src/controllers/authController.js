import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const buildFrontendUrl = () => {
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable is required for OAuth redirects');
  }
  return process.env.FRONTEND_URL.replace(/\/$/, '');
};

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }
  return process.env.JWT_SECRET;
};

const signToken = (user) => {
  const payload = {
    id: user._id?.toString(),
    email: user.email,
    role: user.role || 'customer',
    name: user.name || 'User',
    avatarUrl: user.avatarUrl || null,
  };

  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
};

// Google OAuth callback
export const googleCallback = async (req, res, next) => {
  try {
    const userFromPassport = req.user;

    if (!userFromPassport) {
      return res.redirect(`${buildFrontendUrl()}/login?error=missing_user`);
    }

    // The user's role is now set within the Passport strategy.
    // We just need to generate a token and complete the login flow.

    const token = signToken(userFromPassport);
    const redirectUrl = `${buildFrontendUrl()}/auth/success?token=${token}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    return next(error);
  }
};

// Current user endpoint
export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  return res.status(200).json({
    id: req.user._id?.toString(),
    email: req.user.email,
    role: req.user.role,
    name: req.user.name,
    avatarUrl: req.user.avatarUrl || null,
  });
};
