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
import { CreativeRouteItem, RoutePlaceItem, adminService } from '@/services/adminService';

interface RoutesManagerTabProps {
  routes: CreativeRouteItem[];
  onRefresh: () => void;
}

export const RoutesManagerTab: React.FC<RoutesManagerTabProps> = ({ routes, onRefresh }) => {
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
      difficulty: route.difficulty || 'Fácil',
      estimated_duration: route.estimated_duration || 120,
      points_award: route.points_award || 200,
      badge_name: route.badge_name || '',
      cover_image: route.cover_image || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop',
      status: route.status,
      is_visible_in_map: route.is_visible_in_map,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingRoute) {
      await adminService.updateRoute(editingRoute.id, {
        ...formData,
      });
    } else {
      await adminService.createRoute({
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
    }
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este circuito creativo?')) {
      await adminService.deleteRoute(id);
      onRefresh();
    }
  };

  // Funciones de Gestión de Lugares
  const openCreatePlaceModal = () => {
    setEditingPlace(null);
    setPlaceForm({
      name: '',
      category: 'Patrimonio Cultural',
      description: '',
      highlight: '',
      image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop',
      walk_time: 'Punto de inicio',
      rating: '4.9 ★',
      lat: 12.4350,
      lng: -86.8782,
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
    });
    setIsPlaceModalOpen(true);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            Circuitos Creativos y Puntos del Mapa
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Diseña recorridos turísticos, define paradas geolocalizadas y conecta los circuitos con el mapa inmersivo.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95 self-start sm:self-auto"
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
            className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl shadow-black/20 flex flex-col justify-between backdrop-blur-xl hover:border-purple-500/30 transition-all duration-300 group"
          >
            {/* Imagen Superior */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-950">
              <Image
                src={route.cover_image || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop'}
                alt={route.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/90 text-purple-300 border border-purple-500/30 backdrop-blur-md">
                  {route.municipality_name || 'Nicaragua'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    route.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {route.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
              </div>

              {route.badge_name && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{route.badge_name}</span>
                </div>
              )}

              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-lg font-black text-white line-clamp-1">{route.name}</h3>
                <p className="text-xs text-purple-300 font-semibold">{route.theme}</p>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {route.description}
              </p>

              {/* Metadatos */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5 text-[11px] text-slate-400">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-500">Duración</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" /> {route.estimated_duration || 120} min
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-500">Recompensa</span>
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> +{route.points_award} pts
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-500">Dificultad</span>
                  <span className="font-bold text-white">{route.difficulty || 'Fácil'}</span>
                </div>
              </div>

              {/* Botón de Gestión de Lugares del Mapa */}
              <button
                type="button"
                onClick={() => setSelectedRouteForPlaces(route)}
                className="w-full py-2.5 px-3 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-950/30"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Gestionar Paradas del Mapa →</span>
              </button>

              {/* Acciones Editar / Eliminar */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium">
                  {route.is_visible_in_map ? '🗺️ Visible en mapa' : 'Oculto en mapa'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(route)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Editar circuito"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(route.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] bg-slate-900 border border-white/15 shadow-2xl p-6 sm:p-8 flex flex-col overflow-hidden text-slate-100">
            
            {/* Header del Gestor de Paradas */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Paradas del Mapa • {selectedRouteForPlaces.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Puntos de interés interactivos visibles en el Mapa Inmersivo 3D.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRouteForPlaces(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de Acciones de Paradas */}
            <div className="flex items-center justify-between py-4">
              <div className="text-xs text-slate-400">
                Total de paradas registradas: <strong className="text-white">{routePlaces.length}</strong>
              </div>

              <button
                type="button"
                onClick={openCreatePlaceModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Parada</span>
              </button>
            </div>

            {/* Lista de Paradas */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {loadingPlaces ? (
                <div className="py-12 text-center text-slate-500 text-xs">Cargando lugares del circuito...</div>
              ) : routePlaces.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-white/10 rounded-2xl p-6">
                  No hay paradas registradas en este circuito todavía. Haz clic en <strong>Nueva Parada</strong> para agregar la primera parada con fotos y coordenadas.
                </div>
              ) : (
                routePlaces.map((place, index) => (
                  <div
                    key={place.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                        {index + 1}
                      </div>

                      {place.image && (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-900">
                          <Image src={place.image} alt={place.name} fill sizes="60px" className="object-cover" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{place.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/5 text-purple-300 border border-white/10">
                            {place.category}
                          </span>
                        </div>

                        {place.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {place.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <MapPin className="w-3 h-3" /> Lat: {place.lat}, Lng: {place.lng}
                          </span>
                          <span>•</span>
                          <span>{place.walk_time || 'A pie'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => openEditPlaceModal(place)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Editar parada"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePlace(place.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
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
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRouteForPlaces(null)}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs cursor-pointer"
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-[2.5rem] bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 flex flex-col overflow-hidden text-slate-100 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {editingPlace ? 'Editar Parada del Circuito' : 'Añadir Nueva Parada al Circuito'}
              </h3>
              <button
                type="button"
                onClick={() => setIsPlaceModalOpen(false)}
                className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlace} className="space-y-3.5 my-4 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Nombre del Lugar / Monumento / Taller *
                </label>
                <input
                  type="text"
                  required
                  value={placeForm.name}
                  onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
                  placeholder="Ej. Taller de Cerámica Precolombina"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Categoría
                  </label>
                  <select
                    value={placeForm.category}
                    onChange={(e) => setPlaceForm({ ...placeForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
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
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Tiempo a Pie / Desplazamiento
                  </label>
                  <input
                    type="text"
                    value={placeForm.walk_time}
                    onChange={(e) => setPlaceForm({ ...placeForm, walk_time: e.target.value })}
                    placeholder="Ej. 3 min a pie (200m)"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Descripción Histórica o Narrativa
                </label>
                <textarea
                  rows={2}
                  value={placeForm.description}
                  onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })}
                  placeholder="Detalles sobre lo que el visitante experimentará en este punto..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  URL de Imagen del Lugar
                </label>
                <input
                  type="url"
                  value={placeForm.image}
                  onChange={(e) => setPlaceForm({ ...placeForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Latitud Geográfica
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={placeForm.lat}
                    onChange={(e) => setPlaceForm({ ...placeForm, lat: e.target.value })}
                    placeholder="12.4350"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Longitud Geográfica
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={placeForm.lng}
                    onChange={(e) => setPlaceForm({ ...placeForm, lng: e.target.value })}
                    placeholder="-86.8782"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] bg-slate-900 border border-white/15 shadow-2xl p-6 sm:p-8 flex flex-col overflow-hidden text-slate-100">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-purple-400" />
                {editingRoute ? 'Editar Circuito Creativo' : 'Crear Nuevo Circuito Creativo'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs my-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Nombre del Circuito *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Circuito Dariano Colonial"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Ciudad / Municipio
                  </label>
                  <select
                    value={formData.municipality_name}
                    onChange={(e) => setFormData({ ...formData, municipality_name: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    {['León', 'Masaya', 'San Juan de Oriente', 'Granada', 'Estelí', 'Bluefields', 'Matagalpa', 'Juigalpa', 'Nagarote'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Eje Temático del Circuito
                </label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="Ej. Literatura & Arquitectura Colonial"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción de la experiencia para el viajero..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Dificultad
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Moderada">Moderada</option>
                    <option value="Desafiante">Desafiante</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData({ ...formData, estimated_duration: parseInt(e.target.value) || 120 })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Puntos Recompensa
                  </label>
                  <input
                    type="number"
                    value={formData.points_award}
                    onChange={(e) => setFormData({ ...formData, points_award: parseInt(e.target.value) || 200 })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Nombre de la Insignia (Logro)
                  </label>
                  <input
                    type="text"
                    value={formData.badge_name}
                    onChange={(e) => setFormData({ ...formData, badge_name: e.target.value })}
                    placeholder="Ej. Guardián Dariano"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    URL Imagen de Portada
                  </label>
                  <input
                    type="url"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
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
