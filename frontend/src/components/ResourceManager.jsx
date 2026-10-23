import { useCallback, useEffect, useState } from 'react';
import api, { allPages, errorMessage } from '../api/axios.js';
import { validate } from '../utils/validation.js';
import Alert from './Alert.jsx';
import Loader from './Loader.jsx';
import FormField from './FormField.jsx';
import Pagination from './Pagination.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
const emptyFields = [];
const statusPaths = ['/admin/streams', '/admin/courses', '/admin/entrance-exams', '/admin/colleges', '/admin/college-courses', '/admin/users'];
const deletionWarnings = {
  '/admin/colleges': 'This college may have attached course offerings, recommendations and shortlists. Deleting it will also permanently delete those attached records. Shared course definitions will remain.',
  '/admin/streams': 'This stream may have attached courses, entrance exams, offerings and student profiles. Deleting it will also permanently delete those records and their recommendations. Related preferences in other profiles will be cleared.',
  '/admin/courses': 'This course may have attached entrance exams, college offerings and recommendations. Deleting it will also permanently delete those records. Related course and exam preferences in student profiles will be cleared.',
  '/admin/entrance-exams': 'This exam may be attached to college offerings and student profiles. Deleting it will clear those exam links and scores and remove affected recommendations. Colleges, offerings and student profiles will remain.',
  '/admin/college-courses': 'This offering may have attached student recommendations. Deleting it will also permanently delete those recommendations. Its college and shared course will remain.',
  '/admin/users': 'Deleting this user will also permanently delete their profile, recommendations, shortlists and feedback.'
};
export default function ResourceManager({
  title,
  path,
  fields = emptyFields,
  columns,
  readOnly = false
}) {
  const hasStatus = statusPaths.includes(path);
  const [data, setData] = useState(null),
    [page, setPage] = useState(1),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState(''),
    [editing, setEditing] = useState(null),
    [values, setValues] = useState({}),
    [errors, setErrors] = useState({}),
    [removing, setRemoving] = useState(null),
    [lookups, setLookups] = useState({});
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get(path, {
        params: {
          page,
          limit: 8
        }
      });
      setData(r.data.data);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [path, page]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    let active = true;
    const sources = [...new Set(fields.filter(f => f.source).map(f => f.source))];
    Promise.all(sources.map(async source => [source, await allPages(source)])).then(entries => {
      if (active) setLookups(Object.fromEntries(entries));
    }).catch(e => {
      if (active) setError(errorMessage(e));
    });
    return () => {
      active = false;
    };
  }, [fields]);
  const resolved = fields.map(f => ({
    ...f,
    options: f.source ? (lookups[f.source] || []).map(item => ({
      value: item._id,
      label: item.name || `${item.collegeId?.name} · ${item.courseId?.name}`
    })) : f.options
  }));
  function start(record = {}) {
    setEditing(record._id || 'new');
    setValues(Object.fromEntries(fields.map(f => [f.name, record[f.name]?._id ?? record[f.name] ?? ''])));
    setErrors({});
    setError('');
    setSuccess('');
  }
  async function submit(e) {
    e.preventDefault();
    const found = validate(values, resolved);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setError('');
    try {
      if (editing === 'new') await api.post(path, values);else await api.put(`${path}/${editing}`, values);
      setEditing(null);
      setSuccess('Saved successfully');
      await load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await api.delete(`${path}/${removing._id}`);
      setRemoving(null);
      setSuccess('Deleted successfully');
      if (data.items.length === 1 && page > 1) setPage(page - 1);else await load();
    } catch (e) {
      setRemoving(null);
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function toggleStatus(record) {
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.put(`${path}/${record._id}/status`, { isActive: record.isActive === false });
      setData(current => ({ ...current, items: current.items.map(item => item._id === record._id ? { ...item, isActive: response.data.data.isActive } : item) }));
      setSuccess(response.data.message);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return <>
  <div className="page-heading">
    <div>
      <p className="eyebrow">
        {path.includes('/admin') ? 'MANAGE & ORGANISE' : 'YOUR WORKSPACE'}
      </p>
      <h1>
        {title}
      </h1>
      <p>
        {readOnly ? 'Review records and remove them when needed.' : 'View, add and update your records.'}
      </p>
    </div>
    {!readOnly && <button className="button" onClick={() => start()}>+ Add {title === 'Feedback' ? 'feedback' : 'record'}</button>}
  </div>
  <Alert message={error} />
  <Alert type="success" message={success} />
  {editing && <section className="panel">
    <h2>{editing === 'new' ? 'Add' : 'Edit'} record</h2>
    <form onSubmit={submit} noValidate>
      <div className="form-grid">
        {resolved.map(field => <FormField key={field.name} field={field} value={values[field.name]} error={errors[field.name]} onChange={(key, value) => setValues(v => ({
            ...v,
            [key]: value
          }))} />)}
      </div>
      <div className="actions">
        <button className="button" disabled={busy}>
          {busy ? 'Saving...' : 'Save changes'}
        </button>
        <button type="button" className="button secondary" onClick={() => setEditing(null)} disabled={busy}>Cancel</button>
      </div>
    </form>
  </section>}
  {loading ? <Loader /> : <div className="table-wrap">
    <table>
      <thead>
        <tr>
          {columns.map(c => <th key={c.label}>
            {c.label}
          </th>)}
          {hasStatus && <th>Status</th>}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data?.items.map(record => <tr key={record._id}>
          {columns.map(c => <td data-label={c.label} key={c.label}>
            {c.render ? c.render(record) : String(record[c.key] ?? '—')}
          </td>)}
          {hasStatus && <td data-label="Status">
            <button type="button" role="switch" aria-checked={record.isActive !== false}
              aria-label={`${record.name || title} status`}
              className={`status-toggle ${record.isActive === false ? 'is-inactive' : 'is-active'}`}
              disabled={busy} onClick={() => toggleStatus(record)}>
              <span className="status-track" aria-hidden="true"><span /></span>
              {record.isActive === false ? 'Inactive' : 'Active'}
            </button>
          </td>}
          <td data-label="Actions">
            <div className="actions">
              {!readOnly && <button className="button small secondary" onClick={() => start(record)}>Edit</button>}
              <button className="button small danger-outline" onClick={() => { setError(''); setSuccess(''); setRemoving(record); }}>Delete</button>
            </div>
          </td>
        </tr>)}
      </tbody>
    </table>
    {!data?.items.length && <div className="empty">No records yet. Your records will appear here.</div>}
  </div>}
  <Pagination data={data} onPage={setPage} />
  <ConfirmDialog
    open={!!removing}
    title={removing?.name ? `Delete "${removing.name}"?` : 'Delete this record?'}
    busy={busy}
    onCancel={() => setRemoving(null)}
    onConfirm={remove}
    message={`${deletionWarnings[path] || 'This record will be permanently deleted.'} Are you sure you want to continue? This action cannot be undone.`}
  />
</>;
}
