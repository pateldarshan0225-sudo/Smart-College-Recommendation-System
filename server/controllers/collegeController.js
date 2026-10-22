import mongoose from 'mongoose';
import College from '../models/College.js';
import CollegeCourse from '../models/CollegeCourse.js';
import CollegePlacement from '../models/CollegePlacement.js';
import CollegeFee from '../models/CollegeFee.js';
import CampusFacility from '../models/CampusFacility.js';

function escapeRegex(str = '') {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function list(req, res, next) {
  try {
    const filter = { status: 'active' };
    if (req.query.search && String(req.query.search).trim()) {
      const escaped = escapeRegex(String(req.query.search).trim());
      const regex = new RegExp(escaped, 'i');
      filter.$or = [
        { name: regex },
        { city: regex },
        { state: regex },
        { university: regex }
      ];
    }
    const data = await College.find(filter).sort({ name: 1 });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getOne(req, res, next) {
  try {
    const rawId = req.params.id;
    let college = null;

    if (mongoose.Types.ObjectId.isValid(rawId)) {
      college = await College.findById(rawId);
    }

    if (!college) {
      // Handle known shortcuts and slugs
      const aliasMap = {
        da: 'DA-IICT',
        daiict: 'DA-IICT',
        nu: 'Nirma University',
        nirma: 'Nirma University',
        ld: 'L.D. College',
        ldce: 'L.D. College',
        sv: 'SVNIT',
        svnit: 'SVNIT',
        iit: 'IIT Gandhinagar',
        iitgn: 'IIT Gandhinagar',
        adani: 'Adani University'
      };
      const rawLower = String(rawId).toLowerCase().trim();
      const clean = aliasMap[rawLower] || decodeURIComponent(rawId).replace(/col_\d+/i, '').replace(/[-_]/g, ' ').trim();
      if (clean) {
        const escaped = escapeRegex(clean);
        const regex = new RegExp(escaped, 'i');
        college = await College.findOne({
          status: 'active',
          $or: [
            { name: regex },
            { university: regex },
            { email: regex }
          ]
        });
      }
    }

    if (!college) {
      // If id is in format col_N, find by index
      const colMatch = rawId.match(/col_(\d+)/i);
      if (colMatch) {
        const idx = Math.max(0, parseInt(colMatch[1], 10) - 1);
        const list = await College.find({ status: 'active' }).sort({ name: 1 }).skip(idx).limit(1);
        if (list.length > 0) college = list[0];
      }
    }

    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    const [collegeCourses, placement, fees, facilities] = await Promise.all([
      CollegeCourse.find({ collegeId: college._id, status: 'active' }).populate('courseId', 'courseName courseCode duration'),
      CollegePlacement.findOne({ collegeId: college._id }),
      CollegeFee.find({ collegeId: college._id }).populate('courseId', 'courseName'),
      CampusFacility.findOne({ collegeId: college._id })
    ]);

    res.json({
      success: true,
      data: { college, collegeCourses, placement, fees, facilities }
    });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const data = await College.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const data = await College.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'College not found' });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await College.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'College deleted' });
  } catch (e) {
    next(e);
  }
}

