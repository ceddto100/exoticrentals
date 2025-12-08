
import jwt from 'jsonwebtoken';

// This function is called after successful Google authentication.
export const googleCallback = (req, res) => {
  // Passport attaches the authenticated user to req.user.
  const user = req.user;

  // 1. Create a "safe" JWT payload.
  // We ensure no fields are undefined to prevent issues on the frontend.
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role || 'customer', // Default role if not provided
    name: user.name || 'User',
    avatarUrl: user.avatarUrl || null, // Use null as a fallback
  };

  // 2. Sign the JWT.
  // This token will be sent to the frontend to manage the session.
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );

  // 3. Construct the final redirect URL.
  // This sends the user back to the frontend with the token in the URL.
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${token}`;

  // 4. Redirect the user.
  res.redirect(redirectUrl);
};

// This function retrieves the current user's data based on a valid JWT.
// It's used by the frontend to verify the session.
export const getMe = (req, res) => {
  // The 'protect' middleware (not shown here) should have already verified
  // the JWT and attached the user data to req.user.
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  // Return the user data stored in the token.
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    name: req.user.name,
    avatarUrl: req.user.avatarUrl,
  });
};
