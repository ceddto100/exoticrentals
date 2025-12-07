import jwt from 'jsonwebtoken';

export const googleCallback = (req, res) => {
  const user = req.user;

  // Build a SAFE JWT payload — no undefined values
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl || null,   // Prevents React crash
    name: user.name || null              // Optional: helps frontend
  };

  // Sign the JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  // Redirect back to frontend
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${token}`;
  return res.redirect(redirectUrl);
};

// REQUIRED for authRoutes.js
export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  return res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    avatarUrl: req.user.avatarUrl || null,
    name: req.user.name || null
  });
};
