import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

const router = express.Router();

const loginValidators = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/login', loginValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!admin.password) {
      return res.status(400).json({ message: 'Admin credentials are not configured' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let user = null;
    if (admin.user) {
      user = await User.findById(admin.user);
    }

    if (!user) {
      user = await User.findOne({ email: normalizedEmail });
    }

    if (!user) {
      user = new User({
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0] || 'Admin',
        role: 'admin',
      });
    } else if (user.role !== 'admin') {
      user.role = 'admin';
    }

    await user.save();

    if (!admin.user || admin.user.toString() !== user._id.toString()) {
      admin.user = user._id;
      if (!admin.role) {
        admin.role = 'admin';
      }
      await admin.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'admin' },
      process.env.JWT_SECRET || 'development-secret',
      { expiresIn: '7d' }
    );

    return res.json({ token });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Failed to login admin', error: error.message });
  }
});

export default router;
