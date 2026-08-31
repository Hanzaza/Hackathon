'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  CalendarDays,
  Search,
  MapPin,
  Clock,
  Plus,
  Filter,
  Layers,
  Award,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { ProposeEventModal } from './components/ProposeEventModal';
import { AdminEventItem, adminService } from '@/services/adminService';
import { useAuth } from '@/context/AuthContext';

const FILTROS_TIEMPO = [
  { key: 'todas', label: 'Todos los Eventos' },
  { key: 'semana', label: 'Esta Semana' },
  { key: 'mes', label: 'Este Mes' },
  { key: 'proximos', label: 'Próximos' },
];

const CATEGORIAS_CULTURALES = [
  'Todas las Categorías',
  'Tradición & Folclore',
  'Música & Danza',
  'Artesanía & Tradición',
  'Gastronomía Tradicional',
  'Arte Urbano',
  'Danza & Música',
];

export default function AgendaPage() {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros y Búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroCiudad, setFiltroCiudad] = useState('Todas');
  const [filtroTiempo, setFiltroTiempo] = useState('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas las Categorías');

  // Modales
  const [selectedEvent, setSelectedEvent] = useState<AdminEventItem | null>(null);
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carga de Eventos desde Supabase
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error cargando agenda de eventos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Lista dinámica de Ciudades
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.city) set.add(e.city);
    });
    return ['Todas', ...Array.from(set)];
  }, [events]);

  // Filtrado de Eventos
  const eventosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);

    const mesActual = hoy.getMonth();
    const yearActual = hoy.getFullYear();

    return events.filter((evento) => {
      // 1. Filtro por Ciudad
      if (filtroCiudad !== 'Todas' && evento.city.toLowerCase() !== filtroCiudad.toLowerCase()) {
        return false;
      }

      // 2. Filtro por Categoría
      if (
        filtroCategoria !== 'Todas las Categorías' &&
        !evento.category.toLowerCase().includes(filtroCategoria.toLowerCase())
      ) {
        return false;
      }

      // 3. Filtro por Tiempo
      const fechaEv = new Date(evento.start_date);
      if (filtroTiempo === 'semana') {
        if (fechaEv < inicioSemana || fechaEv > finSemana) return false;
      } else if (filtroTiempo === 'mes') {
        if (fechaEv.getMonth() !== mesActual || fechaEv.getFullYear() !== yearActual) return false;
      } else if (filtroTiempo === 'proximos') {
        if (fechaEv < hoy) return false;
      }

      // 4. Búsqueda de Texto
      if (termino) {
        const enTitulo = evento.title.toLowerCase().includes(termino);
        const enCiudad = evento.city.toLowerCase().includes(termino);
        const enLugar = evento.location_name.toLowerCase().includes(termino);
        const enDesc = evento.description.toLowerCase().includes(termino);
        const enCat = evento.category.toLowerCase().includes(termino);
        if (!enTitulo && !enCiudad && !enLugar && !enDesc && !enCat) return false;
      }

      return true;
    });
  }, [events, busqueda, filtroCiudad, filtroTiempo, filtroCategoria]);

  const handleAttendanceReward = (pointsEarned: number) => {
    setToastMessage(`¡Felicidades! Has ganado +${pointsEarned} puntos por confirmar tu asistencia.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 selection:bg-purple-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HERO SECTION DE LA AGENDA */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 via-white to-slate-50 pt-28 pb-14 sm:pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold uppercase tracking-wider">
                <CalendarDays className="w-4 h-4 text-purple-700" />
                <span>Cartelera Cultural Oficial de Nicaragua</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                Agenda de Festivales, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 bg-clip-text text-transparent">
                  Tradiciones y Noches Vivas
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
                Descubre en tiempo real ferias de artesanía, festivales de marimbas, conciertos tradicionales y eventos artísticos en todas las ciudades de la Red Creativa. ¡Asiste y acumula puntos de explorador cultural!
              </p>
            </div>

            {/* Quick Stats & Action Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs text-center">
                  <span className="block text-2xl font-black text-purple-700">
                    {events.length}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Eventos Activos
                  </span>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs text-center">
                  <span className="block text-2xl font-black text-amber-600">
                    +{events.reduce((acc, e) => acc + (e.points_reward || 100), 0)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Puntos Disponibles
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProposeModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar una Actividad Cultural</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Buscador de Texto */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por festival, municipio, monumento o tipo de evento..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all font-medium"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 p-1"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Selector de Ciudad */}
            <div className="flex items-center gap-2 sm:w-64">
              <MapPin className="w-4 h-4 text-purple-700 shrink-0" />
              <select
                value={filtroCiudad}
                onChange={(e) => setFiltroCiudad(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-medium cursor-pointer"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c === 'Todas' ? '🏙️ Todas las Ciudades' : `📍 ${c}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chips de Tiempo y Categorías */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            
            {/* Filtros de Tiempo */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              {FILTROS_TIEMPO.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFiltroTiempo(f.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    filtroTiempo === f.key
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Selector de Categoría */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 hidden sm:inline">
                Categoría:
              </span>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-purple-600 font-bold cursor-pointer"
              >
                {CATEGORIAS_CULTURALES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* CUADRÍCULA DE EVENTOS CULTURALES */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Header de Resultados */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
              <span>Eventos Encontrados</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900">
                {eventosFiltrados.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Haz clic en cualquier evento para ver el programa completo y confirmar tu asistencia.
            </p>
          </div>

          <button
            type="button"
            onClick={loadEvents}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs flex items-center gap-2 text-xs font-bold cursor-pointer transition-all active:scale-95"
            title="Actualizar eventos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-700' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-purple-700">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cargando cartelera cultural en vivo...
            </p>
          </div>
        ) : eventosFiltrados.length === 0 ? (
          /* Empty State */
          <div className="p-12 sm:p-16 rounded-[2.5rem] bg-white border border-slate-200 text-center shadow-xs space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto border border-purple-200">
              <CalendarDays className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-950">
                No se encontraron actividades con estos filtros
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-normal">
                Prueba ajustando los criterios de búsqueda, seleccionando otra ciudad o publicando una nueva actividad.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setBusqueda('');
                  setFiltroCiudad('Todas');
                  setFiltroTiempo('todas');
                  setFiltroCategoria('Todas las Categorías');
                }}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Restablecer Filtros
              </button>
              <button
                type="button"
                onClick={() => setIsProposeModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md cursor-pointer"
              >
                Inscribir Evento
              </button>
            </div>
          </div>
        ) : (
          /* Grid de Eventos */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventosFiltrados.map((evento) => (
              <EventCard
                key={evento.id}
                evento={evento}
                onSelect={(ev) => setSelectedEvent(ev)}
              />
            ))}
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL DE DETALLE DE EVENTO */}
      {/* ========================================================================= */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onAttendanceConfirmed={handleAttendanceReward}
      />

      {/* ========================================================================= */}
      {/* MODAL PARA PROPONER / PUBLICAR EVENTO */}
      {/* ========================================================================= */}
      <ProposeEventModal
        isOpen={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
        onEventCreated={loadEvents}
      />

    </div>
  );
}
