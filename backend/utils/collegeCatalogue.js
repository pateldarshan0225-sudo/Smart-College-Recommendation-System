import { readFile } from 'node:fs/promises';

export async function loadCollegeCatalogue() {
  const original = JSON.parse(await readFile(new URL('../data/real-colleges.json', import.meta.url), 'utf8'));
  const statewide = JSON.parse(await readFile(new URL('../data/state-colleges.json', import.meta.url), 'utf8'));
  const merged = new Map(original.map(record => [record.name, record]));
  for (const record of statewide) merged.set(record.name, { ...record, ...merged.get(record.name), selectionBasis: record.selectionBasis, selectionSource: record.selectionSource, demoCourseNames: record.demoCourseNames });
  return [...merged.values()];
}

export const demoCourseDefinitions = [
  ['B.Tech Computer Science', 'Science', '4 years'],
  ['B.Tech Mechanical Engineering', 'Science', '4 years'],
  ['B.Tech Chemical Engineering', 'Science', '4 years'],
  ['B.Tech Aerospace Engineering', 'Science', '4 years'],
  ['B.Sc Mathematics', 'Science', '3 years'],
  ['BA Economics', 'Arts', '3 years']
];
