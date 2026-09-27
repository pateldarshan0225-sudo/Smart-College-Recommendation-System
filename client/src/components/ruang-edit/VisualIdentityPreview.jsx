import React, { useState } from 'react';
import { Layers, Check, Sliders, Type } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const VisualIdentityPreview = () => {
  const brandSets = [
    { name: 'Kroma Studio', primary: '#1E1738', secondary: '#FFA439', tertiary: '#7C6DAF', font: 'Syne' },
    { name: 'Aura Lab', primary: '#0F2C59', secondary: '#FF6584', tertiary: '#48CAE4', font: 'Plus Jakarta Sans' },
    { name: 'Verve Craft', primary: '#1B4332', secondary: '#52B788', tertiary: '#D8F3DC', font: 'Courier New' }
  ];

  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [copiedColor, setCopiedColor] = useState(null);

  const cur = brandSets[activeSetIndex];

  const handleCopyColor = (hex) => {
    playSound('pop');
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1200);
  };

  const handleNextBrand = () => {
    playSound('click');
    setActiveSetIndex((prev) => (prev + 1) % brandSets.length);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#FAF9FE',
      borderRadius: '10px',
      padding: '8px',
      boxSizing: 'border-box',
      position: 'relative',
      fontFamily: 'inherit'
    }}>
      {/* Top Header / Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px 4px 6px',
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Layers size={11} color="#7C6DAF" />
          <span style={{ fontSize: '9px', fontWeight: 800, color: '#1E1738' }}>{cur.name}</span>
        </div>

        <button
          onClick={handleNextBrand}
          style={{
            background: '#FFFFFF',
            border: '1px solid #DAD3EA',
            color: '#585172',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Sliders size={8} /> NEXT BRAND
        </button>
      </div>

      {/* Brand Identity Artifact Mockup (Stationery Card + Palette) */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        padding: '6px 2px'
      }}>
        {/* Brand Card Mockup */}
        <div style={{
          flex: 1.2,
          background: cur.primary,
          color: '#FFFFFF',
          borderRadius: '8px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '75%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle geometric watermark */}
          <div style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-10px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: cur.secondary,
            opacity: 0.15
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: cur.secondary }} />
            <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.04em' }}>{cur.name.toUpperCase()}</span>
          </div>

          <div>
            <div style={{ fontSize: '7px', opacity: 0.7, marginBottom: '2px' }}>BRAND IDENTITY SYSTEM</div>
            <div style={{ fontSize: '8px', fontWeight: 600, color: cur.secondary }}>v2.4 Guideline Kit</div>
          </div>
        </div>

        {/* Dynamic Color Palette & Swatches */}
        <div style={{
          flex: 0.9,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          justifyContent: 'center'
        }}>
          {[cur.primary, cur.secondary, cur.tertiary].map((hex, i) => (
            <div
              key={i}
              onClick={() => handleCopyColor(hex)}
              title="Click to copy color token"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '5px',
                padding: '3px 5px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
            >
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: hex,
                flexShrink: 0
              }} />
              <span style={{ fontSize: '7.5px', fontWeight: 700, color: '#1E1738', fontFamily: 'monospace' }}>
                {copiedColor === hex ? 'COPIED!' : hex}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2px',
        fontSize: '7.5px',
        color: '#8E87A5',
        fontWeight: 600
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Type size={8} /> FONT: {cur.font}
        </span>
        <span>STYLEGUIDE DECK</span>
      </div>
    </div>
  );
};
