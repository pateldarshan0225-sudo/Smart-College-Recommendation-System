import React, { useState } from 'react';
import { Zap, Sparkles, TrendingUp, CheckCircle2, Code2, Cpu } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const CareerStreamPreview = () => {
  const [selectedTrack, setSelectedTrack] = useState('AI'); // 'AI' | 'VLSI' | 'CYBER'

  const trackData = {
    AI: {
      name: 'AI & Machine Learning',
      growth: '+38% YoY',
      avgCTC: '₹18.5 LPA',
      peakCTC: '₹54.2 LPA',
      skills: ['PyTorch', 'LLMs', 'CUDA', 'MLOps'],
      roles: 'Applied AI Scientist / Research Lead'
    },
    VLSI: {
      name: 'Semiconductor & VLSI',
      growth: '+46% YoY',
      avgCTC: '₹16.8 LPA',
      peakCTC: '₹48.0 LPA',
      skills: ['Verilog', 'ASIC', 'FPGA', 'Cadence'],
      roles: 'Silicon Verification / Chip Architect'
    },
    CYBER: {
      name: 'Cloud & Cybersecurity',
      growth: '+32% YoY',
      avgCTC: '₹15.2 LPA',
      peakCTC: '₹42.0 LPA',
      skills: ['AWS', 'Kubernetes', 'Zero Trust', 'Rust'],
      roles: 'Cloud Security / DevOps Engineer'
    }
  };

  const cur = trackData[selectedTrack];

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
      {/* Top Header: Track Switcher */}
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
          <Zap size={14} color="#FFA439" />
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#FFA439' }}>TECH PATHWAYS</span>
        </div>

        {/* Track Pills */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {[
            { id: 'AI', label: 'AI/ML' },
            { id: 'VLSI', label: 'VLSI' },
            { id: 'CYBER', label: 'Cloud' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                playSound('tap');
                setSelectedTrack(t.id);
              }}
              style={{
                padding: '2px 6px',
                borderRadius: '5px',
                border: 'none',
                background: selectedTrack === t.id ? '#6C5CE7' : 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                fontSize: '9px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Card */}
      <div
        style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '8px 10px',
          border: '1px solid rgba(255,255,255,0.14)',
          margin: '2px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#FFFFFF' }}>{cur.name}</span>
          <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.2)', padding: '1px 6px', borderRadius: '4px' }}>
            {cur.growth}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '10px' }}>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '4px 6px', borderRadius: '5px' }}>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '8.5px', display: 'block' }}>Median Package</span>
            <strong style={{ color: '#FFA439', fontWeight: 900, fontSize: '11.5px' }}>{cur.avgCTC}</strong>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '4px 6px', borderRadius: '5px' }}>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '8.5px', display: 'block' }}>Peak Offer</span>
            <strong style={{ color: '#10B981', fontWeight: 900, fontSize: '11.5px' }}>{cur.peakCTC}</strong>
          </div>
        </div>
      </div>

      {/* In-Demand Skills Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>SKILLS:</span>
        {cur.skills.map((s) => (
          <span
            key={s}
            style={{
              fontSize: '8.5px',
              fontWeight: 800,
              background: 'rgba(255,255,255,0.12)',
              padding: '1px 5px',
              borderRadius: '3px',
              color: '#FFFFFF'
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Footer Meta */}
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
        <span>INDUSTRY VECTOR: 20%</span>
        <span style={{ color: '#10B981' }}>{cur.roles.split('/')[0]}</span>
      </div>
    </div>
  );
};
