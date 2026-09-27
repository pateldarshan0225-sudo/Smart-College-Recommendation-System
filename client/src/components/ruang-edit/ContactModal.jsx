import React, { useState } from 'react';
import { X, Send, Mail, MessageCircle, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Course Inquiry', message: '' });
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    playSound('success');
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    playSound('pop');
    setIsSent(false);
    onClose();
  };

  return (
    <div className="re-modal-backdrop" onClick={handleClose}>
      <div className="re-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="re-modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {!isSent ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="re-interactive-badge" style={{ marginBottom: '8px' }}>
                <MessageCircle size={12} /> GET IN TOUCH
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', color: 'var(--re-text-primary)' }}>
                Contact Ruang Edit Team
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--re-text-secondary)', margin: 0 }}>
                Have questions about our design courses, corporate workshops, or community?
              </p>
            </div>

            {/* Quick Contact Chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
              <a
                href="mailto:hello@ruangedit.design"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'var(--re-bg-surface-subtle)',
                  border: '1px solid var(--re-border-subtle)',
                  textDecoration: 'none',
                  color: 'var(--re-text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#7C6DAF', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={14} />
                </div>
                <span>hello@ruangedit.com</span>
              </a>

              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'var(--re-bg-surface-subtle)',
                  border: '1px solid var(--re-border-subtle)',
                  textDecoration: 'none',
                  color: 'var(--re-text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#25D366', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={14} />
                </div>
                <span>Direct WhatsApp Chat</span>
              </a>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div className="re-form-group">
                  <label className="re-form-label">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="re-form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="re-form-group">
                  <label className="re-form-label">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@domain.com"
                    className="re-form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="re-form-group">
                <label className="re-form-label">Subject</label>
                <select
                  className="re-form-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Course Inquiry">Course Curriculum & Enrollment</option>
                  <option value="Mentorship">1-on-1 Portfolio Review</option>
                  <option value="Corporate">Team / Company Training</option>
                  <option value="Community">Community Partnership</option>
                </select>
              </div>

              <div className="re-form-group">
                <label className="re-form-label">Message</label>
                <textarea
                  rows="3"
                  required
                  placeholder="How can we help you level up your design skills?"
                  className="re-form-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button className="re-btn-primary" type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Send size={16} /> Send Message to Mentors
              </button>
            </form>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginTop: '20px',
              fontSize: '11px',
              color: 'var(--re-text-muted)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> Response in &lt; 2 hours
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> Jakarta • Singapore • Tokyo
              </span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <CheckCircle2 size={54} color="#35C7B8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px', color: 'var(--re-text-primary)' }}>
              Message Received! 🚀
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--re-text-secondary)', margin: 0 }}>
              Thanks {formData.name}, a Ruang Edit instructor will reach out to you shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
