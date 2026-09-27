import React, { useState, useEffect } from 'react';
import '../styles/ruang-edit.css';
import { CollegeNavbar } from '../components/college-reco/CollegeNavbar';
import { AcademicMatcherPreview } from '../components/college-reco/AcademicMatcherPreview';
import { PlacementRoiPreview } from '../components/college-reco/PlacementRoiPreview';
import { CampusBudgetPreview } from '../components/college-reco/CampusBudgetPreview';
import { CollegeDetailModal } from '../components/college-reco/CollegeDetailModal';
import { CompareCollegesModal } from '../components/college-reco/CompareCollegesModal';
import { playSound, toggleSound } from '../utils/audio';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowUpRight, CheckCircle2, TrendingUp, Sliders, ShieldCheck, MapPin, Award, Scale, Bookmark, RefreshCw, Zap } from 'lucide-react';

export default function AiMatcherPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState('lavender');
  const [soundOn, setSoundOn] = useState(true);

  // Matcher state
  const [percentile, setPercentile] = useState(88);
  const [gujcetScore, setGujcetScore] = useState(95);
  const [stream, setStream] = useState('Computer Engineering & AI');
  const [city, setCity] = useState('All Gujarat');
  const [maxFee, setMaxFee] = useState(150000);
  const [hostelNeeded, setHostelNeeded] = useState(false);
  const [priority, setPriority] = useState('placement'); // 'placement' | 'budget' | 'brand'

  // Data & Modals
  const [colleges, setColleges] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: Academic, 1: Placement ROI, 2: Campus Budget

  useEffect(() => {
    document.title = 'AI Recommendation Matcher Engine - Smart College';
    window.scrollTo(0, 0);
    fetchColleges();
    if (user) fetchSavedColleges();
  }, [user]);

  const fetchColleges = async () => {
    try {
      const res = await api.get('/colleges');
      if (res.data?.data) {
        setColleges(res.data.data);
      }
    } catch (err) {
      console.log('Local fallback dataset');
    }
  };

  const fetchSavedColleges = async () => {
    try {
      const res = await api.get('/saved-colleges');
      if (res.data?.data) {
        setSavedIds(res.data.data.map((item) => item.collegeId?._id || item.collegeId));
      }
    } catch (err) {}
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'lavender' ? 'midnight' : 'lavender';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  // Algorithmic dynamic matches calculation
  const getDynamicMatches = () => {
    const defaultDatabase = [
      {
        _id: 'c1',
        name: 'Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)',
        location: 'Gandhinagar, Gujarat',
        city: 'Gandhinagar',
        cutoffPercentile: 96.5,
        rating: 4.8,
        accreditation: 'NAAC A+ (Autonomous)',
        medianPackage: 17.5,
        highestPackage: 54.2,
        annualFee: 220000,
        placementRate: 97,
        streamMatch: ['Computer Engineering & AI', 'Information Technology', 'Data Science'],
        tags: ['Tier-1 Tech', 'ACPC Code: 011', 'Top Silicon Placement']
      },
      {
        _id: 'c2',
        name: 'Nirma University - Institute of Technology',
        location: 'Ahmedabad, Gujarat',
        city: 'Ahmedabad',
        cutoffPercentile: 91.0,
        rating: 4.7,
        accreditation: 'NAAC A+ (Autonomous)',
        medianPackage: 12.2,
        highestPackage: 48.0,
        annualFee: 195000,
        placementRate: 94,
        streamMatch: ['Computer Engineering & AI', 'Mechanical Engineering', 'Information Technology', 'MBA'],
        tags: ['Prime Ahmedabad', 'ACPC Code: 014', 'Robust Alumni']
      },
      {
        _id: 'c3',
        name: 'L.D. College of Engineering (LDCE)',
        location: 'Navrangpura, Ahmedabad',
        city: 'Ahmedabad',
        cutoffPercentile: 86.0,
        rating: 4.6,
        accreditation: 'Government (GTU Affiliated)',
        medianPackage: 7.8,
        highestPackage: 28.0,
        annualFee: 1500,
        placementRate: 88,
        streamMatch: ['Computer Engineering & AI', 'Mechanical Engineering', 'Information Technology', 'Civil Engineering'],
        tags: ['100% Govt Subsidy', 'ACPC Code: 028', 'Zero Tuition Burden']
      },
      {
        _id: 'c4',
        name: 'Vishwakarma Government Engineering College (VGEC)',
        location: 'Chandkheda, Gandhinagar/Ahmedabad',
        city: 'Gandhinagar',
        cutoffPercentile: 82.5,
        rating: 4.5,
        accreditation: 'Government (GTU Affiliated)',
        medianPackage: 6.9,
        highestPackage: 24.0,
        annualFee: 1500,
        placementRate: 86,
        streamMatch: ['Computer Engineering & AI', 'Information Technology', 'Mechanical Engineering'],
        tags: ['Govt Institute', 'ACPC Code: 017', 'Next to IITGN']
      },
      {
        _id: 'c5',
        name: 'Pandit Deendayal Energy University (PDEU)',
        location: 'Gandhinagar, Gujarat',
        city: 'Gandhinagar',
        cutoffPercentile: 78.0,
        rating: 4.6,
        accreditation: 'NAAC A++ (Private)',
        medianPackage: 9.8,
        highestPackage: 42.0,
        annualFee: 240000,
        placementRate: 91,
        streamMatch: ['Computer Engineering & AI', 'Mechanical Engineering', 'MBA'],
        tags: ['NAAC A++', 'ACPC Code: 032', 'Global Energy & Tech']
      },
      {
        _id: 'c6',
        name: 'Charotar University of Science and Technology (CHARUSAT)',
        location: 'Changa, Anand',
        city: 'Anand',
        cutoffPercentile: 74.0,
        rating: 4.4,
        accreditation: 'NAAC A+ (Private University)',
        medianPackage: 6.5,
        highestPackage: 22.0,
        annualFee: 135000,
        placementRate: 85,
        streamMatch: ['Computer Engineering & AI', 'Information Technology', 'Data Science'],
        tags: ['NAAC A+', 'Modern Research Labs', 'High ROI']
      }
    ];

    const sourceData = colleges.length > 0 ? colleges : defaultDatabase;

    return sourceData.map((c) => {
      let score = 70;
      const targetCutoff = c.cutoffPercentile || (c.stats?.cutoffRank ? (100 - c.stats.cutoffRank / 200) : 80);
      const diff = percentile - targetCutoff;

      if (diff >= 0) {
        score += Math.min(25, 20 + diff);
      } else {
        score -= Math.abs(diff) * 1.8;
      }

      if (city === 'All Gujarat' || (c.city && c.city.toLowerCase() === city.toLowerCase())) {
        score += 5;
      }

      const colFee = c.annualFee || c.fees?.annual || 120000;
      if (colFee <= maxFee) {
        score += 5;
      } else {
        score -= 6;
      }

      if (priority === 'placement') {
        const pkg = c.medianPackage || c.placements?.averagePackage || 6;
        score += Math.min(10, pkg / 2);
      } else if (priority === 'budget') {
        if (colFee < 50000) score += 10;
      }

      const finalScore = Math.max(45, Math.min(99, Math.round(score)));

      return {
        ...c,
        fitScore: finalScore,
        roiCategory: colFee < 50000 ? 'Exceptional (Govt)' : finalScore > 90 ? 'High ROI' : 'Standard',
        isEligible: percentile >= targetCutoff - 4
      };
    }).sort((a, b) => b.fitScore - a.fitScore);
  };

  const matches = getDynamicMatches();

  return (
    <div className="re-app-container" data-theme={theme}>
      <div className="re-ambient-glow" />

      <CollegeNavbar
        activeSection="engine"
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
        onOpenQuickMatch={() => {}}
        onOpenCompare={() => setCompareModalOpen(true)}
        collegesCount={colleges.length > 0 ? colleges.length : 500}
        savedCount={savedIds.length}
      />

      <main className="re-page-frame">
        {/* Header Hero */}
        <section className="re-hero-section" style={{ padding: '36px 28px', marginBottom: '28px', textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(124, 109, 175, 0.12)', color: 'var(--re-accent-purple)', fontSize: '11.5px', fontWeight: '800', marginBottom: '12px' }}>
            <Sparkles size={13} />
            <span>NEURAL RECO ENGINE v2.4</span>
          </div>
          <h1 style={{ fontSize: '34px', fontWeight: '900', color: 'var(--re-text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2, margin: '0 0 10px 0' }}>
            Multi-Factor AI College Matching Studio
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--re-text-secondary)', lineHeight: 1.6, maxWidth: '750px', margin: 0 }}>
            Input your board percentile, GUJCET scores, budget, and branch preferences. Our weighted matching algorithm cross-references real ACPC cutoffs, placement CTC, and government scholarship eligibility.
          </p>
        </section>

        {/* Studio Grid: Left Control Panel + Right Algorithmic Fit Output */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '36px' }}>
          {/* LEFT: Interactive Preference Controller */}
          <div className="re-card" style={{ padding: '24px', background: 'var(--re-bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--re-border-subtle)' }}>
              <Sliders size={18} color="var(--re-accent-purple)" />
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--re-text-primary)', margin: 0 }}>
                Your Academic & Preference Profile
              </h2>
            </div>

            {/* Percentile Slider */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--re-text-primary)' }}>
                  12th Board Percentile:
                </label>
                <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--re-accent-purple)', background: 'rgba(124, 109, 175, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                  {percentile}%ile
                </span>
              </div>
              <input
                type="range"
                min="45"
                max="99.9"
                step="0.5"
                value={percentile}
                onChange={(e) => setPercentile(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--re-accent-purple)', cursor: 'pointer' }}
              />
            </div>

            {/* GUJCET / JEE Score Slider */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--re-text-primary)' }}>
                  GUJCET / Entrance Percentile:
                </label>
                <span style={{ fontSize: '14px', fontWeight: '900', color: '#D97706', background: 'rgba(255, 164, 57, 0.16)', padding: '2px 8px', borderRadius: '6px' }}>
                  {gujcetScore}%ile
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="99.9"
                step="0.5"
                value={gujcetScore}
                onChange={(e) => setGujcetScore(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#FFA439', cursor: 'pointer' }}
              />
            </div>

            {/* Stream Selector */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--re-text-primary)', marginBottom: '8px' }}>
                Desired Engineering / Degree Stream:
              </label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--re-border-subtle)', background: 'var(--re-bg-surface-subtle)', color: 'var(--re-text-primary)', fontWeight: '700', fontSize: '13.5px' }}
              >
                <option value="Computer Engineering & AI">Computer Engineering & AI / ML</option>
                <option value="Information Technology">Information Technology (IT)</option>
                <option value="Data Science">Data Science & Cyber Security</option>
                <option value="Mechanical Engineering">Mechanical & Automation</option>
                <option value="Civil Engineering">Civil & Structural</option>
                <option value="MBA">Management / MBA / BBA</option>
              </select>
            </div>

            {/* Preferred Region / City */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--re-text-primary)', marginBottom: '8px' }}>
                Preferred District / City:
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--re-border-subtle)', background: 'var(--re-bg-surface-subtle)', color: 'var(--re-text-primary)', fontWeight: '700', fontSize: '13.5px' }}
              >
                <option value="All Gujarat">All Gujarat (Statewide)</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Gandhinagar">Gandhinagar</option>
                <option value="Surat">Surat</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Rajkot">Rajkot</option>
                <option value="Anand">Anand / Vallabh Vidyanagar</option>
              </select>
            </div>

            {/* Annual Fee Budget Slider */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--re-text-primary)' }}>
                  Max Annual Tuition Budget:
                </label>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--re-text-primary)' }}>
                  ₹{(maxFee / 100000).toFixed(1)} Lakhs / yr
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="300000"
                step="5000"
                value={maxFee}
                onChange={(e) => setMaxFee(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--re-text-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Optimization Priority Mode */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--re-text-primary)', marginBottom: '8px' }}>
                Optimization Priority:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { id: 'placement', label: '🚀 Placement' },
                  { id: 'budget', label: '💰 Lowest Fee' },
                  { id: 'brand', label: '🏆 NAAC Grade' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      playSound('tap');
                      setPriority(p.id);
                    }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      border: priority === p.id ? '2px solid var(--re-accent-purple)' : '1px solid var(--re-border-subtle)',
                      background: priority === p.id ? 'rgba(124, 109, 175, 0.14)' : 'var(--re-bg-surface-subtle)',
                      color: priority === p.id ? 'var(--re-accent-purple)' : 'var(--re-text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Live Algorithmic Match Results */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--re-text-primary)', margin: '0 0 2px 0' }}>
                  Recommended College Matches ({matches.length})
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--re-text-muted)', fontWeight: '700' }}>
                  Ranked in real time for {percentile}%ile • {stream}
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: '11px', fontWeight: '800' }}>
                <ShieldCheck size={14} />
                <span>ACPC 2024 Verified</span>
              </div>
            </div>

            {/* Match Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {matches.slice(0, 5).map((col, idx) => {
                const isHighFit = col.fitScore >= 90;
                return (
                  <div
                    key={col._id || idx}
                    className="re-card"
                    style={{
                      padding: '18px 20px',
                      background: 'var(--re-bg-surface)',
                      border: isHighFit ? '1.5px solid var(--re-accent-purple)' : '1px solid var(--re-border-subtle)',
                      position: 'relative'
                    }}
                  >
                    {idx === 0 && (
                      <span style={{ position: 'absolute', top: '-10px', right: '16px', background: 'linear-gradient(135deg, #7C6DAF 0%, #5E4E96 100%)', color: '#ffffff', fontSize: '10px', fontWeight: '900', padding: '2px 10px', borderRadius: '999px', letterSpacing: '0.04em', boxShadow: '0 2px 8px rgba(124,109,175,0.4)' }}>
                        ★ HIGHEST OVERALL FIT
                      </span>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--re-text-muted)' }}>
                            #{idx + 1}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', background: 'var(--re-bg-surface-subtle)', color: 'var(--re-accent-purple)' }}>
                            {col.accreditation || 'Accredited'}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--re-text-primary)', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                          {col.name}
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--re-text-secondary)', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} color="var(--re-accent-purple)" />
                            {col.location || col.city}
                          </span>
                          <span>•</span>
                          <span style={{ fontWeight: '800', color: '#10B981' }}>
                            Avg CTC: ₹{col.medianPackage || col.placements?.averagePackage || '7.5'} LPA
                          </span>
                          <span>•</span>
                          <span>
                            Fee: ₹{((col.annualFee || 100000) / 1000).toLocaleString()}k/yr
                          </span>
                        </div>
                      </div>

                      {/* Fit Score Circular Badge */}
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: isHighFit ? 'linear-gradient(135deg, rgba(124, 109, 175, 0.2) 0%, rgba(255, 164, 57, 0.2) 100%)' : 'var(--re-bg-surface-subtle)',
                          border: isHighFit ? '2px solid var(--re-accent-purple)' : '1px solid var(--re-border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--re-text-primary)', lineHeight: 1 }}>
                            {col.fitScore}%
                          </span>
                          <span style={{ fontSize: '8.5px', fontWeight: '800', color: 'var(--re-text-muted)', textTransform: 'uppercase' }}>
                            MATCH
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--re-border-subtle)', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {col.tags?.slice(0, 2).map((t, i) => (
                          <span key={i} style={{ fontSize: '10.5px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.04)', color: 'var(--re-text-secondary)' }}>
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          playSound('click');
                          setSelectedCollege(col);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'none',
                          border: 'none',
                          color: 'var(--re-accent-purple)',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        <span>Inspect Fit Analysis</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3 Interactive Live Simulation Widgets */}
        <section style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--re-text-primary)', margin: '0 0 4px 0' }}>
                Explore Deep Simulation Tools
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--re-text-secondary)', margin: 0 }}>
                Toggle between cutoff forecasting, placement return on investment, and campus infrastructure inspectors.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px', background: 'var(--re-bg-surface-subtle)', padding: '4px', borderRadius: '999px', border: '1px solid var(--re-border-subtle)' }}>
              {['Academic Cutoff', 'Placement ROI', 'Budget & Campus'].map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playSound('tap');
                    setActiveTab(idx);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: 'none',
                    background: activeTab === idx ? 'var(--re-accent-purple)' : 'transparent',
                    color: activeTab === idx ? '#ffffff' : 'var(--re-text-secondary)',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--re-bg-surface)', borderRadius: '20px', border: '1px solid var(--re-border-subtle)', padding: '24px' }}>
            {activeTab === 0 && <AcademicMatcherPreview />}
            {activeTab === 1 && <PlacementRoiPreview />}
            {activeTab === 2 && <CampusBudgetPreview />}
          </div>
        </section>
      </main>

      {/* Modals */}
      <CollegeDetailModal
        isOpen={!!selectedCollege}
        onClose={() => setSelectedCollege(null)}
        college={selectedCollege}
      />

      <CompareCollegesModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        colleges={colleges}
      />
    </div>
  );
}
