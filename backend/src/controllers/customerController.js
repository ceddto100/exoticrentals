import { validationResult } from 'express-validator';
import User from '../models/User.js';

export const createCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const customer = await User.create({ ...req.body, role: 'customer' });
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Unable to create customer', error: err.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Customer not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Unable to update customer', error: err.message });
  }
};

export const listCustomers = async (_req, res) => {
  try {
    const customers = await User.find({ role: 'customer' });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch customers', error: err.message });
  }
};
