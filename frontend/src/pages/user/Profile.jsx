import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { allPages, errorMessage } from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { validate } from '../../utils/validation.js';
import FormField from '../../components/FormField.jsx';
import Alert from '../../components/Alert.jsx';
import Loader from '../../components/Loader.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
const defaults = {
  stream: '',
  board: '',
  percentage: '',
  entranceExam: '',
  entranceScore: 0,
  category: 'General',
  preferredState: '',
  preferredCourse: '',
  budget: ''
};
export default function Profile() {
  const [values, setValues] = useState(defaults),
    [exists, setExists] = useState(false),
    [lookup, setLookup] = useState({
      streams: [],
      courses: [],
      exams: []
    }),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState(''),
    [errors, setErrors] = useState({}),
    [confirmation, setConfirmation] = useState(''),
    [passwords, setPasswords] = useState({}),
    [accountPassword, setAccountPassword] = useState('');
  const {
      setUser
    } = useAuth(),
    navigate = useNavigate();
  useEffect(() => {
    Promise.all([api.get('/user/profile'), allPages('/public/streams'), allPages('/public/courses'), allPages('/public/entrance-exams')]).then(([r, streams, courses, exams]) => {
      if (r.data.data) {
        setValues({
          ...defaults,
          ...r.data.data,
          entranceExam: r.data.data.entranceExam || '',
          preferredCourse: r.data.data.preferredCourse || ''
        });
        setExists(true);
      }
      setLookup({
        streams,
        courses,
        exams
      });
    }).catch(e => setError(errorMessage(e))).finally(() => setLoading(false));
  }, []);
  const fields = [{
    name: 'stream',
    label: '12th stream',
    type: 'select',
    required: true,
    options: lookup.streams.map(s => s.name)
  }, {
    name: 'board',
    label: 'Education board',
    required: true,
    maxLength: 100,
    placeholder: 'e.g. CBSE or Maharashtra State Board'
  }, {
    name: 'percentage',
    label: '12th percentage',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    step: '0.01'
  }, {
    name: 'category',
    label: 'Category',
    type: 'select',
    required: true,
    options: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other']
  }, {
    name: 'entranceExam',
    label: 'Entrance exam (optional)',
    type: 'select',
    options: lookup.exams.map(e => ({
      value: e._id,
      label: e.name
    }))
  }, {
    name: 'entranceScore',
    label: 'Entrance score',
    type: 'number',
    min: 0,
    step: '0.01',
    required: true
  }, {
    name: 'preferredState',
    label: 'Preferred state (optional)',
    maxLength: 100,
    placeholder: 'e.g. Maharashtra'
  }, {
    name: 'preferredCourse',
    label: 'Preferred course (optional)',
    type: 'select',
    options: lookup.courses.map(c => ({
      value: c._id,
      label: c.name
    }))
  }, {
    name: 'budget',
    label: 'Maximum course fees (INR)',
    type: 'number',
    required: true,
    min: 0,
    placeholder: 'e.g. 150000'
  }];
  async function save(e) {
    e.preventDefault();
    const found = validate(values, fields);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await api[exists ? 'put' : 'post']('/user/profile', values);
      setExists(true);
      setSuccess('Profile saved. Generate recommendations to see your updated matches.');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function change(e) {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      setError('Enter both current and new passwords');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/user/password', passwords);
      setPasswords({});
      setSuccess('Password changed successfully');
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
      if (confirmation === 'profile') {
        await api.delete('/user/profile');
        setExists(false);
        setValues(defaults);
        setSuccess('Profile deleted');
      } else {
        await api.delete('/user/account', {
          data: {
            password: accountPassword
          }
        });
        setUser(null);
        navigate('/');
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
      setConfirmation('');
    }
  }
  if (loading) return <Loader />;
  return <>
  <div className="page-heading">
    <div>
      <p className="eyebrow">TELL US YOUR STORY</p>
      <h1>My student profile</h1>
      <p>Your academic details help us find programmes you are eligible for.</p>
    </div>
    <span className="tag">
      {exists ? 'PROFILE CREATED' : 'LET’S GET STARTED'}
    </span>
  </div>
  <Alert message={error} />
  <Alert type="success" message={success} />
  <section className="panel">
    <h2>Academic details & preferences</h2>
    <p>State and course preferences are strict filters when selected. Category and stream are recorded for your reference.</p>
    <form onSubmit={save} noValidate>
      <div className="form-grid">
        {fields.map(field => <FormField key={field.name} field={field} value={values[field.name]} error={errors[field.name]} onChange={(name, value) => setValues(v => ({
            ...v,
            [name]: value
          }))} />)}
      </div>
      <button className="button" disabled={busy}>
        {busy ? 'Please wait...' : exists ? 'Save profile' : 'Create profile'}
      </button>
    </form>
  </section>
  <section className="panel">
    <h2>Change password</h2>
    <form onSubmit={change}>
      <div className="form-grid">
        {[{
            name: 'currentPassword',
            label: 'Current password',
            type: 'password',
            required: true,
            autoComplete: 'current-password'
          }, {
            name: 'newPassword',
            label: 'New password',
            type: 'password',
            required: true,
            minLength: 8,
            autoComplete: 'new-password'
          }].map(field => <FormField key={field.name} field={field} value={passwords[field.name]} onChange={(name, value) => setPasswords(v => ({
            ...v,
            [name]: value
          }))} />)}
      </div>
      <button className="button secondary" disabled={busy}>Change password</button>
    </form>
  </section>
  <section className="panel danger-zone">
    <h2>Delete profile or account</h2>
    <p>Deleting your profile clears generated recommendations. Deleting your account removes all of your data.</p>
    <div className="actions">
      {exists && <button className="button danger-outline" disabled={busy} onClick={() => setConfirmation('profile')}>Delete profile</button>}
    </div>
    <div className="account-delete">
      <FormField field={{
          name: 'accountPassword',
          label: 'Confirm your password to delete account',
          type: 'password',
          autoComplete: 'current-password'
        }} value={accountPassword} onChange={(_name, value) => setAccountPassword(value)} />
      <button className="button danger" disabled={busy || !accountPassword} onClick={() => setConfirmation('account')}>Delete account</button>
    </div>
  </section>
  <ConfirmDialog open={!!confirmation} title={`Delete your ${confirmation}?`} message={confirmation === 'account' ? 'Your account and all owned records will be permanently deleted.' : 'Your profile and generated recommendations will be deleted.'} busy={busy} onConfirm={remove} onCancel={() => setConfirmation('')} />
</>;
}
