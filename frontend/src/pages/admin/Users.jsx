import ResourceManager from '../../components/ResourceManager.jsx';
import { date } from '../../utils/formatters.js';
const columns = [{
  key: 'name',
  label: 'Name'
}, {
  key: 'email',
  label: 'Email'
}, {
  key: 'phone',
  label: 'Phone'
}, {
  label: 'Registered',
  render: r => date(r.createdAt)
}];
export default function Users() {
  return <ResourceManager title="Users" path="/admin/users" columns={columns} readOnly />;
}
