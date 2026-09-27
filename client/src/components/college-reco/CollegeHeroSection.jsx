import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, GraduationCap } from 'lucide-react';
import {
  SparkleStar,
  SquircleArtEngineering,
  SquircleArtManagement,
  SquircleArtDataScience,
  SquircleArtDesign
} from './CollegeSquircles';
import { playSound } from '../../utils/audio';

export const CollegeHeroSection = ({ onOpenQuickMatch, onSelectStream }) => {
  const [activeSquircle, setActiveSquircle] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [collegesCount, setCollegesCount] = useState(120);
  const [studentsCount, setStudentsCount] = useState(2500);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Animated number ticker on mount
    const timer = setInterval(() => {
      setCollegesCount((prev) => (prev < 500 ? prev + 38 : 500));
      setStudentsCount((prev) => (prev < 10000 ? prev + 750 : 10000));
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const streams = [
    {
      id: 'engineering',
      name: 'Engineering & Technology',
      component: <SquircleArtEngineering />,
      className: 're-squircle-pink',
      badge: 'B.Tech • AI & Robotics',
      tag: 'Engineering'
    },
    {
      id: 'management',
      name: 'Management & Business',
      component: <SquircleArtManagement />,
      className: 're-squircle-lavender',
      badge: 'MBA • BBA • Finance',
      tag: 'Management'
    },
    {
      id: 'datascience',
      name: 'Computing & Data Science',
      component: <SquircleArtDataScience />,
      className: 're-squircle-cyan',
      badge: 'B.Sc DS • MCA • Cyber',
      tag: 'Computing'
    },
    {
      id: 'design',
      name: 'Architecture & Design',
      component: <SquircleArtDesign />,
      className: 're-squircle-orange',
      badge: 'B.Arch • B.Des • UI/UX',
      tag: 'Design'
    }
  ];

  const handlePrev = () => {
    playSound('pop');
    setActiveSquircle((prev) => (prev === 0 ? streams.length - 1 : prev - 1));
  };

  const handleNext = () => {
    playSound('pop');
    setActiveSquircle((prev) => (prev === streams.length - 1 ? 0 : prev + 1));
  };

  const handleSquircleClick = (e, index, stream) => {
    playSound('pop');
    setActiveSquircle(index);

    // Spawn 3D sparkle particle burst
    const rect = e.currentTarget.getBoundingClientRect();
    const newId = Date.now();
    setParticles((prev) => [...prev, { id: newId, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newId));
    }, 600);

    if (onSelectStream) onSelectStream(stream.tag);
  };

  // Parallax 3D tilt handler
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      className="re-hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Smart College Hero"
    >
      {/* 3D Orbit & Floating Sparkles with Interactive Mouse Shift */}
      <div
        className="re-sparkle re-sparkle-hero-tl"
        style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
      >
        <SparkleStar size={26} color="#8A78B8" />
        <div className="re-orbit-ring" />
      </div>

      <div
        className="re-sparkle re-sparkle-hero-tr"
        style={{ transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)` }}
      >
        <SparkleStar size={24} color="#FFA439" />
      </div>

      <div
        className="re-sparkle re-sparkle-hero-br"
        style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }}
      >
        <SparkleStar size={28} color="#8A78B8" />
      </div>

      <div
        className="re-sparkle re-sparkle-hero-ml"
        style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}
      >
        <SparkleStar size={20} color="#35C7B8" />
      </div>

      {/* Main Headline with 3D Float Elements */}
      <h1
        className="re-hero-headline"
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y * -6}deg) rotateY(${mousePos.x * 6}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
      >
        <span className="re-headline-line">
          Find Your Dream
          <SparkleStar size={26} color="#8A78B8" className="re-sparkle-inline" />
        </span>
        <span className="re-headline-line">
          College
          <span className="re-pill-accent-badge" title="Smart College AI Matching">
            <SparkleStar size={20} color="#FFFFFF" />
          </span>
          with Our
        </span>
        <span className="re-headline-line" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9em', display: 'inline-block', animation: 're-float-3d 3s ease-in-out infinite alternate' }}>
            🎓
          </span>
          <span>Recommendation AI</span>
          <SparkleStar size={22} color="#FFA439" className="re-sparkle-inline" />
        </span>
      </h1>

      {/* Stats and Action Row with Live Ticker */}
      <div className="re-hero-action-row">
        {/* Left Animated Stats */}
        <div className="re-hero-stats">
          <div className="re-stats-label">With more than</div>
          <div className="re-stats-highlight" style={{ color: 'var(--re-accent-purple)' }}>
            {collegesCount}+ ACCREDITED COLLEGES
          </div>
          <div className="re-stats-highlight" style={{ color: '#FFA439' }}>
            {studentsCount.toLocaleString()}+ STUDENT PLACEMENTS
          </div>
        </div>

        {/* Right CTA Button */}
        <button
          className="re-btn-join-us"
          onClick={() => {
            playSound('pop');
            onOpenQuickMatch();
          }}
          aria-label="Calculate College Recommendations"
        >
          <span>Calculate Fit</span>
          <div className="re-join-icon-circle">
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      {/* 4-Squircle 3D Category Carousel with Real-Time Perspective Tilt */}
      <div
        className="re-squircle-carousel-container"
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y * -8}deg) rotateY(${mousePos.x * 8}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
      >
        {/* Left Arrow Button */}
        <button
          className="re-carousel-arrow-btn"
          onClick={handlePrev}
          title="Previous stream"
          aria-label="Previous stream"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>

        {/* 4 Squircle 3D Cards */}
        <div className="re-squircle-grid">
          {streams.map((item, index) => {
            const isActive = activeSquircle === index;
            return (
              <div
                key={item.id}
                className={`re-squircle-card ${item.className} ${isActive ? 'active' : ''}`}
                onClick={(e) => handleSquircleClick(e, index, item)}
                title={`${item.name} - Click to explore branch intelligence`}
                tabIndex={0}
                role="button"
                style={{
                  transform: isActive
                    ? 'translateY(-10px) scale(1.06) translateZ(40px)'
                    : 'translateY(0) scale(1) translateZ(0)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSquircleClick(e, index, item);
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
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          className="re-carousel-arrow-btn"
          onClick={handleNext}
          title="Next stream"
          aria-label="Next stream"
        >
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
};
