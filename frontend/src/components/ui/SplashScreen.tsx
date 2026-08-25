'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';

const emptySubscribe = () => () => {};

export default function SplashScreen() {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!isClient) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white transition-all duration-700 select-none ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="relative flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 mb-8 drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
          <Image
            src="/logos/Logo.png"
            alt="Logo Roots"
            fill
            priority
            sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 256px"
            className="object-contain animate-pulse"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-2">
          Ciudades Creativas
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">
          Red Nacional de Nicaragua
        </p>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        <span className="text-[11px] font-medium text-slate-400 mt-4 tracking-wide">
          Cargando experiencia cultural...
        </span>
      </div>

      <div className="absolute bottom-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        The Stateless Mobility • v1.0
      </div>
    </div>
  );
}
