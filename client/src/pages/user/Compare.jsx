import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Scale, Plus, X, Award, Check, MapPin, Building2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { playSound } from '../../utils/audio';

export default function Compare() {
  const { isDark } = useTheme();
  const [cols, setCols] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Compare Colleges - Student Portal';
    api.get('/colleges').then((r) => {
      const list = r.data?.data || [];
      setCols(list);
      if (list.length >= 2) {
        setSelected([list[0]._id, list[1]._id]);
      } else if (list.length === 1) {
        setSelected([list[0]._id]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggle = (id) => {
    playSound('tap');
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s));
  };

  const items = cols.filter((c) => selected.includes(c._id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div
        style={{
          background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
          borderRadius: '24px',
          padding: '24px 28px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(78, 63, 166, 0.05)'
        }}
      >
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: '0 0 4px 0' }}>
            College Comparison Matrix
          </h1>
          <p style={{ fontSize: '13px', color: isDark ? '#9DA3BC' : '#7E84A3', margin: 0 }}>
            Select up to 3 colleges to compare admission eligibility, ratings, locations, and university affiliations.
          </p>
        </div>

        <Link
          to="/compare"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
            borderRadius: '999px',
            background: 'rgba(104, 87, 233, 0.12)',
            color: '#6857E9',
            fontSize: '13px',
            fontWeight: '800',
            textDecoration: 'none'
          }}
        >
          <Scale size={15} />
          <span>Launch Full 4-Way Compare</span>
        </Link>
      </div>

      {/* College Multi-Selector Chips */}
      <div
        style={{
          background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
          borderRadius: '20px',
          padding: '18px 22px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2'
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '12px' }}>
          Select Colleges to Compare ({selected.length}/3 selected):
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {cols.map((c) => {
            const isSelected = selected.includes(c._id);
            return (
              <button
                key={c._id}
                onClick={() => toggle(c._id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: isSelected ? '1.5px solid #6857E9' : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E9F2',
                  background: isSelected ? (isDark ? 'rgba(104,87,233,0.25)' : '#F0EDFE') : (isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFD'),
                  color: isSelected ? '#6857E9' : (isDark ? '#C4C9DF' : '#5A607F'),
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSelected ? <Check size={13} /> : <Plus size={13} />}
                <span>{c.name?.split(' ')[0] || 'College'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {items.length > 0 ? (
        <div
          style={{
            background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
            borderRadius: '24px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(78, 63, 166, 0.06)'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFD', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E5E9F2' }}>
                  <th style={{ padding: '16px 20px', width: '200px', fontSize: '12px', fontWeight: '800', color: isDark ? '#9DA3BC' : '#7E84A3', textTransform: 'uppercase' }}>
                    ATTRIBUTE
                  </th>
                  {items.map((c) => (
                    <th key={c._id} style={{ padding: '16px 20px', minWidth: '220px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B' }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: '11px', color: isDark ? '#9DA3BC' : '#7E84A3', marginTop: '2px' }}>
                        {c.city}, {c.state}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody style={{ fontSize: '13px' }}>
                {[
                  ['Affiliated University', (c) => c.university || 'GTU / Autonomous'],
                  ['Location', (c) => `${c.city}, ${c.state}`],
                  ['College Type', (c) => c.collegeType || 'Autonomous / Accredited'],
                  ['Eligibility % Threshold', (c) => `${c.eligibilityPercentage || 50}%`],
                  ['Student Rating', (c) => `★ ${c.collegeRating || '4.5'} / 5.0`]
                ].map(([label, fn], idx) => (
                  <tr key={idx} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F0F2F8' }}>
                    <td style={{ padding: '14px 20px', fontWeight: '800', color: isDark ? '#9DA3BC' : '#7E84A3' }}>
                      {label}
                    </td>
                    {items.map((c) => (
                      <td key={c._id} style={{ padding: '14px 20px', fontWeight: '700', color: isDark ? '#FFFFFF' : '#1E1B4B' }}>
                        {fn(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ padding: '36px', textAlign: 'center', background: isDark ? 'rgba(24,18,48,0.85)' : '#FFFFFF', borderRadius: '20px' }}>
          Select at least 1 college above to view comparative analysis.
        </div>
      )}
    </div>
  );
}
