'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { X, MapPin, Compass, Clock, Construction, ChevronLeft, ChevronRight } from 'lucide-react';

export interface CircuitoInfo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  isAvailable: boolean;
  citySlug: string;
  badge: string;
}

export interface MunicipioSelection {
  id?: string;
  name: string;
  circuits: CircuitoInfo[];
}

interface CircuitoSelectorModalProps {
  currentSelection: MunicipioSelection | null;
  onClose: () => void;
  onSelectCircuit: (citySlug: string, circuitId?: string) => void;
  defaultSlug?: string;
}

export const CircuitoSelectorModal: React.FC<CircuitoSelectorModalProps> = ({
  currentSelection,
  onClose,
  onSelectCircuit,
  defaultSlug = 'leon',
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 320;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!currentSelection) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-[2.5rem] bg-slate-900/95 border border-slate-700/80 shadow-[0_25px_70px_rgba(0,0,0,0.6)] p-4 sm:p-6 flex flex-col items-center overflow-hidden">
        
        {/* Botón cerrar modal */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer z-20 border border-slate-600/50 shadow-lg"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Cabecera del Modal */}
        <div className="w-full text-left mb-3 pr-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-700/60 text-purple-300 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Circuitos Creativos • {currentSelection.name}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Elige tu Recorrido Cultural
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Desliza hacia los lados para explorar las rutas disponibles
          </p>
        </div>

        {/* Contenedor Horizontal de Tarjetas Verticales (Snap Carousel) */}
        <div 
          ref={carouselRef}
          className="w-full flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-5 py-2 px-1 no-scrollbar items-stretch scroll-smooth"
        >
          {currentSelection.circuits.map((circuito, idx) => (
            <div
              key={circuito.id}
              className={`relative snap-center shrink-0 w-[84vw] max-w-[280px] xs:max-w-[310px] sm:max-w-[340px] h-[430px] xs:h-[470px] sm:h-[510px] rounded-[2rem] overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-2xl ${
                circuito.isAvailable
                  ? 'border-purple-500/80 shadow-purple-950/40 ring-1 ring-purple-500/40'
                  : 'border-slate-800 shadow-black/60 opacity-95'
              }`}
            >
              {/* Imagen Vertical de Fondo Completo (Full-Bleed) */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={circuito.image}
                  alt={circuito.name}
                  fill
                  sizes="(max-width: 640px) 280px, 340px"
                  className={`object-cover transition-transform duration-700 ${
                    circuito.isAvailable ? 'hover:scale-105' : 'grayscale-[35%]'
                  }`}
                />
                {/* Gradiente vertical para máxima legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
              </div>

              {/* Cabecera de la Tarjeta Vertical */}
              <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between gap-2">
                {/* Badge de estado */}
                <div>
                  {circuito.isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-[10px] sm:text-xs font-extrabold shadow-lg backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{circuito.badge}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-400 text-amber-300 text-[10px] sm:text-xs font-extrabold shadow-lg backdrop-blur-md">
                      <Construction className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{circuito.badge}</span>
                    </span>
                  )}
                </div>

                {/* Indicador de Número */}
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-black text-[10px]">
                  {idx + 1} / {currentSelection.circuits.length}
                </span>
              </div>

              {/* Parte Inferior de la Tarjeta Vertical */}
              <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-8">
                <div className="mb-3">
                  <h4 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md mb-1">
                    {circuito.name}
                  </h4>
                  <p className="text-xs font-bold text-purple-300 drop-shadow-sm mb-2">
                    {circuito.subtitle}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {circuito.description}
                  </p>
                </div>

                {/* Botón de Acción */}
                <div>
                  {circuito.isAvailable ? (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectCircuit(circuito.citySlug, circuito.id);
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-[0_8px_25px_rgba(168,85,247,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                    >
                      <MapPin className="w-4 h-4 shrink-0 text-amber-300" />
                      <span>Explorar en el Mapa →</span>
                    </button>
                  ) : (
                    <div className="w-full py-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-amber-300/90 font-bold text-xs flex items-center justify-center gap-2 backdrop-blur-md">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Próximamente Disponible</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de Navegación y Puntos del Carrusel */}
        <div className="w-full flex items-center justify-between pt-3 mt-1 border-t border-slate-800 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-1 font-semibold"
          >
            ← Volver al mapa
          </button>

          {/* Botones flechas para deslizar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
              aria-label="Circuito anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel('right')}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
              aria-label="Siguiente circuito"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectCircuit(defaultSlug);
            }}
            className="text-xs text-purple-400 hover:text-purple-300 font-bold transition-colors cursor-pointer py-1"
          >
            Mapa general →
          </button>
        </div>

      </div>
    </div>
  );
};
