import mongoose from 'mongoose';
import StudentProfile from '../models/StudentProfile.js';

export async function getProfile(req, res, next) {
  try {
    const data = await StudentProfile.findOne({ userId: req.user._id }).populate('preferredCourse', 'courseName courseCode');
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function upsertProfile(req, res, next) {
  try {
    const payload = { ...req.body, userId: req.user._id };

    // Clean preferredCourse so empty string doesn't fail Cast to ObjectId
    if (payload.preferredCourse && typeof payload.preferredCourse === 'object' && payload.preferredCourse._id) {
      payload.preferredCourse = payload.preferredCourse._id;
    }
    if (!payload.preferredCourse || !mongoose.Types.ObjectId.isValid(payload.preferredCourse)) {
      payload.preferredCourse = null;
    }

    if (payload.budget !== undefined && payload.budget !== null) {
      const b = Number(payload.budget);
      payload.budget = isNaN(b) ? 0 : Math.max(0, b);
    }

    const data = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    ).populate('preferredCourse', 'courseName courseCode');

    res.json({ success: true, message: 'Profile saved', data });
  } catch (e) {
    next(e);
  }
}

