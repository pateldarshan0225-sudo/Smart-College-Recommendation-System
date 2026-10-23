import ResourceManager from '../../components/ResourceManager.jsx';
import { date } from '../../utils/formatters.js';
const fields = [{
  name: 'message',
  label: 'Your feedback',
  type: 'textarea',
  required: true,
  maxLength: 2000,
  placeholder: 'Tell us about your experience...'
}, {
  name: 'rating',
  label: 'Rating (1-5)',
  type: 'number',
  required: true,
  min: 1,
  max: 5,
  step: 1
}];
const columns = [{
  key: 'message',
  label: 'Message'
}, {
  key: 'rating',
  label: 'Rating'
}, {
  label: 'Sent on',
  render: r => date(r.createdAt)
}];
export default function Feedback() {
  return <ResourceManager title="Feedback" path="/user/feedback" fields={fields} columns={columns} />;
}
