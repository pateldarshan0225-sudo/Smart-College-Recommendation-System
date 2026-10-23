import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage } from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { money } from '../../utils/formatters.js';
import Alert from '../../components/Alert.jsx';
import Loader from '../../components/Loader.jsx';
import Pagination from '../../components/Pagination.jsx';
import PhotoCredit from '../../components/PhotoCredit.jsx';
export default function CollegeDetails() {
  const {
      id
    } = useParams(),
    {
      user
    } = useAuth();
  const [data, setData] = useState(null),
    [page, setPage] = useState(1),
    [error, setError] = useState(''),
    [success, setSuccess] = useState(''),
    [busy, setBusy] = useState(false);
  const load = useCallback(() => {
    api.get(`/public/colleges/${id}`, {
      params: {
        page,
        limit: 8
      }
    }).then(r => setData(r.data.data)).catch(e => setError(errorMessage(e)));
  }, [id, page]);
  useEffect(() => {
    load();
  }, [load]);
  async function save() {
    setBusy(true);
    setError('');
    try {
      await api.post('/user/shortlist', {
        collegeId: id
      });
      setSuccess('Added to your shortlist');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  if (!data) return <div className="container section">
  <Alert message={error} />
  {!error && <Loader />}
</div>;
  const {
    college: c,
    offerings
  } = data;
  return <div className="container section">
  <Link className="text-link" to="/colleges">← All colleges</Link>
  <div className="detail-hero">
    <img src={c.image || '/images/college-placeholder.svg'} onError={e => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/images/college-placeholder.svg';
      }} alt={`${c.name} campus`} loading="lazy" />
    <div>
      <span className="tag">{c.type} · ★ {c.rating}/5</span>
      <h1>
        {c.name}
      </h1>
      <p>{c.city}, {c.state}</p>
      <p>
        {c.affiliation}
      </p>
      {user?.role === 'user' ? <button className="button" disabled={busy} onClick={save}>Shortlist this college</button> : !user ? <Link className="button" to="/login">Log in to shortlist</Link> : null}
    </div>
  </div>
  <Alert message={error} />
  <Alert type="success" message={success} />
  <PhotoCredit college={c} />
  {c.isDemoData && <p className="sample-data-note">Real institution and campus photo. Courses, fees, seats, eligibility and ratings are sample project data, not verified institutional information.</p>}
  <section className="panel">
    <h2>About the college</h2>
    {c.selectionBasis && <p>Selection basis: {c.selectionBasis}. {c.selectionSource && <a className="text-link" href={c.selectionSource} target="_blank" rel="noreferrer">View source</a>}</p>}
    <p>
      {c.description}
    </p>
    {c.website && <a className="text-link" href={c.website} target="_blank" rel="noreferrer">Official website ↗</a>}
  </section>
  <h2>Courses & eligibility</h2>
  <p>Illustrative fees and criteria. Always verify details directly with the institution.</p>
  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Course</th>
          <th>Fees</th>
          <th>Seats</th>
          <th>Minimum marks</th>
          <th>Entrance requirement</th>
        </tr>
      </thead>
      <tbody>
        {offerings.items.map(o => <tr key={o._id}>
          <td data-label="Course">
            {o.courseId?.name}
            <small className="block">
              {o.courseId?.duration}
            </small>
          </td>
          <td data-label="Fees">
            {money(o.fees)}
          </td>
          <td data-label="Seats">
            {o.seats}
          </td>
          <td data-label="Minimum marks">{o.minPercentage}%</td>
          <td data-label="Entrance">
            {o.entranceExamId ? `${o.entranceExamId.name}: ${o.cutoffScore}` : 'No entrance exam'}
          </td>
        </tr>)}
      </tbody>
    </table>
    {!offerings.items.length && <p className="empty">No courses listed yet.</p>}
  </div>
  <Pagination data={offerings} onPage={setPage} />
</div>;
}
