import express from 'express';
import { createRental, getRentals, rentalValidators } from '../controllers/rentalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getRentals);
router.post('/', protect, rentalValidators, createRental);

export default router;
