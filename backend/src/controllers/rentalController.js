import { validationResult, body } from 'express-validator';
import Rental from '../models/Rental.js';
import RentalHistory from '../models/RentalHistory.js';
import Vehicle from '../models/Vehicle.js';

export const rentalValidators = [
  body('vehicle').notEmpty().withMessage('Vehicle is required'),
  body('startDate').isISO8601().withMessage('Start date is required'),
  body('endDate').isISO8601().withMessage('End date is required'),
];

export const createRental = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { vehicle: vehicleId, startDate, endDate, totalCost, addOns = [], notes } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const rental = await Rental.create({
      user: userId,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalCost,
      addOns,
      notes,
    });

    await RentalHistory.create({
      rental: rental._id,
      user: userId,
      action: 'created',
      notes: notes || 'Booking created via checkout',
    });

    res.status(201).json({ success: true, rental });
  } catch (err) {
    res.status(500).json({ message: 'Unable to create rental', error: err.message });
  }
};

export const getRentals = async (req, res) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { user: req.user?._id };
    const rentals = await Rental.find(query)
      .populate('vehicle user')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch rentals', error: err.message });
  }
};
