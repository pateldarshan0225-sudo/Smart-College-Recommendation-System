import React, { useState } from 'react';
import { X, Check, Sparkles, Rocket, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const JoinUsModal = ({ isOpen, onClose, defaultTrack = 'all' }) => {
  const [step, setStep] = useState(1);
  const [track, setTrack] = useState(defaultTrack);
  const [experience, setExperience] = useState('beginner');
  const [formData, setFormData] = useState({ name: '', email: '', portfolio: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    playSound('click');
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    playSound('click');
    setStep((s) => s - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playSound('success');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleClose = () => {
    playSound('pop');
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="re-modal-backdrop" onClick={handleClose}>
      <div className="re-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="re-modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {!submitted ? (
          <div>
            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="re-interactive-badge" style={{ marginBottom: '8px' }}>
                <Sparkles size={12} /> RUANG EDIT ACADEMY 2024
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', color: 'var(--re-text-primary)' }}>
                {step === 1 && 'Choose Your Creative Track'}
                {step === 2 && 'Tell Us About Your Experience'}
                {step === 3 && 'Complete Your Registration'}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--re-text-secondary)', margin: 0 }}>
                Join 2,400+ designers leveling up their visual craft.
              </p>
            </div>

            {/* Step Progress Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  style={{
                    height: '4px',
                    width: '40px',
                    borderRadius: '2px',
                    background: step >= num ? 'var(--re-accent-purple)' : 'var(--re-border-medium)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

            {/* STEP 1: TRACK SELECTION */}
            {step === 1 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { id: 'uiux', title: 'UI/UX Design', desc: 'Figma, Design Systems, Mobile & Web UI', color: '#7C6DAF' },
                    { id: 'motion', title: 'Motion Graphics', desc: 'After Effects, 2D/3D Animation, Lottie', color: '#FFA439' },
                    { id: 'visual', title: 'Visual Identity', desc: 'Branding, Typography, Art Direction', color: '#35C7B8' },
                    { id: 'all', title: 'Masterclass Bundle', desc: 'All 3 tracks + 1-on-1 mentorship', color: '#FF6584' }
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        playSound('pop');
                        setTrack(item.id);
                      }}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        border: `2px solid ${track === item.id ? item.color : 'var(--re-border-subtle)'}`,
                        background: track === item.id ? 'var(--re-bg-surface-subtle)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        boxShadow: track === item.id ? `0 6px 18px ${item.color}30` : 'none'
                      }}
                    >
                      {track === item.id && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: item.color,
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                      <h4 style={{ margin: '0 0 4px', fontSize: '14.5px', fontWeight: 800, color: 'var(--re-text-primary)' }}>
                        {item.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--re-text-secondary)', lineHeight: 1.35 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <button className="re-btn-primary" onClick={handleNext}>
                  Continue to Experience Level <ArrowRight size={16} style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
                </button>
              </div>
            )}

            {/* STEP 2: EXPERIENCE LEVEL */}
            {step === 2 && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {[
                    { id: 'beginner', title: 'Curious Beginner', desc: 'Starting from scratch or transitioning into product design' },
                    { id: 'intermediate', title: 'Practicing Designer (1-3 yrs)', desc: 'Want to hone polish, speed, systems and animation' },
                    { id: 'advanced', title: 'Senior / Lead Creator', desc: 'Looking for advanced creative direction and elite portfolio refinement' }
                  ].map((lvl) => (
                    <div
                      key={lvl.id}
                      onClick={() => {
                        playSound('pop');
                        setExperience(lvl.id);
                      }}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '14px',
                        border: `1.5px solid ${experience === lvl.id ? 'var(--re-accent-purple)' : 'var(--re-border-subtle)'}`,
                        background: experience === lvl.id ? 'rgba(124, 109, 175, 0.08)' : 'var(--re-bg-surface-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--re-text-primary)', marginBottom: '2px' }}>
                          {lvl.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--re-text-secondary)' }}>
                          {lvl.desc}
                        </div>
                      </div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '2px solid var(--re-accent-purple)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: experience === lvl.id ? 'var(--re-accent-purple)' : 'transparent',
                        color: '#FFFFFF'
                      }}>
                        {experience === lvl.id && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleBack}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: 'var(--re-radius-pill)',
                      border: '1.5px solid var(--re-border-medium)',
                      background: 'transparent',
                      color: 'var(--re-text-primary)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button style={{ flex: 2 }} className="re-btn-primary" onClick={handleNext}>
                    Next: Personal Info
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: USER DETAILS */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <div className="re-form-group">
                  <label className="re-form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    className="re-form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="re-form-group">
                  <label className="re-form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    className="re-form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="re-form-group">
                  <label className="re-form-label">Portfolio / Social URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://dribbble.com/yourhandle"
                    className="re-form-input"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={handleBack}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: 'var(--re-radius-pill)',
                      border: '1.5px solid var(--re-border-medium)',
                      background: 'transparent',
                      color: 'var(--re-text-primary)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button style={{ flex: 2 }} className="re-btn-primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Securing Spot...' : 'Claim Academy Access ✨'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* SUCCESS STATE */
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFA439, #FF7597)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(255, 164, 57, 0.4)'
            }}>
              <Rocket size={32} />
            </div>

            <h3 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 10px', color: 'var(--re-text-primary)' }}>
              Welcome to Ruang Edit, {formData.name || 'Creator'}! 🎉
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--re-text-secondary)', lineHeight: 1.5, maxWidth: '420px', margin: '0 auto 24px' }}>
              Your spot in the <strong>{track.toUpperCase()}</strong> design class has been registered. Check your inbox at <strong>{formData.email || 'your email'}</strong> for the invitation link and starter kit.
            </p>

            <div style={{
              background: 'var(--re-bg-surface-subtle)',
              border: '1px solid var(--re-border-subtle)',
              borderRadius: '16px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '24px',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--re-text-primary)'
            }}>
              <ShieldCheck size={18} color="#35C7B8" /> 100% Free Community Membership Active
            </div>

            <button className="re-btn-primary" onClick={handleClose}>
              Explore Workspace Dashboard 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
