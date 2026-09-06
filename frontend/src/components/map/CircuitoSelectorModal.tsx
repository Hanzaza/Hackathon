'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { X, MapPin, Compass, Clock, Construction, ChevronLeft, ChevronRight, Lock, MapPinOff } from 'lucide-react';

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
  slug?: string;
  isEnabled?: boolean;
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

  const isEnabled = currentSelection.isEnabled !== false;
  const targetSlug = currentSelection.slug || defaultSlug;
  const hasCircuits = currentSelection.circuits && currentSelection.circuits.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-[2.5rem] bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_25px_70px_rgba(0,0,0,0.2)] p-5 sm:p-7 flex flex-col items-center overflow-hidden">
        
        {/* Botón cerrar modal */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer z-20 border border-slate-200 shadow-xs"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Cabecera del Modal */}
        <div className="w-full text-left mb-4 pr-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A8A7]/10 border border-[#00A8A7]/30 text-[#007F7E] text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#00A8A7] shrink-0" />
            <span>Circuitos Creativos • {currentSelection.name}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
            {!isEnabled 
              ? 'Municipio No Habilitado' 
              : hasCircuits 
                ? 'Elige tu Recorrido Cultural' 
                : 'Rutas en Construcción'}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            {!isEnabled
              ? 'Este municipio aún no está habilitado para recorridos públicos'
              : hasCircuits 
                ? (currentSelection.circuits.length === 1 
                    ? 'Explora el circuito cultural habilitado para esta ciudad' 
                    : 'Desliza hacia los lados para explorar las rutas disponibles')
                : `Descubre los atractivos culturales e hitos de ${currentSelection.name}`}
          </p>
        </div>

        {/* ================= ESTADO 0: MUNICIPIO INHABILITADO POR EL ADMINISTRADOR ================= */}
        {!isEnabled ? (
          <div className="w-full my-2 p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-[#061410] via-[#0A261E] to-[#0F3A2E] text-white border border-[#00A8A7]/25 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A261E]/90 border border-[#F4A43B]/60 text-[#F4D44D] text-xs font-extrabold shadow-lg backdrop-blur-md mb-4">
              <Lock className="w-4 h-4 text-[#F4A43B] shrink-0" />
              <span>Acceso Restringido</span>
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#0F3A2E]/80 border border-[#00A8A7]/40 flex items-center justify-center mb-4 text-[#F4A43B]">
              <MapPinOff className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
              Territorio en Preparación
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mb-6">
              El municipio de <strong className="text-white">{currentSelection.name}</strong> se encuentra temporalmente inhabilitado por la delegación territorial. Próximamente se activarán sus rutas y experiencias interactivas.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#00A8A7] to-[#007F7E] hover:from-[#00BFBD] hover:to-[#009694] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-[#00A8A7]/30 active:scale-95"
            >
              Volver al Mapa Departamental
            </button>
          </div>
        ) : !hasCircuits ? (
          /* ================= ESTADO 1: NO HAY CIRCUITOS / EN CONSTRUCCIÓN ================= */
          <div className="w-full my-2 p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-[#061410] via-[#0A261E] to-[#0F3A2E] text-white border border-[#00A8A7]/30 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
            {/* Fondo decorativo con glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00A8A7]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F4A43B]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Badge de estado en construcción */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1105]/95 border border-[#F4A43B]/80 text-[#F4D44D] text-xs font-extrabold shadow-lg backdrop-blur-md mb-4">
              <Construction className="w-4 h-4 text-[#F4A43B] shrink-0 animate-pulse" />
              <span>Próximamente Disponible</span>
            </div>

            {/* Ícono central */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#00A8A7]/20 border border-[#00A8A7]/40 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,168,167,0.3)]">
              <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-[#00A8A7]" />
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
              Circuitos en Proceso de Diseño
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mb-3">
              Por el momento no hay rutas creativas registradas para <strong className="text-white">{currentSelection.name}</strong>. Nuestro equipo territorial y cultural está diseñando los recorridos temáticos que estarán listos muy pronto.
            </p>

            <p className="text-xs text-amber-200/90 font-medium max-w-md mb-6">
              ¡Pero ya podés ingresar a conocer los demás puntos de interés, monumentos, talleres artesanales y gastronomía de esta ciudad!
            </p>

            {/* Botón de Acción Principal para Conocer los Puntos de la Ciudad */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectCircuit(targetSlug);
              }}
              className="w-full max-w-sm py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#00A8A7] via-[#009694] to-[#007F7E] hover:from-[#00BFBD] hover:to-[#00A8A7] text-white font-black text-xs sm:text-sm shadow-[0_10px_30px_rgba(0,168,167,0.45)] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-white/25"
            >
              <MapPin className="w-4 h-4 text-[#F4D44D] shrink-0" />
              <span>Conocer los demás puntos de {currentSelection.name} →</span>
            </button>
          </div>
        ) : (
          /* ================= ESTADO 2: CARRUSEL DE RUTAS DISPONIBLES ================= */
          <div 
            ref={carouselRef}
            className={`w-full flex flex-row ${
              currentSelection.circuits.length === 1 
                ? 'justify-center items-center' 
                : 'overflow-x-auto snap-x snap-mandatory items-stretch no-scrollbar scroll-smooth'
            } gap-4 sm:gap-5 py-2 px-1`}
          >
            {currentSelection.circuits.map((circuito, idx) => (
              <div
                key={circuito.id}
                className={`relative snap-center shrink-0 w-[84vw] max-w-[280px] xs:max-w-[310px] sm:max-w-[340px] h-[430px] xs:h-[470px] sm:h-[510px] rounded-[2rem] overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-xl ${
                  circuito.isAvailable
                    ? 'border-[#00A8A7]/40 shadow-[0_16px_40px_rgba(0,168,167,0.18)] ring-2 ring-[#00A8A7]/25 bg-[#061410]'
                    : 'border-slate-800 shadow-black/30 opacity-90 bg-[#061410]'
                }`}
              >
                {/* Imagen Vertical de Fondo Completo (Full-Bleed) */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={circuito.image || '/mapa_circuitos_creativos_cards/leon/circuito_dariano.png'}
                    alt={circuito.name}
                    fill
                    sizes="(max-width: 640px) 280px, 340px"
                    className={`object-cover transition-transform duration-700 ${
                      circuito.isAvailable ? 'hover:scale-105' : 'grayscale-[35%]'
                    }`}
                  />
                  {/* Gradiente vertical ROOTS para máxima legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061410] via-[#0A261E]/80 to-[#061410]/20" />
                </div>

                {/* Cabecera de la Tarjeta Vertical */}
                <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between gap-2">
                  {/* Badge de estado */}
                  <div>
                    {circuito.isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3A2E]/95 border border-[#3BA455]/80 text-[#A7D7A8] text-[10px] sm:text-xs font-black shadow-lg backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-[#3BA455] animate-pulse" />
                        <span>{circuito.badge}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1105]/95 border border-[#F4A43B]/80 text-[#F4D44D] text-[10px] sm:text-xs font-black shadow-lg backdrop-blur-md">
                        <Construction className="w-3 h-3 text-[#F4A43B] shrink-0" />
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
                <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-end bg-gradient-to-t from-[#061410] via-[#0A261E]/95 to-transparent pt-8">
                  <div className="mb-3">
                    <h4 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md mb-1.5">
                      {circuito.name}
                    </h4>
                    <p className="text-xs font-black tracking-wide text-[#F4A43B] drop-shadow-sm mb-2 uppercase">
                      {circuito.subtitle}
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-200/90 leading-relaxed line-clamp-3">
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
                          onSelectCircuit(circuito.citySlug || targetSlug, circuito.id);
                        }}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#00A8A7] via-[#009694] to-[#007F7E] hover:from-[#00BFBD] hover:to-[#00A8A7] text-white font-black text-xs sm:text-sm shadow-[0_10px_30px_rgba(0,168,167,0.45)] hover:shadow-[0_14px_35px_rgba(0,168,167,0.65)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/25"
                      >
                        <MapPin className="w-4 h-4 shrink-0 text-[#F4D44D]" />
                        <span>Explorar en el Mapa →</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectCircuit(circuito.citySlug || targetSlug);
                        }}
                        className="w-full py-3.5 px-4 rounded-2xl bg-[#0A261E]/95 hover:bg-[#0F3A2E] border border-[#00A8A7]/40 text-[#F4A43B] font-extrabold text-xs flex items-center justify-center gap-2 backdrop-blur-md transition-all active:scale-[0.98] cursor-pointer shadow-md"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#F4A43B] shrink-0" />
                        <span>Conocer los puntos de la ciudad →</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Controles de Navegación y Puntos del Carrusel */}
        <div className="w-full flex items-center justify-between pt-3 mt-1 border-t border-slate-200 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer py-1 font-bold flex items-center gap-1"
          >
            ← Volver al mapa
          </button>

          {/* Botones flechas para deslizar (solo si el territorio está habilitado y hay más de 1 circuito) */}
          {isEnabled && hasCircuits && currentSelection.circuits.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="p-2 rounded-full bg-slate-100 hover:bg-[#00A8A7]/15 hover:text-[#007F7E] text-slate-700 transition-all cursor-pointer border border-slate-200 shadow-xs active:scale-90"
                aria-label="Deslizar a la izquierda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="p-2 rounded-full bg-slate-100 hover:bg-[#00A8A7]/15 hover:text-[#007F7E] text-slate-700 transition-all cursor-pointer border border-slate-200 shadow-xs active:scale-90"
                aria-label="Deslizar a la derecha"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Solo mostrar la opción de explorar otros puntos si el territorio está HABILITADO */}
          {isEnabled && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectCircuit(targetSlug);
              }}
              className="text-xs text-[#007F7E] hover:text-[#00A8A7] font-black transition-colors cursor-pointer py-1 flex items-center gap-1"
            >
              <span>Conocer los demás puntos →</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
