import ResourceManager from '../../components/ResourceManager.jsx';
const fields = [{
  name: 'name',
  label: 'Course name',
  required: true,
  maxLength: 150
}, {
  name: 'streamId',
  label: 'Stream',
  type: 'select',
  required: true,
  source: '/admin/streams'
}, {
  name: 'duration',
  label: 'Duration',
  required: true,
  placeholder: 'e.g. 3 years'
}, {
  name: 'description',
  label: 'Description',
  type: 'textarea',
  maxLength: 2000
}];
const columns = [{
  key: 'name',
  label: 'Course'
}, {
  label: 'Stream',
  render: r => r.streamId?.name
}, {
  key: 'duration',
  label: 'Duration'
}];
export default function Courses() {
  return <ResourceManager title="Courses" path="/admin/courses" fields={fields} columns={columns} />;
}
