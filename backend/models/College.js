import mongoose from 'mongoose';
const {
  Schema
} = mongoose;
const schema = new Schema({
  isActive: { type: Boolean, default: true },
  name: {
    type: String,
    required: true,
    unique: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Government', 'Private', 'Aided'],
    required: true
  },
  affiliation: {
    type: String,
    required: true
  },
  website: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  imageCredit: { type: String, default: '' },
  imageSource: { type: String, default: '' },
  imageLicense: { type: String, default: '' },
  imageLicenseUrl: { type: String, default: '' },
  isDemoData: { type: Boolean, default: false },
  selectionBasis: { type: String, default: '' },
  selectionSource: { type: String, default: '' },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  }
}, {
  collection: 'colleges',
  versionKey: false,
  autoCreate: false
});
export default mongoose.model('College', schema);
