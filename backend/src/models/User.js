import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: String,
    avatarUrl: String,
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    lastLogin: Date,
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
