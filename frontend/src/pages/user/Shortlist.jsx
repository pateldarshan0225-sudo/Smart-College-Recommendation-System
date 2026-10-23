import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { allPages, errorMessage } from '../../api/axios.js';
import CollegeCard from '../../components/CollegeCard.jsx';
import Pagination from '../../components/Pagination.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import Alert from '../../components/Alert.jsx';
import Loader from '../../components/Loader.jsx';
export default function Shortlist() {
  const [data, setData] = useState(null),
    [colleges, setColleges] = useState([]),
    [page, setPage] = useState(1),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState(''),
    [removing, setRemoving] = useState(null),
    [editing, setEditing] = useState(null),
    [choice, setChoice] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData((await api.get('/user/shortlist', {
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
  useEffect(() => {
    allPages('/public/colleges').then(setColleges).catch(e => setError(errorMessage(e)));
  }, []);
  async function remove() {
    setBusy(true);
    setError('');
    try {
      await api.delete(`/user/shortlist/${removing}`);
      setRemoving(null);
      setSuccess('College removed');
      if (data.items.length === 1 && page > 1) setPage(page - 1);else await load();
    } catch (e) {
      setRemoving(null);
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function update(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.put(`/user/shortlist/${editing}`, {
        collegeId: choice
      });
      setEditing(null);
      setSuccess('Selection updated');
      await load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return <>
  <div className="page-heading">
    <div>
      <p className="eyebrow">YOUR SAVED POSSIBILITIES</p>
      <h1>My shortlist</h1>
      <p>Keep your favourite campuses together while you decide.</p>
    </div>
    <Link className="button" to="/colleges">Explore colleges ↗</Link>
  </div>
  <Alert message={error} />
  <Alert type="success" message={success} />
  {editing && <form className="panel" onSubmit={update}>
    <div className="field">
      <label htmlFor="selectedCollege">Change selected college</label>
      <select id="selectedCollege" value={choice} onChange={e => setChoice(e.target.value)} required>
        <option value="">Choose a college</option>
        {colleges.map(c => <option key={c._id} value={c._id}>
          {c.name}
        </option>)}
      </select>
    </div>
    <div className="actions">
      <button className="button" disabled={busy || !choice}>Save selection</button>
      <button type="button" className="button secondary" onClick={() => setEditing(null)} disabled={busy}>Cancel</button>
    </div>
  </form>}
  {loading ? <Loader /> : <>
    <div className="college-grid">
      {data?.items.map(record => <CollegeCard key={record._id} college={record.collegeId}>
        <div className="actions">
          <button className="button small secondary" onClick={() => {
              setEditing(record._id);
              setChoice(record.collegeId._id);
            }}>Change college</button>
          <button className="button small danger-outline" onClick={() => setRemoving(record._id)}>Remove</button>
        </div>
      </CollegeCard>)}
    </div>
    {!data?.items.length && <div className="empty">
      <h2>Your shortlist starts here.</h2>
      <p>Explore colleges and save the ones that catch your eye.</p>
      <Link className="button" to="/colleges">Explore colleges</Link>
    </div>}
    <Pagination data={data} onPage={setPage} />
  </>}
  <ConfirmDialog open={!!removing} title="Remove this college?" busy={busy} onCancel={() => setRemoving(null)} onConfirm={remove} />
</>;
}
