import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sliders, Save, CheckCircle2, Sparkles, Building2, MapPin, DollarSign, Zap } from 'lucide-react';
import { playSound } from '../../utils/audio';

const ALL_FACILITIES = [
  'Hostel Accommodation',
  'Central Digital Library',
  'High-Speed Campus WiFi',
  'Advanced Computing & AI Lab',
  'Dedicated Placement Cell',
  'Indoor & Outdoor Sports Complex',
  'Gymnasium & Fitness Center',
  'Cafeteria & Food Court',
  'College Bus Transport',
  'Medical / Health Center',
  'Incubation & Startup Hub',
  'Auditorium & Seminar Halls'
];

export default function Preferences() {
  const { isDark } = useTheme();

  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    preferredLocation: 'Ahmedabad / Gandhinagar',
    careerGoal: 'Software Engineer & AI Architect',
    preferredCourse: '',
    budget: 180000,
    preferredCollegeType: 'Any',
    preferredFacilities: ['Hostel Accommodation', 'High-Speed Campus WiFi', 'Dedicated Placement Cell']
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Recommendation Preferences - Student Portal';
    Promise.all([
      api.get('/profile').catch(() => ({ data: { data: null } })),
      api.get('/courses').catch(() => ({ data: { data: [] } }))
    ]).then(([pRes, cRes]) => {
      setCourses(cRes.data?.data || []);
      if (pRes.data?.data) {
        const p = pRes.data.data;
        setForm((prev) => ({
          ...prev,
          ...p,
          preferredCourse: p.preferredCourse?._id || p.preferredCourse || '',
          preferredFacilities: p.preferredFacilities?.length ? p.preferredFacilities : prev.preferredFacilities
        }));
      }
    });
  }, []);

  const toggleFacility = (facility) => {
    playSound('tap');
    setForm((f) => {
      const current = f.preferredFacilities || [];
      const updated = current.includes(facility)
        ? current.filter((x) => x !== facility)
        : [...current, facility];
      return { ...f, preferredFacilities: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      playSound('tap');
      const r = await api.put('/profile', form);
      if (r.data?.data) {
        setForm((prev) => ({
          ...prev,
          ...r.data.data,
          preferredCourse: r.data.data.preferredCourse?._id || form.preferredCourse
        }));
      }
      playSound('pop');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
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
              College & Branch Preferences
            </h2>
            <div style={{ fontSize: '12.5px', color: isDark ? '#9DA3BC' : '#7E84A3' }}>
              Configure your desired degree courses, institute types, and mandatory campus amenities.
            </div>
          </div>

          {savedSuccess && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', padding: '5px 12px', borderRadius: '999px', fontSize: '11.5px', fontWeight: '800' }}>
              <CheckCircle2 size={13} />
              <span>Preferences Saved!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            {/* Preferred Course */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '8px' }}>
                Preferred Course / Branch:
              </label>
              <select
                value={form.preferredCourse || ''}
                onChange={(e) => setForm({ ...form, preferredCourse: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '700' }}
              >
                <option value="">Any Engineering / Technology Branch</option>
                {courses.length > 0 ? (
                  courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.courseName} ({c.degreeType || 'B.Tech'})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="cse">Computer Engineering & AI</option>
                    <option value="it">Information Technology</option>
                    <option value="ds">Data Science & Cyber Security</option>
                    <option value="mech">Mechanical Engineering</option>
                    <option value="mba">Master of Business Administration (MBA)</option>
                  </>
                )}
              </select>
            </div>

            {/* College Type */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '8px' }}>
                Preferred College Category:
              </label>
              <select
                value={form.preferredCollegeType || 'Any'}
                onChange={(e) => setForm({ ...form, preferredCollegeType: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '700' }}
              >
                {['Any', 'Government (100% Subsidized)', 'Autonomous (NAAC A+)', 'Private University', 'Deemed University'].map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </div>

            {/* Preferred City */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '8px' }}>
                Preferred Location / Region:
              </label>
              <input
                type="text"
                placeholder="e.g. Ahmedabad, Gandhinagar, Surat, Vadodara"
                value={form.preferredLocation || ''}
                onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '600' }}
              />
            </div>

            {/* Annual Tuition Budget */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B' }}>
                  Max Annual Budget:
                </label>
                <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#6857E9' }}>
                  ₹{(form.budget || 180000).toLocaleString()} / yr
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="350000"
                step="5000"
                value={form.budget || 180000}
                onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#6857E9', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Mandatory Campus Facilities */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '12px' }}>
              Required Campus Infrastructure & Facilities:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {ALL_FACILITIES.map((facility) => {
                const isSelected = form.preferredFacilities?.includes(facility);
                return (
                  <div
                    key={facility}
                    onClick={() => toggleFacility(facility)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: isSelected
                        ? isDark
                          ? 'rgba(104, 87, 233, 0.25)'
                          : '#F0EDFE'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.03)'
                        : '#F8FAFD',
                      border: isSelected
                        ? '1.5px solid #6857E9'
                        : isDark
                        ? '1px solid rgba(255, 255, 255, 0.06)'
                        : '1px solid #EAEFFC',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => {}}
                      style={{ accentColor: '#6857E9', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12.5px', fontWeight: isSelected ? '800' : '600', color: isSelected ? (isDark ? '#FFFFFF' : '#4633B5') : (isDark ? '#C4C9DF' : '#5A607F') }}>
                      {facility}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
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
              <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
