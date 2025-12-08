import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema(
  {
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    depositAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    status: { type: String, default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model('Schedule', ScheduleSchema);
