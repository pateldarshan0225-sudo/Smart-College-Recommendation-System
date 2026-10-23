import test from 'node:test';
import assert from 'node:assert/strict';
import matchScore, { isEligible } from '../utils/matchScore.js';
import { text, number, id, email, password, url } from '../utils/validation.js';
import { pagination } from '../utils/pagination.js';
import originMiddleware from '../middleware/originMiddleware.js';
import { isUser, isAdmin } from '../middleware/authMiddleware.js';
import StudentProfile from '../models/StudentProfile.js';
import Shortlist from '../models/Shortlist.js';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Stream from '../models/Stream.js';
import Course from '../models/Course.js';
import EntranceExam from '../models/EntranceExam.js';
import College from '../models/College.js';
import CollegeCourse from '../models/CollegeCourse.js';
import Recommendation from '../models/Recommendation.js';
import Feedback from '../models/Feedback.js';
const offering = {
  minPercentage: 50,
  fees: 0,
  collegeId: {
    rating: 5,
    state: 'Gujarat'
  },
  courseId: {
    _id: 'course1'
  }
};
const profile = {
  percentage: 80,
  budget: 100000,
  preferredState: '',
  preferredCourse: null
};
test('maximum score reaches 100', () => assert.equal(matchScore(profile, offering), 100));
test('marks margin is capped at 30', () => assert.equal(matchScore({
  ...profile,
  percentage: 100
}, offering), 100));
test('budget and exact marks boundary score is transparent', () => assert.equal(matchScore({
  ...profile,
  percentage: 50
}, {
  ...offering,
  fees: 100000
}), 45));
test('zero-budget free programme avoids division by zero', () => assert.equal(matchScore({
  ...profile,
  budget: 0
}, offering), 100));
test('rating contributes twenty points', () => assert.equal(matchScore(profile, {
  ...offering,
  collegeId: {
    rating: 0,
    state: 'Gujarat'
  }
}), 80));
test('state comparison ignores case and matching course earns points', () => assert.equal(matchScore({
  ...profile,
  preferredState: 'gujarat',
  preferredCourse: 'course1'
}, offering), 100));
test('mismatched preferences lose their weighted points', () => assert.equal(matchScore({
  ...profile,
  preferredState: 'Delhi',
  preferredCourse: 'other'
}, offering), 75));
test('email is normalized and rejects malformed values', () => {
  assert.equal(email(' STUDENT@EXAMPLE.COM '), 'student@example.com');
  assert.throws(() => email('bad'));
  assert.throws(() => email({
    $ne: null
  }));
});
test('numbers reject objects, blanks, infinity and out-of-range values', () => {
  for (const value of ['', null, undefined, Infinity, {}, 101, -1]) assert.throws(() => number(value, 'Percentage', 0, 100));
  assert.equal(number('72.5', 'Percentage', 0, 100), 72.5);
});
test('required text and optional text are handled explicitly', () => {
  assert.throws(() => text(' ', 'Name'));
  assert.equal(text(undefined, 'Website', {
    required: false
  }), '');
});
test('passwords enforce bcrypt byte boundary', () => {
  assert.throws(() => password('short'));
  assert.throws(() => password('\u00e9'.repeat(37)));
  assert.equal(password('eight123'), 'eight123');
});
test('IDs reject operator objects and allow optional null', () => {
  assert.throws(() => id({
    $ne: null
  }, 'ID'));
  assert.throws(() => id('bad', 'ID'));
  assert.equal(id('', 'ID', true), null);
  assert.equal(id('507f1f77bcf86cd799439011', 'ID'), '507f1f77bcf86cd799439011');
});
test('URLs allow http/https and reject scripts and embedded credentials', () => {
  assert.equal(url('https://example.com', 'Website'), 'https://example.com');
  for (const value of ['javascript:alert(1)', 'https://', 'https://user:secret@example.com']) assert.throws(() => url(value, 'Website'));
});
test('pagination defaults and caps are enforced', () => {
  assert.deepEqual(pagination({}), {
    page: 1,
    limit: 12,
    skip: 0
  });
  assert.deepEqual(pagination({
    page: '3',
    limit: '10'
  }), {
    page: 3,
    limit: 10,
    skip: 20
  });
  for (const query of [{
    page: 0
  }, {
    limit: 101
  }, {
    page: 1.2
  }, {
    limit: 'abc'
  }]) assert.throws(() => pagination(query));
});
function response() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    }
  };
}
test('origin middleware rejects foreign and absent origins on writes', () => {
  process.env.CLIENT_URL = 'http://localhost:5173';
  for (const origin of ['https://evil.example', undefined]) {
    const res = response();
    let next = false;
    originMiddleware({
      method: 'POST',
      get: () => origin
    }, res, () => {
      next = true;
    });
    assert.equal(res.statusCode, 403);
    assert.equal(next, false);
  }
});
test('origin middleware allows configured origin and safe reads', () => {
  for (const req of [{
    method: 'POST',
    get: () => 'http://localhost:5173'
  }, {
    method: 'GET',
    get: () => undefined
  }]) {
    let called = false;
    originMiddleware(req, response(), () => {
      called = true;
    });
    assert.equal(called, true);
  }
});
test('role middleware returns 401 for anonymous and 403 for wrong roles', async () => {
  for (const middleware of [isUser, isAdmin]) {
    const res = response();
    await middleware({
      session: {}
    }, res, () => assert.fail());
    assert.equal(res.statusCode, 401);
  }
  for (const [middleware, role] of [[isUser, 'admin'], [isAdmin, 'user']]) {
    const res = response();
    await middleware({
      session: {
        identity: {
          role
        }
      }
    }, res, () => assert.fail());
    assert.equal(res.statusCode, 403);
  }
});
test('exactly eleven explicit application collection names', () => {
  assert.deepEqual([Admin, User, StudentProfile, Stream, Course, EntranceExam, College, CollegeCourse, Recommendation, Shortlist, Feedback].map(m => m.collection.collectionName), ['admins', 'users', 'studentProfiles', 'streams', 'courses', 'entranceExams', 'colleges', 'collegeCourses', 'recommendations', 'shortlists', 'feedbacks']);
});
test('passwords are excluded by default and profile user is unique', () => {
  assert.equal(User.schema.path('password').options.select, false);
  assert.equal(Admin.schema.path('password').options.select, false);
  assert.equal(StudentProfile.schema.path('userId').options.unique, true);
});
test('shortlist index prevents duplicate user-college pairs', () => {
  assert.ok(Shortlist.schema.indexes().some(([fields, options]) => fields.userId === 1 && fields.collegeId === 1 && options.unique));
});
test('eligibility includes exact marks and budget boundaries', () => assert.equal(isEligible({
  ...profile,
  percentage: 50,
  budget: 100000
}, {
  ...offering,
  fees: 100000
}), true));
test('eligibility excludes insufficient marks and unaffordable programmes', () => {
  assert.equal(isEligible({
    ...profile,
    percentage: 49
  }, offering), false);
  assert.equal(isEligible({
    ...profile,
    budget: 100
  }, {
    ...offering,
    fees: 101
  }), false);
});
test('selected state and course are strict eligibility filters', () => {
  assert.equal(isEligible({
    ...profile,
    preferredState: 'Delhi'
  }, offering), false);
  assert.equal(isEligible({
    ...profile,
    preferredCourse: 'different'
  }, offering), false);
  assert.equal(isEligible({
    ...profile,
    preferredState: 'GUJARAT',
    preferredCourse: 'course1'
  }, offering), true);
});
test('required exam must match and meet its cutoff', () => {
  const examOffering = {
    ...offering,
    entranceExamId: 'exam1',
    cutoffScore: 120
  };
  assert.equal(isEligible(profile, examOffering), false);
  assert.equal(isEligible({
    ...profile,
    entranceExam: 'exam2',
    entranceScore: 200
  }, examOffering), false);
  assert.equal(isEligible({
    ...profile,
    entranceExam: 'exam1',
    entranceScore: 119
  }, examOffering), false);
  assert.equal(isEligible({
    ...profile,
    entranceExam: 'exam1',
    entranceScore: 120
  }, examOffering), true);
});
test('offerings without exams require no exam and broken references are excluded', () => {
  assert.equal(isEligible(profile, offering), true);
  assert.equal(isEligible(profile, {
    ...offering,
    collegeId: null
  }), false);
  assert.equal(isEligible(profile, {
    ...offering,
    courseId: null
  }), false);
});

// Verify dependency cleanup without deleting real database records.
import { masterController, deleteMasterDependencies } from '../controllers/streamController.js';
test('college deletion removes offerings, recommendations and shortlists before the college', async t => {
  const calls = [];
  t.mock.method(College, 'findById', async () => ({ _id: 'college', deleteOne: async () => calls.push('college') }));
  t.mock.method(CollegeCourse, 'distinct', async (field, filter) => {
    assert.equal(field, '_id');
    assert.deepEqual(filter, { collegeId: 'college' });
    return ['offering'];
  });
  t.mock.method(Recommendation, 'deleteMany', async filter => {
    assert.deepEqual(filter, { collegeCourseId: { $in: ['offering'] } });
    calls.push('recommendations');
  });
  t.mock.method(CollegeCourse, 'deleteMany', async filter => {
    assert.deepEqual(filter, { collegeId: 'college' });
    calls.push('offerings');
  });
  t.mock.method(Shortlist, 'deleteMany', async filter => {
    assert.deepEqual(filter, { collegeId: 'college' });
    calls.push('shortlists');
  });
  t.mock.method(Course, 'deleteMany', () => assert.fail('Shared courses must remain'));
  const res = response();
  await masterController('colleges').remove({ params: { id: 'college' } }, res);
  assert.deepEqual(calls, ['recommendations', 'offerings', 'shortlists', 'college']);
  assert.equal(res.payload.success, true);
});
test('offering deletion removes recommendations without deleting its college or course', async t => {
  t.mock.method(Recommendation, 'deleteMany', async filter => assert.deepEqual(filter, { collegeCourseId: 'offering' }));
  t.mock.method(College, 'deleteMany', () => assert.fail('College must remain'));
  t.mock.method(Course, 'deleteMany', () => assert.fail('Course must remain'));
  await deleteMasterDependencies('college-courses', { _id: 'offering' });
});
test('cleanup failure prevents parent deletion', async t => {
  t.mock.method(College, 'findById', async () => ({ _id: 'college', deleteOne: async () => assert.fail('Parent must remain') }));
  t.mock.method(CollegeCourse, 'distinct', async () => { throw new Error('Database unavailable'); });
  await assert.rejects(masterController('colleges').remove({ params: { id: 'college' } }, response()), /Database unavailable/);
});

import { readFile } from 'node:fs/promises';
import { validateMaster } from '../controllers/streamController.js';
test('real institution catalogue has distinct local JPEGs and source/license credits', async () => {
  const records = JSON.parse(await readFile(new URL('../data/real-colleges.json', import.meta.url), 'utf8'));
  assert.equal(records.length, 13);
  assert.equal(new Set(records.map(r => r.name)).size, 13);
  assert.equal(new Set(records.map(r => r.image)).size, 13);
  for (const record of records) {
    assert.match(record.imageSource, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    assert.ok(record.imageCredit && record.imageLicense);
    assert.equal(record.isDemoData, true);
    const image = await readFile(new URL('../../frontend/public' + record.image, import.meta.url));
    assert.equal(image[0], 0xff);
    assert.equal(image[1], 0xd8);
    const validated = await validateMaster('colleges', { ...record, rating: 4.2 });
    assert.equal(validated.image, record.image);
  }
});
test('college image validation rejects unsafe paths and script URLs', async () => {
  const record = { name: 'Test', city: 'City', state: 'State', type: 'Government', affiliation: 'Test', rating: 4.2 };
  for (const image of ['/images/../private.jpg', 'javascript:alert(1)', '//untrusted.test/image.jpg']) {
    await assert.rejects(validateMaster('colleges', { ...record, image }));
  }
});

import { loadCollegeCatalogue, demoCourseDefinitions } from '../utils/collegeCatalogue.js';
const indianStates = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
test('state catalogue covers every Indian state with two distinct sourced institutions', async () => {
  const records = JSON.parse(await readFile(new URL('../data/state-colleges.json', import.meta.url), 'utf8'));
  assert.equal(records.length, 56);
  assert.equal(new Set(records.map(record => record.name)).size, 56);
  assert.deepEqual([...new Set(records.map(record => record.state))].sort(), [...indianStates].sort());
  const courses = new Set(demoCourseDefinitions.map(([name]) => name));
  for (const state of indianStates) assert.equal(records.filter(record => record.state === state).length, 2);
  for (const record of records) {
    assert.ok(record.selectionBasis);
    assert.match(record.selectionSource, /^https:\/\//);
    assert.match(record.website, /^https:\/\//);
    assert.equal(record.isDemoData, true);
    assert.ok(record.demoCourseNames.length);
    for (const course of record.demoCourseNames) assert.ok(courses.has(course));
    if (record.image) {
      const bytes = await readFile(new URL('../../frontend/public' + record.image, import.meta.url));
      assert.ok(bytes.subarray(0, 2).equals(Buffer.from([0xff, 0xd8])) || bytes.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])));
      assert.ok(record.imageCredit && record.imageSource && record.imageLicense);
    } else {
      assert.equal(record.imageSource, '', 'Do not credit an unverified replacement photo');
    }
    assert.equal((await validateMaster('colleges', { ...record, rating: 4 })).image, record.image);
  }
});
test('merged seed catalogue preserves original photo identities without duplicate colleges', async () => {
  const records = await loadCollegeCatalogue();
  assert.equal(records.length, new Set(records.map(record => record.name)).size);
  const iitBombay = records.find(record => record.name === 'Indian Institute of Technology Bombay');
  assert.equal(iitBombay.legacyName, 'Deccan College of Science');
  assert.equal(iitBombay.image, '/images/colleges/iit-bombay.jpg');
  assert.match(iitBombay.selectionBasis, /NIRF 2025/);
  assert.ok(records.some(record => record.state === 'Delhi'));
});

import { publicStates, publicList } from '../controllers/collegeController.js';
test('public state dropdown returns only real sorted state values without login', async t => {
  t.mock.method(College, 'distinct', async field => {
    assert.equal(field, 'state');
    return ['Tamil Nadu', '', 'Assam', 'Goa'];
  });
  const res = response();
  await publicStates({}, res);
  assert.deepEqual(res.payload.data, ['Assam', 'Goa', 'Tamil Nadu']);
});
test('public state, course and fee filters match the same offering', async t => {
  const course = '507f1f77bcf86cd799439011';
  t.mock.method(Stream, 'distinct', async () => ['stream']);
  t.mock.method(Course, 'distinct', async () => [course]);
  t.mock.method(College, 'distinct', async () => ['matched-college']);
  t.mock.method(EntranceExam, 'distinct', async () => ['exam']);
  t.mock.method(CollegeCourse, 'distinct', async (field, filter) => {
    assert.equal(field, 'collegeId');
    const [availability, criteria] = filter.$and;
    assert.deepEqual(criteria, { courseId: course, fees: { $lte: 200000 } });
    assert.deepEqual(availability.isActive, { $ne: false });
    assert.deepEqual(availability.courseId, { $in: [course] });
    assert.deepEqual(availability.collegeId, { $in: ['matched-college'] });
    assert.deepEqual(availability.$or, [{ entranceExamId: null }, { entranceExamId: { $in: ['exam'] } }]);
    return ['matched-college'];
  });
  t.mock.method(College, 'find', filter => {
    assert.deepEqual(filter, { isActive: { $ne: false }, state: 'Assam', _id: { $in: ['matched-college'] } });
    const query = { sort: () => query, skip: () => query, limit: () => query, populate: async () => [{ name: 'Matched institution' }] };
    return query;
  });
  t.mock.method(College, 'countDocuments', async () => 1);
  const res = response();
  await publicList({ query: { state: 'Assam', course, maxFees: '200000' } }, res);
  assert.equal(res.payload.data.total, 1);
  assert.equal(res.payload.data.items.length, 1);
});

test('all new stream choices pass controller and database schema validation', async () => {
  const names = ['Engineering', 'Management', 'Hospitality', 'Education', 'Law', 'Design', 'Architecture', 'Computer Applications', 'Medical'];
  for (const name of [...names, 'Science', 'Commerce', 'Arts']) {
    assert.deepEqual(await validateMaster('streams', { name }), { name });
    assert.equal(new Stream({ name }).validateSync(), undefined);
  }
  assert.deepEqual(await validateMaster('streams', { name: '  Data   Science  ' }), { name: 'Data Science' });
  assert.equal(new Stream({ name: '  Data   Science  ' }).name, 'Data Science');
  for (const name of ['', ' ', 'A', '12345', '!!!', '<script>', 'X'.repeat(101)]) {
    await assert.rejects(validateMaster('streams', { name }));
    assert.ok(new Stream({ name }).validateSync());
  }
});


test('stream create rejects a duplicate before writing and escapes punctuation in the name', async t => {
  t.mock.method(Stream, 'exists', async filter => {
    const expression = new RegExp(filter.name.$regex, filter.name.$options);
    assert.equal(expression.test('ART (DESIGN)'), true);
    assert.equal(expression.test('Art Design'), false);
    return { _id: 'existing' };
  });
  t.mock.method(Stream, 'create', () => assert.fail('Duplicate must not be created'));
  await assert.rejects(masterController('streams').create({ body: { name: ' Art (Design) ' } }, response()), error => {
    assert.equal(error.status, 409);
    assert.match(error.message, /already exists/);
    return true;
  });
});
test('stream edit excludes itself from duplicate lookup and permits its existing name', async t => {
  const record = { _id: 'stream-id', name: 'Data Science', save: async () => {} };
  t.mock.method(Stream, 'findById', async () => record);
  t.mock.method(Stream, 'exists', async filter => {
    assert.deepEqual(filter._id, { $ne: 'stream-id' });
    return null;
  });
  const res = response();
  await masterController('streams').update({ params: { id: 'stream-id' }, body: { name: 'Data Science' } }, res);
  assert.equal(res.payload.message, 'Updated');
});

import { ACTIVE, catalogueFilter, statusController } from '../utils/activeRecords.js';
import { me } from '../controllers/authController.js';

test('all six managed resources default to active, including legacy documents without a flag', () => {
  for (const Model of [Stream, Course, EntranceExam, College, CollegeCourse, User]) {
    assert.equal(new Model({}).isActive, true);
    assert.equal(Model.hydrate({ _id: '507f1f77bcf86cd799439011' }).isActive, true);
  }
});
test('status update accepts explicit booleans and never changes other fields', async t => {
  for (const Model of [Stream, Course, EntranceExam, College, CollegeCourse, User]) {
    t.mock.method(Model, 'findByIdAndUpdate', async (id, update, options) => {
      assert.equal(id, 'record');
      assert.equal(typeof update.$set.isActive, 'boolean');
      assert.deepEqual(Object.keys(update.$set), ['isActive']);
      assert.equal(options.runValidators, true);
      return { _id: id, isActive: update.$set.isActive };
    });
    for (const isActive of [false, true]) {
      const res = response();
      await statusController(Model)({ params: { id: 'record' }, body: { isActive } }, res);
      assert.equal(res.payload.data.isActive, isActive);
    }
  }
});
test('status updates reject missing flags and truthy strings before reaching the database', async t => {
  t.mock.method(Stream, 'findByIdAndUpdate', () => assert.fail('Must not write invalid input'));
  for (const isActive of [undefined, null, 'false', 'true', 0, 1, {}]) {
    await assert.rejects(statusController(Stream)({ params: { id: 'record' }, body: { isActive } }, response()), /true or false/);
  }
});
test('unknown record status returns 404', async t => {
  t.mock.method(Stream, 'findByIdAndUpdate', async () => null);
  await assert.rejects(statusController(Stream)({ params: { id: 'record' }, body: { isActive: false } }, response()), error => error.status === 404);
});
test('public offerings require active stream, course, college and optional exam', async t => {
  t.mock.method(Stream, 'distinct', async (field, filter) => {
    assert.deepEqual(filter, ACTIVE);
    return ['active-stream'];
  });
  t.mock.method(Course, 'distinct', async (field, filter) => {
    assert.deepEqual(filter, { ...ACTIVE, streamId: { $in: ['active-stream'] } });
    return ['active-course'];
  });
  t.mock.method(College, 'distinct', async (field, filter) => {
    assert.deepEqual(filter, ACTIVE);
    return ['active-college'];
  });
  t.mock.method(EntranceExam, 'distinct', async (field, filter) => {
    assert.deepEqual(filter, { ...ACTIVE, courseId: { $in: ['active-course'] } });
    return ['active-exam'];
  });
  const filter = await catalogueFilter('college-courses');
  assert.deepEqual(filter, { ...ACTIVE, collegeId: { $in: ['active-college'] }, courseId: { $in: ['active-course'] }, $or: [{ entranceExamId: null }, { entranceExamId: { $in: ['active-exam'] } }] });
});
test('inactive offerings, courses and colleges cannot generate eligible recommendations', () => {
  assert.equal(isEligible(profile, { ...offering, isActive: false }), false);
  assert.equal(isEligible(profile, { ...offering, courseId: { ...offering.courseId, isActive: false } }), false);
  assert.equal(isEligible(profile, { ...offering, collegeId: { ...offering.collegeId, isActive: false } }), false);
  assert.equal(isEligible(profile, offering), true);
});
test('existing inactive user sessions are rejected on protected requests', async t => {
  let destroyed = false;
  t.mock.method(User, 'exists', async filter => {
    assert.deepEqual(filter, { _id: 'user', ...ACTIVE });
    return null;
  });
  const res = response();
  await isUser({ session: { identity: { id: 'user', role: 'user' }, destroy: callback => { destroyed = true; callback(); } } }, res, () => assert.fail('Inactive account must not pass'));
  assert.equal(res.statusCode, 401);
  assert.equal(destroyed, true);
});
test('auth me rejects an inactive account instead of restoring its login', async t => {
  let destroyed = false;
  t.mock.method(User, 'findById', async () => ({ _id: 'user', isActive: false }));
  await assert.rejects(me({ session: { identity: { id: 'user', role: 'user' }, destroy: callback => { destroyed = true; callback(); } } }, response()), error => error.status === 401);
  assert.equal(destroyed, true);
});
