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
  collegeCourseId: {
    type: Schema.Types.ObjectId,
    ref: 'CollegeCourse',
    required: true
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'recommendations',
  versionKey: false,
  autoCreate: false
});
export default mongoose.model('Recommendation', schema);
