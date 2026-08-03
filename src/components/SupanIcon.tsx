import React from 'react';

interface SupanIconProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'app-icon' | 'symbol-only' | 'transparent';
}

export const SupanIcon: React.FC<SupanIconProps> = ({
  className = '',
  size = 48,
  showText = false,
  variant = 'app-icon',
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: showText ? size * 1.2 : size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Gradient */}
          <linearGradient id="supanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00b4d8" />
            <stop offset="50%" stopColor="#00d284" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Background Gradient for App Icon */}
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Dark BG Option */}
          <linearGradient id="darkBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Network pattern */}
          <pattern id="networkPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#00d284" opacity="0.2" />
            <circle cx="18" cy="18" r="1" fill="#00b4d8" opacity="0.2" />
            <line x1="2" y1="2" x2="18" y2="18" stroke="#00d284" strokeWidth="0.5" opacity="0.15" />
          </pattern>
        </defs>

        {/* Outer App Icon Rounded Container if variant is app-icon */}
        {variant === 'app-icon' && (
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="22"
            fill="url(#bgGradient)"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
        )}

        {/* Background Network Mesh Lines for app icon */}
        {variant === 'app-icon' && (
          <g opacity="0.35">
            <line x1="10" y1="20" x2="40" y2="10" stroke="#94a3b8" strokeWidth="0.8" />
            <line x1="40" y1="10" x2="85" y2="25" stroke="#94a3b8" strokeWidth="0.8" />
            <line x1="85" y1="25" x2="90" y2="60" stroke="#94a3b8" strokeWidth="0.8" />
            <line x1="10" y1="20" x2="15" y2="65" stroke="#94a3b8" strokeWidth="0.8" />
            <line x1="15" y1="65" x2="45" y2="85" stroke="#94a3b8" strokeWidth="0.8" />
            <line x1="45" y1="85" x2="85" y2="80" stroke="#94a3b8" strokeWidth="0.8" />

            <circle cx="10" cy="20" r="2" fill="#38bdf8" />
            <circle cx="40" cy="10" r="2" fill="#34d399" />
            <circle cx="85" cy="25" r="2" fill="#38bdf8" />
            <circle cx="15" cy="65" r="2" fill="#34d399" />
            <circle cx="85" cy="80" r="2" fill="#38bdf8" />
          </g>
        )}

        {/* MAIN SYMBOL: BOWL + CIRCUIT TREE + CLOUD */}
        <g transform="translate(0, -2)">
          {/* Circuit Tech Lines & Nodes rising from bowl */}
          {/* Left Branch */}
          <path
            d="M 38 48 C 34 40, 30 35, 32 28 C 33 24, 38 24, 37 20"
            stroke="url(#supanGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="37" cy="19" r="3" fill="url(#supanGradient)" />

          {/* Center Trunk & High Node */}
          <path
            d="M 48 48 C 48 35, 42 25, 48 16 V 11"
            stroke="url(#supanGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="48" cy="10" r="3.5" fill="url(#supanGradient)" />

          {/* Right Branch leading to Cloud */}
          <path
            d="M 54 48 C 55 38, 62 30, 60 22"
            stroke="url(#supanGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          
          {/* Cloud Icon on Right Branch */}
          <path
            d="M 58 22 C 56 20, 56 16, 60 14 C 62 11, 68 11, 71 14 C 74 12, 78 15, 77 18 C 80 19, 79 24, 75 25 C 72 26, 60 26, 58 22 Z"
            fill="none"
            stroke="url(#supanGradient)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="68" cy="21" r="2.5" fill="url(#supanGradient)" />

          {/* Spoon / Wand resting in the bowl */}
          <path
            d="M 52 46 L 76 25 C 79 22, 83 26, 80 29 L 58 48 Z"
            fill="url(#supanGradient)"
            opacity="0.85"
          />

          {/* Bowl Outer Rim & Body */}
          <path
            d="M 22 42 C 22 66, 38 72, 50 72 C 62 72, 78 66, 78 42 Z"
            fill="none"
            stroke="url(#supanGradient)"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Inner Liquid Curve inside bowl */}
          <path
            d="M 27 46 C 35 52, 65 52, 73 46"
            stroke="url(#supanGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Bowl Base Stand */}
          <path
            d="M 38 72 L 39 76 C 39 77, 61 77, 61 76 L 62 72"
            fill="url(#supanGradient)"
            stroke="url(#supanGradient)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>

        {/* Text 'SUPAN' at bottom if in icon view or showText */}
        {showText && (
          <text
            x="50"
            y="92"
            textAnchor="middle"
            fill="#0284c7"
            fontWeight="900"
            fontSize="15"
            letterSpacing="1"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            SUPAN
          </text>
        )}
      </svg>
    </div>
  );
};
