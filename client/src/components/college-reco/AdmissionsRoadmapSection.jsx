import React, { useState } from 'react';
import { Calendar, CheckCircle2, Award, Compass, DollarSign, Lightbulb, ArrowRight, Check, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const AdmissionsRoadmapSection = ({ onOpenQuickMatch }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Entrance Exams & Merit Calculation',
      subtitle: 'GUJCET / JEE Main / 12th Board Score Assessment',
      summary: 'Assessment of 12th Board marks & GUJCET percentiles to compute your state ACPC merit rank.',
      duration: 'May – June',
      color: '#FF6584',
      numColor: '#C84630',
      textColor: '#4A201A',
      tapeColor: 'linear-gradient(135deg, rgba(248, 125, 110, 0.88) 0%, rgba(239, 68, 68, 0.78) 100%)',
      tapeAngle: '-2.2deg',
      cardTilt: '-3deg',
      bgGradient: 'linear-gradient(180deg, #FFF0EE 0%, #FFE2DF 100%)',
      glow: 'rgba(248, 113, 113, 0.35)',
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
      title: 'AI College Choice Filling & Locking',
      subtitle: 'Simulated Choice Ordering & Mock Allotment',
      summary: 'Smart AI preference sequencing based on your rank and simulated mock round probabilities.',
      duration: 'June – July',
      color: '#34A853',
      numColor: '#1E7E44',
      textColor: '#133E23',
      tapeColor: 'linear-gradient(135deg, rgba(82, 196, 120, 0.88) 0%, rgba(34, 197, 94, 0.78) 100%)',
      tapeAngle: '2deg',
      cardTilt: '2deg',
      bgGradient: 'linear-gradient(180deg, #EDFAF2 0%, #DCF5E4 100%)',
      glow: 'rgba(74, 222, 128, 0.35)',
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
      title: 'ACPC Seat Allotment & Confirmation',
      subtitle: 'Token Fee Payment & Document Verification',
      summary: 'Round 1 & 2 seat allocation, online token fee payment, and help center verification.',
      duration: 'July – August',
      color: '#E5B634',
      numColor: '#9E700E',
      textColor: '#423007',
      tapeColor: 'linear-gradient(135deg, rgba(246, 206, 85, 0.92) 0%, rgba(234, 179, 8, 0.82) 100%)',
      tapeAngle: '-1.6deg',
      cardTilt: '-1.8deg',
      bgGradient: 'linear-gradient(180deg, #FEF9E7 0%, #FDF0C3 100%)',
      glow: 'rgba(250, 204, 21, 0.35)',
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
      summary: 'Claim 100% tuition waivers through TFWS/MYSY, campus reporting, and final enrollment.',
      duration: 'August – Sept',
      color: '#35C7B8',
      numColor: '#167D94',
      textColor: '#0C3E4A',
      tapeColor: 'linear-gradient(135deg, rgba(87, 199, 219, 0.88) 0%, rgba(20, 184, 166, 0.78) 100%)',
      tapeAngle: '2.6deg',
      cardTilt: '3.2deg',
      bgGradient: 'linear-gradient(180deg, #EAF7FB 0%, #D2F2F8 100%)',
      glow: 'rgba(56, 189, 248, 0.35)',
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
    <section className="re-roadmap-board" aria-label="Admissions Journey Roadmap">
      {/* Top Left Folder Tab Badge */}
      <div className="re-roadmap-folder-tab">
        <span>#DELIVER</span>
      </div>

      {/* Centered Heading & Subtitle */}
      <div className="re-roadmap-header">
        <h2 className="re-roadmap-title">
          Step-by-Step College Admissions Roadmap
        </h2>
        <p className="re-roadmap-subtitle">
          Navigate from entrance exam preparation to final university enrollment with verified timelines and cutoffs.
        </p>
      </div>

      {/* 4 Taped Sticky Notes */}
      <div className="re-sticky-grid">
        {steps.map((s, idx) => {
          const isActive = activeStep === idx;
          return (
            <div
              key={s.step}
              className={`re-sticky-card ${isActive ? 'active' : ''}`}
              onClick={() => {
                playSound('tap');
                setActiveStep(idx);
              }}
              style={{
                transform: `rotate(${s.cardTilt})`,
                '--card-glow': s.glow,
                '--card-accent': s.numColor
              }}
            >
              {/* Realistic Washi Tape at Top */}
              <div
                className="re-washi-tape"
                style={{
                  background: s.tapeColor,
                  transform: `translateX(-50%) rotate(${s.tapeAngle})`
                }}
              />

              {/* Inner Pastel Note Canvas */}
              <div
                className="re-sticky-inner"
                style={{
                  background: s.bgGradient,
                  color: s.textColor
                }}
              >
                {/* Large Distinct Number */}
                <div
                  className="re-sticky-number"
                  style={{ color: s.numColor }}
                >
                  {s.step}
                </div>

                {/* Title */}
                <h3
                  className="re-sticky-title"
                  style={{ color: s.textColor }}
                >
                  {s.title}
                </h3>

                {/* Short Description */}
                <p
                  className="re-sticky-desc"
                  style={{ color: s.textColor, opacity: 0.9 }}
                >
                  {s.summary}
                </p>

                {/* Footer Pill */}
                <div
                  className="re-sticky-footer"
                  style={{ color: s.numColor }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} /> {s.duration}
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isActive ? '● Active Phase' : 'View Details →'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Phase Deep Dive Card */}
      <div
        className="re-roadmap-detail-panel"
        key={activeStep}
        style={{
          borderLeft: `5px solid ${cur.numColor}`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: cur.numColor,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 6px 16px ${cur.glow}`
              }}
            >
              {cur.icon}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: cur.numColor, background: `${cur.numColor}15`, padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Phase {cur.step} • {cur.duration}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--re-text-muted)', fontWeight: 600 }}>
                  Official ACPC Guidelines
                </span>
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--re-text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                {cur.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('pop');
              if (onOpenQuickMatch) onOpenQuickMatch();
            }}
            className="re-btn-primary"
            style={{
              width: 'auto',
              padding: '11px 24px',
              fontSize: '13.5px',
              background: cur.numColor,
              boxShadow: `0 6px 20px ${cur.glow}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Calculate Phase {cur.step} Eligibility</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 3 Detailed Checkpoints */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {cur.details.map((d, i) => (
            <div
              key={i}
              style={{
                background: 'var(--re-bg-surface-subtle)',
                border: '1px solid var(--re-border-subtle)',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '13px',
                color: 'var(--re-text-primary)',
                lineHeight: 1.45
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: `${cur.numColor}18`,
                  color: cur.numColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}
              >
                <Check size={11} strokeWidth={3} />
              </div>
              <span>{d}</span>
            </div>
          ))}
        </div>

        {/* Admissions Counselor Pro-Tip */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 164, 57, 0.08) 0%, rgba(124, 109, 175, 0.05) 100%)',
            border: '1px solid rgba(255, 164, 57, 0.25)',
            borderRadius: '14px',
            padding: '13px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            color: 'var(--re-text-primary)'
          }}
        >
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255, 164, 57, 0.2)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lightbulb size={14} />
          </div>
          <div>
            <span style={{ fontWeight: 800, color: '#D97706', marginRight: '6px' }}>COUNSELOR TIP:</span>
            <span style={{ color: 'var(--re-text-secondary)' }}>{cur.tip}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

