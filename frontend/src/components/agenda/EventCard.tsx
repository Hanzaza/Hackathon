"use client";
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

export type Evento = {
  id: number;
  titulo: string;
  ciudad: string;
  lugar: string;
  fecha: string;
  hora: string;
  categoria: string;
  imagen: string;
  colorTag: string;
};

interface EventCardProps {
  evento: Evento;
}

export const EventCard: React.FC<EventCardProps> = ({ evento }) => {
  const [dia, mes] = evento.fecha.split(' ');

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(139,92,246,0.06)]">
      <div className="relative h-72 overflow-hidden">
        <Image
          src={evento.imagen}
          alt={evento.titulo}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent mix-blend-multiply" />
        <div className="absolute left-5 top-5 rounded-3xl border border-slate-100 bg-white/90 px-4 py-3 text-center shadow-sm">
          <span className="block text-3xl font-extrabold text-slate-900 leading-none">{dia}</span>
          <span className="block text-xs uppercase tracking-[0.3em] text-slate-600 mt-1">{mes}</span>
        </div>
        <span className={`absolute right-5 top-5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] shadow ${evento.colorTag}`}>
          {evento.categoria}
        </span>
      </div>

      <div className="p-6 sm:p-7">
        <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-3 line-clamp-2">{evento.titulo}</h3>
        <p className="text-sm text-slate-600 mb-5 leading-6">{evento.lugar}, {evento.ciudad}</p>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <MapPin size={18} className="text-purple-700" />
            {evento.ciudad}
          </div>
          <div className="flex items-center gap-2 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <Clock size={18} className="text-purple-700" />
            {evento.hora}
          </div>
        </div>

        <Link
          href="#"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-purple-700 bg-purple-50 px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-700 hover:text-white"
        >
          Ver detalle
          <ArrowRight size={18} />
        </Link>
      </div>
    </article>
  );
};
