import ResourceManager from '../../components/ResourceManager.jsx';
import { money } from '../../utils/formatters.js';
const fields = [{
  name: 'collegeId',
  label: 'College',
  type: 'select',
  required: true,
  source: '/admin/colleges'
}, {
  name: 'courseId',
  label: 'Course',
  type: 'select',
  required: true,
  source: '/admin/courses'
}, {
  name: 'fees',
  label: 'Fees (INR)',
  type: 'number',
  min: 0,
  required: true
}, {
  name: 'seats',
  label: 'Seats',
  type: 'number',
  min: 0,
  step: 1,
  required: true
}, {
  name: 'minPercentage',
  label: 'Minimum percentage',
  type: 'number',
  min: 0,
  max: 100,
  step: '0.01',
  required: true
}, {
  name: 'entranceExamId',
  label: 'Entrance exam (optional)',
  type: 'select',
  source: '/admin/entrance-exams'
}, {
  name: 'cutoffScore',
  label: 'Cutoff score',
  type: 'number',
  min: 0,
  required: true
}];
const columns = [{
  label: 'College',
  render: r => r.collegeId?.name
}, {
  label: 'Course',
  render: r => r.courseId?.name
}, {
  label: 'Fees',
  render: r => money(r.fees)
}, {
  key: 'seats',
  label: 'Seats'
}, {
  label: 'Minimum marks',
  render: r => `${r.minPercentage}%`
}, {
  label: 'Exam',
  render: r => r.entranceExamId?.name || 'None'
}];
export default function CollegeCourses() {
  return <ResourceManager title="College courses" path="/admin/college-courses" fields={fields} columns={columns} />;
}
