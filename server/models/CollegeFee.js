import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  annualTuitionFee: { type: Number, min: 0, required: true },
  hostelFee: { type: Number, min: 0, default: 0 },
  otherFees: { type: Number, min: 0, default: 0 },
  totalAnnualFee: { type: Number, min: 0, required: true },
  scholarshipAvailable: { type: Boolean, default: false },
  scholarshipDetails: String
}, { timestamps: true });
schema.index({ collegeId: 1, courseId: 1 }, { unique: true });
export default mongoose.model('CollegeFee', schema);
