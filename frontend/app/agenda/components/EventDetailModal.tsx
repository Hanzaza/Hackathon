'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Share2,
  X,
  Check,
  ExternalLink,
  Award,
  CalendarPlus,
  Compass,
} from 'lucide-react';
import { AdminEventItem, adminService } from '@/services/adminService';
import { useAuth } from '@/context/AuthContext';

interface EventDetailModalProps {
  event: AdminEventItem | null;
  onClose: () => void;
  onAttendanceConfirmed?: (points: number) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onAttendanceConfirmed,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  const formattedDate = startDate.toLocaleDateString('es-NI', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = `${startDate.toLocaleTimeString('es-NI', {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${endDate.toLocaleTimeString('es-NI', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  const handleConfirmAttendance = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await adminService.confirmEventAttendance(
        user!.id,
        event.id,
        event.points_reward || 100
      );
      if (res.success) {
        setConfirmed(true);
        if (onAttendanceConfirmed) {
          onAttendanceConfirmed(res.pointsEarned);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description}\n\nOrganizado en la Red de Ciudades Creativas de Nicaragua.`);
    const location = encodeURIComponent(`${event.location_name}, ${event.city}, Nicaragua`);
    
    // Format YYYYMMDDTHHmmSSZ
    const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Te invito a ${event.title} en ${event.city}. ¡Conéctate con la Red de Ciudades Creativas de Nicaragua!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col text-slate-900">
        
        {/* Banner Superior con Imagen */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-100 shrink-0">
          <Image
            src={event.image || 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=1200&h=800&fit=crop&auto=format'}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all cursor-pointer z-10"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges Flotantes */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-700 text-white backdrop-blur-md shadow-sm">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-slate-950" />
              <span>+{event.points_reward || 100} pts</span>
            </span>
          </div>

          {/* Título sobre la Imagen */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">
              {event.title}
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 flex items-center gap-1.5 mt-1 font-semibold">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{event.location_name} • {event.city}, Nicaragua</span>
            </p>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Metadatos Rápidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Fecha del Evento
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 capitalize">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Horario Programado
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {formattedTime}
                </span>
              </div>
            </div>
          </div>

          {/* Descripción Completa */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              Acerca de esta Experiencia Cultural
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Banner de Gamificación */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Award className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  Recompensa para Exploradores
                </h4>
                <p className="text-[11px] text-slate-600">
                  Confirma tu asistencia y suma <strong>+{event.points_reward || 100} puntos</strong> a tu perfil para desbloquear insignias y reconocimientos oficiales.
                </p>
              </div>
            </div>
          </div>

          {/* Acciones de Calendario y Compartir */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={generateGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 border border-slate-200"
            >
              <CalendarPlus className="w-4 h-4 text-purple-700" />
              <span>Añadir a Google Calendar</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 border border-slate-200 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span>{copied ? '¡Enlace Copiado!' : 'Compartir Evento'}</span>
            </button>

            <Link
              href={`/ciudades-creativas/${event.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="px-4 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-all flex items-center gap-2 border border-purple-200 ml-auto"
            >
              <Compass className="w-4 h-4 text-purple-700" />
              <span>Ver {event.city} en la Red</span>
            </Link>
          </div>

        </div>

        {/* Footer con Botón Principal */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            Cerrar
          </button>

          <button
            type="button"
            disabled={isSubmitting || confirmed}
            onClick={handleConfirmAttendance}
            className={`px-6 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer ${
              confirmed
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-600/30 active:scale-95'
            }`}
          >
            {confirmed ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Asistencia Confirmada (+{event.points_reward || 100} pts)!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Registrando...' : `Confirmar Asistencia (+${event.points_reward || 100} pts)`}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
