import React, { useState } from 'react';
import { BookOpen, TrendingUp, Code2, Briefcase, Cpu, Palette, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const StreamCareerExplorer = ({ onSelectCollege }) => {
  const [activeStreamId, setActiveStreamId] = useState('cse');

  const streamData = {
    cse: {
      title: 'Computer Science & Engineering (B.Tech CSE)',
      tag: 'Highest Placement Demand',
      color: '#7C6DAF',
      icon: <Code2 size={22} />,
      medianCTC: '₹14.5 LPA',
      highestCTC: '₹52.0 LPA',
      growthRate: '+24% YoY',
      overview: 'Focuses on scalable algorithms, distributed cloud architectures, operating systems, and full-stack software development.',
      skills: ['Data Structures & Algorithms', 'Cloud Native & Kubernetes', 'System Design', 'Full-Stack React & Node', 'Database Internals'],
      roles: ['Senior Software Engineer', 'Cloud Architect', 'DevOps & SRE Lead', 'Systems Programmer', 'Product Tech Lead'],
      topColleges: ['DA-IICT Gandhinagar', 'Nirma University', 'LDCE Ahmedabad', 'PDEU Gandhinagar', 'CHARUSAT'],
      certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional', 'Certified Kubernetes Administrator']
    },
    ai_ds: {
      title: 'Artificial Intelligence & Data Science (B.Tech AI/DS)',
      tag: 'Fastest Emerging Tech',
      color: '#FFA439',
      icon: <Cpu size={22} />,
      medianCTC: '₹16.0 LPA',
      highestCTC: '₹48.0 LPA',
      growthRate: '+38% YoY',
      overview: 'Deep dive into large language models (LLMs), neural networks, predictive statistical modeling, and computer vision.',
      skills: ['Deep Learning (PyTorch/TensorFlow)', 'LLMs & GenAI Fine-Tuning', 'Big Data Spark & Kafka', 'Statistical Inference', 'Computer Vision'],
      roles: ['AI/ML Engineer', 'Data Scientist', 'LLM Research Specialist', 'NLP Engineer', 'Computer Vision Architect'],
      topColleges: ['DA-IICT Gandhinagar', 'Nirma Institute of Tech', 'Pandit Deendayal Energy Univ', 'BVM Engineering'],
      certifications: ['TensorFlow Developer Certificate', 'DeepLearning.AI Specialization', 'Databricks Certified ML Associate']
    },
    mba: {
      title: 'Master of Business Administration (MBA / PGDM)',
      tag: 'Executive & Strategic Leadership',
      color: '#35C7B8',
      icon: <Briefcase size={22} />,
      medianCTC: '₹12.8 LPA',
      highestCTC: '₹36.0 LPA',
      growthRate: '+18% YoY',
      overview: 'Master financial modeling, strategic market expansion, product management, supply chain analytics, and enterprise leadership.',
      skills: ['Corporate Valuation & DCF', 'Product Strategy & GTM', 'Marketing Analytics', 'Operations & Supply Chain', 'Talent Leadership'],
      roles: ['Product Manager', 'Management Consultant', 'Investment Banking Associate', 'Brand Strategy Director', 'Operations VP'],
      topColleges: ['Nirma University Institute of Management', 'PDEU School of Petroleum Management', 'DA-IICT', 'DDU Nadiad'],
      certifications: ['CFA (Chartered Financial Analyst)', 'PMP (Project Management)', 'Scrum Product Owner (CSPO)']
    },
    cyber_mca: {
      title: 'Master of Computer Applications & Cyber Security (MCA / B.Sc DS)',
      tag: 'Critical Enterprise Security',
      color: '#FF6584',
      icon: <ShieldCheck size={22} />,
      medianCTC: '₹9.5 LPA',
      highestCTC: '₹28.0 LPA',
      growthRate: '+22% YoY',
      overview: 'Focuses on enterprise cloud migration, threat defense, ethical penetration testing, secure software lifecycles, and forensic analysis.',
      skills: ['Threat Intelligence & SIEM', 'Penetration Testing (OSCP)', 'Network Forensics', 'Application Security', 'Zero Trust Architecture'],
      roles: ['SOC Security Analyst', 'Ethical Hacker / Pentester', 'Enterprise Security Architect', 'Cloud Defense Specialist'],
      topColleges: ['DA-IICT', 'LDCE Ahmedabad', 'Gujarat University', 'Marwadi University', 'Silver Oak University'],
      certifications: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'Offensive Security Certified Professional']
    }
  };

  const cur = streamData[activeStreamId];

  return (
    <section className="re-class-section-wrapper" style={{ padding: '40px 36px', marginBottom: '36px' }} aria-label="Stream & Career Outlook Explorer">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="re-interactive-badge" style={{ marginBottom: '8px' }}>
            <BookOpen size={12} /> CAREER OUTLOOK & SPECIALIZATIONS
          </div>
          <h2 className="re-section-title">
            Degree Streams & Industry Career Pathways
          </h2>
        </div>
        <p className="re-section-subtitle">
          Explore curriculum roadmaps, median salaries, verified placement records, and industry certifications.
        </p>
      </div>

      {/* Stream Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '28px' }}>
        {[
          { id: 'cse', label: 'B.Tech Computer Science & ICT' },
          { id: 'ai_ds', label: 'Artificial Intelligence & Data Science' },
          { id: 'mba', label: 'MBA & Business Leadership' },
          { id: 'cyber_mca', label: 'MCA & Cybersecurity Defense' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              playSound('tap');
              setActiveStreamId(item.id);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--re-radius-pill)',
              border: `1.5px solid ${activeStreamId === item.id ? streamData[item.id].color : 'var(--re-border-subtle)'}`,
              background: activeStreamId === item.id ? streamData[item.id].color : 'var(--re-bg-surface-subtle)',
              color: activeStreamId === item.id ? '#FFFFFF' : 'var(--re-text-secondary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: activeStreamId === item.id ? `0 4px 14px ${streamData[item.id].color}35` : 'none'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Deep Dive Panel */}
      <div style={{
        background: 'var(--re-bg-surface-subtle)',
        border: '1px solid var(--re-border-subtle)',
        borderRadius: '24px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Top Header of Selected Stream */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: cur.color, color: '#FFF', fontSize: '11.5px', fontWeight: 800, padding: '3px 12px', borderRadius: '999px', marginBottom: '8px' }}>
              <span>{cur.tag}</span>
              <span>•</span>
              <span>Growth: {cur.growthRate}</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 6px' }}>
              {cur.title}
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--re-text-secondary)', margin: 0, maxWidth: '780px', lineHeight: 1.5 }}>
              {cur.overview}
            </p>
          </div>

          {/* Salary Metrics Pill */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--re-border-subtle)', borderRadius: '16px', padding: '14px 20px', display: 'flex', gap: '20px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div>
              <div style={{ fontSize: '10.5px', color: 'var(--re-text-muted)', fontWeight: 700 }}>MEDIAN CTC</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: cur.color }}>{cur.medianCTC}</div>
            </div>
            <div style={{ width: '1px', background: 'var(--re-border-subtle)' }} />
            <div>
              <div style={{ fontSize: '10.5px', color: 'var(--re-text-muted)', fontWeight: 700 }}>HIGHEST RECORD</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFA439' }}>{cur.highestCTC}</div>
            </div>
          </div>
        </div>

        {/* 3-Column Feature Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Col 1: High-Demand Skills */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--re-border-subtle)', borderRadius: '18px', padding: '20px' }}>
            <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code2 size={16} color={cur.color} /> Core Tech Stacks & Skills
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cur.skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--re-text-primary)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cur.color }} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Top Job Roles */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--re-border-subtle)', borderRadius: '18px', padding: '20px' }}>
            <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={16} color={cur.color} /> Career Positions & Roles
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cur.roles.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--re-text-primary)' }}>
                  <Check size={14} color="#35C7B8" strokeWidth={3} />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Premier Colleges */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--re-border-subtle)', borderRadius: '18px', padding: '20px' }}>
            <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} color={cur.color} /> Premier Accredited Colleges
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cur.topColleges.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--re-text-primary)', background: 'var(--re-bg-surface-subtle)', padding: '6px 10px', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 700 }}>{c}</span>
                  <span style={{ fontSize: '10.5px', color: cur.color, fontWeight: 800 }}>ACPC Cutoff ⭐</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
