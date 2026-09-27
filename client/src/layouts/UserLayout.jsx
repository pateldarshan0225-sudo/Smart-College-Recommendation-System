import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../admin.css';
import {
  Home,
  Building2,
  GraduationCap,
  Users,
  BarChart3,
  Sparkles,
  Layers,
  LogOut,
  Bell,
  Search,
  Grid,
  X,
  ChevronRight,
  ChevronDown,
  Database,
  ShieldCheck,
  CheckCircle2,
  Compass,
  DollarSign,
  Sun,
  Moon,
  Bookmark,
  Scale,
  Sliders,
  Award,
  Zap,
  ExternalLink
} from 'lucide-react';
import { playSound } from '../utils/audio';

const STUDENT_MODULE_GROUPS = [
  {
    category: 'My Academic & Cutoffs',
    items: [
      { key: 'profile', path: '/user/profile', label: 'Student Profile', icon: Users, desc: 'Personal details, category & domicile state' },
      { key: 'academic', path: '/user/academic', label: 'Academic & Board Scores', icon: GraduationCap, desc: '10th, 12th Board & GUJCET / JEE percentiles' },
      { key: 'preferences', path: '/user/preferences', label: 'Branch Preferences', icon: Sliders, desc: 'Target branches, budget slider & facility filters' }
    ]
  },
  {
    category: 'AI Recommendation Studio',
    items: [
      { key: 'recommendations', path: '/user/recommendations', label: 'AI Recommendations', icon: Sparkles, desc: 'Weighted algorithm ranking & fit percentage' },
      { key: 'saved', path: '/user/saved', label: 'Saved Shortlist', icon: Bookmark, desc: 'Bookmarked colleges for choice filling' },
      { key: 'compare', path: '/user/compare', label: 'Compare Colleges', icon: Scale, desc: 'Side-by-side multi-parameter comparison' }
    ]
  },
  {
    category: 'Counseling & Directory',
    items: [
      { key: 'colleges_dir', path: '/colleges', label: 'Colleges Directory', icon: Building2, desc: '500+ accredited universities in Gujarat & India' },
      { key: 'roadmap', path: '/roadmap', label: 'ACPC 2024 Roadmap', icon: Compass, desc: 'Centralized choice filling & mock merit rounds' },
      { key: 'scholarships', path: '/scholarships', label: 'MYSY & TFWS Schemes', icon: Award, desc: 'Government grants up to ₹2,00,000 / year' },
      { key: 'careers', path: '/careers', label: 'Career Pathways', icon: Zap, desc: 'Placement CTC benchmarks & hiring partners' }
    ]
  }
];

export default function UserLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const nav = useNavigate();
  const location = useLocation();

  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Global keyboard shortcut: Ctrl+K / Cmd+K opens Command Palette & Collections Drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowDrawer((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/dashboard')) return 'Dashboard';
    if (p.includes('/profile')) return 'My Profile';
    if (p.includes('/academic')) return 'Academic Records';
    if (p.includes('/preferences')) return 'Target Preferences';
    if (p.includes('/recommendations')) return 'AI Recommendations';
    if (p.includes('/saved')) return 'Saved Shortlist';
    if (p.includes('/compare')) return 'Compare Colleges';
    if (p.includes('/colleges/')) return 'College Profile';
    return 'Student Portal';
  };

  const handleLogout = async () => {
    playSound('pop');
    await logout();
    nav('/login');
  };

  const userInitials = user?.name
    ? user.name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'KP';

  const filteredGroups = STUDENT_MODULE_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        item.label.toLowerCase().includes(drawerSearch.toLowerCase()) ||
        item.desc.toLowerCase().includes(drawerSearch.toLowerCase()) ||
        item.key.toLowerCase().includes(drawerSearch.toLowerCase())
    )
  })).filter((group) => group.items.length > 0);

  return (
    <div className={`admin-body-wrap ${isDark ? 'dark-mode' : ''}`}>
      <div className="admin-shell">
        {/* =================================================================
            LEFT DOCK SIDEBAR (Exact admin styling)
            ================================================================= */}
        <aside className="admin-dock">
          {/* Top Bell Button */}
          <button
            type="button"
            className="admin-dock-bell"
            title="Admissions Alerts"
            onClick={() => {
              playSound('tap');
              setShowNotificationToast(!showNotificationToast);
            }}
          >
            <Bell size={20} />
            <span className="admin-dock-bell-dot" />
          </button>

          {/* Navigation Dock Items */}
          <nav className="admin-dock-nav">
            <NavLink
              to="/user/dashboard"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
              onClick={() => playSound('click')}
            >
              <Home size={22} />
              <span className="admin-dock-tooltip">Dashboard</span>
            </NavLink>

            <NavLink
              to="/user/profile"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
              onClick={() => playSound('click')}
            >
              <Users size={22} />
              <span className="admin-dock-tooltip">Student Profile</span>
            </NavLink>

            <NavLink
              to="/user/academic"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
              onClick={() => playSound('click')}
            >
              <GraduationCap size={22} />
              <span className="admin-dock-tooltip">Academic & Scores</span>
            </NavLink>

            <NavLink
              to="/user/preferences"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
              onClick={() => playSound('click')}
            >
              <Sliders size={22} />
              <span className="admin-dock-tooltip">Preferences</span>
            </NavLink>

            <NavLink
              to="/user/recommendations"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
              onClick={() => playSound('click')}
            >
              <Sparkles size={22} />
              <span className="admin-dock-tooltip">AI Recommendations</span>
            </NavLink>

            <NavLink
              to="/user/saved"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
              onClick={() => playSound('click')}
            >
              <Bookmark size={22} />
              <span className="admin-dock-tooltip">Saved Shortlist</span>
            </NavLink>

            <NavLink
              to="/user/compare"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
              onClick={() => playSound('click')}
            >
              <Scale size={22} />
              <span className="admin-dock-tooltip">Compare Matrix</span>
            </NavLink>

            {/* Quick Modules Switcher Button */}
            <button
              type="button"
              className="admin-dock-item"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => {
                playSound('tap');
                setShowDrawer(true);
              }}
              title="All Portal Modules (Ctrl+K)"
            >
              <Layers size={22} />
              <span className="admin-dock-tooltip">All Modules (Ctrl+K)</span>
            </button>
          </nav>

          {/* Bottom Controls */}
          <div className="admin-dock-bottom">
            <button
              type="button"
              className="admin-dock-item"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '8px' }}
              onClick={() => {
                playSound('tap');
                toggleTheme();
              }}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            >
              {isDark ? <Sun size={20} color="#FFA439" /> : <Moon size={20} />}
              <span className="admin-dock-tooltip">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              type="button"
              className="admin-dock-item"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={20} />
              <span className="admin-dock-tooltip">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* =================================================================
            MAIN BODY AREA & TOP HEADER
            ================================================================= */}
        <main className="admin-main-wrap">
          {/* Top Header */}
          <header className="admin-header">
            <div className="admin-header-title-wrap">
              <div className="eyebrow">STUDENT</div>
              <h1>{getPageTitle()}</h1>
            </div>

            <div className="admin-header-actions">
              {/* System Health Pulse Beacon */}
              <div className="admin-system-health" title="ACPC 2024 Candidate Engine Active">
                <span className="admin-pulse-beacon">
                  <span className="admin-pulse-ring" />
                  <span className="admin-pulse-core" />
                </span>
                <span className="admin-health-text">Live Sync</span>
              </div>

              {/* Command Search Trigger with Ctrl+K shortcut */}
              <button
                type="button"
                className="admin-command-bar"
                onClick={() => {
                  playSound('tap');
                  setShowDrawer(true);
                }}
                title="Global Search & Jump (Ctrl+K)"
              >
                <Search size={15} className="admin-cmd-icon" />
                <span className="admin-cmd-placeholder">Search colleges, cutoffs, scholarships...</span>
                <kbd className="admin-cmd-kbd">
                  <span className="admin-cmd-mod">Ctrl</span>
                  <span>K</span>
                </kbd>
              </button>

              {/* Modules Dropdown Button */}
              <button
                type="button"
                className="admin-collections-btn"
                onClick={() => {
                  playSound('tap');
                  setShowDrawer(true);
                }}
                title="Browse all 10 Student Modules"
              >
                <div className="admin-collections-icon-wrap">
                  <Database size={15} />
                </div>
                <span className="admin-collections-title">Modules</span>
                <span className="admin-hub-badge">10</span>
                <ChevronDown size={14} className="admin-collections-chevron" />
              </button>

              {/* Theme Toggle Button */}
              <button
                type="button"
                className={`admin-theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'}`}
                onClick={() => {
                  playSound('tap');
                  toggleTheme();
                }}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
                aria-label="Toggle Light and Dark Mode Theme"
              >
                <div className="admin-theme-toggle-track">
                  <div className={`admin-theme-icon-indicator sun ${!isDark ? 'active' : ''}`}>
                    <Sun size={13} />
                  </div>
                  <div className={`admin-theme-icon-indicator moon ${isDark ? 'active' : ''}`}>
                    <Moon size={13} />
                  </div>
                  <div className={`admin-theme-slider-thumb ${isDark ? 'to-dark' : 'to-light'}`}>
                    {isDark ? <Moon size={11} /> : <Sun size={11} />}
                  </div>
                </div>
                <span className="admin-theme-btn-text d-none d-md-inline">
                  {isDark ? 'Dark' : 'Light'}
                </span>
              </button>

              {/* Interactive Student Profile Capsule with Dropdown */}
              <div className="admin-profile-container" ref={profileMenuRef}>
                <button
                  type="button"
                  className={`admin-profile-trigger ${showProfileMenu ? 'active' : ''}`}
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  aria-expanded={showProfileMenu}
                  title="Account Settings & Session"
                >
                  <div className="admin-profile-avatar-wrap">
                    <div className="admin-profile-avatar">
                      {userInitials}
                    </div>
                    <span className="admin-avatar-live-dot" title="Active Student Session" />
                  </div>

                  <div className="admin-profile-info d-none d-sm-flex">
                    <span className="admin-profile-name">{user?.name || 'Krish Patel'}</span>
                    <span className="admin-profile-role-tag">STUDENT CANDIDATE</span>
                  </div>

                  <ChevronDown size={14} className={`admin-profile-chevron ${showProfileMenu ? 'rotated' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="admin-profile-dropdown">
                    {/* User Card Header */}
                    <div className="admin-dropdown-user-card">
                      <div className="admin-dropdown-avatar">
                        {userInitials}
                      </div>
                      <div className="admin-dropdown-user-details">
                        <div className="admin-dropdown-name">{user?.name || 'Krish Patel'}</div>
                        <div className="admin-dropdown-email">{user?.email || 'student@candidate.edu'}</div>
                        <div className="admin-dropdown-badge-row">
                          <span className="admin-status-chip">
                            <span className="admin-chip-dot" /> Online
                          </span>
                          <span className="admin-tier-chip">ACPC 2024 Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="admin-dropdown-divider" />

                    {/* Quick Student Shortcuts */}
                    <div className="admin-dropdown-section-title">Student Hub</div>
                    <div className="admin-dropdown-nav">
                      <button
                        type="button"
                        className="admin-dropdown-nav-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          nav('/user/profile');
                        }}
                      >
                        <Users size={16} />
                        <span>Personal Profile</span>
                      </button>
                      <button
                        type="button"
                        className="admin-dropdown-nav-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          nav('/user/academic');
                        }}
                      >
                        <GraduationCap size={16} />
                        <span>Academic Scores</span>
                        <span className="admin-nav-count-badge">88.0</span>
                      </button>
                      <button
                        type="button"
                        className="admin-dropdown-nav-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          nav('/user/recommendations');
                        }}
                      >
                        <Sparkles size={16} />
                        <span>AI Matches</span>
                        <span className="admin-nav-count-badge">21</span>
                      </button>
                      <button
                        type="button"
                        className="admin-dropdown-nav-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          nav('/user/saved');
                        }}
                      >
                        <Bookmark size={16} />
                        <span>Saved Shortlist</span>
                      </button>
                      <button
                        type="button"
                        className="admin-dropdown-nav-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          nav('/colleges');
                        }}
                      >
                        <Building2 size={16} />
                        <span>Browse 500+ Colleges</span>
                      </button>
                    </div>

                    <div className="admin-dropdown-divider" />

                    {/* Appearance */}
                    <div className="admin-dropdown-section-title">Theme & Appearance</div>
                    <button
                      type="button"
                      className="admin-dropdown-nav-item"
                      onClick={toggleTheme}
                    >
                      {isDark ? <Sun size={16} /> : <Moon size={16} />}
                      <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                      <span className="admin-nav-count-badge" style={{ textTransform: 'capitalize' }}>
                        {theme}
                      </span>
                    </button>

                    <div className="admin-dropdown-divider" />

                    {/* Sign out */}
                    <button
                      type="button"
                      className="admin-dropdown-logout-btn"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Sign Out Session</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Notifications Dropdown */}
          {showNotificationToast && (
            <div
              style={{
                position: 'absolute',
                top: '72px',
                left: '96px',
                zIndex: 100,
                background: 'var(--adm-white, #FFFFFF)',
                borderRadius: '18px',
                boxShadow: '0 12px 35px rgba(35, 24, 94, 0.18)',
                border: '1px solid var(--adm-border-soft, #E5E9F4)',
                padding: '16px 20px',
                width: '320px',
                animation: 'fadeIn 0.2s ease'
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong style={{ fontSize: '13px', color: 'var(--adm-text-dark, #1E1B4B)' }}>Admissions Alerts</strong>
                <button
                  onClick={() => setShowNotificationToast(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#7E84A3' }}
                >
                  <X size={16} />
                </button>
              </div>
              <div style={{ fontSize: '12px', color: '#555' }} className="d-flex flex-column gap-2">
                <div className="p-2 rounded" style={{ background: 'var(--adm-purple-soft, #F8F9FE)' }}>
                  <span style={{ color: '#10B981', fontWeight: '700' }}>● Merit Round 1 Active</span>
                  <div style={{ color: '#7E84A3', fontSize: '11px' }}>Choice filling locked. Rank prediction 88.0 percentile.</div>
                </div>
                <div className="p-2 rounded" style={{ background: '#FFF5F8' }}>
                  <span style={{ color: '#FF5E89', fontWeight: '700' }}>● AI Recommendations</span>
                  <div style={{ color: '#7E84A3', fontSize: '11px' }}>21 colleges matched with DA-IICT top recommendation.</div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Page Content */}
          <Outlet />
        </main>
      </div>

      {/* =================================================================
          STUDENT MODULES MODAL DRAWER
          ================================================================= */}
      {showDrawer && (
        <div className="admin-drawer-overlay" onClick={() => setShowDrawer(false)}>
          <div className="admin-drawer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1E1B4B' }}>
                  Student Portal Modules
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#7E84A3' }}>
                  Fast access to cutoffs, preference tuning, AI matching and college directory
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #E5E9F4',
                  background: '#F8FAFD',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} color="#7E84A3" />
              </button>
            </div>

            {/* Search filter in modal */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search modules, cutoffs, scholarships, compare..."
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
                className="admin-input-clean"
                autoFocus
              />
            </div>

            {/* Groups */}
            <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
              {filteredGroups.map((group) => (
                <div key={group.category} className="mb-4">
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#6C5CE7',
                      marginBottom: '8px'
                    }}
                  >
                    {group.category}
                  </div>
                  <div className="admin-drawer-grid">
                    {group.items.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <NavLink
                          key={item.key}
                          to={item.path}
                          className="admin-drawer-card"
                          onClick={() => setShowDrawer(false)}
                        >
                          <div className="icon-box">
                            <IconComp size={20} />
                          </div>
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '700', fontSize: '13px' }}>{item.label}</div>
                            <div style={{ fontSize: '11px', color: '#7E84A3' }} className="text-truncate">
                              {item.desc}
                            </div>
                          </div>
                          <ChevronRight size={16} color="#A3A8C3" />
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
