import express from 'express';
import { body } from 'express-validator';
import { getHistory, getHistoryByCustomer, logHistory } from '../controllers/rentalHistoryController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, requireAdmin, getHistory);
router.get('/customer/:userId', protect, getHistoryByCustomer);
router.post(
  '/',
  protect,
  [body('rental').notEmpty(), body('action').notEmpty()],
  logHistory
);

export default router;
