import { validationResult } from 'express-validator';
import Schedule from '../models/Schedule.js';
import Vehicle from '../models/Vehicle.js';

const ensureVehicleExists = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId);
  return vehicle;
};

export const createSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const schedule = await Schedule.create({ ...req.body, type: 'availability' });
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Unable to create schedule', error: err.message });
  }
};

export const createReservationSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { vehicle: vehicleId, startDate, endDate, totalCost, depositAmount = 0, balanceDue = 0, notes, rentalId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    const vehicle = await ensureVehicleExists(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    const schedule = await Schedule.create({
      vehicle: vehicleId,
      user: userId,
      startDate,
      endDate,
      totalCost,
      depositAmount,
      balanceDue,
      rental: rentalId,
      type: 'reservation',
      status: 'booked',
      notes,
    });

    res.status(201).json({ success: true, schedule });
  } catch (err) {
    res.status(500).json({ message: 'Unable to create reservation schedule', error: err.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Unable to update schedule', error: err.message });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { user: req.user?._id };
    const schedules = await Schedule.find(query)
      .populate('vehicle user rental')
      .sort({ createdAt: -1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch schedules', error: err.message });
  }
};

export const getVehicleSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.find({ vehicle: req.params.vehicleId }).populate('vehicle user rental');
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch vehicle schedule', error: err.message });
  }
};
