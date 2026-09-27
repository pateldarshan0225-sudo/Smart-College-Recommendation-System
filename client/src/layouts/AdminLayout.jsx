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
  Moon
} from 'lucide-react';

const ENTITY_GROUPS = [
  {
    category: 'Colleges & Programs',
    items: [
      { key: 'colleges', label: 'Colleges Directory', icon: Building2, desc: 'Manage accredited universities & campuses' },
      { key: 'courses', label: 'Courses & Degrees', icon: GraduationCap, desc: 'B.Tech, MBBS, MBA and diploma programs' },
      { key: 'college_courses', label: 'College Course Mapping', icon: Compass, desc: 'Seats, eligibility and cutoffs' },
    ]
  },
  {
    category: 'Campus & Career',
    items: [
      { key: 'college_placements', label: 'Placements & Packages', icon: BarChart3, desc: 'Average CTC, highest offers & top recruiters' },
      { key: 'college_fees', label: 'Fees & Scholarships', icon: DollarSign, desc: 'Tuition fees, hostel costs and waivers' },
      { key: 'campus_facilities', label: 'Campus Facilities', icon: ShieldCheck, desc: 'Hostels, sports, wifi, labs & infrastructure' },
    ]
  },
  {
    category: 'Students & Profiles',
    items: [
      { key: 'users', label: 'User Accounts', icon: Users, desc: 'Student, counselor and administrator logins' },
      { key: 'student_profiles', label: 'Student Profiles', icon: Users, desc: 'Career goals, budget and location preferences' },
      { key: 'academic_records', label: 'Academic Records', icon: GraduationCap, desc: '10th, 12th percentages & entrance exams' },
    ]
  },
  {
    category: 'AI Recommendation Engine',
    items: [
      { key: 'recommendations', label: 'Recommendation Matches', icon: Sparkles, desc: 'Multi-criteria weighted match results' },
      { key: 'saved_colleges', label: 'Saved Colleges', icon: CheckCircle2, desc: 'Colleges bookmarked by students' },
    ]
  }
];

const ENTITY_LABELS = {
  users: 'Users Directory',
  student_profiles: 'Student Profiles',
  academic_records: 'Academic Records',
  colleges: 'Colleges & Universities',
  courses: 'Course Curriculum',
  college_courses: 'College Courses & Seats',
  college_placements: 'Placement Drives & CTC',
  college_fees: 'Fee Structures & Aids',
  campus_facilities: 'Campus Facilities',
  saved_colleges: 'Saved Colleges',
  recommendations: 'AI Recommendation Results'
};

export default function AdminLayout() {
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
        setShowDrawer(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const currentPath = location.pathname;
  let pageTitle = 'Dashboard';
  let eyebrow = 'Primary';

  for (const [key, label] of Object.entries(ENTITY_LABELS)) {
    if (currentPath.includes(`/admin/${key}`)) {
      pageTitle = label;
      eyebrow = 'Entity Management';
      break;
    }
  }

  const handleLogout = async () => {
    await logout();
    nav('/login');
  };

  const userInitials = user?.name
    ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'DA';

  const filteredGroups = ENTITY_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(drawerSearch.toLowerCase()) ||
      item.desc.toLowerCase().includes(drawerSearch.toLowerCase()) ||
      item.key.toLowerCase().includes(drawerSearch.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <div className="admin-body-wrap">
      <div className="admin-shell">
        {/* LEFT DOCK SIDEBAR */}
        <aside className="admin-dock">
          {/* Bell button with notification dot */}
          <button
            className="admin-dock-bell"
            title="Notifications"
            onClick={() => setShowNotificationToast(!showNotificationToast)}
          >
            <Bell size={20} />
            <span className="admin-dock-bell-dot" />
          </button>

          {/* Navigation Dock */}
          <nav className="admin-dock-nav">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
            >
              <Home size={22} />
              <span className="admin-dock-tooltip">Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/colleges"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
            >
              <Building2 size={22} />
              <span className="admin-dock-tooltip">Colleges</span>
            </NavLink>

            <NavLink
              to="/admin/courses"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
            >
              <GraduationCap size={22} />
              <span className="admin-dock-tooltip">Courses</span>
            </NavLink>

            <NavLink
              to="/admin/college_placements"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
            >
              <BarChart3 size={22} />
              <span className="admin-dock-tooltip">Placements</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
            >
              <Users size={22} />
              <span className="admin-dock-tooltip">Users & Students</span>
            </NavLink>

            <NavLink
              to="/admin/recommendations"
              className={({ isActive }) => `admin-dock-item ${isActive ? 'active' : ''}`}
            >
              <Sparkles size={22} />
              <span className="admin-dock-tooltip">AI Recommendations</span>
            </NavLink>

            {/* Quick Entity Switcher Button */}
            <button
              type="button"
              className="admin-dock-item"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => setShowDrawer(true)}
              title="All 11 Entities"
            >
              <Layers size={22} />
              <span className="admin-dock-tooltip">All Database Entities</span>
            </button>
          </nav>

          {/* Bottom Dock Actions */}
          <div className="admin-dock-bottom">
            <button
              type="button"
              className="admin-dock-item"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '8px' }}
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              <span className="admin-dock-tooltip">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              className="admin-dock-item"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={20} />
              <span className="admin-dock-tooltip">Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <main className="admin-main-wrap">
          {/* TOP HEADER */}
          <header className="admin-header">
            <div className="admin-header-title-wrap">
              <div className="eyebrow">{eyebrow}</div>
              <h1>{pageTitle}</h1>
            </div>

            <div className="admin-header-actions">
              {/* System Health Pulse Beacon */}
              <div className="admin-system-health" title="API Gateway Connected on port 5000">
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
                onClick={() => setShowDrawer(true)}
                title="Global Search & Jump (Ctrl+K)"
              >
                <Search size={15} className="admin-cmd-icon" />
                <span className="admin-cmd-placeholder">Search colleges, courses, data...</span>
                <kbd className="admin-cmd-kbd">
                  <span className="admin-cmd-mod">Ctrl</span>
                  <span>K</span>
                </kbd>
              </button>

              {/* Collections / Database Hub Switcher */}
              <button
                type="button"
                className="admin-collections-btn"
                onClick={() => setShowDrawer(true)}
                title="Browse all 11 Database Collections"
              >
                <div className="admin-collections-icon-wrap">
                  <Database size={15} />
                </div>
                <span className="admin-collections-title">Collections</span>
                <span className="admin-hub-badge">11</span>
                <ChevronDown size={14} className="admin-collections-chevron" />
              </button>

              {/* Quick Light / Dark Mode Toggle Pill */}
              <button
                type="button"
                className={`admin-theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'}`}
                onClick={toggleTheme}
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

              {/* Interactive User Profile with Dropdown */}
              <div className="admin-profile-container" ref={profileMenuRef}>
                <button
                  type="button"
                  className={`admin-profile-trigger ${showProfileMenu ? 'active' : ''}`}
                  onClick={() => setShowProfileMenu(prev => !prev)}
                  aria-expanded={showProfileMenu}
                  title="Account Settings & Session"
                >
                  <div className="admin-profile-avatar-wrap">
                    <div className="admin-profile-avatar">
                      {userInitials}
                    </div>
                    <span className="admin-avatar-live-dot" title="Active Session Online" />
                  </div>
                  
                  <div className="admin-profile-info d-none d-sm-flex">
                    <span className="admin-profile-name">{user?.name || 'Darshan Admin'}</span>
                    <span className="admin-profile-role-tag">SUPER ADMIN</span>
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
                        <div className="admin-dropdown-name">{user?.name || 'Darshan Admin'}</div>
                        <div className="admin-dropdown-email">{user?.email || 'darshan@gmail.com'}</div>
                        <div className="admin-dropdown-badge-row">
                          <span className="admin-status-chip">
                            <span className="admin-chip-dot" /> Online
                          </span>
                          <span className="admin-tier-chip">Root Admin</span>
                        </div>
                      </div>
                    </div>

                    <div className="admin-dropdown-divider" />

                    {/* Quick Management Shortcuts */}
                    <div className="admin-dropdown-section-title">Quick Management</div>
                    <div className="admin-dropdown-nav">
                      <button
                        type="button"
                        className="admin-dropdown-nav-item"
                        onClick={() => { setShowProfileMenu(false); nav('/admin/colleges'); }}
                      >
                        <Building2 size={16} />
                        <span>Colleges Directory</span>
                        <span className="admin-nav-count-badge">12</span>
                      </button>
                      <button
                        type="button"
                        className="admin-dropdown-nav-item"
                        onClick={() => { setShowProfileMenu(false); nav('/admin/courses'); }}
                      >
                        <GraduationCap size={16} />
                        <span>Courses & Degrees</span>
                        <span className="admin-nav-count-badge">10</span>
                      </button>
                      <button
                        type="button"
                        className="admin-dropdown-nav-item"
                        onClick={() => { setShowProfileMenu(false); nav('/admin/users'); }}
                      >
                        <Users size={16} />
                        <span>User Accounts</span>
                      </button>
                      <button
                        type="button"
                        className="admin-dropdown-nav-item"
                        onClick={() => { setShowProfileMenu(false); nav('/admin/recommendations'); }}
                      >
                        <Sparkles size={16} />
                        <span>AI Recommendations</span>
                      </button>
                    </div>

                    <div className="admin-dropdown-divider" />

                    {/* Theme Switcher in Profile Menu */}
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

                    {/* Telemetry info */}
                    <div className="admin-dropdown-telemetry">
                      <div className="admin-telemetry-item">
                        <span className="admin-telemetry-label">Database</span>
                        <span className="admin-telemetry-value">MongoDB 7.0 Active</span>
                      </div>
                      <div className="admin-telemetry-item">
                        <span className="admin-telemetry-label">API Gateway</span>
                        <span className="admin-telemetry-value">Port 5000 Live</span>
                      </div>
                    </div>

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

          {/* NOTIFICATION POPUP */}
          {showNotificationToast && (
            <div
              style={{
                position: 'absolute',
                top: '72px',
                left: '96px',
                zIndex: 100,
                background: '#FFFFFF',
                borderRadius: '18px',
                boxShadow: '0 12px 35px rgba(35, 24, 94, 0.18)',
                border: '1px solid #E5E9F4',
                padding: '16px 20px',
                width: '320px',
                animation: 'fadeIn 0.2s ease'
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong style={{ fontSize: '13px', color: '#1E1B4B' }}>System Notifications</strong>
                <button
                  onClick={() => setShowNotificationToast(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#7E84A3' }}
                >
                  <X size={16} />
                </button>
              </div>
              <div style={{ fontSize: '12px', color: '#555' }} className="d-flex flex-column gap-2">
                <div className="p-2 rounded" style={{ background: '#F8F9FE' }}>
                  <span style={{ color: '#10B981', fontWeight: '700' }}>● System Healthy</span>
                  <div style={{ color: '#7E84A3', fontSize: '11px' }}>All 11 Database collections connected.</div>
                </div>
                <div className="p-2 rounded" style={{ background: '#FFF5F8' }}>
                  <span style={{ color: '#FF5E89', fontWeight: '700' }}>● Recommendation Engine</span>
                  <div style={{ color: '#7E84A3', fontSize: '11px' }}>Scoring algorithm operational.</div>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC ROUTE OUTLET */}
          <Outlet />
        </main>
      </div>

      {/* ALL 11 ENTITIES MODAL DRAWER */}
      {showDrawer && (
        <div className="admin-drawer-overlay" onClick={() => setShowDrawer(false)}>
          <div className="admin-drawer-modal" onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1E1B4B' }}>
                  Database Entity Directory
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#7E84A3' }}>
                  Direct access to manage, query, and modify all 11 core collections
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

            {/* Search Filter in modal */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search collection by name or description..."
                value={drawerSearch}
                onChange={e => setDrawerSearch(e.target.value)}
                className="admin-input-clean"
                autoFocus
              />
            </div>

            {/* Groups */}
            <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
              {filteredGroups.map(group => (
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
                    {group.items.map(item => {
                      const IconComp = item.icon;
                      return (
                        <NavLink
                          key={item.key}
                          to={`/admin/${item.key}`}
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
