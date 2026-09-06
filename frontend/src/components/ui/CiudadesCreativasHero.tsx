'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, ArrowRight } from 'lucide-react';

export default function CiudadesCreativasHero() {
  return (
    <header className="relative w-full overflow-hidden bg-gradient-to-b from-[#061410] via-[#0A261E] to-[#05110E] text-white pt-20 sm:pt-26 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 rounded-b-[2.5rem] sm:rounded-b-[4rem] lg:rounded-b-[5rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-b border-white/10">
      {/* Halo de iluminación ambiental sutil */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[520px] h-[320px] bg-[#00A8A7]/15 blur-[120px] rounded-full" 
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* 1. LOGO PRINCIPAL: ROOTS BRAND LOCKUP */}
        <div className="relative w-64 xs:w-72 sm:w-84 md:w-96 max-w-full aspect-[4.7/1] mb-4 transition-transform duration-300 hover:scale-[1.02]">
          <Image
            src="/logos/preview-lockup-dark.png"
            alt="ROOTS"
            fill
            priority
            sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 384px"
            className="object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* 2. TÍTULO PRINCIPAL */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-3.5 select-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]">
          Ciudades Creativas
        </h1>

        {/* 3. SUBTÍTULO / DESCRIPCIÓN CONCISA Y ELEGANTE */}
        <p className="max-w-xl text-sm sm:text-base md:text-lg text-slate-300/90 font-normal leading-relaxed mb-7 sm:mb-9 px-3">
          Descubrí el patrimonio, la tradición viva y los circuitos artísticos de nuestros 10 municipios culturales.
        </p>

        {/* 4. BOTONES DE ACCIÓN PRINCIPALES */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto max-w-xs sm:max-w-none">
          <Link
            href="/ciudades-creativas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#00A8A7] to-[#007F7E] hover:from-[#00BFBD] hover:to-[#009694] text-white font-bold text-sm shadow-[0_8px_25px_rgba(0,168,167,0.35)] hover:shadow-[0_12px_30px_rgba(0,168,167,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explorar Mapa Interactivo</span>
          </Link>

          <Link
            href="/circuitos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white/90 hover:text-white font-medium text-sm backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Ver Circuitos & Rutas</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F4A43B]" />
          </Link>
        </div>

      </div>
    </header>
  );
}
