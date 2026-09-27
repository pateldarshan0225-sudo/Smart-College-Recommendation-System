import React, { useState } from 'react';
import { X, ArrowRight, Check, Award, DollarSign, TrendingUp, Building } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const CompareCollegesModal = ({ isOpen, onClose, colleges = [] }) => {
  const defaultColleges = [
    { name: 'DA-IICT', type: 'Private', city: 'Gandhinagar', rating: 4.8, cutoff: '75%', avgFee: '₹2.5L / yr', avgPkg: '₹16.2 LPA', highest: '₹52 LPA', placement: '97.2%' },
    { name: 'Nirma Tech', type: 'Autonomous', city: 'Ahmedabad', rating: 4.6, cutoff: '70%', avgFee: '₹2.15L / yr', avgPkg: '₹12.4 LPA', highest: '₹46 LPA', placement: '94.8%' },
    { name: 'LDCE Govt', type: 'Government', city: 'Ahmedabad', rating: 4.5, cutoff: '65%', avgFee: '₹6,500 / yr', avgPkg: '₹7.8 LPA', highest: '₹24 LPA', placement: '89.5%' }
  ];

  const compareList = colleges.length >= 2 ? colleges.slice(0, 3) : defaultColleges;

  if (!isOpen) return null;

  const handleClose = () => {
    playSound('pop');
    onClose();
  };

  return (
    <div className="re-modal-backdrop" onClick={handleClose}>
      <div className="re-modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        <button className="re-modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="re-interactive-badge" style={{ marginBottom: '8px' }}>
            <Award size={12} /> MULTI-COLLEGE BENCHMARK
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', color: 'var(--re-text-primary)' }}>
            Side-by-Side College Comparison
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--re-text-secondary)', margin: 0 }}>
            Compare academic cutoffs, tuition fees, placement packages, and campus ROI.
          </p>
        </div>

        {/* Comparison Table Grid */}
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--re-border-medium)' }}>
                <th style={{ padding: '10px', color: 'var(--re-text-muted)', fontWeight: 700 }}>CRITERIA</th>
                {compareList.map((c, i) => (
                  <th key={i} style={{ padding: '10px', color: 'var(--re-text-primary)', fontWeight: 800, fontSize: '14px' }}>
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--re-border-subtle)', background: 'var(--re-bg-surface-subtle)' }}>
                <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Institution Type</td>
                {compareList.map((c, i) => (
                  <td key={i} style={{ padding: '10px', fontWeight: 600 }}>{c.type || c.collegeType || 'Autonomous'}</td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Campus Location</td>
                {compareList.map((c, i) => (
                  <td key={i} style={{ padding: '10px' }}>📍 {c.city || 'Gujarat'}</td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--re-border-subtle)', background: 'var(--re-bg-surface-subtle)' }}>
                <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Student Rating</td>
                {compareList.map((c, i) => (
                  <td key={i} style={{ padding: '10px', fontWeight: 800, color: '#FFA439' }}>⭐ {c.rating || c.collegeRating || '4.6'} / 5.0</td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Min Eligibility Cutoff</td>
                {compareList.map((c, i) => (
                  <td key={i} style={{ padding: '10px', fontWeight: 700, color: 'var(--re-accent-purple)' }}>{c.cutoff || (c.eligibilityPercentage ? `${c.eligibilityPercentage}%` : '70%')}</td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--re-border-subtle)', background: 'var(--re-bg-surface-subtle)' }}>
                <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Annual Tuition & Fee</td>
                {compareList.map((c, i) => (
                  <td key={i} style={{ padding: '10px', fontWeight: 800 }}>{c.avgFee || (c.annualFee ? `₹${(c.annualFee / 100000).toFixed(1)}L / yr` : '₹2.1L / yr')}</td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Average Placement CTC</td>
                {compareList.map((c, i) => (
                  <td key={i} style={{ padding: '10px', fontWeight: 800, color: '#FFA439' }}>{c.avgPkg || c.avgPackage || '₹12 LPA'}</td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--re-border-subtle)', background: 'var(--re-bg-surface-subtle)' }}>
                <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Highest Package Record</td>
                {compareList.map((c, i) => (
                  <td key={i} style={{ padding: '10px', fontWeight: 800, color: '#FF6584' }}>{c.highest || c.highestPackage || '₹48 LPA'}</td>
                ))}
              </tr>

              <tr>
                <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Placement Rate</td>
                {compareList.map((c, i) => (
                  <td key={i} style={{ padding: '10px', fontWeight: 800, color: '#35C7B8' }}>{c.placement || (c.placementRate ? `${c.placementRate}%` : '95%')}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <button className="re-btn-primary" onClick={handleClose}>
          Done Comparing Colleges
        </button>
      </div>
    </div>
  );
};
