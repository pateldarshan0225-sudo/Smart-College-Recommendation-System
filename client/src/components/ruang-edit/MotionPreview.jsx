import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, RotateCcw, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const MotionPreview = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(35);
  const [characterShape, setCharacterShape] = useState('bunny');
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1.5 * speed));
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handleTogglePlay = () => {
    playSound('click');
    setIsPlaying(!isPlaying);
  };

  const handleSpeedToggle = () => {
    playSound('pop');
    setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1));
  };

  const handleCanvasClick = (e) => {
    playSound('pop');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newId = Date.now();
    setParticles((prev) => [...prev, { id: newId, x, y }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newId));
    }, 600);
  };

  const cycleShape = () => {
    playSound('click');
    const shapes = ['bunny', 'cube', 'star'];
    const idx = shapes.indexOf(characterShape);
    setCharacterShape(shapes[(idx + 1) % shapes.length]);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#1F1836',
      borderRadius: '10px',
      padding: '8px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      color: '#FFFFFF',
      fontFamily: 'inherit'
    }}>
      {/* Top Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px 4px 6px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            style={{
              background: isPlaying ? '#FFA439' : 'rgba(255,255,255,0.15)',
              color: isPlaying ? '#1A1433' : '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {isPlaying ? <Pause size={10} /> : <Play size={10} />}
          </button>

          <button
            onClick={handleSpeedToggle}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#FFA439',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 5px',
              fontSize: '8px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {speed}x
          </button>
        </div>

        {/* Change animated object */}
        <button
          onClick={cycleShape}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#E4DDF7',
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
          <RotateCcw size={8} /> {characterShape.toUpperCase()}
        </button>
      </div>

      {/* Main Interactive Stage / Viewport */}
      <div
        onClick={handleCanvasClick}
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle, rgba(124, 109, 175, 0.25) 0%, rgba(31, 24, 54, 0.9) 80%)',
          borderRadius: '6px',
          margin: '4px 0',
          cursor: 'crosshair',
          overflow: 'hidden'
        }}
      >
        {/* Animated Object */}
        <div style={{
          transform: isPlaying 
            ? `translateY(${Math.sin((progress / 100) * Math.PI * 4) * 14}px) rotate(${Math.cos((progress / 100) * Math.PI * 2) * 15}deg) scale(${1 + Math.sin((progress / 100) * Math.PI * 4) * 0.15})`
            : 'translateY(0) rotate(0deg) scale(1)',
          transition: isPlaying ? 'none' : 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {characterShape === 'bunny' && (
            <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
              {/* Bunny Ears */}
              <ellipse cx="18" cy="12" rx="4" ry="10" fill="#FFA439" transform="rotate(-10 18 12)" />
              <ellipse cx="18" cy="12" rx="2" ry="7" fill="#FFD166" transform="rotate(-10 18 12)" />
              <ellipse cx="30" cy="12" rx="4" ry="10" fill="#FFA439" transform="rotate(10 30 12)" />
              <ellipse cx="30" cy="12" rx="2" ry="7" fill="#FFD166" transform="rotate(10 30 12)" />
              {/* Bunny Face */}
              <circle cx="24" cy="28" r="14" fill="#FFFFFF" />
              <circle cx="19" cy="26" r="2" fill="#1F1836" />
              <circle cx="29" cy="26" r="2" fill="#1F1836" />
              <ellipse cx="24" cy="30" rx="2" ry="1.5" fill="#FF6584" />
              {/* Cheeks */}
              <circle cx="16" cy="30" r="2" fill="#FFB4C2" />
              <circle cx="32" cy="30" r="2" fill="#FFB4C2" />
            </svg>
          )}

          {characterShape === 'cube' && (
            <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
              <polygon points="20,4 36,12 20,20 4,12" fill="#35C7B8" />
              <polygon points="4,12 20,20 20,36 4,28" fill="#1F8B7E" />
              <polygon points="36,12 20,20 20,36 36,28" fill="#4ED4C7" />
            </svg>
          )}

          {characterShape === 'star' && (
            <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
              <path d="M20 2L25 14L38 16L29 25L31 38L20 32L9 38L11 25L2 16L15 14L20 2Z" fill="#FFA439" />
            </svg>
          )}
        </div>

        {/* Dynamic Tap Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x - 10,
              top: p.y - 10,
              pointerEvents: 'none',
              animation: 're-particle-burst 0.5s ease-out forwards',
              color: '#FFA439'
            }}
          >
            <Sparkles size={20} />
          </div>
        ))}

        {/* Instruction hint */}
        <div style={{
          position: 'absolute',
          bottom: '3px',
          right: '4px',
          fontSize: '7px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.04em'
        }}>
          CLICK TO BURST ✨
        </div>
      </div>

      {/* Timeline Scrubber & Keyframe Bar */}
      <div style={{ padding: '0 2px' }}>
        <div style={{
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          position: 'relative',
          cursor: 'pointer'
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const p = ((e.clientX - rect.left) / rect.width) * 100;
          setProgress(Math.max(0, Math.min(100, p)));
        }}
        >
          {/* Progress fill */}
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #7C6DAF, #FFA439)',
            borderRadius: '2px'
          }} />
          {/* Playhead */}
          <div style={{
            position: 'absolute',
            left: `${progress}%`,
            top: '-3px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#FFA439',
            boxShadow: '0 0 6px #FFA439',
            transform: 'translateX(-50%)'
          }} />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '4px',
          fontSize: '7.5px',
          color: 'rgba(255,255,255,0.5)',
          fontFamily: 'monospace'
        }}>
          <span>00:0{Math.floor(progress / 30)}s</span>
          <span>KEYFRAMES: 24 FPS</span>
        </div>
      </div>
    </div>
  );
};
