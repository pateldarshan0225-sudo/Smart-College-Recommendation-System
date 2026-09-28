import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ruang-edit.css';
import { CollegeNavbar } from '../components/college-reco/CollegeNavbar';
import { AdmissionsRoadmapSection } from '../components/college-reco/AdmissionsRoadmapSection';
import { QuickRecommendationModal } from '../components/college-reco/QuickRecommendationModal';
import { playSound, toggleSound } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Calculator, CheckSquare, HelpCircle, ExternalLink, Calendar, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function RoadmapPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('lavender');
  const [soundOn, setSoundOn] = useState(true);
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);

  const handleOpenAiMatcher = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setQuickMatchOpen(true);
  };

  // Merit Calculator state
  const [boardTheoryMarks, setBoardTheoryMarks] = useState(250); // out of 300
  const [gujcetMarks, setGujcetMarks] = useState(95); // out of 120

  // Checklist state
  const [docs, setDocs] = useState([
    { id: 1, label: '10th (SSC) Original Marksheet & Passing Certificate', checked: true },
    { id: 2, label: '12th (HSC) Science Marksheet & Trial Certificate', checked: true },
    { id: 3, label: 'GUJCET / JEE Main Score Card 2024', checked: true },
    { id: 4, label: 'School Leaving Certificate (LC / Transfer Certificate)', checked: false },
    { id: 5, label: 'Caste Certificate / Non-Creamy Layer (SEBC / EWS) if applicable', checked: false },
    { id: 6, label: 'Income Certificate for MYSY & TFWS 100% Fee Waiver Scheme', checked: false },
    { id: 7, label: 'Passport Size Photographs (4 Copies) & Aadhaar Card Copy', checked: true }
  ]);

  useEffect(() => {
    document.title = 'ACPC 2024-2025 Admissions Roadmap & Merit Guide - Smart College';
    window.scrollTo(0, 0);
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'lavender' ? 'midnight' : 'lavender';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleDocToggle = (id) => {
    playSound('tap');
    setDocs(docs.map((d) => (d.id === id ? { ...d, checked: !d.checked } : d)));
  };

  // Merit Calculation: 50% Board PCM Theory + 50% GUJCET
  const boardPercentage = (boardTheoryMarks / 300) * 100;
  const gujcetPercentage = (gujcetMarks / 120) * 100;
  const acpcMeritMarks = (boardPercentage * 0.5 + gujcetPercentage * 0.5).toFixed(2);

  return (
    <div className="re-app-container" data-theme={theme}>
      <div className="re-ambient-glow" />

      <CollegeNavbar
        activeSection="roadmap"
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
        onOpenQuickMatch={handleOpenAiMatcher}
      />

      <main className="re-page-frame">
        {/* Header Hero */}
        <section className="re-hero-section" style={{ padding: '36px 28px', marginBottom: '28px', textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(124, 109, 175, 0.12)', color: 'var(--re-accent-purple)', fontSize: '11.5px', fontWeight: '800', marginBottom: '12px' }}>
            <GraduationCap size={14} />
            <span>ACPC GUJARAT 2024-2025 COUNSELING HUB</span>
          </div>
          <h1 style={{ fontSize: '34px', fontWeight: '900', color: 'var(--re-text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2, margin: '0 0 10px 0' }}>
            Step-by-Step Admissions & Merit Roadmap
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--re-text-secondary)', lineHeight: 1.6, maxWidth: '760px', margin: 0 }}>
            Navigate the complete Gujarat ACPC counseling lifecycle from initial PIN registration, mock choice filling, seat allotment algorithms, to reporting and token fee verification.
          </p>
        </section>

        {/* 1. Main Interactive Timeline Section */}
        <AdmissionsRoadmapSection onOpenQuickMatch={handleOpenAiMatcher} />

        {/* 2. Merit Calculator & Document Checklist Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginTop: '36px' }}>
          {/* Merit Marks Calculator */}
          <div className="re-card" style={{ padding: '24px', background: 'var(--re-bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Calculator size={18} color="var(--re-accent-purple)" />
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--re-text-primary)', margin: 0 }}>
                ACPC Merit Marks Calculator
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--re-text-muted)', marginBottom: '16px' }}>
              Calculated using the official 50:50 formula (50% Board PCM Theory + 50% GUJCET).
            </p>

            {/* Board Theory Marks */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--re-text-primary)' }}>
                  12th Board PCM Theory Marks (Out of 300):
                </span>
                <span style={{ fontWeight: '800', color: 'var(--re-accent-purple)' }}>{boardTheoryMarks} / 300</span>
              </div>
              <input
                type="range"
                min="105"
                max="300"
                value={boardTheoryMarks}
                onChange={(e) => setBoardTheoryMarks(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--re-accent-purple)', cursor: 'pointer' }}
              />
            </div>

            {/* GUJCET Marks */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--re-text-primary)' }}>
                  GUJCET Marks (Out of 120):
                </span>
                <span style={{ fontWeight: '800', color: '#D97706' }}>{gujcetMarks} / 120</span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                value={gujcetMarks}
                onChange={(e) => setGujcetMarks(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#FFA439', cursor: 'pointer' }}
              />
            </div>

            {/* Result Box */}
            <div style={{ background: 'linear-gradient(135deg, rgba(124, 109, 175, 0.12) 0%, rgba(255, 164, 57, 0.12) 100%)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(124, 109, 175, 0.25)', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--re-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Estimated ACPC Merit Marks
              </div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--re-text-primary)', margin: '4px 0' }}>
                {acpcMeritMarks} <span style={{ fontSize: '18px', color: 'var(--re-text-muted)' }}>/ 100</span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: '700' }}>
                ✓ Strong admission chance for top GTU & Autonomous Colleges
              </div>
            </div>
          </div>

          {/* Document Verification Checklist */}
          <div className="re-card" style={{ padding: '24px', background: 'var(--re-bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={18} color="#10B981" />
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--re-text-primary)', margin: 0 }}>
                  Mandatory Document Checklist
                </h2>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                {docs.filter((d) => d.checked).length} of {docs.length} Ready
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocToggle(doc.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: doc.checked ? 'rgba(16, 185, 129, 0.08)' : 'var(--re-bg-surface-subtle)',
                    border: doc.checked ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--re-border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={doc.checked}
                    onChange={() => {}}
                    style={{ accentColor: '#10B981', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '12.5px', fontWeight: doc.checked ? '700' : '500', color: doc.checked ? 'var(--re-text-primary)' : 'var(--re-text-secondary)', textDecoration: doc.checked ? 'none' : 'none' }}>
                    {doc.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Official Portals & Contact Help */}
        <section style={{ marginTop: '36px', background: 'var(--re-bg-surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--re-border-subtle)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--re-text-primary)', margin: '0 0 16px 0' }}>
            Official Government Portals & Helpline
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <a
              href="https://gujacpc.admissions.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="re-card"
              style={{ padding: '16px', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--re-bg-surface-subtle)' }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--re-text-primary)' }}>
                  ACPC Official Registration Portal
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--re-text-muted)', marginTop: '2px' }}>
                  gujacpc.admissions.nic.in
                </div>
              </div>
              <ExternalLink size={16} color="var(--re-accent-purple)" />
            </a>

            <a
              href="https://mysy.guj.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="re-card"
              style={{ padding: '16px', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--re-bg-surface-subtle)' }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--re-text-primary)' }}>
                  MYSY Scholarship Application Portal
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--re-text-muted)', marginTop: '2px' }}>
                  mysy.guj.nic.in
                </div>
              </div>
              <ExternalLink size={16} color="#FFA439" />
            </a>
          </div>
        </section>
      </main>

      <QuickRecommendationModal
        isOpen={quickMatchOpen}
        onClose={() => setQuickMatchOpen(false)}
      />
    </div>
  );
}
