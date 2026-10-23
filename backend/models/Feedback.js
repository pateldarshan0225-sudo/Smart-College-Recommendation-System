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
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'feedbacks',
  versionKey: false,
  autoCreate: false
});
export default mongoose.model('Feedback', schema);
