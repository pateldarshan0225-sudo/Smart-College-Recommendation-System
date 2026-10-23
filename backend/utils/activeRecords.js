import Stream from '../models/Stream.js';
import Course from '../models/Course.js';
import EntranceExam from '../models/EntranceExam.js';
import College from '../models/College.js';
import { ok, fail } from './validation.js';

// Missing flags on older records mean active; no data migration is required.
export const ACTIVE = { isActive: { $ne: false } };

export async function catalogueFilter(kind) {
  if (kind === 'streams' || kind === 'colleges') return { ...ACTIVE };
  const streams = await Stream.distinct('_id', ACTIVE);
  const courseFilter = { ...ACTIVE, streamId: { $in: streams } };
  if (kind === 'courses') return courseFilter;
  const courses = await Course.distinct('_id', courseFilter);
  const examFilter = { ...ACTIVE, courseId: { $in: courses } };
  if (kind === 'entrance-exams') return examFilter;
  const [colleges, exams] = await Promise.all([
    College.distinct('_id', ACTIVE), EntranceExam.distinct('_id', examFilter)
  ]);
  return {
    ...ACTIVE, collegeId: { $in: colleges }, courseId: { $in: courses },
    $or: [{ entranceExamId: null }, { entranceExamId: { $in: exams } }]
  };
}

export function statusController(Model) {
  return async (req, res) => {
    if (typeof req.body?.isActive !== 'boolean') fail('Status must be true or false');
    const record = await Model.findByIdAndUpdate(req.params.id, { $set: { isActive: req.body.isActive } }, { new: true, runValidators: true });
    if (!record) fail('Record not found', 404);
    ok(res, { _id: record._id, isActive: record.isActive }, record.isActive ? 'Activated successfully' : 'Deactivated successfully');
  };
}
