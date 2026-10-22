import AcademicRecord from '../models/AcademicRecord.js';

export async function getAcademic(req, res, next) {
  try {
    const data = await AcademicRecord.findOne({ studentId: req.user._id });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function upsertAcademic(req, res, next) {
  try {
    const payload = { ...req.body, studentId: req.user._id };

    // Sanitize optional and required numeric fields so empty strings don't fail Mongoose cast
    ['tenthPercentage', 'twelfthPercentage'].forEach((f) => {
      if (payload[f] !== undefined && payload[f] !== null && payload[f] !== '') {
        payload[f] = Number(payload[f]);
      }
    });

    ['ugPercentage', 'entranceScore', 'passingYear'].forEach((f) => {
      if (payload[f] === '' || payload[f] === undefined || payload[f] === null || isNaN(Number(payload[f]))) {
        payload[f] = null;
      } else {
        payload[f] = Number(payload[f]);
      }
    });

    const data = await AcademicRecord.findOneAndUpdate(
      { studentId: req.user._id },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );
    res.json({ success: true, message: 'Academic record saved', data });
  } catch (e) {
    next(e);
  }
}

