import jwt from 'jsonwebtoken';

export const googleCallback = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // CORRECT REDIRECT URL — ONLY THIS WORKS
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${token}`;

  return res.redirect(redirectUrl);
};
