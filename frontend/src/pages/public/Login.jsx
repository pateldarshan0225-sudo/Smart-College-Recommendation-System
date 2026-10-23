import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { errorMessage } from '../../api/axios.js';
import { validate } from '../../utils/validation.js';
import FormField from '../../components/FormField.jsx';
import Alert from '../../components/Alert.jsx';
export function AuthForm({
  mode = 'login'
}) {
  const register = mode === 'register',
    admin = mode === 'admin';
  const {
      user,
      login
    } = useAuth(),
    navigate = useNavigate();
  const [values, setValues] = useState({}),
    [errors, setErrors] = useState({}),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const fields = [...(register ? [{
    name: 'name',
    label: 'Full name',
    required: true,
    maxLength: 100,
    placeholder: 'Your full name'
  }, {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    maxLength: 20,
    placeholder: 'Optional phone number'
  }] : []), {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    autoComplete: 'email',
    placeholder: 'you@example.com'
  }, {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    autoComplete: register ? 'new-password' : 'current-password',
    placeholder: 'At least 8 characters'
  }];
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;
  async function submit(e) {
    e.preventDefault();
    const found = validate(values, fields);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setError('');
    try {
      const signedIn = await login(register ? '/auth/register' : admin ? '/auth/admin/login' : '/auth/login', values);
      navigate(signedIn.role === 'admin' ? '/admin' : '/user');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return <section className="auth-shell">
  <div className="auth-story">
    <p className="eyebrow">SMART COLLEGE</p>
    <h1>
      {admin ? 'A better organised campus journey.' : 'The next chapter starts with you.'}
    </h1>
    <img src="/images/hero-campus.svg" alt="Illustrated college campus" />
    <p>Your marks. Your ambitions. Your possibilities.</p>
  </div>
  <div className="auth-form">
    <p className="eyebrow">
      {admin ? 'ADMIN WORKSPACE' : 'WELCOME TO YOUR NEXT STEP'}
    </p>
    <h2>
      {register ? 'Create your account' : admin ? 'Admin login' : 'Welcome back'}
    </h2>
    <p>
      {register ? 'Start exploring the right colleges for you.' : 'Log in to continue your journey.'}
    </p>
    <Alert message={error} />
    <form onSubmit={submit} noValidate>
      {fields.map(field => <FormField key={field.name} field={field} value={values[field.name]} error={errors[field.name]} onChange={(name, value) => setValues(v => ({
          ...v,
          [name]: value
        }))} />)}
      <button className="button full" disabled={busy}>
        {busy ? 'Please wait...' : register ? 'Register Now' : 'Log in'}
        <span aria-hidden="true">↗</span>
      </button>
    </form>
    <p>
      {register ? 'Already have an account?' : 'New to Smart College?'}
      <Link to={register ? '/login' : '/register'}>
        {register ? 'Log in' : 'Create an account'}
      </Link>
    </p>
    {!admin && <Link className="subtle-link" to="/admin/login">Administrator login</Link>}
  </div>
</section>;
}
export default function Login() {
  return <AuthForm />;
}
