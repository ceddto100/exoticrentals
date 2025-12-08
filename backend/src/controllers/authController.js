import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
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

    // Ensure role is accurate based on Admin collection
    const adminRecord = await Admin.findOne({ email: userFromPassport.email });
    if (adminRecord) {
      userFromPassport.role = 'admin';
      if (!adminRecord.user || adminRecord.user.toString() !== userFromPassport._id.toString()) {
        adminRecord.user = userFromPassport._id;
        await adminRecord.save();
      }
    } else {
      userFromPassport.role = 'customer';
    }

    // Persist any role/avatar changes
    await User.findByIdAndUpdate(
      userFromPassport._id,
      { role: userFromPassport.role, avatarUrl: userFromPassport.avatarUrl },
      { new: true }
    );

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
