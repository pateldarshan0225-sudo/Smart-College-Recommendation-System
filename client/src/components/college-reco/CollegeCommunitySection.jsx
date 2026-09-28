import React, { useState, useEffect } from 'react';
import {
  Mail,
  MessageCircle,
  Sparkles,
  Search,
  Filter,
  MapPin,
  Building,
  Award,
  DollarSign,
  TrendingUp,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  BookOpen,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw
} from 'lucide-react';
import { SparkleStar } from './CollegeSquircles';
import { playSound } from '../../utils/audio';

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

import { ALL_COLLEGES_BENCHMARK, mergeWithApiColleges } from '../../data/collegesData';

export const CollegeCommunitySection = ({
  colleges = [],
  savedIds = [],
  onOpenQuickMatch,
  onOpenCollegeDetail,
  onOpenCompare,
  onToggleSave
}) => {
  const [activeTab, setActiveTab] = useState('explorer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [openFaq, setOpenFaq] = useState(null);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // Fast Simulator state
  const [simMarks, setSimMarks] = useState(84);
  const [simBudget, setSimBudget] = useState(300000);
  const [simCity, setSimCity] = useState('All');

  const collegeList = React.useMemo(() => {
    return mergeWithApiColleges(colleges);
  }, [colleges]);

  const uniqueCities = React.useMemo(() => {
    const set = new Set(collegeList.map((c) => c.city).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [collegeList]);

  // Filtered colleges for Explorer
  const filteredColleges = React.useMemo(() => {
    return collegeList.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.shortName || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q) ||
        (c.naac || '').toLowerCase().includes(q);
      const matchesCity = selectedCity === 'All' || c.city === selectedCity;
      const matchesType =
        selectedType === 'All' ||
        (selectedType === 'Government' && (c.collegeType?.toLowerCase().includes('govt') || c.collegeType?.toLowerCase().includes('government') || c.collegeType?.toLowerCase().includes('nit') || c.collegeType?.toLowerCase().includes('iit'))) ||
        (selectedType === 'Private' && c.collegeType?.toLowerCase().includes('private')) ||
        (selectedType === 'Autonomous' && c.collegeType?.toLowerCase().includes('autonomous')) ||
        (selectedType === 'Deemed' && c.collegeType?.toLowerCase().includes('deemed'));
      return matchesSearch && matchesCity && matchesType;
    });
  }, [collegeList, searchQuery, selectedCity, selectedType]);

  // Reset to page 1 whenever search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, selectedType, pageSize]);

  const totalColleges = filteredColleges.length;
  const totalPages = Math.max(1, Math.ceil(totalColleges / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalColleges);
  const paginatedColleges = filteredColleges.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) return;
    playSound('tap');
    setCurrentPage(page);
    const gridEl = document.getElementById('college-directory-grid');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setJumpPageInput('');
    }
  };

  const getPaginationItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (safeCurrentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages];
  };

  const handleTabSwitch = (tab) => {
    playSound('tap');
    setActiveTab(tab);
  };

  const toggleFaq = (index) => {
    playSound('pop');
    setOpenFaq(openFaq === index ? null : index);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCity !== 'All' || selectedType !== 'All';

  const resetFilters = () => {
    playSound('pop');
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedType('All');
    setCurrentPage(1);
  };

  return (
    <section className="re-community-wrapper" id="colleges-section" aria-label="College Explorer & Community">
      {/* Top Right Mini Nav Arrows (Exact visual from template) */}
      <div className="re-community-top-nav">
        <button
          className="re-nav-micro-btn"
          onClick={() => {
            playSound('tap');
            const tabs = ['explorer', 'simulator', 'reviews', 'faq'];
            const idx = tabs.indexOf(activeTab);
            setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length]);
          }}
          title="Previous tab"
          aria-label="Previous tab"
        >
          ←
        </button>
        <button
          className="re-nav-micro-btn"
          onClick={() => {
            playSound('tap');
            const tabs = ['explorer', 'simulator', 'reviews', 'faq'];
            const idx = tabs.indexOf(activeTab);
            setActiveTab(tabs[(idx + 1) % tabs.length]);
          }}
          title="Next tab"
          aria-label="Next tab"
        >
          →
        </button>
      </div>

      {/* Main Community Card Frame */}
      <div className="re-community-card">
        {/* Floating Sparkles inside card */}
        <div style={{ position: 'absolute', top: '24px', left: '28px', pointerEvents: 'none' }}>
          <SparkleStar size={20} color="#8A78B8" />
        </div>
        <div style={{ position: 'absolute', bottom: '80px', right: '28px', pointerEvents: 'none' }}>
          <SparkleStar size={22} color="#8A78B8" />
        </div>

        {/* Tag (Exact uppercase formatted tag) */}
        <div className="re-community-tag">
          - Smart College Recommendation System -
        </div>

        {/* Headline with amber capsule badge */}
        <h2 className="re-community-headline">
          Helps you discover and secure admission into top universities through trusted{' '}
          <span className="re-text-highlight-badge">Smart College</span> AI matching
        </h2>

        {/* Subtext */}
        <p className="re-community-subtext">
          Join thousands of students finding accredited universities matching their academic scores, budget, and career goals.
        </p>

        {/* Interactive Feature Tabs Bar */}
        <div className="re-community-tabs">
          <button
            className={`re-tab-pill ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('explorer')}
          >
            Live College Directory
          </button>
          <button
            className={`re-tab-pill ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('simulator')}
          >
            Instant Match Simulator
          </button>
          <button
            className={`re-tab-pill ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('reviews')}
          >
            Student Stories
          </button>
          <button
            className={`re-tab-pill ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('faq')}
          >
            Admissions FAQ
          </button>
        </div>

        {/* TAB 1: LIVE COLLEGE DIRECTORY EXPLORER WITH ADVANCED PAGINATION */}
        {activeTab === 'explorer' && (
          <div>
            {/* Search & Filter Toolbar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '16px',
              background: 'var(--re-bg-surface-subtle)',
              padding: '10px 14px',
              borderRadius: '16px',
              border: '1px solid var(--re-border-subtle)',
              alignItems: 'center'
            }}>
              <div style={{ flex: 2, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--re-border-subtle)' }}>
                <Search size={15} color="var(--re-text-muted)" />
                <input
                  type="text"
                  placeholder="Search 50+ universities or cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '13px', fontFamily: 'inherit' }}
                />
              </div>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--re-border-subtle)', background: '#FFFFFF', fontSize: '12.5px', fontFamily: 'inherit', fontWeight: 600 }}
              >
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city === 'All' ? 'All Cities (Gujarat & National)' : city}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--re-border-subtle)', background: '#FFFFFF', fontSize: '12.5px', fontFamily: 'inherit', fontWeight: 600 }}
              >
                <option value="All">All Types</option>
                <option value="Government">Government / National</option>
                <option value="Private">Private Autonomous</option>
                <option value="Autonomous">Autonomous</option>
                <option value="Deemed">Deemed University</option>
              </select>

              <button
                onClick={() => {
                  playSound('pop');
                  onOpenCompare();
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid var(--re-border-medium)',
                  color: 'var(--re-text-primary)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Compare Benchmark ↗
              </button>
            </div>

            {/* Results Counter & Page Size Toolbar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '6px 4px 16px',
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(124, 109, 175, 0.12)',
                  color: 'var(--re-accent-purple)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '12px'
                }}>
                  Showing {totalColleges > 0 ? startIndex + 1 : 0} – {endIndex} of {totalColleges} Colleges
                </span>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--re-accent-pink)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RotateCcw size={12} />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>

              {/* Page Size Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--re-text-secondary)', fontWeight: 600 }}>
                <span>Cards per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    playSound('tap');
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--re-border-subtle)',
                    background: '#FFFFFF',
                    color: 'var(--re-text-primary)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {[12, 24, 36, 48].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Colleges Grid */}
            <div id="college-directory-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px', textAlign: 'left' }}>
              {paginatedColleges.map((col) => {
                const isSaved = savedIds.includes(col._id);
                return (
                  <div
                    key={col._id}
                    style={{
                      background: 'var(--re-bg-surface-subtle)',
                      border: '1px solid var(--re-border-subtle)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10.5px', background: 'rgba(124, 109, 175, 0.12)', color: 'var(--re-accent-purple)', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                          {col.collegeType || 'Autonomous'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFA439' }}>⭐ {col.collegeRating || '4.6'}</span>
                          <button
                            onClick={() => {
                              playSound('pop');
                              if (onToggleSave) onToggleSave(col);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: isSaved ? 'var(--re-accent-pink)' : 'var(--re-text-muted)',
                              padding: '2px'
                            }}
                            title={isSaved ? 'Saved' : 'Save'}
                          >
                            <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 6px', lineHeight: 1.3 }}>
                        {col.name}
                      </h4>

                      <div style={{ fontSize: '11.5px', color: 'var(--re-text-secondary)', display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <span>📍 {col.city || 'Gujarat'}</span>
                        <span>•</span>
                        <span>Min Cutoff: {col.eligibilityPercentage || 50}%</span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--re-border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--re-text-muted)', fontWeight: 600 }}>AVG PACKAGE</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFA439' }}>{col.avgPackage || '₹8.5 LPA'}</div>
                      </div>

                      <button
                        className="re-dossier-btn"
                        onClick={() => {
                          playSound('pop');
                          if (onOpenCollegeDetail) onOpenCollegeDetail(col);
                        }}
                      >
                        <span>Dossier</span>
                        <ArrowUpRight className="re-dossier-arrow" size={13} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State if no colleges match */}
            {paginatedColleges.length === 0 && (
              <div style={{
                background: 'var(--re-bg-surface-subtle)',
                borderRadius: '18px',
                border: '1px solid var(--re-border-subtle)',
                padding: '48px 24px',
                textAlign: 'center',
                marginBottom: '28px'
              }}>
                <Search size={36} color="var(--re-accent-purple)" style={{ opacity: 0.6, marginBottom: '12px' }} />
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 6px' }}>
                  No colleges match your search criteria
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--re-text-secondary)', maxWidth: '420px', margin: '0 auto 16px' }}>
                  Try changing your keyword search, selecting "All Cities", or resetting your institute category filter.
                </p>
                <button
                  onClick={resetFilters}
                  className="re-nav-primary-action-btn"
                  style={{ padding: '8px 18px', fontSize: '12.5px' }}
                >
                  Reset Search & Filters
                </button>
              </div>
            )}

            {/* HIGH-END PAGINATION BAR */}
            {totalPages > 1 && (
              <div style={{
                background: 'var(--re-bg-surface-subtle)',
                border: '1px solid var(--re-border-subtle)',
                borderRadius: '20px',
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '28px',
                boxShadow: '0 4px 20px rgba(78, 63, 166, 0.04)'
              }}>
                {/* Left: Info */}
                <div style={{ fontSize: '12.5px', color: 'var(--re-text-secondary)', fontWeight: 700 }}>
                  Page <strong style={{ color: 'var(--re-accent-purple)' }}>{safeCurrentPage}</strong> of <strong>{totalPages}</strong>
                </div>

                {/* Center: Pagination Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {/* First Page Button */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={safeCurrentPage === 1}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      border: '1px solid var(--re-border-subtle)',
                      background: '#FFFFFF',
                      color: safeCurrentPage === 1 ? 'var(--re-text-muted)' : 'var(--re-text-primary)',
                      cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: safeCurrentPage === 1 ? 0.45 : 1,
                      transition: 'all 0.15s ease'
                    }}
                    title="First Page"
                  >
                    <ChevronsLeft size={15} />
                  </button>

                  {/* Previous Page Button */}
                  <button
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '0 10px',
                      height: '32px',
                      borderRadius: '10px',
                      border: '1px solid var(--re-border-subtle)',
                      background: '#FFFFFF',
                      color: safeCurrentPage === 1 ? 'var(--re-text-muted)' : 'var(--re-text-primary)',
                      cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: 700,
                      opacity: safeCurrentPage === 1 ? 0.45 : 1,
                      transition: 'all 0.15s ease'
                    }}
                    title="Previous Page"
                  >
                    <ChevronLeft size={14} />
                    <span>Prev</span>
                  </button>

                  {/* Page Number Pills */}
                  {getPaginationItems().map((item, idx) => {
                    if (item === '...') {
                      return (
                        <span
                          key={`dots-${idx}`}
                          style={{
                            padding: '0 6px',
                            color: 'var(--re-text-muted)',
                            fontWeight: 800,
                            fontSize: '13px'
                          }}
                        >
                          …
                        </span>
                      );
                    }

                    const isCurrent = item === safeCurrentPage;
                    return (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        style={{
                          minWidth: '32px',
                          height: '32px',
                          padding: '0 8px',
                          borderRadius: '10px',
                          border: isCurrent ? 'none' : '1px solid var(--re-border-subtle)',
                          background: isCurrent
                            ? 'linear-gradient(135deg, var(--re-accent-purple, #7C6DAF) 0%, var(--re-accent-purple-dark, #584887) 100%)'
                            : '#FFFFFF',
                          color: isCurrent ? '#FFFFFF' : 'var(--re-text-primary)',
                          fontWeight: isCurrent ? 900 : 700,
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          boxShadow: isCurrent ? '0 4px 14px rgba(124, 109, 175, 0.4)' : 'none',
                          transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {item}
                      </button>
                    );
                  })}

                  {/* Next Page Button */}
                  <button
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '0 10px',
                      height: '32px',
                      borderRadius: '10px',
                      border: '1px solid var(--re-border-subtle)',
                      background: '#FFFFFF',
                      color: safeCurrentPage === totalPages ? 'var(--re-text-muted)' : 'var(--re-text-primary)',
                      cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: 700,
                      opacity: safeCurrentPage === totalPages ? 0.45 : 1,
                      transition: 'all 0.15s ease'
                    }}
                    title="Next Page"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* Last Page Button */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={safeCurrentPage === totalPages}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      border: '1px solid var(--re-border-subtle)',
                      background: '#FFFFFF',
                      color: safeCurrentPage === totalPages ? 'var(--re-text-muted)' : 'var(--re-text-primary)',
                      cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: safeCurrentPage === totalPages ? 0.45 : 1,
                      transition: 'all 0.15s ease'
                    }}
                    title="Last Page"
                  >
                    <ChevronsRight size={15} />
                  </button>
                </div>

                {/* Right: Quick Jump Form */}
                <form
                  onSubmit={handleJumpSubmit}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                >
                  <span style={{ color: 'var(--re-text-secondary)', fontWeight: 600 }}>Jump to:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    placeholder="#"
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                    style={{
                      width: '46px',
                      height: '30px',
                      padding: '0 6px',
                      borderRadius: '8px',
                      border: '1px solid var(--re-border-subtle)',
                      background: '#FFFFFF',
                      color: 'var(--re-text-primary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      height: '30px',
                      padding: '0 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--re-border-medium)',
                      background: '#FFFFFF',
                      color: 'var(--re-text-primary)',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Go
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INSTANT MATCH SIMULATOR */}
        {activeTab === 'simulator' && (
          <div style={{ background: 'var(--re-bg-surface-subtle)', border: '1px solid var(--re-border-subtle)', borderRadius: '18px', padding: '24px', marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--re-text-primary)', display: 'block', marginBottom: '6px' }}>
                  12th Board Score: <strong style={{ color: 'var(--re-accent-purple)' }}>{simMarks}%</strong>
                </label>
                <input
                  type="range"
                  min="55"
                  max="98"
                  value={simMarks}
                  onChange={(e) => {
                    playSound('tap');
                    setSimMarks(Number(e.target.value));
                  }}
                  style={{ width: '100%', accentColor: 'var(--re-accent-purple)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--re-text-primary)', display: 'block', marginBottom: '6px' }}>
                  Max Budget: <strong style={{ color: 'var(--re-accent-amber)' }}>₹{(simBudget / 100000).toFixed(1)}L / yr</strong>
                </label>
                <input
                  type="range"
                  min="20000"
                  max="500000"
                  step="20000"
                  value={simBudget}
                  onChange={(e) => {
                    playSound('tap');
                    setSimBudget(Number(e.target.value));
                  }}
                  style={{ width: '100%', accentColor: 'var(--re-accent-amber)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--re-text-primary)', display: 'block', marginBottom: '6px' }}>
                  Preferred City
                </label>
                <select
                  value={simCity}
                  onChange={(e) => setSimCity(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--re-border-subtle)', fontFamily: 'inherit' }}
                >
                  <option value="All">Any City</option>
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Anand">Anand</option>
                </select>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                className="re-btn-primary"
                onClick={() => {
                  playSound('pop');
                  onOpenQuickMatch();
                }}
                style={{ maxWidth: '380px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Launch Deep AI Match Engine 🚀
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT STORIES */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '32px', textAlign: 'left' }}>
            {[
              {
                name: 'Aarav Patel',
                college: 'DA-IICT (B.Tech ICT)',
                placed: 'Software Dev at Microsoft (₹42 LPA)',
                quote: 'Smart College Recommendation matched me with DA-IICT when I had 89% in 12th. The multi-factor ROI and placement insights gave me the confidence to choose ICT over traditional branches.',
                color: '#7C6DAF'
              },
              {
                name: 'Diya Shah',
                college: 'Nirma University (B.Tech CSE)',
                placed: 'Cloud Engineer at Oracle (₹18 LPA)',
                quote: 'The cutoffs and fee simulator were 100% accurate. The system accurately predicted my ACPC admission round chances.',
                color: '#FFA439'
              },
              {
                name: 'Rohan Sharma',
                college: 'LDCE Govt (Mechanical Eng)',
                placed: 'Graduate Trainee at L&T (₹9 LPA)',
                quote: 'I had a strict annual budget of ₹50,000. The recommendation engine showed me LDCE had the highest ROI with a total fee of just ₹6,500/year!',
                color: '#35C7B8'
              }
            ].map((rev, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--re-bg-surface-subtle)',
                  border: '1px solid var(--re-border-subtle)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <p style={{ fontSize: '12.5px', color: 'var(--re-text-primary)', lineHeight: 1.45, margin: '0 0 14px', fontStyle: 'italic' }}>
                  "{rev.quote}"
                </p>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--re-text-primary)' }}>{rev.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--re-accent-purple)', fontWeight: 700 }}>{rev.college}</div>
                  <div style={{ fontSize: '11px', color: '#FFA439', fontWeight: 600 }}>{rev.placed}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: FAQS */}
        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', textAlign: 'left' }}>
            {[
              { q: 'How does the Smart College AI algorithm rank universities?', a: 'The engine uses a 6-factor weighted multi-criteria decision algorithm: Academic Cutoff Match (30%), Course Alignment (20%), Placement Package Tier (20%), Annual Budget Fit (15%), Campus Facilities (10%), and Geographic Preference (5%).' },
              { q: 'Are government and private college fees up to date?', a: 'Yes! Tuition, hostel, and miscellaneous fees are synced directly from accredited regulatory bodies (ACPC / AICTE / University fee committees).' },
              { q: 'Can I compare government colleges with private autonomous universities?', a: 'Absolutely! Our side-by-side benchmark matrix allows direct comparison of fees, placement averages, and campus infrastructure.' }
            ].map((faq, i) => (
              <div
                key={i}
                onClick={() => toggleFaq(i)}
                style={{
                  background: 'var(--re-bg-surface-subtle)',
                  border: '1px solid var(--re-border-subtle)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '13.5px', color: 'var(--re-text-primary)' }}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '16px', color: 'var(--re-accent-purple)' }}>{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <p style={{ margin: '10px 0 0', fontSize: '12.5px', color: 'var(--re-text-secondary)', lineHeight: 1.45 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Card Footer Bar (Exact match to uploaded design) */}
        <div className="re-card-footer">
          {/* Left Attribution */}
          <div className="re-footer-left">
            Part of Smart College Recommendation System
          </div>

          {/* Center Social Links */}
          <div className="re-footer-center" aria-label="Social media links">
            <a
              href="mailto:support@smartcollege.edu"
              className="re-social-icon-btn"
              title="Email Admissions Helpdesk"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>

            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="re-social-icon-btn"
              title="WhatsApp Student Counseling"
              aria-label="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="re-social-icon-btn"
              title="Instagram @smartcollege"
              aria-label="Instagram"
            >
              <InstagramIcon size={16} />
            </a>
          </div>

          {/* Right Attribution */}
          <div className="re-footer-right">
            Archived by Smart College • 2024
          </div>
        </div>
      </div>
    </section>
  );
};
