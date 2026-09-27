import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ShieldCheck,
  Bookmark,
  Scale,
  Sliders,
  DollarSign,
  ArrowUpRight,
  Zap,
  Check
} from 'lucide-react';
import { playSound } from '../../utils/audio';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [academic, setAcademic] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [savedColleges, setSavedColleges] = useState([]);
  const [collegesList, setCollegesList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState('Apr');
  const [period, setPeriod] = useState('Monthly');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [activeCollegePin, setActiveCollegePin] = useState(null);
  const nav = useNavigate();

  // Load all live dynamic data from the backend APIs
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [pRes, aRes, rRes, sRes, cRes, crRes] = await Promise.all([
        api.get('/profile').catch(() => ({ data: { data: null } })),
        api.get('/academic').catch(() => ({ data: { data: null } })),
        api.get('/recommendations').catch(() => ({ data: { data: [] } })),
        api.get('/saved-colleges').catch(() => ({ data: { data: [] } })),
        api.get('/colleges').catch(() => ({ data: { data: [] } })),
        api.get('/courses').catch(() => ({ data: { data: [] } }))
      ]);

      setProfile(pRes.data?.data || null);
      setAcademic(aRes.data?.data || null);
      setRecommendations(rRes.data?.data || []);
      setSavedColleges(sRes.data?.data || []);
      setCollegesList(cRes.data?.data || []);
      setCoursesList(crRes.data?.data || []);
    } catch (err) {
      console.error('Error loading dynamic student dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Student Dashboard - Smart College';
    fetchDashboardData();
  }, []);

  // Trigger real recommendation engine calculation dynamically
  const handleGenerateRecommendations = async () => {
    setGenerating(true);
    playSound('tap');
    try {
      const res = await api.post('/recommendations/generate');
      if (res.data?.data && res.data.data.length > 0) {
        setRecommendations(res.data.data);
      } else {
        await fetchDashboardData();
      }
      playSound('pop');
    } catch (err) {
      console.error('Failed to run AI engine', err);
      await fetchDashboardData();
    } finally {
      setGenerating(false);
    }
  };

  // Toggle Shortlist / Saved College with instant optimistic update
  const handleToggleSave = async (collegeId) => {
    playSound('tap');
    const isSaved = savedColleges.some(
      (item) => (item.collegeId?._id || item.collegeId) === collegeId
    );

    if (isSaved) {
      setSavedColleges(
        savedColleges.filter(
          (item) => (item.collegeId?._id || item.collegeId) !== collegeId
        )
      );
      try {
        await api.delete(`/saved-colleges/${collegeId}`);
      } catch (err) {
        console.error('Failed to unsave college', err);
      }
    } else {
      const targetCollege = collegesList.find((c) => c._id === collegeId) || { _id: collegeId };
      setSavedColleges([...savedColleges, { _id: `temp-${Date.now()}`, collegeId: targetCollege }]);
      try {
        await api.post('/saved-colleges', { collegeId });
        playSound('pop');
      } catch (err) {
        console.error('Failed to save college', err);
      }
    }
  };

  // Dynamic Calculated Metrics
  const totalMatches = recommendations.length > 0 ? recommendations.length : (collegesList.length || 21);
  const totalSaved = savedColleges.length;
  const totalCollegesCount = collegesList.length > 0 ? collegesList.length : 12;
  
  // Real 50:50 ACPC merit score
  const meritScore = academic?.twelfthPercentage
    ? ((academic.twelfthPercentage * 0.5) + ((academic.entranceScore || 90) * 0.5)).toFixed(1)
    : '88.0';

  const budgetFormatted = profile?.budget
    ? (profile.budget / 100000).toFixed(1)
    : '1.8';

  // Profile completeness score
  let completedSteps = 1; // registered
  if (profile?.careerGoal || profile?.budget) completedSteps += 1;
  if (academic?.twelfthPercentage) completedSteps += 1;
  if (recommendations.length > 0) completedSteps += 1;
  const profileCompletionPercent = Math.round((completedSteps / 4) * 100);

  // Preferred course name
  const preferredCourseName = profile?.preferredCourse?.courseName ||
    coursesList.find((c) => c._id === profile?.preferredCourse)?.courseName ||
    'Computer Engineering & AI';

  // Seed / fallback recommendations if empty
  const displayRecs = recommendations.length > 0
    ? recommendations.slice(0, 3)
    : [
        {
          _id: 'rec-1',
          overallScore: 96,
          collegeId: {
            _id: collegesList[0]?._id || 'da',
            name: 'DA-IICT Gandhinagar',
            city: 'Gandhinagar',
            state: 'Gujarat',
            collegeRating: 4.8
          },
          placement: { averagePackage: 1750000, highestPackage: 5400000 },
          fee: { totalAnnualFee: 220000 }
        },
        {
          _id: 'rec-2',
          overallScore: 92,
          collegeId: {
            _id: collegesList[1]?._id || 'nu',
            name: 'Nirma University - IT',
            city: 'Ahmedabad',
            state: 'Gujarat',
            collegeRating: 4.6
          },
          placement: { averagePackage: 1220000, highestPackage: 4800000 },
          fee: { totalAnnualFee: 195000 }
        },
        {
          _id: 'rec-3',
          overallScore: 89,
          collegeId: {
            _id: collegesList[2]?._id || 'ld',
            name: 'L.D. College of Engineering',
            city: 'Ahmedabad',
            state: 'Gujarat',
            collegeRating: 4.5
          },
          placement: { averagePackage: 780000, highestPackage: 2800000 },
          fee: { totalAnnualFee: 1500 }
        }
      ];

  // Dynamic Month Wave presets
  const monthWavePresets = {
    Jan: {
      path: "M 0 45 C 50 20, 100 20, 140 45 C 220 80, 300 70, 380 55 C 460 40, 540 70, 620 60 C 700 50, 750 65, 780 70",
      peakX: 75,
      peakY: 20,
      pillarLeft: '8%',
      val: Math.max(1, Math.round(totalMatches * 0.45))
    },
    Feb: {
      path: "M 0 65 C 60 65, 100 22, 160 22 C 220 22, 280 75, 360 60 C 440 45, 520 65, 600 55 C 680 45, 740 68, 780 70",
      peakX: 160,
      peakY: 22,
      pillarLeft: '18%',
      val: Math.max(2, Math.round(totalMatches * 0.65))
    },
    Mar: {
      path: "M 0 70 C 60 70, 140 78, 200 60 C 240 45, 270 20, 310 20 C 370 20, 440 75, 520 60 C 600 45, 680 65, 780 70",
      peakX: 310,
      peakY: 20,
      pillarLeft: '28%',
      val: Math.max(3, Math.round(totalMatches * 0.85))
    },
    Apr: {
      path: "M 0 72 C 70 72, 140 82, 210 70 C 280 56, 330 22, 380 22 C 430 22, 480 62, 540 68 C 600 74, 640 44, 700 48 C 730 50, 760 66, 780 68",
      peakX: 380,
      peakY: 22,
      pillarLeft: '38%',
      val: totalMatches
    },
    May: {
      path: "M 0 70 C 80 70, 160 65, 240 75 C 320 85, 380 20, 450 20 C 520 20, 580 65, 640 55 C 700 45, 750 65, 780 68",
      peakX: 450,
      peakY: 20,
      pillarLeft: '48%',
      val: Math.max(4, Math.round(totalMatches * 1.15))
    },
    Jun: {
      path: "M 0 68 C 80 68, 160 75, 240 65 C 320 55, 420 75, 480 55 C 510 40, 540 20, 580 20 C 640 20, 710 65, 780 68",
      peakX: 580,
      peakY: 20,
      pillarLeft: '58%',
      val: Math.max(5, Math.round(totalMatches * 1.3))
    },
    Jul: {
      path: "M 0 70 C 100 70, 200 65, 300 75 C 400 85, 500 65, 580 50 C 620 30, 650 18, 680 18 C 720 18, 750 55, 780 68",
      peakX: 680,
      peakY: 18,
      pillarLeft: '68%',
      val: Math.max(6, Math.round(totalMatches * 1.5))
    },
    Aug: {
      path: "M 0 72 C 80 72, 160 80, 240 68 C 320 56, 360 22, 420 22 C 480 22, 540 65, 600 68 C 660 72, 720 50, 780 65",
      peakX: 420,
      peakY: 22,
      pillarLeft: '78%',
      val: Math.max(4, Math.round(totalMatches * 1.2))
    },
    Sep: {
      path: "M 0 70 C 80 70, 160 75, 250 65 C 340 55, 420 70, 500 55 C 550 40, 580 22, 620 22 C 680 22, 730 65, 780 68",
      peakX: 620,
      peakY: 22,
      pillarLeft: '88%',
      val: Math.max(5, Math.round(totalMatches * 1.25))
    },
    Oct: {
      path: "M 0 72 C 70 72, 140 80, 220 68 C 300 56, 360 22, 410 22 C 470 22, 530 65, 600 70 C 670 75, 730 48, 780 66",
      peakX: 410,
      peakY: 22,
      pillarLeft: '95%',
      val: Math.max(6, Math.round(totalMatches * 1.35))
    }
  };

  const currentWave = monthWavePresets[selectedMonth] || monthWavePresets.Apr;
  const waveArea = `${currentWave.path} L 780 130 L 0 130 Z`;

  // Dynamic campus radar pins
  const livePins = collegesList.length > 0
    ? collegesList.slice(0, 3).map((col, idx) => {
        const positions = [
          { top: '35%', left: '26%', bg: '#6C5CE7' },
          { top: '75%', left: '55%', bg: '#10B981' },
          { top: '38%', left: '82%', bg: '#FF5E89' }
        ];
        const pos = positions[idx] || positions[0];
        const initials = col.name ? col.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'CO';
        return {
          id: col._id,
          name: col.name,
          initials,
          city: col.city || 'Gujarat',
          rating: col.collegeRating || '4.6',
          avgCTC: col.averagePackage ? `₹${(col.averagePackage / 100000).toFixed(1)} LPA` : '₹8.5 LPA',
          ...pos
        };
      })
    : [
        { id: 'da', name: 'DA-IICT Gandhinagar', initials: 'DA', city: 'Gandhinagar', rating: '4.8', avgCTC: '₹17.5 LPA', top: '35%', left: '26%', bg: '#6C5CE7' },
        { id: 'sv', name: 'SVNIT Surat', initials: 'SV', city: 'Surat', rating: '4.7', avgCTC: '₹14.2 LPA', top: '75%', left: '55%', bg: '#10B981' },
        { id: 'nu', name: 'Nirma University', initials: 'NU', city: 'Ahmedabad', rating: '4.6', avgCTC: '₹12.2 LPA', top: '38%', left: '82%', bg: '#FF5E89' }
      ];

  return (
    <div className="admin-dashboard-grid">
      {/* =================================================================
          LEFT COLUMN: HERO, FEATURE CARDS & 3 NEO CARDS
          ================================================================= */}
      <div className="admin-left-col">
        {/* TOP SPLIT: HERO CARD + 2 FEATURE WIDGETS */}
        <div className="admin-top-split">
          {/* HERO CARD (PURPLE GRADIENT WITH SMOOTH WAVE) */}
          <div className="admin-hero-card">
            {/* Frosted Pillar Connecting Active Month to Stat Tray */}
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
                  onClick={() => {
                    playSound('tap');
                    fetchDashboardData();
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.75)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Sync live admissions data"
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
                      minWidth: '110px'
                    }}
                  >
                    {['Weekly', 'Monthly', 'Yearly'].map((p) => (
                      <div
                        key={p}
                        onClick={() => {
                          setPeriod(p);
                          setShowPeriodDropdown(false);
                          playSound('click');
                        }}
                        style={{
                          padding: '6px 12px',
                          fontSize: '11px',
                          color: 'var(--adm-text-dark, #1E1B4B)',
                          fontWeight: '600',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--adm-purple-soft, #F0EDFE)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
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
                  <linearGradient id="studentHeroWaveGradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5E89" stopOpacity="0.35" />
                    <stop offset="70%" stopColor="#FF5E89" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#FF5E89" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="studentHeroGlowEffect" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#FF5E89" floodOpacity="0.8" />
                  </filter>
                </defs>

                {/* Gradient area under the curve */}
                <path d={waveArea} fill="url(#studentHeroWaveGradientFill)" />

                {/* Glowing pink wave line */}
                <path
                  d={currentWave.path}
                  fill="none"
                  stroke="#FF5E89"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#studentHeroGlowEffect)"
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
                <span className="val">{currentWave.val}</span>
                <span className="lbl">Matches</span>
              </div>
            </div>

            {/* Month Timeline Pills */}
            <div className="admin-months-row">
              {MONTHS.map((m) => (
                <div
                  key={m}
                  className={`admin-month-item ${selectedMonth === m ? 'active' : ''}`}
                  onClick={() => {
                    playSound('tap');
                    setSelectedMonth(m);
                  }}
                >
                  {m}
                </div>
              ))}
            </div>

            {/* Hero Frosted Glass Stats Tray */}
            <div className="admin-hero-tray">
              <div
                className="admin-hero-stat-col"
                onClick={() => {
                  playSound('click');
                  nav('/user/academic');
                }}
                style={{ cursor: 'pointer' }}
                title="View 10th & 12th Academic Scores"
              >
                <small>ACPC Merit Score</small>
                <div className="stat-val">{meritScore}</div>
                <span className="stat-sub">50:50 Board + Exam</span>
              </div>

              <div
                className="admin-hero-stat-col highlight-center"
                onClick={() => {
                  playSound('click');
                  nav('/user/recommendations');
                }}
                style={{ cursor: 'pointer' }}
                title="Open AI Recommendations Studio"
              >
                <small>AI Match Engine</small>
                <div className="stat-val">{totalMatches} Matches</div>
                <span className="stat-sub">Active {selectedMonth}</span>
              </div>

              <div
                className="admin-hero-stat-col"
                onClick={() => {
                  playSound('click');
                  nav('/scholarships');
                }}
                style={{ cursor: 'pointer' }}
                title="Explore MYSY & TFWS Schemes"
              >
                <small>Target Budget</small>
                <div className="stat-val">₹{budgetFormatted}L</div>
                <span className="stat-sub">MYSY Grant Eligible</span>
              </div>
            </div>
          </div>

          {/* TWO SIDE FEATURE CARDS */}
          <div className="admin-feature-cards">
            {/* Card 1: Violet System Card */}
            <div
              className="admin-card-violet"
              onClick={() => {
                playSound('click');
                nav('/colleges');
              }}
              title="Browse verified colleges and cutoffs"
            >
              <div className="admin-frosted-squircle">
                <GraduationCap size={24} />
              </div>
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ fontSize: '16px', fontWeight: '800', lineHeight: '1.2' }}>
                  Colleges Directory
                </div>
                <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px' }}>
                  {totalCollegesCount} Accredited Campuses • {preferredCourseName}
                </div>
              </div>
            </div>

            {/* Card 2: Radiant Pink Inquiries Card with Decorative Wave */}
            <div
              className="admin-card-pink"
              onClick={() => {
                playSound('pop');
                nav('/user/recommendations');
              }}
              title="Open personalized AI Match Studio"
            >
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

              <div className="d-flex align-items-center justify-content-between" style={{ position: 'relative', zIndex: 2 }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="admin-frosted-squircle">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>AI Match Studio</div>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>Profile Match: {profileCompletionPercent}% Complete</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateRecommendations();
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '10.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Recalculate AI fits"
                >
                  <RefreshCw size={11} className={generating ? 'fa-spin' : ''} />
                  <span>{generating ? 'Matching...' : 'Re-Match'}</span>
                </button>
              </div>

              <div className="d-flex align-items-end justify-content-between mt-3" style={{ position: 'relative', zIndex: 2 }}>
                <div>
                  <small style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85, display: 'block' }}>
                    Active Matches
                  </small>
                  <div style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.1' }}>
                    {totalMatches} Colleges
                  </div>
                  <small style={{ fontSize: '11px', opacity: 0.9 }}>
                    Top Pick: {displayRecs[0]?.collegeId?.name || 'DA-IICT Gandhinagar'}
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
          {/* Neo-Card 1: Colleges & Cutoffs */}
          <div
            className="admin-neo-card"
            onClick={() => {
              playSound('click');
              nav('/colleges');
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-neo-card-top">
              <div className="admin-purple-squircle">
                <Building2 size={22} />
              </div>
              <div className="admin-neo-dots" title="Explore colleges">
                <MoreHorizontal size={18} />
              </div>
            </div>

            <div className="admin-neo-title">Colleges Hub</div>
            <div className="admin-neo-sub">{totalCollegesCount} Campuses • {coursesList.length || 10} Degrees</div>

            <div className="admin-progress-header">
              <span>Verification</span>
              <span style={{ color: '#10B981', fontWeight: '800' }}>100%</span>
            </div>
            <div className="admin-progress-track">
              <div className="admin-progress-fill" style={{ width: '100%' }} />
            </div>

            <div className="admin-neo-footer-pills">
              <span className="admin-stat-pill">{totalCollegesCount} / {totalCollegesCount} verified</span>
              <span className="admin-status-pill-pink">★ 4.6 Avg Rating</span>
            </div>
          </div>

          {/* Neo-Card 2: Placement Drives & Packages */}
          <div
            className="admin-neo-card"
            onClick={() => {
              playSound('click');
              nav('/careers');
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-neo-card-top">
              <div className="admin-purple-squircle">
                <TrendingUp size={22} />
              </div>
              <div className="admin-neo-dots" title="Placement analytics">
                <MoreHorizontal size={18} />
              </div>
            </div>

            <div className="admin-neo-title">Placement Drives</div>
            <div className="admin-neo-sub">Top Tier Engineering Recruiters</div>

            <div className="admin-progress-header">
              <span>Average Placement Rate</span>
              <span style={{ color: '#10B981', fontWeight: '800' }}>88%</span>
            </div>
            <div className="admin-progress-track">
              <div className="admin-progress-fill" style={{ width: '88%' }} />
            </div>

            <div className="admin-neo-footer-pills">
              <span className="admin-stat-pill">Avg: ₹8.7 LPA</span>
              <span className="admin-status-pill-pink">Max: ₹54.2 LPA</span>
            </div>
          </div>

          {/* Neo-Card 3: Campus Standards & Grants */}
          <div
            className="admin-neo-card"
            onClick={() => {
              playSound('click');
              nav('/scholarships');
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-neo-card-top">
              <div className="admin-purple-squircle">
                <ShieldCheck size={22} />
              </div>
              <div className="admin-neo-dots" title="Scholarship waivers">
                <MoreHorizontal size={18} />
              </div>
            </div>

            <div className="admin-neo-title">Campus & Grants</div>
            <div className="admin-neo-sub">MYSY & TFWS Financial Aids</div>

            <div className="admin-progress-header">
              <span>Grant Coverage</span>
              <span style={{ color: '#10B981', fontWeight: '800' }}>100%</span>
            </div>
            <div className="admin-progress-track">
              <div className="admin-progress-fill" style={{ width: '100%' }} />
            </div>

            <div className="admin-neo-footer-pills">
              <span className="admin-stat-pill">Up to ₹2.0L / yr Aid</span>
              <span className="admin-status-pill-pink">MYSY Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================
          RIGHT COLUMN: DYNAMIC AI RECOMMENDATIONS & LIVE GUJARAT RADAR MAP
          (Community section removed as requested!)
          ================================================================= */}
      <div className="admin-right-col">
        {/* Dynamic AI Matches Section Header */}
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <Sparkles size={18} color="#6C5CE7" />
            <span>AI Matches ({totalMatches})</span>
          </div>
          <span
            className="admin-view-all-link"
            onClick={() => {
              playSound('click');
              nav('/user/recommendations');
            }}
          >
            View All
          </span>
        </div>

        {/* Dynamic Top AI Recommended Colleges List */}
        <div className="admin-reco-mini-list">
          {displayRecs.map((rec, idx) => {
            const college = rec.collegeId || rec.college || {};
            const collegeId = college._id || `temp-${idx}`;
            const isSaved = savedColleges.some(
              (item) => (item.collegeId?._id || item.collegeId) === collegeId
            );
            const score = rec.overallScore || (96 - idx * 4);
            const avgPack = rec.placement?.averagePackage
              ? `₹${(rec.placement.averagePackage / 100000).toFixed(1)} LPA`
              : (idx === 0 ? '₹17.5 LPA' : idx === 1 ? '₹12.2 LPA' : '₹7.8 LPA');
            const fee = rec.fee?.totalAnnualFee
              ? `₹${(rec.fee.totalAnnualFee / 1000).toLocaleString()}k/yr`
              : (idx === 2 ? '₹1.5k/yr' : '₹1.9L/yr');

            return (
              <div key={collegeId} className="admin-reco-mini-card">
                <div className="admin-reco-mini-header">
                  <h4 className="admin-reco-mini-title text-truncate" title={college.name}>
                    {college.name}
                  </h4>
                  <span className="admin-reco-score-chip">
                    <Sparkles size={10} />
                    <span>{score}% Fit</span>
                  </span>
                </div>

                <div className="admin-reco-mini-meta">
                  <span>📍 {college.city || 'Gujarat'}</span>
                  <span>Avg: <strong style={{ color: '#10B981' }}>{avgPack}</strong></span>
                  <span>Fee: <strong>{fee}</strong></span>
                </div>

                <div className="admin-reco-mini-actions">
                  <Link
                    to={`/user/colleges/${collegeId}`}
                    className="admin-reco-mini-link"
                    onClick={() => playSound('click')}
                  >
                    <span>View Profile</span>
                    <ArrowUpRight size={12} />
                  </Link>

                  <button
                    type="button"
                    className={`admin-reco-mini-btn ${isSaved ? 'is-saved' : ''}`}
                    onClick={() => handleToggleSave(collegeId)}
                    title={isSaved ? 'Remove from Saved Shortlist' : 'Add to Saved Shortlist'}
                  >
                    <Bookmark size={12} fill={isSaved ? 'currentColor' : 'none'} />
                    <span>{isSaved ? 'Saved' : 'Shortlist'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Saved Shortlist Capsule Bar */}
        <div
          style={{
            background: 'var(--adm-purple-soft, #F0EDFE)',
            borderRadius: '16px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <Bookmark size={16} color="#6C5CE7" />
            <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--adm-text-dark, #1E1B4B)' }}>
              Saved Shortlist ({totalSaved})
            </div>
          </div>
          <Link
            to="/user/saved"
            style={{
              fontSize: '11.5px',
              fontWeight: '800',
              color: '#6C5CE7',
              textDecoration: 'none'
            }}
            onClick={() => playSound('click')}
          >
            Manage & Compare →
          </Link>
        </div>

        {/* LIVE CAMPUS RADAR MAP WIDGET */}
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-1" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--adm-text-dark, #1E1B4B)' }}>
              <MapPin size={16} color="#6C5CE7" />
              <span>Live Campus Radar</span>
            </div>
            <span
              className="admin-view-all-link"
              onClick={() => {
                playSound('click');
                nav('/colleges');
              }}
            >
              View All ({totalCollegesCount})
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

            {/* University Location Pins */}
            {livePins.map((pin) => (
              <div
                key={pin.id}
                style={{
                  position: 'absolute',
                  top: pin.top,
                  left: pin.left,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: 3
                }}
                onClick={() => {
                  playSound('tap');
                  setActiveCollegePin(
                    activeCollegePin?.id === pin.id
                      ? null
                      : pin
                  );
                }}
                title={`${pin.name} (${pin.city}) - ${pin.avgCTC}`}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: pin.bg,
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
                  {pin.initials}
                </div>
              </div>
            ))}

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
                  bottom: '8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(30, 27, 75, 0.96)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{activeCollegePin.name}</span>
                <span style={{ color: '#10B981', fontWeight: '800' }}>{activeCollegePin.avgCTC}</span>
                <Link
                  to={`/user/colleges/${activeCollegePin.id}`}
                  style={{ color: '#FF5E89', textDecoration: 'underline', fontSize: '10.5px' }}
                >
                  View
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
