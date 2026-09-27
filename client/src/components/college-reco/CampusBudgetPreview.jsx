import React, { useState } from 'react';
import { DollarSign, Check, Building, Wifi, Dumbbell, BookOpen, MapPin } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const CampusBudgetPreview = () => {
  const [budget, setBudget] = useState(2.2);
  const [selectedCity, setSelectedCity] = useState('ALL'); // 'ALL' | 'AMD' | 'GNR' | 'SURAT'
  const [selectedFacilities, setSelectedFacilities] = useState(['Hostel', 'WiFi', 'Labs', 'Sports']);

  const allFacilities = [
    { id: 'Hostel', label: 'AC Hostels', icon: <Building size={11} /> },
    { id: 'WiFi', label: '1Gbps WiFi', icon: <Wifi size={11} /> },
    { id: 'Labs', label: 'AI Robotics', icon: <BookOpen size={11} /> },
    { id: 'Sports', label: 'Complex & Gym', icon: <Dumbbell size={11} /> }
  ];

  const toggleFacility = (id) => {
    playSound('tap');
    if (selectedFacilities.includes(id)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== id));
    } else {
      setSelectedFacilities([...selectedFacilities, id]);
    }
  };

  const facilityScore = Math.round((selectedFacilities.length / allFacilities.length) * 100);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <DollarSign size={14} color="#059669" />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E1B4B' }}>BUDGET & FACILITIES</span>
        </div>

        {/* Location Dropdown / Pills */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {[
            { id: 'ALL', label: 'Gujarat' },
            { id: 'AMD', label: 'Ahm' },
            { id: 'GNR', label: 'Gnr' },
            { id: 'SURAT', label: 'Surat' }
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                playSound('tap');
                setSelectedCity(c.id);
              }}
              style={{
                padding: '2px 6px',
                borderRadius: '5px',
                border: selectedCity === c.id ? '1px solid #059669' : '1px solid #E5E9F4',
                background: selectedCity === c.id ? '#059669' : '#FFFFFF',
                color: selectedCity === c.id ? '#FFFFFF' : '#7E84A3',
                fontSize: '9px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', margin: '3px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 700, color: '#5A607F' }}>
          <span>Max Annual Tuition Fee</span>
          <strong style={{ color: '#059669' }}>₹{budget} Lakhs / yr</strong>
        </div>
        <input
          type="range"
          min="0.5"
          max="5.0"
          step="0.1"
          value={budget}
          onChange={(e) => {
            playSound('tap');
            setBudget(Number(e.target.value));
          }}
          style={{ width: '100%', height: '4px', accentColor: '#059669', cursor: 'pointer' }}
        />
      </div>

      {/* Facilities Toggle Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', margin: '2px 0' }}>
        {allFacilities.map((fac) => {
          const isSelected = selectedFacilities.includes(fac.id);
          return (
            <div
              key={fac.id}
              onClick={() => toggleFacility(fac.id)}
              style={{
                background: isSelected ? '#FFFFFF' : '#F4F2FA',
                border: `1px solid ${isSelected ? 'rgba(108, 92, 231, 0.35)' : '#E5E9F4'}`,
                borderRadius: '7px',
                padding: '5px 7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 2px 5px rgba(108, 92, 231, 0.08)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: isSelected ? '#6C5CE7' : '#9DA3BC' }}>{fac.icon}</span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: isSelected ? '#1E1B4B' : '#7E84A3' }}>
                  {fac.label}
                </span>
              </div>
              <div
                style={{
                  width: '13px',
                  height: '13px',
                  borderRadius: '4px',
                  background: isSelected ? '#6C5CE7' : 'transparent',
                  border: isSelected ? 'none' : '1.5px solid #D0D5DD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                {isSelected && <Check size={9} strokeWidth={3} />}
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
        <span>FACILITY SCORE: {facilityScore}%</span>
        <span style={{ color: '#059669' }}>MYSY GRANT READY (₹2.0L)</span>
      </div>
    </div>
  );
};
