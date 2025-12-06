import { validationResult } from 'express-validator';
import RentalHistory from '../models/RentalHistory.js';

export const logHistory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const history = await RentalHistory.create(req.body);
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ message: 'Unable to log rental history', error: err.message });
  }
};

export const getHistory = async (_req, res) => {
  try {
    const history = await RentalHistory.find().populate('rental user');
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch rental history', error: err.message });
  }
};

export const getHistoryByCustomer = async (req, res) => {
  try {
    const history = await RentalHistory.find({ user: req.params.userId }).populate('rental user');
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch rental history for customer', error: err.message });
  }
};
