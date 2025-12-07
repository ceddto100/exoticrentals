import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'development-secret', {
    expiresIn: '7d',
  });

const upsertUserProfile = async ({ googleId, email, name, avatarUrl, role }) => {
  let user = await User.findOne({ $or: [{ googleId }, { email }] });
  if (!user) {
    user = await User.create({ googleId, email, name, avatarUrl, role: role || 'customer' });
  } else {
    user.googleId = user.googleId || googleId;
    user.name = name || user.name;
    user.avatarUrl = avatarUrl || user.avatarUrl;
    user.role = role || user.role;
    await user.save();
  }

  if (user.role === 'admin') {
    await Admin.findOneAndUpdate(
      { user: user._id },
      { user: user._id, permissions: ['manage_users', 'manage_fleet', 'view_reports'] },
      { upsert: true, new: true }
    );
  }

  user.lastLogin = new Date();
  await user.save();
  return user;
};

export const googleAuth = async (req, res) => {
  try {
    const { idToken, role, email: providedEmail, name: providedName, avatarUrl } = req.body;
    let payload;

    if (!idToken) {
      if (process.env.ALLOW_DEMO_AUTH === 'true' && providedEmail) {
        payload = { sub: 'demo-user', email: providedEmail, name: providedName || 'Demo User', picture: avatarUrl };
      } else {
        return res.status(400).json({ message: 'Google idToken is required' });
      }
    } else {
      const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
      payload = ticket.getPayload();
    }

    const user = await upsertUserProfile({
      googleId: payload.sub,
      email: payload.email || providedEmail,
      name: payload.name || providedName,
      avatarUrl: payload.picture || avatarUrl,
      role: role || 'customer',
    });

    const token = signToken(user);

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.error('Auth error', err);
    res.status(500).json({ message: 'Google authentication failed', error: err.message });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CALLBACK_URL) {
      return res.status(400).json({ message: 'Google OAuth is not configured' });
    }

    const oauthClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    const { tokens } = await oauthClient.getToken(code);
    const ticket = await oauthClient.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();

    const user = await upsertUserProfile({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      avatarUrl: payload.picture,
    });

    const token = signToken(user);
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}`;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error('Google callback error', err);
    return res.status(500).json({ message: 'OAuth callback failed', error: err.message });
  }
};

export const getMe = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({ user });
};
