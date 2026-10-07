'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Store, 
  Heart, 
  Compass, 
  ArrowRight, 
  Users, 
  MapPin, 
  Award, 
  BookOpen 
} from 'lucide-react';

interface EmprendedoresHeroProps {
  onExploreClick?: () => void;
  onStoriesClick?: () => void;
  onRegisterClick?: () => void;
}

export default function EmprendedoresHero({
  onExploreClick,
  onStoriesClick,
  onRegisterClick,
}: EmprendedoresHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 sm:px-6 lg:px-8">
      {/* Glow / Ambient background lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/20 via-amber-500/15 to-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Precolombian subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Top badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs sm:text-sm font-medium shadow-inner animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Red Nacional de Ciudades Creativas &bull; Nicaragua Emprende</span>
          </div>
        </div>

        {/* Hero title & main tagline */}
        <div className="text-center mt-6 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            El Corazón Creativo de <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-teal-300">
              Nuestra Identidad y Nuestras Manos
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Descubre los talleres tradicionales, los sabores ancestrales y las marcas emergentes que están transformando nuestras ciudades. 
            <strong className="text-amber-300 font-semibold"> Historias reales de valentía y perseverancia </strong> 
            para inspirar a cada nuevo soñador de nuestra tierra.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Store className="w-5 h-5" />
            <span>Ver Emprendimientos</span>
          </button>

          <button
            onClick={onStoriesClick}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md font-semibold text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Heart className="w-5 h-5 text-rose-400" />
            <span>Voces que Inspiran</span>
          </button>

          <button
            onClick={onRegisterClick}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/40 text-teal-200 border border-teal-500/40 backdrop-blur-md font-semibold text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-teal-300" />
            <span>Sumar Mi Negocio</span>
          </button>
        </div>

        {/* Key Metrics / Impact Bar */}
        <div className="mt-14 sm:mt-18 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-center hover:bg-white/[0.09] transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
              <Store className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">+150</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">Talleres & Negocios</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-center hover:bg-white/[0.09] transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 mb-2">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">10</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">Ciudades Creativas</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-center hover:bg-white/[0.09] transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 mb-2">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">+500</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">Familias Beneficiadas</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-center hover:bg-white/[0.09] transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">Orgullo & Sabor Local</div>
          </div>
        </div>
      </div>
    </section>
  );
}
