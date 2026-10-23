import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../../api/axios.js';
import StatCard from '../../components/StatCard.jsx';
import Alert from '../../components/Alert.jsx';
import Loader from '../../components/Loader.jsx';
import { date } from '../../utils/formatters.js';
export default function Dashboard() {
  const [data, setData] = useState(null),
    [error, setError] = useState('');
  useEffect(() => {
    api.get('/admin/dashboard').then(r => setData(r.data.data)).catch(e => setError(errorMessage(e)));
  }, []);
  return <>
  <div className="page-heading">
    <div>
      <p className="eyebrow">ADMIN WORKSPACE</p>
      <h1>The bigger picture.</h1>
      <p>Your students, colleges and latest activity at a glance.</p>
    </div>
    <Link className="button" to="/admin/colleges">Manage colleges ↗</Link>
  </div>
  <Alert message={error} />
  {!data && !error ? <Loader /> : data && <>
    <div className="stats">
      {['users', 'colleges', 'courses', 'feedbacks'].map(key => <StatCard key={key} label={key === 'feedbacks' ? 'Feedback' : key[0].toUpperCase() + key.slice(1)} value={data[key]} />)}
    </div>
    <div className="dashboard-columns">
      <section className="panel">
        <div className="section-row">
          <h2>Recent students</h2>
          <Link to="/admin/users">View all ↗</Link>
        </div>
        {data.recentUsers.map(u => <div className="activity" key={u._id}>
          <span className="avatar">
            {u.name[0]}
          </span>
          <div>
            <strong>
              {u.name}
            </strong>
            <small>
              {u.email}
            </small>
          </div>
          <small>
            {date(u.createdAt)}
          </small>
        </div>)}
        {!data.recentUsers.length && <p>No registrations yet.</p>}
      </section>
      <section className="panel">
        <div className="section-row">
          <h2>Recent feedback</h2>
          <Link to="/admin/feedbacks">View all ↗</Link>
        </div>
        {data.recentFeedbacks.map(f => <div className="feedback-item" key={f._id}>
          <strong>
            {f.userId?.name || 'Deleted user'}
            <span className="rating">★ {f.rating}/5</span>
          </strong>
          <p>
            {f.message}
          </p>
          <small>
            {date(f.createdAt)}
          </small>
        </div>)}
        {!data.recentFeedbacks.length && <p>No feedback yet.</p>}
      </section>
    </div>
  </>}
</>;
}
