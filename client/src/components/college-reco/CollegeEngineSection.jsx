import React, { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { AcademicMatcherPreview } from './AcademicMatcherPreview';
import { PlacementRoiPreview } from './PlacementRoiPreview';
import { playSound } from '../../utils/audio';

const ENGINE_SLIDES = [
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = ENGINE_SLIDES.length; // 2 slides

  const handleCardClick = (moduleType) => {
    playSound('pop');
    if (onOpenQuickMatch) onOpenQuickMatch(moduleType);
  };

  const handleDotClick = (index) => {
    playSound('tap');
    setCurrentSlide(index);
  };

  const handlePrev = () => {
    playSound('tap');
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    playSound('tap');
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  return (
    <section className="re-class-section-wrapper" id="engine-section" aria-label="Our Recommendation Engine">
      {/* Section Header with Left/Right Navigation Arrows */}
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

        {/* Carousel Arrow Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <button
            type="button"
            onClick={handlePrev}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid var(--re-border-medium, #E2E6F2)',
              background: 'var(--re-bg-surface-subtle, #FFFFFF)',
              color: 'var(--re-text-primary, #1E1B4B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            title="Previous slide"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>

          <span
            style={{
              fontSize: '12.5px',
              fontWeight: '800',
              color: 'var(--re-text-secondary, #7E84A3)',
              minWidth: '42px',
              textAlign: 'center'
            }}
          >
            {currentSlide + 1} / {totalSlides}
          </span>

          <button
            type="button"
            onClick={handleNext}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid var(--re-border-medium, #E2E6F2)',
              background: 'var(--re-bg-surface-subtle, #FFFFFF)',
              color: 'var(--re-text-primary, #1E1B4B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            title="Next slide"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Smooth Carousel Viewport & Sliding Track with Slow Luxury Transition */}
      <div className="re-carousel-viewport">
        <div
          className="re-carousel-track"
          style={{
            '--current-slide': currentSlide
          }}
        >
          {ENGINE_SLIDES.map((slide, idx) => {
            const Comp = slide.component;
            const isHighlighted = slide.highlight || (idx === currentSlide);

            return (
              <div key={slide.id} className="re-carousel-slide">
                <div
                  className={`re-class-card ${isHighlighted ? 're-class-card-highlight' : ''}`}
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
      </div>

      {/* Interactive Pagination Carousel Dots for 2 slides */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '28px'
        }}
        aria-label="Carousel navigation dots"
      >
        {ENGINE_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            onClick={() => handleDotClick(idx)}
            role="button"
            tabIndex={0}
            title={`Slide ${idx + 1}: ${slide.title.join(' ')}`}
            style={{
              width: currentSlide === idx ? '28px' : '7px',
              height: '7px',
              borderRadius: currentSlide === idx ? '4px' : '50%',
              background: currentSlide === idx ? 'var(--re-accent-purple, #6C5CE7)' : 'var(--re-border-medium, #D0D5DD)',
              cursor: 'pointer',
              transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />
        ))}
      </div>
    </section>
  );
};
