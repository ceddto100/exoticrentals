import mongoose from 'mongoose';

const DayAvailabilitySchema = new mongoose.Schema({
  day: { type: String },
  slots: [
    {
      start: String,
      end: String,
      isAvailable: { type: Boolean, default: true },
    },
  ],
});

const ScheduleSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    type: { type: String, enum: ['availability', 'reservation'], default: 'availability' },
    weekOf: { type: Date },
    days: [DayAvailabilitySchema],
    startDate: { type: Date },
    endDate: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental' },
    totalCost: { type: Number },
    status: { type: String, enum: ['booked', 'completed', 'cancelled', 'pending'], default: 'booked' },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Schedule', ScheduleSchema);
