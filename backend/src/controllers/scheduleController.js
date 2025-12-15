import Schedule from '../models/Schedule.js';
import Rental from '../models/Rental.js';
import RentalHistory from '../models/RentalHistory.js';

export const createSchedule = async (req, res) => {
  try {
    const { vehicleId, customerId, startDate, endDate, depositAmount, totalPrice, status } = req.body;

    if (!vehicleId || !customerId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a Rental record first to get the ID
    const rental = await Rental.create({
      user: customerId,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalCost: totalPrice,
      depositAmount,
      balanceDue: Math.max((totalPrice || 0) - (depositAmount || 0), 0),
      status: status || "pending",
      paymentStatus: "pending",
    });

    // Create the schedule record with reference to the rental
    const schedule = await Schedule.create({
      vehicleId,
      customerId,
      startDate,
      endDate,
      depositAmount,
      totalPrice,
      status: status || "pending",
      rentalId: rental._id
    });

    // Create rental history entry for audit trail
    await RentalHistory.create({
      rental: rental._id,
      user: customerId,
      action: "created",
      notes: "Booking created via checkout",
    });

    return res.status(201).json({ success: true, schedule, rental });
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

    // Sync changes with the linked Rental record
    if (schedule.rentalId) {
      const rentalUpdate = {};
      if (req.body.status) rentalUpdate.status = req.body.status;
      if (req.body.startDate) rentalUpdate.startDate = req.body.startDate;
      if (req.body.endDate) rentalUpdate.endDate = req.body.endDate;
      if (req.body.totalPrice) rentalUpdate.totalCost = req.body.totalPrice;
      if (req.body.depositAmount !== undefined) rentalUpdate.depositAmount = req.body.depositAmount;

      if (Object.keys(rentalUpdate).length > 0) {
        await Rental.findByIdAndUpdate(schedule.rentalId, rentalUpdate);

        // Log the update in rental history
        await RentalHistory.create({
          rental: schedule.rentalId,
          user: schedule.customerId,
          action: "updated",
          notes: `Booking updated: ${Object.keys(rentalUpdate).join(', ')} changed`,
        });
      }
    }

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

export const cancelSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check if the user owns this schedule
    if (schedule.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    // Only allow canceling pending or active schedules
    if (schedule.status === 'cancelled') {
      return res.status(400).json({ message: 'This reservation is already cancelled' });
    }

    if (schedule.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed reservation' });
    }

    // Update the schedule status to cancelled
    schedule.status = 'cancelled';
    await schedule.save();

    // Sync with the linked Rental record
    if (schedule.rentalId) {
      await Rental.findByIdAndUpdate(schedule.rentalId, { status: 'cancelled' });

      // Log the cancellation in rental history
      await RentalHistory.create({
        rental: schedule.rentalId,
        user: schedule.customerId,
        action: 'cancelled',
        notes: 'Reservation cancelled by customer',
      });
    }

    res.json({ success: true, message: 'Reservation cancelled successfully', schedule });
  } catch (err) {
    res.status(500).json({ message: 'Unable to cancel schedule', error: err.message });
  }
};
