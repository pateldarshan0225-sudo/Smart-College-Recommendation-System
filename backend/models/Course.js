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
  streamId: {
    type: Schema.Types.ObjectId,
    ref: 'Stream',
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  collection: 'courses',
  versionKey: false,
  autoCreate: false
});
export default mongoose.model('Course', schema);
