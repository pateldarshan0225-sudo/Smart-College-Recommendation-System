import mongoose from 'mongoose';
const {
  Schema
} = mongoose;
const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  stream: {
    type: String,
    required: true
  },
  board: {
    type: String,
    required: true
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  entranceExam: {
    type: Schema.Types.ObjectId,
    ref: 'EntranceExam',
    default: null
  },
  entranceScore: {
    type: Number,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  preferredState: {
    type: String,
    default: ''
  },
  preferredCourse: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    default: null
  },
  budget: {
    type: Number,
    min: 0,
    required: true
  }
}, {
  collection: 'studentProfiles',
  versionKey: false,
  autoCreate: false
});
export default mongoose.model('StudentProfile', schema);
