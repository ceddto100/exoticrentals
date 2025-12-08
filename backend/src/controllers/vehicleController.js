import { validationResult } from 'express-validator';
import Vehicle from '../models/Vehicle.js';

const normalizeVehiclePayload = (payload = {}) => {
  const images = Array.isArray(payload.images)
    ? payload.images.filter((img) => typeof img === 'string' && img.trim().length > 0)
    : payload.imageUrl
      ? [payload.imageUrl]
      : [];

  const features = Array.isArray(payload.features)
    ? payload.features.filter((feature) => typeof feature === 'string' && feature.trim().length > 0)
    : [];

  return {
    ...payload,
    images,
    features,
    imageUrl: payload.imageUrl || images[0],
  };
};

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

    const payload = normalizeVehiclePayload(req.body);
    const vehicle = await Vehicle.create(payload);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Unable to create vehicle', error: err.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const payload = normalizeVehiclePayload(req.body);
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
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
    if (!vehicle.images || vehicle.images.length === 0) {
      vehicle.images = vehicle.imageUrl ? [vehicle.imageUrl] : [];
    }
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
