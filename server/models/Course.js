import mongoose from 'mongoose';
const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true, trim: true },
  courseCode: String,
  level: { type: String, enum: ['UG', 'PG'], default: 'UG' },
  duration: String,
  description: String,
  careerOptions: [String],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });
export default mongoose.model('Course', courseSchema);
