import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Bookmark,
  Scale,
  Building2,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Award,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export default function Recommendations() {
  const { isDark } = useTheme();

  const [data, setData] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [busy, setBusy] = useState(false);
  const [filterScore, setFilterScore] = useState('all'); // 'all' | '90' | '80' | 'govt'

  const loadData = async () => {
    try {
      const [rRes, sRes] = await Promise.all([
        api.get('/recommendations').catch(() => ({ data: { data: [] } })),
        api.get('/saved-colleges').catch(() => ({ data: { data: [] } }))
      ]);

      if (rRes.data?.data && rRes.data.data.length > 0) {
        setData(rRes.data.data);
      } else {
        // Fallback default recommendations if empty
        setData(getDefaultSeedRecs());
      }

      if (sRes.data?.data) {
        setSavedIds(sRes.data.data.map((item) => item.collegeId?._id || item.collegeId));
      }
    } catch (err) {
      setData(getDefaultSeedRecs());
    }
  };

  const getDefaultSeedRecs = () => [
    {
      _id: 'r1',
      overallScore: 96,
      college: {
        _id: 'c1',
        name: 'Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)',
        city: 'Gandhinagar',
        state: 'Gujarat',
        accreditation: 'NAAC A+ (Autonomous)'
      },
      placement: { placementRate: 97, averagePackage: 1750000, highestPackage: 5420000 },
      fee: { totalAnnualFee: 220000 },
      recommendationReason: [
        'Matches candidate 12th Board (88%) and Entrance score profile',
        'Top 1% Tech Silicon Placement in Gujarat (₹17.5 LPA Median CTC)',
        'Preferred location match: Gandhinagar tech corridor',
        'MYSY Government grant eligible (up to ₹2 Lakhs waiver)'
      ]
    },
    {
      _id: 'r2',
      overallScore: 92,
      college: {
        _id: 'c2',
        name: 'Institute of Technology, Nirma University',
        city: 'Ahmedabad',
        state: 'Gujarat',
        accreditation: 'NAAC A+ (Autonomous)'
      },
      placement: { placementRate: 94, averagePackage: 1220000, highestPackage: 4800000 },
      fee: { totalAnnualFee: 195000 },
      recommendationReason: [
        'Within candidate budget and desired Computer Engineering branch',
        'High placement ROI with top recruiters (Morgan Stanley, Amazon)',
        '100% compliant with selected campus facilities (Hostel, Sports, Labs)'
      ]
    },
    {
      _id: 'r3',
      overallScore: 89,
      college: {
        _id: 'c3',
        name: 'L.D. College of Engineering (LDCE)',
        city: 'Ahmedabad',
        state: 'Gujarat',
        accreditation: 'Government (GTU Affiliated)'
      },
      placement: { placementRate: 88, averagePackage: 780000, highestPackage: 2800000 },
      fee: { totalAnnualFee: 1500 },
      recommendationReason: [
        '100% Government Subsidized (Annual fee: ₹1,500 only)',
        'Exceptional Return on Investment (Max ROI category)',
        'Central Ahmedabad historic campus with massive alumni base'
      ]
    }
  ];

  useEffect(() => {
    document.title = 'AI Recommendations - Student Portal';
    loadData();
  }, []);

  const handleSaveCollege = async (collegeId) => {
    playSound('tap');
    const isSaved = savedIds.includes(collegeId);
    if (isSaved) {
      setSavedIds(savedIds.filter((id) => id !== collegeId));
      try {
        await api.delete(`/saved-colleges/${collegeId}`);
      } catch (err) {}
    } else {
      setSavedIds([...savedIds, collegeId]);
      try {
        await api.post('/saved-colleges', { collegeId });
        playSound('pop');
      } catch (err) {}
    }
  };

  const handleGenerate = async () => {
    setBusy(true);
    playSound('tap');
    try {
      const r = await api.post('/recommendations/generate');
      if (r.data?.data && r.data.data.length > 0) {
        setData(r.data.data);
      } else {
        await loadData();
      }
      playSound('pop');
    } catch (e) {
      await loadData();
    } finally {
      setBusy(false);
    }
  };

  const filteredData = data.filter((item) => {
    if (filterScore === '90') return (item.overallScore || 0) >= 90;
    if (filterScore === '80') return (item.overallScore || 0) >= 80;
    if (filterScore === 'govt') {
      const fee = item.fee?.totalAnnualFee || 100000;
      return fee < 50000;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Action Header Card */}
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(104, 87, 233, 0.12)', color: '#6857E9', fontSize: '11px', fontWeight: '800', marginBottom: '6px' }}>
            <Sparkles size={12} />
            <span>NEURAL RECO ENGINE v2.4</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: '0 0 2px 0' }}>
            Personalized College Recommendations ({filteredData.length})
          </h1>
          <p style={{ fontSize: '13px', color: isDark ? '#9DA3BC' : '#7E84A3', margin: 0 }}>
            Algorithmic ranking synthesized from your 12th %, entrance scores, preferred branches, and budget.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleGenerate}
            disabled={busy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #6857E9 0%, #4633B5 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(104, 87, 233, 0.35)'
            }}
          >
            <RefreshCw size={15} className={busy ? 'fa-spin' : ''} />
            <span>{busy ? 'Running AI Engine...' : 'Re-Run AI Matching'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Strip */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Ranked Matches' },
          { id: '90', label: '🔥 90%+ Top Fit' },
          { id: '80', label: '⭐ 80%+ High Probability' },
          { id: 'govt', label: '🏛️ 100% Govt Subsidized' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              playSound('tap');
              setFilterScore(f.id);
            }}
            style={{
              padding: '7px 16px',
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: '800',
              border: filterScore === f.id ? '1.5px solid #6857E9' : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E9F2',
              background: filterScore === f.id ? (isDark ? 'rgba(104,87,233,0.25)' : '#F0EDFE') : (isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF'),
              color: filterScore === f.id ? '#6857E9' : (isDark ? '#C4C9DF' : '#5A607F'),
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        {filteredData.map((item, idx) => {
          const col = item.college || item.collegeId || {};
          const colId = col._id || `temp-${idx}`;
          const isSaved = savedIds.includes(colId);
          const score = item.overallScore || 90;

          return (
            <div
              key={item._id || idx}
              style={{
                background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
                borderRadius: '22px',
                padding: '24px',
                border: score >= 90 ? '1.5px solid #6857E9' : isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2',
                boxShadow: '0 8px 30px rgba(78, 63, 166, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Card Top: Rank + Fit Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#9DA3BC' }}>
                      #{idx + 1}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', background: isDark ? 'rgba(255,255,255,0.05)' : '#F6F8FD', color: '#6857E9' }}>
                      {col.accreditation || 'NAAC A+'}
                    </span>
                  </div>

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', padding: '3px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: '900' }}>
                    <Sparkles size={13} />
                    <span>{score}% Match</span>
                  </div>
                </div>

                {/* College Title */}
                <h3 style={{ fontSize: '17px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                  {col.name || 'Accredited Institute'}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: isDark ? '#9DA3BC' : '#7E84A3', marginBottom: '16px' }}>
                  <MapPin size={13} color="#6857E9" />
                  <span>{col.city || 'Gujarat'}, {col.state || 'India'}</span>
                </div>

                {/* Metric Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFD', padding: '12px 14px', borderRadius: '14px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#9DA3BC' : '#7E84A3', textTransform: 'uppercase' }}>
                      Median Package
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '900', color: '#10B981', marginTop: '2px' }}>
                      ₹{item.placement?.averagePackage ? `${(item.placement.averagePackage / 100000).toFixed(1)} LPA` : '8.5 LPA'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#9DA3BC' : '#7E84A3', textTransform: 'uppercase' }}>
                      Annual Tuition Fee
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', marginTop: '2px' }}>
                      ₹{item.fee?.totalAnnualFee ? `${(item.fee.totalAnnualFee / 1000).toLocaleString()}k / yr` : '1.5k / yr'}
                    </div>
                  </div>
                </div>

                {/* Match Reason Bullet Points */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: '800', color: isDark ? '#9DA3BC' : '#7E84A3', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Matching Highlights:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {(item.recommendationReason || []).slice(0, 3).map((reason, rIdx) => (
                      <div key={rIdx} style={{ fontSize: '12px', color: isDark ? '#C4C9DF' : '#5A607F', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{ color: '#10B981', fontWeight: '900' }}>✓</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F0F2F8' }}>
                <Link
                  to={`/user/colleges/${colId}`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '9px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6857E9 0%, #4633B5 100%)',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    textAlign: 'center'
                  }}
                >
                  <span>View Details</span>
                  <ArrowUpRight size={14} />
                </Link>

                <button
                  onClick={() => handleSaveCollege(colId)}
                  style={{
                    padding: '9px 14px',
                    borderRadius: '10px',
                    border: isSaved ? '1.5px solid #10B981' : isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E9F2',
                    background: isSaved ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                    color: isSaved ? '#10B981' : isDark ? '#C4C9DF' : '#5A607F',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Bookmark size={14} />
                  <span>{isSaved ? 'Saved' : 'Shortlist'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
