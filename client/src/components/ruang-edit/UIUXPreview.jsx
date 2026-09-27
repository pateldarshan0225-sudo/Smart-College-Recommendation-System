import React, { useState } from 'react';
import { Sparkles, Layout, Smartphone, Monitor, Palette } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const UIUXPreview = () => {
  const [activeTheme, setActiveTheme] = useState('purple');
  const [device, setDevice] = useState('desktop');
  const [btnState, setBtnState] = useState('Explore');

  const themes = {
    purple: { primary: '#7C6DAF', accent: '#FFA439', bg: '#F8F6FD', card: '#FFFFFF', text: '#1E1738' },
    sunset: { primary: '#FF6584', accent: '#FFD166', bg: '#FFF5F7', card: '#FFFFFF', text: '#2E112D' },
    cyber: { primary: '#35C7B8', accent: '#FF6584', bg: '#F0FAF9', card: '#FFFFFF', text: '#0A2524' },
    dark: { primary: '#A390E4', accent: '#FFA439', bg: '#1E1836', card: '#2A224A', text: '#FFFFFF' }
  };

  const cur = themes[activeTheme];

  const handleThemeChange = (t) => {
    playSound('pop');
    setActiveTheme(t);
  };

  const handleDeviceChange = (d) => {
    playSound('click');
    setDevice(d);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: cur.bg,
      borderRadius: '10px',
      padding: '8px',
      boxSizing: 'border-box',
      position: 'relative',
      fontFamily: 'inherit',
      transition: 'background 0.3s ease'
    }}>
      {/* Top Workspace Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px 4px 6px',
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}>
        {/* Color Switchers */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <Palette size={11} style={{ color: cur.text, opacity: 0.6 }} />
          {Object.keys(themes).map((t) => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              title={`Switch to ${t} theme`}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: themes[t].primary,
                border: activeTheme === t ? '1.5px solid #1E1738' : '1px solid rgba(0,0,0,0.15)',
                cursor: 'pointer',
                padding: 0,
                transform: activeTheme === t ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.15s ease'
              }}
            />
          ))}
        </div>

        {/* Device Mode Switcher */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.04)', padding: '2px 4px', borderRadius: '4px' }}>
          <button
            onClick={() => handleDeviceChange('desktop')}
            style={{
              background: device === 'desktop' ? '#FFFFFF' : 'transparent',
              border: 'none',
              padding: '2px 4px',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              color: cur.text,
              boxShadow: device === 'desktop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Monitor size={10} />
          </button>
          <button
            onClick={() => handleDeviceChange('mobile')}
            style={{
              background: device === 'mobile' ? '#FFFFFF' : 'transparent',
              border: 'none',
              padding: '2px 4px',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              color: cur.text,
              boxShadow: device === 'mobile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Smartphone size={10} />
          </button>
        </div>
      </div>

      {/* Interactive Figma-style Canvas Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px',
        position: 'relative'
      }}>
        <div style={{
          width: device === 'mobile' ? '55%' : '90%',
          background: cur.card,
          borderRadius: '8px',
          padding: '8px 10px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {/* Mini App Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '24px', height: '5px', background: cur.primary, borderRadius: '3px' }} />
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: cur.accent }} />
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: cur.primary, opacity: 0.5 }} />
            </div>
          </div>

          {/* Mini App Content */}
          <div style={{
            fontSize: device === 'mobile' ? '9px' : '10px',
            fontWeight: 800,
            color: cur.text,
            lineHeight: 1.1
          }}>
            Craft Bold Interfaces
          </div>

          <div style={{
            fontSize: '8px',
            color: cur.text,
            opacity: 0.7,
            lineHeight: 1.2
          }}>
            Responsive, tactile & accessible design.
          </div>

          {/* Interactive Button */}
          <button
            onClick={() => {
              playSound('click');
              setBtnState(prev => prev === 'Explore' ? 'Selected ✓' : 'Explore');
            }}
            style={{
              marginTop: '4px',
              background: cur.primary,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '999px',
              padding: '4px 8px',
              fontSize: '8.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              boxShadow: `0 2px 8px ${cur.primary}40`,
              transition: 'transform 0.15s ease'
            }}
          >
            <Sparkles size={8} /> {btnState}
          </button>
        </div>
      </div>

      {/* Footer Tag */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2px',
        fontSize: '7.5px',
        color: cur.text,
        opacity: 0.6,
        fontWeight: 600
      }}>
        <span>FIGMA & TOKENS</span>
        <span>LIVE SANDBOX</span>
      </div>
    </div>
  );
};
