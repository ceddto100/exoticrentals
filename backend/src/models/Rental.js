import mongoose from 'mongoose';

const RentalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalCost: Number,
    status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    addOns: [{ type: String }],
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Rental', RentalSchema);
