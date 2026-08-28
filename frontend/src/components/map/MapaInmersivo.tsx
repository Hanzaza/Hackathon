"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ExternalLink,
  Compass,
  Layers,
  Navigation,
  ChevronUp,
  ChevronDown,
  Route,
} from 'lucide-react';

interface PointOfInterest {
  id: string;
  name: string;
  category: string;
  desc: string;
  image?: string;
  walkTime: string;
  rating: string;
  lng: number;
  lat: number;
  highlight: string;
}

interface MapaInmersivoProps {
  municipioId?: string;
  circuitoId?: string;
  lng?: number;
  lat?: number;
  zoom?: number;
  onBack: () => void;
}

const CIRCUIT_POINTS: Record<string, PointOfInterest[]> = {
  dariano: [
    {
      id: 'catedral',
      name: "Catedral de la Asunción",
      category: "Patrimonio UNESCO",
      desc: "Tumba del poeta Rubén Darío, la catedral más grande de Centroamérica y obra cumbre del barroco colonial.",
      image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=60",
      walkTime: "Punto de inicio",
      rating: "4.9 ★",
      lng: -86.8782,
      lat: 12.4350,
      highlight: "Tumba del León de las Letras",
    },
    {
      id: 'museo-dario',
      name: "Museo Archivo Rubén Darío",
      category: "Museo Literario",
      desc: "Casa solariega colonial donde vivió su infancia el insigne poeta. Conserva manuscritos, muebles de época y su biblioteca.",
      image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=500&auto=format&fit=crop&q=60",
      walkTime: "4 min a pie (300m)",
      rating: "4.8 ★",
      lng: -86.8798,
      lat: 12.4339,
      highlight: "Manuscritos originales",
    },
    {
      id: 'teatro-mena',
      name: "Teatro Municipal José de la Cruz Mena",
      category: "Artes Escénicas",
      desc: "Joya neoclásica inaugurada en 1885, escenario de los homenajes y recitales que marcaron la lírica nacional.",
      image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500&auto=format&fit=crop&q=60",
      walkTime: "3 min a pie (250m)",
      rating: "4.7 ★",
      lng: -86.8795,
      lat: 12.4361,
      highlight: "Arquitectura Neoclásica",
    },
    {
      id: 'parque-central',
      name: "Parque Central Juan José Quezada",
      category: "Espacio Público",
      desc: "Plaza mayor histórica, rodeada de cafés tradicionales, palacio municipal y murales del movimiento intelectual leonés.",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=60",
      walkTime: "2 min a pie (150m)",
      rating: "4.8 ★",
      lng: -86.8789,
      lat: 12.4352,
      highlight: "Corazón urbano de León",
    },
  ],
  'managua-patrimonial': [
    {
      id: 'teatro-ruben-dario',
      name: "Teatro Nacional Rubén Darío",
      category: "Artes Escénicas",
      desc: "El templo cultural más prestigioso de Nicaragua, reconocido por su acústica impecable y arquitectura moderna frente al lago.",
      image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500&auto=format&fit=crop&q=60",
      walkTime: "Punto de inicio",
      rating: "4.9 ★",
      lng: -86.2730,
      lat: 12.1557,
      highlight: "Patrimonio Cultural y Acústica",
    },
    {
      id: 'palacio-cultura',
      name: "Palacio Nacional de la Cultura",
      category: "Museo e Historia",
      desc: "Monumento de estilo neoclásico que alberga el Museo Nacional de Nicaragua, salas de arte precolombino y la Hemeroteca.",
      image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=60",
      walkTime: "3 min a pie (200m)",
      rating: "4.8 ★",
      lng: -86.2725,
      lat: 12.1540,
      highlight: "Colección arqueológica precolombina",
    },
    {
      id: 'plaza-revolucion',
      name: "Plaza de la Revolución y Antigua Catedral",
      category: "Patrimonio Histórico",
      desc: "Epicentro de la historia contemporánea de Nicaragua y las ruinas emblemáticas de la Catedral de Santiago de Managua.",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=60",
      walkTime: "2 min a pie (150m)",
      rating: "4.7 ★",
      lng: -86.2718,
      lat: 12.1544,
      highlight: "Símbolo de la historia capitalina",
    },
    {
      id: 'puerto-salvador-allende',
      name: "Puerto Salvador Allende y Paseo Xolotlán",
      category: "Paseo Turístico y Gastronomía",
      desc: "Ribera turística del Lago de Managua con réplicas a escala de la vieja Managua, restaurantes y paseos en embarcación.",
      image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=500&auto=format&fit=crop&q=60",
      walkTime: "6 min a pie (450m)",
      rating: "4.8 ★",
      lng: -86.2760,
      lat: 12.1585,
      highlight: "Vista panorámica del Lago Xolotlán",
    },
  ],
};

const MAP_STYLES = [
  { id: 'positron', name: 'Exploración', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
  { id: 'dark', name: 'Noche 3D', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
  { id: 'voyager', name: 'Relieve', url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' },
];

const municipioCoordinates: Record<string, { lng: number; lat: number; zoom: number; name: string; slug: string; subtitle: string }> = {
  leon: { 
    lng: -86.8788302, 
    lat: 12.4348568, 
    zoom: 16.2, 
    name: 'León', 
    slug: 'leon',
    subtitle: 'Ciudad del Aprendizaje y Literatura' 
  },
  nagarote: { 
    lng: -86.6153, 
    lat: 12.2659, 
    zoom: 15.5, 
    name: 'Nagarote', 
    slug: 'nagarote',
    subtitle: 'Municipio Azul y Gastronomía Creativa' 
  },
  NILE: { 
    lng: -86.8788302, 
    lat: 12.4348568, 
    zoom: 16.2, 
    name: 'León', 
    slug: 'leon',
    subtitle: 'Ciudad del Aprendizaje y Literatura' 
  },
  NIES: { 
    lng: -86.3561571, 
    lat: 13.0929621, 
    zoom: 14.2, 
    name: 'Estelí', 
    slug: 'esteli',
    subtitle: 'Ciudad del Muralismo y Música' 
  },
  NIAS: { 
    lng: -83.764907, 
    lat: 12.0131543, 
    zoom: 13.0, 
    name: 'Bluefields', 
    slug: 'bluefields',
    subtitle: 'Ciudad de Música y Tradición Caribeña' 
  },
  NIRI: { 
    lng: -85.8287394, 
    lat: 11.4389392, 
    zoom: 13.8, 
    name: 'Rivas', 
    slug: 'rivas',
    subtitle: 'Ciudad de Naturaleza y Creatividad' 
  },
  NIMS: { 
    lng: -86.0960547, 
    lat: 11.9736474, 
    zoom: 14.0, 
    name: 'Masaya', 
    slug: 'masaya',
    subtitle: 'Capital del Folclore y Artesanía' 
  },
  NIGR: { 
    lng: -85.9535387, 
    lat: 11.930367, 
    zoom: 14.0, 
    name: 'Granada', 
    slug: 'granada',
    subtitle: 'Ciudad del Diseño y Arquitectura Colonial' 
  },
  NIMN: { 
    lng: -86.273725, 
    lat: 12.1547116, 
    zoom: 13.0, 
    name: 'Managua', 
    slug: 'managua',
    subtitle: 'Capital Creativa e Innovación' 
  },
  NIMT: { 
    lng: -85.9184454, 
    lat: 12.9283899, 
    zoom: 14.0, 
    name: 'Matagalpa', 
    slug: 'matagalpa',
    subtitle: 'Perla del Septentrión y Tradición' 
  },
  NICO: { 
    lng: -85.365208, 
    lat: 12.1060911, 
    zoom: 14.0, 
    name: 'Juigalpa', 
    slug: 'juigalpa',
    subtitle: 'Ciudad de Historia y Tradición Ganadera' 
  },
};

export default function MapaInmersivo({ 
  municipioId = 'leon', 
  circuitoId = 'dariano',
  lng = -86.8782, 
  lat = 12.4350,
  zoom = 16.2, 
  onBack 
}: MapaInmersivoProps) {
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Estados estilo Apple Maps
  const [is3D, setIs3D] = useState(true);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(0);
  const [sheetExpanded, setSheetExpanded] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [currentStyleIdx, setCurrentStyleIdx] = useState<number>(0);
  const [showStyleMenu, setShowStyleMenu] = useState<boolean>(false);

  const cityData = useMemo(() => {
    return municipioCoordinates[municipioId] || municipioCoordinates.leon;
  }, [municipioId]);

  const rawPoints = useMemo(() => {
    return circuitoId && CIRCUIT_POINTS[circuitoId] ? CIRCUIT_POINTS[circuitoId] : (CIRCUIT_POINTS.dariano || []);
  }, [circuitoId]);

  const filteredPoints = useMemo(() => {
    if (activeCategory === 'todos') return rawPoints;
    return rawPoints.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()));
  }, [rawPoints, activeCategory]);

  const selectedPoint = filteredPoints[selectedPointIndex] || filteredPoints[0] || rawPoints[0];

  const initialCenter = useMemo(() => {
    if (selectedPoint) return [selectedPoint.lng, selectedPoint.lat] as [number, number];
    if (lng && lat) return [lng, lat] as [number, number];
    return [cityData.lng, cityData.lat] as [number, number];
  }, [selectedPoint, cityData, lng, lat]);

  // Enfocar en un punto específico con cámara suave
  const focusOnPoint = (index: number) => {
    const point = rawPoints[index];
    if (!point || !map.current) return;

    setSelectedPointIndex(index);

    map.current.flyTo({
      center: [point.lng, point.lat],
      zoom: 17.2,
      pitch: is3D ? 60 : 0,
      bearing: -20 + index * 10,
      speed: 1.1,
      curve: 1.3,
      essential: true,
    });
  };

  // Función para renderizar los marcadores Apple Maps
  const renderMarkers = () => {
    if (!map.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    rawPoints.forEach((point, idx) => {
      const isSelected = selectedPoint?.id === point.id;

      // Elemento HTML de Marcador Apple Maps
      const el = document.createElement('div');
      el.className = `group relative cursor-pointer flex items-center justify-center transition-all duration-300 ${
        isSelected ? 'scale-125 z-30' : 'scale-100 z-10 hover:scale-115'
      }`;

      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          ${
            isSelected
              ? '<span class="absolute -inset-2 rounded-full bg-purple-500/40 animate-ping"></span>'
              : ''
          }
          <div class="h-9 w-9 rounded-2xl ${
            isSelected
              ? 'bg-gradient-to-tr from-purple-700 to-indigo-500 text-white ring-4 ring-white shadow-2xl'
              : 'bg-white text-slate-800 ring-2 ring-slate-900/20 shadow-lg'
          } flex items-center justify-center font-black text-xs transition-transform duration-200">
            <span>${idx + 1}</span>
          </div>
          <div class="absolute -bottom-1.5 h-2 w-2 rotate-45 ${
            isSelected ? 'bg-indigo-500 ring-2 ring-white' : 'bg-white ring-1 ring-slate-900/10'
          }"></div>
        </div>
      `;

      el.addEventListener('click', () => {
        focusOnPoint(idx);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([point.lng, point.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  };

  // Inicializar MapLibre
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[currentStyleIdx].url,
      center: initialCenter,
      zoom: zoom,
      pitch: is3D ? 60 : 0,
      bearing: -18,
      attributionControl: false,
    });

    // Control de brújula compacto
    map.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: false,
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      renderMarkers();
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render markers cuando cambia el punto seleccionado o la lista
  useEffect(() => {
    if (map.current?.isStyleLoaded()) {
      renderMarkers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPoint, rawPoints]);

  // Alternar vista 3D / 2D
  const toggle3D = () => {
    if (!map.current) return;
    const next3D = !is3D;
    setIs3D(next3D);
    map.current.easeTo({
      pitch: next3D ? 60 : 0,
      bearing: next3D ? -18 : 0,
      duration: 800,
    });
  };

  // Recentrar en la ciudad completa
  const recenterMap = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: [cityData.lng, cityData.lat],
      zoom: cityData.zoom,
      pitch: is3D ? 55 : 0,
      bearing: -15,
      speed: 1.2,
      essential: true,
    });
  };

  // Cambiar estilo de mapa (Capas)
  const changeMapStyle = (idx: number) => {
    if (!map.current) return;
    setCurrentStyleIdx(idx);
    setShowStyleMenu(false);
    map.current.setStyle(MAP_STYLES[idx].url);
    map.current.once('style.load', () => {
      renderMarkers();
    });
  };

  return (
    <div className="relative w-full h-full min-h-[580px] sm:min-h-[680px] lg:min-h-[820px] rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-200/90 bg-white select-none">
      
      {/* ================= MAP CANVAS ================= */}
      <div ref={mapContainer} className="w-full h-full min-h-[580px] sm:min-h-[680px] lg:min-h-[820px] bg-slate-100" />

      {/* ================= CONTROLES SUPERIORES FLOTANTES ESTILO APPLE MAPS ================= */}
      
      {/* 1. Botón "Atrás" estilo Cupertino */}
      <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 z-20">
        <button 
          type="button"
          onClick={onBack}
          className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-white/90 backdrop-blur-xl text-slate-800 font-bold text-xs shadow-md border border-slate-200/90 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
          aria-label="Volver"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
          <span className="hidden xs:inline">{cityData.name}</span>
          <span className="xs:hidden">Volver</span>
        </button>
      </div>

      {/* 2. Dynamic Island / Píldora Central de Circuito Activo */}
      <div className="absolute top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 z-20 max-w-[170px] xs:max-w-xs sm:max-w-md pointer-events-none">
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200/90 text-slate-800 shadow-md truncate">
          <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse shrink-0" />
          <p className="text-[10px] sm:text-xs font-bold text-slate-900 truncate">
            {circuitoId === 'dariano' ? 'Ruta Dariana' : 'Circuito Creativo'}
          </p>
          <span className="text-[10px] text-purple-700 font-semibold hidden sm:inline">
            • {rawPoints.length} Puntos
          </span>
        </div>
      </div>

      {/* 3. Columna de Botones de Acción Rápida (Derecha - Apple Style) */}
      <div className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-3.5 z-20 flex flex-col gap-1.5 sm:gap-2">
        {/* Toggle 3D / 2D */}
        <button
          type="button"
          onClick={toggle3D}
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 backdrop-blur-xl text-slate-800 font-black text-[11px] shadow-md border border-slate-200/90 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Alternar vista 3D/2D"
        >
          <span className={is3D ? 'text-purple-600' : 'text-slate-500'}>
            {is3D ? '3D' : '2D'}
          </span>
        </button>

        {/* Recentrar / Brújula */}
        <button
          type="button"
          onClick={recenterMap}
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 backdrop-blur-xl text-slate-800 shadow-md border border-slate-200/90 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Recentrar mapa"
        >
          <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
        </button>

        {/* Cambiar Capa / Estilo */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowStyleMenu(!showStyleMenu)}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 backdrop-blur-xl text-slate-800 shadow-md border border-slate-200/90 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Capas del mapa"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
          </button>

          {/* Menú flotante de capas */}
          {showStyleMenu && (
            <div className="absolute right-0 top-11 sm:top-12 w-36 rounded-2xl bg-white/95 backdrop-blur-2xl p-1.5 shadow-xl border border-slate-200 flex flex-col gap-1 z-30 animate-fadeIn">
              {MAP_STYLES.map((style, idx) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => changeMapStyle(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentStyleIdx === idx
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= FILTRO DE CATEGORÍAS FLOTANTE ================= */}
      <div className="absolute top-13 sm:top-16 left-2.5 sm:left-3.5 right-14 sm:right-3.5 z-10 flex items-center gap-1.5 py-1 overflow-hidden pointer-events-auto">
        <button
          type="button"
          onClick={() => setActiveCategory('todos')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
            activeCategory === 'todos'
              ? 'bg-purple-600 text-white border border-purple-600 shadow-md'
              : 'bg-white/90 text-slate-700 border border-slate-200/90 hover:bg-white'
          }`}
        >
          🏛️ Todos ({rawPoints.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('patrimonio')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
            activeCategory === 'patrimonio'
              ? 'bg-purple-600 text-white border border-purple-600 shadow-md'
              : 'bg-white/90 text-slate-700 border border-slate-200/90 hover:bg-white'
          }`}
        >
          ⛪ Patrimonio
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('museo')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
            activeCategory === 'museo'
              ? 'bg-purple-600 text-white border border-purple-600 shadow-md'
              : 'bg-white/90 text-slate-700 border border-slate-200/90 hover:bg-white'
          }`}
        >
          📜 Museos
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('artes')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
            activeCategory === 'artes'
              ? 'bg-purple-600 text-white border border-purple-600 shadow-md'
              : 'bg-white/90 text-slate-700 border border-slate-200/90 hover:bg-white'
          }`}
        >
          🎭 Artes
        </button>
      </div>

      {/* ================= BOTTOM SHEET FLOTANTE ESTILO APPLE MAPS ================= */}
      <div 
        className={`absolute inset-x-2 sm:inset-x-4 lg:inset-x-auto lg:right-6 bottom-2 sm:bottom-4 lg:max-w-md z-30 transition-all duration-500 ease-in-out ${
          sheetExpanded ? 'max-h-[80%]' : 'max-h-[220px] sm:max-h-[250px]'
        }`}
      >
        <div className="w-full rounded-[2rem] bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-3.5 sm:p-5 flex flex-col justify-between text-slate-800">
          
          {/* Grabber Bar / Tirador de arrastre táctil */}
          <button
            type="button"
            onClick={() => setSheetExpanded(!sheetExpanded)}
            className="w-full flex flex-col items-center justify-center -mt-1 mb-2 cursor-pointer group"
            aria-label="Expandir o contraer tarjeta de detalles"
          >
            <div className="w-10 h-1 bg-slate-300 rounded-full group-hover:bg-purple-500 transition-colors" />
          </button>

          {/* Información del Punto Seleccionado */}
          {selectedPoint && (
            <div className="flex items-start gap-3 sm:gap-4 mb-2.5">
              {/* Thumbnail del sitio */}
              {selectedPoint.image && (
                <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm border border-slate-200">
                  <Image
                    src={selectedPoint.image}
                    alt={selectedPoint.name}
                    fill
                    sizes="(max-width: 640px) 56px, 80px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/70 text-[9px] font-black text-white z-10">
                    {selectedPointIndex + 1}/{rawPoints.length}
                  </span>
                </div>
              )}

              {/* Textos y Etiquetas */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide">
                    {selectedPoint.category}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-amber-600">
                    {selectedPoint.rating}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden xs:inline">
                    • {selectedPoint.walkTime}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-black text-slate-900 truncate leading-tight">
                  {selectedPoint.name}
                </h3>
                
                <p className="text-[10px] sm:text-xs text-slate-600 line-clamp-2 mt-0.5 font-normal">
                  {selectedPoint.desc}
                </p>
              </div>
            </div>
          )}

          {/* Controles y Botones de Acción Estilo Apple Maps */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-slate-100">
            {/* Botón 1: Explorar Punto en Mapa */}
            <button
              type="button"
              onClick={() => focusOnPoint(selectedPointIndex)}
              className="inline-flex items-center justify-center gap-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] sm:text-xs shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Enfocar</span>
            </button>

            {/* Botón 2: Siguiente Punto del Circuito */}
            <button
              type="button"
              onClick={() => {
                const nextIdx = (selectedPointIndex + 1) % rawPoints.length;
                focusOnPoint(nextIdx);
              }}
              className="inline-flex items-center justify-center gap-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold text-[11px] sm:text-xs transition-all active:scale-98 cursor-pointer border border-slate-200"
            >
              <Route className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="truncate">Siguiente</span>
            </button>

            {/* Botón 3: Ver Lista Completa de Paradas */}
            <button
              type="button"
              onClick={() => setSheetExpanded(!sheetExpanded)}
              className="inline-flex items-center justify-center gap-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold text-[11px] sm:text-xs transition-all active:scale-98 cursor-pointer border border-slate-200"
            >
              {sheetExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              <span className="truncate">{sheetExpanded ? 'Cerrar' : 'Paradas'}</span>
            </button>
          </div>

          {/* Botón Destacado Principal: Aprender más de la Ciudad */}
          <Link
            href={`/ciudades-creativas/${cityData.slug}`}
            className="w-full mt-2 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>Aprender más sobre {cityData.name}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* ================= CONTENIDO EXPANDIDO: LISTA DE PARADAS ================= */}
          {sheetExpanded && (
            <div className="mt-4 pt-3 border-t border-slate-200 max-h-56 overflow-y-auto pr-1 flex flex-col gap-2 animate-fadeIn">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                Todas las paradas de la Ruta Dariana
              </p>
              {rawPoints.map((point, idx) => (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => {
                    focusOnPoint(idx);
                  }}
                  className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    selectedPointIndex === idx
                      ? 'bg-purple-50 border border-purple-300'
                      : 'hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      selectedPointIndex === idx ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {point.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">
                        {point.category} • {point.walkTime}
                      </p>
                    </div>
                  </div>
                  <span className="text-purple-700 font-bold text-xs shrink-0 ml-2">
                    {selectedPointIndex === idx ? 'Viendo 📍' : 'Ir →'}
                  </span>
                </button>
              ))}

              <div className="pt-2">
                <Link
                  href={`/ciudades-creativas/${cityData.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Abrir Guía Turística Completa de {cityData.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}