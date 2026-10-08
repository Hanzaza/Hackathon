'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Star, 
  MessageCircle, 
  ExternalLink, 
  Filter, 
  X,
  CheckCircle2,
  Store,
  ChevronRight,
  Compass
} from 'lucide-react';
import { FaInstagram } from 'react-icons/fa6';
import { FEATURED_ENTREPRENEURS, FeaturedEntrepreneur } from '@/data/emprendedoresData';

const CITIES = [
  'Todas',
  'León',
  'Masaya',
  'Granada',
  'Matagalpa',
  'Estelí',
  'San Juan de Oriente',
  'Nagarote',
  'Bluefields',
] as const;

export default function DirectorioEmprendimientos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('Todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeModalItem, setActiveModalItem] = useState<FeaturedEntrepreneur | null>(null);

  // Filter items
  const filteredList = useMemo(() => {
    return FEATURED_ENTREPRENEURS.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.founder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCity = selectedCity === 'Todas' || item.city === selectedCity;
      const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;

      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [searchTerm, selectedCity, selectedCategory]);

  return (
    <section id="directorio-emprendedores" className="py-16 lg:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-bold mb-2">
            <Store className="w-4 h-4 text-teal-600" />
            <span>Directorio de MiPymes y Talleres Artesanales</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Encuentra y Conecta con Emprendedores Locales
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Apoya el talento nacional y descubre productos únicos visitándolos en sus ciudades o contactándolos directamente.
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200/80 mb-10 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por negocio, artesano, cerámica, café, hamacas..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* City Dropdown Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <MapPin className="w-4 h-4 text-rose-500 hidden sm:inline" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full md:w-48 py-3 px-3.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'Todas' ? '🏙️ Todas las Ciudades' : `📍 ${c}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats & Active Filters */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
            <span>
              Mostrando <strong>{filteredList.length}</strong> de {FEATURED_ENTREPRENEURS.length} emprendimientos
            </span>

            {(searchTerm || selectedCity !== 'Todas' || selectedCategory !== 'Todas') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('Todas');
                  setSelectedCategory('Todas');
                }}
                className="text-amber-600 hover:underline font-semibold cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Directory Cards Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <Store className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No encontramos emprendimientos con esos filtros</h3>
            <p className="text-sm text-slate-500 mt-1">Prueba con otra palabra clave o restablece los filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {item.city}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 font-bold text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-slate-300 text-[11px]">Desde {item.yearEstablished}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Por <strong>{item.founder}</strong> &bull; {item.founderRole}
                    </p>

                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="text-xs font-bold text-slate-800 hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Ver Ficha Completa</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {item.whatsapp && (
                        <a
                          href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}?text=Hola!%20Vi%20su%20negocio%20${encodeURIComponent(item.name)}%20en%20Ciudades%20Creativas%20Nicaragua.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                      <Link
                        href={`/ciudades-creativas/${item.citySlug}`}
                        className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-colors"
                        title="Ver en el Mapa"
                      >
                        <Compass className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="relative h-56 w-full bg-slate-900">
              <Image
                src={activeModalItem.imageUrl}
                alt={activeModalItem.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-xs font-bold mr-2">
                  {activeModalItem.category}
                </span>
                <span className="text-xs text-slate-200">📍 {activeModalItem.city}</span>
                <h3 className="text-2xl font-extrabold mt-1">{activeModalItem.name}</h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 flex-shrink-0">
                  <Image
                    src={activeModalItem.founderAvatar}
                    alt={activeModalItem.founder}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{activeModalItem.founder}</div>
                  <div className="text-xs text-amber-800 font-medium">{activeModalItem.founderRole}</div>
                  <div className="text-[11px] text-slate-500">Fundado en {activeModalItem.yearEstablished}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Descripción & Historia
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeModalItem.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Especialidades
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalItem.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold"
                    >
                      ✓ {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {activeModalItem.whatsapp && (
                    <a
                      href={`https://wa.me/${activeModalItem.whatsapp.replace(/[^0-9]/g, '')}?text=Hola!%20Vi%20su%20negocio%20${encodeURIComponent(activeModalItem.name)}%20en%20Ciudades%20Creativas%20Nicaragua.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contactar por WhatsApp</span>
                    </a>
                  )}
                  {activeModalItem.instagram && (
                    <a
                      href={`https://instagram.com/${activeModalItem.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold transition-colors"
                    >
                      <FaInstagram className="w-4 h-4" />
                      <span>{activeModalItem.instagram}</span>
                    </a>
                  )}
                </div>

                <Link
                  href={`/ciudades-creativas/${activeModalItem.citySlug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-amber-600 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Ver {activeModalItem.city} en Mapa</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
