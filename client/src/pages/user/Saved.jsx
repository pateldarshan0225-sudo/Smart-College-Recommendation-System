import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Bookmark, MapPin, Building2, Trash2, ArrowUpRight, Scale, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

export default function Saved() {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    try {
      setLoading(true);
      const res = await api.get('/saved-colleges');
      setData(res.data?.data || []);
    } catch (err) {
      console.log('Error loading saved colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Saved Shortlist - Student Portal';
    loadSaved();
  }, []);

  const handleRemove = async (collegeId) => {
    playSound('tap');
    try {
      await api.delete(`/saved-colleges/${collegeId}`);
      setData(data.filter((item) => (item.collegeId?._id || item.collegeId) !== collegeId));
      playSound('pop');
    } catch (err) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div
        style={{
          background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
          borderRadius: '24px',
          padding: '24px 28px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(78, 63, 166, 0.05)'
        }}
      >
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: '0 0 4px 0' }}>
            My Shortlisted Colleges ({data.length})
          </h1>
          <p style={{ fontSize: '13px', color: isDark ? '#9DA3BC' : '#7E84A3', margin: 0 }}>
            Colleges bookmarked for your ACPC 2024 counseling choice filling strategy.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/user/compare"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '999px',
              background: 'rgba(104, 87, 233, 0.12)',
              color: '#6857E9',
              fontSize: '13px',
              fontWeight: '800',
              textDecoration: 'none'
            }}
          >
            <Scale size={15} />
            <span>Compare Shortlist</span>
          </Link>

          <Link
            to="/colleges"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #6857E9 0%, #4633B5 100%)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '800',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(104, 87, 233, 0.3)'
            }}
          >
            <Building2 size={15} />
            <span>Explore More Colleges</span>
          </Link>
        </div>
      </div>

      {/* Grid of Saved Colleges */}
      {data.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {data.map((item) => {
            const col = item.collegeId || {};
            const colId = col._id;

            return (
              <div
                key={item._id}
                style={{
                  background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
                  borderRadius: '20px',
                  padding: '22px',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2',
                  boxShadow: '0 4px 20px rgba(78, 63, 166, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', background: isDark ? 'rgba(255,255,255,0.05)' : '#F6F8FD', color: '#6857E9' }}>
                      {col.collegeType || col.accreditation || 'Accredited'}
                    </span>
                    <button
                      onClick={() => handleRemove(colId)}
                      style={{ background: 'none', border: 'none', color: '#FF4472', cursor: 'pointer', padding: '4px' }}
                      title="Remove from shortlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {col.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isDark ? '#9DA3BC' : '#7E84A3', marginBottom: '14px' }}>
                    <MapPin size={13} color="#6857E9" />
                    <span>{col.city || 'Gujarat'}, {col.state || 'India'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFD', borderRadius: '12px', marginBottom: '16px', fontSize: '12px' }}>
                    <div>
                      <div style={{ color: isDark ? '#9DA3BC' : '#7E84A3', fontWeight: '700' }}>Rating</div>
                      <div style={{ fontWeight: '900', color: '#FFA439', marginTop: '2px' }}>★ {col.collegeRating || '4.6'} / 5</div>
                    </div>
                    <div>
                      <div style={{ color: isDark ? '#9DA3BC' : '#7E84A3', fontWeight: '700' }}>Eligibility</div>
                      <div style={{ fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', marginTop: '2px' }}>{col.eligibilityPercentage || 50}%</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    to={`/user/colleges/${colId}`}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px',
                      borderRadius: '10px',
                      background: isDark ? 'rgba(255,255,255,0.08)' : '#F0EDFE',
                      color: '#6857E9',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      textDecoration: 'none'
                    }}
                  >
                    <span>View Profile</span>
                    <ArrowUpRight size={13} />
                  </Link>

                  <button
                    onClick={() => handleRemove(colId)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 68, 114, 0.25)',
                      background: 'rgba(255, 68, 114, 0.08)',
                      color: '#FF4472',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
            borderRadius: '24px',
            padding: '48px 24px',
            textAlign: 'center',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2'
          }}
        >
          <Bookmark size={40} color="#6857E9" style={{ marginBottom: '12px', opacity: 0.8 }} />
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: '0 0 6px 0' }}>
            No Saved Colleges Yet
          </h2>
          <p style={{ fontSize: '13px', color: isDark ? '#9DA3BC' : '#7E84A3', maxWidth: '420px', margin: '0 auto 20px auto' }}>
            Bookmark universities from the College Directory or AI Recommendations to build your personalized counseling shortlist.
          </p>
          <Link
            to="/colleges"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 22px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #6857E9 0%, #4633B5 100%)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '800',
              textDecoration: 'none'
            }}
          >
            <Building2 size={15} />
            <span>Browse College Directory</span>
          </Link>
        </div>
      )}
    </div>
  );
}
