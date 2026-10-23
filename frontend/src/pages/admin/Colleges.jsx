import ResourceManager from '../../components/ResourceManager.jsx';
const fields = [{
  name: 'name',
  label: 'College name',
  required: true
}, {
  name: 'city',
  label: 'City',
  required: true
}, {
  name: 'state',
  label: 'State',
  required: true
}, {
  name: 'type',
  label: 'Type',
  type: 'select',
  required: true,
  options: ['Government', 'Private', 'Aided']
}, {
  name: 'affiliation',
  label: 'Affiliation',
  required: true
}, {
  name: 'website',
  label: 'Website URL',
  type: 'url',
  placeholder: 'https://...'
}, {
  name: 'image',
  label: 'Image URL',
  type: 'url',
  placeholder: 'https://...'
}, {
  name: 'rating',
  label: 'Rating (0-5)',
  type: 'select',
  required: true,
  options: Array.from({ length: 51 }, (_, index) => ({
    value: String(index / 10),
    label: (index / 10).toFixed(1)
  }))
}, {
  name: 'description',
  label: 'Description',
  type: 'textarea',
  maxLength: 2000
}];
const columns = [{
  key: 'name',
  label: 'College'
}, {
  key: 'city',
  label: 'City'
}, {
  key: 'state',
  label: 'State'
}, {
  key: 'type',
  label: 'Type'
}, {
  key: 'rating',
  label: 'Rating',
  render: record => Number(record.rating).toFixed(1)
}];
export default function Colleges() {
  return <ResourceManager title="Colleges" path="/admin/colleges" fields={fields} columns={columns} />;
}
