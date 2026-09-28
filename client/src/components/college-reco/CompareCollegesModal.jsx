import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Check, Award, Scale, Search, Trash2, ArrowUpRight } from 'lucide-react';
import { playSound } from '../../utils/audio';
import { mergeWithApiColleges } from '../../data/collegesData';
import { useAuth } from '../../context/AuthContext';

export const CompareCollegesModal = ({ isOpen, onClose, colleges = [] }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && !user) {
      onClose();
      navigate('/login');
    }
  }, [isOpen, user, navigate, onClose]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const allColleges = useMemo(() => {
    return mergeWithApiColleges(colleges);
  }, [colleges]);

  if (!isOpen || !user) return null;

  const handleClose = () => {
    playSound('pop');
    onClose();
  };

  const handleToggleCollege = (id) => {
    playSound('tap');
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      if (selectedIds.length < 5) {
        setSelectedIds([...selectedIds, id]);
      } else {
        alert('You can compare a maximum of 5 colleges at a time.');
      }
    }
  };

  const handleClearAll = () => {
    playSound('tap');
    setSelectedIds([]);
  };

  const comparedList = allColleges.filter((c) => selectedIds.includes(c._id));

  const filteredOptions = allColleges.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.shortName || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="re-modal-backdrop" onClick={handleClose}>
      <div
        className="re-modal-content"
        style={{
          maxWidth: selectedIds.length > 3 ? '1050px' : '880px',
          maxHeight: '90vh',
          overflowY: 'auto',
          transition: 'max-width 0.2s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="re-modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div className="re-interactive-badge" style={{ marginBottom: '8px' }}>
            <Award size={12} /> MULTI-COLLEGE BENCHMARK
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', color: 'var(--re-text-primary)' }}>
            Side-by-Side College Comparison
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--re-text-secondary)', margin: 0 }}>
            Select up to <strong>5 colleges</strong> to compare cutoffs, tuition fees, placement averages, and campus ROI.
          </p>
        </div>

        {/* College Selector / Search Bar */}
        <div
          style={{
            background: 'var(--re-bg-surface-subtle)',
            border: '1px solid var(--re-border-subtle)',
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--re-text-primary)' }}>
              Select Colleges to Compare ({selectedIds.length}/5 max):
            </span>

            {selectedIds.length > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--re-accent-pink)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '2px 6px'
                }}
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FFFFFF',
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid var(--re-border-subtle)',
              marginBottom: '10px'
            }}
          >
            <Search size={15} color="var(--re-text-muted)" />
            <input
              type="text"
              placeholder="Type to search and add colleges (e.g. DA-IICT, Nirma, LDCE, SVNIT)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '12.5px', fontFamily: 'inherit' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--re-text-muted)', padding: '2px' }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Quick Select Chips (Horizontal scrollable) */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '110px', overflowY: 'auto', padding: '2px' }}>
            {filteredOptions.slice(0, 18).map((c) => {
              const isSelected = selectedIds.includes(c._id);
              const isMaxReached = selectedIds.length >= 5 && !isSelected;

              return (
                <button
                  key={c._id}
                  onClick={() => handleToggleCollege(c._id)}
                  disabled={isMaxReached}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: isSelected ? 800 : 600,
                    border: isSelected
                      ? '1.5px solid var(--re-accent-purple)'
                      : '1px solid var(--re-border-subtle)',
                    background: isSelected
                      ? 'rgba(124, 109, 175, 0.18)'
                      : '#FFFFFF',
                    color: isSelected
                      ? 'var(--re-accent-purple)'
                      : isMaxReached
                      ? 'var(--re-text-muted)'
                      : 'var(--re-text-primary)',
                    cursor: isMaxReached ? 'not-allowed' : 'pointer',
                    opacity: isMaxReached ? 0.45 : 1,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isSelected ? <Check size={12} strokeWidth={3} /> : <Plus size={12} />}
                  <span>{c.shortName || c.name?.split(' ')[0] || 'College'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Comparison View */}
        {comparedList.length > 0 ? (
          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left', minWidth: `${Math.max(600, comparedList.length * 170)}px` }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--re-border-medium)' }}>
                  <th style={{ padding: '10px', color: 'var(--re-text-muted)', fontWeight: 700, width: '160px' }}>CRITERIA</th>
                  {comparedList.map((c) => (
                    <th key={c._id} style={{ padding: '10px', color: 'var(--re-text-primary)', fontWeight: 800, fontSize: '13.5px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                        <span>{c.name}</span>
                        <button
                          onClick={() => handleToggleCollege(c._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--re-text-muted)',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Remove from comparison"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)', background: 'var(--re-bg-surface-subtle)' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Institution Type</td>
                  {comparedList.map((c) => (
                    <td key={c._id} style={{ padding: '10px', fontWeight: 600 }}>{c.type || c.collegeType || 'Autonomous'}</td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Campus Location</td>
                  {comparedList.map((c) => (
                    <td key={c._id} style={{ padding: '10px' }}>📍 {c.city || 'Gujarat'}</td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)', background: 'var(--re-bg-surface-subtle)' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Student Rating</td>
                  {comparedList.map((c) => (
                    <td key={c._id} style={{ padding: '10px', fontWeight: 800, color: '#FFA439' }}>⭐ {c.rating || c.collegeRating || '4.6'} / 5.0</td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Min Eligibility Cutoff</td>
                  {comparedList.map((c) => (
                    <td key={c._id} style={{ padding: '10px', fontWeight: 700, color: 'var(--re-accent-purple)' }}>
                      {c.cutoff || (c.eligibilityPercentage ? `${c.eligibilityPercentage}%` : '60%')}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)', background: 'var(--re-bg-surface-subtle)' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Annual Tuition & Fee</td>
                  {comparedList.map((c) => (
                    <td key={c._id} style={{ padding: '10px', fontWeight: 800 }}>
                      {c.avgFee || (c.annualFee ? `₹${(c.annualFee / 100000).toFixed(1)}L / yr` : '₹2.1L / yr')}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Average Placement CTC</td>
                  {comparedList.map((c) => (
                    <td key={c._id} style={{ padding: '10px', fontWeight: 800, color: '#FFA439' }}>
                      {c.avgPkg || c.avgPackage || '₹8.5 LPA'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid var(--re-border-subtle)', background: 'var(--re-bg-surface-subtle)' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Highest Package Record</td>
                  {comparedList.map((c) => (
                    <td key={c._id} style={{ padding: '10px', fontWeight: 800, color: '#FF6584' }}>
                      {c.highest || c.highestPackage || '₹28.0 LPA'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ padding: '10px', fontWeight: 700, color: 'var(--re-text-secondary)' }}>Placement Rate</td>
                  {comparedList.map((c) => (
                    <td key={c._id} style={{ padding: '10px', fontWeight: 800, color: '#35C7B8' }}>
                      {c.placement || (c.placementRate ? `${c.placementRate}%` : '92%')}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              background: 'var(--re-bg-surface-subtle)',
              borderRadius: '16px',
              border: '1px dashed var(--re-border-medium)',
              marginBottom: '20px'
            }}
          >
            <Scale size={36} color="var(--re-accent-purple)" style={{ opacity: 0.6, marginBottom: '10px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 6px' }}>
              No Colleges Selected Yet
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--re-text-secondary)', margin: '0 auto', maxWidth: '420px' }}>
              Select 1 to 5 colleges from the quick selector chips above to generate your side-by-side benchmark comparison.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="re-btn-primary" onClick={handleClose} style={{ maxWidth: '200px' }}>
            {comparedList.length > 0 ? 'Done Comparing' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
