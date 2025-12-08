import Schedule from '../models/Schedule.js';

export const createSchedule = async (req, res) => {
  try {
    const { vehicleId, customerId, startDate, endDate, depositAmount, totalPrice, status } = req.body;

    if (!vehicleId || !customerId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const schedule = await Schedule.create({
      vehicleId,
      customerId,
      startDate,
      endDate,
      depositAmount,
      totalPrice,
      status: status || "pending"
    });

    return res.status(201).json({ success: true, schedule });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getSchedules = async (req, res) => {
    try {
      const schedules = await Schedule.find({})
        .populate('vehicleId')
        .populate('customerId')
        .sort({ createdAt: -1 });
      res.json(schedules);
    } catch (err) {
      res.status(500).json({ message: 'Unable to fetch schedules', error: err.message });
    }
};

export const getCustomerSchedules = async (req, res) => {
    try {
      const schedules = await Schedule.find({ customerId: req.params.id })
        .populate('vehicleId', 'make model year images dailyRate');
      res.json(schedules);
    } catch (err) {
      res.status(500).json({ message: 'Unable to fetch customer schedules', error: err.message });
    }
};

export const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Unable to update schedule', error: err.message });
  }
};

export const getVehicleSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.find({ vehicleId: req.params.vehicleId }).populate('vehicleId customerId');
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch vehicle schedule', error: err.message });
  }
};
