import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../../api/axios.js';
import { money } from '../../utils/formatters.js';
import CollegeCard from '../../components/CollegeCard.jsx';
import Alert from '../../components/Alert.jsx';
import Loader from '../../components/Loader.jsx';
import Pagination from '../../components/Pagination.jsx';
export default function Recommendations() {
  const [data, setData] = useState(null),
    [page, setPage] = useState(1),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData((await api.get('/user/recommendations', {
        params: {
          page,
          limit: 9
        }
      })).data.data);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [page]);
  useEffect(() => {
    load();
  }, [load]);
  async function save(collegeId) {
    setBusy(true);
    setError('');
    try {
      await api.post('/user/shortlist', {
        collegeId
      });
      setSuccess('College added to your shortlist');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return <>
  <div className="page-heading">
    <div>
      <p className="eyebrow">POSSIBILITIES THAT FIT</p>
      <h1>Your recommendations</h1>
      <p>Eligible programmes, ranked around your profile and preferences.</p>
    </div>
  </div>
  <Alert message={error} />
  <Alert type="success" message={success} />
  <details className="score-explainer">
    <summary>How your match score works</summary>
    <p>Marks margin: up to 30 points (one point per percentage point above the minimum). Budget fit: up to 25 based on the share of your budget left over. College rating: up to 20. Preferred state: 15. Preferred course: 10. Unspecified preferences receive full preference points. Scores rank eligible offerings and do not predict admission.</p>
    <p>Eligibility requires sufficient marks, affordable fees, matching selected preferences and any required entrance exam and score. Stream and category do not change eligibility in this project.</p>
  </details>
  {loading ? <Loader /> : <>
    <div className="college-grid">
      {data?.items.map(r => {
          const o = r.collegeCourseId;
          return o && <CollegeCard key={r._id} college={o.collegeId}>
        <div className="match">
          <strong>{r.matchScore}% match</strong>
          <span>
            {o.courseId?.name}
          </span>
        </div>
        <p>{money(o.fees)} · Minimum {o.minPercentage}%</p>
        <button className="button secondary full" disabled={busy} onClick={() => save(o.collegeId._id)}>Shortlist</button>
      </CollegeCard>;
        })}
    </div>
    {!data?.items.length && <div className="empty">
      <h2>Your next chapter is waiting.</h2>
      <p>Create or update your profile, then generate recommendations. If no matches appear, broaden your preferences or review your budget.</p>
      <Link className="button secondary" to="/user/profile">Update my profile</Link>
    </div>}
    <Pagination data={data} onPage={setPage} />
  </>}
</>;
}
