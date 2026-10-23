import '../config/env.js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import College from '../models/College.js';

// Update only existing demo records. Never recreate intentionally deleted colleges.
try {
  const identities = JSON.parse(await readFile(new URL('../data/real-colleges.json', import.meta.url), 'utf8'));
  await connectDB();
  const changes = [];
  for (const { legacyName, ...identity } of identities) {
    const record = await College.findOne({ name: { $in: [legacyName, identity.name] } });
    if (record) changes.push({ record, identity });
  }
  const backupDirectory = new URL('../.backups/', import.meta.url);
  await mkdir(backupDirectory, { recursive: true });
  const backup = new URL(`colleges-${Date.now()}.json`, backupDirectory);
  await writeFile(backup, JSON.stringify(changes.map(({ record }) => record.toObject()), null, 2));
  for (const { record, identity } of changes) {
    Object.assign(record, identity);
    await record.save();
  }
  console.log(`Updated ${changes.length} colleges; IDs, ratings and related records preserved. Backup: ${backup.pathname}`);
} catch (error) {
  console.error('College identity update failed:', error.name);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
