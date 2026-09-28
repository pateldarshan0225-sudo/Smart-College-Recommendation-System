import React, { useState, useMemo } from 'react';
import {
  Award,
  Search,
  ArrowUpDown,
  Bookmark,
  ExternalLink,
  MapPin,
  Building2,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Sparkles,
  Trophy,
  LayoutGrid,
  Table,
  ArrowUpRight,
  Scale,
  ShieldCheck,
  Flame,
  Star,
  Compass,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { playSound } from '../../utils/audio';
import { ALL_COLLEGES_BENCHMARK, TOP_12_COLLEGES, mergeWithApiColleges } from '../../data/collegesData';

export const CollegeLeaderboardSection = ({ colleges = [], onSelectCollege, onOpenCompare }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [filterType, setFilterType] = useState('Top12'); // 'Top12' | 'All' | 'Government' | 'Private' | 'Autonomous' | 'Deemed'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  // Merge full 50+ college benchmark dataset with live backend API colleges
  const dataset = useMemo(() => {
    return mergeWithApiColleges(colleges);
  }, [colleges]);

  // Counts for pills
  const counts = useMemo(() => {
    const total = dataset.length;
    const top12 = Math.min(12, total);
    const govt = dataset.filter((c) =>
      c.collegeType?.toLowerCase().includes('govt') ||
      c.collegeType?.toLowerCase().includes('government') ||
      c.collegeType?.toLowerCase().includes('nit') ||
      c.collegeType?.toLowerCase().includes('iit')
    ).length;
    const pvt = dataset.filter((c) => c.collegeType?.toLowerCase().includes('private')).length;
    const auton = dataset.filter((c) => c.collegeType?.toLowerCase().includes('autonomous')).length;
    const deemed = dataset.filter((c) => c.collegeType?.toLowerCase().includes('deemed')).length;

    return { total, top12, govt, pvt, auton, deemed };
  }, [dataset]);

  // Filter & Search Logic
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    let list = dataset.filter((c) => {
      // If user typed in search query, search across entire 50+ colleges
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.shortName || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q) ||
        (c.naac || '').toLowerCase().includes(q) ||
        (c.nirf || '').toLowerCase().includes(q) ||
        (c.highlight || '').toLowerCase().includes(q) ||
        (c.university || '').toLowerCase().includes(q);

      // If searching, ignore Top12 limitation so the entire database is searchable
      if (q) {
        if (filterType === 'All' || filterType === 'Top12') return matchesSearch;
        if (filterType === 'Government') {
          const isGovt =
            c.collegeType?.toLowerCase().includes('govt') ||
            c.collegeType?.toLowerCase().includes('government') ||
            c.collegeType?.toLowerCase().includes('nit') ||
            c.collegeType?.toLowerCase().includes('iit');
          return matchesSearch && isGovt;
        }
        if (filterType === 'Private') return matchesSearch && c.collegeType?.toLowerCase().includes('private');
        if (filterType === 'Autonomous') return matchesSearch && c.collegeType?.toLowerCase().includes('autonomous');
        if (filterType === 'Deemed') return matchesSearch && c.collegeType?.toLowerCase().includes('deemed');
        return matchesSearch;
      }

      // Default state with no search text:
      if (filterType === 'Top12') {
        return c.rankNum <= 12;
      }
      if (filterType === 'Government') {
        return (
          c.collegeType?.toLowerCase().includes('govt') ||
          c.collegeType?.toLowerCase().includes('government') ||
          c.collegeType?.toLowerCase().includes('nit') ||
          c.collegeType?.toLowerCase().includes('iit')
        );
      }
      if (filterType === 'Private') return c.collegeType?.toLowerCase().includes('private');
      if (filterType === 'Autonomous') return c.collegeType?.toLowerCase().includes('autonomous');
      if (filterType === 'Deemed') return c.collegeType?.toLowerCase().includes('deemed');

      return true; // 'All'
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'highestPackage') return (b.highestPackageVal || 0) - (a.highestPackageVal || 0);
      if (sortBy === 'avgPackage') return (b.avgPackageVal || 0) - (a.avgPackageVal || 0);
      if (sortBy === 'fees') return (a.annualFeeVal || 0) - (b.annualFeeVal || 0);
      if (sortBy === 'rating') return (b.collegeRating || 0) - (a.collegeRating || 0);
      if (sortBy === 'placement') return (b.placementRateVal || 0) - (a.placementRateVal || 0);
      return (a.rankNum || 999) - (b.rankNum || 999);
    });

    return list;
  }, [dataset, search, filterType, sortBy]);

  // Pagination Calculations
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginatedColleges = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (type) => {
    playSound('tap');
    setFilterType(type);
    setCurrentPage(1);
  };

  const handleSortChange = (val) => {
    playSound('tap');
    setSortBy(val);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    playSound('tap');
    setCurrentPage(newPage);
  };

  // Top 3 for 3D Podium
  const top3 = dataset.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3; // [Silver (#2), Gold (#1), Bronze (#3)]

  return (
    <section className="re-3d-leaderboard-section" aria-label="Top Accredited Universities & Placement Rankings">
      {/* 3D Atmospheric Background Glows */}
      <div style={{ position: 'absolute', top: '-60px', right: '10%', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(255, 164, 57, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '100px', left: '-40px', width: '340px', height: '340px', background: 'radial-gradient(circle, rgba(124, 109, 175, 0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Header with 3D Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 2 }}>
        <div>
          <div className="re-interactive-badge" style={{ marginBottom: '10px', boxShadow: '0 4px 14px rgba(124, 109, 175, 0.18)' }}>
            <Trophy size={13} /> STATEWIDE UNIVERSITY BENCHMARK 2024–2025
          </div>
          <h2 className="re-section-title" style={{ fontSize: '32px', letterSpacing: '-0.03em' }}>
            Top Accredited Universities & Placement Rankings
          </h2>
          <p className="re-section-subtitle" style={{ marginTop: '6px' }}>
            Verified ACPC academic cutoffs, NIRF placement metrics, NAAC grade audits, and real tuition ROI.
          </p>
        </div>

        {/* View Switcher & Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="re-3d-segment-container">
            <button
              className={`re-3d-segment-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => {
                playSound('tap');
                setViewMode('cards');
              }}
            >
              <LayoutGrid size={14} />
              <span>3D Cards</span>
            </button>
            <button
              className={`re-3d-segment-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => {
                playSound('tap');
                setViewMode('table');
              }}
            >
              <Table size={14} />
              <span>3D Matrix</span>
            </button>
          </div>

          {onOpenCompare && (
            <button
              onClick={() => {
                playSound('pop');
                onOpenCompare();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'rgba(124, 109, 175, 0.12)',
                border: '1.5px solid rgba(124, 109, 175, 0.3)',
                color: 'var(--re-accent-purple)',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Scale size={14} />
              <span>Compare (VS)</span>
            </button>
          )}
        </div>
      </div>

      {/* 3D Ticker Metrics Bar */}
      <div className="re-3d-ticker-grid">
        <div className="re-3d-ticker-item">
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(255, 164, 57, 0.15)', color: '#FFA439', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Building2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--re-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Audited Institutions</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--re-text-primary)' }}>{counts.total}+ Universities</div>
          </div>
        </div>

        <div className="re-3d-ticker-item">
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(255, 101, 132, 0.15)', color: '#FF6584', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Flame size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--re-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>State Highest CTC</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#FF6584' }}>₹62.0 LPA (IITGN / DA-IICT)</div>
          </div>
        </div>

        <div className="re-3d-ticker-item">
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(53, 199, 184, 0.15)', color: '#35C7B8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--re-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Peak Placement Rate</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#35C7B8' }}>97.2% Verified</div>
          </div>
        </div>

        <div className="re-3d-ticker-item">
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(124, 109, 175, 0.15)', color: '#7C6DAF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--re-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Highest Govt ROI</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--re-accent-purple)' }}>3800% (LDCE ₹1.5k Fee)</div>
          </div>
        </div>
      </div>

      {/* 3D HOLOGRAPHIC PODIUM (Top 3 Rankers Spotlight) */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={16} color="var(--re-accent-amber)" />
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--re-text-primary)', margin: 0 }}>
            State Rank Podium Showcase
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--re-text-muted)' }}>— Gujarat's Top-3 League</span>
        </div>

        <div className="re-3d-podium-container">
          {podiumOrder.map((col, idx) => {
            const isRank1 = col.rankNum === 1;
            const isRank2 = col.rankNum === 2;
            const isRank3 = col.rankNum === 3;

            const podiumClass = isRank1
              ? 're-3d-podium-gold'
              : isRank2
              ? 're-3d-podium-silver'
              : 're-3d-podium-bronze';

            const medalIcon = isRank1 ? '🥇' : isRank2 ? '🥈' : '🥉';
            const tierBadge = isRank1 ? '🏆 Rank #1 Gold' : isRank2 ? '🥈 Rank #2 Silver' : '🥉 Rank #3 Bronze';
            const medalColor = isRank1 ? '#FFA439' : isRank2 ? '#7C6DAF' : '#35C7B8';

            return (
              <div
                key={col._id || idx}
                className={`re-3d-podium-card ${podiumClass}`}
                onClick={() => {
                  playSound('pop');
                  if (onSelectCollege) onSelectCollege(col);
                }}
              >
                {/* Top Podium Ribbon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div className="re-3d-medal-badge" style={{ background: `${medalColor}18`, border: `2px solid ${medalColor}` }}>
                    {medalIcon}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, background: medalColor, color: '#FFFFFF', padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {tierBadge}
                    </span>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--re-text-muted)', marginTop: '3px' }}>
                      {col.naac} • {col.nirf}
                    </div>
                  </div>
                </div>

                {/* College Info */}
                <h4 style={{ fontSize: isRank1 ? '17.5px' : '16px', fontWeight: 900, color: 'var(--re-text-primary)', margin: '0 0 4px', lineHeight: 1.3 }}>
                  {col.name}
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--re-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                  <MapPin size={13} color="var(--re-accent-purple)" />
                  <span>{col.city}, Gujarat</span>
                  <span>•</span>
                  <span style={{ fontWeight: 700, color: 'var(--re-text-primary)' }}>Min {col.eligibilityPercentage}% Cutoff</span>
                </div>

                {/* Key 3D Stat Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  <div className="re-3d-stat-box">
                    <span style={{ fontSize: '10.5px', color: 'var(--re-text-muted)', fontWeight: 700 }}>AVG PACKAGE</span>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#FFA439' }}>{col.avgPackage}</span>
                  </div>

                  <div className="re-3d-stat-box">
                    <span style={{ fontSize: '10.5px', color: 'var(--re-text-muted)', fontWeight: 700 }}>HIGHEST CTC</span>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#FF6584' }}>{col.highestPackage}</span>
                  </div>

                  <div className="re-3d-stat-box">
                    <span style={{ fontSize: '10.5px', color: 'var(--re-text-muted)', fontWeight: 700 }}>PLACEMENT RATE</span>
                    <span style={{ fontSize: '15px', fontWeight: 900, color: '#35C7B8' }}>{col.placementRate}</span>
                  </div>

                  <div className="re-3d-stat-box">
                    <span style={{ fontSize: '10.5px', color: 'var(--re-text-muted)', fontWeight: 700 }}>ANNUAL FEES</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--re-text-primary)' }}>{col.avgFee}</span>
                  </div>
                </div>

                {/* Highlight banner & CTA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed var(--re-border-subtle)', marginTop: 'auto' }}>
                  <span style={{ fontSize: '11px', color: 'var(--re-text-secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={12} fill="#FFA439" color="#FFA439" /> {col.collegeRating} / 5.0 Rating
                  </span>
                  <button
                    className="re-dossier-btn"
                    style={{ color: medalColor, borderColor: `${medalColor}40` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('pop');
                      if (onSelectCollege) onSelectCollege(col);
                    }}
                  >
                    <span>3D Dossier</span>
                    <ArrowUpRight className="re-dossier-arrow" size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Multi-Dimensional Filter Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
        background: 'var(--re-bg-surface-subtle)',
        padding: '14px 18px',
        borderRadius: '20px',
        border: '1.5px solid var(--re-border-subtle)',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search input with icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFFFFF', padding: '9px 16px', borderRadius: '12px', border: '1px solid var(--re-border-subtle)', flex: '1 1 280px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <Search size={16} color="var(--re-text-muted)" />
          <input
            type="text"
            placeholder="Search all 50+ colleges by name, city (e.g. Surat, Rajkot), NAAC grade..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '13px', fontFamily: 'inherit', color: 'var(--re-text-primary)' }}
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px', color: 'var(--re-text-muted)' }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Type Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'Top12', label: `⭐ Top 12 (${counts.top12})` },
            { id: 'All', label: `🌐 All (${counts.total})` },
            { id: 'Government', label: `🏛️ Govt (${counts.govt})` },
            { id: 'Private', label: `💎 Private (${counts.pvt})` },
            { id: 'Autonomous', label: `⚡ Autonomous (${counts.auton})` },
            { id: 'Deemed', label: `🌟 Deemed (${counts.deemed})` }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => handleFilterChange(t.id)}
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--re-radius-pill)',
                border: `1.5px solid ${filterType === t.id ? 'var(--re-accent-purple)' : 'var(--re-border-subtle)'}`,
                background: filterType === t.id ? 'var(--re-accent-purple)' : '#FFFFFF',
                color: filterType === t.id ? '#FFFFFF' : 'var(--re-text-secondary)',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: filterType === t.id ? '0 4px 14px rgba(124, 109, 175, 0.3)' : 'none'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Sort By Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--re-text-muted)' }}>SORT:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '10px',
              border: '1px solid var(--re-border-medium)',
              background: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 800,
              color: 'var(--re-text-primary)',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          >
            <option value="rank">🏆 State Rank (#1 to #{counts.total})</option>
            <option value="highestPackage">💼 Highest CTC (High → Low)</option>
            <option value="avgPackage">📊 Average Package (High → Low)</option>
            <option value="fees">⚡ Lowest Tuition Fee (Best ROI)</option>
            <option value="placement">📈 Placement Percentage</option>
            <option value="rating">⭐ Student Rating (5.0 → 3.9)</option>
          </select>
        </div>
      </div>

      {/* Scope Status Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '8px 16px',
        marginBottom: '20px',
        borderRadius: '12px',
        background: search ? 'rgba(53, 199, 184, 0.08)' : filterType === 'Top12' ? 'rgba(255, 164, 57, 0.08)' : 'rgba(124, 109, 175, 0.08)',
        border: `1px solid ${search ? 'rgba(53, 199, 184, 0.25)' : filterType === 'Top12' ? 'rgba(255, 164, 57, 0.25)' : 'rgba(124, 109, 175, 0.2)'}`,
        fontSize: '12.5px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {search ? (
            <>
              <Search size={14} color="#35C7B8" />
              <span style={{ color: 'var(--re-text-primary)', fontWeight: 700 }}>
                Found <strong>{filtered.length}</strong> matching institutions for "<strong>{search}</strong>" (searched across all {counts.total} colleges)
              </span>
            </>
          ) : filterType === 'Top12' ? (
            <>
              <Trophy size={14} color="#FFA439" />
              <span style={{ color: 'var(--re-text-primary)', fontWeight: 700 }}>
                Showing <strong>Top 12 State Rankers</strong>. Use the search bar above to search among all <strong>{counts.total}+ colleges</strong> or click 'All ({counts.total})'.
              </span>
            </>
          ) : (
            <>
              <Building2 size={14} color="var(--re-accent-purple)" />
              <span style={{ color: 'var(--re-text-primary)', fontWeight: 700 }}>
                Showing <strong>{filtered.length}</strong> accredited colleges ({filterType} view)
              </span>
            </>
          )}
        </div>

        {filterType === 'Top12' && !search && (
          <button
            onClick={() => handleFilterChange('All')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--re-accent-purple)',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'underline'
            }}
          >
            View All {counts.total} Colleges →
          </button>
        )}
      </div>

      {/* VIEW MODE 1: 3D CARD DECK GRID */}
      {viewMode === 'cards' && (
        <div className="re-3d-card-grid">
          {paginatedColleges.map((c, i) => (
            <div
              key={c._id || i}
              className="re-3d-grid-card"
              onClick={() => {
                playSound('pop');
                if (onSelectCollege) onSelectCollege(c);
              }}
            >
              {/* Card Top Badge Row */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 900, background: c.rankNum <= 3 ? '#FFA439' : 'rgba(124, 109, 175, 0.15)', color: c.rankNum <= 3 ? '#FFFFFF' : 'var(--re-accent-purple)', padding: '3px 10px', borderRadius: '8px' }}>
                      {c.rank || `#${c.rankNum || i + 1}`}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--re-text-muted)' }}>
                      {c.naac || 'NAAC Accredited'}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#35C7B8', background: 'rgba(53, 199, 184, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                    {c.collegeType}
                  </span>
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 4px', lineHeight: 1.3 }}>
                  {c.name}
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--re-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <MapPin size={12} color="var(--re-accent-purple)" />
                  <span>{c.city}</span>
                  <span>•</span>
                  <span>Cutoff: {c.eligibilityPercentage || 50}%</span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--re-text-secondary)', margin: '0 0 16px', lineHeight: 1.45, fontStyle: 'italic' }}>
                  "{c.highlight}"
                </p>
              </div>

              {/* 3D Stat Grid */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
                  <div className="re-3d-stat-box">
                    <span style={{ fontSize: '10px', color: 'var(--re-text-muted)', fontWeight: 700 }}>AVG PACKAGE</span>
                    <span style={{ fontSize: '15px', fontWeight: 900, color: '#FFA439' }}>{c.avgPackage}</span>
                  </div>

                  <div className="re-3d-stat-box">
                    <span style={{ fontSize: '10px', color: 'var(--re-text-muted)', fontWeight: 700 }}>HIGHEST CTC</span>
                    <span style={{ fontSize: '15px', fontWeight: 900, color: '#FF6584' }}>{c.highestPackage}</span>
                  </div>

                  <div className="re-3d-stat-box">
                    <span style={{ fontSize: '10px', color: 'var(--re-text-muted)', fontWeight: 700 }}>FEES / YR</span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--re-text-primary)' }}>{c.avgFee}</span>
                  </div>

                  <div className="re-3d-stat-box">
                    <span style={{ fontSize: '10px', color: 'var(--re-text-muted)', fontWeight: 700 }}>PLACEMENT</span>
                    <span style={{ fontSize: '14px', fontWeight: 900, color: '#35C7B8' }}>{c.placementRate}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed var(--re-border-subtle)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--re-text-muted)' }}>
                    ROI: <strong style={{ color: 'var(--re-accent-purple)' }}>{c.roi || 'High'}</strong>
                  </span>
                  <button
                    className="re-dossier-btn re-dossier-btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('pop');
                      if (onSelectCollege) onSelectCollege(c);
                    }}
                  >
                    <span>Dossier</span>
                    <ArrowUpRight className="re-dossier-arrow" size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 2: 3D ELEVATED MATRIX TABLE */}
      {viewMode === 'table' && (
        <div className="re-3d-table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--re-bg-surface-subtle)', borderBottom: '1.5px solid var(--re-border-medium)' }}>
                <th style={{ padding: '14px 18px', color: 'var(--re-text-muted)', fontWeight: 900, width: '70px' }}>RANK</th>
                <th style={{ padding: '14px 18px', color: 'var(--re-text-primary)', fontWeight: 800 }}>COLLEGE / UNIVERSITY</th>
                <th style={{ padding: '14px 18px', color: 'var(--re-text-primary)', fontWeight: 800 }}>TYPE & ACCREDITATION</th>
                <th style={{ padding: '14px 18px', color: 'var(--re-text-primary)', fontWeight: 800 }}>AVG PACKAGE</th>
                <th style={{ padding: '14px 18px', color: 'var(--re-text-primary)', fontWeight: 800 }}>HIGHEST CTC</th>
                <th style={{ padding: '14px 18px', color: 'var(--re-text-primary)', fontWeight: 800 }}>ANNUAL FEE</th>
                <th style={{ padding: '14px 18px', color: 'var(--re-text-primary)', fontWeight: 800 }}>PLACEMENT</th>
                <th style={{ padding: '14px 18px', color: 'var(--re-text-primary)', fontWeight: 800, textAlign: 'right', whiteSpace: 'nowrap' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paginatedColleges.map((c, i) => (
                <tr
                  key={c._id || i}
                  className="re-3d-table-row"
                  onClick={() => {
                    playSound('tap');
                    if (onSelectCollege) onSelectCollege(c);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ padding: '15px 18px', fontWeight: 900, color: c.rankNum <= 3 ? '#FFA439' : 'var(--re-accent-purple)', fontSize: '15px' }}>
                    {c.rank || `#${c.rankNum || i + 1}`}
                  </td>

                  <td style={{ padding: '15px 18px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--re-text-primary)', marginBottom: '3px' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--re-text-muted)', display: 'flex', gap: '8px' }}>
                      <span>📍 {c.city || 'Gujarat'}</span>
                      <span>•</span>
                      <span>Min Cutoff: {c.eligibilityPercentage || 50}%</span>
                    </div>
                  </td>

                  <td style={{ padding: '15px 18px' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(124, 109, 175, 0.1)', color: 'var(--re-accent-purple)', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', marginBottom: '3px' }}>
                      {c.collegeType}
                    </div>
                    <div style={{ fontSize: '11px', color: '#35C7B8', fontWeight: 700 }}>
                      {c.naac || 'NAAC Accredited'} • {c.nirf}
                    </div>
                  </td>

                  <td style={{ padding: '15px 18px', fontWeight: 900, color: '#FFA439', fontSize: '14px' }}>
                    {c.avgPackage}
                  </td>

                  <td style={{ padding: '15px 18px', fontWeight: 900, color: '#FF6584', fontSize: '14px' }}>
                    {c.highestPackage}
                  </td>

                  <td style={{ padding: '15px 18px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--re-text-primary)' }}>{c.avgFee}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--re-accent-purple)', fontWeight: 700 }}>ROI: {c.roi}</div>
                  </td>

                  <td style={{ padding: '15px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#35C7B8' }}>{c.placementRate}</span>
                    </div>
                  </td>

                  <td style={{ padding: '15px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      className="re-dossier-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound('pop');
                        if (onSelectCollege) onSelectCollege(c);
                      }}
                    >
                      <span>Dossier</span>
                      <ArrowUpRight className="re-dossier-arrow" size={13} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3D PAGINATION CONTROL BAR */}
      {filtered.length > 0 && (
        <div className="re-3d-pagination-bar">
          <div style={{ fontSize: '13px', color: 'var(--re-text-secondary)', fontWeight: 600 }}>
            Showing <strong style={{ color: 'var(--re-text-primary)' }}>{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> of <strong style={{ color: 'var(--re-text-primary)' }}>{filtered.length}</strong> Universities
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className="re-page-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`re-page-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button
              className="re-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next Page"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#FFFFFF', borderRadius: '18px', border: '1px dashed var(--re-border-medium)' }}>
          <Compass size={32} color="var(--re-text-muted)" style={{ marginBottom: '10px' }} />
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 6px' }}>No matching universities found</h4>
          <p style={{ fontSize: '13px', color: 'var(--re-text-secondary)', margin: '0 0 12px' }}>
            Try searching for another name (e.g., "IIT", "Parul", "Surat", "Rajkot", "GEC") or reset filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setFilterType('Top12');
            }}
            className="re-nav-primary-action-btn"
            style={{ padding: '8px 16px', fontSize: '12.5px', margin: '0 auto' }}
          >
            Reset to Top 12 Universities
          </button>
        </div>
      )}
    </section>
  );
};
