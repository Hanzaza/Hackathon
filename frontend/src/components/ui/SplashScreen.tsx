'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Los 8 íconos culturales oficiales que componen la identidad de ROOTS
const CULTURAL_ICONS = [
  {
    id: 'gueguense',
    name: 'El Güegüense',
    src: '/icons/roots/gueguense.png',
    position: 'top-[8%] left-[10%] sm:top-[10%] sm:left-[14%]',
    size: 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20',
    delay: '0s',
    duration: '3.6s',
  },
  {
    id: 'cathedral',
    name: 'Catedral',
    src: '/icons/roots/cathedral.png',
    position: 'top-[7%] right-[10%] sm:top-[9%] sm:right-[14%]',
    size: 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20',
    delay: '0.7s',
    duration: '4.2s',
  },
  {
    id: 'bird',
    name: 'Guardabarranco',
    src: '/icons/roots/bird.png',
    position: 'top-[24%] left-[6%] sm:top-[25%] sm:left-[10%]',
    size: 'w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22',
    delay: '1.4s',
    duration: '3.8s',
  },
  {
    id: 'coffee-star',
    name: 'Café',
    src: '/icons/roots/coffee-star.png',
    position: 'top-[23%] right-[6%] sm:top-[24%] sm:right-[10%]',
    size: 'w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22',
    delay: '2.1s',
    duration: '4.5s',
  },
  {
    id: 'guitar',
    name: 'Guitarra',
    src: '/icons/roots/guitar.png',
    position: 'top-[64%] left-[7%] sm:top-[63%] sm:left-[10%]',
    size: 'w-15 h-15 sm:w-18 sm:h-18 md:w-20 md:h-20',
    delay: '0.9s',
    duration: '4.0s',
  },
  {
    id: 'palm',
    name: 'Palmera',
    src: '/icons/roots/palm.png',
    position: 'top-[62%] right-[7%] sm:top-[61%] sm:right-[10%]',
    size: 'w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22',
    delay: '1.6s',
    duration: '3.7s',
  },
  {
    id: 'pottery',
    name: 'Cerámica',
    src: '/icons/roots/pottery.png',
    position: 'bottom-[9%] left-[16%] sm:bottom-[11%] sm:left-[22%]',
    size: 'w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18',
    delay: '0.4s',
    duration: '4.3s',
  },
  {
    id: 'mask',
    name: 'Máscara',
    src: '/icons/roots/mask.png',
    position: 'bottom-[9%] right-[16%] sm:bottom-[11%] sm:right-[22%]',
    size: 'w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18',
    delay: '1.2s',
    duration: '3.9s',
  },
];

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Duración de la pantalla de bienvenida y desvanecimiento suave
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0F3A2E] text-white transition-all duration-700 select-none overflow-hidden ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      {/* Contenedor relativo para posicionar los íconos distribuidos en toda la pantalla */}
      <div className="absolute inset-0 w-full h-full max-w-5xl mx-auto pointer-events-none">
        {CULTURAL_ICONS.map((icon) => (
          <div
            key={icon.id}
            className={`absolute ${icon.position} ${icon.size} transition-transform drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)]`}
            style={{
              animation: `float ${icon.duration} ease-in-out infinite`,
              animationDelay: icon.delay,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={icon.src}
                alt={icon.name}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Centro: Emblema Oficial ROOTS y Tipografía */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        {/* Emblema Circular Oficial ROOTS */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mb-3 drop-shadow-[0_20px_45px_rgba(0,0,0,0.7)]">
          <Image
            src="/logos/roots-emblem-white.png"
            alt="ROOTS Logo Oficial"
            fill
            priority
            sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
            className="object-contain"
          />
        </div>

        {/* Título de Marca Oficial ROOTS */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.25em] uppercase text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
          ROOTS
        </h1>
        <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-[#F4A43B] mt-1 drop-shadow-sm">
          Raíces Vivas de Nicaragua
        </p>
      </div>
    </div>
  );
}
