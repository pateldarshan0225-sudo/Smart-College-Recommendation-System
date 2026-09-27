import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, MapPin, Briefcase, DollarSign, CheckCircle2, Save, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

export default function Profile() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [form, setForm] = useState({
    city: '',
    state: 'Gujarat',
    preferredLocation: '',
    careerGoal: '',
    budget: 150000,
    phone: '',
    category: 'General'
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    document.title = 'My Profile - Student Portal';
    api.get('/profile').then((r) => {
      if (r.data?.data) {
        setForm({
          ...r.data.data,
          state: r.data.data.state || 'Gujarat',
          budget: r.data.data.budget || 150000
        });
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      playSound('tap');
      const r = await api.put('/profile', form);
      if (r.data?.data) {
        setForm(r.data.data);
      }
      playSound('pop');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 32px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2',
          boxShadow: '0 8px 30px rgba(78, 63, 166, 0.05)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F0F2F8' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: '0 0 4px 0' }}>
              Personal & Candidacy Profile
            </h2>
            <div style={{ fontSize: '12.5px', color: isDark ? '#9DA3BC' : '#7E84A3' }}>
              Your location, budget, and career target inform the AI recommendation algorithm.
            </div>
          </div>

          {savedSuccess && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '800' }}>
              <CheckCircle2 size={14} />
              <span>Profile Saved!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Read-Only Account Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFD', padding: '16px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #EAEFFC' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: isDark ? '#9DA3BC' : '#7E84A3', textTransform: 'uppercase', marginBottom: '4px' }}>
                Full Name
              </label>
              <div style={{ fontSize: '14.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B' }}>
                {user?.name || 'Student User'}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: isDark ? '#9DA3BC' : '#7E84A3', textTransform: 'uppercase', marginBottom: '4px' }}>
                Account Email
              </label>
              <div style={{ fontSize: '14.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B' }}>
                {user?.email}
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '8px' }}>
                Home City:
              </label>
              <input
                type="text"
                placeholder="e.g. Ahmedabad, Surat, Rajkot"
                value={form.city || ''}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '600' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '8px' }}>
                State of Domicile:
              </label>
              <input
                type="text"
                value={form.state || 'Gujarat'}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '600' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '8px' }}>
                Preferred College Location:
              </label>
              <input
                type="text"
                placeholder="e.g. Ahmedabad / Gandhinagar / Anywhere in Gujarat"
                value={form.preferredLocation || ''}
                onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '600' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '8px' }}>
                Target Career Goal:
              </label>
              <input
                type="text"
                placeholder="e.g. AI / Machine Learning Engineer, Software Architect, Fintech"
                value={form.careerGoal || ''}
                onChange={(e) => setForm({ ...form, careerGoal: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '600' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B' }}>
                  Max Annual Tuition Budget:
                </label>
                <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#6857E9' }}>
                  ₹{(form.budget || 150000).toLocaleString()} / yr
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="350000"
                step="5000"
                value={form.budget || 150000}
                onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#6857E9', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '8px' }}>
                Admission Category:
              </label>
              <select
                value={form.category || 'General'}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '700' }}
              >
                <option value="General">General / Open</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="SEBC">SEBC / OBC (Non-Creamy Layer)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="TFWS">TFWS (100% Tuition Waiver Candidate)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #6857E9 0%, #4633B5 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(104, 87, 233, 0.35)'
              }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
