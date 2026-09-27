import React, { useState, useEffect } from 'react';
import '../styles/ruang-edit.css';
import { CollegeNavbar } from '../components/college-reco/CollegeNavbar';
import { ScholarshipCalculatorSection } from '../components/college-reco/ScholarshipCalculatorSection';
import { QuickRecommendationModal } from '../components/college-reco/QuickRecommendationModal';
import { playSound, toggleSound } from '../utils/audio';
import { Award, ShieldCheck, CheckCircle2, FileText, ExternalLink, HelpCircle, ArrowUpRight } from 'lucide-react';

export default function ScholarshipsPage() {
  const [theme, setTheme] = useState('lavender');
  const [soundOn, setSoundOn] = useState(true);
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);

  useEffect(() => {
    document.title = 'MYSY & Gujarat Government Scholarships - Smart College';
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

  return (
    <div className="re-app-container" data-theme={theme}>
      <div className="re-ambient-glow" />

      <CollegeNavbar
        activeSection="scholarships"
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
        onOpenQuickMatch={() => setQuickMatchOpen(true)}
      />

      <main className="re-page-frame">
        {/* Header Hero */}
        <section className="re-hero-section" style={{ padding: '36px 28px', marginBottom: '28px', textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(255, 164, 57, 0.16)', color: '#D97706', fontSize: '11.5px', fontWeight: '800', marginBottom: '12px' }}>
            <Award size={14} />
            <span>MYSY • TFWS • DIGITAL GUJARAT SCHOLARSHIPS</span>
          </div>
          <h1 style={{ fontSize: '34px', fontWeight: '900', color: 'var(--re-text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2, margin: '0 0 10px 0' }}>
            Tuition Fee Waivers & Government Grants Portal
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--re-text-secondary)', lineHeight: 1.6, maxWidth: '760px', margin: 0 }}>
            Calculate your exact MYSY government grant entitlement (up to ₹2.0 Lakhs/year), TFWS 100% tuition waiver eligibility, and Digital Gujarat reserved category scholarship benefits.
          </p>
        </section>

        {/* 1. Main Interactive Scholarship Calculator */}
        <ScholarshipCalculatorSection onOpenQuickMatch={() => setQuickMatchOpen(true)} />

        {/* 2. Comprehensive Scholarship Schemes Comparison Cards */}
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--re-text-primary)', marginBottom: '20px' }}>
            Major Financial Aid & Fee Waiver Programs
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Scheme 1: MYSY */}
            <div className="re-card" style={{ padding: '24px', background: 'var(--re-bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(124, 109, 175, 0.14)', color: 'var(--re-accent-purple)' }}>
                  GOVERNMENT OF GUJARAT
                </span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#10B981' }}>Up to ₹2,00,000 / yr</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--re-text-primary)', margin: '0 0 8px 0' }}>
                Mukhyamantri Yuva Swavalamban Yojana (MYSY)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--re-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                50% of annual tuition fees (up to ₹2 Lakhs) for Degree Engineering/Medical and ₹25,000 for Diploma students.
              </p>
              <div style={{ fontSize: '12px', color: 'var(--re-text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--re-border-subtle)', paddingTop: '12px' }}>
                <div><strong>Criteria:</strong> ≥ 80th Percentile in 12th Board</div>
                <div><strong>Income:</strong> ≤ ₹6,00,000 annual family income</div>
                <div><strong>Extra:</strong> ₹10,000/yr hostel assistance + ₹10,000 book grant</div>
              </div>
            </div>

            {/* Scheme 2: TFWS */}
            <div className="re-card" style={{ padding: '24px', background: 'var(--re-bg-surface)', border: '1.5px solid #FFA439' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255, 164, 57, 0.2)', color: '#D97706' }}>
                  AICTE & ACPC MERIT
                </span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#D97706' }}>100% Free Tuition</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--re-text-primary)', margin: '0 0 8px 0' }}>
                Tuition Fee Waiver Scheme (TFWS)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--re-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                5% supernumerary seats in every college/branch are 100% tuition-free for high-merit candidates across all categories.
              </p>
              <div style={{ fontSize: '12px', color: 'var(--re-text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--re-border-subtle)', paddingTop: '12px' }}>
                <div><strong>Criteria:</strong> Top 5% merit in ACPC choice filling</div>
                <div><strong>Income:</strong> ≤ ₹8,00,000 annual family income</div>
                <div><strong>Tuition Fee:</strong> ₹0 for all 4 years of B.Tech</div>
              </div>
            </div>

            {/* Scheme 3: Digital Gujarat */}
            <div className="re-card" style={{ padding: '24px', background: 'var(--re-bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                  SOCIAL WELFARE DEPT
                </span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#10B981' }}>100% Reimbursement</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--re-text-primary)', margin: '0 0 8px 0' }}>
                Digital Gujarat Post-Matric & Freeship
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--re-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                Complete fee reimbursement and living stipend for SC, ST, SEBC, and EWS students studying in accredited colleges.
              </p>
              <div style={{ fontSize: '12px', color: 'var(--re-text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--re-border-subtle)', paddingTop: '12px' }}>
                <div><strong>Freeship Card:</strong> Zero upfront fee at admission for SC/ST</div>
                <div><strong>SEBC / OBC:</strong> ₹50,000/yr tuition + food bill grant</div>
                <div><strong>Portal:</strong> digitalgujarat.gov.in</div>
              </div>
            </div>
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
