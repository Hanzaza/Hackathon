'use client';

import React, { useId } from 'react';

interface PrecolombianPatternProps {
  className?: string;
  fillColor?: string;
  strokeColor?: string;
  accentColor?: string;
  opacity?: number;
  height?: string | number;
  patternUnitSize?: number;
  patternSize?: string;
  variant?: 'mandala' | 'diamonds';
  fullScreen?: boolean;
}

// Convierte un color hex a rgba para gradientes perfectamente controlados
const hexToRgba = (hex: string, alpha: number) => {
  if (hex.startsWith('#') && hex.length === 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
};

export default function PrecolombianPattern({
  className = '',
  fillColor = '#0F3A2E',
  strokeColor = '#00A8A7',
  accentColor = '#F4A43B',
  opacity = 0.85,
  height = '320px',
  patternUnitSize = 140,
  variant = 'mandala',
  fullScreen = false,
}: PrecolombianPatternProps) {
  const patternId = useId();

  if (fullScreen) {
    return (
      <div 
        className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 ${className}`}
        aria-hidden="true"
      >
        {/* Fondo cromático base con viñeta ambiental */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            background: `radial-gradient(circle at 50% 50%, ${hexToRgba(strokeColor, 0.12)} 0%, ${hexToRgba(fillColor, 0.95)} 65%, ${fillColor} 100%)`
          }}
        />

        {/* Trama 100% Vectorial con Enmascarado Radial Suave (sin bordes duros) */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 25%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.2) 85%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 25%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.2) 85%, transparent 100%)',
          }}
        >
          <svg
            className="w-full h-full"
            style={{ opacity }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id={patternId}
                width={patternUnitSize}
                height={patternUnitSize}
                viewBox="0 0 160 160"
                patternUnits="userSpaceOnUse"
              >
                {/* Outer concentric rosette ring */}
                <circle cx="80" cy="80" r="74" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeDasharray="4 3" opacity="0.35" />
                
                {/* 8 Petal Loops of the ROOTS emblem rosette */}
                <path d="M 70.0,54.0 C 56.0,35.0 62.0,12.0 80.0,10.0 C 98.0,12.0 104.0,35.0 90.0,54.0" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 91.3,54.5 C 94.8,31.2 115.4,19.2 129.5,30.5 C 140.8,44.6 128.8,65.2 105.5,68.7" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 106.0,70.0 C 125.0,56.0 148.0,62.0 150.0,80.0 C 148.0,98.0 125.0,104.0 106.0,90.0" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 105.5,91.3 C 128.8,94.8 140.8,115.4 129.5,129.5 C 115.4,140.8 94.8,128.8 91.3,105.5" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 90.0,106.0 C 104.0,125.0 98.0,148.0 80.0,150.0 C 62.0,148.0 56.0,125.0 70.0,106.0" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 68.7,105.5 C 65.2,128.8 44.6,140.8 30.5,129.5 C 19.2,115.4 31.2,94.8 54.5,91.3" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 54.0,90.0 C 35.0,104.0 12.0,98.0 10.0,80.0 C 12.0,62.0 35.0,56.0 54.0,70.0" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 54.5,68.7 C 31.2,65.2 19.2,44.6 30.5,30.5 C 44.6,19.2 65.2,31.2 68.7,54.5" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Central interlaced square / diamond knot */}
                <rect x="66" y="66" width="28" height="28" fill="none" stroke={strokeColor} strokeWidth="2.2" rx="4" />
                <rect x="66" y="66" width="28" height="28" transform="rotate(45 80 80)" fill="none" stroke={accentColor} strokeWidth="2.2" rx="4" />
                
                {/* Center core dot / sun */}
                <circle cx="80" cy="80" r="5.5" fill={accentColor} fillOpacity="0.85" />
                <circle cx="80" cy="80" r="14" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.6" />
                
                {/* Connecting corner links for seamless continuous tiling */}
                <path d="M 0,0 L 18,18 M 160,0 L 142,18 M 0,160 L 18,142 M 160,160 L 142,142" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
                <circle cx="0" cy="0" r="18" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.45" />
                <circle cx="160" cy="0" r="18" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.45" />
                <circle cx="0" cy="160" r="18" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.45" />
                <circle cx="160" cy="160" r="18" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.45" />
                <circle cx="0" cy="0" r="4" fill={strokeColor} opacity="0.6" />
                <circle cx="160" cy="0" r="4" fill={strokeColor} opacity="0.6" />
                <circle cx="0" cy="160" r="4" fill={strokeColor} opacity="0.6" />
                <circle cx="160" cy="160" r="4" fill={strokeColor} opacity="0.6" />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full overflow-hidden pointer-events-none select-none ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      {/* 1. Fondo base degradado para integración cromática con el contenedor */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          background: `linear-gradient(to top, ${fillColor} 0%, transparent 100%)`
        }}
      />

      {/* 2. Trama Precolombina 100% Vectorial en Código SVG con Enmascarado Progresivo */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 8%, rgba(0,0,0,0.2) 22%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,1) 68%, rgba(0,0,0,1) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 8%, rgba(0,0,0,0.2) 22%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,1) 68%, rgba(0,0,0,1) 100%)',
        }}
      >
        <svg
          className="w-full h-full"
          style={{ opacity }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {variant === 'mandala' ? (
              <pattern
                id={patternId}
                width={patternUnitSize}
                height={patternUnitSize}
                viewBox="0 0 160 160"
                patternUnits="userSpaceOnUse"
              >
                {/* Outer concentric rosette ring */}
                <circle cx="80" cy="80" r="74" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeDasharray="4 3" opacity="0.35" />
                
                {/* 8 Petal Loops of the ROOTS emblem rosette */}
                <path d="M 70.0,54.0 C 56.0,35.0 62.0,12.0 80.0,10.0 C 98.0,12.0 104.0,35.0 90.0,54.0" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 91.3,54.5 C 94.8,31.2 115.4,19.2 129.5,30.5 C 140.8,44.6 128.8,65.2 105.5,68.7" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 106.0,70.0 C 125.0,56.0 148.0,62.0 150.0,80.0 C 148.0,98.0 125.0,104.0 106.0,90.0" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 105.5,91.3 C 128.8,94.8 140.8,115.4 129.5,129.5 C 115.4,140.8 94.8,128.8 91.3,105.5" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 90.0,106.0 C 104.0,125.0 98.0,148.0 80.0,150.0 C 62.0,148.0 56.0,125.0 70.0,106.0" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 68.7,105.5 C 65.2,128.8 44.6,140.8 30.5,129.5 C 19.2,115.4 31.2,94.8 54.5,91.3" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 54.0,90.0 C 35.0,104.0 12.0,98.0 10.0,80.0 C 12.0,62.0 35.0,56.0 54.0,70.0" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 54.5,68.7 C 31.2,65.2 19.2,44.6 30.5,30.5 C 44.6,19.2 65.2,31.2 68.7,54.5" fill="none" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Central interlaced square / diamond knot */}
                <rect x="66" y="66" width="28" height="28" fill="none" stroke={strokeColor} strokeWidth="2.2" rx="4" />
                <rect x="66" y="66" width="28" height="28" transform="rotate(45 80 80)" fill="none" stroke={accentColor} strokeWidth="2.2" rx="4" />
                
                {/* Center core dot / sun */}
                <circle cx="80" cy="80" r="5.5" fill={accentColor} fillOpacity="0.85" />
                <circle cx="80" cy="80" r="14" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.6" />
                
                {/* Connecting corner links for seamless continuous tiling */}
                <path d="M 0,0 L 18,18 M 160,0 L 142,18 M 0,160 L 18,142 M 160,160 L 142,142" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
                <circle cx="0" cy="0" r="18" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.45" />
                <circle cx="160" cy="0" r="18" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.45" />
                <circle cx="0" cy="160" r="18" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.45" />
                <circle cx="160" cy="160" r="18" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.45" />
                <circle cx="0" cy="0" r="4" fill={strokeColor} opacity="0.6" />
                <circle cx="160" cy="0" r="4" fill={strokeColor} opacity="0.6" />
                <circle cx="0" cy="160" r="4" fill={strokeColor} opacity="0.6" />
                <circle cx="160" cy="160" r="4" fill={strokeColor} opacity="0.6" />
              </pattern>
            ) : (
              <pattern
                id={patternId}
                width={patternUnitSize}
                height={patternUnitSize}
                viewBox="0 0 120 120"
                patternUnits="userSpaceOnUse"
              >
                {/* Diamante Central Concéntrico */}
                <polygon points="60,0 120,60 60,120 0,60" fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinejoin="round" />
                <polygon points="60,10 110,60 60,110 10,60" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="60,20 100,60 60,100 20,60" fill={strokeColor} fillOpacity="0.16" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
                <polygon points="60,30 90,60 60,90 30,60" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
                <polygon points="60,42 78,60 60,78 42,60" fill={strokeColor} fillOpacity="0.85" stroke={strokeColor} strokeWidth="1.5" />

                {/* 4 Esquinas */}
                <path d="M 0,0 L 60,0 L 0,60 Z" fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinejoin="round" />
                <path d="M 0,10 L 50,0" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 0,20 L 40,0" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                <path d="M 0,30 L 30,0" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                <polygon points="0,0 18,0 0,18" fill={strokeColor} fillOpacity="0.85" />

                <path d="M 120,0 L 60,0 L 120,60 Z" fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinejoin="round" />
                <path d="M 70,0 L 120,10" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 80,0 L 120,20" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                <path d="M 90,0 L 120,30" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                <polygon points="120,0 102,0 120,18" fill={strokeColor} fillOpacity="0.85" />

                <path d="M 0,120 L 60,120 L 0,60 Z" fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinejoin="round" />
                <path d="M 0,110 L 50,120" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 0,100 L 40,120" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                <path d="M 0,90 L 30,120" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                <polygon points="0,120 18,120 0,102" fill={strokeColor} fillOpacity="0.85" />

                <path d="M 120,120 L 60,120 L 120,60 Z" fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinejoin="round" />
                <path d="M 70,120 L 120,110" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 80,120 L 120,100" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 90,120 L 120,90" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                <polygon points="120,120 102,120 120,102" fill={strokeColor} fillOpacity="0.85" />
              </pattern>
            )}
          </defs>

          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>

      {/* 3. Velo Difuminador Superior: Fusión ambiental suave con el color de fondo para eliminar cualquier corte duro */}
      <div 
        className="absolute top-0 inset-x-0 h-28 pointer-events-none z-20"
        style={{
          background: `linear-gradient(to bottom, ${fillColor} 0%, ${hexToRgba(fillColor, 0.85)} 25%, ${hexToRgba(fillColor, 0.45)} 55%, transparent 100%)`,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      />
    </div>
  );
}
