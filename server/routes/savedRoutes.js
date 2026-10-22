import { Router } from 'express';
import mongoose from 'mongoose';
import SavedCollege from '../models/SavedCollege.js';
import College from '../models/College.js';
import { authenticate, authorizeUser } from '../middleware/auth.js';

const r = Router();
r.use(authenticate, authorizeUser);

r.get('/', async (req, res, next) => {
  try {
    const data = await SavedCollege.find({ studentId: req.user._id })
      .populate('collegeId')
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

r.post('/', async (req, res, next) => {
  try {
    let collegeId = req.body.collegeId;
    if (collegeId && typeof collegeId === 'object' && collegeId._id) {
      collegeId = collegeId._id;
    }

    if (!collegeId) {
      return res.status(400).json({ success: false, message: 'collegeId is required' });
    }

    // If non-ObjectId slug or alias provided, resolve to college
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      const found = await College.findOne({
        status: 'active',
        $or: [
          { name: new RegExp(String(collegeId).trim(), 'i') },
          { email: new RegExp(String(collegeId).trim(), 'i') }
        ]
      });
      if (found) {
        collegeId = found._id;
      } else {
        return res.status(400).json({ success: false, message: 'Invalid college ID' });
      }
    }

    // Idempotent upsert so duplicate save never crashes with 409
    const data = await SavedCollege.findOneAndUpdate(
      { studentId: req.user._id, collegeId },
      { studentId: req.user._id, collegeId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('collegeId');

    res.status(201).json({ success: true, message: 'College saved to shortlist', data });
  } catch (e) {
    next(e);
  }
});

r.delete('/:collegeId', async (req, res, next) => {
  try {
    const id = req.params.collegeId;
    if (mongoose.Types.ObjectId.isValid(id)) {
      await SavedCollege.findOneAndDelete({
        studentId: req.user._id,
        $or: [{ collegeId: id }, { _id: id }]
      });
    } else {
      // Find college by name or alias if slug passed
      const found = await College.findOne({ name: new RegExp(String(id).trim(), 'i') });
      if (found) {
        await SavedCollege.findOneAndDelete({ studentId: req.user._id, collegeId: found._id });
      }
    }
    res.json({ success: true, message: 'College removed from saved list' });
  } catch (e) {
    next(e);
  }
});

export default r;

