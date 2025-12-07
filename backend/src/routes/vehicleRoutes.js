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
  body('make').notEmpty(),
  body('model').notEmpty(),
  body('year').isNumeric(),
  body('category').notEmpty(),
  body('pricePerDay').isNumeric(),
];

router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.post('/', protect, requireAdmin, vehicleValidators, createVehicle);
router.put('/:id', protect, requireAdmin, vehicleValidators, updateVehicle);
router.patch('/:id/availability', protect, requireAdmin, body('isAvailable').isBoolean(), updateAvailability);
router.delete('/:id', protect, requireAdmin, deleteVehicle);

export default router;
