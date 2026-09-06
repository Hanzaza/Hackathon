"use client";

import React, { useState, useEffect } from 'react';
import NicaraguaSVG from './NicaraguaSVG';
import LeonDepartamentoSVG from './LeonDepartamentoSVG';
import ManaguaDepartamentoSVG from './ManaguaDepartamentoSVG';
import MapaInmersivo from './MapaInmersivo';
import { useUI } from '@/context/UIContext';
import { Sparkles } from 'lucide-react';

export type NivelMapa = 'nacional' | 'departamental' | 'inmersivo';

interface MapaContenedorProps {
  initialNivel?: NivelMapa;
  showLegend?: boolean;
}

export default function MapaContenedor({
  initialNivel = 'nacional',
  showLegend = false,
}: MapaContenedorProps) {
  const { setIsImmersiveMapActive } = useUI();

  // Nivel actual de la navegación en el mapa
  const [nivelActual, setNivelActual] = useState<NivelMapa>(initialNivel);

  useEffect(() => {
    setIsImmersiveMapActive(nivelActual === 'inmersivo');
    return () => setIsImmersiveMapActive(false);
  }, [nivelActual, setIsImmersiveMapActive]);
  
  // Departamento seleccionado ('NILE', 'NIMN', etc.)
  const [departamentoActivo, setDepartamentoActivo] = useState<string>('NILE');

  // Identificador de ciudad activa ('leon', 'nagarote', 'managua', etc.)
  const [seleccion, setSeleccion] = useState<string>('leon');

  // Circuito creativo específico seleccionado (ej. 'dariano', 'managua-patrimonial')
  const [circuitoSeleccionado, setCircuitoSeleccionado] = useState<string | undefined>(undefined);

  // Clic en el Mapa Nacional
  const manejarSeleccionNacional = (idOIdentificador: string) => {
    setCircuitoSeleccionado(undefined);

    if (idOIdentificador === 'NILE' || idOIdentificador === 'leon' || idOIdentificador === 'nagarote') {
      setDepartamentoActivo('NILE');
      setSeleccion(idOIdentificador === 'nagarote' ? 'nagarote' : 'leon');
      setNivelActual('departamental');
    } else if (idOIdentificador === 'NIMN' || idOIdentificador === 'managua') {
      setDepartamentoActivo('NIMN');
      setSeleccion('managua');
      setNivelActual('departamental');
    } else {
      setDepartamentoActivo(idOIdentificador);
      setSeleccion(idOIdentificador);
      setNivelActual('inmersivo');
    }
  };

  // Clic en una ciudad creativa o circuito desde el SVG Departamental
  const manejarSeleccionCiudad = (citySlug: string, circuitId?: string) => {
    setSeleccion(citySlug);
    setCircuitoSeleccionado(circuitId);
    setNivelActual('inmersivo');
  };

  // Navegación hacia atrás
  const manejarRegreso = () => {
    if (nivelActual === 'inmersivo') {
      if (departamentoActivo === 'NILE' || departamentoActivo === 'NIMN') {
        setNivelActual('departamental');
      } else {
        setNivelActual('nacional');
      }
    } else if (nivelActual === 'departamental') {
      setNivelActual('nacional');
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative transition-all duration-300">
      
      {/* ================= NIVEL 1: Mapa Nacional SVG ================= */}
      {nivelActual === 'nacional' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative animate-fadeIn pt-14 sm:pt-6 lg:pt-0 pb-24 sm:pb-6 lg:pb-0 px-3 sm:px-6 lg:px-0 gap-3 sm:gap-4 lg:gap-0">
          
          {/* Título de la Página Principal del Mapa (Solo en vista móvil) */}
          <div className="lg:hidden w-full flex justify-center z-10 select-none shrink-0 px-3">
            <div className="relative overflow-hidden inline-flex flex-col items-center justify-center px-7 py-3 sm:px-9 sm:py-4 rounded-2xl sm:rounded-[2rem] bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_12px_35px_rgba(0,168,167,0.09)] text-center transition-all">
              
              {/* Línea superior con gradiente de luz ROOTS */}
              <div 
                aria-hidden="true" 
                className="absolute top-0 inset-x-8 h-[2.5px] bg-gradient-to-r from-transparent via-[#00A8A7] to-[#F4A43B] opacity-85" 
              />

              {/* Título con contraste y gradiente cultural (más grande, sin íconos) */}
              <h1 className="text-[28px] xs:text-[34px] sm:text-4xl md:text-5xl font-black tracking-tight leading-none flex items-center justify-center gap-2">
                <span className="text-slate-900">Ciudades</span>
                <span className="bg-gradient-to-r from-[#00A8A7] via-[#007F7E] to-[#F4A43B] bg-clip-text text-transparent">
                  Creativas
                </span>
              </h1>

              {/* Subtítulo dinámico con acentos de color (sin íconos) */}
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
                Tocá un <strong className="text-[#007F7E] font-bold">departamento</strong> o <strong className="text-[#D97706] font-bold">ciudad</strong> para explorar
              </p>
            </div>
          </div>

          <div className="w-full h-full flex-1 flex items-center justify-center min-h-0">
            <NicaraguaSVG 
              onSelect={manejarSeleccionNacional} 
              showLegend={showLegend} 
              showMarkers={true} 
            />
          </div>
        </div>
      )}

      {/* ================= NIVEL 2: SVG Departamentales ================= */}
      {nivelActual === 'departamental' && departamentoActivo === 'NILE' && (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fadeIn">
          <LeonDepartamentoSVG 
            onSelectCity={manejarSeleccionCiudad} 
            onBack={() => setNivelActual('nacional')} 
          />
        </div>
      )}

      {nivelActual === 'departamental' && departamentoActivo === 'NIMN' && (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fadeIn">
          <ManaguaDepartamentoSVG 
            onSelectCity={manejarSeleccionCiudad} 
            onBack={() => setNivelActual('nacional')} 
          />
        </div>
      )}

      {/* ================= NIVEL 3: Detalle Municipal Inmersivo (MapLibre 3D) ================= */}
      {nivelActual === 'inmersivo' && (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fadeIn">
          <MapaInmersivo 
            municipioId={seleccion} 
            circuitoId={circuitoSeleccionado}
            onBack={manejarRegreso} 
          />
        </div>
      )}

    </div>
  );
}