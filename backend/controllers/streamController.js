import Stream, { STREAM_NAME_PATTERN } from '../models/Stream.js';
import Course from '../models/Course.js';
import EntranceExam from '../models/EntranceExam.js';
import College from '../models/College.js';
import CollegeCourse from '../models/CollegeCourse.js';
import StudentProfile from '../models/StudentProfile.js';
import Recommendation from '../models/Recommendation.js';
import Shortlist from '../models/Shortlist.js';
import { ok, fail, text, number, id, url, reference } from '../utils/validation.js';
import { paginate } from '../utils/pagination.js';
import { catalogueFilter, statusController } from '../utils/activeRecords.js';
const models = {
  streams: Stream,
  courses: Course,
  'entrance-exams': EntranceExam,
  colleges: College,
  'college-courses': CollegeCourse
};
const populations = {
  courses: ['streamId'],
  'entrance-exams': ['courseId'],
  'college-courses': ['collegeId', 'courseId', 'entranceExamId']
};
export async function validateMaster(kind, b) {
  if (kind === 'streams') {
    const name = text(b.name, 'Stream name', { max: 100 }).replace(/\s+/g, ' ');
    if (name.length < 2) fail('Stream name must be at least 2 characters');
    if (!STREAM_NAME_PATTERN.test(name)) fail('Enter a valid stream name using letters, numbers, spaces or . & ( ) / apostrophe and hyphen');
    return {
      name
    };
  }
  if (kind === 'courses') {
    const streamId = id(b.streamId, 'Stream');
    await reference(Stream, streamId, 'Stream');
    return {
      name: text(b.name, 'Name', {
        max: 150
      }),
      streamId,
      duration: text(b.duration, 'Duration', {
        max: 60
      }),
      description: text(b.description, 'Description', {
        required: false
      })
    };
  }
  if (kind === 'entrance-exams') {
    const courseId = id(b.courseId, 'Course');
    await reference(Course, courseId, 'Course');
    return {
      name: text(b.name, 'Name', {
        max: 150
      }),
      courseId,
      description: text(b.description, 'Description', {
        required: false
      })
    };
  }
  if (kind === 'colleges') {
    const type = text(b.type, 'Type');
    if (!['Government', 'Private', 'Aided'].includes(type)) fail('Invalid college type');
    return {
      name: text(b.name, 'Name', {
        max: 200
      }),
      city: text(b.city, 'City', {
        max: 100
      }),
      state: text(b.state, 'State', {
        max: 100
      }),
      type,
      affiliation: text(b.affiliation, 'Affiliation', {
        max: 200
      }),
      website: url(b.website, 'Website'),
      image: typeof b.image === 'string' && /^\/images\/[a-zA-Z0-9/_-]+\.(jpg|jpeg|png|webp|svg)$/.test(b.image) ? b.image : url(b.image, 'Image'),
      description: text(b.description, 'Description', {
        required: false
      }),
      rating: number(b.rating, 'Rating', 0, 5)
    };
  }
  const collegeId = id(b.collegeId, 'College'),
    courseId = id(b.courseId, 'Course'),
    entranceExamId = id(b.entranceExamId, 'Entrance exam', true);
  await Promise.all([reference(College, collegeId, 'College'), reference(Course, courseId, 'Course'), reference(EntranceExam, entranceExamId, 'Entrance exam')]);
  const seats = number(b.seats, 'Seats');
  if (!Number.isInteger(seats)) fail('Seats must be a whole number');
  return {
    collegeId,
    courseId,
    entranceExamId,
    fees: number(b.fees, 'Fees'),
    seats,
    minPercentage: number(b.minPercentage, 'Minimum percentage', 0, 100),
    cutoffScore: number(b.cutoffScore ?? 0, 'Cutoff score')
  };
}
async function deleteOfferings(filter) {
  const ids = await CollegeCourse.distinct('_id', filter);
  await Recommendation.deleteMany({ collegeCourseId: { $in: ids } });
  await CollegeCourse.deleteMany(filter);
}
async function clearProfileReferences(filter, changes) {
  const users = await StudentProfile.distinct('userId', filter);
  await Recommendation.deleteMany({ userId: { $in: users } });
  await StudentProfile.updateMany(filter, { $set: changes });
}
export async function deleteMasterDependencies(kind, record) {
  const key = record._id;
  if (kind === 'colleges') {
    await deleteOfferings({ collegeId: key });
    await Shortlist.deleteMany({ collegeId: key });
  }
  if (kind === 'college-courses') {
    await Recommendation.deleteMany({ collegeCourseId: key });
  }
  if (kind === 'entrance-exams') {
    // An exam is optional: keep programmes and clear the deleted requirement.
    const offerings = await CollegeCourse.distinct('_id', { entranceExamId: key });
    await Recommendation.deleteMany({ collegeCourseId: { $in: offerings } });
    await CollegeCourse.updateMany({ entranceExamId: key }, { $set: { entranceExamId: null, cutoffScore: 0 } });
    await clearProfileReferences({ entranceExam: key }, { entranceExam: null, entranceScore: 0 });
  }
  if (kind === 'courses' || kind === 'streams') {
    const courses = kind === 'courses' ? [key] : await Course.distinct('_id', { streamId: key });
    const exams = await EntranceExam.distinct('_id', { courseId: { $in: courses } });
    // Also clear exam references on offerings belonging to another course.
    for (const exam of exams) await deleteMasterDependencies('entrance-exams', { _id: exam });
    await deleteOfferings({ courseId: { $in: courses } });
    await clearProfileReferences({ preferredCourse: { $in: courses } }, { preferredCourse: null });
    await EntranceExam.deleteMany({ courseId: { $in: courses } });
    if (kind === 'streams') {
      const users = await StudentProfile.distinct('userId', { stream: record.name });
      await Recommendation.deleteMany({ userId: { $in: users } });
      await StudentProfile.deleteMany({ stream: record.name });
      await Course.deleteMany({ streamId: key });
    }
  }
}
// Shared CRUD keeps the five master resources consistent and easy to maintain.
async function checkStreamName(kind, data, excludeId) {
  if (kind !== 'streams') return;
  const filter = { name: { $regex: `^${data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } };
  if (excludeId) filter._id = { $ne: excludeId };
  if (await Stream.exists(filter)) fail('A stream with this name already exists', 409);
}
export function masterController(kind) {
  const Model = models[kind];
  return {
    setStatus: statusController(Model),
    listPublic: async (req, res) => ok(res, await paginate(Model, await catalogueFilter(kind), req.query, populations[kind] || [])),
    list: async (req, res) => ok(res, await paginate(Model, {}, req.query, populations[kind] || [])),
    get: async (req, res) => {
      const record = await Model.findById(req.params.id).populate(populations[kind] || []);
      if (!record) fail('Record not found', 404);
      ok(res, record);
    },
    create: async (req, res) => {
      const data = await validateMaster(kind, req.body);
      await checkStreamName(kind, data);
      ok(res, await Model.create(data), 'Created', 201);
    },
    update: async (req, res) => {
      const record = await Model.findById(req.params.id);
      if (!record) fail('Record not found', 404);
      const data = await validateMaster(kind, req.body);
      await checkStreamName(kind, data, record._id);
      if (kind === 'streams' && data.name !== record.name && (await StudentProfile.exists({
        stream: record.name
      }))) fail('This stream is used by student profiles', 409);
      if (kind === 'colleges' && data.image !== record.image) {
        record.imageCredit = '';
        record.imageSource = '';
        record.imageLicense = '';
        record.imageLicenseUrl = '';
      }
      Object.assign(record, data);
      await record.save();
      ok(res, record, 'Updated');
    },
    remove: async (req, res) => {
      const record = await Model.findById(req.params.id);
      if (!record) fail('Record not found', 404);
      await deleteMasterDependencies(kind, record);
      await record.deleteOne();
      ok(res, null, 'Deleted');
    }
  };
}
export default masterController('streams');
