import { validationResult } from 'express-validator';
import Schedule from '../models/Schedule.js';

export const createSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const schedule = await Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Unable to create schedule', error: err.message });
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

export const getSchedules = async (_req, res) => {
  try {
    const schedules = await Schedule.find().populate('vehicle');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch schedules', error: err.message });
  }
};

export const getVehicleSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.find({ vehicle: req.params.vehicleId }).populate('vehicle');
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch vehicle schedule', error: err.message });
  }
};
