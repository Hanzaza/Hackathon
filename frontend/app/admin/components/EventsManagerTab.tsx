'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { AdminEventItem, adminService } from '@/services/adminService';

interface EventsManagerTabProps {
  events: AdminEventItem[];
  onRefresh: () => void;
}

export const EventsManagerTab: React.FC<EventsManagerTabProps> = ({ events, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: new Date().toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 3600000 * 4).toISOString().slice(0, 16),
    location_name: '',
    city: 'León',
    category: 'Tradición & Folclore',
    status: 'published' as const,
    image: 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=800&auto=format&fit=crop',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    await adminService.createEvent({
      ...formData,
      organizer: 'Comité de Ciudades Creativas',
    });

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Deseas eliminar este evento cultural?')) {
      await adminService.deleteEvent(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Agenda y Eventos Culturales
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Publicación de ferias, festivales de marimba, noches de leyendas y exposiciones artesanales.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Evento</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-3xl border border-white/10 bg-slate-900/70 overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 w-full bg-slate-950">
                <Image
                  src={event.image || 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=800&auto=format&fit=crop'}
                  alt={event.title}
                  fill
                  sizes="400px"
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-purple-500/80 backdrop-blur-md text-white">
                    {event.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-black text-white leading-snug drop-shadow-md">
                    {event.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{event.location_name} • {event.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>
                      {new Date(event.start_date).toLocaleDateString('es-NI', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/40 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Publicado en Agenda
              </span>

              <button
                type="button"
                onClick={() => handleDelete(event.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                title="Eliminar Evento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Crear Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 space-y-5 text-white shadow-2xl">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-black text-white">Publicar Evento Cultural</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Título del Evento *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Festival Nacional de la Marimba"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ciudad</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    {['León', 'Masaya', 'San Juan de Oriente', 'Granada', 'Estelí', 'Bluefields', 'Matagalpa', 'Juigalpa', 'Nagarote'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Tradición & Folclore">Tradición & Folclore</option>
                    <option value="Música & Danza">Música & Danza</option>
                    <option value="Artesanía & Escultura">Artesanía & Escultura</option>
                    <option value="Gastronomía">Gastronomía</option>
                    <option value="Arte Urbano & Murales">Arte Urbano & Murales</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Lugar / Sede</label>
                <input
                  type="text"
                  required
                  value={formData.location_name}
                  onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                  placeholder="Ej: Mercado de Artesanías de Masaya"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fecha y Hora de Inicio</label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fecha y Hora de Fin</label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre actividades, horarios y atracciones..."
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Publicar en Agenda</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
