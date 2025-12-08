import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    permissions: [{ type: String }],
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Admin', AdminSchema);
