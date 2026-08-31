'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  MapPin,
  X,
  Check,
  Image as ImageIcon,
  Plus,
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useAuth } from '@/context/AuthContext';

interface ProposeEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

export const ProposeEventModal: React.FC<ProposeEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tradición & Folclore',
    city: 'León',
    location_name: '',
    start_date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 86400000 * 2 + 14400000).toISOString().slice(0, 16),
    image: 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=1200&h=800&fit=crop&auto=format',
    points_reward: 120,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!formData.title.trim() || !formData.location_name.trim()) return;

    setIsSubmitting(true);
    try {
      await adminService.createEvent({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        city: formData.city,
        location_name: formData.location_name.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        image: formData.image.trim(),
        points_reward: formData.points_reward,
        status: 'published',
      });

      onEventCreated();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-950">
                Publicar Evento en la Agenda Nacional
              </h3>
              <p className="text-xs text-slate-500">
                Inscribe ferias, festivales artísticos, conciertos o talleres tradicionales.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario con Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4 my-4 text-xs">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
              Título de la Actividad o Festival *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej. Festival de Danzas de las Flores y Marimba"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                Ciudad Creativa / Municipio *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-medium"
              >
                {['León', 'Masaya', 'San Juan de Oriente', 'Catarina', 'Granada', 'Estelí', 'Bluefields', 'Matagalpa', 'Juigalpa', 'Nagarote', 'Managua'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                Categoría Cultural *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-medium"
              >
                <option value="Tradición & Folclore">Tradición & Folclore</option>
                <option value="Música & Danza">Música & Danza</option>
                <option value="Artesanía & Tradición">Artesanía & Tradición</option>
                <option value="Gastronomía Tradicional">Gastronomía Tradicional</option>
                <option value="Arte Urbano">Arte Urbano & Muralismo</option>
                <option value="Literatura & Poesía">Literatura & Poesía</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
              Lugar / Sede Específica *
            </label>
            <input
              type="text"
              required
              value={formData.location_name}
              onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              placeholder="Ej. Mercado de Artesanías de Masaya, Nave Central"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                Fecha y Hora de Inicio *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                Fecha y Hora de Finalización *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
              Descripción y Actividades Programadas
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalla el programa artístico, invitados especiales, gastronomía, entrada libre o requisitos..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
              URL de la Fotografía de Portada
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Publicando...' : 'Publicar en la Agenda'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
