import College from '../models/College.js';
import CollegeCourse from '../models/CollegeCourse.js';
import { ok, fail, text, id, number } from '../utils/validation.js';
import { paginate } from '../utils/pagination.js';
import { masterController } from './streamController.js';
import { ACTIVE, catalogueFilter } from '../utils/activeRecords.js';
export default masterController('colleges');
export async function publicStates(req, res) {
  ok(res, (await College.distinct('state', ACTIVE)).filter(Boolean).sort());
}
export async function publicList(req, res) {
  const filter = { ...ACTIVE };
  if (req.query.search) filter.name = {
    $regex: text(req.query.search, 'Search', {
      max: 100
    }).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    $options: 'i'
  };
  if (req.query.state) filter.state = text(req.query.state, 'State', {
    max: 100
  });
  const offers = {};
  if (req.query.course) offers.courseId = id(req.query.course, 'Course');
  if (req.query.maxFees !== undefined && req.query.maxFees !== '') offers.fees = {
    $lte: number(req.query.maxFees, 'Maximum fees')
  };
  if (Object.keys(offers).length) filter._id = {
    $in: await CollegeCourse.distinct('collegeId', { $and: [await catalogueFilter('college-courses'), offers] })
  };
  ok(res, await paginate(College, filter, req.query, [], {
    rating: -1,
    _id: 1
  }));
}
export async function publicDetail(req, res) {
  const college = await College.findOne({ _id: req.params.id, ...ACTIVE });
  if (!college) fail('College not found', 404);
  ok(res, {
    college,
    offerings: await paginate(CollegeCourse, {
      ...await catalogueFilter('college-courses'),
      collegeId: college._id
    }, req.query, ['courseId', 'entranceExamId'])
  });
}
