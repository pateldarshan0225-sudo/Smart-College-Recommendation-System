import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ruang-edit.css';
import { CollegeNavbar } from '../components/college-reco/CollegeNavbar';
import { StreamCareerExplorer } from '../components/college-reco/StreamCareerExplorer';
import { CollegeDetailModal } from '../components/college-reco/CollegeDetailModal';
import { QuickRecommendationModal } from '../components/college-reco/QuickRecommendationModal';
import { CompareCollegesModal } from '../components/college-reco/CompareCollegesModal';
import { playSound, toggleSound } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { Briefcase, TrendingUp, Sparkles, CheckCircle2, Building, ArrowUpRight } from 'lucide-react';

export default function CareersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('lavender');
  const [soundOn, setSoundOn] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Degree Streams & Career Pathways - Smart College';
    window.scrollTo(0, 0);
  }, []);

  const handleOpenAiMatcher = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setQuickMatchOpen(true);
  };

  const handleOpenCompare = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCompareModalOpen(true);
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

  return (
    <div className="re-app-container" data-theme={theme}>
      <div className="re-ambient-glow" />

      <CollegeNavbar
        activeSection="careers"
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
        onOpenQuickMatch={handleOpenAiMatcher}
        onOpenCompare={handleOpenCompare}
      />

      <main className="re-page-frame">
        {/* Header Hero */}
        <section className="re-hero-section" style={{ padding: '36px 28px', marginBottom: '28px', textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(124, 109, 175, 0.12)', color: 'var(--re-accent-purple)', fontSize: '11.5px', fontWeight: '800', marginBottom: '12px' }}>
            <Briefcase size={14} />
            <span>INDUSTRY HIRING & SALARY INTELLIGENCE</span>
          </div>
          <h1 style={{ fontSize: '34px', fontWeight: '900', color: 'var(--re-text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2, margin: '0 0 10px 0' }}>
            Degree Streams & Industry Career Pathways
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--re-text-secondary)', lineHeight: 1.6, maxWidth: '760px', margin: 0 }}>
            Compare starting salaries, median CTC trends, in-demand technical skills, and premier Gujarat colleges across Engineering, AI, Business, Data Science, and Design.
          </p>
        </section>

        {/* Stream & Career Explorer */}
        <StreamCareerExplorer onSelectCollege={(col) => setSelectedCollege(col)} />

        {/* Industry Hiring Matrix Table */}
        <section style={{ marginTop: '40px', background: 'var(--re-bg-surface)', padding: '28px', borderRadius: '20px', border: '1px solid var(--re-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--re-text-primary)', margin: '0 0 4px 0' }}>
                Top Hiring Sectors & Placement Analytics (2024)
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--re-text-secondary)', margin: 0 }}>
                Aggregated from 10,000+ placements across Gujarat accredited universities.
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: '11.5px', fontWeight: '800' }}>
              <TrendingUp size={14} />
              <span>+18.4% YoY Tech Hiring Surge</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--re-border-subtle)', color: 'var(--re-text-muted)' }}>
                  <th style={{ padding: '12px 10px', fontWeight: '800' }}>DOMINANT SECTOR</th>
                  <th style={{ padding: '12px 10px', fontWeight: '800' }}>FRESHER MEDIAN CTC</th>
                  <th style={{ padding: '12px 10px', fontWeight: '800' }}>TIER-1 HIGHEST CTC</th>
                  <th style={{ padding: '12px 10px', fontWeight: '800' }}>TOP HIRING PARTNERS</th>
                  <th style={{ padding: '12px 10px', fontWeight: '800' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    sector: 'Artificial Intelligence & Cloud Computing',
                    median: '₹12.5 LPA',
                    highest: '₹54.2 LPA',
                    recruiters: 'Google, Microsoft, Amazon, Oracle, TCS Digital'
                  },
                  {
                    sector: 'Full Stack & Software Engineering',
                    median: '₹8.8 LPA',
                    highest: '₹44.0 LPA',
                    recruiters: 'Infosys, Cognizant, IBM, Capgemini, Crest Data'
                  },
                  {
                    sector: 'Fintech, Investment Banking & Analytics',
                    median: '₹10.2 LPA',
                    highest: '₹36.5 LPA',
                    recruiters: 'HDFC, Morgan Stanley, Deloitte, EY, KPMG'
                  },
                  {
                    sector: 'EV, Robotics & Industrial Automation',
                    median: '₹7.6 LPA',
                    highest: '₹26.0 LPA',
                    recruiters: 'Tata Motors, L&T, Adani Power, Maruti Suzuki'
                  },
                  {
                    sector: 'UI/UX & Product Design Engineering',
                    median: '₹8.0 LPA',
                    highest: '₹28.0 LPA',
                    recruiters: 'Adobe, Swiggy, Zomato, Reliance Jio, Infosys'
                  }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--re-border-subtle)', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '14px 10px', fontWeight: '800', color: 'var(--re-text-primary)' }}>
                      {row.sector}
                    </td>
                    <td style={{ padding: '14px 10px', fontWeight: '800', color: '#10B981' }}>
                      {row.median}
                    </td>
                    <td style={{ padding: '14px 10px', fontWeight: '800', color: 'var(--re-accent-purple)' }}>
                      {row.highest}
                    </td>
                    <td style={{ padding: '14px 10px', color: 'var(--re-text-secondary)', fontSize: '12.5px' }}>
                      {row.recruiters}
                    </td>
                    <td style={{ padding: '14px 10px' }}>
                      <button
                        onClick={() => {
                          playSound('tap');
                          setQuickMatchOpen(true);
                        }}
                        style={{
                          background: 'var(--re-bg-surface-subtle)',
                          border: '1px solid var(--re-border-subtle)',
                          color: 'var(--re-accent-purple)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        Find Colleges
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
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

      <CompareCollegesModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />
    </div>
  );
}
