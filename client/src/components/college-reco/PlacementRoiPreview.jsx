import React, { useState } from 'react';
import { TrendingUp, Briefcase, DollarSign, Sparkles, Building2 } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const PlacementRoiPreview = () => {
  const [tierFilter, setTierFilter] = useState('ALL'); // 'ALL' | 'DREAM' | 'SUPER'
  const [activeCollegeIdx, setActiveCollegeIdx] = useState(0);

  const placementColleges = [
    {
      name: 'DA-IICT Gandhinagar',
      tier: 'DREAM',
      avgCTC: '₹17.5 LPA',
      highestCTC: '₹54.2 LPA',
      placedRate: '97.2%',
      roi: '3.8x ROI',
      recruiters: ['Google', 'Microsoft', 'Amazon', 'Morgan Stanley']
    },
    {
      name: 'Nirma University - IT',
      tier: 'SUPER',
      avgCTC: '₹12.2 LPA',
      highestCTC: '₹48.0 LPA',
      placedRate: '94.8%',
      roi: '3.2x ROI',
      recruiters: ['Oracle', 'Adobe', 'Samsung', 'Infosys']
    },
    {
      name: 'LDCE Ahmedabad (Govt)',
      tier: 'SUPER',
      avgCTC: '₹7.8 LPA',
      highestCTC: '₹28.0 LPA',
      placedRate: '89.5%',
      roi: '8.5x (Max ROI)',
      recruiters: ['L&T', 'Reliance', 'Adani', 'TCS']
    }
  ];

  const filtered = tierFilter === 'ALL'
    ? placementColleges
    : placementColleges.filter((c) => c.tier === tierFilter);

  const cur = filtered[activeCollegeIdx % filtered.length] || placementColleges[0];

  const handleNextCollege = () => {
    playSound('pop');
    setActiveCollegeIdx((prev) => (prev + 1) % filtered.length);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#18132D',
        borderRadius: '12px',
        padding: '12px 14px',
        boxSizing: 'border-box',
        position: 'relative',
        color: '#FFFFFF'
      }}
    >
      {/* Top Controls Bar: Package Tier Filter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <TrendingUp size={14} color="#FFA439" />
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#FFA439' }}>CTC & ROI TELEMETRY</span>
        </div>

        {/* Tier Selector Pills */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'DREAM', label: '₹15L+' },
            { id: 'SUPER', label: '₹8-15L' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                playSound('tap');
                setTierFilter(t.id);
                setActiveCollegeIdx(0);
              }}
              style={{
                padding: '2px 6px',
                borderRadius: '5px',
                border: 'none',
                background: tierFilter === t.id ? '#FFA439' : 'rgba(255,255,255,0.12)',
                color: tierFilter === t.id ? '#18132D' : '#FFFFFF',
                fontSize: '9px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active College Header & Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 2px' }}>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#FFFFFF' }} className="text-truncate">
          {cur.name}
        </span>
        <button
          type="button"
          onClick={handleNextCollege}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#FFA439',
            padding: '2px 7px',
            borderRadius: '5px',
            fontSize: '9px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          SWITCH ↻
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', margin: '2px 0' }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '7px', padding: '5px', textAlign: 'center' }}>
          <div style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>AVG PACKAGE</div>
          <div style={{ fontSize: '12px', fontWeight: 900, color: '#FFA439', marginTop: '1px' }}>{cur.avgCTC}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '7px', padding: '5px', textAlign: 'center' }}>
          <div style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>HIGHEST</div>
          <div style={{ fontSize: '12px', fontWeight: 900, color: '#10B981', marginTop: '1px' }}>{cur.highestCTC}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '7px', padding: '5px', textAlign: 'center' }}>
          <div style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>PLACED %</div>
          <div style={{ fontSize: '12px', fontWeight: 900, color: '#FF7597', marginTop: '1px' }}>{cur.placedRate}</div>
        </div>
      </div>

      {/* Recruiter Tags */}
      <div
        style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '7px',
          padding: '5px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>HIRING:</span>
        {cur.recruiters.map((r) => (
          <span
            key={r}
            style={{
              fontSize: '9px',
              fontWeight: 800,
              background: 'rgba(255,255,255,0.12)',
              padding: '1px 5px',
              borderRadius: '4px',
              color: '#FFFFFF'
            }}
          >
            {r}
          </span>
        ))}
      </div>

      {/* Footer ROI Note */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '6px',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          fontSize: '9.5px',
          color: 'rgba(255,255,255,0.75)'
        }}
      >
        <span>PLACEMENT WEIGHT: 30%</span>
        <strong style={{ color: '#FFA439' }}>{cur.roi}</strong>
      </div>
    </div>
  );
};
