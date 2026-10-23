import mongoose from 'mongoose';
export const STREAM_NAME_PATTERN = /^(?=.*\p{L})[\p{L}\p{M}\p{N} .&()/'-]+$/u;
const {
  Schema
} = mongoose;
const schema = new Schema({
  isActive: { type: Boolean, default: true },
  name: {
    type: String,
    required: true,
    unique: true,
    set: value => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
    minlength: [2, 'Stream name must be at least 2 characters'],
    maxlength: [100, 'Stream name must be at most 100 characters'],
    match: [STREAM_NAME_PATTERN, 'Enter a valid stream name']
  }
}, {
  collection: 'streams',
  versionKey: false,
  autoCreate: false
});
export default mongoose.model('Stream', schema);
