import jwt from 'jsonwebtoken';

export const googleCallback = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${token}`;
  return res.redirect(redirectUrl);
};

// REQUIRED BY authRoutes.js — THIS FIXES THE CRASH
export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  return res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  });
};

