"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Filter, Sparkles, CalendarDays, Search, ArrowRight } from 'lucide-react';
import { EventCard, Evento } from './components/EventCard';
import { FilterChip } from './components/ui/FilterChip';

const EVENTOS_AGENDA: Evento[] = [
  {
    id: 1,
    titulo: 'Noche de Mitos y Leyendas',
    ciudad: 'León',
    lugar: 'Plaza Sutiaba',
    fecha: '15 Ago',
    hora: '19:00 - 22:00',
    categoria: 'Tradición',
    imagen: 'https://images.unsplash.com/photo-1542296332-2a44733e56a9?w=1200&h=800&fit=crop&auto=format',
    colorTag: 'bg-violet-100 text-violet-800',
  },
  {
    id: 2,
    titulo: 'Festival de la Marimba',
    ciudad: 'Masaya',
    lugar: 'Mercado de Artesanías',
    fecha: '22 Ago',
    hora: '16:00 - 20:00',
    categoria: 'Música',
    imagen: 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=1200&h=800&fit=crop&auto=format',
    colorTag: 'bg-fuchsia-100 text-fuchsia-800',
  },
  {
    id: 3,
    titulo: 'Taller de Cerámica Viva',
    ciudad: 'San Juan de Oriente',
    lugar: 'Taller Escuela de Cerámica',
    fecha: '28 Ago',
    hora: '09:00 - 12:00',
    categoria: 'Arte y Taller',
    imagen: 'https://images.unsplash.com/photo-1610719875571-0618059ffbd2?w=1200&h=800&fit=crop&auto=format',
    colorTag: 'bg-amber-100 text-amber-800',
  },
  {
    id: 4,
    titulo: 'Feria Gastronómica Colonial',
    ciudad: 'Granada',
    lugar: 'Plaza de la Independencia',
    fecha: '05 Sep',
    hora: '11:00 - 18:00',
    categoria: 'Gastronomía',
    imagen: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop&auto=format',
    colorTag: 'bg-orange-100 text-orange-800',
  },
  {
    id: 5,
    titulo: 'Ruta del Muralismo Abierto',
    ciudad: 'Estelí',
    lugar: 'Centro Histórico',
    fecha: '12 Sep',
    hora: '14:00 - 17:00',
    categoria: 'Arte Urbano',
    imagen: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1200&h=800&fit=crop&auto=format',
    colorTag: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 6,
    titulo: 'Festival Palo de Mayo Vibes',
    ciudad: 'Bluefields',
    lugar: 'Parque Reyes',
    fecha: '30 Sep',
    hora: '15:00 - 23:00',
    categoria: 'Danza y Cultura',
    imagen: 'https://images.unsplash.com/photo-1533147670608-2a2f9776d3ac?w=1200&h=800&fit=crop&auto=format',
    colorTag: 'bg-cyan-100 text-cyan-800',
  },
];

const FILTROS_TIEMPO = ['Todas', 'Hoy', 'Esta semana', 'Este mes'];
const CIUDADES_FILTRO = ['León', 'Masaya', 'Granada', 'Estelí', 'Bluefields', 'San Juan de Oriente', 'Managua', 'Matagalpa', 'Juigalpa', 'Rivas'];

export default function AgendaPage() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroCiudad, setFiltroCiudad] = useState('Todas');
  const [filtroTiempo, setFiltroTiempo] = useState('Todas');

  // Helper: parse fecha like "15 Ago" into a Date (current year)
  const parseFecha = (fechaStr: string) => {
    const meses: { [k: string]: number } = {
      Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5, Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11,
    };
    const parts = fechaStr.split(' ');
    const dia = parseInt(parts[0], 10);
    const mesTxt = parts[1];
    const mes = meses[mesTxt] ?? 0;
    const year = new Date().getFullYear();
    return new Date(year, mes, dia);
  };

  const eventosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    const hoy = new Date();

    const filtered = EVENTOS_AGENDA.filter((evento) => {
      const coincideCiudad = filtroCiudad === 'Todas' || evento.ciudad === filtroCiudad;
      const coincideBusqueda = termino === '' || evento.titulo.toLowerCase().includes(termino) || evento.ciudad.toLowerCase().includes(termino) || evento.categoria.toLowerCase().includes(termino);

      if (!coincideCiudad || !coincideBusqueda) return false;

      // tiempo
      const fechaEvento = parseFecha(evento.fecha);
      if (filtroTiempo === 'Hoy') {
        return fechaEvento.getDate() === hoy.getDate() && fechaEvento.getMonth() === hoy.getMonth() && fechaEvento.getFullYear() === hoy.getFullYear();
      }
      if (filtroTiempo === 'Esta semana') {
        const diff = (fechaEvento.getTime() - hoy.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
      }
      if (filtroTiempo === 'Este mes') {
        return fechaEvento.getMonth() === hoy.getMonth() && fechaEvento.getFullYear() === hoy.getFullYear();
      }

      return true;
    });

    // Ordenar por fecha ascendente y por título
    filtered.sort((a, b) => {
      const da = parseFecha(a.fecha).getTime();
      const db = parseFecha(b.fecha).getTime();
      if (da !== db) return da - db;
      return a.titulo.localeCompare(b.titulo);
    });

    return filtered;
  }, [busqueda, filtroCiudad, filtroTiempo]);

  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans pt-4 lg:pt-24 pb-32">
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
          <div className="grid gap-8 xl:grid-cols-[1.4fr_0.9fr] items-start">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
              <div className="relative p-10 lg:p-14 xl:p-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm">
                  <Sparkles size={16} /> Agenda más activa
                </span>
                <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-2xl">
                  Próximos eventos culturales en las Ciudades Creativas
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  Descubrí los eventos, talleres y festivales más destacados de Nicaragua. Filtra por ciudad, explora actividades y encontrá tu próxima experiencia cultural.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-3xl border border-slate-100 bg-white p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-600">Eventos</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{EVENTOS_AGENDA.length}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-100 bg-white p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-600">Ciudades</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{new Set(EVENTOS_AGENDA.map(e => e.ciudad)).size}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-100 bg-white p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-600">Categorías</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{new Set(EVENTOS_AGENDA.map(e => e.categoria)).size}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-100 bg-white p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-600">Favoritos</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">+2.4K</p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="rounded-3xl border border-purple-50 bg-purple-50 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-purple-700 font-semibold mb-4">Recibí lo mejor</p>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Suscribite y no te pierdas nada</h2>
                <p className="text-slate-600 leading-7">
                  Recibí en tu correo los eventos, novedades y experiencias de las ciudades creativas de Nicaragua.
                </p>
                <div className="mt-6 space-y-4">
                  <input
                    type="email"
                    placeholder="tu@correo.com"
                    className="w-full rounded-3xl border border-slate-100 bg-white px-5 py-3 text-slate-700 placeholder:text-slate-400 outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-50"
                  />
                  <button className="w-full rounded-3xl bg-purple-700 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow transition-colors hover:bg-purple-800">
                    Suscribirme
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-600 font-semibold mb-4">Top ciudades</p>
                <div className="grid gap-3">
                  {['León', 'Masaya', 'Granada', 'Estelí'].map((ciudad) => (
                    <div key={ciudad} className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">{ciudad}</p>
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-600 uppercase tracking-[0.2em]">
                          +14 eventos
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-purple-50 text-purple-700">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-600 font-semibold">Inspiración</p>
                  <p className="mt-2 text-slate-700 leading-6">
                    Encuentra un plan perfecto para tu viaje cultural a Nicaragua.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-violet-300 font-semibold">Agenda Cultural</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">Próximos eventos que no te podés perder</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {FILTROS_TIEMPO.map((item) => (
              <button
                key={item}
                onClick={() => setFiltroTiempo(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filtroTiempo === item ? 'bg-purple-700 text-white shadow-[0_8px_30px_rgba(99,102,241,0.12)]' : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white rounded-[2rem] border border-slate-100 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div>
                <span className="text-sm uppercase tracking-[0.25em] text-purple-700">Buscar evento</span>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">Filtrá por ciudad o palabra clave</h3>
              </div>
              <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-slate-100 bg-white px-4 py-3">
                <Search className="text-purple-700" size={18} />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                  placeholder="Buscar marimba, taller, León..."
                  className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {CIUDADES_FILTRO.slice(0, 9).map((ciudad) => (
                <button
                  key={ciudad}
                  onClick={() => setFiltroCiudad(ciudad)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filtroCiudad === ciudad ? 'bg-purple-700 text-white shadow-[0_8px_30px_rgba(99,102,241,0.12)]' : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'}`}
                >
                  {ciudad}
                </button>
              ))}
              <button
                onClick={() => setFiltroCiudad('Todas')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filtroCiudad === 'Todas' ? 'bg-white text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.04)]' : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'}`}
              >
                Todas
              </button>
            </div>

            {eventosFiltrados.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
                {eventosFiltrados.map((evento) => (
                  <EventCard key={evento.id} evento={evento} />
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-slate-100 bg-white p-10 text-center text-slate-700 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                <CalendarDays size={48} className="mx-auto text-purple-700 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No hay resultados</h3>
                <p className="max-w-xl mx-auto text-slate-600">No encontramos ningún evento con esos filtros. Probá cambiar términos o seleccioná otra ciudad.</p>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button className="rounded-full bg-white px-10 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 shadow-[0_18px_40px_rgba(255,255,255,0.18)] hover:bg-slate-100 transition-colors">
                Cargar más eventos
              </button>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <p className="text-sm uppercase tracking-[0.2em] text-purple-700 font-semibold mb-4">Resumen rápido</p>
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-sm text-slate-600">Eventos disponibles</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{eventosFiltrados.length}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-sm text-slate-600">Ciudad seleccionada</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{filtroCiudad}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-sm text-slate-600">Recomendación</p>
                  <p className="mt-2 text-slate-900 leading-7">Viví un recorrido cultural con música, artesanía y gastronomía en un solo fin de semana.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-4 mb-5">
                <span className="rounded-3xl bg-purple-50 px-4 py-2 text-sm text-purple-700">Guía rápida</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-500">Top</span>
              </div>
              <ul className="space-y-4 text-slate-700">
                <li className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Elige la ciudad</p>
                  <p className="text-sm text-slate-600">Filtra rápidamente según la ciudad que querés visitar.</p>
                </li>
                <li className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Encuentra el evento</p>
                  <p className="text-sm text-slate-600">Usá la búsqueda para ver talleres, música o gastronomía.</p>
                </li>
                <li className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Planifica tu viaje</p>
                  <p className="text-sm text-slate-600">Agrupa actividades por fecha y armá un fin de semana completo.</p>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
