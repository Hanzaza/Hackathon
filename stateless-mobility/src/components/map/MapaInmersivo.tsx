"use client";

import React, { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapaInmersivoProps {
  municipioId?: string;
  lng?: number;
  lat?: number;
  zoom?: number;
  onBack: () => void;
}

const municipioCoordinates: Record<string, { lng: number; lat: number; zoom: number }> = {
  NILE: { lng: -86.8788302, lat: 12.4348568, zoom: 13.8 },
  NIES: { lng: -86.3561571, lat: 13.0929621, zoom: 13.8 },
  NIAS: { lng: -83.764907, lat: 12.0131543, zoom: 12.5 },
  NIRI: { lng: -85.8287394, lat: 11.4389392, zoom: 13.5 },
  NIMS: { lng: -86.0960547, lat: 11.9736474, zoom: 13.5 },
  NIGR: { lng: -85.9535387, lat: 11.930367, zoom: 13.5 },
  NIMN: { lng: -86.273725, lat: 12.1547116, zoom: 12.5 },
  NIMT: { lng: -85.9184454, lat: 12.9283899, zoom: 13.5 },
  NICO: { lng: -85.365208, lat: 12.1060911, zoom: 13.5 },
};

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

  const initialCenter = useMemo(() => {
    const coords = municipioId ? municipioCoordinates[municipioId] : undefined;
    return coords ? [coords.lng, coords.lat] as [number, number] : [lng, lat] as [number, number];
  }, [municipioId, lng, lat]);

  const initialZoom = useMemo(() => {
    const coords = municipioId ? municipioCoordinates[municipioId] : undefined;
    return coords ? coords.zoom : zoom;
  }, [municipioId, zoom]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // 1. Inicializamos el mapa de forma ultra ligera
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      // Usamos un estilo base claro (puedes cambiarlo por tu estilo de MapTiler/Mapbox)
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: initialCenter,
      zoom: initialZoom,
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

  }, [initialCenter, initialZoom]);

  useEffect(() => {
    if (!map.current || !municipioId) return;
    const coords = municipioCoordinates[municipioId];
    if (!coords) return;

    map.current.flyTo({
      center: [coords.lng, coords.lat],
      zoom: coords.zoom,
      essential: true,
      speed: 1.2,
      curve: 1.4,
    });
  }, [municipioId]);

  return (
    <div className="relative w-full h-[600px] rounded-[2rem] overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.14)] border border-white/70 bg-white/70 backdrop-blur-sm">
      
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