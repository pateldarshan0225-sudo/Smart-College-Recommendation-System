import mongoose from 'mongoose';
const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  university: String,
  description: String,
  city: String,
  state: String,
  address: String,
  collegeType: { type: String, enum: ['Government', 'Private', 'Autonomous', 'Deemed'], required: true },
  establishedYear: Number,
  website: String,
  email: String,
  phone: String,
  campusSize: String,
  collegeRating: { type: Number, min: 0, max: 5, default: 0 },
  eligibilityPercentage: { type: Number, min: 0, max: 100, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });
export default mongoose.model('College', collegeSchema);
