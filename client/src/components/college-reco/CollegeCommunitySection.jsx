import React, { useState, useEffect } from 'react';
import {
  Mail,
  MessageCircle,
  Sparkles,
  Search,
  Filter,
  MapPin,
  Building,
  Award,
  DollarSign,
  TrendingUp,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { SparkleStar } from './CollegeSquircles';
import { playSound } from '../../utils/audio';

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const CollegeCommunitySection = ({
  colleges = [],
  savedIds = [],
  onOpenQuickMatch,
  onOpenCollegeDetail,
  onOpenCompare,
  onToggleSave
}) => {
  const [activeTab, setActiveTab] = useState('explorer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);

  // Fast Simulator state
  const [simMarks, setSimMarks] = useState(84);
  const [simBudget, setSimBudget] = useState(300000);
  const [simCity, setSimCity] = useState('All');

  const defaultColleges = [
    {
      _id: '1',
      name: 'Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)',
      city: 'Gandhinagar',
      state: 'Gujarat',
      collegeType: 'Private',
      collegeRating: 4.8,
      eligibilityPercentage: 75,
      annualFee: 250000,
      avgPackage: '₹16.2 LPA',
      highestPackage: '₹52 LPA',
      placementRate: 97.2,
      description: 'Premier ICT institute renowned for exceptional computer science research, innovation, and top placements.'
    },
    {
      _id: '2',
      name: 'Nirma University - Institute of Technology',
      city: 'Ahmedabad',
      state: 'Gujarat',
      collegeType: 'Private',
      collegeRating: 4.6,
      eligibilityPercentage: 70,
      annualFee: 215000,
      avgPackage: '₹12.4 LPA',
      highestPackage: '₹46 LPA',
      placementRate: 94.8,
      description: 'Leading autonomous university recognized for technical excellence, world-class labs, and industry tie-ups.'
    },
    {
      _id: '3',
      name: 'L.D. College of Engineering (LDCE)',
      city: 'Ahmedabad',
      state: 'Gujarat',
      collegeType: 'Government',
      collegeRating: 4.5,
      eligibilityPercentage: 65,
      annualFee: 6500,
      avgPackage: '₹7.8 LPA',
      highestPackage: '₹24 LPA',
      placementRate: 89.5,
      description: 'Historic apex government engineering college established in 1948 with rich alumni heritage and high ROI.'
    },
    {
      _id: '4',
      name: 'Pandit Deendayal Energy University (PDEU)',
      city: 'Gandhinagar',
      state: 'Gujarat',
      collegeType: 'Deemed',
      collegeRating: 4.6,
      eligibilityPercentage: 65,
      annualFee: 280000,
      avgPackage: '₹9.5 LPA',
      highestPackage: '₹38 LPA',
      placementRate: 92.0,
      description: 'World-class energy, engineering, and liberal studies university with cutting-edge infrastructure.'
    },
    {
      _id: '5',
      name: 'Birla Vishvakarma Mahavidyalaya (BVM Engineering College)',
      city: 'Anand',
      state: 'Gujarat',
      collegeType: 'Grant-in-Aid',
      collegeRating: 4.4,
      eligibilityPercentage: 60,
      annualFee: 45000,
      avgPackage: '₹6.8 LPA',
      highestPackage: '₹22 LPA',
      placementRate: 88.0,
      description: 'First engineering college of Gujarat established in 1948 with renowned engineering programs.'
    },
    {
      _id: '6',
      name: 'CHARUSAT - Chandubhai S Patel Institute of Technology',
      city: 'Changa',
      state: 'Gujarat',
      collegeType: 'Private',
      collegeRating: 4.5,
      eligibilityPercentage: 60,
      annualFee: 140000,
      avgPackage: '₹7.2 LPA',
      highestPackage: '₹28 LPA',
      placementRate: 90.5,
      description: 'High-ranking university with advanced research centers and extensive industry collaborations.'
    }
  ];

  const collegeList = colleges.length > 0 ? colleges : defaultColleges;

  // Filtered colleges for Explorer
  const filteredColleges = collegeList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'All' || c.city === selectedCity;
    const matchesType = selectedType === 'All' || c.collegeType === selectedType;
    return matchesSearch && matchesCity && matchesType;
  });

  const handleTabSwitch = (tab) => {
    playSound('tap');
    setActiveTab(tab);
  };

  const toggleFaq = (index) => {
    playSound('pop');
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="re-community-wrapper" id="colleges-section" aria-label="College Explorer & Community">
      {/* Top Right Mini Nav Arrows (Exact visual from template) */}
      <div className="re-community-top-nav">
        <button
          className="re-nav-micro-btn"
          onClick={() => {
            playSound('tap');
            const tabs = ['explorer', 'simulator', 'reviews', 'faq'];
            const idx = tabs.indexOf(activeTab);
            setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length]);
          }}
          title="Previous tab"
          aria-label="Previous tab"
        >
          ←
        </button>
        <button
          className="re-nav-micro-btn"
          onClick={() => {
            playSound('tap');
            const tabs = ['explorer', 'simulator', 'reviews', 'faq'];
            const idx = tabs.indexOf(activeTab);
            setActiveTab(tabs[(idx + 1) % tabs.length]);
          }}
          title="Next tab"
          aria-label="Next tab"
        >
          →
        </button>
      </div>

      {/* Main Community Card Frame */}
      <div className="re-community-card">
        {/* Floating Sparkles inside card */}
        <div style={{ position: 'absolute', top: '24px', left: '28px', pointerEvents: 'none' }}>
          <SparkleStar size={20} color="#8A78B8" />
        </div>
        <div style={{ position: 'absolute', bottom: '80px', right: '28px', pointerEvents: 'none' }}>
          <SparkleStar size={22} color="#8A78B8" />
        </div>

        {/* Tag (Exact uppercase formatted tag) */}
        <div className="re-community-tag">
          - Smart College Recommendation System -
        </div>

        {/* Headline with amber capsule badge */}
        <h2 className="re-community-headline">
          Helps you discover and secure admission into top universities through trusted{' '}
          <span className="re-text-highlight-badge">Smart College</span> AI matching
        </h2>

        {/* Subtext */}
        <p className="re-community-subtext">
          Join thousands of students finding accredited universities matching their academic scores, budget, and career goals.
        </p>

        {/* Interactive Feature Tabs Bar */}
        <div className="re-community-tabs">
          <button
            className={`re-tab-pill ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('explorer')}
          >
            Live College Directory
          </button>
          <button
            className={`re-tab-pill ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('simulator')}
          >
            Instant Match Simulator
          </button>
          <button
            className={`re-tab-pill ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('reviews')}
          >
            Student Stories
          </button>
          <button
            className={`re-tab-pill ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('faq')}
          >
            Admissions FAQ
          </button>
        </div>

        {/* TAB 1: LIVE COLLEGE DIRECTORY EXPLORER */}
        {activeTab === 'explorer' && (
          <div>
            {/* Search & Filter Toolbar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '20px',
              background: 'var(--re-bg-surface-subtle)',
              padding: '10px 14px',
              borderRadius: '16px',
              border: '1px solid var(--re-border-subtle)'
            }}>
              <div style={{ flex: 2, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--re-border-subtle)' }}>
                <Search size={15} color="var(--re-text-muted)" />
                <input
                  type="text"
                  placeholder="Search university or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '13px', fontFamily: 'inherit' }}
                />
              </div>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--re-border-subtle)', background: '#FFFFFF', fontSize: '12.5px', fontFamily: 'inherit', fontWeight: 600 }}
              >
                <option value="All">All Cities (Gujarat)</option>
                <option value="Gandhinagar">Gandhinagar</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Anand">Anand / V.V. Nagar</option>
                <option value="Changa">Changa</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--re-border-subtle)', background: '#FFFFFF', fontSize: '12.5px', fontFamily: 'inherit', fontWeight: 600 }}
              >
                <option value="All">All Types</option>
                <option value="Government">Government</option>
                <option value="Private">Private Autonomous</option>
                <option value="Grant-in-Aid">Grant-in-Aid</option>
                <option value="Deemed">Deemed University</option>
              </select>

              <button
                onClick={() => {
                  playSound('pop');
                  onOpenCompare();
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid var(--re-border-medium)',
                  color: 'var(--re-text-primary)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Compare Benchmark ↗
              </button>
            </div>

            {/* Colleges Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '32px', textAlign: 'left' }}>
              {filteredColleges.slice(0, 6).map((col) => {
                const isSaved = savedIds.includes(col._id);
                return (
                  <div
                    key={col._id}
                    style={{
                      background: 'var(--re-bg-surface-subtle)',
                      border: '1px solid var(--re-border-subtle)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10.5px', background: 'rgba(124, 109, 175, 0.12)', color: 'var(--re-accent-purple)', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                          {col.collegeType || 'Autonomous'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFA439' }}>⭐ {col.collegeRating || '4.6'}</span>
                          <button
                            onClick={() => {
                              playSound('pop');
                              if (onToggleSave) onToggleSave(col);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: isSaved ? 'var(--re-accent-pink)' : 'var(--re-text-muted)',
                              padding: '2px'
                            }}
                            title={isSaved ? 'Saved' : 'Save'}
                          >
                            <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 6px', lineHeight: 1.3 }}>
                        {col.name}
                      </h4>

                      <div style={{ fontSize: '11.5px', color: 'var(--re-text-secondary)', display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <span>📍 {col.city || 'Gujarat'}</span>
                        <span>•</span>
                        <span>Min Cutoff: {col.eligibilityPercentage || 65}%</span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--re-border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--re-text-muted)', fontWeight: 600 }}>AVG PACKAGE</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFA439' }}>{col.avgPackage || '₹12.5 LPA'}</div>
                      </div>

                      <button
                        onClick={() => {
                          playSound('pop');
                          if (onOpenCollegeDetail) onOpenCollegeDetail(col);
                        }}
                        style={{
                          background: '#FFFFFF',
                          border: '1.5px solid var(--re-border-medium)',
                          padding: '6px 12px',
                          borderRadius: 'var(--re-radius-pill)',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: 'var(--re-text-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        Dossier ↗
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INSTANT MATCH SIMULATOR */}
        {activeTab === 'simulator' && (
          <div style={{ background: 'var(--re-bg-surface-subtle)', border: '1px solid var(--re-border-subtle)', borderRadius: '18px', padding: '24px', marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--re-text-primary)', display: 'block', marginBottom: '6px' }}>
                  12th Board Score: <strong style={{ color: 'var(--re-accent-purple)' }}>{simMarks}%</strong>
                </label>
                <input
                  type="range"
                  min="55"
                  max="98"
                  value={simMarks}
                  onChange={(e) => {
                    playSound('tap');
                    setSimMarks(Number(e.target.value));
                  }}
                  style={{ width: '100%', accentColor: 'var(--re-accent-purple)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--re-text-primary)', display: 'block', marginBottom: '6px' }}>
                  Max Budget: <strong style={{ color: 'var(--re-accent-amber)' }}>₹{(simBudget / 100000).toFixed(1)}L / yr</strong>
                </label>
                <input
                  type="range"
                  min="20000"
                  max="500000"
                  step="20000"
                  value={simBudget}
                  onChange={(e) => {
                    playSound('tap');
                    setSimBudget(Number(e.target.value));
                  }}
                  style={{ width: '100%', accentColor: 'var(--re-accent-amber)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--re-text-primary)', display: 'block', marginBottom: '6px' }}>
                  Preferred City
                </label>
                <select
                  value={simCity}
                  onChange={(e) => setSimCity(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--re-border-subtle)', fontFamily: 'inherit' }}
                >
                  <option value="All">Any City</option>
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Anand">Anand</option>
                </select>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                className="re-btn-primary"
                onClick={() => {
                  playSound('pop');
                  onOpenQuickMatch();
                }}
                style={{ maxWidth: '380px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Launch Deep AI Match Engine 🚀
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT STORIES */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '32px', textAlign: 'left' }}>
            {[
              {
                name: 'Aarav Patel',
                college: 'DA-IICT (B.Tech ICT)',
                placed: 'Software Dev at Microsoft (₹42 LPA)',
                quote: 'Smart College Recommendation matched me with DA-IICT when I had 89% in 12th. The multi-factor ROI and placement insights gave me the confidence to choose ICT over traditional branches.',
                color: '#7C6DAF'
              },
              {
                name: 'Diya Shah',
                college: 'Nirma University (B.Tech CSE)',
                placed: 'Cloud Engineer at Oracle (₹18 LPA)',
                quote: 'The cutoffs and fee simulator were 100% accurate. The system accurately predicted my ACPC admission round chances.',
                color: '#FFA439'
              },
              {
                name: 'Rohan Sharma',
                college: 'LDCE Govt (Mechanical Eng)',
                placed: 'Graduate Trainee at L&T (₹9 LPA)',
                quote: 'I had a strict annual budget of ₹50,000. The recommendation engine showed me LDCE had the highest ROI with a total fee of just ₹6,500/year!',
                color: '#35C7B8'
              }
            ].map((rev, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--re-bg-surface-subtle)',
                  border: '1px solid var(--re-border-subtle)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <p style={{ fontSize: '12.5px', color: 'var(--re-text-primary)', lineHeight: 1.45, margin: '0 0 14px', fontStyle: 'italic' }}>
                  "{rev.quote}"
                </p>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--re-text-primary)' }}>{rev.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--re-accent-purple)', fontWeight: 700 }}>{rev.college}</div>
                  <div style={{ fontSize: '11px', color: '#FFA439', fontWeight: 600 }}>{rev.placed}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: FAQS */}
        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', textAlign: 'left' }}>
            {[
              { q: 'How does the Smart College AI algorithm rank universities?', a: 'The engine uses a 6-factor weighted multi-criteria decision algorithm: Academic Cutoff Match (30%), Course Alignment (20%), Placement Package Tier (20%), Annual Budget Fit (15%), Campus Facilities (10%), and Geographic Preference (5%).' },
              { q: 'Are government and private college fees up to date?', a: 'Yes! Tuition, hostel, and miscellaneous fees are synced directly from accredited regulatory bodies (ACPC / AICTE / University fee committees).' },
              { q: 'Can I compare government colleges with private autonomous universities?', a: 'Absolutely! Our side-by-side benchmark matrix allows direct comparison of fees, placement averages, and campus infrastructure.' }
            ].map((faq, i) => (
              <div
                key={i}
                onClick={() => toggleFaq(i)}
                style={{
                  background: 'var(--re-bg-surface-subtle)',
                  border: '1px solid var(--re-border-subtle)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '13.5px', color: 'var(--re-text-primary)' }}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '16px', color: 'var(--re-accent-purple)' }}>{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <p style={{ margin: '10px 0 0', fontSize: '12.5px', color: 'var(--re-text-secondary)', lineHeight: 1.45 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Card Footer Bar (Exact match to uploaded design) */}
        <div className="re-card-footer">
          {/* Left Attribution */}
          <div className="re-footer-left">
            Part of Smart College Recommendation System
          </div>

          {/* Center Social Links */}
          <div className="re-footer-center" aria-label="Social media links">
            <a
              href="mailto:support@smartcollege.edu"
              className="re-social-icon-btn"
              title="Email Admissions Helpdesk"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>

            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="re-social-icon-btn"
              title="WhatsApp Student Counseling"
              aria-label="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="re-social-icon-btn"
              title="Instagram @smartcollege"
              aria-label="Instagram"
            >
              <InstagramIcon size={16} />
            </a>
          </div>

          {/* Right Attribution */}
          <div className="re-footer-right">
            Archived by Smart College • 2024
          </div>
        </div>
      </div>
    </section>
  );
};
