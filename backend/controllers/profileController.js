import StudentProfile from '../models/StudentProfile.js';
import Stream from '../models/Stream.js';
import Course from '../models/Course.js';
import EntranceExam from '../models/EntranceExam.js';
import Recommendation from '../models/Recommendation.js';
import { ok, fail, text, number, id, reference } from '../utils/validation.js';
import { ACTIVE, catalogueFilter } from '../utils/activeRecords.js';
export async function getProfile(req, res) {
  ok(res, await StudentProfile.findOne({
    userId: req.session.identity.id
  }));
}
export async function saveProfile(req, res) {
  const b = req.body;
  const stream = text(b.stream, 'Stream');
  if (!(await Stream.exists({
    ...ACTIVE,
    name: stream
  }))) fail('Choose a valid stream');
  const category = text(b.category, 'Category');
  if (!['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'].includes(category)) fail('Choose a valid category');
  const entranceExam = id(b.entranceExam, 'Entrance exam', true),
    preferredCourse = id(b.preferredCourse, 'Preferred course', true);
  await Promise.all([
    entranceExam ? reference(EntranceExam, entranceExam, 'Active entrance exam', await catalogueFilter('entrance-exams')) : null,
    preferredCourse ? reference(Course, preferredCourse, 'Active preferred course', await catalogueFilter('courses')) : null
  ]);
  const data = {
    stream,
    board: text(b.board, 'Board', {
      max: 100
    }),
    percentage: number(b.percentage, 'Percentage', 0, 100),
    entranceExam,
    entranceScore: number(b.entranceScore ?? 0, 'Entrance score'),
    category,
    preferredState: text(b.preferredState, 'Preferred state', {
      required: false,
      max: 100
    }),
    preferredCourse,
    budget: number(b.budget, 'Budget')
  };
  const existing = await StudentProfile.findOne({
    userId: req.session.identity.id
  });
  if (req.method === 'POST' && existing) fail('A profile already exists. Use edit profile.', 409);
  if (req.method === 'PUT' && !existing) fail('Create your profile first', 404);
  const profile = existing ? Object.assign(existing, data) : new StudentProfile({
    ...data,
    userId: req.session.identity.id
  });
  await profile.save();
  await Recommendation.deleteMany({
    userId: req.session.identity.id
  });
  ok(res, profile, 'Profile saved');
}
export async function deleteProfile(req, res) {
  const removed = await StudentProfile.findOneAndDelete({
    userId: req.session.identity.id
  });
  if (!removed) fail('Profile not found', 404);
  await Recommendation.deleteMany({
    userId: req.session.identity.id
  });
  ok(res, null, 'Profile deleted');
}
