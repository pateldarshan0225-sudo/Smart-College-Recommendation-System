import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Building2,
  GraduationCap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  MoreHorizontal,
  MapPin,
  CheckSquare,
  Square,
  ChevronDown,
  Users,
  Compass,
  Briefcase,
  Layers,
  Award,
  RefreshCw,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #FF6584 0%, #FF4D79 100%)',
  'linear-gradient(135deg, #6C5CE7 0%, #5E4EE3 100%)',
  'linear-gradient(135deg, #00D084 0%, #059669 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
  'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)'
];

function formatTimeAgo(dateString) {
  if (!dateString) return 'recently';
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getInitials(name) {
  if (!name) return 'ST';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function Dashboard() {
  const [dbData, setDbData] = useState({
    counts: {},
    placementStats: { avgLPA: '8.7', maxLPA: '52.0', avgPlacementRate: 85, totalDrives: 12 },
    collegesStats: { total: 12, active: 12, avgRating: 4.4 },
    facilitiesStats: { totalAudited: 12 },
    liveColleges: [],
    activities: [],
    onlineUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('Apr');
  const [period, setPeriod] = useState('Monthly');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('activities'); // 'activities' or 'online'
  const [checkedItems, setCheckedItems] = useState({ '0': true, '3': true });
  const [activeCollegePin, setActiveCollegePin] = useState(null);
  const nav = useNavigate();

  const fetchDashboardData = () => {
    setLoading(true);
    api.get('/admin/dashboard')
      .then(res => {
        const raw = res.data.data || {};
        const counts = raw.counts || raw;
        setDbData({
          counts,
          placementStats: raw.placementStats || {
            avgLPA: '8.7',
            maxLPA: '52.0',
            avgPlacementRate: 85,
            totalDrives: counts.college_placements || 12
          },
          collegesStats: raw.collegesStats || {
            total: counts.colleges || 12,
            active: counts.colleges || 12,
            avgRating: 4.4
          },
          facilitiesStats: raw.facilitiesStats || {
            totalAudited: counts.campus_facilities || 12
          },
          liveColleges: raw.liveColleges || [],
          activities: raw.activities || [],
          onlineUsers: raw.onlineUsers || []
        });
      })
      .catch(err => {
        console.error('Failed to load dynamic admin data', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const { counts, placementStats, collegesStats, liveColleges, activities, onlineUsers } = dbData;

  const totalColleges = counts.colleges || 12;
  const totalCourses = counts.courses || 10;
  const totalUsers = counts.users || 9;
  const totalRecommendations = counts.recommendations || 21;
  const totalPlacements = counts.college_placements || 12;
  const totalFacilities = counts.campus_facilities || 12;

  const displayPeakMatches = totalRecommendations > 0 ? totalRecommendations : 21;
  const displayTargetGoal = Math.max(displayPeakMatches + 74, totalUsers * 10 + 5);

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Silky smooth cubic bezier curves for each month matching the uploaded reference aesthetic
  const monthWavePresets = {
    Jan: {
      path: "M 0 45 C 50 20, 100 20, 140 45 C 220 80, 300 70, 380 55 C 460 40, 540 70, 620 60 C 700 50, 750 65, 780 70",
      peakX: 75,
      peakY: 20,
      pillarLeft: '8%',
      val: Math.max(1, Math.round(displayPeakMatches * 0.45))
    },
    Feb: {
      path: "M 0 65 C 60 65, 100 22, 160 22 C 220 22, 280 75, 360 60 C 440 45, 520 65, 600 55 C 680 45, 740 68, 780 70",
      peakX: 160,
      peakY: 22,
      pillarLeft: '18%',
      val: Math.max(2, Math.round(displayPeakMatches * 0.65))
    },
    Mar: {
      path: "M 0 70 C 60 70, 140 78, 200 60 C 240 45, 270 20, 310 20 C 370 20, 440 75, 520 60 C 600 45, 680 65, 780 70",
      peakX: 310,
      peakY: 20,
      pillarLeft: '28%',
      val: Math.max(3, Math.round(displayPeakMatches * 0.85))
    },
    Apr: {
      path: "M 0 72 C 70 72, 140 82, 210 70 C 280 56, 330 22, 380 22 C 430 22, 480 62, 540 68 C 600 74, 640 44, 700 48 C 730 50, 760 66, 780 68",
      peakX: 380,
      peakY: 22,
      pillarLeft: '38%',
      val: displayPeakMatches
    },
    May: {
      path: "M 0 70 C 80 70, 160 65, 240 75 C 320 85, 380 20, 450 20 C 520 20, 580 65, 640 55 C 700 45, 750 65, 780 68",
      peakX: 450,
      peakY: 20,
      pillarLeft: '48%',
      val: Math.max(4, Math.round(displayPeakMatches * 1.15))
    },
    Jun: {
      path: "M 0 68 C 80 68, 160 75, 240 65 C 320 55, 420 75, 480 55 C 510 40, 540 20, 580 20 C 640 20, 710 65, 780 68",
      peakX: 580,
      peakY: 20,
      pillarLeft: '58%',
      val: Math.max(5, Math.round(displayPeakMatches * 1.3))
    },
    Jul: {
      path: "M 0 70 C 100 70, 200 65, 300 75 C 400 85, 500 65, 580 50 C 620 30, 650 18, 680 18 C 720 18, 750 55, 780 68",
      peakX: 680,
      peakY: 18,
      pillarLeft: '68%',
      val: Math.max(6, Math.round(displayPeakMatches * 1.5))
    },
    Aug: {
      path: "M 0 72 C 80 72, 160 80, 240 68 C 320 56, 360 22, 420 22 C 480 22, 540 65, 600 68 C 660 72, 720 50, 780 65",
      peakX: 420,
      peakY: 22,
      pillarLeft: '78%',
      val: Math.max(4, Math.round(displayPeakMatches * 1.2))
    },
    Sep: {
      path: "M 0 70 C 80 70, 160 75, 250 65 C 340 55, 420 70, 500 55 C 550 40, 580 22, 620 22 C 680 22, 730 65, 780 68",
      peakX: 620,
      peakY: 22,
      pillarLeft: '88%',
      val: Math.max(5, Math.round(displayPeakMatches * 1.25))
    },
    Oct: {
      path: "M 0 72 C 70 72, 140 80, 220 68 C 300 56, 360 22, 410 22 C 470 22, 530 65, 600 70 C 670 75, 730 48, 780 66",
      peakX: 410,
      peakY: 22,
      pillarLeft: '95%',
      val: Math.max(6, Math.round(displayPeakMatches * 1.35))
    }
  };

  const currentWave = monthWavePresets[selectedMonth] || monthWavePresets.Apr;
  const waveArea = `${currentWave.path} L 780 130 L 0 130 Z`;

  // Fallback realistic activities
  const displayActivities = activities.length > 0 ? activities : [
    {
      id: 'demo-1',
      name: 'Diya Shah',
      action: 'Generated match for Nirma University - Institute of Technology',
      time: new Date(Date.now() - 1560000).toISOString(),
      type: 'recommendation'
    },
    {
      id: 'demo-2',
      name: 'Aarav Patel',
      action: 'Generated match for DA-IICT Gandhinagar',
      time: new Date(Date.now() - 3600000).toISOString(),
      type: 'recommendation'
    },
    {
      id: 'demo-3',
      name: 'Rohan Sharma',
      action: 'Shortlisted SVNIT Surat Computer Engineering',
      time: new Date(Date.now() - 5400000).toISOString(),
      type: 'saved'
    },
    {
      id: 'demo-4',
      name: 'Priya Mehta',
      action: 'Updated 12th Academic & GUJCET Percentiles',
      time: new Date(Date.now() - 7200000).toISOString(),
      type: 'user'
    }
  ];

  return (
    <div className="admin-dashboard-grid">
      {/* LEFT COLUMN: HERO, FEATURE CARDS & 3 NEO CARDS */}
      <div className="admin-left-col">
        {/* TOP SPLIT: HERO CARD + 2 FEATURE WIDGETS */}
        <div className="admin-top-split">
          {/* HERO CARD (PURPLE GRADIENT WITH SMOOTH WAVE) */}
          <div className="admin-hero-card">
            {/* Background Frosted Pillar Connecting Active Month to Stat Tray */}
            <div
              className="admin-hero-pillar"
              style={{ left: currentWave.pillarLeft }}
            />

            {/* Header */}
            <div className="admin-hero-header">
              <div className="d-flex align-items-center gap-2">
                <span className="admin-hero-title">Overview</span>
                <button
                  type="button"
                  onClick={fetchDashboardData}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.75)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Refresh live metrics"
                >
                  <RefreshCw size={13} className={loading ? 'fa-spin' : ''} />
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="admin-hero-pill-select"
                  onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                >
                  <span>{period}</span>
                  <ChevronDown size={14} />
                </button>
                {showPeriodDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '110%',
                      background: 'var(--adm-white, #FFFFFF)',
                      border: '1px solid var(--adm-border-soft, #E5E9F2)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      padding: '6px',
                      zIndex: 20,
                      minWidth: '100px'
                    }}
                  >
                    {['Weekly', 'Monthly', 'Yearly'].map(p => (
                      <div
                        key={p}
                        onClick={() => { setPeriod(p); setShowPeriodDropdown(false); }}
                        style={{
                          padding: '6px 12px',
                          fontSize: '11px',
                          color: 'var(--adm-text-dark, #1E1B4B)',
                          fontWeight: '600',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--adm-purple-soft, #F0EDFE)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Glowing Wave Chart */}
            <div className="admin-wave-chart-wrap">
              <svg className="admin-wave-svg" viewBox="0 0 780 130" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="heroWaveGradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5E89" stopOpacity="0.35" />
                    <stop offset="70%" stopColor="#FF5E89" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#FF5E89" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="heroGlowEffect" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#FF5E89" floodOpacity="0.8" />
                  </filter>
                </defs>

                {/* Gradient area under the curve */}
                <path d={waveArea} fill="url(#heroWaveGradientFill)" />

                {/* Glowing pink wave line */}
                <path
                  d={currentWave.path}
                  fill="none"
                  stroke="#FF5E89"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#heroGlowEffect)"
                />

                {/* Concentric Highlight Marker on Peak */}
                <circle cx={currentWave.peakX} cy={currentWave.peakY} r="7" fill="#FF5E89" stroke="#FFFFFF" strokeWidth="3" />
                <circle cx={currentWave.peakX} cy={currentWave.peakY} r="14" fill="none" stroke="#FF5E89" strokeWidth="1.5" opacity="0.6">
                  <animate attributeName="r" values="7;18;7" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
                </circle>
              </svg>

              {/* Frosted Floating Tooltip Badge on Peak */}
              <div
                className="admin-chart-tooltip-badge"
                style={{ left: `${(currentWave.peakX / 780) * 100}%` }}
              >
                <span className="val">{currentWave.val.toLocaleString()}</span>
                <span className="lbl">Matches</span>
              </div>
            </div>

            {/* Month Timeline Pills */}
            <div className="admin-months-row">
              {MONTHS.map(m => (
                <div
                  key={m}
                  className={`admin-month-item ${selectedMonth === m ? 'active' : ''}`}
                  onClick={() => setSelectedMonth(m)}
                >
                  {m}
                </div>
              ))}
            </div>

            {/* Hero Frosted Glass Stats Tray */}
            <div className="admin-hero-tray">
              <div className="admin-hero-stat-col" onClick={() => nav('/admin/colleges')} style={{ cursor: 'pointer' }}>
                <small>Total Colleges</small>
                <div className="stat-val">{totalColleges.toLocaleString()}</div>
                <span className="stat-sub">{collegesStats.active || totalColleges} Verified</span>
              </div>

              <div className="admin-hero-stat-col highlight-center" onClick={() => nav('/admin/recommendations')} style={{ cursor: 'pointer' }}>
                <small>AI Match Engine</small>
                <div className="stat-val">{displayPeakMatches.toLocaleString()} St</div>
                <span className="stat-sub">Active {selectedMonth}</span>
              </div>

              <div className="admin-hero-stat-col" onClick={() => nav('/admin/users')} style={{ cursor: 'pointer' }}>
                <small>Target Intake</small>
                <div className="stat-val">{displayTargetGoal.toLocaleString()} St</div>
                <span className="stat-sub">Annual Goal</span>
              </div>
            </div>
          </div>

          {/* TWO SIDE FEATURE CARDS */}
          <div className="admin-feature-cards">
            {/* Card 1: Violet System Card */}
            <div className="admin-card-violet" onClick={() => nav('/admin/colleges')}>
              <div className="admin-frosted-squircle">
                <GraduationCap size={24} />
              </div>
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ fontSize: '16px', fontWeight: '800', lineHeight: '1.2' }}>
                  Colleges Directory
                </div>
                <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px' }}>
                  {totalColleges} Universities • {totalCourses} Courses
                </div>
              </div>
            </div>

            {/* Card 2: Radiant Pink Inquiries Card with Decorative Wave */}
            <div className="admin-card-pink" onClick={() => nav('/admin/student_profiles')}>
              {/* Subtle decorative bottom wave */}
              <svg
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  width: '100%',
                  height: '65px',
                  opacity: 0.18,
                  pointerEvents: 'none'
                }}
                viewBox="0 0 300 65"
                preserveAspectRatio="none"
              >
                <path d="M 0 35 Q 80 5 160 30 T 300 15 L 300 65 L 0 65 Z" fill="#FFFFFF" />
              </svg>

              <div className="d-flex align-items-center gap-3" style={{ position: 'relative', zIndex: 2 }}>
                <div className="admin-frosted-squircle">
                  <Sparkles size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800' }}>Student Inquiries</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Verification Queue</div>
                </div>
              </div>

              <div className="d-flex align-items-end justify-content-between mt-3" style={{ position: 'relative', zIndex: 2 }}>
                <div>
                  <small style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85, display: 'block' }}>
                    Active Accounts
                  </small>
                  <div style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.1' }}>
                    {totalUsers} Users
                  </div>
                  <small style={{ fontSize: '11px', opacity: 0.9 }}>
                    {counts.student_profiles || totalUsers} Profiles Synced
                  </small>
                </div>

                <div className="admin-pink-card-arrow">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: 3 WHITE NEO-CARDS */}
        <div className="admin-bottom-neo-row">
          {/* Neo-Card 1: Colleges & Programs */}
          <div className="admin-neo-card" onClick={() => nav('/admin/colleges')}>
            <div className="admin-neo-card-top">
              <div className="admin-purple-squircle">
                <Building2 size={22} />
              </div>
              <div className="admin-neo-dots">
                <MoreHorizontal size={18} />
              </div>
            </div>

            <div className="admin-neo-title">Colleges Hub</div>
            <div className="admin-neo-sub">{totalColleges} Campuses • {totalCourses} Degrees</div>

            <div className="admin-progress-header">
              <span>Verification</span>
              <span style={{ color: '#10B981', fontWeight: '800' }}>
                {totalColleges > 0 ? Math.round(((collegesStats.active || totalColleges) / totalColleges) * 100) : 100}%
              </span>
            </div>
            <div className="admin-progress-track">
              <div
                className="admin-progress-fill"
                style={{
                  width: `${totalColleges > 0 ? Math.round(((collegesStats.active || totalColleges) / totalColleges) * 100) : 100}%`
                }}
              />
            </div>

            <div className="admin-neo-footer-pills">
              <span className="admin-stat-pill">
                {collegesStats.active || totalColleges} / {totalColleges} verified
              </span>
              <span className="admin-status-pill-pink">★ {collegesStats.avgRating || '4.4'} Rating</span>
            </div>
          </div>

          {/* Neo-Card 2: Placements & Packages */}
          <div className="admin-neo-card" onClick={() => nav('/admin/college_placements')}>
            <div className="admin-neo-card-top">
              <div className="admin-purple-squircle">
                <TrendingUp size={22} />
              </div>
              <div className="admin-neo-dots">
                <MoreHorizontal size={18} />
              </div>
            </div>

            <div className="admin-neo-title">Placement Drives</div>
            <div className="admin-neo-sub">
              {placementStats.totalDrives || totalPlacements} Drives Recorded
            </div>

            <div className="admin-progress-header">
              <span>Placement Rate</span>
              <span style={{ color: '#10B981', fontWeight: '800' }}>
                {placementStats.avgPlacementRate || 85}%
              </span>
            </div>
            <div className="admin-progress-track">
              <div
                className="admin-progress-fill"
                style={{ width: `${Math.min(placementStats.avgPlacementRate || 85, 100)}%` }}
              />
            </div>

            <div className="admin-neo-footer-pills">
              <span className="admin-stat-pill">Avg: ₹{placementStats.avgLPA} LPA</span>
              <span className="admin-status-pill-pink">Max: ₹{placementStats.maxLPA} LPA</span>
            </div>
          </div>

          {/* Neo-Card 3: Campus & Facilities */}
          <div className="admin-neo-card" onClick={() => nav('/admin/campus_facilities')}>
            <div className="admin-neo-card-top">
              <div className="admin-purple-squircle">
                <ShieldCheck size={22} />
              </div>
              <div className="admin-neo-dots">
                <MoreHorizontal size={18} />
              </div>
            </div>

            <div className="admin-neo-title">Campus Standards</div>
            <div className="admin-neo-sub">{totalFacilities} Infrastructure Audits</div>

            <div className="admin-progress-header">
              <span>Audit Coverage</span>
              <span style={{ color: '#10B981', fontWeight: '800' }}>
                {totalColleges > 0 ? Math.min(Math.round((totalFacilities / totalColleges) * 100), 100) : 100}%
              </span>
            </div>
            <div className="admin-progress-track">
              <div
                className="admin-progress-fill"
                style={{
                  width: `${totalColleges > 0 ? Math.min(Math.round((totalFacilities / totalColleges) * 100), 100) : 100}%`
                }}
              />
            </div>

            <div className="admin-neo-footer-pills">
              <span className="admin-stat-pill">
                {totalFacilities} / {totalColleges} Audited
              </span>
              <span className="admin-status-pill-pink">Verified Standards</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: FRIENDS / ACTIVITIES & LIVE MAP */}
      <div className="admin-right-col">
        {/* Header */}
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <Users size={18} color="#6C5CE7" />
            <span>Community</span>
          </div>
          <span className="admin-view-all-link" onClick={() => nav('/admin/users')}>
            View All ({totalUsers})
          </span>
        </div>

        {/* Tab Pills */}
        <div className="admin-tab-segmented">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            Activities
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'online' ? 'active' : ''}`}
            onClick={() => setActiveTab('online')}
          >
            Online ({onlineUsers.length || 5})
          </button>
        </div>

        {/* List Items */}
        <div className="admin-activity-list">
          {activeTab === 'activities' ? (
            displayActivities.map((item, idx) => (
              <div key={item.id || idx} className="admin-activity-item">
                <div
                  className="admin-act-avatar"
                  style={{ background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length] }}
                >
                  {getInitials(item.name)}
                </div>
                <div className="admin-act-info">
                  <div className="admin-act-name">{item.name}</div>
                  <div className="admin-act-meta">{item.action}</div>
                  <div className="admin-act-time">{formatTimeAgo(item.time)}</div>
                </div>
                <button
                  type="button"
                  className="admin-act-action-btn"
                  onClick={() => toggleCheck(item.id || idx)}
                  title="Status check"
                >
                  {checkedItems[item.id || idx] ? (
                    <CheckSquare size={16} color="#6C5CE7" />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </div>
            ))
          ) : (
            (onlineUsers.length > 0 ? onlineUsers : [
              { name: 'Darshan', email: 'darshan@gmail.com', role: 'admin' },
              { name: 'System Admin', email: 'admin@example.com', role: 'admin' },
              { name: 'Aarav Patel', email: 'aarav.patel@gmail.com', role: 'user' },
              { name: 'Diya Shah', email: 'diya.shah@gmail.com', role: 'user' },
              { name: 'Rohan Sharma', email: 'rohan.sharma@gmail.com', role: 'user' }
            ]).map((user, idx) => (
              <div key={user._id || idx} className="admin-activity-item">
                <div
                  className="admin-act-avatar"
                  style={{ background: AVATAR_GRADIENTS[(idx + 2) % AVATAR_GRADIENTS.length] }}
                >
                  {getInitials(user.name)}
                </div>
                <div className="admin-act-info">
                  <div className="admin-act-name">{user.name}</div>
                  <div className="admin-act-meta">{user.email}</div>
                  <div className="admin-act-time" style={{ color: '#10B981', fontWeight: '700' }}>
                    ● Online ({user.role})
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* LIVE MAP WIDGET */}
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-1" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--adm-text-dark, #1E1B4B)' }}>
              <MapPin size={16} color="#6C5CE7" />
              <span>Live map</span>
            </div>
            <span className="admin-view-all-link" onClick={() => nav('/admin/colleges')}>
              View ({totalColleges})
            </span>
          </div>

          <div className="admin-map-card">
            {/* Stylized vector map contours */}
            <svg className="admin-map-svg" viewBox="0 0 300 160" preserveAspectRatio="none">
              <rect width="300" height="160" fill="#F0F4FA" />
              {/* Secondary roads */}
              <path d="M 0 35 L 300 65 M 0 115 L 300 135 M 75 0 L 105 160 M 215 0 L 195 160" stroke="#FFFFFF" strokeWidth="6" />
              {/* Main arterial avenues */}
              <path d="M 0 85 Q 120 68 200 110 T 300 90" fill="none" stroke="#FFFFFF" strokeWidth="12" />
              <path d="M 140 0 C 130 60 170 90 160 160" fill="none" stroke="#FFFFFF" strokeWidth="10" />
              {/* Soft zoning blocks */}
              <rect x="25" y="10" width="40" height="25" rx="6" fill="#E4EBF7" />
              <rect x="120" y="18" width="70" height="35" rx="6" fill="#E4EBF7" />
              <rect x="220" y="15" width="55" height="40" rx="6" fill="#E4EBF7" />
              <rect x="35" y="95" width="50" height="35" rx="6" fill="#E4EBF7" />
              <rect x="225" y="100" width="55" height="35" rx="6" fill="#E4EBF7" />
            </svg>

            {/* Pins rendered dynamically from live database colleges */}
            {liveColleges.length > 0 ? (
              liveColleges.slice(0, 3).map((col, idx) => {
                const positions = [
                  { top: '35%', left: '26%' },
                  { top: '75%', left: '55%' },
                  { top: '38%', left: '82%' }
                ];
                const pos = positions[idx] || positions[0];
                return (
                  <div
                    key={col._id || idx}
                    style={{
                      position: 'absolute',
                      top: pos.top,
                      left: pos.left,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: 3
                    }}
                    onClick={() => setActiveCollegePin(activeCollegePin === col.name ? null : `${col.name} (${col.city}) ★ ${col.collegeRating}`)}
                    title={`${col.name} (${col.city})`}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: idx === 0 ? '#6C5CE7' : idx === 1 ? '#10B981' : '#F59E0B',
                        border: '2.5px solid #FFFFFF',
                        color: '#FFFFFF',
                        fontSize: '9px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      {getInitials(col.name)}
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div style={{ position: 'absolute', top: '35%', left: '26%', transform: 'translate(-50%, -50%)', zIndex: 3 }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#6C5CE7', border: '2px solid #FFFFFF', color: '#FFFFFF', fontSize: '9px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    DA
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '75%', left: '55%', transform: 'translate(-50%, -50%)', zIndex: 3 }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', border: '2px solid #FFFFFF', color: '#FFFFFF', fontSize: '9px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    SV
                  </div>
                </div>
              </>
            )}

            {/* Pulsing Radar Beacon (Pink) */}
            <div
              className="admin-radar-beacon"
              style={{ top: '48%', left: '76%', transform: 'translate(-50%, -50%)', zIndex: 2 }}
            >
              <div className="core" />
            </div>

            {/* Active College Tooltip Pill */}
            {activeCollegePin && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(30, 27, 75, 0.95)',
                  color: '#FFFFFF',
                  padding: '5px 12px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  zIndex: 10
                }}
              >
                {activeCollegePin}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
