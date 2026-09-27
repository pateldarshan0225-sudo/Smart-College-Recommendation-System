import React, { useState } from 'react';
import { X, ExternalLink, Heart, Sparkles, Award } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const ShowcaseModal = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [likes, setLikes] = useState({ 1: 142, 2: 98, 3: 215, 4: 176 });

  if (!isOpen) return null;

  const projects = [
    {
      id: 1,
      title: 'Finflow Neo-Banking App & Design System',
      student: 'Nadia S. • UI/UX Track',
      category: 'uiux',
      gradient: 'linear-gradient(135deg, #7C6DAF, #5A4791)',
      stats: 'Figma Auto-Layout 5.0 • 42 Screens',
      award: 'Best UX Architecture 2024'
    },
    {
      id: 2,
      title: 'Aether 3D Character & Lottie Onboarding',
      student: 'Raditya K. • Motion Track',
      category: 'motion',
      gradient: 'linear-gradient(135deg, #FFA439, #FF6584)',
      stats: 'After Effects + Cinema4D Lite • 60fps',
      award: 'Featured on LottieFiles'
    },
    {
      id: 3,
      title: 'Botanica Heritage Organic Brand Identity',
      student: 'Clarissa M. • Visual Identity Track',
      category: 'visual',
      gradient: 'linear-gradient(135deg, #35C7B8, #0E8388)',
      stats: 'Typography System & 3D Packaging',
      award: 'Dribbble Weekly Top Shot'
    },
    {
      id: 4,
      title: 'Pulse AI Audio Workstation Interface',
      student: 'Bima W. • UI/UX Track',
      category: 'uiux',
      gradient: 'linear-gradient(135deg, #2E1F5E, #7C6DAF)',
      stats: 'SaaS Design System & Dark Mode Spec',
      award: 'Design System of the Month'
    }
  ];

  const filtered = activeCategory === 'all' ? projects : projects.filter((p) => p.category === activeCategory);

  const handleLike = (id) => {
    playSound('pop');
    setLikes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleClose = () => {
    playSound('pop');
    onClose();
  };

  return (
    <div className="re-modal-backdrop" onClick={handleClose}>
      <div className="re-modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <button className="re-modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="re-interactive-badge" style={{ marginBottom: '8px' }}>
            <Award size={12} /> STUDENT HALL OF FAME
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', color: 'var(--re-text-primary)' }}>
            Real Work Built in Ruang Edit Classes
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--re-text-secondary)', margin: 0 }}>
            Every project was created by students following our step-by-step curriculum.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'uiux', label: 'UI/UX Design' },
            { id: 'motion', label: 'Motion Graphics' },
            { id: 'visual', label: 'Visual Identity' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playSound('tap');
                setActiveCategory(cat.id);
              }}
              style={{
                background: activeCategory === cat.id ? 'var(--re-accent-purple)' : 'var(--re-bg-surface-subtle)',
                color: activeCategory === cat.id ? '#FFF' : 'var(--re-text-secondary)',
                border: '1px solid var(--re-border-subtle)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '24px' }}>
          {filtered.map((proj) => (
            <div
              key={proj.id}
              style={{
                background: 'var(--re-bg-surface-subtle)',
                border: '1px solid var(--re-border-subtle)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Thumbnail Visual */}
              <div style={{
                height: '130px',
                background: proj.gradient,
                padding: '12px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#FFFFFF'
              }}>
                <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '999px', alignSelf: 'flex-start', fontWeight: 700 }}>
                  ✦ {proj.award}
                </span>

                <div style={{ fontSize: '11px', opacity: 0.9, fontWeight: 600 }}>
                  {proj.stats}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: 'var(--re-text-primary)' }}>
                    {proj.title}
                  </h4>
                  <div style={{ fontSize: '11.5px', color: 'var(--re-text-secondary)' }}>
                    {proj.student}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--re-border-subtle)' }}>
                  <button
                    onClick={() => handleLike(proj.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11.5px',
                      color: 'var(--re-accent-pink)',
                      cursor: 'pointer',
                      fontWeight: 700
                    }}
                  >
                    <Heart size={14} fill="currentColor" /> {likes[proj.id]}
                  </button>

                  <span style={{ fontSize: '11px', color: 'var(--re-accent-purple)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    Verified Grad <Sparkles size={10} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="re-btn-primary" onClick={handleClose}>
          Got It, Level Up My Portfolio!
        </button>
      </div>
    </div>
  );
};
