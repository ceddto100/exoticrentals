import express from 'express';
import {
  createSchedule,
  getSchedules,
  updateSchedule,
  getVehicleSchedule,
  getCustomerSchedules,
} from '../controllers/scheduleController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", protect, createSchedule);
router.get("/", protect, requireAdmin, getSchedules);
router.get("/customer/:id", protect, getCustomerSchedules);
router.get("/vehicle/:vehicleId", protect, getVehicleSchedule);
router.put("/:id", protect, requireAdmin, updateSchedule);

export default router;
