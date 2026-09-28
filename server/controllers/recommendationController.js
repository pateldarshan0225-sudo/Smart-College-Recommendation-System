import Recommendation from '../models/Recommendation.js';
import CollegePlacement from '../models/CollegePlacement.js';
import CollegeFee from '../models/CollegeFee.js';
import { calculateRecommendations } from '../services/recommendationService.js';

export async function generate(req, res, next) {
  try {
    const results = await calculateRecommendations(req.user._id);
    await Recommendation.deleteMany({ studentId: req.user._id });
    const docs = results.map((r) => ({
      studentId: req.user._id,
      collegeId: r.college._id,
      academicScore: r.academicScore,
      courseMatchScore: r.courseMatch,
      budgetScore: r.budgetScore,
      placementScore: r.placementScore,
      facilityScore: r.facilityScore,
      locationScore: r.locationScore,
      overallScore: r.overallScore,
      recommendationReason: r.recommendationReason
    }));
    if (docs.length) await Recommendation.insertMany(docs);
    res.json({ success: true, message: 'Recommendations generated', data: results });
  } catch (e) {
    next(e);
  }
}

export async function listMine(req, res, next) {
  try {
    let data = await Recommendation.find({ studentId: req.user._id })
      .sort({ overallScore: -1 })
      .populate('collegeId')
      .lean();

    if (data && data.length > 0) {
      const collegeIds = data.map((d) => d.collegeId?._id).filter(Boolean);
      const [placements, fees] = await Promise.all([
        CollegePlacement.find({ collegeId: { $in: collegeIds } }).lean(),
        CollegeFee.find({ collegeId: { $in: collegeIds } }).lean()
      ]);
      const placementMap = new Map(placements.map((p) => [String(p.collegeId), p]));
      const feeMap = new Map(fees.map((f) => [String(f.collegeId), f]));
      data = data.map((d) => ({
        ...d,
        college: d.collegeId,
        placement: d.collegeId ? placementMap.get(String(d.collegeId._id)) : null,
        fee: d.collegeId ? feeMap.get(String(d.collegeId._id)) : null
      }));
    }

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getOne(req, res, next) {
  try {
    const data = await Recommendation.findOne({ _id: req.params.id, studentId: req.user._id }).populate('collegeId');
    if (!data) return res.status(404).json({ success: false, message: 'Recommendation not found' });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

