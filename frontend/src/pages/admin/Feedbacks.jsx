import ResourceManager from '../../components/ResourceManager.jsx';
import { date } from '../../utils/formatters.js';
const columns = [{
  label: 'Student',
  render: r => r.userId?.name || 'Deleted user'
}, {
  key: 'message',
  label: 'Message'
}, {
  key: 'rating',
  label: 'Rating'
}, {
  label: 'Sent on',
  render: r => date(r.createdAt)
}];
export default function Feedbacks() {
  return <ResourceManager title="Feedback" path="/admin/feedbacks" columns={columns} readOnly />;
}
