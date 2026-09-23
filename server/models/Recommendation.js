import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  academicScore: Number,
  courseMatchScore: Number,
  budgetScore: Number,
  placementScore: Number,
  facilityScore: Number,
  locationScore: Number,
  overallScore: Number,
  recommendationReason: [String]
}, { timestamps: true });
export default mongoose.model('Recommendation', schema);
