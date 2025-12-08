import express from 'express';
import { body } from 'express-validator';
import {
  createVehicle,
  deleteVehicle,
  listVehicles,
  updateAvailability,
  updateVehicle,
  getVehicle,
} from '../controllers/vehicleController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const vehicleValidators = [
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900 }).withMessage('Year is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('pricePerDay').isFloat({ gt: 0 }).withMessage('Daily rate is required'),
  body('isAvailable').isBoolean().withMessage('Availability is required'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required')
    .custom((images) => images.every((img) => typeof img === 'string' && img.trim().length > 0))
    .withMessage('Images must be an array of URLs'),
];

router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.post('/', protect, requireAdmin, vehicleValidators, createVehicle);
router.put('/:id', protect, requireAdmin, vehicleValidators, updateVehicle);
router.patch('/:id/availability', protect, requireAdmin, body('isAvailable').isBoolean(), updateAvailability);
router.delete('/:id', protect, requireAdmin, deleteVehicle);

export default router;
