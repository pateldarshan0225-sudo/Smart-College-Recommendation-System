import React, { useState } from 'react';
import { Calendar, CheckCircle2, ArrowRight, Award, FileText, Compass, DollarSign, ShieldCheck } from 'lucide-react';
import { SparkleStar } from './CollegeSquircles';
import { playSound } from '../../utils/audio';

export const AdmissionsRoadmapSection = ({ onOpenQuickMatch }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Entrance Exams & Merit Calculation',
      subtitle: 'GUJCET / JEE Main / 12th Board Score Assessment',
      duration: 'May - June',
      color: '#7C6DAF',
      icon: <Award size={20} />,
      details: [
        'Merit Rank formula: 50% Board PCM/PCB marks + 50% GUJCET/JEE percentile',
        'Generation of state-wide ACPC general and category merit ranks',
        'Eligibility verification for Engineering (45% for Open, 40% for Reserved categories)'
      ],
      tip: 'Score above 85 percentile to unlock tier-1 autonomous and government engineering seats.'
    },
    {
      step: '02',
      title: 'AI College Choice Filling & Preference Locking',
      subtitle: 'Simulated Choice Ordering & Mock Allotment',
      duration: 'June - July',
      color: '#FFA439',
      icon: <Compass size={20} />,
      details: [
        'Smart AI preference sequencing based on your exact merit rank and budget',
        'Mock Round analysis to predict actual allotment probabilities',
        'Selection between core branches (CSE, IT, AI/ML) and emerging specializations'
      ],
      tip: 'Fill at least 30+ college-branch choices in descending order of ambition to secure your best seat.'
    },
    {
      step: '03',
      title: 'ACPC Round 1 & 2 Allotment & Seat Confirmation',
      subtitle: 'Token Fee Payment & Document Verification',
      duration: 'July - August',
      color: '#35C7B8',
      icon: <CheckCircle2 size={20} />,
      details: [
        'Online admission letter generation upon paying token tuition fee',
        'Option to upgrade in Round 2 while holding Round 1 allotment safety seat',
        'Physical and digital document verification at help centers'
      ],
      tip: 'Never cancel Round 1 allotment before Round 2 confirmation to avoid losing your reserved seat.'
    },
    {
      step: '04',
      title: 'Scholarship Grants & Campus Reporting',
      subtitle: 'MYSY, TFWS & Digital Gujarat Fee Waivers',
      duration: 'August - September',
      color: '#FF6584',
      icon: <DollarSign size={20} />,
      details: [
        'MYSY Scholarship: 50% tuition waiver (up to ₹50,000/yr) for family income < ₹6 LPA',
        'TFWS Scheme: 100% tuition fee waiver for top 5% merit rank holders in each branch',
        'Campus orientation, hostel room allotment, and commencement of academic semester'
      ],
      tip: 'Apply for TFWS during choice filling — it saves up to ₹4 Lakhs in total 4-year tuition fees!'
    }
  ];

  const cur = steps[activeStep];

  return (
    <section className="re-class-section-wrapper" style={{ padding: '40px 36px', marginBottom: '36px' }} aria-label="Admissions Journey Roadmap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="re-interactive-badge" style={{ marginBottom: '8px' }}>
            <Calendar size={12} /> ADMISSION BLUEPRINT 2024-2025
          </div>
          <h2 className="re-section-title">
            Step-by-Step College Admissions Roadmap
          </h2>
        </div>
        <p className="re-section-subtitle">
          Navigate from entrance exam preparation to final university enrollment with verified timelines and cutoffs.
        </p>
      </div>

      {/* 4 Interactive Step Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {steps.map((s, idx) => {
          const isActive = activeStep === idx;
          return (
            <div
              key={s.step}
              onClick={() => {
                playSound('tap');
                setActiveStep(idx);
              }}
              style={{
                background: isActive ? 'var(--re-bg-surface-subtle)' : '#FFFFFF',
                border: `2px solid ${isActive ? s.color : 'var(--re-border-subtle)'}`,
                borderRadius: '18px',
                padding: '18px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: isActive ? `0 8px 24px ${s.color}25` : '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, background: s.color, color: '#FFF', padding: '2px 8px', borderRadius: '999px' }}>
                  PHASE {s.step}
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--re-text-muted)' }}>
                  {s.duration}
                </span>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 4px', lineHeight: 1.3 }}>
                {s.title}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--re-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {s.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Phase Deep Dive Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124, 109, 175, 0.06) 0%, rgba(255, 164, 57, 0.06) 100%)',
        border: `1.5px solid ${cur.color}40`,
        borderRadius: '20px',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: cur.color, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cur.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--re-text-primary)', margin: 0 }}>
                Phase {cur.step}: {cur.title}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--re-text-secondary)' }}>
                Official ACPC / AICTE Counseling Guidelines
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('pop');
              if (onOpenQuickMatch) onOpenQuickMatch();
            }}
            className="re-btn-primary"
            style={{ width: 'auto', padding: '10px 22px', fontSize: '13px' }}
          >
            Calculate My Phase {cur.step} Eligibility ↗
          </button>
        </div>

        {/* Detailed Points */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {cur.details.map((d, i) => (
            <div key={i} style={{ background: '#FFFFFF', border: '1px solid var(--re-border-subtle)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--re-text-primary)', lineHeight: 1.45 }}>
              <CheckCircle2 size={16} color={cur.color} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{d}</span>
            </div>
          ))}
        </div>

        {/* Counselor Pro Tip */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--re-border-subtle)', borderRadius: '12px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--re-text-secondary)' }}>
          <span style={{ fontWeight: 800, color: cur.color }}>💡 ADMISSIONS COUNSELOR TIP:</span>
          <span>{cur.tip}</span>
        </div>
      </div>
    </section>
  );
};
