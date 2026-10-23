import ResourceManager from '../../components/ResourceManager.jsx';
const fields = [{
  name: 'name',
  label: 'Stream',
  type: 'text',
  required: true,
  minLength: 2,
  maxLength: 100,
  placeholder: 'e.g. Engineering or Computer Applications',
  validate: value => {
    const name = String(value).trim().replace(/\s+/g, ' ');
    if (name.length < 2 || name.length > 100) return 'Stream name must be between 2 and 100 characters';
    if (!/^(?=.*\p{L})[\p{L}\p{M}\p{N} .&()/'-]+$/u.test(name)) return 'Enter a stream name using letters, numbers, spaces or . & ( ) / apostrophe and hyphen';
  }
}];
const columns = [{
  key: 'name',
  label: 'Stream'
}];
export default function Streams() {
  return <ResourceManager title="Streams" path="/admin/streams" fields={fields} columns={columns} />;
}
