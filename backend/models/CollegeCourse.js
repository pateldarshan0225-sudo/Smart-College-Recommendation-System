import mongoose from 'mongoose';
const {
  Schema
} = mongoose;
const schema = new Schema({
  isActive: { type: Boolean, default: true },
  collegeId: {
    type: Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  fees: {
    type: Number,
    min: 0,
    required: true
  },
  seats: {
    type: Number,
    min: 0,
    required: true
  },
  minPercentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  cutoffScore: {
    type: Number,
    min: 0,
    default: 0
  },
  entranceExamId: {
    type: Schema.Types.ObjectId,
    ref: 'EntranceExam',
    default: null
  }
}, {
  collection: 'collegeCourses',
  versionKey: false,
  autoCreate: false
});
schema.index({
  collegeId: 1,
  courseId: 1
}, {
  unique: true
});
export default mongoose.model('CollegeCourse', schema);
