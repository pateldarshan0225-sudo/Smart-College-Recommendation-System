import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import {
  SparkleStar,
  SquircleArtPink,
  SquircleArtLavender,
  SquircleArtCyan,
  SquircleArtOrange
} from './SquircleArtworks';
import { playSound } from '../../utils/audio';

export const HeroSection = ({ onOpenJoin, onSelectTrack }) => {
  const [activeSquircle, setActiveSquircle] = useState(0);

  const squircles = [
    {
      id: 'ideation',
      name: 'Creative Ideation',
      component: <SquircleArtPink />,
      className: 're-squircle-pink',
      track: 'uiux',
      badge: 'Concept & Wireframes'
    },
    {
      id: 'uiux',
      name: 'UI & Web Architecture',
      component: <SquircleArtLavender />,
      className: 're-squircle-lavender',
      track: 'uiux',
      badge: 'Figma & Systems'
    },
    {
      id: 'visual',
      name: 'Visual & System Design',
      component: <SquircleArtCyan />,
      className: 're-squircle-cyan',
      track: 'visual',
      badge: 'Branding & Tokens'
    },
    {
      id: 'motion',
      name: 'Digital Art & Motion',
      component: <SquircleArtOrange />,
      className: 're-squircle-orange',
      track: 'motion',
      badge: '2D/3D Animation'
    }
  ];

  const handlePrev = () => {
    playSound('pop');
    setActiveSquircle((prev) => (prev === 0 ? squircles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    playSound('pop');
    setActiveSquircle((prev) => (prev === squircles.length - 1 ? 0 : prev + 1));
  };

  const handleSquircleClick = (index, track) => {
    playSound('click');
    setActiveSquircle(index);
    if (onSelectTrack) onSelectTrack(track);
  };

  return (
    <section className="re-hero-section" aria-label="Hero Introduction">
      {/* Decorative Floating Sparkles */}
      <div className="re-sparkle re-sparkle-hero-tl">
        <SparkleStar size={24} color="#8A78B8" />
        <div className="re-orbit-ring" />
      </div>

      <div className="re-sparkle re-sparkle-hero-tr">
        <SparkleStar size={22} color="#8A78B8" />
      </div>

      <div className="re-sparkle re-sparkle-hero-br">
        <SparkleStar size={26} color="#8A78B8" />
      </div>

      <div className="re-sparkle re-sparkle-hero-ml">
        <SparkleStar size={18} color="#8A78B8" />
      </div>

      {/* Main Headline (Exact replica of the uploaded reference design) */}
      <h1 className="re-hero-headline">
        <span className="re-headline-line">
          Level Up Your
          <SparkleStar size={24} color="#8A78B8" className="re-sparkle-inline" />
        </span>
        <span className="re-headline-line">
          Design
          <span className="re-pill-accent-badge" title="Ruang Edit Creative Studio">
            <SparkleStar size={18} color="#FFFFFF" />
          </span>
          with Our
        </span>
        <span className="re-headline-line">
          💫 Design Class
          <SparkleStar size={20} color="#8A78B8" className="re-sparkle-inline" />
        </span>
      </h1>

      {/* Stats and Join CTA Action Row */}
      <div className="re-hero-action-row">
        {/* Left Stats */}
        <div className="re-hero-stats">
          <div className="re-stats-label">With more than</div>
          <div className="re-stats-highlight">2K + MEMBERS</div>
          <div className="re-stats-highlight">500 + TUTORIALS</div>
        </div>

        {/* Right CTA Button */}
        <button
          className="re-btn-join-us"
          onClick={() => {
            playSound('pop');
            onOpenJoin();
          }}
          aria-label="Join Ruang Edit Design Class"
        >
          <span>Join us</span>
          <div className="re-join-icon-circle">
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      {/* 4-Squircle Category Carousel */}
      <div className="re-squircle-carousel-container">
        {/* Left Arrow Button */}
        <button
          className="re-carousel-arrow-btn"
          onClick={handlePrev}
          title="Previous category"
          aria-label="Previous category"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>

        {/* 4 Squircle 3D Cards */}
        <div className="re-squircle-grid">
          {squircles.map((item, index) => (
            <div
              key={item.id}
              className={`re-squircle-card ${item.className} ${activeSquircle === index ? 'active' : ''}`}
              onClick={() => handleSquircleClick(index, item.track)}
              title={`${item.name} - Click to explore curriculum`}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSquircleClick(index, item.track);
                }
              }}
            >
              <div className="re-squircle-art">
                {item.component}
              </div>
              <div className="re-squircle-label">
                {item.badge}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          className="re-carousel-arrow-btn"
          onClick={handleNext}
          title="Next category"
          aria-label="Next category"
        >
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
};
