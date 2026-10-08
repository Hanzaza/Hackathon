"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
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
  Sparkles,
  MapPin,
  Star,
  Image as ImageIcon,
  MessageSquare,
  Send,
  CheckCircle2,
  User,
  Camera,
  ZoomIn,
  X,
  Globe,
  Award,
  Upload,
  Check,
  PartyPopper,
  Sparkle,
  Construction,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { routeProgressService, RouteProgressData, PlaceProgress } from '@/services/routeProgressService';
import { AchievementItem } from '@/services/adminService';

export interface PointOfInterest {
  id: string;
  name: string;
  category: string;
  desc: string;
  image?: string;
  gallery?: string[];
  walkTime?: string;
  rating?: string;
  address?: string;
  lng: number;
  lat: number;
  highlight?: string;
  audioGuideUrl?: string;
  vr360Url?: string;
  pointsReward?: number;
  cityName?: string;
  citySlug?: string;
  routeName?: string;
  routeSlug?: string;
  routeId?: string;
  municipalityId?: string;
  isPrimaryRoutePoint?: boolean;
}

export interface MapaInmersivoProps {
  municipioId?: string;
  circuitoId?: string;
  lng?: number;
  lat?: number;
  zoom?: number;
  onBack: () => void;
}



const MAP_STYLES = [
  { id: 'positron', name: 'Exploración', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
  { id: 'voyager', name: 'Relieve', url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' },
  { id: 'dark', name: 'Noche', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
];

const MUNICIPIO_COORDINATES: Record<string, { lng: number; lat: number; zoom: number; name: string; slug: string; subtitle: string }> = {
  leon: { 
    lng: -86.8788302, 
    lat: 12.4348568, 
    zoom: 16.2, 
    name: 'León', 
    slug: 'leon',
    subtitle: 'Ciudad del Aprendizaje y Literatura' 
  },
  nagarote: { 
    lng: -86.5647029, 
    lat: 12.2662057, 
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
  managua: { 
    lng: -86.273725, 
    lat: 12.1547116, 
    zoom: 14.5, 
    name: 'Managua', 
    slug: 'managua',
    subtitle: 'Capital Creativa e Innovación' 
  },
  NIMN: { 
    lng: -86.273725, 
    lat: 12.1547116, 
    zoom: 14.5, 
    name: 'Managua', 
    slug: 'managua',
    subtitle: 'Capital Creativa e Innovación' 
  },
  granada: { 
    lng: -85.9535387, 
    lat: 11.930367, 
    zoom: 15.2, 
    name: 'Granada', 
    slug: 'granada',
    subtitle: 'Ciudad del Diseño y Arquitectura Colonial' 
  },
  NIGR: { 
    lng: -85.9535387, 
    lat: 11.930367, 
    zoom: 15.2, 
    name: 'Granada', 
    slug: 'granada',
    subtitle: 'Ciudad del Diseño y Arquitectura Colonial' 
  },
  masaya: { 
    lng: -86.0960547, 
    lat: 11.9736474, 
    zoom: 15.2, 
    name: 'Masaya', 
    slug: 'masaya',
    subtitle: 'Capital del Folclore y Artesanía' 
  },
  NIMS: { 
    lng: -86.0960547, 
    lat: 11.9736474, 
    zoom: 15.2, 
    name: 'Masaya', 
    slug: 'masaya',
    subtitle: 'Capital del Folclore y Artesanía' 
  },
  'san-juan-de-oriente': {
    lng: -86.0754845,
    lat: 11.9056345,
    zoom: 15.5,
    name: 'San Juan de Oriente',
    slug: 'san-juan-de-oriente',
    subtitle: 'Cuna del Arte Precolombino y Barro'
  },
  esteli: { 
    lng: -86.3561571, 
    lat: 13.0929621, 
    zoom: 15.0, 
    name: 'Estelí', 
    slug: 'esteli',
    subtitle: 'Ciudad del Muralismo y Música' 
  },
  NIES: { 
    lng: -86.3561571, 
    lat: 13.0929621, 
    zoom: 15.0, 
    name: 'Estelí', 
    slug: 'esteli',
    subtitle: 'Ciudad del Muralismo y Música' 
  },
  matagalpa: { 
    lng: -85.9184454, 
    lat: 12.9283899, 
    zoom: 15.0, 
    name: 'Matagalpa', 
    slug: 'matagalpa',
    subtitle: 'Perla del Septentrión y Tradición' 
  },
  NIMT: { 
    lng: -85.9184454, 
    lat: 12.9283899, 
    zoom: 15.0, 
    name: 'Matagalpa', 
    slug: 'matagalpa',
    subtitle: 'Perla del Septentrión y Tradición' 
  },
  juigalpa: { 
    lng: -85.365208, 
    lat: 12.1060911, 
    zoom: 15.0, 
    name: 'Juigalpa', 
    slug: 'juigalpa',
    subtitle: 'Ciudad de Historia y Tradición Ganadera' 
  },
  NICO: { 
    lng: -85.365208, 
    lat: 12.1060911, 
    zoom: 15.0, 
    name: 'Juigalpa', 
    slug: 'juigalpa',
    subtitle: 'Ciudad de Historia y Tradición Ganadera' 
  },
  bluefields: { 
    lng: -83.764907, 
    lat: 12.0131543, 
    zoom: 14.0, 
    name: 'Bluefields', 
    slug: 'bluefields',
    subtitle: 'Ciudad de Música y Tradición Caribeña' 
  },
  NIAS: { 
    lng: -83.764907, 
    lat: 12.0131543, 
    zoom: 14.0, 
    name: 'Bluefields', 
    slug: 'bluefields',
    subtitle: 'Ciudad de Música y Tradición Caribeña' 
  },
  rivas: { 
    lng: -85.8287394, 
    lat: 11.4389392, 
    zoom: 14.0, 
    name: 'Rivas', 
    slug: 'rivas',
    subtitle: 'Ciudad de Naturaleza y Creatividad' 
  },
  NIRI: { 
    lng: -85.8287394, 
    lat: 11.4389392, 
    zoom: 14.0, 
    name: 'Rivas', 
    slug: 'rivas',
    subtitle: 'Ciudad de Naturaleza y Creatividad' 
  },
};

export default function MapaInmersivo({ 
  municipioId = 'leon', 
  circuitoId,
  lng, 
  lat,
  zoom, 
  onBack 
}: MapaInmersivoProps) {
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [is3D, setIs3D] = useState(true);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(0);
  const [sheetExpanded, setSheetExpanded] = useState<boolean>(false);
  const [expandedTab, setExpandedTab] = useState<'photos' | 'reviews' | 'stops'>('photos');
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [currentStyleIdx, setCurrentStyleIdx] = useState<number>(0);
  const [showStyleMenu, setShowStyleMenu] = useState<boolean>(false);
  const [mapBearing, setMapBearing] = useState<number>(-15);
  const [livePoints, setLivePoints] = useState<PointOfInterest[]>([]);

  const { user } = useAuth();
  const userId = user?.id || 'anonymous_explorer';
  const userRole = user?.role || 'user';

  // Estados de Reseñas y Puntuación interactiva (Paso 1)
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [hoverReviewRating, setHoverReviewRating] = useState<number | null>(null);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);

  // Estados de Colaboración de Fotos (Paso 2) y Progreso de Ruta
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState<boolean>(false);
  const [showPhotoForm, setShowPhotoForm] = useState<boolean>(false);
  const [progressRefreshTrigger, setProgressRefreshTrigger] = useState<number>(0);
  const [unlockedAchievementModal, setUnlockedAchievementModal] = useState<AchievementItem | null>(null);

  // Almacenamiento local de reseñas con persistencia
  const [placeReviews, setPlaceReviews] = useState<Record<string, Array<{ id: string; name: string; rating: number; comment: string; date: string }>>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nicaragua_place_reviews');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {
      'catedral-de-leon': [
        { id: '1', name: 'Darío M.', rating: 5, comment: 'La arquitectura es sublime y la vista desde la cúpula es inigualable.', date: 'Hace 2 días' },
        { id: '2', name: 'Sofía R.', rating: 5, comment: 'Hito cultural imprescindible de Nicaragua.', date: 'Hace 1 semana' },
      ],
      'museo-archivo-ruben-dario': [
        { id: '3', name: 'Carlos V.', rating: 5, comment: 'Gran colección de manuscritos originales y reliquias del poeta.', date: 'Hace 3 días' },
      ],
    };
  });

  const cityData = useMemo(() => {
    const key = (municipioId || 'leon').toLowerCase();
    return MUNICIPIO_COORDINATES[key] || MUNICIPIO_COORDINATES[municipioId || 'leon'] || MUNICIPIO_COORDINATES.leon;
  }, [municipioId]);

  // Carga en vivo desde Supabase
  useEffect(() => {
    async function loadLivePoints() {
      try {
        const res = await fetch('/api/locations');
        if (res.ok) {
          const geojson = await res.json();
          if (geojson && Array.isArray(geojson.features)) {
            const mapped: PointOfInterest[] = geojson.features.map((f: any) => ({
              id: f.properties.id || f.properties.slug,
              name: f.properties.name,
              category: f.properties.category || 'Patrimonio Cultural',
              desc: f.properties.description || '',
              image: f.properties.image_url || undefined,
              gallery: Array.isArray(f.properties.gallery) && f.properties.gallery.length > 0
                ? f.properties.gallery
                : (f.properties.image_url ? [f.properties.image_url] : []),
              walkTime: f.properties.walk_time || undefined,
              rating: f.properties.rating || undefined,
              address: f.properties.address || undefined,
              lng: f.geometry.coordinates[0],
              lat: f.geometry.coordinates[1],
              highlight: f.properties.is_primary_route_point ? '🌟 Hito Principal' : '📍 Punto de Ciudad',
              audioGuideUrl: f.properties.audio_guide_url || undefined,
              vr360Url: f.properties.vr_360_url || undefined,
              pointsReward: f.properties.points_reward || 0,
              cityName: f.properties.city_name,
              citySlug: f.properties.city_slug,
              routeName: f.properties.route_name,
              routeSlug: f.properties.route_slug,
              routeId: f.properties.route_id,
              municipalityId: f.properties.municipality_id,
              isPrimaryRoutePoint: f.properties.is_primary_route_point ?? true,
            }));

            if (mapped.length > 0) {
              setLivePoints(mapped);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching live points for map:', err);
      }
    }
    loadLivePoints();
  }, [municipioId, circuitoId]);

  // Determinar los puntos específicos de la ruta o de la ciudad
  const rawPoints = useMemo(() => {
    const normMunicipio = (municipioId || '').toLowerCase().trim();
    const normCircuito = (circuitoId || '').toLowerCase().trim();

    // 1. Filtrar puntos en vivo que pertenezcan estrictamente al municipio actual
    const cityMatchingLive = (normMunicipio && normMunicipio !== 'all' && normMunicipio !== 'todos')
      ? livePoints.filter((p) => {
          const matchCitySlug = (p.citySlug && p.citySlug.toLowerCase() === normMunicipio) || 
                                (p.citySlug && p.citySlug.toLowerCase() === cityData.slug.toLowerCase());
          const matchCityName = p.cityName && (
            p.cityName.toLowerCase().includes(normMunicipio) || 
            p.cityName.toLowerCase().includes(cityData.name.toLowerCase()) ||
            normMunicipio.includes(p.cityName.toLowerCase())
          );
          const matchMunId = p.municipalityId && (
            p.municipalityId.toLowerCase() === normMunicipio ||
            p.municipalityId.toLowerCase() === cityData.slug.toLowerCase()
          );
          return matchCitySlug || matchCityName || matchMunId;
        })
      : livePoints;

    // 2. SI SE SELECCIONÓ UN CIRCUITO CREATIVO ESPECÍFICO (ej. 'ruta-natural-circuito-creativo-xolotlan', 'dariano')
    if (normCircuito && normCircuito !== 'all' && normCircuito !== 'todos') {
      const routeMatchingLive = cityMatchingLive.filter((p) => {
        const matchRouteId = p.routeId && p.routeId.toLowerCase() === normCircuito;
        const matchRouteSlug = p.routeSlug && p.routeSlug.toLowerCase() === normCircuito;
        const matchRouteName = p.routeName && (
          p.routeName.toLowerCase().includes(normCircuito) ||
          normCircuito.includes(p.routeName.toLowerCase())
        );
        const isPrimary = p.isPrimaryRoutePoint !== false;
        return (matchRouteId || matchRouteSlug || matchRouteName) && isPrimary;
      });

      if (routeMatchingLive.length > 0) {
        return routeMatchingLive;
      }
    }

    // 3. SI EL USUARIO QUIERE VER TODOS LOS PUNTOS DE LA CIUDAD (o clic en 'Conocer los demás puntos')
    if (cityMatchingLive.length > 0) {
      return cityMatchingLive;
    }

    // 4. Si se especificó una ciudad concreta pero aún no tiene puntos, devolver vacío para evitar mezclar ciudades
    if (normMunicipio && normMunicipio !== 'all' && normMunicipio !== 'todos') {
      return [];
    }

    return livePoints;
  }, [livePoints, cityData, circuitoId, municipioId]);

  const filteredPoints = useMemo(() => {
    if (activeCategory === 'todos') return rawPoints;
    return rawPoints.filter((p) => p.category.toLowerCase().includes(activeCategory.toLowerCase()));
  }, [rawPoints, activeCategory]);

  const selectedPoint = filteredPoints[selectedPointIndex] || filteredPoints[0] || undefined;

  // Reseñas del lugar actual
  const currentReviews = useMemo(() => {
    if (!selectedPoint) return [];
    const placeKey = selectedPoint.id || selectedPoint.name.toLowerCase().replace(/\s+/g, '-');
    return placeReviews[placeKey] || [];
  }, [selectedPoint, placeReviews]);

  // Promedio calculado de calificaciones
  const currentAverageRating = useMemo(() => {
    if (currentReviews.length === 0) return null;
    const sum = currentReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / currentReviews.length).toFixed(1);
  }, [currentReviews]);

  // Galería de fotos del lugar
  const currentPhotos = useMemo(() => {
    if (!selectedPoint) return [];
    const list: string[] = [];
    if (selectedPoint.gallery && selectedPoint.gallery.length > 0) {
      list.push(...selectedPoint.gallery);
    }
    if (selectedPoint.image && !list.includes(selectedPoint.image)) {
      list.unshift(selectedPoint.image);
    }
    return list;
  }, [selectedPoint]);

  // Identificador y Nombre de la Ruta Creativa Activa
  const activeRouteId = useMemo(() => {
    if (selectedPoint?.routeId) return selectedPoint.routeId;
    if (circuitoId && circuitoId !== 'todos' && circuitoId !== 'all') {
      if (circuitoId === 'dariano') return '383a8707-898a-4ffe-9df9-04c3e3bc1184';
      return circuitoId;
    }
    return rawPoints[0]?.routeId || 'circuito-activo';
  }, [selectedPoint, circuitoId, rawPoints]);

  const activeRouteName = useMemo(() => {
    if (selectedPoint?.routeName) return selectedPoint.routeName;
    if (rawPoints[0]?.routeName) return rawPoints[0].routeName;
    if (circuitoId === 'dariano') return 'Circuito Creativo Rubén Darío';
    if (circuitoId === 'sutiabena') return 'Ruta Sutiabeña de León';
    return `${cityData?.name || 'Nicaragua'} • Circuito Creativo`;
  }, [selectedPoint, rawPoints, circuitoId, cityData]);

  // Progreso de la Ruta (evaluando los 2 requisitos por cada parada: 1. Reseña + 2. Foto)
  const routeProgress = useMemo<RouteProgressData>(() => {
    return routeProgressService.getRouteProgress(
      userId,
      activeRouteId,
      rawPoints.map((p) => ({ id: p.id, name: p.name }))
    );
  }, [userId, activeRouteId, rawPoints, progressRefreshTrigger]);

  const currentPlaceProgress = useMemo<PlaceProgress | null>(() => {
    if (!selectedPoint) return null;
    return (
      routeProgress.places[selectedPoint.id] || {
        placeId: selectedPoint.id,
        hasReview: false,
        hasPhoto: false,
        isCompleted: false,
      }
    );
  }, [selectedPoint, routeProgress]);

  // Manejar envío de nueva reseña (Paso 1 del Progreso de Ruta)
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoint || !newReviewComment.trim()) return;

    const placeKey = selectedPoint.id || selectedPoint.name.toLowerCase().replace(/\s+/g, '-');
    const authorName = newReviewAuthor.trim() || user?.name || 'Explorador Cultural';
    const newEntry = {
      id: Date.now().toString(),
      name: authorName,
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: 'Justo ahora',
    };

    setPlaceReviews((prev) => {
      const existing = prev[placeKey] || [];
      const updated = { ...prev, [placeKey]: [newEntry, ...existing] };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('nicaragua_place_reviews', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });

    // Registrar Paso 1 en routeProgressService
    routeProgressService
      .submitPlaceReview({
        userId,
        userRole,
        routeId: activeRouteId,
        placeId: selectedPoint.id,
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        authorName,
        allRoutePlaces: rawPoints.map((p) => ({ id: p.id, name: p.name })),
      })
      .then((res) => {
        setProgressRefreshTrigger((prev) => prev + 1);
        if (res.newlyUnlockedAchievement) {
          setUnlockedAchievementModal(res.newlyUnlockedAchievement);
        }
      });

    setNewReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3500);
  };

  // Manejar colaboración con fotografía (Paso 2 del Progreso de Ruta)
  const handleCollaboratePhoto = (photoUrlToSubmit?: string) => {
    const url = (photoUrlToSubmit || newPhotoUrl).trim();
    if (!selectedPoint || !url) return;

    routeProgressService
      .submitPlacePhoto({
        userId,
        userRole,
        routeId: activeRouteId,
        placeId: selectedPoint.id,
        photoUrl: url,
        allRoutePlaces: rawPoints.map((p) => ({ id: p.id, name: p.name })),
      })
      .then((res) => {
        // Añadir a la galería del punto seleccionado
        if (selectedPoint.gallery) {
          if (!selectedPoint.gallery.includes(url)) {
            selectedPoint.gallery.unshift(url);
          }
        } else {
          selectedPoint.gallery = [url];
        }

        setNewPhotoUrl('');
        setShowPhotoForm(false);
        setPhotoUploadSuccess(true);
        setProgressRefreshTrigger((prev) => prev + 1);
        setTimeout(() => setPhotoUploadSuccess(false), 3500);

        if (res.newlyUnlockedAchievement) {
          setUnlockedAchievementModal(res.newlyUnlockedAchievement);
        }
      });
  };

  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'collaborative_photos');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        handleCollaboratePhoto(data.url);
      } else {
        alert(data.error || 'Error al subir la fotografía a Supabase');
      }
    } catch (err) {
      console.error('Error al subir foto:', err);
      alert('Error de conexión al subir la imagen');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    setSelectedPointIndex(0);
  }, [municipioId, circuitoId]);

  useEffect(() => {
    if (selectedPointIndex >= filteredPoints.length) {
      setSelectedPointIndex(0);
    }
  }, [filteredPoints.length, selectedPointIndex]);

  // Alinear cámara suavemente hacia los puntos de la ciudad/ruta activa
  useEffect(() => {
    if (!map.current || !selectedPoint) return;
    map.current.flyTo({
      center: [selectedPoint.lng, selectedPoint.lat],
      zoom: zoom || cityData?.zoom || 15.5,
      essential: true,
      duration: 1000,
    });
  }, [municipioId, circuitoId, selectedPoint?.id]);

  const initialCenter = useMemo(() => {
    if (selectedPoint) return [selectedPoint.lng, selectedPoint.lat] as [number, number];
    if (cityData?.lng && cityData?.lat) return [cityData.lng, cityData.lat] as [number, number];
    if (lng && lat) return [lng, lat] as [number, number];
    return [-86.8782, 12.4350] as [number, number];
  }, [selectedPoint, cityData, lng, lat]);

  // Enfocar en un punto específico con cámara suave y estable
  const focusOnPoint = useCallback((index: number) => {
    const point = filteredPoints[index] || rawPoints[index];
    if (!point || !map.current) return;

    setSelectedPointIndex(index);

    map.current.flyTo({
      center: [point.lng, point.lat],
      zoom: 17.2,
      pitch: is3D ? 50 : 0,
      speed: 1.1,
      curve: 1.2,
      essential: true,
    });
  }, [filteredPoints, rawPoints, is3D]);

  // Trazar línea de ruta conectora únicamente para circuitos definidos (no para puntos arbitrarios de ciudad)
  const updateRoutePolyline = useCallback(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const normCircuito = (circuitoId || '').toLowerCase();
    const isDedicatedCircuit = normCircuito && normCircuito !== 'all' && normCircuito !== 'todos';

    const coordinates = (isDedicatedCircuit ? filteredPoints : []).map((p) => [p.lng, p.lat]);
    const source = map.current.getSource('route-polyline-source') as maplibregl.GeoJSONSource | undefined;

    const lineData: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates.length >= 2 ? coordinates : [],
      },
    };

    if (source) {
      source.setData(lineData);
    } else if (coordinates.length >= 2) {
      try {
        map.current.addSource('route-polyline-source', {
          type: 'geojson',
          data: lineData,
        });

        map.current.addLayer({
          id: 'route-polyline-glow',
          type: 'line',
          source: 'route-polyline-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#9333ea',
            'line-width': 8,
            'line-opacity': 0.35,
            'line-blur': 3,
          },
        });

        map.current.addLayer({
          id: 'route-polyline-core',
          type: 'line',
          source: 'route-polyline-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#7e22ce',
            'line-width': 3.5,
            'line-dasharray': [2, 1.5],
          },
        });
      } catch (err) {
        console.warn('Polyline note:', err);
      }
    }
  }, [filteredPoints, circuitoId]);

  // Renderizar marcadores fijados con absoluta precisión geográfica (Sin animaciones de deriva ni lag)
  const renderMarkers = useCallback(() => {
    if (!map.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filteredPoints.forEach((point, idx) => {
      const isSelected = selectedPoint?.id === point.id;

      // Elemento HTML de Marcador
      const el = document.createElement('div');
      // NOTA CRÍTICA: NO agregar 'transition-transform' ni 'transition-all' al elemento raíz del Marker,
      // para evitar que interfiera con los cálculos de renderizado por cuadro de MapLibre GL.
      el.className = 'cursor-pointer select-none';
      el.style.pointerEvents = 'auto';

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="h-9 w-9 rounded-2xl ${
            isSelected
              ? 'bg-gradient-to-tr from-purple-700 to-indigo-600 text-white ring-4 ring-white shadow-2xl scale-110'
              : 'bg-white text-slate-900 ring-2 ring-slate-900/25 shadow-lg hover:scale-105'
          } flex items-center justify-center font-black text-xs">
            <span>${idx + 1}</span>
          </div>
          <div class="w-2.5 h-2.5 rotate-45 -mt-1.5 ${
            isSelected 
              ? 'bg-indigo-600 ring-2 ring-white' 
              : 'bg-white ring-1 ring-slate-900/20'
          }"></div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        focusOnPoint(idx);
      });

      // Anclar estrictamente por la punta inferior ('bottom')
      const marker = new maplibregl.Marker({ 
        element: el, 
        anchor: 'bottom',
        offset: [0, 0]
      })
        .setLngLat([point.lng, point.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    updateRoutePolyline();
  }, [filteredPoints, selectedPoint, focusOnPoint, updateRoutePolyline]);

  // Inicializar MapLibre
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[currentStyleIdx].url,
      center: initialCenter,
      zoom: zoom,
      pitch: is3D ? 50 : 0,
      bearing: -15,
      attributionControl: false,
    });

    const handleRotate = () => {
      if (map.current) {
        setMapBearing(Math.round(map.current.getBearing()));
      }
    };

    map.current.on('rotate', handleRotate);

    map.current.on('load', () => {
      renderMarkers();
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
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
  }, [renderMarkers]);

  // Alternar vista 3D / 2D estilo Apple Maps
  const toggle3D = () => {
    if (!map.current) return;
    const next3D = !is3D;
    setIs3D(next3D);
    map.current.easeTo({
      pitch: next3D ? 50 : 0,
      duration: 700,
    });
  };

  // Restablecer orientación al Norte (0°)
  const resetNorth = () => {
    if (!map.current) return;
    map.current.easeTo({
      bearing: 0,
      duration: 600,
    });
    setMapBearing(0);
  };

  // Recentrar en el circuito o ciudad
  const recenterMap = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: initialCenter,
      zoom: cityData.zoom,
      pitch: is3D ? 50 : 0,
      bearing: 0,
      speed: 1.2,
      essential: true,
    });
    setMapBearing(0);
  };

  // Cambiar estilo de mapa (Capas / Satélite)
  const changeMapStyle = (idx: number) => {
    if (!map.current) return;
    setCurrentStyleIdx(idx);
    setShowStyleMenu(false);
    map.current.setStyle(MAP_STYLES[idx].url);
    map.current.once('style.load', () => {
      renderMarkers();
    });
  };

  // Título dinámico
  const matchedRouteName = livePoints.find(p => 
    p.routeId === circuitoId || p.routeSlug === circuitoId || (circuitoId && p.routeName && p.routeName.toLowerCase().includes(circuitoId.toLowerCase()))
  )?.routeName;

  const displayRouteTitle = selectedPoint?.routeName || 
    matchedRouteName ||
    (circuitoId === 'dariano' ? 'Circuito Dariano' : `${cityData.name} • Puntos de Interés`);

  // Controles de Navegación Estilo Apple Maps (Reutilizables para móvil y escritorio)
  const renderAppleMapControls = (isMobileLayout: boolean = false) => (
    <div className={`flex flex-col gap-1.5 sm:gap-2 items-center pointer-events-auto transition-all duration-300 ${
      isMobileLayout ? 'scale-90 xs:scale-95' : ''
    }`}>
      {/* 1. Brújula / Orientar al Norte */}
      <button
        type="button"
        onClick={resetNorth}
        className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_6px_20px_rgba(0,0,0,0.12)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        title="Orientar al Norte (0°)"
      >
        <div 
          className="relative w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center transition-transform duration-200 ease-out"
          style={{ transform: `rotate(${-mapBearing}deg)` }}
        >
          {/* Aguja Norte Roja */}
          <div className="absolute top-0.5 w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[8px] border-b-rose-600 drop-shadow-xs" />
          {/* Aguja Sur Gris */}
          <div className="absolute bottom-0.5 w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[8px] border-t-slate-400 drop-shadow-xs" />
          {/* Letra N central */}
          <span className="text-[7px] font-black text-slate-900 z-10 select-none">N</span>
        </div>
      </button>

      {/* 2. Toggle Inclinación / Perspectiva */}
      <button
        type="button"
        onClick={toggle3D}
        className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_6px_20px_rgba(0,0,0,0.12)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer font-black text-[11px]"
        title={is3D ? "Cambiar a vista cenital plana" : "Cambiar a vista con inclinación y perspectiva"}
      >
        <span className={is3D ? "text-purple-700 font-black text-[11px]" : "text-slate-700 font-bold text-[11px]"}>
          {is3D ? "2D" : "Ángulo"}
        </span>
      </button>

      {/* 3. Satélite / Estilo de Mapa (Globo) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowStyleMenu(!showStyleMenu)}
          className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-2xl border shadow-[0_6px_20px_rgba(0,0,0,0.12)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer ${
            showStyleMenu
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white/95 text-slate-800 border-slate-200/90'
          }`}
          title="Estilo de Mapa / Satélite"
        >
          <Globe className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-800 group-hover:text-purple-600 transition-colors" />
        </button>

        {/* Menú emergente de capas */}
        {showStyleMenu && (
          <div className={`absolute right-0 ${isMobileLayout ? 'top-11' : 'bottom-12'} w-36 rounded-2xl bg-white/95 backdrop-blur-2xl p-1.5 shadow-2xl border border-slate-200/90 flex flex-col gap-1 z-40 animate-fadeIn`}>
            {MAP_STYLES.map((style, idx) => (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  changeMapStyle(idx);
                  setShowStyleMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  currentStyleIdx === idx
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{style.name}</span>
                {currentStyleIdx === idx && <span className="text-[10px]">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Recentrar / Brújula de Navegación */}
      <button
        type="button"
        onClick={recenterMap}
        className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_6px_20px_rgba(0,0,0,0.12)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        title="Recentrar mapa"
      >
        <Navigation className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-purple-600 fill-purple-600/20 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-full rounded-none sm:rounded-[2.5rem] overflow-hidden shadow-none sm:shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-0 sm:border border-slate-200/90 bg-white select-none touch-none overscroll-none">
      
      {/* ================= MAP CANVAS ================= */}
      <div ref={mapContainer} className="w-full h-full bg-slate-100 touch-none overscroll-none" />

      {/* ================= CONTROLES SUPERIORES FLOTANTES ================= */}
      
      {/* 1. Botón "Atrás" */}
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
      <div className="absolute top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 z-20 max-w-[200px] xs:max-w-xs sm:max-w-md pointer-events-none">
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200/90 text-slate-800 shadow-md truncate">
          <span className={`h-2 w-2 rounded-full ${rawPoints.length > 0 ? 'bg-purple-600 animate-pulse' : 'bg-amber-500'} shrink-0`} />
          <p className="text-[10px] sm:text-xs font-black text-slate-900 truncate">
            {rawPoints.length > 0 ? displayRouteTitle : `${cityData.name} • En Construcción`}
          </p>
          {rawPoints.length > 0 ? (
            <span className="text-[10px] text-purple-700 font-semibold hidden sm:inline">
              • {filteredPoints.length} {filteredPoints.length === 1 ? 'Hito' : 'Hitos'}
            </span>
          ) : (
            <span className="text-[10px] text-amber-600 font-bold hidden sm:inline">
              • Próximamente
            </span>
          )}
        </div>
      </div>

      {/* ================= FILTRO DE CATEGORÍAS FLOTANTE (Solo si hay paradas registradas) ================= */}
      {rawPoints.length > 0 && (
        <div className="absolute top-13 sm:top-16 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 z-10 flex items-center gap-1.5 py-1 overflow-x-auto scrollbar-none pointer-events-auto">
          <button
            type="button"
            onClick={() => setActiveCategory('todos')}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer shrink-0 ${
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
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer shrink-0 ${
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
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer shrink-0 ${
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
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer shrink-0 ${
              activeCategory === 'artes'
                ? 'bg-purple-600 text-white border border-purple-600 shadow-md'
                : 'bg-white/90 text-slate-700 border border-slate-200/90 hover:bg-white'
            }`}
          >
            🎭 Artes
          </button>
        </div>
      )}

      {/* ================= CONTROLES FLOTANTES MÓVIL ESTILO APPLE MAPS ================= */}
      {/* En móviles (<sm): Anclados de forma independiente para nunca salirse de pantalla al expandir el bottom sheet */}
      <div className="sm:hidden absolute right-2.5 xs:right-3.5 top-22 xs:top-24 z-20 pointer-events-auto">
        {renderAppleMapControls(true)}
      </div>

      {/* ================= BOTTOM SHEET FLOTANTE ESTILO MODERNO ================= */}
      <div className="absolute inset-x-2 xs:inset-x-3 sm:inset-x-auto sm:right-4 md:right-6 bottom-2 sm:bottom-4 sm:w-[410px] md:w-[430px] z-30 transition-all duration-300 ease-out flex flex-col items-end gap-2 sm:gap-2.5 pointer-events-none">
        
        {/* ================= CONTROLES FLOTANTES TABLET / ESCRITORIO (sm: en adelante) ================= */}
        <div className="hidden sm:flex flex-col gap-2 items-center pointer-events-auto transition-all duration-300">
          {renderAppleMapControls(false)}
        </div>

        {/* ================= CARD INFORMATIVO DEL LUGAR ================= */}
        <div className={`w-full rounded-[1.75rem] sm:rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_12px_45px_rgba(0,0,0,0.15)] p-3.5 sm:p-4 md:p-5 text-slate-800 flex flex-col pointer-events-auto transition-all duration-300 overflow-hidden ${
          sheetExpanded 
            ? 'max-h-[82dvh] sm:max-h-[78dvh] md:max-h-[calc(100dvh-170px)]' 
            : 'max-h-none'
        }`}>
          
          {/* Grabber Bar */}
          <div 
            onClick={() => setSheetExpanded(!sheetExpanded)}
            className="w-full flex justify-center -mt-1 pb-1 cursor-pointer select-none"
            title={sheetExpanded ? "Colapsar detalles" : "Expandir detalles y misiones"}
          >
            <div className="w-10 h-1.5 bg-slate-300/80 rounded-full hover:bg-purple-400 transition-colors" />
          </div>

          {/* Información del Punto Seleccionado (PINNED HEADER) */}
          {selectedPoint ? (
            <div className="flex items-start gap-3 sm:gap-3.5 pt-0.5 shrink-0">
              {/* Imagen real del sitio o Icono distinguido */}
              <div 
                onClick={() => {
                  if (currentPhotos.length > 0) {
                    setSelectedPhotoPreview(currentPhotos[0]);
                  }
                }}
                className={`relative w-14 h-14 xs:w-16 xs:h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-purple-50 shrink-0 border border-slate-200/80 flex items-center justify-center shadow-xs ${
                  currentPhotos.length > 0 ? 'cursor-pointer group' : ''
                }`}
              >
                {selectedPoint.image ? (
                  <>
                    <Image
                      src={selectedPoint.image}
                      alt={selectedPoint.name}
                      fill
                      sizes="(max-width: 640px) 64px, 72px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                  </>
                ) : (
                  <MapPin className="w-6 h-6 text-purple-600/70" />
                )}
                {filteredPoints.length > 1 && (
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/70 text-[9px] font-black text-white z-10 backdrop-blur-xs">
                    {selectedPointIndex + 1}/{filteredPoints.length}
                  </span>
                )}
              </div>

              {/* Textos y Etiquetas Limpias */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-0.5">
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold tracking-tight">
                    {selectedPoint.category}
                  </span>
                  
                  {selectedPoint.pointsReward && selectedPoint.pointsReward > 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                      +{selectedPoint.pointsReward} pts
                    </span>
                  ) : null}

                  {/* Reseñas / Calificación interactiva */}
                  {currentAverageRating ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSheetExpanded(true);
                        setExpandedTab('reviews');
                      }}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                      title="Ver opiniones y reseñas"
                    >
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{currentAverageRating} ({currentReviews.length})</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSheetExpanded(true);
                        setExpandedTab('reviews');
                      }}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Sé el primero en calificar este lugar"
                    >
                      <Star className="w-3 h-3 text-amber-400" />
                      <span>Calificar</span>
                    </button>
                  )}

                  {selectedPoint.walkTime && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      • {selectedPoint.walkTime}
                    </span>
                  )}
                </div>

                <h3 className="text-sm xs:text-base sm:text-lg font-black text-slate-900 truncate leading-snug">
                  {selectedPoint.name}
                </h3>
                
                {selectedPoint.desc && (
                  <p className={`text-xs text-slate-500 font-normal leading-relaxed mt-0.5 ${
                    sheetExpanded ? 'line-clamp-1 xs:line-clamp-2' : 'line-clamp-2'
                  }`}>
                    {selectedPoint.desc}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-6 px-4 text-center flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shadow-sm">
                <Construction className="w-7 h-7 text-amber-600 animate-pulse" />
              </div>
              <div className="max-w-sm">
                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">
                  {cityData.name} en Construcción
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Esta ciudad creativa aún no cuenta con rutas ni puntos registrados para explorar. Actualmente se encuentra en construcción y pronto estarán disponibles.
                </p>
              </div>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="mt-1 py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al Mapa General</span>
                </button>
              )}
            </div>
          )}

          {/* Fila de Acciones Principales (PINNED ROW) */}
          {selectedPoint && (
            <div className="flex items-center gap-1.5 xs:gap-2 pt-2.5 mt-2 border-t border-slate-100 shrink-0">
              {/* Botón 1: Enfocar en Mapa */}
              <button
                type="button"
                onClick={() => focusOnPoint(selectedPointIndex)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 xs:py-2.5 px-2 xs:px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-bold text-xs shadow-xs transition-all cursor-pointer min-w-0"
              >
                <Compass className="w-3.5 h-3.5 xs:w-4 xs:h-4 shrink-0" />
                <span className="truncate">Enfocar</span>
              </button>

              {/* Botón 2: Siguiente (si hay > 1 parada) */}
              {filteredPoints.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (selectedPointIndex + 1) % filteredPoints.length;
                    focusOnPoint(nextIdx);
                  }}
                  className="inline-flex items-center justify-center gap-1 py-2 xs:py-2.5 px-2 xs:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200/80 active:scale-[0.98] transition-all cursor-pointer min-w-0"
                  title="Siguiente parada"
                >
                  <Route className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">Siguiente</span>
                </button>
              )}

              {/* Botón 3: Desglosar / Alternar (Fotos, Reseñas, Paradas) */}
              <button
                type="button"
                onClick={() => setSheetExpanded(!sheetExpanded)}
                className={`inline-flex items-center justify-center gap-1 py-2 xs:py-2.5 px-2 xs:px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer active:scale-[0.98] shrink-0 ${
                  sheetExpanded 
                    ? 'bg-purple-50 text-purple-800 border-purple-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
                }`}
                title={sheetExpanded ? 'Ocultar detalles' : 'Desglosar fotos y reseñas'}
              >
                {sheetExpanded ? <ChevronUp className="w-3.5 h-3.5 text-purple-700 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
                <span className="hidden xs:inline">{sheetExpanded ? 'Cerrar' : 'Detalles'}</span>
              </button>

              {/* Enlace a la Ciudad (Limpio y estilizado) */}
              <Link
                href={`/ciudades-creativas/${cityData.slug}`}
                className="inline-flex items-center justify-center gap-1 py-2 xs:py-2.5 px-2 xs:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 font-bold text-xs border border-slate-200/80 transition-all cursor-pointer shrink-0"
                title={`Ver guía de ${cityData.name}`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="hidden sm:inline">Guía de {cityData.name}</span>
                <span className="sm:hidden">Guía</span>
              </Link>
            </div>
          )}

          {/* ================= CONTENIDO EXPANDIDO (BODY SCROLLABLE ÚNICO) ================= */}
          {sheetExpanded && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex-1 overflow-y-auto overscroll-contain pr-1 -mr-1 space-y-2.5 sm:space-y-3 touch-pan-y custom-scrollbar animate-fadeIn">
              
              {/* Barra de Progreso del Circuito Activo */}
              <div className="p-2.5 xs:p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/70 to-purple-50 border border-purple-200/80 space-y-1.5 xs:space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-black text-purple-950 min-w-0">
                    <Compass className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                    <span className="truncate">{activeRouteName}</span>
                  </div>
                  <span className="text-[10px] xs:text-[11px] font-black text-purple-800 shrink-0 whitespace-nowrap">
                    {routeProgress.completedPlacesCount}/{routeProgress.totalPlaces} validadas ({routeProgress.progressPercent}%)
                  </span>
                </div>

                <div className="w-full bg-purple-200/60 h-2 xs:h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(6, routeProgress.progressPercent)}%` }}
                  />
                </div>
              </div>

              {/* Tarjeta de Misión de Validación de Este Hito (2 Pasos Requeridos: 1. Reseña + 2. Foto) */}
              <div className="p-2.5 xs:p-3 sm:p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10.5px] xs:text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 min-w-0">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">Misión para Validar este Hito:</span>
                  </span>

                  {currentPlaceProgress?.isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[9.5px] xs:text-[10px] font-black shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>¡Validado!</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[9.5px] xs:text-[10px] font-black shrink-0 whitespace-nowrap">
                      {(currentPlaceProgress?.hasReview ? 1 : 0) + (currentPlaceProgress?.hasPhoto ? 1 : 0)} de 2 listos
                    </span>
                  )}
                </div>

                {/* Grid de los 2 Pasos */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs">
                  {/* Paso 1: Reseña */}
                  <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                    currentPlaceProgress?.hasReview
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-black uppercase truncate">Paso 1: Reseña</span>
                        {currentPlaceProgress?.hasReview ? (
                          <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-0.5 shrink-0">
                            <Check className="w-3 h-3" /> Hecho
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold text-[10px] shrink-0">Pendiente</span>
                        )}
                      </div>
                      <p className="text-[10.5px] xs:text-[11px] text-slate-600 line-clamp-2">
                        {currentPlaceProgress?.hasReview
                          ? `★ ${currentPlaceProgress.reviewRating} - Comentario registrado.`
                          : 'Deja una calificación y un comentario sobre tu experiencia.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedTab('reviews')}
                      className={`mt-2 py-1.5 px-2 rounded-lg text-[10.5px] font-black transition-all cursor-pointer text-center truncate ${
                        currentPlaceProgress?.hasReview
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs'
                      }`}
                    >
                      {currentPlaceProgress?.hasReview ? 'Ver mi reseña' : 'Escribir Reseña →'}
                    </button>
                  </div>

                  {/* Paso 2: Foto */}
                  <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                    currentPlaceProgress?.hasPhoto
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-black uppercase truncate">Paso 2: Foto</span>
                        {currentPlaceProgress?.hasPhoto ? (
                          <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-0.5 shrink-0">
                            <Check className="w-3 h-3" /> Aportada
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold text-[10px] shrink-0">Pendiente</span>
                        )}
                      </div>
                      <p className="text-[10.5px] xs:text-[11px] text-slate-600 line-clamp-2">
                        {currentPlaceProgress?.hasPhoto
                          ? 'Has colaborado con una fotografía en este sitio.'
                          : 'Sube o enlaza una imagen real tomada en este lugar.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setExpandedTab('photos');
                        setShowPhotoForm(true);
                      }}
                      className={`mt-2 py-1.5 px-2 rounded-lg text-[10.5px] font-black transition-all cursor-pointer text-center truncate ${
                        currentPlaceProgress?.hasPhoto
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs'
                      }`}
                    >
                      {currentPlaceProgress?.hasPhoto ? 'Ver foto aportada' : 'Aportar Fotografía →'}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-medium">
                  {currentPlaceProgress?.isCompleted 
                    ? '✓ Ambos requisitos cumplidos: este hito suma al 100% de la ruta.' 
                    : 'Debes cumplir ambos requisitos para que este lugar cuente para la insignia de la ruta.'}
                </div>
              </div>

              {/* Barra de Pestañas Segmentadas */}
              <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => setExpandedTab('photos')}
                  className={`flex-1 py-1.5 px-1.5 xs:px-2 rounded-xl text-[11px] xs:text-xs font-black transition-all flex items-center justify-center gap-1 xs:gap-1.5 cursor-pointer min-w-0 ${
                    expandedTab === 'photos'
                      ? 'bg-white text-purple-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Fotos {currentPhotos.length > 0 ? `(${currentPhotos.length})` : ''}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExpandedTab('reviews')}
                  className={`flex-1 py-1.5 px-1.5 xs:px-2 rounded-xl text-[11px] xs:text-xs font-black transition-all flex items-center justify-center gap-1 xs:gap-1.5 cursor-pointer min-w-0 ${
                    expandedTab === 'reviews'
                      ? 'bg-white text-purple-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  <span className="truncate">Reseñas {currentReviews.length > 0 ? `(${currentReviews.length})` : ''}</span>
                </button>

                {filteredPoints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setExpandedTab('stops')}
                    className={`flex-1 py-1.5 px-1.5 xs:px-2 rounded-xl text-[11px] xs:text-xs font-black transition-all flex items-center justify-center gap-1 xs:gap-1.5 cursor-pointer min-w-0 ${
                      expandedTab === 'stops'
                        ? 'bg-white text-purple-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Paradas ({filteredPoints.length})</span>
                  </button>
                )}
              </div>

              {/* CONTENIDO PESTAÑA 1: FOTOS / GALERÍA & APORTE COLABORATIVO */}
              {expandedTab === 'photos' && (
                <div className="space-y-2.5">
                  
                  {/* Botón para abrir formulario de colaboración de fotos */}
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Camera className="w-4 h-4 text-purple-700 shrink-0" />
                      <span className="font-black text-purple-950 text-[10.5px] xs:text-[11px] truncate">
                        {currentPlaceProgress?.hasPhoto ? 'Foto colaborativa registrada ✓' : 'Paso 2: Colabora con una foto'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPhotoForm(!showPhotoForm)}
                      className="px-2.5 py-1 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-[10.5px] shadow-2xs cursor-pointer shrink-0"
                    >
                      {showPhotoForm ? 'Cancelar' : '+ Aportar Foto'}
                    </button>
                  </div>

                  {/* Formulario de Aporte de Foto */}
                  {showPhotoForm && (
                    <div className="p-3 rounded-2xl bg-white border border-purple-200 space-y-2 text-xs animate-fadeIn shadow-xs">
                      <span className="text-[10px] font-black uppercase text-slate-600 block">
                        Subir foto del lugar a Supabase Storage:
                      </span>

                      <div className="flex flex-col gap-2">
                        {/* Subir archivo directamente */}
                        <label className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed text-xs font-bold transition-all text-center ${
                          isUploadingPhoto
                            ? 'bg-purple-100 border-purple-400 text-purple-900 cursor-wait'
                            : 'bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-800 cursor-pointer'
                        }`}>
                          {isUploadingPhoto ? (
                            <>
                              <Loader2 className="w-4 h-4 text-purple-700 animate-spin shrink-0" />
                              <span className="truncate">Subiendo a Supabase Storage...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-purple-600 shrink-0" />
                              <span className="truncate">Seleccionar imagen de tu dispositivo</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingPhoto}
                            onChange={handlePhotoFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {photoUploadSuccess && (
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>¡Foto colaborativa aportada con éxito! Has completado el Paso 2 de este hito.</span>
                    </div>
                  )}

                  {currentPhotos.length > 0 ? (
                    <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar snap-x snap-mandatory pt-0.5">
                      {currentPhotos.map((imgUrl, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setSelectedPhotoPreview(imgUrl)}
                          className="relative shrink-0 w-32 h-20 xs:w-36 xs:h-24 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs group cursor-pointer snap-start bg-purple-50"
                        >
                          <Image
                            src={imgUrl}
                            alt={`${selectedPoint?.name} foto ${pIdx + 1}`}
                            fill
                            sizes="144px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="w-5 h-5 text-white drop-shadow-md" />
                          </div>
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 text-[9px] font-black text-white backdrop-blur-xs">
                            {pIdx + 1}/{currentPhotos.length}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Camera className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                      <span>Sin galería de fotos adicional registrada</span>
                    </div>
                  )}
                </div>
              )}

              {/* CONTENIDO PESTAÑA 2: RESEÑAS Y CALIFICACIÓN */}
              {expandedTab === 'reviews' && (
                <div className="space-y-2.5">
                  {/* Resumen de Calificación */}
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center font-black text-amber-900 shrink-0">
                        ★
                      </div>
                      <div className="min-w-0">
                        <span className="font-black text-slate-900 block text-xs truncate">
                          {currentAverageRating ? `${currentAverageRating} de 5.0` : 'Sin calificaciones'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium truncate block">
                          {currentReviews.length > 0 
                            ? `${currentReviews.length} opiniones de viajeros` 
                            : 'Sé la primera persona en calificar'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-400 text-xs shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            (parseFloat(currentAverageRating || '0') >= s)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Formulario para dejar reseña */}
                  <form onSubmit={handleAddReview} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Tu puntuación:
                      </span>
                      {/* Estrellas Interactivas */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = (hoverReviewRating || newReviewRating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoverReviewRating(star)}
                              onMouseLeave={() => setHoverReviewRating(null)}
                              onClick={() => setNewReviewRating(star)}
                              className="cursor-pointer transition-transform hover:scale-115 active:scale-90 p-0.5"
                              title={`${star} estrellas`}
                            >
                              <Star
                                className={`w-4 h-4 transition-colors ${
                                  isFilled
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="Tu nombre (opcional)..."
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:border-purple-600 outline-hidden transition-all"
                    />

                    <div className="flex flex-col xs:flex-row gap-2">
                      <textarea
                        rows={2}
                        required
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Comparte tu experiencia en este lugar..."
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:border-purple-600 outline-hidden transition-all resize-none min-w-0"
                      />

                      <button
                        type="submit"
                        className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-xs gap-1.5"
                        title="Enviar reseña"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="xs:hidden font-bold">Publicar</span>
                      </button>
                    </div>

                    {reviewSubmitted && (
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 animate-fadeIn">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>¡Reseña registrada con éxito! Has completado el Paso 1 de este hito.</span>
                      </div>
                    )}
                  </form>

                  {/* Lista de Reseñas */}
                  <div className="space-y-2">
                    {currentReviews.map((rev) => (
                      <div key={rev.id} className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-900 font-black text-[10px] flex items-center justify-center shrink-0">
                              {rev.name.substring(0, 1).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-900 text-xs truncate">{rev.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-black shrink-0">
                            <span>★ {rev.rating}.0</span>
                            <span className="text-slate-400 font-normal hidden xs:inline">• {rev.date}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTENIDO PESTAÑA 3: LISTA DE PARADAS (Solo si > 1) */}
              {expandedTab === 'stops' && filteredPoints.length > 1 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                    {selectedPoint?.routeName ? `Paradas de ${selectedPoint.routeName}` : `Hitos de ${cityData.name}`}
                  </p>
                  {filteredPoints.map((point, idx) => (
                    <button
                      key={point.id}
                      type="button"
                      onClick={() => focusOnPoint(idx)}
                      className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                        selectedPointIndex === idx
                          ? 'bg-purple-50 text-purple-900 border border-purple-200'
                          : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                          selectedPointIndex === idx ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold truncate">
                          {point.name}
                        </span>
                      </div>
                      {selectedPointIndex === idx && (
                        <span className="text-[10px] font-bold text-purple-600 shrink-0 ml-2">
                          Viendo 📍
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* ================= MODAL LIGHTBOX PARA FOTOS ================= */}
      {selectedPhotoPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="relative max-w-2xl w-full max-h-[92dvh] rounded-3xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl flex flex-col">
            <div className="relative h-64 xs:h-80 sm:h-96 w-full max-h-[68dvh] bg-black">
              <Image
                src={selectedPhotoPreview}
                alt="Vista ampliada de fotografía"
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-contain"
              />
            </div>

            <div className="p-3.5 sm:p-4 bg-slate-900 flex items-center justify-between border-t border-slate-800 shrink-0">
              <span className="text-xs font-bold text-white truncate mr-2">
                📸 {selectedPoint?.name}
              </span>

              <button
                type="button"
                onClick={() => setSelectedPhotoPreview(null)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CELEBRACIÓN DE LOGRO DESBLOQUEADO ================= */}
      {unlockedAchievementModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="relative max-w-md w-full max-h-[92dvh] overflow-y-auto custom-scrollbar rounded-3xl bg-white p-5 sm:p-8 text-center space-y-4 shadow-2xl border border-amber-300">
            <button
              type="button"
              onClick={() => setUnlockedAchievementModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-lg">
              {unlockedAchievementModal.icon || '🏆'}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                <PartyPopper className="w-3.5 h-3.5 text-emerald-600" />
                <span>¡Circuito 100% Completado!</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                ¡Logro Desbloqueado!
              </h3>
              <p className="text-base font-black text-purple-700 mt-1">
                {unlockedAchievementModal.name}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                ¡Felicitaciones! Has completado todos los lugares de la ruta cumpliendo los 2 requisitos evaluados: reseña con comentario y fotografía colaborativa en cada parada.
              </p>
            </div>

            {userRole !== 'admin' && unlockedAchievementModal.points_reward > 0 && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-black text-sm">
                +{unlockedAchievementModal.points_reward} Puntos de Explorador Sumados 🎉
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Link
                href="/perfil"
                className="flex-1 py-3 px-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition-all shadow-md text-center"
              >
                Ver en mi Pasaporte
              </Link>
              <button
                type="button"
                onClick={() => setUnlockedAchievementModal(null)}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Seguir Explorando
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}