import jwt from "jsonwebtoken";

export const googleCallback = (req, res) => {
  const token = req.user?.token;

  if (!token) {
    console.error("Google callback: No token found on user.");
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=no-token`);
  }

  return res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
};

export const getMe = (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  });
};
