import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, Users, Sliders } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const AcademicMatcherPreview = () => {
  const [boardScore, setBoardScore] = useState(84);
  const [examType, setExamType] = useState('GUJCET'); // 'GUJCET' | 'JEE'
  const [entranceScore, setEntranceScore] = useState(88);
  const [category, setCategory] = useState('OPEN'); // 'OPEN' | 'EWS' | 'SEBC' | 'TFWS'

  // 50:50 ACPC Merit Calculation
  const meritScore = +(boardScore * 0.5 + entranceScore * 0.5).toFixed(1);

  // Category multiplier / cutoff relaxation
  const categoryOffset = category === 'TFWS' ? -3 : category === 'EWS' ? -2 : category === 'SEBC' ? -4 : 0;

  const colleges = [
    { name: 'DA-IICT Gandhinagar', baseCutoff: 78, type: 'Premier ICT' },
    { name: 'Nirma Tech Ahmedabad', baseCutoff: 72, type: 'Autonomous' },
    { name: 'LDCE Ahmedabad (Govt)', baseCutoff: 66, type: 'Apex Govt' },
    { name: 'PDEU Gandhinagar', baseCutoff: 68, type: 'Tech Univ' }
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#FAF9FE',
        borderRadius: '12px',
        padding: '12px 14px',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Top Header: Category & Live Merit */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '8px',
          borderBottom: '1px solid #EAE6F4'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={14} color="#6C5CE7" />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E1B4B' }}>ACPC MERIT & CUTOFFS</span>
        </div>

        {/* Live Merit Badge */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#6C5CE7',
            background: '#F0EDFE',
            padding: '2px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(108, 92, 231, 0.2)'
          }}
        >
          Merit: {meritScore}
        </span>
      </div>

      {/* Category Quota Selector (Unique Option) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 2px' }}>
        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#5A607F' }}>Category Quota:</span>
        <div style={{ display: 'flex', gap: '3px' }}>
          {['OPEN', 'EWS', 'SEBC', 'TFWS'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playSound('tap');
                setCategory(cat);
              }}
              style={{
                padding: '2px 6px',
                borderRadius: '5px',
                border: category === cat ? '1px solid #6C5CE7' : '1px solid #E5E9F4',
                background: category === cat ? '#6C5CE7' : '#FFFFFF',
                color: category === cat ? '#FFFFFF' : '#7E84A3',
                fontSize: '9.5px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Sliders (Board PCM + Entrance Score) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '2px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 700, color: '#5A607F' }}>
          <span>12th Board Science (PCM)</span>
          <strong style={{ color: '#1E1B4B' }}>{boardScore}%</strong>
        </div>
        <input
          type="range"
          min="50"
          max="98"
          value={boardScore}
          onChange={(e) => {
            playSound('tap');
            setBoardScore(Number(e.target.value));
          }}
          style={{ width: '100%', height: '4px', accentColor: '#6C5CE7', cursor: 'pointer' }}
        />
      </div>

      {/* College Cutoff Matching Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', margin: '2px 0' }}>
        {colleges.map((col) => {
          const effectiveCutoff = Math.max(50, col.baseCutoff + categoryOffset);
          const isEligible = meritScore >= effectiveCutoff;
          return (
            <div
              key={col.name}
              style={{
                background: isEligible ? '#FFFFFF' : '#F4F2FA',
                border: `1px solid ${isEligible ? 'rgba(16, 185, 129, 0.4)' : '#E5E9F4'}`,
                borderRadius: '7px',
                padding: '5px 7px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isEligible ? '0 2px 5px rgba(16, 185, 129, 0.08)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#1E1B4B' }} className="text-truncate">
                  {col.name}
                </span>
                {isEligible ? (
                  <CheckCircle2 size={11} color="#10B981" />
                ) : (
                  <AlertCircle size={11} color="#9DA3BC" />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#7E84A3' }}>
                <span>Cutoff: {effectiveCutoff}%</span>
                <span style={{ color: isEligible ? '#10B981' : '#9DA3BC', fontWeight: 800 }}>
                  {isEligible ? 'Eligible ✓' : 'Gap'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Meta */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '6px',
          borderTop: '1px solid #EAE6F4',
          fontSize: '9.5px',
          color: '#7E84A3',
          fontWeight: 700
        }}
      >
        <span>ACADEMIC WEIGHT: 45%</span>
        <span style={{ color: '#10B981' }}>ACPC 2024 ROUND 1 ACTIVE</span>
      </div>
    </div>
  );
};
