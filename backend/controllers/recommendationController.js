import StudentProfile from '../models/StudentProfile.js';
import CollegeCourse from '../models/CollegeCourse.js';
import Recommendation from '../models/Recommendation.js';
import matchScore, { isEligible } from '../utils/matchScore.js';
import { ok, fail } from '../utils/validation.js';
import { paginate } from '../utils/pagination.js';
import { catalogueFilter } from '../utils/activeRecords.js';
const generating = new Set();
export async function generate(req, res) {
  const userId = req.session.identity.id;
  if (generating.has(userId)) fail('Recommendations are already being generated', 409);
  generating.add(userId);
  try {
    const p = await StudentProfile.findOne({
      userId
    });
    if (!p) fail('Create your student profile first', 400);
    const offerings = await CollegeCourse.find({
      ...await catalogueFilter('college-courses'),
      minPercentage: {
        $lte: p.percentage
      },
      fees: {
        $lte: p.budget
      }
    }).populate(['collegeId', 'courseId']);
    const results = offerings.filter(o => isEligible(p, o)).map(o => ({
      userId,
      collegeCourseId: o._id,
      matchScore: matchScore(p, o)
    })).sort((a, b) => b.matchScore - a.matchScore);
    await Recommendation.deleteMany({
      userId
    });
    if (results.length) await Recommendation.insertMany(results);
    ok(res, {
      count: results.length
    }, 'Recommendations generated');
  } finally {
    generating.delete(userId);
  }
}
export async function listRecommendations(req, res) {
  const available = await CollegeCourse.distinct('_id', await catalogueFilter('college-courses'));
  ok(res, await paginate(Recommendation, {
    collegeCourseId: { $in: available },
    userId: req.session.identity.id
  }, req.query, [{
    path: 'collegeCourseId',
    populate: ['collegeId', 'courseId', 'entranceExamId']
  }], {
    matchScore: -1,
    _id: 1
  }));
}
