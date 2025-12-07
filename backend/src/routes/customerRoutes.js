import express from 'express';
import { body } from 'express-validator';
import { createCustomer, listCustomers, updateCustomer } from '../controllers/customerController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const customerValidators = [body('email').isEmail(), body('name').notEmpty()];

router.get('/', protect, requireAdmin, listCustomers);
router.post('/', protect, requireAdmin, customerValidators, createCustomer);
router.put('/:id', protect, requireAdmin, customerValidators, updateCustomer);

export default router;
