import React, { useState } from 'react';
import { X, BookOpen, Clock, Download, CheckCircle, Video, Award, ArrowRight } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const CurriculumModal = ({ isOpen, onClose, courseId, onEnroll }) => {
  const [activeTab, setActiveTab] = useState('syllabus');

  if (!isOpen) return null;

  const coursesData = {
    uiux: {
      title: 'UI/UX Design Masterclass',
      subtitle: 'Learn to design the appearance and interaction systems of world-class websites & apps.',
      duration: '8 Weeks (Self-paced + Live Labs)',
      level: 'All Levels',
      instructor: 'Rian Pratama & Siska Aurelia (Ex-Gojek, Figma Community Advocates)',
      tag: 'UI/UX Design',
      color: '#7C6DAF',
      modules: [
        { title: 'Module 1: Visual Foundations & Layout Rhythm', lessons: '6 Lessons • 2h 45m', topics: ['8pt Grid systems', 'Micro-typography hierarchy', 'Color balance & dark mode contrast'] },
        { title: 'Module 2: Design Systems & Component Architecture', lessons: '8 Lessons • 4h 10m', topics: ['Auto-layout & variants', 'Design tokens in code', 'Figma variables & modes'] },
        { title: 'Module 3: Interaction Patterns & Micro-Animations', lessons: '7 Lessons • 3h 30m', topics: ['Smart animate transitions', 'Haptic feedback & motion easing', 'Interactive prototype testing'] },
        { title: 'Module 4: Real-world Product Ship & Case Study', lessons: '5 Lessons • 3h 15m', topics: ['Developer handoff specs', 'Portfolio case study storytelling', 'Client presentation decks'] }
      ],
      deliverables: ['120+ Component Figma UI Kit', 'Production Hand-off Checklist', 'Certificate of Completion']
    },
    motion: {
      title: 'Motion Graphics & 2D/3D Animation',
      subtitle: 'Learn how to animate simple objects, character physics, and fluid micro-interactions.',
      duration: '6 Weeks (Intensive)',
      level: 'Intermediate',
      instructor: 'Ashzahh & Kenjiro Ito (Motion Art Directors)',
      tag: 'Motion Graphics',
      color: '#FFA439',
      modules: [
        { title: 'Module 1: Principles of Physics & Easing', lessons: '5 Lessons • 2h 15m', topics: ['Squash & stretch dynamics', 'Graph editor mastery', 'Spring interpolation curves'] },
        { title: 'Module 2: Character Rigging & Vector Puppetry', lessons: '6 Lessons • 3h 20m', topics: ['Bones & IK rigging in AE', 'Eye tracking & facial emotes', 'Looping walk cycles'] },
        { title: 'Module 3: UI Motion & Lottie Export', lessons: '6 Lessons • 3h 05m', topics: ['Bodymovin & dotLottie setup', 'Web micro-interaction exports', 'Performance budget optimization'] },
        { title: 'Module 4: 3D Isometric & Cinema 4D Lite', lessons: '5 Lessons • 2h 50m', topics: ['Spline modeling & clay shaders', 'Lighting & soft shadow rendering', 'Seamless looping reels'] }
      ],
      deliverables: ['30+ After Effects Project Files', 'Custom Motion Curves Presets', 'Lottie Animation Library']
    },
    visual: {
      title: 'Visual Identity & Brand Architecture',
      subtitle: 'Study the components of building iconic brand identity, typography systems, and packaging.',
      duration: '6 Weeks',
      level: 'All Levels',
      instructor: 'Devi Anggraini (Brand Strategy Lead)',
      tag: 'Visual Identity',
      color: '#35C7B8',
      modules: [
        { title: 'Module 1: Brand Strategy & Moodboard Formulation', lessons: '4 Lessons • 2h 00m', topics: ['Archetype positioning', 'Visual resonance mapping', 'Creative pitch discovery'] },
        { title: 'Module 2: Logo Geometry & Mark Engineering', lessons: '7 Lessons • 3h 40m', topics: ['Golden ratio vector drafting', 'Responsive responsive lockups', 'Monogram & emblem construction'] },
        { title: 'Module 3: Color Alchemy & Typography Pairs', lessons: '6 Lessons • 2h 50m', topics: ['Color theory & CMYK / RGB matching', 'Custom kerning & display types', 'Editorial layout grids'] },
        { title: 'Module 4: Brand Guidelines & 3D Mockup Deck', lessons: '5 Lessons • 3h 10m', topics: ['Brand manual design', 'Photorealistic packaging renders', 'Client brand book delivery'] }
      ],
      deliverables: ['Complete 48-Page Brand Guideline Template', 'Photorealistic 3D Mockup Pack', 'Brand Archetype Matrix']
    }
  };

  const currentCourse = coursesData[courseId] || coursesData.uiux;

  const handleClose = () => {
    playSound('pop');
    onClose();
  };

  return (
    <div className="re-modal-backdrop" onClick={handleClose}>
      <div className="re-modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <button className="re-modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Modal Top Banner */}
        <div style={{
          background: `linear-gradient(135deg, ${currentCourse.color}22, ${currentCourse.color}08)`,
          border: `1px solid ${currentCourse.color}33`,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'inline-block', background: currentCourse.color, color: '#FFF', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', marginBottom: '8px' }}>
            {currentCourse.tag}
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px', color: 'var(--re-text-primary)' }}>
            {currentCourse.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--re-text-secondary)', margin: '0 0 14px', lineHeight: 1.4 }}>
            {currentCourse.subtitle}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: 'var(--re-text-primary)', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} color={currentCourse.color} /> {currentCourse.duration}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={14} color={currentCourse.color} /> {currentCourse.level}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Video size={14} color={currentCourse.color} /> HD Video + Figma Assets
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--re-border-subtle)', paddingBottom: '10px', marginBottom: '18px' }}>
          <button
            onClick={() => {
              playSound('tap');
              setActiveTab('syllabus');
            }}
            style={{
              background: activeTab === 'syllabus' ? 'var(--re-accent-purple)' : 'transparent',
              color: activeTab === 'syllabus' ? '#FFFFFF' : 'var(--re-text-secondary)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Syllabus (4 Modules)
          </button>
          <button
            onClick={() => {
              playSound('tap');
              setActiveTab('resources');
            }}
            style={{
              background: activeTab === 'resources' ? 'var(--re-accent-purple)' : 'transparent',
              color: activeTab === 'resources' ? '#FFFFFF' : 'var(--re-text-secondary)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Downloadable Kits
          </button>
        </div>

        {/* Content */}
        {activeTab === 'syllabus' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {currentCourse.modules.map((mod, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--re-bg-surface-subtle)',
                  border: '1px solid var(--re-border-subtle)',
                  borderRadius: '12px',
                  padding: '12px 16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: 'var(--re-text-primary)' }}>
                    {mod.title}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--re-text-muted)', fontWeight: 600 }}>{mod.lessons}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {mod.topics.map((t, ti) => (
                    <span
                      key={ti}
                      style={{
                        fontSize: '11px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(0,0,0,0.06)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        color: 'var(--re-text-secondary)'
                      }}
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {currentCourse.deliverables.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--re-bg-surface-subtle)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--re-border-subtle)'
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: currentCourse.color, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Download size={14} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--re-text-primary)' }}>{item}</div>
                  <div style={{ fontSize: '11px', color: 'var(--re-text-muted)' }}>Ready for commercial production</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Bar */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 'var(--re-radius-pill)',
              border: '1.5px solid var(--re-border-medium)',
              background: 'transparent',
              color: 'var(--re-text-primary)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
          <button
            style={{ flex: 2 }}
            className="re-btn-primary"
            onClick={() => {
              handleClose();
              if (onEnroll) onEnroll(courseId);
            }}
          >
            Enroll in {currentCourse.tag} <ArrowRight size={15} style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
