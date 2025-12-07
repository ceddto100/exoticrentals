import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    permissions: [{ type: String }],
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Admin', AdminSchema);
