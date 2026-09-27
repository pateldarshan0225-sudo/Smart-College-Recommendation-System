import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CollegeLogo } from '../../components/college-reco/CollegeSquircles';
import { User, Lock, Mail, Phone, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { playSound } from '../../utils/audio';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    playSound('click');
    setLoading(true);
    setErr('');
    try {
      await register(form);
      playSound('success');
      nav('/user/dashboard');
    } catch (x) {
      playSound('pop');
      setErr(x.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="re-app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="re-ambient-glow" />

      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'var(--re-bg-surface)',
        borderRadius: '28px',
        boxShadow: 'var(--re-shadow-canvas)',
        padding: '36px 32px',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255,255,255,0.7)',
        textAlign: 'center'
      }}>
        {/* Brand Header */}
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <CollegeLogo size={32} />
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--re-text-primary)' }}>Smart College</span>
        </Link>

        <div className="re-interactive-badge" style={{ marginBottom: '10px' }}>
          <Sparkles size={11} /> NEW STUDENT ADMISSION
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 6px' }}>
          Create Student Profile
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--re-text-secondary)', margin: '0 0 24px' }}>
          Join Smart College to receive automated admission recommendations & fee analysis.
        </p>

        {err && (
          <div style={{
            background: 'rgba(255, 101, 132, 0.12)',
            border: '1px solid rgba(255, 101, 132, 0.3)',
            color: '#D90429',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '12.5px',
            fontWeight: 600,
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'left'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={submit} style={{ textAlign: 'left' }}>
          <div className="re-form-group">
            <label className="re-form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                className="re-form-input"
                placeholder="Aarav Patel"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ paddingLeft: '38px' }}
              />
              <User size={16} color="var(--re-text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <div className="re-form-group">
            <label className="re-form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                className="re-form-input"
                placeholder="aarav@gmail.com"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ paddingLeft: '38px' }}
              />
              <Mail size={16} color="var(--re-text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <div className="re-form-group">
            <label className="re-form-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <input
                className="re-form-input"
                placeholder="9898011223"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={{ paddingLeft: '38px' }}
              />
              <Phone size={16} color="var(--re-text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <div className="re-form-group">
            <label className="re-form-label">Password (6+ characters)</label>
            <div style={{ position: 'relative' }}>
              <input
                className="re-form-input"
                placeholder="••••••••"
                type="password"
                minLength="6"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: '38px' }}
              />
              <Lock size={16} color="var(--re-text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <button
            className="re-btn-primary"
            type="submit"
            disabled={loading}
            style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? 'Creating Profile...' : 'Complete Registration ✨'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--re-border-subtle)', fontSize: '13px', color: 'var(--re-text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--re-accent-purple)', fontWeight: 800, textDecoration: 'none' }}>
            Log In
          </Link>
        </div>

        <div style={{ marginTop: '12px' }}>
          <Link to="/" style={{ fontSize: '12px', color: 'var(--re-text-muted)', textDecoration: 'none' }}>
            ← Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
