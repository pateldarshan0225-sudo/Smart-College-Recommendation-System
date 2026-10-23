import '../config/env.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Stream from '../models/Stream.js';
import Course from '../models/Course.js';
import EntranceExam from '../models/EntranceExam.js';
import College from '../models/College.js';
import CollegeCourse from '../models/CollegeCourse.js';
import User from '../models/User.js';
import Recommendation from '../models/Recommendation.js';
import { statusController } from '../utils/activeRecords.js';
import { publicList, publicDetail } from '../controllers/collegeController.js';
import { masterController } from '../controllers/streamController.js';
import { listRecommendations } from '../controllers/recommendationController.js';
import { login, me } from '../controllers/authController.js';

function response() {
  return { status() { return this; }, json(payload) { this.payload = payload; return this; } };
}

test('status persistence, parent availability and user login in an isolated database', { skip: !process.env.MONGODB_URI }, async () => {
  const database = `smart_college_status_verify_${Date.now()}_${process.pid}`;
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: database, serverSelectionTimeoutMS: 5000 });
    const stream = await Stream.create({ name: 'Engineering' });
    const course = await Course.create({ name: 'Computer Science', streamId: stream._id, duration: '4 years' });
    const exam = await EntranceExam.create({ name: 'Entrance Test', courseId: course._id });
    const college = await College.create({ name: 'Verification College', city: 'City', state: 'Assam', type: 'Government', affiliation: 'Test', rating: 4 });
    const offering = await CollegeCourse.create({ collegeId: college._id, courseId: course._id, entranceExamId: exam._id, fees: 50000, seats: 60, minPercentage: 60 });
    const user = await User.create({ name: 'Verification Student', email: 'verification@example.test', password: await bcrypt.hash('Testing123!', 4) });
    await Recommendation.create({ userId: user._id, collegeCourseId: offering._id, matchScore: 80 });
    const toggle = async (Model, record, isActive) => {
      await statusController(Model)({ params: { id: String(record._id) }, body: { isActive } }, response());
      assert.equal((await Model.findById(record._id)).isActive, isActive);
    };
    const available = async expected => {
      const listing = response();
      await publicList({ query: { maxFees: '100000' } }, listing);
      assert.equal(listing.payload.data.total, expected);
      const recommendations = response();
      await listRecommendations({ session: { identity: { id: user._id } }, query: {} }, recommendations);
      assert.equal(recommendations.payload.data.total, expected);
    };
    await available(1);
    for (const [Model, record] of [[Stream, stream], [Course, course], [EntranceExam, exam], [College, college], [CollegeCourse, offering]]) {
      await toggle(Model, record, false);
      await available(0);
      if (Model === College) {
        await assert.rejects(publicDetail({ params: { id: college._id }, query: {} }, response()), error => error.status === 404);
      } else {
        const details = response();
        await publicDetail({ params: { id: college._id }, query: {} }, details);
        assert.equal(details.payload.data.offerings.total, 0);
      }
      if (Model === Stream || Model === Course) {
        const courses = response();
        await masterController('courses').listPublic({ query: {} }, courses);
        assert.equal(courses.payload.data.total, 0);
      }
      await toggle(Model, record, true);
      await available(1);
    }
    await toggle(User, user, false);
    await assert.rejects(login({ body: { email: user.email, password: 'Testing123!' } }, response()), error => error.status === 403);
    let destroyed = false;
    await assert.rejects(me({ session: { identity: { id: user._id, role: 'user' }, destroy(callback) { destroyed = true; callback(); } } }, response()), error => error.status === 401);
    assert.equal(destroyed, true);
    await toggle(User, user, true);
    const session = { regenerate(callback) { callback(); }, save(callback) { callback(); } };
    const signedIn = response();
    await login({ body: { email: user.email, password: 'Testing123!' }, session }, signedIn);
    assert.equal(signedIn.payload.success, true);
    assert.equal(await Recommendation.countDocuments({}), 1, 'Deactivation must preserve saved data');
  } finally {
    // Drop only the unique database created by this test, never the application DB.
    if (mongoose.connection.readyState === 1 && mongoose.connection.name === database && database.startsWith('smart_college_status_verify_')) await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});
