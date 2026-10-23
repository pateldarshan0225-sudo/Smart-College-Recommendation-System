import { loadCollegeCatalogue, demoCourseDefinitions } from '../utils/collegeCatalogue.js';
import '../config/env.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';
import Stream from '../models/Stream.js';
import Course from '../models/Course.js';
import EntranceExam from '../models/EntranceExam.js';
import College from '../models/College.js';
import CollegeCourse from '../models/CollegeCourse.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Recommendation from '../models/Recommendation.js';
import Shortlist from '../models/Shortlist.js';
import Feedback from '../models/Feedback.js';
import { email, password, text } from '../utils/validation.js';
async function upsert(Model, filter, data) {
  return Model.findOneAndUpdate(filter, {
    $set: data
  }, {
    upsert: true,
    new: true,
    runValidators: true
  });
}
try {
  if (!process.env.MONGODB_URI || !process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD || !process.env.SEED_ADMIN_NAME) throw new Error('Configure MONGODB_URI and SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD in backend/.env before seeding');
  const adminEmail = email(process.env.SEED_ADMIN_EMAIL),
    adminPassword = password(process.env.SEED_ADMIN_PASSWORD),
    adminName = text(process.env.SEED_ADMIN_NAME, 'Admin name');
  await connectDB();
  // Explicit creation ensures exactly these eleven application collections exist.
  for (const Model of [Admin, User, StudentProfile, Stream, Course, EntranceExam, College, CollegeCourse, Recommendation, Shortlist, Feedback]) {
    await Model.createCollection();
    await Model.createIndexes();
  }
  if (!(await Admin.exists({
    email: adminEmail
  }))) await Admin.create({
    name: adminName,
    email: adminEmail,
    password: await bcrypt.hash(adminPassword, Number(process.env.BCRYPT_ROUNDS || 12))
  });
  const streams = {};
  for (const name of ['Science', 'Commerce', 'Arts']) streams[name] = await upsert(Stream, {
    name
  }, {
    name
  });
  const definitions = [['B.Tech Computer Science', 'Science', '4 years'], ['B.Tech Mechanical Engineering', 'Science', '4 years'], ['MBBS', 'Science', '5.5 years'], ['B.Sc Mathematics', 'Science', '3 years'], ['B.Sc Physics', 'Science', '3 years'], ['B.Com', 'Commerce', '3 years'], ['BBA', 'Commerce', '3 years'], ['B.Com Accounting', 'Commerce', '3 years'], ['BA Economics', 'Arts', '3 years'], ['BA English', 'Arts', '3 years'], ['BA LLB', 'Arts', '5 years'], ['Bachelor of Fine Arts', 'Arts', '4 years']];
  for (const definition of demoCourseDefinitions) {
    if (!definitions.some(([name]) => name === definition[0])) definitions.push(definition);
  }
  const courses = [];
  for (const [name, stream, duration] of definitions) courses.push(await upsert(Course, {
    name
  }, {
    name,
    streamId: streams[stream]._id,
    duration,
    description: `Undergraduate ${name} programme with classroom learning and practical coursework.`
  }));
  const exams = [];
  for (const [name, index] of [['JEE Main', 0], ['NEET', 2], ['CUET', 3], ['CLAT', 10], ['MHT CET', 1]]) exams.push(await upsert(EntranceExam, {
    name
  }, {
    name,
    courseId: courses[index]._id,
    description: `Illustrative ${name} entry requirement. Verify current criteria with each college.`
  }));
  const places = await loadCollegeCatalogue();
  for (let i = 0; i < places.length; i++) {
    const { legacyName, demoCourseNames, referencePage, ...identity } = places[i];
    const existing = await College.findOne({ name: { $in: [identity.name, legacyName].filter(Boolean) } });
    const college = await upsert(College, existing ? { _id: existing._id } : { name: identity.name }, {
      ...identity,
      rating: Math.round((3.4 + i % 6 * .25) * 10) / 10
    });
    const programmeIndexes = demoCourseNames ? demoCourseNames.map(name => courses.findIndex(course => course.name === name)) : Array.from({ length: 4 }, (_, j) => (i + j * 3) % courses.length);
    for (let j = 0; j < programmeIndexes.length; j++) {
      const index = programmeIndexes[j];
      const entranceExamId = index === 0 ? exams[0]._id : index === 2 ? exams[1]._id : index === 10 ? exams[3]._id : null;
      await upsert(CollegeCourse, {
        collegeId: college._id,
        courseId: courses[index]._id
      }, {
        collegeId: college._id,
        courseId: courses[index]._id,
        fees: 25000 + i % 5 * 25000 + j * 15000,
        seats: 40 + j * 20,
        minPercentage: 45 + i % 5 * 7,
        cutoffScore: entranceExamId ? 80 + i % 4 * 20 : 0,
        entranceExamId
      });
    }
  }
  console.log(`Seed complete: admin, 3 streams, ${courses.length} courses, 5 exams and ${places.length} catalogue institutions with sample offerings.`);
} catch (error) {
  console.error('Seed failed:', error.name === 'MongooseServerSelectionError' ? 'MongoDB is not reachable' : error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
