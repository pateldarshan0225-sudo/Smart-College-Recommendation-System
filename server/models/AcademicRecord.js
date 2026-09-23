import mongoose from 'mongoose';
const academicSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  tenthPercentage: { type: Number, min: 0, max: 100, required: true },
  twelfthPercentage: { type: Number, min: 0, max: 100, required: true },
  ugPercentage: { type: Number, min: 0, max: 100, default: null },
  entranceExam: String,
  entranceScore: { type: Number, min: 0 },
  passingYear: { type: Number, min: 1900, max: 2100 }
}, { timestamps: true });
export default mongoose.model('AcademicRecord', academicSchema);
