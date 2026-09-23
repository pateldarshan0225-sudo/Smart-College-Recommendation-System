import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, unique: true },
  placementRate: { type: Number, min: 0, max: 100, default: 0 },
  averagePackage: { type: Number, min: 0, default: 0 },
  highestPackage: { type: Number, min: 0, default: 0 },
  lowestPackage: { type: Number, min: 0, default: 0 },
  companiesVisited: { type: Number, min: 0, default: 0 },
  placementYear: Number
}, { timestamps: true });
export default mongoose.model('CollegePlacement', schema);
