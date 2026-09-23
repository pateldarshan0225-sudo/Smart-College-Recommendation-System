import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  eligibilityPercentage: { type: Number, min: 0, max: 100, required: true },
  availableSeats: { type: Number, min: 0, default: 0 },
  admissionType: { type: String, default: 'Merit' },
  entranceRequired: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });
schema.index({ collegeId: 1, courseId: 1 }, { unique: true });
export default mongoose.model('CollegeCourse', schema);
