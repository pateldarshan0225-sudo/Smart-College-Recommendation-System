import './config/env.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './config/db.js';
import sessionConfig from './config/session.js';
import originMiddleware from './middleware/originMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
const app = express();
app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(originMiddleware);
app.use(express.json({
  limit: '32kb'
}));
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    if (req.body === undefined) req.body = {};
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({
      success: false,
      message: 'Request body must be a JSON object',
      data: null
    });
  }
  next();
});
try {
  await connectDB();
  app.use(sessionConfig());
  app.use('/api/auth', authRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/user', userRoutes);
  app.use((req, res) => res.status(404).json({
    success: false,
    message: 'API route not found',
    data: null
  }));
  app.use(errorMiddleware);
  app.listen(Number(process.env.PORT || 5000), () => console.log('API listening on configured port'));
} catch (error) {
  console.error('Startup failed:', error.name === 'MongooseServerSelectionError' ? 'MongoDB is not reachable' : error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
}
