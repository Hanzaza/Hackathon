'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { AdminEventItem } from '@/services/adminService';

interface EventCardProps {
  evento: AdminEventItem;
  onSelect: (evento: AdminEventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ evento, onSelect }) => {
  const startDate = new Date(evento.start_date);
  
  const dia = startDate.getDate().toString().padStart(2, '0');
  const mes = startDate.toLocaleDateString('es-NI', { month: 'short' }).toUpperCase();
  const hora = startDate.toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' });

  // Map category to color scheme
  const getCategoryColor = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('música') || c.includes('marimba')) return 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-200';
    if (c.includes('artesanía') || c.includes('cerámica')) return 'bg-amber-100 text-amber-900 border-amber-200';
    if (c.includes('gastronomía')) return 'bg-orange-100 text-orange-900 border-orange-200';
    if (c.includes('urbano') || c.includes('mural')) return 'bg-emerald-100 text-emerald-900 border-emerald-200';
    if (c.includes('danza') || c.includes('caribe')) return 'bg-cyan-100 text-cyan-900 border-cyan-200';
    return 'bg-purple-100 text-purple-900 border-purple-200';
  };

  return (
    <article
      onClick={() => onSelect(evento)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Imagen Superior */}
      <div>
        <div className="relative h-60 w-full overflow-hidden bg-slate-100">
          <Image
            src={evento.image || 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=800&auto=format&fit=crop'}
            alt={evento.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Badge de Fecha */}
          <div className="absolute left-4 top-4 rounded-2xl bg-white/95 backdrop-blur-md px-3.5 py-2 text-center shadow-md border border-slate-200">
            <span className="block text-2xl font-black text-slate-950 leading-none">{dia}</span>
            <span className="block text-[10px] font-black uppercase tracking-widest text-purple-700 mt-0.5">{mes}</span>
          </div>

          {/* Badge de Categoría & Puntos */}
          <div className="absolute right-4 top-4 flex flex-col items-end gap-1.5">
            <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm border backdrop-blur-md ${getCategoryColor(evento.category)}`}>
              {evento.category}
            </span>
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-slate-950" />
              <span>+{evento.points_reward || 100} pts</span>
            </span>
          </div>

          {/* Título & Ciudad sobre el banner */}
          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <h3 className="text-lg sm:text-xl font-black leading-tight drop-shadow-md line-clamp-2">
              {evento.title}
            </h3>
            <p className="text-xs text-purple-200 flex items-center gap-1 mt-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{evento.city}</span>
            </p>
          </div>
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {evento.description}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700">
              <MapPin size={15} className="text-purple-700 shrink-0" />
              <span className="truncate font-medium">{evento.location_name}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700">
              <Clock size={15} className="text-purple-700 shrink-0" />
              <span className="font-bold">{hora}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer de Acción */}
      <div className="px-5 pb-5 pt-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(evento);
          }}
          className="w-full py-2.5 px-4 rounded-2xl bg-purple-50 hover:bg-purple-700 text-purple-900 hover:text-white border border-purple-200 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs group-hover:bg-purple-700 group-hover:text-white"
        >
          <span>Ver Detalles & Asistir</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
};
