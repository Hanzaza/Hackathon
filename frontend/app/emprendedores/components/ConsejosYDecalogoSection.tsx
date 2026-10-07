'use client';

import React from 'react';
import { 
  Sparkles, 
  Compass, 
  Users, 
  BookOpen, 
  MapPin, 
  HeartHandshake, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { ADVICE_PILLARS, EntrepreneurAdvicePillar } from '@/data/emprendedoresData';

const ICONS_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5" />,
};

export default function ConsejosYDecalogoSection() {
  return (
    <section className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-teal-500/15 via-amber-500/10 to-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs sm:text-sm font-bold mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Semillero de Consejos &bull; Sabiduría de Emprendedor a Emprendedor</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            6 Claves Fundamentales para <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-teal-300">
              Iniciar y Hacer Crecer tu Negocio
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Consejos prácticos recopilados de maestros artesanos, catadores y creadores consagrados que han recorrido el camino antes que tú.
          </p>
        </div>

        {/* 6 Advice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ADVICE_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="relative p-6 sm:p-7 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-md hover:bg-white/[0.09] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:border-white/20"
            >
              <div>
                {/* Header: Number & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-black text-white/20 group-hover:text-amber-400/40 transition-colors font-mono">
                    {pillar.number}
                  </span>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white shadow-md`}>
                    {ICONS_MAP[pillar.iconName] || <Sparkles className="w-5 h-5" />}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs font-semibold text-amber-400/90 mt-1">
                  {pillar.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Action Tip Pill */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <div className="flex items-start gap-2 text-xs text-teal-300 font-medium bg-teal-950/40 border border-teal-500/20 p-3 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white font-semibold">Tip para hoy:</strong> {pillar.actionTip}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
