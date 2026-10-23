import { useEffect, useState } from 'react';
import api, { allPages, errorMessage } from '../../api/axios.js';
import CollegeCard from '../../components/CollegeCard.jsx';
import Pagination from '../../components/Pagination.jsx';
import Loader from '../../components/Loader.jsx';
import Alert from '../../components/Alert.jsx';
export default function CollegeList() {
  const [filters, setFilters] = useState({
      search: '',
      state: '',
      course: '',
      maxFees: ''
    }),
    [query, setQuery] = useState({}),
    [page, setPage] = useState(1),
    [data, setData] = useState(null),
    [courses, setCourses] = useState([]),
    [states, setStates] = useState([]),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    allPages('/public/courses').then(setCourses).catch(e => setError(errorMessage(e)));
    api.get('/public/college-states').then(response => setStates(response.data.data)).catch(e => setError(errorMessage(e)));
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/public/colleges', {
        signal: controller.signal,
        params: {
          ...query,
          page,
          limit: 9
        }
      });
      if (!controller.signal.aborted) setData(response.data.data);
    } catch (e) {
      if (!controller.signal.aborted) {
        setData(null);
        setError(errorMessage(e));
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
    }
    load();
    return () => controller.abort();
  }, [query, page]);
  function change(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  }
  return <div className="container section">
  <div className="page-heading">
    <div>
      <p className="eyebrow">FIND YOUR PLACE</p>
      <h1>Explore the possibilities.</h1>
      <p>Discover leading institutions across India. Explore by state, compare options and take your next step.</p>
    </div>
    <span className="tag">UNDERGRADUATE COLLEGES</span>
  </div>
  <form className="filter-bar" onSubmit={e => {
      e.preventDefault();
      setPage(1);
      setQuery({
        ...filters
      });
    }}>
    <div className="field">
      <label htmlFor="search">Search colleges</label>
      <input id="search" name="search" placeholder="College name..." value={filters.search} onChange={change} />
    </div>
    <div className="field">
      <label htmlFor="state">State</label>
      <select id="state" name="state" value={filters.state} onChange={change}>
        <option value="">All states</option>
        {states.map(state => <option key={state} value={state}>{state}</option>)}
      </select>
    </div>
    <div className="field">
      <label htmlFor="course">Course</label>
      <select id="course" name="course" value={filters.course} onChange={change}>
        <option value="">All courses</option>
        {courses.map(c => <option key={c._id} value={c._id}>
          {c.name}
        </option>)}
      </select>
    </div>
    <div className="field">
      <label htmlFor="maxFees">Maximum fees (INR)</label>
      <input id="maxFees" name="maxFees" type="number" min="0" placeholder="Any budget" value={filters.maxFees} onChange={change} />
    </div>
    <button type="button" className="button secondary" onClick={() => {
      setFilters({ search: '', state: '', course: '', maxFees: '' });
      setQuery({});
      setPage(1);
    }}>Reset filters</button>
    <div className="filter-submit">
      <button type="submit" className="button">Apply filters</button>
    </div>
  </form>
  <p>Maximum fees shows colleges with at least one course within your budget. Click Apply filters after changing the amount.</p>
  {query.maxFees !== undefined && query.maxFees !== '' && <p>Applied maximum fees: INR {Number(query.maxFees).toLocaleString('en-IN')}</p>}
  <Alert message={error} />
  {loading ? <Loader /> : <>
    <p className="results-count">{data?.total || 0} colleges to explore · Sample project data</p>
    <div className="college-grid">
      {data?.items.map(college => <CollegeCard key={college._id} college={college} />)}
    </div>
    {!data?.items.length && <div className="empty">
      <h2>No colleges found</h2>
      <p>Try a broader search, a different state or a higher budget.</p>
    </div>}
    <Pagination data={data} onPage={setPage} />
  </>}
</div>;
}
