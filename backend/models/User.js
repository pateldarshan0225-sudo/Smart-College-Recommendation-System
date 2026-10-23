import mongoose from 'mongoose';
const {
  Schema
} = mongoose;
const schema = new Schema({
  isActive: { type: Boolean, default: true },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  phone: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'users',
  versionKey: false,
  autoCreate: false
});
export default mongoose.model('User', schema);
