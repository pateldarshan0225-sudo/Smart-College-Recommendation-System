import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { AcademicMatcherPreview } from './AcademicMatcherPreview';
import { PlacementRoiPreview } from './PlacementRoiPreview';
import { playSound } from '../../utils/audio';

const ENGINE_FEATURES = [
  {
    id: 'academic',
    title: ['Academic &', 'Cutoff Matcher'],
    desc: 'Evaluates 10th, 12th & entrance scores against eligibility thresholds',
    component: AcademicMatcherPreview,
    highlight: false
  },
  {
    id: 'placement',
    title: ['Placement &', 'ROI Analyzer'],
    desc: 'Analyze average package, placement rate & top hiring recruiters',
    component: PlacementRoiPreview,
    highlight: true
  }
];

export const CollegeEngineSection = ({ onOpenQuickMatch }) => {
  const handleCardClick = (moduleType) => {
    playSound('pop');
    if (onOpenQuickMatch) onOpenQuickMatch(moduleType);
  };

  return (
    <section className="re-class-section-wrapper" id="engine-section" aria-label="Our Recommendation Engine">
      <div className="re-class-section-header">
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '999px',
              background: 'rgba(108, 92, 231, 0.12)',
              color: '#6C5CE7',
              fontSize: '11px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px'
            }}
          >
            <Sparkles size={12} />
            <span>Multi-Factor Algorithmic Suite</span>
          </div>

          <h2 className="re-section-title" style={{ margin: '0 0 4px 0' }}>
            Our Recommendation Engine
          </h2>
          <p className="re-section-subtitle">
            Multi-factor algorithmic matching based on your academic profile, budget, placements, career pathways & scholarships
          </p>
        </div>

      </div>

      <div className="re-engine-cards">
          {ENGINE_FEATURES.map((slide) => {
            const Comp = slide.component;

            return (
              <div key={slide.id} className="re-engine-card-slot">
                <div
                  className="re-class-card re-class-card-highlight"
                  onClick={() => handleCardClick(slide.id)}
                  title={`Explore ${slide.title.join(' ')}`}
                >
                  <div className="re-card-top">
                    <h3 className="re-card-title">
                      {slide.title[0]}<br />{slide.title[1]}
                    </h3>
                    <div className="re-card-arrow-pill" aria-label={`Open ${slide.title.join(' ')}`}>
                      <ArrowUpRight size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="re-card-desc">
                    {slide.desc}
                  </p>

                  <div className="re-card-visual-window">
                    <Comp />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};
