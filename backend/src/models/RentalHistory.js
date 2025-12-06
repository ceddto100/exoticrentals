import mongoose from 'mongoose';

const RentalHistorySchema = new mongoose.Schema(
  {
    rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('RentalHistory', RentalHistorySchema);
