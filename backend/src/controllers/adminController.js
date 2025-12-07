import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Rental from '../models/Rental.js';
import RentalHistory from '../models/RentalHistory.js';

export const getDashboard = async (_req, res) => {
  try {
    const [userCount, vehicleCount, activeRentals, historyCount] = await Promise.all([
      User.countDocuments(),
      Vehicle.countDocuments(),
      Rental.countDocuments({ status: { $in: ['active', 'pending'] } }),
      RentalHistory.countDocuments(),
    ]);

    res.json({
      userCount,
      vehicleCount,
      activeRentals,
      historyCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Unable to load admin dashboard', error: err.message });
  }
};

export const listUsers = async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch users', error: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Unable to update user role', error: err.message });
  }
};
