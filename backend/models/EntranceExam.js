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
  description: {
    type: String,
    default: ''
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
}, {
  collection: 'entranceExams',
  versionKey: false,
  autoCreate: false
});
export default mongoose.model('EntranceExam', schema);
