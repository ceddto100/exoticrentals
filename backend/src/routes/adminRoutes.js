import express from 'express';
import { body } from 'express-validator';
import { getDashboard, listUsers, updateUserRole } from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, requireAdmin, getDashboard);
router.get('/users', protect, requireAdmin, listUsers);
router.patch('/users/:userId/role', protect, requireAdmin, body('role').isIn(['admin', 'customer']), updateUserRole);

export default router;
