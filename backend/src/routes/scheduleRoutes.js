import express from 'express';
import { body } from 'express-validator';
import {
  createSchedule,
  getSchedules,
  updateSchedule,
  getVehicleSchedule,
  createReservationSchedule,
} from '../controllers/scheduleController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const scheduleValidators = [body('vehicle').notEmpty(), body('weekOf').isISO8601()];
const reservationValidators = [
  body('vehicle').notEmpty(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
];

router.get('/', protect, getSchedules);
router.get('/vehicle/:vehicleId', protect, getVehicleSchedule);
router.post('/', protect, requireAdmin, scheduleValidators, createSchedule);
router.put('/:id', protect, requireAdmin, scheduleValidators, updateSchedule);
router.post('/bookings', protect, reservationValidators, createReservationSchedule);

export default router;
