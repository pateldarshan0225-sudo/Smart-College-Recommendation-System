import React from 'react';

// Ruang Edit Official Logo Mark (Geometric Amber / Black Fold)
export const RuangLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L28 6L16 28L4 6Z" fill="#1C1734" />
    <path d="M12 6L28 6L20 20L12 6Z" fill="#FFA439" />
    <path d="M18 6L28 6L24 13L18 6Z" fill="#FFC266" />
    <path d="M4 6L16 28L12 28L2 10L4 6Z" fill="#FF8A00" opacity="0.9" />
  </svg>
);

// 4-Pointed Star / Sparkle
export const SparkleStar = ({ size = 20, color = '#8A78B8', style = {}, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    style={{ color, ...style }}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);

// 3D Squircle 1: Pink - Ideation & Concept
export const SquircleArtPink = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="bulbGlow" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0%" stopColor="#FFF7D6" />
        <stop offset="60%" stopColor="#FFD23F" />
        <stop offset="100%" stopColor="#FF9F1C" />
      </radialGradient>
      <linearGradient id="pencilGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2EC4B6" />
        <stop offset="100%" stopColor="#011627" />
      </linearGradient>
      <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5390D9" />
        <stop offset="100%" stopColor="#3A0CA3" />
      </linearGradient>
      <filter id="shadowPink" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#900C3F" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Blue Toolbox / Base Stand */}
    <g filter="url(#shadowPink)">
      <rect x="36" y="68" width="48" height="28" rx="6" fill="url(#boxGrad)" />
      <rect x="42" y="62" width="36" height="8" rx="3" fill="#4CC9F0" />
      <rect x="52" y="58" width="16" height="6" rx="2" fill="#FFA439" />
      {/* Front latch */}
      <rect x="56" y="74" width="8" height="6" rx="1.5" fill="#FFD166" />
    </g>

    {/* Cyan 3D Gear */}
    <g transform="translate(68, 52) rotate(18)">
      <circle cx="0" cy="0" r="12" fill="#48CAE4" />
      <circle cx="0" cy="0" r="5" fill="#FF6584" />
      <rect x="-14" y="-3" width="28" height="6" rx="2" fill="#48CAE4" />
      <rect x="-3" y="-14" width="6" height="28" rx="2" fill="#48CAE4" />
    </g>

    {/* 3D Glowing Lightbulb */}
    <g filter="url(#shadowPink)">
      {/* Bulb body */}
      <ellipse cx="60" cy="42" rx="16" ry="18" fill="url(#bulbGlow)" />
      {/* Bulb base */}
      <rect x="54" y="57" width="12" height="4" rx="1" fill="#7209B7" />
      <rect x="55" y="61" width="10" height="3" rx="1" fill="#560BAD" />
      {/* Bulb filament shine */}
      <path d="M52 38C54 32 66 32 68 38" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Blue/Teal Pencil */}
    <g transform="translate(32, 45) rotate(-35)" filter="url(#shadowPink)">
      <rect x="0" y="0" width="8" height="28" rx="2" fill="url(#pencilGrad)" />
      <path d="M0 28L4 36L8 28Z" fill="#FFD166" />
      <path d="M3 34L4 36L5 34Z" fill="#1C1734" />
      <rect x="0" y="-4" width="8" height="5" rx="1" fill="#FF7597" />
    </g>

    {/* Floating stars */}
    <circle cx="34" cy="28" r="2.5" fill="#FFF" />
    <circle cx="86" cy="38" r="2" fill="#FFF" />
    <circle cx="78" cy="22" r="3" fill="#FFD166" />
  </svg>
);

// 3D Squircle 2: Lavender - Web & Interface Architecture
export const SquircleArtLavender = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="winGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2DCF7" />
      </linearGradient>
      <linearGradient id="bubbleGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF7597" />
        <stop offset="100%" stopColor="#D90429" />
      </linearGradient>
      <filter id="shadowLav" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#3F2B66" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* 3D Browser Window */}
    <g filter="url(#shadowLav)">
      <rect x="25" y="32" width="56" height="52" rx="8" fill="url(#winGrad)" />
      {/* Title Bar */}
      <rect x="25" y="32" width="56" height="14" rx="8" fill="#D3C9F2" />
      {/* Window Dots */}
      <circle cx="33" cy="39" r="2" fill="#FF5F56" />
      <circle cx="39" cy="39" r="2" fill="#FFBD2E" />
      <circle cx="45" cy="39" r="2" fill="#27C93F" />
      
      {/* Content Layout wireframes */}
      <rect x="31" y="52" width="22" height="16" rx="3" fill="#7C6DAF" opacity="0.8" />
      <rect x="31" y="72" width="44" height="4" rx="2" fill="#A89CD2" />
      <rect x="57" y="52" width="18" height="5" rx="2" fill="#A89CD2" />
      <rect x="57" y="60" width="14" height="4" rx="2" fill="#C5BBE3" />
    </g>

    {/* Magenta Chat/Comment Bubble Overlay */}
    <g filter="url(#shadowLav)">
      <rect x="62" y="44" width="34" height="30" rx="8" fill="url(#bubbleGrad)" />
      <path d="M68 74L64 80L74 74Z" fill="#D90429" />
      <rect x="68" y="51" width="22" height="3.5" rx="1.7" fill="#FFFFFF" opacity="0.9" />
      <rect x="68" y="58" width="16" height="3.5" rx="1.7" fill="#FFFFFF" opacity="0.9" />
      <rect x="68" y="65" width="12" height="3.5" rx="1.7" fill="#FFFFFF" opacity="0.7" />
    </g>

    {/* Floating Pencil */}
    <g transform="translate(80, 26) rotate(32)" filter="url(#shadowLav)">
      <rect x="0" y="0" width="7" height="24" rx="2" fill="#FFD166" />
      <path d="M0 24L3.5 30L7 24Z" fill="#FFA439" />
      <path d="M2.5 28L3.5 30L4.5 28Z" fill="#1C1734" />
      <rect x="0" y="-3" width="7" height="4" rx="1" fill="#4CC9F0" />
    </g>

    <circle cx="22" cy="46" r="3" fill="#FFA439" />
    <circle cx="95" cy="85" r="2" fill="#FFFFFF" />
  </svg>
);

// 3D Squircle 3: Cyan - Graphic Design & Visual Identity
export const SquircleArtCyan = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#BFF3EE" />
      </linearGradient>
      <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFD166" />
        <stop offset="100%" stopColor="#FF6584" />
      </linearGradient>
      <filter id="shadowCyan" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#006466" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* 3D Golden Framed Image */}
    <g filter="url(#shadowCyan)">
      {/* Outer picture frame */}
      <rect x="30" y="32" width="50" height="44" rx="6" fill="#FFA439" />
      <rect x="34" y="36" width="42" height="36" rx="4" fill="url(#frameGrad)" />
      
      {/* Mountain & Sun graphic inside frame */}
      <circle cx="46" cy="46" r="5" fill="#FF6584" />
      <path d="M35 68L48 54L58 64L66 57L75 68Z" fill="#35C7B8" />
      <path d="M48 54L58 64L66 57L75 68H45L35 68Z" fill="#1C8B7E" opacity="0.6" />
    </g>

    {/* 3D Geometric Torus / Color Ring */}
    <g filter="url(#shadowCyan)" transform="translate(68, 68)">
      <circle cx="8" cy="8" r="14" fill="url(#ringGrad)" />
      <circle cx="8" cy="8" r="6" fill="#35C7B8" />
    </g>

    {/* 3D Drafting Ruler */}
    <g transform="translate(24, 76) rotate(-22)" filter="url(#shadowCyan)">
      <rect x="0" y="0" width="46" height="12" rx="3" fill="#FFD166" />
      <line x1="8" y1="0" x2="8" y2="5" stroke="#1C1734" strokeWidth="1.5" />
      <line x1="16" y1="0" x2="16" y2="8" stroke="#1C1734" strokeWidth="1.5" />
      <line x1="24" y1="0" x2="24" y2="5" stroke="#1C1734" strokeWidth="1.5" />
      <line x1="32" y1="0" x2="32" y2="8" stroke="#1C1734" strokeWidth="1.5" />
      <line x1="40" y1="0" x2="40" y2="5" stroke="#1C1734" strokeWidth="1.5" />
    </g>

    <circle cx="28" cy="26" r="2.5" fill="#FFFFFF" />
    <circle cx="92" cy="38" r="3" fill="#FFD166" />
  </svg>
);

// 3D Squircle 4: Orange - Digital Illustration & 3D Art
export const SquircleArtOrange = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="tabletGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2E3856" />
        <stop offset="100%" stopColor="#1A1F36" />
      </linearGradient>
      <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4361EE" />
        <stop offset="100%" stopColor="#3F37C9" />
      </linearGradient>
      <linearGradient id="handGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF7597" />
        <stop offset="100%" stopColor="#C9184A" />
      </linearGradient>
      <filter id="shadowOrg" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#7A3700" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* 3D Drawing Tablet */}
    <g transform="translate(18, 28) rotate(8)" filter="url(#shadowOrg)">
      <rect x="0" y="0" width="68" height="52" rx="7" fill="url(#tabletGrad)" />
      {/* Tablet Screen */}
      <rect x="6" y="6" width="46" height="40" rx="4" fill="url(#screenGrad)" />
      
      {/* Hotkey buttons on right */}
      <circle cx="58" cy="14" r="3" fill="#4CC9F0" />
      <circle cx="58" cy="24" r="3" fill="#FFD166" />
      <circle cx="58" cy="34" r="3" fill="#FF7597" />
      
      {/* Screen Art / Wave stroke */}
      <path d="M12 32C18 18 28 36 38 20" stroke="#FFD166" strokeWidth="3" strokeLinecap="round" />
      <circle cx="38" cy="20" r="3" fill="#FFFFFF" />
    </g>

    {/* 3D Stylus Pen & Artist Hand Pointer */}
    <g transform="translate(56, 42)" filter="url(#shadowOrg)">
      {/* Stylus */}
      <rect x="10" y="0" width="6" height="34" rx="2" fill="#E2DCF7" transform="rotate(-35)" />
      <polygon points="26,10 32,15 28,18" fill="#FFA439" />
      
      {/* Stylus glowing tip glow */}
      <circle cx="28" cy="14" r="4" fill="#FFD166" opacity="0.8" />
      
      {/* Hand cursor / 3D sleeve */}
      <path d="M22 28C28 22 42 32 46 45L34 52C28 42 18 36 22 28Z" fill="url(#handGrad)" />
      <rect x="36" y="44" width="18" height="14" rx="4" fill="#4361EE" transform="rotate(20)" />
    </g>

    <circle cx="25" cy="20" r="3" fill="#FFFFFF" />
    <circle cx="94" cy="25" r="2" fill="#FFD166" />
  </svg>
);
