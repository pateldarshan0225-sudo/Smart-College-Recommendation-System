import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Volume2,
  VolumeX,
  Moon,
  Sun,
  ArrowUpRight,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Compass,
  GraduationCap,
  Briefcase,
  Award,
  Scale,
  Building2,
  Zap,
  Bookmark
} from 'lucide-react';
import { CollegeLogo } from './CollegeSquircles';
import { playSound } from '../../utils/audio';
import { useAuth } from '../../context/AuthContext';

export const CollegeNavbar = ({
  activeSection,
  onNavigate,
  onOpenQuickMatch,
  onOpenCompare,
  theme,
  onToggleTheme,
  soundOn,
  onToggleSound,
  collegesCount = 500,
  savedCount = 0
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Handle scroll detection for glass compression & elevation
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 15;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Click outside listener for user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'home', path: '/', label: 'Home', icon: Compass },
    { id: 'colleges', path: '/colleges', label: 'Colleges', icon: Building2 },
    { id: 'engine', path: '/ai-matcher', label: 'AI Matcher', icon: Sparkles },
    { id: 'roadmap', path: '/roadmap', label: 'Roadmap', icon: GraduationCap },
    { id: 'careers', path: '/careers', label: 'Careers', icon: Briefcase },
    { id: 'scholarships', path: '/scholarships', label: 'Scholarships', icon: Award },
    { id: 'compare', path: '/compare', label: 'Compare', icon: Scale }
  ];

  const handleLinkClick = (item) => {
    playSound('click');
    setMobileMenuOpen(false);
    if (!user && (item.id === 'compare' || item.id === 'engine')) {
      navigate('/login');
      return;
    }
    if (onNavigate) {
      onNavigate(item.id, item.path);
    } else {
      navigate(item.path);
    }
  };

  const handleLogout = async () => {
    playSound('pop');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const isItemActive = (item) => {
    if (activeSection) {
      return activeSection === item.id;
    }
    if (item.path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === item.path || location.pathname.startsWith(item.path);
  };

  return (
    <>
      <header
        className={`re-fixed-navbar-root ${scrolled ? 'is-scrolled' : ''}`}
        role="banner"
      >
        <div className="re-fixed-navbar-container">
          {/* =================================================================
              LEFT: Clean Artisanal Brand Identity Lockup
              ================================================================= */}
          <div className="re-nav-brand-group">
            <Link
              to="/"
              className="re-nav-brand-btn"
              onClick={() => playSound('tap')}
              aria-label="Smart College Home"
            >
              <div className="re-nav-logo-icon">
                <CollegeLogo size={30} />
                <div className="re-logo-glow" />
              </div>

              <div className="re-nav-brand-text">
                <div className="re-brand-title-wrap">
                  <span className="re-brand-title-main">Smart</span>
                  <span className="re-brand-title-accent">College</span>
                  <span className="re-brand-pill-badge" title="ACPC 2024 AI Engine Active">
                    <span className="re-status-pulse-dot" />
                    AI 2.4
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* =================================================================
              CENTER: Elegant Floating Segmented Glass Dock
              ================================================================= */}
          <nav className="re-nav-center-dock" aria-label="Primary site navigation">
            <div className="re-nav-dock-pill-track">
              {navItems.map((item) => {
                const active = isItemActive(item);
                return (
                  <button
                    key={item.id}
                    className={`re-nav-dock-item ${active ? 'is-active' : ''}`}
                    onClick={() => handleLinkClick(item)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="re-dock-item-label">{item.label}</span>
                    {active && <span className="re-dock-active-indicator" />}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* =================================================================
              RIGHT: Clean Action Cluster & Tactile Micro-Controls
              ================================================================= */}
          <div className="re-nav-right-cluster">
            {/* User Account / Auth Links */}
            {user ? (
              <div className="re-user-menu-wrapper" ref={userMenuRef}>
                <button
                  className="re-user-pill-btn"
                  onClick={() => {
                    playSound('tap');
                    setUserDropdownOpen(!userDropdownOpen);
                  }}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="re-user-avatar-badge">
                    <User size={13} strokeWidth={2.5} />
                  </div>
                  <span className="re-user-display-name">
                    {user.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`re-chevron-icon ${userDropdownOpen ? 'rotate' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="re-user-dropdown-card">
                    <div className="re-dropdown-header">
                      <div className="re-dropdown-user-name">{user.name || 'Student User'}</div>
                      <div className="re-dropdown-user-email">{user.email}</div>
                      <span className="re-dropdown-role-tag">
                        {user.role === 'admin' ? '⚡ ADMINISTRATOR' : '🎓 VERIFIED STUDENT'}
                      </span>
                    </div>

                    <div className="re-dropdown-divider" />

                    <Link
                      to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
                      className="re-dropdown-item"
                      onClick={() => {
                        playSound('click');
                        setUserDropdownOpen(false);
                      }}
                    >
                      <Zap size={14} />
                      <span>My Dashboard</span>
                    </Link>

                    <Link
                      to="/user/saved"
                      className="re-dropdown-item"
                      onClick={() => {
                        playSound('click');
                        setUserDropdownOpen(false);
                      }}
                    >
                      <Bookmark size={14} />
                      <span>Saved Colleges ({savedCount})</span>
                    </Link>

                    <div className="re-dropdown-divider" />

                    <button className="re-dropdown-item item-danger" onClick={handleLogout}>
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="re-nav-auth-cluster">
                <Link
                  to="/login"
                  className="re-nav-signin-link"
                  onClick={() => playSound('tap')}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="re-nav-register-btn"
                  onClick={() => playSound('pop')}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Primary Action Button: Match Colleges */}
            <button
              className="re-nav-primary-action-btn"
              onClick={() => {
                playSound('pop');
                if (!user) {
                  navigate('/login');
                  return;
                }
                if (onOpenQuickMatch) {
                  onOpenQuickMatch();
                } else {
                  navigate('/ai-matcher');
                }
              }}
              title="Launch AI Recommendation Engine"
            >
              <span className="re-btn-text">Match Colleges</span>
              <div className="re-btn-arrow-circle">
                <ArrowUpRight size={13} strokeWidth={2.6} />
              </div>
            </button>

            {/* Micro Controls: Audio Feedback & Dark/Light Mode */}
            <div className="re-tactile-controls-group">
              <button
                className={`re-tactile-btn ${soundOn ? 'is-active' : ''}`}
                onClick={() => {
                  if (onToggleSound) onToggleSound();
                  playSound('tap');
                }}
                title={soundOn ? 'Sound effects enabled' : 'Sound effects muted'}
                aria-label="Toggle sound effects"
              >
                {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>

              <button
                className="re-tactile-btn"
                onClick={() => {
                  playSound('click');
                  if (onToggleTheme) onToggleTheme();
                }}
                title={theme === 'midnight' ? 'Switch to Studio Lavender' : 'Switch to Midnight Luxe'}
                aria-label="Toggle theme"
              >
                {theme === 'midnight' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              className={`re-mobile-hamburger-btn ${mobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => {
                playSound('pop');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* =================================================================
          MOBILE / TABLET SLIDE-DOWN DRAWER
          ================================================================= */}
      {mobileMenuOpen && (
        <div className="re-mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="re-mobile-drawer-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="re-mobile-drawer-header">
              <div className="re-mobile-brand">
                <CollegeLogo size={28} />
                <div className="re-mobile-brand-title">
                  <span>Smart College</span>
                  <span className="re-brand-pill-badge">AI v2.4</span>
                </div>
              </div>
              <button
                className="re-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="re-mobile-nav-list">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const active = isItemActive(item);
                return (
                  <button
                    key={item.id}
                    className={`re-mobile-nav-row ${active ? 'is-active' : ''}`}
                    onClick={() => handleLinkClick(item)}
                  >
                    <div className="re-mobile-row-left">
                      <div className="re-mobile-row-icon">
                        <IconComponent size={16} />
                      </div>
                      <span className="re-mobile-row-label">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile Actions Cluster */}
            <div className="re-mobile-actions-footer">
              <button
                className="re-mobile-cta-btn"
                onClick={() => {
                  playSound('pop');
                  setMobileMenuOpen(false);
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  if (onOpenQuickMatch) {
                    onOpenQuickMatch();
                  } else {
                    navigate('/ai-matcher');
                  }
                }}
              >
                <span>Launch AI College Matcher</span>
                <ArrowUpRight size={16} />
              </button>

              <button
                className="re-mobile-compare-btn"
                onClick={() => {
                  playSound('click');
                  setMobileMenuOpen(false);
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  navigate('/compare');
                }}
              >
                <Scale size={16} />
                <span>Side-by-Side College Comparison</span>
              </button>

              <div className="re-mobile-auth-row">
                {user ? (
                  <div className="re-mobile-user-card">
                    <div className="re-mobile-user-info">
                      <User size={15} />
                      <span>{user.name}</span>
                    </div>
                    <button className="re-mobile-logout-btn" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="re-mobile-auth-btn signin"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="re-mobile-auth-btn register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Free Account
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Quick Toggles */}
              <div className="re-mobile-toggles-bar">
                <button
                  className="re-mobile-toggle-chip"
                  onClick={() => {
                    if (onToggleSound) onToggleSound();
                    playSound('tap');
                  }}
                >
                  {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  <span>{soundOn ? 'Sound On' : 'Sound Muted'}</span>
                </button>

                <button
                  className="re-mobile-toggle-chip"
                  onClick={() => {
                    playSound('click');
                    if (onToggleTheme) onToggleTheme();
                  }}
                >
                  {theme === 'midnight' ? <Sun size={15} /> : <Moon size={15} />}
                  <span>{theme === 'midnight' ? 'Midnight Theme' : 'Lavender Theme'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
