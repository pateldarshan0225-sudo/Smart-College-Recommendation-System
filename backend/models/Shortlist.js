import mongoose from 'mongoose';
const {
  Schema
} = mongoose;
const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collegeId: {
    type: Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'shortlists',
  versionKey: false,
  autoCreate: false
});
schema.index({
  userId: 1,
  collegeId: 1
}, {
  unique: true
});
export default mongoose.model('Shortlist', schema);
