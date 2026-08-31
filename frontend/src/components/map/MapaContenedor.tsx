"use client";

import React, { useState, useEffect } from 'react';
import NicaraguaSVG from './NicaraguaSVG';
import LeonDepartamentoSVG from './LeonDepartamentoSVG';
import ManaguaDepartamentoSVG from './ManaguaDepartamentoSVG';
import MapaInmersivo from './MapaInmersivo';
import { useUI } from '@/context/UIContext';

export type NivelMapa = 'nacional' | 'departamental' | 'inmersivo';

interface MapaContenedorProps {
  initialNivel?: NivelMapa;
  showLegend?: boolean;
}

export default function MapaContenedor({
  initialNivel = 'nacional',
  showLegend = true,
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
  const manejarSeleccionNacional = (idDepartamento: string) => {
    setDepartamentoActivo(idDepartamento);
    setCircuitoSeleccionado(undefined);

    if (idDepartamento === 'NILE') {
      // Si es León, abrimos el SVG departamental detallado de León
      setSeleccion('leon');
      setNivelActual('departamental');
    } else if (idDepartamento === 'NIMN') {
      // Si es Managua, abrimos el SVG departamental detallado de Managua
      setSeleccion('managua');
      setNivelActual('departamental');
    } else {
      // Para otros departamentos creativos, pasamos al mapa inmersivo 3D directamente
      setSeleccion(idDepartamento);
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
        <div className="w-full h-full flex flex-col items-center justify-center animate-fadeIn">
          <NicaraguaSVG 
            onSelect={manejarSeleccionNacional} 
            showLegend={showLegend} 
            showMarkers={true} 
          />
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