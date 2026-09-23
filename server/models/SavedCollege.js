import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true }
}, { timestamps: true });
schema.index({ studentId: 1, collegeId: 1 }, { unique: true });
export default mongoose.model('SavedCollege', schema);
