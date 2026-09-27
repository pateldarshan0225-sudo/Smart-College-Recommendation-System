import React, { useState } from 'react';
import {
  Mail,
  MessageCircle,
  Sparkles,
  Users,
  Award,
  BookOpen,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { SparkleStar } from './SquircleArtworks';
import { playSound } from '../../utils/audio';

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const CommunitySection = ({ onOpenJoin, onOpenContact, onOpenShowcase }) => {
  const [activeTab, setActiveTab] = useState('impact');
  const [openFaq, setOpenFaq] = useState(null);

  const handleTabSwitch = (tab) => {
    playSound('tap');
    setActiveTab(tab);
  };

  const toggleFaq = (index) => {
    playSound('pop');
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="re-community-wrapper" id="community-section" aria-label="Community & Value Proposition">
      {/* Top Right Mini Nav Arrows (Exact visual in template) */}
      <div className="re-community-top-nav">
        <button
          className="re-nav-micro-btn"
          onClick={() => {
            playSound('tap');
            const tabs = ['impact', 'pricing', 'reviews', 'faq'];
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
            const tabs = ['impact', 'pricing', 'reviews', 'faq'];
            const idx = tabs.indexOf(activeTab);
            setActiveTab(tabs[(idx + 1) % tabs.length]);
          }}
          title="Next tab"
          aria-label="Next tab"
        >
          →
        </button>
      </div>

      {/* Main Community Card */}
      <div className="re-community-card">
        {/* Floating Sparkles inside card */}
        <div style={{ position: 'absolute', top: '24px', left: '28px', pointerEvents: 'none' }}>
          <SparkleStar size={20} color="#8A78B8" />
        </div>
        <div style={{ position: 'absolute', bottom: '80px', right: '28px', pointerEvents: 'none' }}>
          <SparkleStar size={22} color="#8A78B8" />
        </div>

        {/* Tag (Exact text from uploaded design) */}
        <div className="re-community-tag">
          - Ruang Edit Class -
        </div>

        {/* Headline (Exact text & highlight badge from uploaded design) */}
        <h2 className="re-community-headline">
          Helps you learn and hone your skills through a trusted{' '}
          <span className="re-text-highlight-badge">Ruang Edit</span> community
        </h2>

        {/* Subtext (Exact text from uploaded design) */}
        <p className="re-community-subtext">
          Come join us and not only increase your knowledge but also your family because we are solid team
        </p>

        {/* Interactive Feature Tabs */}
        <div className="re-community-tabs">
          <button
            className={`re-tab-pill ${activeTab === 'impact' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('impact')}
          >
            Community Impact
          </button>
          <button
            className={`re-tab-pill ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('pricing')}
          >
            Membership Plans
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
            FAQ
          </button>
        </div>

        {/* TAB 1: COMMUNITY IMPACT STATS */}
        {activeTab === 'impact' && (
          <div>
            <div className="re-community-stats-grid">
              <div className="re-stat-card">
                <div className="re-stat-number" style={{ color: '#7C6DAF' }}>2,450+</div>
                <div className="re-stat-title">Active Creators</div>
              </div>
              <div className="re-stat-card">
                <div className="re-stat-number" style={{ color: '#FFA439' }}>500+</div>
                <div className="re-stat-title">Tutorial Modules</div>
              </div>
              <div className="re-stat-card">
                <div className="re-stat-number" style={{ color: '#35C7B8' }}>98.4%</div>
                <div className="re-stat-title">Job Placement Rate</div>
              </div>
              <div className="re-stat-card">
                <div className="re-stat-number" style={{ color: '#FF6584' }}>4.9 / 5</div>
                <div className="re-stat-title">Community Rating</div>
              </div>
            </div>

            {/* Quick Banner Callout */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124, 109, 175, 0.08) 0%, rgba(255, 164, 57, 0.08) 100%)',
              border: '1px solid var(--re-border-subtle)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--re-text-primary)' }}>
                  Weekly Live Mentorship & Design Critiques ✨
                </div>
                <div style={{ fontSize: '12px', color: 'var(--re-text-secondary)' }}>
                  Every Thursday • Direct feedback on your Figma, AE & brand project files.
                </div>
              </div>

              <button
                onClick={() => {
                  playSound('pop');
                  onOpenShowcase();
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid var(--re-border-medium)',
                  padding: '8px 16px',
                  borderRadius: 'var(--re-radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: 'var(--re-text-primary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                View Hall of Fame <ExternalLink size={13} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MEMBERSHIP PLANS */}
        {activeTab === 'pricing' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px', textAlign: 'left' }}>
            {/* Free */}
            <div style={{
              background: 'var(--re-bg-surface-subtle)',
              border: '1px solid var(--re-border-subtle)',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--re-accent-purple)', textTransform: 'uppercase' }}>Community Tier</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0 12px', color: 'var(--re-text-primary)' }}>Free Starter</h3>
                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--re-text-primary)', marginBottom: '14px' }}>$0 <span style={{ fontSize: '12px', color: 'var(--re-text-muted)', fontWeight: 500 }}>/ forever</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--re-text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#35C7B8" /> 50+ Intro design lessons</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#35C7B8" /> Discord Community Access</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#35C7B8" /> Weekly design challenge</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  playSound('pop');
                  onOpenJoin();
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--re-radius-pill)',
                  border: '1.5px solid var(--re-border-medium)',
                  background: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Join Free Community
              </button>
            </div>

            {/* Pro Designer (Popular) */}
            <div style={{
              background: 'linear-gradient(145deg, #745eae 0%, #60489b 100%)',
              color: '#FFFFFF',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 12px 30px rgba(112, 90, 168, 0.35)',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '-10px', right: '16px', background: '#FFA439', color: '#1A1433', fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
                MOST POPULAR
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFD166', textTransform: 'uppercase' }}>Pro Designer</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0 12px', color: '#FFFFFF' }}>All-Access Pass</h3>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>$19 <span style={{ fontSize: '12px', color: '#E4DDF7', fontWeight: 500 }}>/ month</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#F2EDFA' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#FFA439" /> Full UI/UX, Motion & Visual tracks</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#FFA439" /> 120+ Downloadable Figma & AE kits</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#FFA439" /> Weekly live mentor critiques</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#FFA439" /> Certificate of Mastery</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  playSound('pop');
                  onOpenJoin();
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--re-radius-pill)',
                  border: 'none',
                  background: '#FFA439',
                  color: '#1A1433',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(255, 164, 57, 0.4)'
                }}
              >
                Enroll Pro Access ✨
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT TESTIMONIALS */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '32px', textAlign: 'left' }}>
            {[
              {
                name: 'Farhan Maulana',
                role: 'Product Designer at Techstars',
                quote: 'Ruang Edit completely shifted how I approach interaction design. The Figma component architecture lessons alone doubled my speed.',
                avatar: 'FM',
                color: '#7C6DAF'
              },
              {
                name: 'Natasya Putri',
                role: 'Motion Lead at Studio Loop',
                quote: 'The motion graphics module gave me the confidence to build interactive micro-animations for real mobile apps. The community is super supportive!',
                avatar: 'NP',
                color: '#FFA439'
              },
              {
                name: 'Daniel Chen',
                role: 'Freelance Brand Identity Designer',
                quote: 'Best investment of the year. The templates, live critiques, and feedback helped me land $4k+ branding projects.',
                avatar: 'DC',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: rev.color, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                    {rev.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--re-text-primary)' }}>{rev.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--re-text-muted)' }}>{rev.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: FAQS */}
        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', textAlign: 'left' }}>
            {[
              { q: 'Do I need prior design experience to join Ruang Edit?', a: 'No! Our classes are structured with foundational modules for beginners, progressively leveling up to advanced design systems and motion physics.' },
              { q: 'What software will I use in these classes?', a: 'You will primarily use Figma (free), After Effects, and standard vector tools. All exercise files and templates are provided.' },
              { q: 'Is there a money-back guarantee?', a: 'Yes! We offer a 14-day 100% satisfaction guarantee. If you are not delighted with your learning experience, we will refund you in full.' }
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
            Part of Ruang Edit
          </div>

          {/* Center Social Links */}
          <div className="re-footer-center" aria-label="Social media links">
            <button
              className="re-social-icon-btn"
              onClick={() => {
                playSound('tap');
                onOpenContact();
              }}
              title="Email Us"
              aria-label="Email"
            >
              <Mail size={16} />
            </button>

            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="re-social-icon-btn"
              title="WhatsApp Community"
              aria-label="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="re-social-icon-btn"
              title="Instagram @ruangedit"
              aria-label="Instagram"
            >
              <InstagramIcon size={16} />
            </a>
          </div>

          {/* Right Attribution & Year (Exact text from uploaded design) */}
          <div className="re-footer-right">
            Archived by ashzahh • 2024
          </div>
        </div>
      </div>
    </section>
  );
};
