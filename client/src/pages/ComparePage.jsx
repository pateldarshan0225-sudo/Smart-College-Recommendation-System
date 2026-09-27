import React, { useState, useEffect } from 'react';
import '../styles/ruang-edit.css';
import { CollegeNavbar } from '../components/college-reco/CollegeNavbar';
import { CollegeDetailModal } from '../components/college-reco/CollegeDetailModal';
import { QuickRecommendationModal } from '../components/college-reco/QuickRecommendationModal';
import { playSound, toggleSound } from '../utils/audio';
import api from '../services/api';
import { Scale, Plus, X, Award, MapPin, Building, ShieldCheck, Sparkles, Check, ArrowUpRight } from 'lucide-react';

export default function ComparePage() {
  const [theme, setTheme] = useState('lavender');
  const [soundOn, setSoundOn] = useState(true);
  const [colleges, setColleges] = useState([]);
  const [selectedIds, setSelectedIds] = useState(['c1', 'c2', 'c3']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);

  useEffect(() => {
    document.title = 'Side-by-Side College Comparison Matrix - Smart College';
    window.scrollTo(0, 0);
    fetchColleges();
  }, []);

  const defaultDatabase = [
    {
      _id: 'c1',
      name: 'DA-IICT Gandhinagar',
      fullName: 'Dhirubhai Ambani Institute of Information and Communication Technology',
      location: 'Gandhinagar, Gujarat',
      city: 'Gandhinagar',
      accreditation: 'NAAC A+ (Autonomous)',
      nirfRank: 'Top 100 NIRF',
      annualFee: 220000,
      hostelFee: 48000,
      medianPackage: 17.5,
      highestPackage: 54.2,
      placementRate: 97,
      topRecruiters: 'Google, Microsoft, Amazon, Oracle, DE Shaw',
      campusArea: '50 Acres Lush Green',
      facilities: ['High-Speed Wi-Fi', 'Modern HPC Lab', 'AC Hostels', 'Sports Complex', 'IEEE Student Branch'],
      acpcCode: '011',
      roiScore: '96 / 100'
    },
    {
      _id: 'c2',
      name: 'Nirma University (ITNU)',
      fullName: 'Institute of Technology, Nirma University',
      location: 'Ahmedabad, Gujarat',
      city: 'Ahmedabad',
      accreditation: 'NAAC A+ (Autonomous)',
      nirfRank: 'Rank 101-150',
      annualFee: 195000,
      hostelFee: 65000,
      medianPackage: 12.2,
      highestPackage: 48.0,
      placementRate: 94,
      topRecruiters: 'Morgan Stanley, Samsung, Infosys, TCS Digital, Crest Data',
      campusArea: '115 Acres Tech Campus',
      facilities: ['Robotics Research Lab', 'Auditorium', 'Hostel', 'Incubation Center', 'Gymnasium'],
      acpcCode: '014',
      roiScore: '92 / 100'
    },
    {
      _id: 'c3',
      name: 'L.D. College of Engineering (LDCE)',
      fullName: 'Lalbhai Dalpatbhai College of Engineering',
      location: 'Navrangpura, Ahmedabad',
      city: 'Ahmedabad',
      accreditation: 'Government (GTU Affiliated)',
      nirfRank: 'Govt Top Tier',
      annualFee: 1500,
      hostelFee: 4000,
      medianPackage: 7.8,
      highestPackage: 28.0,
      placementRate: 88,
      topRecruiters: 'L&T, Adani Group, TCS, Reliance, Tata Motors',
      campusArea: '70 Acres Historic Central Campus',
      facilities: ['Central Library', 'Siemens COE Lab', 'Govt Hostel', 'Sports Grounds', 'Alumni Network'],
      acpcCode: '028',
      roiScore: '98 / 100 (Max Value)'
    },
    {
      _id: 'c4',
      name: 'VGEC Chandkheda',
      fullName: 'Vishwakarma Government Engineering College',
      location: 'Chandkheda, Gandhinagar',
      city: 'Gandhinagar',
      accreditation: 'Government (GTU Affiliated)',
      nirfRank: 'Govt Accredited',
      annualFee: 1500,
      hostelFee: 4200,
      medianPackage: 6.9,
      highestPackage: 24.0,
      placementRate: 86,
      topRecruiters: 'TCS, Infosys, Torrent Power, GNFC, Atul Ltd',
      campusArea: '55 Acres Near Metro',
      facilities: ['Innovation Club', 'Hardware Labs', 'Hostel', 'Seminar Halls'],
      acpcCode: '017',
      roiScore: '94 / 100'
    },
    {
      _id: 'c5',
      name: 'PDEU Gandhinagar',
      fullName: 'Pandit Deendayal Energy University',
      location: 'Raisan, Gandhinagar',
      city: 'Gandhinagar',
      accreditation: 'NAAC A++ (Private)',
      nirfRank: 'Rank 94 NIRF',
      annualFee: 240000,
      hostelFee: 75000,
      medianPackage: 9.8,
      highestPackage: 42.0,
      placementRate: 91,
      topRecruiters: 'ONGC, Shell, Adani Solar, L&T Hydrocarbon, Amazon',
      campusArea: '100 Acres World-Class',
      facilities: ['Solar Research Farm', 'Performing Arts Hub', 'Luxury Hostels', 'Olympic Swimming Pool'],
      acpcCode: '032',
      roiScore: '89 / 100'
    }
  ];

  const fetchColleges = async () => {
    try {
      const res = await api.get('/colleges');
      if (res.data?.data && res.data.data.length > 0) {
        setColleges(res.data.data);
      } else {
        setColleges(defaultDatabase);
      }
    } catch (err) {
      setColleges(defaultDatabase);
    }
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

  const allAvailable = colleges.length > 0 ? colleges : defaultDatabase;
  const comparedList = allAvailable.filter((c) => selectedIds.includes(c._id));

  const handleAddCollege = (id) => {
    playSound('pop');
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveCollege = (id) => {
    playSound('tap');
    if (selectedIds.length > 1) {
      setSelectedIds(selectedIds.filter((sId) => sId !== id));
    }
  };

  return (
    <div className="re-app-container" data-theme={theme}>
      <div className="re-ambient-glow" />

      <CollegeNavbar
        activeSection="compare"
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
        onOpenQuickMatch={() => setQuickMatchOpen(true)}
      />

      <main className="re-page-frame">
        {/* Header Hero */}
        <section className="re-hero-section" style={{ padding: '36px 28px', marginBottom: '28px', textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(124, 109, 175, 0.12)', color: 'var(--re-accent-purple)', fontSize: '11.5px', fontWeight: '800', marginBottom: '12px' }}>
            <Scale size={14} />
            <span>SIDE-BY-SIDE MULTI-COLLEGE MATRIX</span>
          </div>
          <h1 style={{ fontSize: '34px', fontWeight: '900', color: 'var(--re-text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2, margin: '0 0 10px 0' }}>
            Compare Colleges Head-to-Head
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--re-text-secondary)', lineHeight: 1.6, maxWidth: '760px', margin: 0 }}>
            Compare up to 4 universities simultaneously across tuition fees, median CTC placements, NAAC grades, campus infrastructure, and calculated return on investment.
          </p>
        </section>

        {/* Quick Add College Strip */}
        <div style={{ background: 'var(--re-bg-surface)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--re-border-subtle)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--re-text-primary)' }}>
              Quick Add to Compare ({selectedIds.length}/4 selected):
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {allAvailable.filter((c) => !selectedIds.includes(c._id)).slice(0, 4).map((c) => (
              <button
                key={c._id}
                onClick={() => handleAddCollege(c._id)}
                disabled={selectedIds.length >= 4}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  background: 'var(--re-bg-surface-subtle)',
                  border: '1px solid var(--re-border-subtle)',
                  color: 'var(--re-text-primary)',
                  cursor: selectedIds.length >= 4 ? 'not-allowed' : 'pointer',
                  opacity: selectedIds.length >= 4 ? 0.5 : 1
                }}
              >
                <Plus size={13} color="var(--re-accent-purple)" />
                <span>+ {c.name?.split(' ')[0] || 'College'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Big Side-by-Side Matrix Table */}
        <div style={{ background: 'var(--re-bg-surface)', borderRadius: '20px', border: '1px solid var(--re-border-subtle)', overflow: 'hidden', boxShadow: 'var(--re-shadow-card)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
              {/* College Header Row */}
              <thead>
                <tr style={{ background: 'var(--re-bg-surface-subtle)', borderBottom: '2px solid var(--re-border-subtle)' }}>
                  <th style={{ padding: '20px 16px', width: '220px', fontSize: '13px', fontWeight: '800', color: 'var(--re-text-muted)', textTransform: 'uppercase' }}>
                    METRIC / PARAMETER
                  </th>
                  {comparedList.map((col) => (
                    <th key={col._id} style={{ padding: '20px 16px', minWidth: '220px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--re-accent-purple)', marginBottom: '4px' }}>
                            ACPC: {col.acpcCode || '011'}
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--re-text-primary)', lineHeight: 1.25 }}>
                            {col.name}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--re-text-muted)', marginTop: '4px' }}>
                            {col.location || col.city}
                          </div>
                        </div>

                        {selectedIds.length > 1 && (
                          <button
                            onClick={() => handleRemoveCollege(col._id)}
                            style={{ background: 'none', border: 'none', color: 'var(--re-text-muted)', cursor: 'pointer', padding: '2px' }}
                            title="Remove from comparison"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Rows */}
              <tbody style={{ fontSize: '13px' }}>
                {/* 1. NAAC & NIRF */}
                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--re-text-muted)' }}>
                    Accreditation & NIRF
                  </td>
                  {comparedList.map((col) => (
                    <td key={col._id} style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--re-text-primary)' }}>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '6px', background: 'rgba(124, 109, 175, 0.12)', color: 'var(--re-accent-purple)', fontSize: '11.5px', fontWeight: '800' }}>
                        {col.accreditation || 'NAAC A+'}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--re-text-muted)', marginTop: '3px' }}>
                        {col.nirfRank || 'State Rank Tier-1'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 2. Annual Tuition Fee */}
                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--re-text-muted)' }}>
                    Annual Tuition Fee
                  </td>
                  {comparedList.map((col) => {
                    const fee = col.annualFee || col.fees?.annual || 150000;
                    const isGovt = fee < 5000;
                    return (
                      <td key={col._id} style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '900', color: isGovt ? '#10B981' : 'var(--re-text-primary)' }}>
                          ₹{fee.toLocaleString()} / year
                        </div>
                        <div style={{ fontSize: '11px', color: isGovt ? '#10B981' : 'var(--re-text-muted)', fontWeight: '700' }}>
                          {isGovt ? '✓ 100% Govt Subsidized' : 'MYSY 50% Grant Eligible'}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* 3. Median Placement Package */}
                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--re-text-muted)' }}>
                    Median Placement CTC
                  </td>
                  {comparedList.map((col) => (
                    <td key={col._id} style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '900', color: '#10B981' }}>
                        ₹{col.medianPackage || col.placements?.averagePackage || '7.5'} LPA
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--re-accent-purple)', fontWeight: '800' }}>
                        Highest: ₹{col.highestPackage || col.placements?.highestPackage || '28.0'} LPA
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 4. Placement Success Rate */}
                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--re-text-muted)' }}>
                    Placement Percentage
                  </td>
                  {comparedList.map((col) => (
                    <td key={col._id} style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '800', color: 'var(--re-text-primary)' }}>
                        {col.placementRate || 92}% Batch Placed
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 5. Top Recruiters */}
                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--re-text-muted)' }}>
                    Marquee Recruiters
                  </td>
                  {comparedList.map((col) => (
                    <td key={col._id} style={{ padding: '14px 16px', color: 'var(--re-text-secondary)', fontSize: '12.5px', lineHeight: 1.4 }}>
                      {col.topRecruiters || 'Google, Amazon, TCS, Infosys, Reliance'}
                    </td>
                  ))}
                </tr>

                {/* 6. Campus & Facilities */}
                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--re-text-muted)' }}>
                    Campus & Facilities
                  </td>
                  {comparedList.map((col) => (
                    <td key={col._id} style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--re-text-primary)', marginBottom: '4px' }}>
                        {col.campusArea || '50+ Acres'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {(col.facilities || ['High-Speed Wi-Fi', 'Modern Labs', 'Hostel']).slice(0, 3).map((f, i) => (
                          <span key={i} style={{ fontSize: '11.5px', color: 'var(--re-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={12} color="#10B981" /> {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 7. Action Row */}
                <tr>
                  <td style={{ padding: '20px 16px', fontWeight: '800', color: 'var(--re-text-muted)' }}>
                    Direct Action
                  </td>
                  {comparedList.map((col) => (
                    <td key={col._id} style={{ padding: '20px 16px' }}>
                      <button
                        onClick={() => {
                          playSound('click');
                          setSelectedCollege(col);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          borderRadius: '999px',
                          background: 'linear-gradient(135deg, #1E1738 0%, #2A1F4E 100%)',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        <span>View Details</span>
                        <ArrowUpRight size={13} />
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CollegeDetailModal
        isOpen={!!selectedCollege}
        onClose={() => setSelectedCollege(null)}
        college={selectedCollege}
      />

      <QuickRecommendationModal
        isOpen={quickMatchOpen}
        onClose={() => setQuickMatchOpen(false)}
      />
    </div>
  );
}
