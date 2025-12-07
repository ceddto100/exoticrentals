import mongoose from 'mongoose';

const DayAvailabilitySchema = new mongoose.Schema({
  day: { type: String, required: true },
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
    weekOf: { type: Date, required: true },
    days: [DayAvailabilitySchema],
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Schedule', ScheduleSchema);
