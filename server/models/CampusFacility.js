import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, unique: true },
  hostel: { type: Boolean, default: false },
  library: { type: Boolean, default: false },
  computerLab: { type: Boolean, default: false },
  wifi: { type: Boolean, default: false },
  sports: { type: Boolean, default: false },
  gym: { type: Boolean, default: false },
  cafeteria: { type: Boolean, default: false },
  transport: { type: Boolean, default: false },
  medicalFacility: { type: Boolean, default: false },
  auditorium: { type: Boolean, default: false },
  placementCell: { type: Boolean, default: false },
  campusSecurity: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('CampusFacility', schema);
