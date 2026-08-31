'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  Award,
  Clock,
  Eye,
  Check,
  X,
  Sparkles,
  MapPin,
  Layers,
  ChevronRight,
  Star,
  Footprints,
  Info,
} from 'lucide-react';
import { CreativeRouteItem, RoutePlaceItem, MunicipalityItem, adminService } from '@/services/adminService';
import { MapLocationPicker } from '@/components/map/MapLocationPicker';

interface RoutesManagerTabProps {
  routes: CreativeRouteItem[];
  cities?: MunicipalityItem[];
  onRefresh: () => void;
}

export const RoutesManagerTab: React.FC<RoutesManagerTabProps> = ({ routes, cities = [], onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<CreativeRouteItem | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    municipality_name: string;
    theme: string;
    description: string;
    difficulty: 'Fácil' | 'Moderada' | 'Desafiante';
    estimated_duration: number;
    points_award: number;
    badge_name: string;
    cover_image: string;
    status: 'draft' | 'published' | 'archived';
    is_visible_in_map: boolean;
  }>({
    name: '',
    municipality_name: 'León',
    theme: 'Cultura & Tradición',
    description: '',
    difficulty: 'Fácil',
    estimated_duration: 120,
    points_award: 200,
    badge_name: '',
    cover_image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop',
    status: 'published',
    is_visible_in_map: true,
  });

  // Estado para el Gestor de Lugares del Circuito
  const [selectedRouteForPlaces, setSelectedRouteForPlaces] = useState<CreativeRouteItem | null>(null);
  const [routePlaces, setRoutePlaces] = useState<RoutePlaceItem[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  
  // Modal de Crear / Editar Lugar
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<RoutePlaceItem | null>(null);
  const [placeFilter, setPlaceFilter] = useState<'all' | 'primary' | 'secondary'>('all');
  const [placeForm, setPlaceForm] = useState<{
    name: string;
    category: string;
    description: string;
    highlight: string;
    image: string;
    walk_time: string;
    rating: string;
    lat: number | string;
    lng: number | string;
    is_primary_route_point: boolean;
    audio_guide_url: string;
    vr_360_url: string;
    points_reward: number;
    icon_name: string;
  }>({
    name: '',
    category: 'Patrimonio Cultural',
    description: '',
    highlight: '',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop',
    walk_time: '5 min a pie',
    rating: '4.9 ★',
    lat: 12.4350,
    lng: -86.8782,
    is_primary_route_point: true,
    audio_guide_url: '',
    vr_360_url: '',
    points_reward: 50,
    icon_name: 'MapPin',
  });

  const loadPlacesForRoute = useCallback(async (routeId: string) => {
    setLoadingPlaces(true);
    try {
      const places = await adminService.getRoutePlaces(routeId);
      setRoutePlaces(places);
    } finally {
      setLoadingPlaces(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRouteForPlaces) {
      loadPlacesForRoute(selectedRouteForPlaces.id);
    }
  }, [selectedRouteForPlaces, loadPlacesForRoute]);

  const openCreateModal = () => {
    setEditingRoute(null);
    setFormData({
      name: '',
      municipality_name: 'León',
      theme: 'Cultura & Tradición',
      description: '',
      difficulty: 'Fácil',
      estimated_duration: 120,
      points_award: 200,
      badge_name: '',
      cover_image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop',
      status: 'published',
      is_visible_in_map: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (route: CreativeRouteItem) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      municipality_name: route.municipality_name || 'León',
      theme: route.theme || 'Cultura & Tradición',
      description: route.description || '',
      difficulty: (route.difficulty as any) || 'Fácil',
      estimated_duration: route.estimated_duration || 120,
      points_award: route.points_award || 200,
      badge_name: route.badge_name || '',
      cover_image: route.cover_image || '',
      status: (route.status as any) || 'published',
      is_visible_in_map: route.is_visible_in_map ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingRoute) {
      await adminService.updateRoute(editingRoute.id, formData);
    } else {
      await adminService.createRoute(formData);
    }

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este circuito?')) {
      await adminService.deleteRoute(id);
      onRefresh();
    }
  };

  const openCreatePlaceModal = () => {
    setEditingPlace(null);
    setPlaceForm({
      name: '',
      category: 'Patrimonio Cultural',
      description: '',
      highlight: '',
      image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop',
      walk_time: '5 min a pie',
      rating: '4.9 ★',
      lat: 12.4350,
      lng: -86.8782,
      is_primary_route_point: true,
      audio_guide_url: '',
      vr_360_url: '',
      points_reward: 50,
      icon_name: 'MapPin',
    });
    setIsPlaceModalOpen(true);
  };

  const openEditPlaceModal = (place: RoutePlaceItem) => {
    setEditingPlace(place);
    setPlaceForm({
      name: place.name,
      category: place.category,
      description: place.description || '',
      highlight: place.highlight || '',
      image: place.image || 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop',
      walk_time: place.walk_time || '5 min a pie',
      rating: place.rating || '4.8 ★',
      lat: place.lat,
      lng: place.lng,
      is_primary_route_point: place.is_primary_route_point ?? true,
      audio_guide_url: place.audio_guide_url || '',
      vr_360_url: place.vr_360_url || '',
      points_reward: place.points_reward || 50,
      icon_name: place.icon_name || 'MapPin',
    });
    setIsPlaceModalOpen(true);
  };

  const handleTogglePrimaryPoint = async (place: RoutePlaceItem) => {
    const updated = !place.is_primary_route_point;
    await adminService.togglePrimaryRoutePlace(place.id, updated);
    if (selectedRouteForPlaces) {
      loadPlacesForRoute(selectedRouteForPlaces.id);
    }
  };

  const handleSavePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRouteForPlaces || !placeForm.name.trim()) return;

    if (editingPlace) {
      await adminService.updateRoutePlace(editingPlace.id, {
        name: placeForm.name.trim(),
        category: placeForm.category,
        description: placeForm.description.trim(),
        highlight: placeForm.highlight.trim(),
        image: placeForm.image.trim(),
        walk_time: placeForm.walk_time.trim(),
        rating: placeForm.rating,
        lat: typeof placeForm.lat === 'number' ? placeForm.lat : parseFloat(placeForm.lat) || 12.4350,
        lng: typeof placeForm.lng === 'number' ? placeForm.lng : parseFloat(placeForm.lng) || -86.8782,
        is_primary_route_point: placeForm.is_primary_route_point,
        audio_guide_url: placeForm.audio_guide_url.trim() || undefined,
        vr_360_url: placeForm.vr_360_url.trim() || undefined,
        points_reward: placeForm.points_reward || 50,
        icon_name: placeForm.icon_name || 'MapPin',
      });
    } else {
      await adminService.createRoutePlace({
        route_id: selectedRouteForPlaces.id,
        name: placeForm.name.trim(),
        slug: placeForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: placeForm.category,
        description: placeForm.description.trim(),
        highlight: placeForm.highlight.trim(),
        image: placeForm.image.trim(),
        walk_time: placeForm.walk_time.trim(),
        rating: placeForm.rating,
        lat: typeof placeForm.lat === 'number' ? placeForm.lat : parseFloat(placeForm.lat) || 12.4350,
        lng: typeof placeForm.lng === 'number' ? placeForm.lng : parseFloat(placeForm.lng) || -86.8782,
        is_primary_route_point: placeForm.is_primary_route_point,
        audio_guide_url: placeForm.audio_guide_url.trim() || undefined,
        vr_360_url: placeForm.vr_360_url.trim() || undefined,
        points_reward: placeForm.points_reward || 50,
        icon_name: placeForm.icon_name || 'MapPin',
        is_active: true,
      });
    }

    setIsPlaceModalOpen(false);
    if (selectedRouteForPlaces) {
      loadPlacesForRoute(selectedRouteForPlaces.id);
    }
  };

  const handleDeletePlace = async (placeId: string) => {
    if (confirm('¿Eliminar esta parada del circuito?')) {
      await adminService.deleteRoutePlace(placeId);
      if (selectedRouteForPlaces) {
        loadPlacesForRoute(selectedRouteForPlaces.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-700" />
            Circuitos Creativos y Puntos del Mapa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Diseña recorridos turísticos, define paradas geolocalizadas y conecta los circuitos con el mapa inmersivo.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Circuito</span>
        </button>
      </div>

      {/* Grid de Rutas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {routes.map((route) => (
          <div
            key={route.id}
            className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between hover:border-purple-300 transition-all duration-300 group"
          >
            {/* Imagen Superior */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <Image
                src={route.cover_image || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop'}
                alt={route.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-purple-900 border border-slate-200 shadow-xs">
                  {route.municipality_name || 'Nicaragua'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    route.status === 'published'
                      ? 'bg-emerald-500 text-white font-black'
                      : 'bg-amber-400 text-slate-950 font-black'
                  }`}
                >
                  {route.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
              </div>

              {route.badge_name && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-md flex items-center gap-1">
                  <Award className="w-3 h-3 text-slate-950" />
                  <span>{route.badge_name}</span>
                </div>
              )}

              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-lg font-black text-white line-clamp-1">{route.name}</h3>
                <p className="text-xs text-purple-200 font-semibold">{route.theme}</p>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {route.description}
              </p>

              {/* Metadatos */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-[11px] text-slate-600">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Duración</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-600" /> {route.estimated_duration || 120} min
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Recompensa</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> +{route.points_award} pts
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Dificultad</span>
                  <span className="font-bold text-slate-900">{route.difficulty || 'Fácil'}</span>
                </div>
              </div>

              {/* Botón de Gestión de Lugares del Mapa */}
              <button
                type="button"
                onClick={() => setSelectedRouteForPlaces(route)}
                className="w-full py-2.5 px-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Gestionar Paradas del Mapa →</span>
              </button>

              {/* Acciones Editar / Eliminar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  {route.is_visible_in_map ? '🗺️ Visible en mapa' : 'Oculto en mapa'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(route)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Editar circuito"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(route.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                    title="Eliminar circuito"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* DRAWER / MODAL: GESTOR DE LUGARES Y PARADAS DEL CIRCUITO */}
      {/* ========================================================================= */}
      {selectedRouteForPlaces && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col overflow-hidden text-slate-900">
            
            {/* Header del Gestor de Paradas */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Paradas del Mapa • {selectedRouteForPlaces.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Puntos de interés interactivos visibles en el Mapa Inmersivo 3D.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRouteForPlaces(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de Acciones y Filtros de Paradas */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setPlaceFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    placeFilter === 'all'
                      ? 'bg-purple-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos ({routePlaces.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPlaceFilter('primary')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    placeFilter === 'primary'
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌟 Hitos de Ruta ({routePlaces.filter((p) => p.is_primary_route_point).length})
                </button>
                <button
                  type="button"
                  onClick={() => setPlaceFilter('secondary')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    placeFilter === 'secondary'
                      ? 'bg-cyan-100 text-cyan-900 font-black border border-cyan-300'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📍 Puntos Secundarios ({routePlaces.filter((p) => !p.is_primary_route_point).length})
                </button>
              </div>

              <button
                type="button"
                onClick={openCreatePlaceModal}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Parada</span>
              </button>
            </div>

            {/* Lista de Paradas */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 my-3">
              {loadingPlaces ? (
                <div className="py-12 text-center text-slate-400 text-xs">Cargando lugares del circuito...</div>
              ) : routePlaces.filter((p) => {
                if (placeFilter === 'primary') return p.is_primary_route_point;
                if (placeFilter === 'secondary') return !p.is_primary_route_point;
                return true;
              }).length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl p-6">
                  No hay lugares para este filtro en este circuito. Haz clic en <strong>Nueva Parada</strong> para agregar uno.
                </div>
              ) : (
                routePlaces
                  .filter((p) => {
                    if (placeFilter === 'primary') return p.is_primary_route_point;
                    if (placeFilter === 'secondary') return !p.is_primary_route_point;
                    return true;
                  })
                  .map((place, index) => (
                    <div
                      key={place.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-xs ${
                        place.is_primary_route_point
                          ? 'bg-purple-50/40 border-purple-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                          place.is_primary_route_point
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {index + 1}
                        </div>

                        {place.image && (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                            <Image src={place.image} alt={place.name} fill sizes="60px" className="object-cover" />
                          </div>
                        )}

                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="font-bold text-slate-950 text-sm">{place.name}</h4>
                            
                            {/* Badge Principal vs Secundario */}
                            <button
                              type="button"
                              onClick={() => handleTogglePrimaryPoint(place)}
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                place.is_primary_route_point
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                                  : 'bg-cyan-100 text-cyan-900 border border-cyan-300 hover:bg-cyan-200'
                              }`}
                              title="Haz clic para alternar entre Hito Principal y Punto Secundario"
                            >
                              {place.is_primary_route_point ? '🌟 Hito de Ruta' : '📍 Punto de Ciudad'}
                            </button>

                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-purple-900 border border-slate-200">
                              {place.category}
                            </span>
                          </div>

                          {place.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                              {place.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                              <MapPin className="w-3 h-3 text-emerald-600" /> {place.lat}, {place.lng}
                            </span>
                            <span>•</span>
                            <span className="text-amber-700 font-bold">+{place.points_reward || 50} pts</span>
                            {place.audio_guide_url && (
                              <span className="text-purple-700 font-bold">🎧 Audio Guía</span>
                            )}
                            {place.vr_360_url && (
                              <span className="text-cyan-700 font-bold">🌐 VR 360°</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => openEditPlaceModal(place)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Editar parada"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePlace(place.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                          title="Eliminar parada"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRouteForPlaces(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AÑADIR / EDITAR PARADA DE CIRCUITO */}
      {/* ========================================================================= */}
      {isPlaceModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] rounded-[2.5rem] bg-white border border-slate-200 p-6 sm:p-8 flex flex-col overflow-hidden text-slate-900 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {editingPlace ? 'Editar Parada del Circuito' : 'Añadir Nueva Parada al Circuito'}
              </h3>
              <button
                type="button"
                onClick={() => setIsPlaceModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlace} className="flex-1 overflow-y-auto pr-1 space-y-3.5 my-4 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Nombre del Lugar / Monumento / Taller *
                </label>
                <input
                  type="text"
                  required
                  value={placeForm.name}
                  onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
                  placeholder="Ej. Real Basílica Catedral de León"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-bold"
                />
              </div>

              {/* Selector de Punto Principal vs Secundario */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600">
                  Tipo de Punto en el Mapa Inmersivo *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlaceForm({ ...placeForm, is_primary_route_point: true })}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      placeForm.is_primary_route_point
                        ? 'bg-amber-100 border-amber-300 text-amber-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-black text-xs">🌟 Hito Principal</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Parada obligatoria de la ruta temática.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlaceForm({ ...placeForm, is_primary_route_point: false })}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      !placeForm.is_primary_route_point
                        ? 'bg-cyan-100 border-cyan-300 text-cyan-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-black text-xs">📍 Punto Secundario</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Comercio, café o taller de la ciudad creativa.</p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Categoría
                  </label>
                  <select
                    value={placeForm.category}
                    onChange={(e) => setPlaceForm({ ...placeForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  >
                    <option value="Patrimonio Cultural">🏛️ Patrimonio Cultural</option>
                    <option value="Patrimonio UNESCO">👑 Patrimonio UNESCO</option>
                    <option value="Taller Artesanal">🏺 Taller Artesanal</option>
                    <option value="Museo Literario">📚 Museo / Literatura</option>
                    <option value="Artes Escénicas">🎭 Artes Escénicas</option>
                    <option value="Arte Urbano">🎨 Arte Urbano / Mural</option>
                    <option value="Espacio Público">🌳 Parque / Plaza</option>
                    <option value="Gastronomía Tradicional">🍲 Gastronomía</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Puntos Recompensa (Gamificación)
                  </label>
                  <input
                    type="number"
                    value={placeForm.points_reward}
                    onChange={(e) => setPlaceForm({ ...placeForm, points_reward: parseInt(e.target.value) || 50 })}
                    placeholder="50"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Descripción Histórica o Narrativa
                </label>
                <textarea
                  rows={2}
                  value={placeForm.description}
                  onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })}
                  placeholder="Detalles sobre lo que el visitante experimentará en este punto..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  URL de Imagen del Lugar
                </label>
                <input
                  type="url"
                  value={placeForm.image}
                  onChange={(e) => setPlaceForm({ ...placeForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                />
              </div>

              {/* Enlaces Multimedia Inmersivos */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    URL Audio Guía (MP3 / Sound)
                  </label>
                  <input
                    type="url"
                    value={placeForm.audio_guide_url}
                    onChange={(e) => setPlaceForm({ ...placeForm, audio_guide_url: e.target.value })}
                    placeholder="https://.../audioguia.mp3"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    URL Recorrido 360° / VR 3D
                  </label>
                  <input
                    type="url"
                    value={placeForm.vr_360_url}
                    onChange={(e) => setPlaceForm({ ...placeForm, vr_360_url: e.target.value })}
                    placeholder="https://.../vr-tour"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Selector Interactivo de Ubicación con Pin en el Mapa */}
              <div className="pt-1">
                <MapLocationPicker
                  lat={placeForm.lat}
                  lng={placeForm.lng}
                  defaultCityName={selectedRouteForPlaces?.municipality_name}
                  height="250px"
                  label="Ubicación Exacta de la Parada (Arrastrá o Haz Clic)"
                  onChange={(newLat, newLng) => {
                    setPlaceForm((prev) => ({
                      ...prev,
                      lat: newLat,
                      lng: newLng,
                    }));
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Latitud Geográfica *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={placeForm.lat}
                    onChange={(e) => setPlaceForm({ ...placeForm, lat: e.target.value })}
                    placeholder="12.4350"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Longitud Geográfica *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={placeForm.lng}
                    onChange={(e) => setPlaceForm({ ...placeForm, lng: e.target.value })}
                    placeholder="-86.8782"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  {editingPlace ? 'Actualizar Parada' : 'Guardar Parada'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREAR / EDITAR CIRCUITO CREATIVO */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col overflow-hidden text-slate-900">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 border border-purple-200 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    {editingRoute ? `Editar Circuito: ${editingRoute.name}` : 'Crear Nuevo Circuito Turístico'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Define la temática, dificultad y recompensas de la experiencia.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoute} className="flex-1 overflow-y-auto pr-1 space-y-4 my-4 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Nombre del Circuito / Ruta *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Circuito Dariano Colonial"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Municipio Sede (Habilitado) *
                  </label>
                  {(() => {
                    const activeCities = cities.filter((c) => c.status === 'active');
                    if (activeCities.length > 0) {
                      return (
                        <select
                          required
                          value={formData.municipality_name}
                          onChange={(e) => setFormData({ ...formData, municipality_name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-hidden focus:border-purple-600 focus:bg-white"
                        >
                          <option value="">-- Elige municipio habilitado --</option>
                          {activeCities.map((c) => (
                            <option key={c.id} value={c.name}>
                              📍 {c.name} ({c.department_name || 'Nicaragua'})
                            </option>
                          ))}
                        </select>
                      );
                    }
                    return (
                      <input
                        type="text"
                        required
                        value={formData.municipality_name}
                        onChange={(e) => setFormData({ ...formData, municipality_name: e.target.value })}
                        placeholder="Ej. León"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                      />
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Eje Temático *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    placeholder="Ej. Poesía, Historia y Barroco"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Descripción Completa del Recorrido
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explica el valor cultural, historia y puntos destacados..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Dificultad
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  >
                    <option value="Fácil">Fácil (Peatonal)</option>
                    <option value="Moderada">Moderada</option>
                    <option value="Desafiante">Desafiante</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData({ ...formData, estimated_duration: parseInt(e.target.value) || 120 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Recompensa Puntos
                  </label>
                  <input
                    type="number"
                    value={formData.points_award}
                    onChange={(e) => setFormData({ ...formData, points_award: parseInt(e.target.value) || 200 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Insignia de Logro (Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.badge_name}
                    onChange={(e) => setFormData({ ...formData, badge_name: e.target.value })}
                    placeholder="Ej. Guardián Dariano"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Estado de Publicación
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-bold"
                  >
                    <option value="published">🟢 Publicado (Activo)</option>
                    <option value="draft">🟡 Borrador</option>
                    <option value="archived">🔴 Archivado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  URL de Imagen de Portada
                </label>
                <input
                  type="url"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-2xl bg-purple-50/60 border border-purple-200">
                <input
                  type="checkbox"
                  id="is_visible_in_map"
                  checked={formData.is_visible_in_map}
                  onChange={(e) => setFormData({ ...formData, is_visible_in_map: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                />
                <label htmlFor="is_visible_in_map" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Mostrar este circuito en el selector del Mapa Inmersivo
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer"
                >
                  {editingRoute ? 'Actualizar Circuito' : 'Guardar Circuito'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
