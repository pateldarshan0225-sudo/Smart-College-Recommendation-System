import ResourceManager from '../../components/ResourceManager.jsx';
const fields = [{
  name: 'name',
  label: 'Exam name',
  required: true
}, {
  name: 'courseId',
  label: 'Course',
  type: 'select',
  required: true,
  source: '/admin/courses'
}, {
  name: 'description',
  label: 'Description',
  type: 'textarea',
  maxLength: 2000
}];
const columns = [{
  key: 'name',
  label: 'Exam'
}, {
  label: 'Course',
  render: r => r.courseId?.name
}, {
  key: 'description',
  label: 'Description'
}];
export default function EntranceExams() {
  return <ResourceManager title="Entrance exams" path="/admin/entrance-exams" fields={fields} columns={columns} />;
}
