import '../config/env.js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import College from '../models/College.js';
import CollegeCourse from '../models/CollegeCourse.js';
import Course from '../models/Course.js';
import Stream from '../models/Stream.js';
import { demoCourseDefinitions } from '../utils/collegeCatalogue.js';

try {
  const catalogue = JSON.parse(await readFile(new URL('../data/state-colleges.json', import.meta.url), 'utf8'));
  await connectDB();
  const names = catalogue.map(record => record.name);
  const existing = await College.find({ name: { $in: names } }).lean();
  const existingIds = existing.map(record => record._id);
  const directory = new URL('../.backups/', import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL(`state-colleges-before-${Date.now()}.json`, directory), JSON.stringify({
    colleges: existing,
    offerings: await CollegeCourse.find({ collegeId: { $in: existingIds } }).lean()
  }, null, 2));

  const courses = new Map();
  for (const [name, stream, duration] of demoCourseDefinitions) {
    const parent = await Stream.findOneAndUpdate({ name: stream }, { $setOnInsert: { name: stream } }, { upsert: true, new: true, runValidators: true });
    const course = await Course.findOneAndUpdate({ name }, { $setOnInsert: {
      name, streamId: parent._id, duration, description: 'Illustrative undergraduate programme for demonstration filters and recommendations.'
    } }, { upsert: true, new: true, runValidators: true });
    courses.set(name, course);
  }
  let added = 0, offeringsAdded = 0;
  for (const { demoCourseNames, referencePage, photoKey, ...identity } of catalogue) {
    const result = await College.findOneAndUpdate({ name: identity.name }, { $setOnInsert: {
      ...identity, rating: 4.0
    } }, { upsert: true, new: true, runValidators: true, includeResultMetadata: true });
    const college = result.value;
    if (!result.lastErrorObject.updatedExisting) added++;
    // Preserve all existing identity fields and only fill missing selection credits.
    if (!college.selectionBasis) await College.updateOne({ _id: college._id }, { $set: { selectionBasis: identity.selectionBasis, selectionSource: identity.selectionSource } });
    for (const name of demoCourseNames) {
      const course = courses.get(name);
      if (!course) throw new Error(`Unknown demo course: ${name}`);
      const offering = await CollegeCourse.updateOne({ collegeId: college._id, courseId: course._id }, { $setOnInsert: {
        collegeId: college._id, courseId: course._id,
        fees: 100000, seats: 60, minPercentage: 60, entranceExamId: null, cutoffScore: 0
      } }, { upsert: true, runValidators: true });
      offeringsAdded += offering.upsertedCount;
    }
  }
  const states = await College.distinct('state', { name: { $in: names } });
  console.log(`Added ${added} colleges and ${offeringsAdded} sample offerings. Catalogue: ${catalogue.length} institutions across ${states.length} Indian states. Existing data preserved.`);
} catch (error) {
  console.error('State college import failed:', error.name, error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
