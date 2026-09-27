import React from 'react';

// Brand Logo: Smart College / EduMatch Origami Fold
export const CollegeLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cap & Geometric Diamond Shield */}
    <path d="M16 3L30 10L16 17L2 10L16 3Z" fill="#FFA439" />
    <path d="M7 13.5V21C7 24.5 11 28 16 28C21 28 25 24.5 25 21V13.5L16 18L7 13.5Z" fill="#1E1738" />
    <path d="M16 18L25 13.5L20 11L16 13L12 11L7 13.5L16 18Z" fill="#7C6DAF" opacity="0.9" />
    <path d="M28 12V20" stroke="#FFA439" strokeWidth="2" strokeLinecap="round" />
    <circle cx="28" cy="21" r="1.5" fill="#FFA439" />
  </svg>
);

// 4-Pointed Sparkle Star
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

// Squircle 1: Pink - Engineering & Technology (B.Tech, CSE, AI, Robotics)
export const SquircleArtEngineering = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="chipGlow" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0%" stopColor="#FFF7D6" />
        <stop offset="60%" stopColor="#FFD23F" />
        <stop offset="100%" stopColor="#FF9F1C" />
      </radialGradient>
      <linearGradient id="engGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2EC4B6" />
        <stop offset="100%" stopColor="#011627" />
      </linearGradient>
      <linearGradient id="baseBox" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5390D9" />
        <stop offset="100%" stopColor="#3A0CA3" />
      </linearGradient>
      <filter id="engShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#900C3F" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Microcontroller Base & Circuits */}
    <g filter="url(#engShadow)">
      <rect x="34" y="66" width="52" height="30" rx="6" fill="url(#baseBox)" />
      <rect x="42" y="60" width="36" height="8" rx="3" fill="#4CC9F0" />
      <rect x="52" y="56" width="16" height="6" rx="2" fill="#FFA439" />
      {/* Golden IC pins */}
      <rect x="40" y="74" width="8" height="6" rx="1.5" fill="#FFD166" />
      <rect x="52" y="74" width="8" height="6" rx="1.5" fill="#FFD166" />
      <rect x="64" y="74" width="8" height="6" rx="1.5" fill="#FFD166" />
      <rect x="76" y="74" width="8" height="6" rx="1.5" fill="#FFD166" />
    </g>

    {/* 3D Cyan Gear Wheel */}
    <g transform="translate(70, 48) rotate(18)">
      <circle cx="0" cy="0" r="13" fill="#48CAE4" />
      <circle cx="0" cy="0" r="5" fill="#FF6584" />
      <rect x="-15" y="-3.5" width="30" height="7" rx="2" fill="#48CAE4" />
      <rect x="-3.5" y="-15" width="7" height="30" rx="2" fill="#48CAE4" />
    </g>

    {/* 3D Glowing Idea/Innovation Bulb */}
    <g filter="url(#engShadow)">
      <ellipse cx="58" cy="38" rx="16" ry="17" fill="url(#chipGlow)" />
      <rect x="52" y="52" width="12" height="4" rx="1" fill="#7209B7" />
      <rect x="53" y="56" width="10" height="3" rx="1" fill="#560BAD" />
      <path d="M50 34C52 28 64 28 66 34" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Drafting Stylus */}
    <g transform="translate(30, 42) rotate(-35)" filter="url(#engShadow)">
      <rect x="0" y="0" width="8" height="28" rx="2" fill="url(#engGrad)" />
      <path d="M0 28L4 36L8 28Z" fill="#FFD166" />
      <rect x="0" y="-4" width="8" height="5" rx="1" fill="#FF7597" />
    </g>

    <circle cx="30" cy="24" r="2.5" fill="#FFF" />
    <circle cx="88" cy="34" r="2.5" fill="#FFD166" />
  </svg>
);

// Squircle 2: Lavender - Management & Business (MBA, BBA, Finance, Analytics)
export const SquircleArtManagement = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="bizWin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2DCF7" />
      </linearGradient>
      <linearGradient id="chartBubble" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF7597" />
        <stop offset="100%" stopColor="#D90429" />
      </linearGradient>
      <filter id="bizShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#3F2B66" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* 3D Dashboard Portal Window */}
    <g filter="url(#bizShadow)">
      <rect x="25" y="32" width="56" height="52" rx="8" fill="url(#bizWin)" />
      {/* Title Bar */}
      <rect x="25" y="32" width="56" height="14" rx="8" fill="#D3C9F2" />
      <circle cx="33" cy="39" r="2" fill="#FF5F56" />
      <circle cx="39" cy="39" r="2" fill="#FFBD2E" />
      <circle cx="45" cy="39" r="2" fill="#27C93F" />
      
      {/* Analytics Growth Bar Chart */}
      <rect x="32" y="66" width="6" height="10" rx="2" fill="#7C6DAF" />
      <rect x="41" y="58" width="6" height="18" rx="2" fill="#7C6DAF" />
      <rect x="50" y="50" width="6" height="26" rx="2" fill="#FFA439" />
      <rect x="59" y="44" width="6" height="32" rx="2" fill="#35C7B8" />
      <rect x="68" y="54" width="6" height="22" rx="2" fill="#7C6DAF" />
    </g>

    {/* 3D Target / Deal Badge */}
    <g filter="url(#bizShadow)">
      <rect x="62" y="44" width="34" height="30" rx="8" fill="url(#chartBubble)" />
      <path d="M68 74L64 80L74 74Z" fill="#D90429" />
      {/* Growth Trend Arrow */}
      <path d="M70 65L76 57L81 61L88 52" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M84 52H88V56" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Executive Pen */}
    <g transform="translate(80, 26) rotate(32)" filter="url(#bizShadow)">
      <rect x="0" y="0" width="7" height="24" rx="2" fill="#FFD166" />
      <path d="M0 24L3.5 30L7 24Z" fill="#FFA439" />
      <rect x="0" y="-3" width="7" height="4" rx="1" fill="#4CC9F0" />
    </g>

    <circle cx="22" cy="46" r="3" fill="#FFA439" />
  </svg>
);

// Squircle 3: Cyan - Computing, Data Science & Cyber Security (B.Sc DS, MCA, IT)
export const SquircleArtDataScience = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="dsFrame" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#BFF3EE" />
      </linearGradient>
      <linearGradient id="dsTorus" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFD166" />
        <stop offset="100%" stopColor="#FF6584" />
      </linearGradient>
      <filter id="dsShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#006466" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* 3D Neural / Network Frame */}
    <g filter="url(#dsShadow)">
      <rect x="30" y="32" width="50" height="44" rx="6" fill="#FFA439" />
      <rect x="34" y="36" width="42" height="36" rx="4" fill="url(#dsFrame)" />
      
      {/* Neural Node Clusters */}
      <circle cx="44" cy="46" r="4" fill="#35C7B8" />
      <circle cx="66" cy="44" r="4" fill="#FF6584" />
      <circle cx="55" cy="60" r="5" fill="#7C6DAF" />
      <line x1="44" y1="46" x2="55" y2="60" stroke="#1C8B7E" strokeWidth="2" />
      <line x1="66" y1="44" x2="55" y2="60" stroke="#1C8B7E" strokeWidth="2" />
      <line x1="44" y1="46" x2="66" y2="44" stroke="#FFA439" strokeWidth="1.5" strokeDasharray="2 2" />
    </g>

    {/* 3D Torus Ring */}
    <g filter="url(#dsShadow)" transform="translate(68, 68)">
      <circle cx="8" cy="8" r="14" fill="url(#dsTorus)" />
      <circle cx="8" cy="8" r="6" fill="#35C7B8" />
    </g>

    {/* Binary Ruler */}
    <g transform="translate(24, 76) rotate(-22)" filter="url(#dsShadow)">
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

// Squircle 4: Orange - Architecture, Design & Media (B.Arch, B.Des, UI/UX)
export const SquircleArtDesign = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="tabGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2E3856" />
        <stop offset="100%" stopColor="#1A1F36" />
      </linearGradient>
      <linearGradient id="screenBlue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4361EE" />
        <stop offset="100%" stopColor="#3F37C9" />
      </linearGradient>
      <linearGradient id="stylusHand" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF7597" />
        <stop offset="100%" stopColor="#C9184A" />
      </linearGradient>
      <filter id="desShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#7A3700" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* 3D Blueprint Tablet */}
    <g transform="translate(18, 28) rotate(8)" filter="url(#desShadow)">
      <rect x="0" y="0" width="68" height="52" rx="7" fill="url(#tabGrad)" />
      <rect x="6" y="6" width="46" height="40" rx="4" fill="url(#screenBlue)" />
      
      {/* Hotkey controls */}
      <circle cx="58" cy="14" r="3" fill="#4CC9F0" />
      <circle cx="58" cy="24" r="3" fill="#FFD166" />
      <circle cx="58" cy="34" r="3" fill="#FF7597" />
      
      {/* 3D Structure Wireframe */}
      <path d="M12 34L24 18L36 34H12Z" stroke="#FFD166" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 18V34" stroke="#FFD166" strokeWidth="1.5" />
      <circle cx="24" cy="18" r="2.5" fill="#FFFFFF" />
    </g>

    {/* Stylus Pointer */}
    <g transform="translate(56, 42)" filter="url(#desShadow)">
      <rect x="10" y="0" width="6" height="34" rx="2" fill="#E2DCF7" transform="rotate(-35)" />
      <polygon points="26,10 32,15 28,18" fill="#FFA439" />
      <circle cx="28" cy="14" r="4" fill="#FFD166" opacity="0.8" />
      <path d="M22 28C28 22 42 32 46 45L34 52C28 42 18 36 22 28Z" fill="url(#stylusHand)" />
      <rect x="36" y="44" width="18" height="14" rx="4" fill="#4361EE" transform="rotate(20)" />
    </g>

    <circle cx="25" cy="20" r="3" fill="#FFFFFF" />
    <circle cx="94" cy="25" r="2" fill="#FFD166" />
  </svg>
);
