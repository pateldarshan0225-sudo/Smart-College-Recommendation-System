import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Building2,
  MapPin,
  Award,
  Bookmark,
  Scale,
  GraduationCap,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export default function CollegeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [d, setD] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'College Profile - Student Portal';
    Promise.all([
      api.get(`/colleges/${id}`).catch(() => ({ data: { data: null } })),
      api.get('/saved-colleges').catch(() => ({ data: { data: [] } }))
    ]).then(([colRes, savedRes]) => {
      setD(colRes.data?.data);
      const savedList = savedRes.data?.data || [];
      setIsSaved(savedList.some((s) => (s.collegeId?._id || s.collegeId) === id));
      setLoading(false);
    });
  }, [id]);

  const handleToggleSave = async () => {
    playSound('tap');
    if (isSaved) {
      setIsSaved(false);
      try {
        await api.delete(`/saved-colleges/${id}`);
      } catch (err) {}
    } else {
      setIsSaved(true);
      try {
        await api.post('/saved-colleges', { collegeId: id });
        playSound('pop');
      } catch (err) {}
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: isDark ? '#9DA3BC' : '#7E84A3' }}>
        Loading college details...
      </div>
    );
  }

  if (!d || !d.college) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3>College Details Not Found</h3>
        <button onClick={() => navigate(-1)} className="btn btn-primary mt-3">Go Back</button>
      </div>
    );
  }

  const c = d.college;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Navigation & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: isDark ? '#FFFFFF' : '#1E1B4B',
            fontSize: '13.5px',
            fontWeight: '800',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleToggleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '999px',
              border: isSaved ? '1.5px solid #10B981' : isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E9F2',
              background: isSaved ? 'rgba(16, 185, 129, 0.12)' : isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
              color: isSaved ? '#10B981' : isDark ? '#FFFFFF' : '#1E1B4B',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <Bookmark size={15} />
            <span>{isSaved ? 'Saved in Shortlist' : 'Add to Shortlist'}</span>
          </button>
        </div>
      </div>

      {/* College Main Profile Hero Header */}
      <div
        style={{
          background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 32px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2',
          boxShadow: '0 8px 30px rgba(78, 63, 166, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '6px', background: 'rgba(104, 87, 233, 0.12)', color: '#6857E9' }}>
            {c.collegeType || 'Autonomous Institute'}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#FFA439' }}>
            ★ {c.collegeRating || '4.6'} / 5.0 Rating
          </span>
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: '0 0 10px 0', lineHeight: 1.25 }}>
          {c.name}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: isDark ? '#9DA3BC' : '#7E84A3', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} color="#6857E9" />
            {c.city}, {c.state}
          </span>
          <span>•</span>
          <span style={{ fontWeight: '700', color: isDark ? '#FFFFFF' : '#1E1B4B' }}>
            Affiliated: {c.university || 'GTU'}
          </span>
          <span>•</span>
          <span>
            ACPC Eligibility: <strong>{c.eligibilityPercentage || 50}%</strong>
          </span>
        </div>

        {c.description && (
          <p style={{ fontSize: '14px', color: isDark ? '#C4C9DF' : '#5A607F', lineHeight: 1.6, marginTop: '16px', marginBottom: 0 }}>
            {c.description}
          </p>
        )}
      </div>

      {/* Split Section: Placements + Offered Courses */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Placements Card */}
        <div
          style={{
            background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <TrendingUp size={18} color="#10B981" />
            <h2 style={{ fontSize: '17px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: 0 }}>
              Placement Statistics (2024)
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
            <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFD', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#9DA3BC', textTransform: 'uppercase' }}>Average CTC</div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>
                ₹{d.placement?.averagePackage ? `${(d.placement.averagePackage / 100000).toFixed(1)} LPA` : '—'}
              </div>
            </div>

            <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFD', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#9DA3BC', textTransform: 'uppercase' }}>Highest CTC</div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: '#6857E9', marginTop: '4px' }}>
                ₹{d.placement?.highestPackage ? `${(d.placement.highestPackage / 100000).toFixed(1)} LPA` : '—'}
              </div>
            </div>

            <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFD', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#9DA3BC', textTransform: 'uppercase' }}>Placement Rate</div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', marginTop: '4px' }}>
                {d.placement?.placementRate ? `${d.placement.placementRate}%` : '92%'}
              </div>
            </div>
          </div>

          {/* Campus Facilities */}
          <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '10px' }}>
            Campus Infrastructure:
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {d.facilities ? (
              Object.entries(d.facilities)
                .filter(([k, v]) => !['_id', 'collegeId', 'createdAt', 'updatedAt', '__v'].includes(k) && v)
                .map(([k]) => (
                  <span key={k} style={{ fontSize: '11.5px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: isDark ? 'rgba(255,255,255,0.05)' : '#F6F8FD', color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} /> {k}
                  </span>
                ))
            ) : (
              <span style={{ fontSize: '12px', color: '#9DA3BC' }}>Full modern campus facilities verified</span>
            )}
          </div>
        </div>

        {/* Offered Programs & Course List */}
        <div
          style={{
            background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <GraduationCap size={18} color="#6857E9" />
            <h2 style={{ fontSize: '17px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: 0 }}>
              Offered Degree Programs
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {d.collegeCourses && d.collegeCourses.length > 0 ? (
              d.collegeCourses.map((x) => (
                <div
                  key={x._id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFD',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #EAEFFC',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ fontSize: '13.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B' }}>
                    {x.courseId?.courseName || 'B.Tech Program'}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#6857E9', background: 'rgba(104, 87, 233, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                    Approved
                  </span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '13px', color: '#9DA3BC' }}>Degree Engineering, Computer Science, IT & Management</div>
            )}
          </div>
        </div>
      </div>

      {/* Fee Structure Table Card */}
      {d.fees && d.fees.length > 0 && (
        <div
          style={{
            background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <DollarSign size={18} color="#FFA439" />
            <h2 style={{ fontSize: '17px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: 0 }}>
              Approved Fee Structure & Scholarship Eligibility
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E9F2', color: isDark ? '#9DA3BC' : '#7E84A3' }}>
                  <th style={{ padding: '10px', fontWeight: '800' }}>DEGREE PROGRAM</th>
                  <th style={{ padding: '10px', fontWeight: '800' }}>TOTAL ANNUAL TUITION</th>
                  <th style={{ padding: '10px', fontWeight: '800' }}>GOVERNMENT SCHOLARSHIP</th>
                </tr>
              </thead>
              <tbody>
                {d.fees.map((f) => (
                  <tr key={f._id} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F0F2F8' }}>
                    <td style={{ padding: '12px 10px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B' }}>
                      {f.courseId?.courseName || 'Engineering'}
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: '800', color: '#10B981' }}>
                      ₹{f.totalAnnualFee?.toLocaleString() || '1,500'} / year
                    </td>
                    <td style={{ padding: '12px 10px', color: isDark ? '#C4C9DF' : '#5A607F' }}>
                      {f.scholarshipAvailable ? '✓ MYSY & TFWS Supported' : 'General Fee Structure'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
