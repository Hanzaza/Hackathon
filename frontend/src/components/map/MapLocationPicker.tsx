'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Navigation, Compass, Layers, CheckCircle2, RotateCcw } from 'lucide-react';

export interface MapLocationPickerProps {
  lat: number | string;
  lng: number | string;
  onChange: (lat: number, lng: number) => void;
  defaultCityName?: string;
  height?: string;
  label?: string;
}

const CITY_PRESETS: { name: string; lat: number; lng: number; zoom: number }[] = [
  { name: 'León', lat: 12.4348568, lng: -86.8788302, zoom: 14.5 },
  { name: 'Managua', lat: 12.1547116, lng: -86.273725, zoom: 13.5 },
  { name: 'Granada', lat: 11.930367, lng: -85.9535387, zoom: 14.5 },
  { name: 'Masaya', lat: 11.9736474, lng: -86.0960547, zoom: 14.5 },
  { name: 'Matagalpa', lat: 12.9283899, lng: -85.9184454, zoom: 14.5 },
  { name: 'Estelí', lat: 13.0886561, lng: -86.3571217, zoom: 14.5 },
  { name: 'Juigalpa', lat: 12.1060911, lng: -85.365208, zoom: 14.5 },
  { name: 'Bluefields', lat: 12.0076935, lng: -83.7661559, zoom: 14.5 },
  { name: 'Nagarote', lat: 12.2662057, lng: -86.5647029, zoom: 14.5 },
  { name: 'San Juan de Oriente', lat: 11.9056345, lng: -86.0754845, zoom: 15.0 },
];

export function MapLocationPicker({
  lat,
  lng,
  onChange,
  defaultCityName,
  height = '240px',
  label = 'Seleccionar Ubicación Exacta con Pin',
}: MapLocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  const parsedLat = typeof lat === 'number' ? lat : parseFloat(lat) || 12.4350;
  const parsedLng = typeof lng === 'number' ? lng : parseFloat(lng) || -86.8782;

  const [currentLat, setCurrentLat] = useState<number>(parsedLat);
  const [currentLng, setCurrentLng] = useState<number>(parsedLng);
  const [isLocating, setIsLocating] = useState(false);

  // Sync internal state when external props change
  useEffect(() => {
    const numLat = typeof lat === 'number' ? lat : parseFloat(lat);
    const numLng = typeof lng === 'number' ? lng : parseFloat(lng);
    if (!isNaN(numLat) && !isNaN(numLng)) {
      setCurrentLat(numLat);
      setCurrentLng(numLng);
      if (marker.current) {
        marker.current.setLngLat([numLng, numLat]);
      }
    }
  }, [lat, lng]);

  const updateCoordinates = useCallback((newLat: number, newLng: number, fly = false) => {
    // Redondear a 6 decimales para alta precisión (~10cm)
    const roundedLat = parseFloat(newLat.toFixed(6));
    const roundedLng = parseFloat(newLng.toFixed(6));
    setCurrentLat(roundedLat);
    setCurrentLng(roundedLng);
    onChange(roundedLat, roundedLng);

    if (marker.current) {
      marker.current.setLngLat([roundedLng, roundedLat]);
    }

    if (fly && map.current) {
      map.current.flyTo({
        center: [roundedLng, roundedLat],
        zoom: Math.max(map.current.getZoom(), 15),
        essential: true,
      });
    }
  }, [onChange]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Buscar si hay una ciudad por defecto coincidente
    let initLat = parsedLat;
    let initLng = parsedLng;
    let initZoom = 14.5;

    if (defaultCityName && (!lat || !lng)) {
      const match = CITY_PRESETS.find(
        (c) => c.name.toLowerCase().includes(defaultCityName.toLowerCase()) || defaultCityName.toLowerCase().includes(c.name.toLowerCase())
      );
      if (match) {
        initLat = match.lat;
        initLng = match.lng;
        initZoom = match.zoom;
      }
    }

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [initLng, initLat],
      zoom: initZoom,
      attributionControl: false,
    });

    // Añadir controles de navegación
    mapInstance.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

    // Crear el elemento visual del Pin interactivo
    const pinEl = document.createElement('div');
    pinEl.className = 'cursor-grab active:cursor-grabbing group select-none relative';
    pinEl.innerHTML = `
      <div class="relative flex flex-col items-center">
        <span class="absolute -top-1 w-6 h-6 rounded-full bg-emerald-500/30 animate-ping"></span>
        <div class="w-10 h-10 rounded-2xl bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white transform -translate-y-1/2 hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <div class="w-2.5 h-2.5 bg-emerald-700 rotate-45 border-r border-b border-white -mt-2"></div>
      </div>
    `;

    // Crear marcador arrastrable
    const markerInstance = new maplibregl.Marker({
      element: pinEl,
      draggable: true,
      anchor: 'bottom',
    })
      .setLngLat([initLng, initLat])
      .addTo(mapInstance);

    markerInstance.on('dragend', () => {
      const lngLat = markerInstance.getLngLat();
      updateCoordinates(lngLat.lat, lngLat.lng);
    });

    // Clic en el mapa para mover el pin directamente
    mapInstance.on('click', (e) => {
      updateCoordinates(e.lngLat.lat, e.lngLat.lng);
    });

    map.current = mapInstance;
    marker.current = markerInstance;

    // Asegurar redimensionamiento correcto si está en un modal
    const timer = setTimeout(() => {
      mapInstance.resize();
    }, 250);

    return () => {
      clearTimeout(timer);
      mapInstance.remove();
      map.current = null;
      marker.current = null;
    };
  }, [defaultCityName, parsedLat, parsedLng, updateCoordinates]);

  // Manejar geolocalización del navegador
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        updateCoordinates(position.coords.latitude, position.coords.longitude, true);
      },
      (error) => {
        setIsLocating(false);
        console.error('Error de geolocalización:', error);
        alert('No se pudo obtener la ubicación actual. Permite el acceso a ubicación en tu navegador.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSelectCityPreset = (cityLat: number, cityLng: number, zoom: number) => {
    updateCoordinates(cityLat, cityLng);
    if (map.current) {
      map.current.flyTo({
        center: [cityLng, cityLat],
        zoom: zoom,
        essential: true,
      });
    }
  };

  return (
    <div className="space-y-2">
      {/* Cabecera / Info de coordenadas */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>{label}</span>
        </label>

        {/* Badge de coordenadas actuales */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Lat: {currentLat.toFixed(5)}</span>
          <span className="text-emerald-300">|</span>
          <span>Lng: {currentLng.toFixed(5)}</span>
        </div>
      </div>

      {/* Selector Rápido de Ciudades */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
        <span className="text-slate-400 font-bold shrink-0 text-[9px] uppercase tracking-wider">Centrar en:</span>
        {CITY_PRESETS.map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={() => handleSelectCityPreset(city.lat, city.lng, city.zoom)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-900 border border-slate-200 text-slate-700 font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95"
          >
            {city.name}
          </button>
        ))}

        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="ml-auto px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1 active:scale-95"
          title="Usar mi ubicación GPS"
        >
          <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Ubicando...' : 'Mi GPS'}</span>
        </button>
      </div>

      {/* Contenedor del Mapa Interactivo */}
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner bg-slate-100 group">
        <div ref={mapContainer} style={{ width: '100%', height }} className="w-full h-full min-h-[200px]" />

        {/* Guía visual inferior */}
        <div className="absolute bottom-2 left-2 right-2 pointer-events-none z-10">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium text-center shadow-lg border border-white/10 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Hacé <strong>clic en el mapa</strong> o <strong>arrastrá el pin verde</strong> para fijar la ubicación exacta.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
