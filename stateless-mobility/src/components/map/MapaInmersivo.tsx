"use client";

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapaInmersivoProps {
  municipioId?: string;
  lng?: number;
  lat?: number;
  zoom?: number;
  onBack: () => void;
}

export default function MapaInmersivo({ 
  municipioId, 
  // Por defecto centrado en la Catedral de León para pruebas, puedes ajustarlo
  lng = -86.8782, 
  lat = 12.4350,
  zoom = 15.5, // Zoom bien cercano para dar la sensación inmersiva
  onBack 
}: MapaInmersivoProps) {
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // 1. Inicializamos el mapa de forma ultra ligera
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      // Usamos un estilo base claro (puedes cambiarlo por tu estilo de MapTiler/Mapbox)
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [lng, lat],
      zoom: zoom,
      pitch: 60, // Inclinación agresiva para efecto 3D/inmersivo
      bearing: -20, // Rotación ligera para un ángulo más dinámico
    });

    // 2. Controles básicos de navegación
    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }), 
      'top-right'
    );

    // *Nota: Eliminamos todos los addSource y addLayer de departamentos.
    // Ahora el mapa solo carga el municipio al que le pasemos las coordenadas (lng, lat).

  }, [lng, lat, zoom]);

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100">
      
      {/* Botón para volver al SVG Departamental */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 z-10 bg-white px-5 py-2.5 rounded-full shadow-lg font-bold text-slate-700 hover:text-purple-800 hover:bg-slate-50 transition-all flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver
      </button>
      
      {/* Contenedor del Mapa Libre de Capas Pesadas */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}