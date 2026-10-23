import mongoose from 'mongoose';
export default async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required. Configure backend/.env using .env.example.');
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    autoCreate: false
  });
  console.log('Application database connected');
}
