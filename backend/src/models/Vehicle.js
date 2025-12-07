import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    transmission: String,
    fuelType: String,
    seats: Number,
    mpg: String,
    imageUrl: String,
    features: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 5 },
    tripCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Vehicle', VehicleSchema);
