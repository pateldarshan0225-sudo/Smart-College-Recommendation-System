import React, { useState } from 'react';
import { Scale, Sparkles, Building2, Check, ArrowRight } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const CompareMatrixPreview = () => {
  const comparison = [
    { metric: 'Median CTC', c1: '₹17.5 LPA', c2: '₹12.2 LPA', c1Win: true },
    { metric: 'Annual Fee', c1: '₹2.20 Lakhs', c2: '₹1.95 Lakhs', c1Win: false },
    { metric: 'Placement %', c1: '97.2%', c2: '94.8%', c1Win: true },
    { metric: 'Cutoff %', c1: '78.5%', c2: '72.0%', c1Win: null }
  ];

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
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Scale size={14} color="#FFA439" />
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#FFA439' }}>COMPARATIVE RADAR</span>
        </div>
        <span style={{ fontSize: '9.5px', color: '#10B981', fontWeight: 800, background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '4px' }}>
          DA-IICT vs NIRMA
        </span>
      </div>

      {/* Comparison Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', margin: '4px 0' }}>
        {comparison.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.06)',
              padding: '5px 8px',
              borderRadius: '6px',
              fontSize: '11px'
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{row.metric}</span>
            <span style={{ color: row.c1Win ? '#10B981' : '#FFFFFF', fontWeight: 900 }}>
              {row.c1} {row.c1Win && '✓'}
            </span>
            <span style={{ color: row.c1Win === false ? '#10B981' : 'rgba(255,255,255,0.85)', fontWeight: 800 }}>
              {row.c2} {row.c1Win === false && '✓'}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Meta */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '6px',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.75)'
        }}
      >
        <span>MULTI-CRITERIA RADAR</span>
        <strong style={{ color: '#FFA439' }}>TOP FIT: DA-IICT (96%)</strong>
      </div>
    </div>
  );
};
