import express from 'express';
import { body } from 'express-validator';
import { createSchedule, getSchedules, updateSchedule, getVehicleSchedule } from '../controllers/scheduleController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const scheduleValidators = [body('vehicle').notEmpty(), body('weekOf').isISO8601()];

router.get('/', protect, getSchedules);
router.get('/vehicle/:vehicleId', protect, getVehicleSchedule);
router.post('/', protect, requireAdmin, scheduleValidators, createSchedule);
router.put('/:id', protect, requireAdmin, scheduleValidators, updateSchedule);

export default router;
