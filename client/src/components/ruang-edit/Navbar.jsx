import React from 'react';
import { Volume2, VolumeX, Moon, Sun, ArrowUpRight } from 'lucide-react';
import { RuangLogo } from './SquircleArtworks';
import { playSound, isSoundEnabled } from '../../utils/audio';

export const Navbar = ({
  activeSection,
  onNavigate,
  onOpenContact,
  onOpenShowcase,
  theme,
  onToggleTheme,
  soundOn,
  onToggleSound
}) => {
  const handleLinkClick = (section) => {
    playSound('click');
    if (section === 'showcase') {
      onOpenShowcase();
    } else {
      onNavigate(section);
    }
  };

  return (
    <header>
      {/* Top Metadata Pill Badge (Exact match to top right in uploaded template) */}
      <div className="re-top-meta-bar">
        <div className="re-production-pill" title="Ruang Edit Production Release">
          <span>RE Production</span>
          <span className="re-pill-divider">|</span>
          <span>2024.09</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="re-navbar" aria-label="Main Navigation">
        {/* Left Links */}
        <div className="re-nav-left">
          <button
            className={`re-nav-link ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => handleLinkClick('home')}
          >
            Home
          </button>
          <button
            className={`re-nav-link ${activeSection === 'services' ? 'active' : ''}`}
            onClick={() => handleLinkClick('services')}
          >
            Services
          </button>
          <button
            className={`re-nav-link ${activeSection === 'about' ? 'active' : ''}`}
            onClick={() => handleLinkClick('about')}
          >
            About
          </button>
          <button
            className="re-nav-link"
            onClick={() => handleLinkClick('showcase')}
          >
            Showcase
          </button>
        </div>

        {/* Center Brand Logo */}
        <button
          className="re-brand-logo"
          onClick={() => handleLinkClick('home')}
          aria-label="Ruang Edit Home"
        >
          <div className="re-logo-mark">
            <RuangLogo size={28} />
          </div>
          <span className="re-brand-name">Ruang Edit</span>
        </button>

        {/* Right Links & Action Buttons */}
        <div className="re-nav-right">
          <button
            className={`re-nav-link ${activeSection === 'class' ? 'active' : ''}`}
            onClick={() => handleLinkClick('class')}
          >
            Class
          </button>

          <button
            className="re-btn-contact-outline"
            onClick={() => {
              playSound('pop');
              onOpenContact();
            }}
          >
            <span>Contacts us</span>
            <ArrowUpRight size={15} />
          </button>

          {/* Sound FX Toggle */}
          <button
            className="re-theme-toggle-btn"
            onClick={() => {
              onToggleSound();
              playSound('tap');
            }}
            title={soundOn ? 'Disable tactile sounds' : 'Enable tactile sounds'}
            aria-label="Toggle Sound Effects"
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            className="re-theme-toggle-btn"
            onClick={() => {
              playSound('click');
              onToggleTheme();
            }}
            title={theme === 'midnight' ? 'Switch to Studio Lavender' : 'Switch to Midnight Luxe'}
            aria-label="Toggle Theme"
          >
            {theme === 'midnight' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
    </header>
  );
};
