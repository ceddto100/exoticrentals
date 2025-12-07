import { validationResult } from 'express-validator';
import Vehicle from '../models/Vehicle.js';

export const listVehicles = async (_req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Unable to list vehicles', error: err.message });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Unable to create vehicle', error: err.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Unable to update vehicle', error: err.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle removed' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to delete vehicle', error: err.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    vehicle.isAvailable = isAvailable;
    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Unable to update availability', error: err.message });
  }
};

export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch vehicle', error: err.message });
  }
};
