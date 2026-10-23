import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api, { errorMessage } from '../../api/axios.js';
import Alert from '../../components/Alert.jsx';
import Loader from '../../components/Loader.jsx';
import StatCard from '../../components/StatCard.jsx';
export default function Dashboard() {
  const {
    user
  } = useAuth();
  const [data, setData] = useState(null),
    [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api.get('/user/profile'), api.get('/user/recommendations', {
      params: {
        limit: 1
      }
    }), api.get('/user/shortlist', {
      params: {
        limit: 1
      }
    })]).then(([p, r, s]) => setData({
      profile: p.data.data,
      recommendations: r.data.data.total,
      shortlist: s.data.data.total
    })).catch(e => setError(errorMessage(e)));
  }, []);
  return <>
  <div className="page-heading">
    <div>
      <p className="eyebrow">YOUR NEXT CHAPTER</p>
      <h1>Hello, {user.name.split(' ')[0]}.</h1>
      <p>A little closer to the right college, one step at a time.</p>
    </div>
    <Link className="button" to="/user/recommendations">Get Recommendations ↗</Link>
  </div>
  <Alert message={error} />
  {!data && !error ? <Loader /> : data && <>
    <div className="stats">
      <StatCard label="Student profile" value={data.profile ? 'Complete' : 'Not created'} />
      <StatCard label="Eligible recommendations" value={data.recommendations} />
      <StatCard label="Saved colleges" value={data.shortlist} />
    </div>
    <section className="welcome-panel">
      <div>
        <p className="eyebrow">A PATH THAT FITS YOU</p>
        <h2>
          {data.profile ? 'Your possibilities are waiting.' : 'Start with your story.'}
        </h2>
        <p>
          {data.profile ? 'Your profile is ready. Generate matches to explore programmes within your marks and budget.' : 'Tell us about your marks, entrance exams and preferences so we can find eligible programmes.'}
        </p>
        <Link className="button" to={data.profile ? '/user/recommendations' : '/user/profile'}>{data.profile ? 'Explore my matches' : 'Create my profile'} ↗</Link>
      </div>
      <img src="/images/hero-campus.svg" alt="College campus illustration" />
    </section>
    <div className="steps compact">
      {[['01', 'Update your profile', 'Keep your academic details and budget current.', '/user/profile'], ['02', 'Build your shortlist', 'Save campuses and compare your options.', '/user/shortlist'], ['03', 'Share your experience', 'Help us understand what worked for you.', '/user/feedback']].map(([n, title, copy, to]) => <Link className="step" to={to} key={n}>
        <span className="step-number">{n} ↗</span>
        <h3>
          {title}
        </h3>
        <p>
          {copy}
        </p>
      </Link>)}
    </div>
  </>}
</>;
}
