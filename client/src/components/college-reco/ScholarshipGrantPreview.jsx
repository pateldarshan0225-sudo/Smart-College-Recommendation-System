import React, { useState } from 'react';
import { Award, ShieldCheck, DollarSign, Check } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const ScholarshipGrantPreview = () => {
  const [boardScore, setBoardScore] = useState(82);

  const isMysyEligible = boardScore >= 80;

  const schemes = [
    { name: 'MYSY Govt Grant', grant: isMysyEligible ? '₹2,00,000 / yr' : 'Below 80% Cutoff', active: isMysyEligible },
    { name: 'TFWS 100% Waiver', grant: '100% Free Tuition', active: boardScore >= 75 },
    { name: 'Digital Gujarat SC/ST', grant: 'Full Fee Reimbursement', active: true },
    { name: 'Hon. CM Scholarship', grant: '₹50,000 / yr Aid', active: boardScore >= 80 }
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
      {/* Top Header */}
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
          <Award size={14} color="#059669" />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E1B4B' }}>GOVERNMENT FINANCIAL AID</span>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#059669',
            background: 'rgba(16, 185, 129, 0.12)',
            padding: '2px 8px',
            borderRadius: '6px'
          }}
        >
          {isMysyEligible ? 'MYSY Eligible ✓' : 'Partial Aid'}
        </span>
      </div>

      {/* Board Score Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '4px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#5A607F' }}>
          <span>12th Board Score (MYSY 80% Cutoff)</span>
          <strong style={{ color: '#059669', fontSize: '12px' }}>{boardScore}%</strong>
        </div>
        <input
          type="range"
          min="65"
          max="98"
          value={boardScore}
          onChange={(e) => {
            playSound('tap');
            setBoardScore(Number(e.target.value));
          }}
          style={{
            width: '100%',
            height: '5px',
            accentColor: '#059669',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Schemes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', margin: '2px 0' }}>
        {schemes.map((s, idx) => (
          <div
            key={idx}
            style={{
              background: s.active ? '#FFFFFF' : '#F4F2FA',
              border: `1px solid ${s.active ? 'rgba(16, 185, 129, 0.4)' : '#E5E9F4'}`,
              borderRadius: '8px',
              padding: '6px 8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: s.active ? '0 2px 6px rgba(16, 185, 129, 0.08)' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#1E1B4B' }}>{s.name}</span>
              {s.active && <Check size={11} color="#10B981" strokeWidth={3} />}
            </div>
            <div style={{ fontSize: '10.5px', fontWeight: 900, color: s.active ? '#059669' : '#9DA3BC', marginTop: '2px' }}>
              {s.grant}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Meta */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '6px',
          borderTop: '1px solid #EAE6F4',
          fontSize: '10px',
          color: '#7E84A3',
          fontWeight: 700
        }}
      >
        <span>MYSY SUBSIDY: UP TO ₹2.0L / YR</span>
        <span style={{ color: '#059669' }}>TFWS: 100% WAIVER</span>
      </div>
    </div>
  );
};
