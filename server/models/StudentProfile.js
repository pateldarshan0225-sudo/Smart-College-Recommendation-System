import mongoose from 'mongoose';
const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dateOfBirth: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], default: 'Prefer not to say' },
  city: String,
  state: String,
  preferredLocation: { type: String, default: 'Any Location' },
  careerGoal: String,
  preferredCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  budget: { type: Number, min: 0, default: 0 },
  preferredCollegeType: { type: String, enum: ['Government', 'Private', 'Autonomous', 'Deemed', 'Any'], default: 'Any' },
  preferredFacilities: [{ type: String }]
}, { timestamps: true });
export default mongoose.model('StudentProfile', studentProfileSchema);
