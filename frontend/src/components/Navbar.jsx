import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from './Alert.jsx';
import { errorMessage } from '../api/axios.js';
export default function Navbar() {
  const [open, setOpen] = useState(false),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const {
      user,
      logout
    } = useAuth(),
    navigate = useNavigate();
  async function leave() {
    setBusy(true);
    try {
      await logout();
      navigate('/');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return <>
  <header className="navbar">
    <Link className="brand" to="/">
      <img src="/images/logo.svg" alt="" width="38" height="38" />
      <span>Smart<span className="brand-light">College</span><small>YOUR NEXT CHAPTER</small></span>
    </Link>
    <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
    <nav className={open ? 'nav-links open' : 'nav-links'} onClick={() => setOpen(false)} aria-label="Main navigation">
      <NavLink to="/colleges">Explore colleges</NavLink>
      {user ? <>
        <NavLink to={user.role === 'admin' ? '/admin' : '/user'}>Dashboard</NavLink>
        {user.role === 'user' && <NavLink to="/user/shortlist">My shortlist</NavLink>}
        <button className="button secondary" disabled={busy} onClick={leave}>Log out</button>
      </> : <>
        <NavLink to="/login">Log in</NavLink>
        <Link className="button" to="/register">Register Now <span aria-hidden="true">↗</span></Link>
      </>}
    </nav>
  </header>
  <Alert message={error} />
</>;
}
