import React, { useState } from 'react';
import { X, Globe, MapPin, Building, Award, TrendingUp, DollarSign, Check, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const CollegeDetailModal = ({ isOpen, onClose, college, onSaveCollege, isSaved }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !college) return null;

  const handleClose = () => {
    playSound('pop');
    onClose();
  };

  return (
    <div className="re-modal-backdrop" onClick={handleClose}>
      <div className="re-modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <button className="re-modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Top College Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124, 109, 175, 0.18) 0%, rgba(255, 164, 57, 0.15) 100%)',
          border: '1px solid var(--re-border-medium)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--re-accent-purple)', color: '#FFF', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', marginBottom: '8px' }}>
                <span>{college.collegeType || 'Accredited University'}</span>
                <span>•</span>
                <span>⭐ {college.collegeRating || '4.6'}/5.0</span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px', color: 'var(--re-text-primary)', lineHeight: 1.25 }}>
                {college.name}
              </h3>
              <div style={{ fontSize: '12.5px', color: 'var(--re-text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="var(--re-accent-purple)" /> {college.city || 'Gujarat'}, {college.state || 'India'}
                </span>
                {college.campusSize && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building size={13} color="var(--re-accent-purple)" /> Campus: {college.campusSize}
                  </span>
                )}
                {college.establishedYear && (
                  <span>Est. {college.establishedYear}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  playSound('pop');
                  if (onSaveCollege) onSaveCollege(college);
                }}
                style={{
                  background: isSaved ? 'var(--re-accent-pink)' : '#FFFFFF',
                  color: isSaved ? '#FFFFFF' : 'var(--re-text-primary)',
                  border: '1.5px solid var(--re-border-medium)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
                title={isSaved ? 'College Saved' : 'Save to My List'}
              >
                <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--re-border-subtle)', paddingBottom: '10px', marginBottom: '18px' }}>
          {['overview', 'placements', 'courses_fees', 'facilities'].map((t) => (
            <button
              key={t}
              onClick={() => {
                playSound('tap');
                setActiveTab(t);
              }}
              style={{
                background: activeTab === t ? 'var(--re-accent-purple)' : 'transparent',
                color: activeTab === t ? '#FFFFFF' : 'var(--re-text-secondary)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {t.replace('_', ' & ')}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '13.5px', color: 'var(--re-text-secondary)', lineHeight: 1.55, margin: 0 }}>
              {college.description ||
                'Premier higher education institution accredited for technological and management research, modern laboratory infrastructure, faculty excellence, and outstanding placement metrics.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{ background: 'var(--re-bg-surface-subtle)', border: '1px solid var(--re-border-subtle)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--re-text-muted)', fontWeight: 600 }}>MIN ELIGIBILITY</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--re-text-primary)' }}>{college.eligibilityPercentage || 65}%</div>
              </div>

              <div style={{ background: 'var(--re-bg-surface-subtle)', border: '1px solid var(--re-border-subtle)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--re-text-muted)', fontWeight: 600 }}>AVG PACKAGE</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFA439' }}>{college.avgPackage || '₹12.5 LPA'}</div>
              </div>

              <div style={{ background: 'var(--re-bg-surface-subtle)', border: '1px solid var(--re-border-subtle)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--re-text-muted)', fontWeight: 600 }}>CAMPUS SIZE</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#35C7B8' }}>{college.campusSize || '50+ Acres'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Placements */}
        {activeTab === 'placements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1F1836, #2D2350)', color: '#FFF', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>PLACEMENT RECORD</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#35C7B8' }}>{college.placementRate || '96.4%'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>AVERAGE CTC</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFA439' }}>{college.avgPackage || '₹14.2 LPA'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>HIGHEST CTC</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#FF7597' }}>{college.highestPackage || '₹52 LPA'}</div>
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.8)' }}>
                <strong>Key Recruiting Organizations:</strong> Google, Microsoft, Amazon, Morgan Stanley, Oracle, Goldman Sachs, TCS, Infosys, L&T, Adani.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Courses & Fees */}
        {activeTab === 'courses_fees' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'B.Tech Computer Science & Engineering', dur: '4 Years', fee: '₹1.8L - ₹2.5L / yr' },
              { name: 'B.Tech Information & Communication Tech', dur: '4 Years', fee: '₹1.8L - ₹2.5L / yr' },
              { name: 'Master of Computer Applications (MCA)', dur: '2 Years', fee: '₹1.2L - ₹1.8L / yr' },
              { name: 'Master of Business Administration (MBA)', dur: '2 Years', fee: '₹1.5L - ₹3.0L / yr' }
            ].map((c, i) => (
              <div key={i} style={{ background: 'var(--re-bg-surface-subtle)', border: '1px solid var(--re-border-subtle)', borderRadius: '12px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--re-text-primary)' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--re-text-muted)' }}>Duration: {c.dur} • Full Time</div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--re-accent-purple)' }}>{c.fee}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Facilities */}
        {activeTab === 'facilities' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {['Separate AC Boys & Girls Hostels', 'High-Speed 1Gbps WiFi Campus', 'Central Digital Library (50K+ Books)', 'Modern Robotics & AI Labs', 'Multi-Sport Olympic Grounds', '24x7 Medical Health Center', 'Dedicated Career Placement Cell', 'Air-Conditioned Auditoriums'].map((f, i) => (
              <div key={i} style={{ background: 'var(--re-bg-surface-subtle)', border: '1px solid var(--re-border-subtle)', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--re-text-primary)' }}>
                <Check size={14} color="#35C7B8" strokeWidth={3} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Action Footer */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--re-border-subtle)' }}>
          {college.website && (
            <a
              href={college.website}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--re-radius-pill)',
                border: '1.5px solid var(--re-border-medium)',
                background: 'transparent',
                color: 'var(--re-text-primary)',
                fontWeight: 700,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <Globe size={15} /> Visit Official Portal
            </a>
          )}

          <button
            style={{ flex: 2 }}
            className="re-btn-primary"
            onClick={() => {
              handleClose();
            }}
          >
            Schedule Admission Counseling 🎓
          </button>
        </div>
      </div>
    </div>
  );
};
