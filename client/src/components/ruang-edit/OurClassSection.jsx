import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { UIUXPreview } from './UIUXPreview';
import { MotionPreview } from './MotionPreview';
import { VisualIdentityPreview } from './VisualIdentityPreview';
import { playSound } from '../../utils/audio';

export const OurClassSection = ({ onOpenCurriculum }) => {
  const [activeDot, setActiveDot] = useState(1);

  const handleCardClick = (courseId) => {
    playSound('pop');
    if (onOpenCurriculum) onOpenCurriculum(courseId);
  };

  const handleDotClick = (index) => {
    playSound('tap');
    setActiveDot(index);
  };

  return (
    <section className="re-class-section-wrapper" id="class-section" aria-label="Our Design Classes">
      {/* Section Header */}
      <div className="re-class-section-header">
        <h2 className="re-section-title">Our Class</h2>
        <p className="re-section-subtitle">
          This is some of the material that will be taught in the Ruang Edit design class
        </p>
      </div>

      {/* 3-Cards Grid (Faithfully formatted to template) */}
      <div className="re-class-cards-grid">
        {/* Card 1: UI/UX Design */}
        <div
          className="re-class-card"
          onClick={() => handleCardClick('uiux')}
          title="Explore UI/UX Design Class"
        >
          <div className="re-card-top">
            <h3 className="re-card-title">
              UI/UX<br />Design
            </h3>
            <div className="re-card-arrow-pill" aria-label="View UI/UX curriculum">
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </div>
          </div>
          <p className="re-card-desc">
            Learn to design the appearance of websites
          </p>

          <div className="re-card-visual-window">
            <UIUXPreview />
          </div>
        </div>

        {/* Card 2: Motion Graphics (Featured Highlight Card) */}
        <div
          className="re-class-card re-class-card-highlight"
          onClick={() => handleCardClick('motion')}
          title="Explore Motion Graphics Class"
        >
          <div className="re-card-top">
            <h3 className="re-card-title">
              Motion<br />Graphics
            </h3>
            <div className="re-card-arrow-pill" aria-label="View Motion Graphics curriculum">
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </div>
          </div>
          <p className="re-card-desc">
            Learn how to animate simple objects
          </p>

          <div className="re-card-visual-window">
            <MotionPreview />
          </div>
        </div>

        {/* Card 3: Visual Identity */}
        <div
          className="re-class-card"
          onClick={() => handleCardClick('visual')}
          title="Explore Visual Identity Class"
        >
          <div className="re-card-top">
            <h3 className="re-card-title">
              Visual<br />Identity
            </h3>
            <div className="re-card-arrow-pill" aria-label="View Visual Identity curriculum">
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </div>
          </div>
          <p className="re-card-desc">
            Study the components of building brand identity
          </p>

          <div className="re-card-visual-window">
            <VisualIdentityPreview />
          </div>
        </div>
      </div>

      {/* Pagination Carousel Dots */}
      <div className="re-pagination-dots" aria-label="Carousel navigation">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`re-dot ${activeDot === idx ? 'active' : ''}`}
            onClick={() => handleDotClick(idx)}
            role="button"
            tabIndex={0}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
