'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Compass,
  ArrowLeft,
  ArrowRight,
  Landmark,
  Calendar,
  Utensils,
  Store,
  CheckCircle2,
  Clock,
  Navigation as NavigationIcon,
  AlertTriangle,
  Lock,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { adminService, MunicipalityItem } from '@/services/adminService';

export interface CityData {
  name: string;
  slug: string;
  badge: string;
  logo: string;
  subtitle: string;
  description: string;
  coverImage?: string;
  status?: 'active' | 'inactive';
  theme: {
    color: string;
    gradient: string;
    accent: string;
    lightBg: string;
    border: string;
    text: string;
  };
  specialties: string[];
  attractions: {
    name: string;
    desc: string;
    category?: string;
    image?: string;
  }[];
  circuits: {
    name: string;
    desc: string;
    duration?: string;
    distance?: string;
  }[];
  agenda: {
    event: string;
    date: string;
    desc?: string;
  }[];
  gastronomy: string;
}

interface CityDetailViewProps {
  city: CityData;
  prevCity?: { name: string; slug: string };
  nextCity?: { name: string; slug: string };
}

export default function CityDetailView({ city, prevCity, nextCity }: CityDetailViewProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'patrimonio' | 'circuitos' | 'gastronomia' | 'agenda'>('patrimonio');
  const [cityStatus, setCityStatus] = useState<'active' | 'inactive'>(city.status || 'active');

  useEffect(() => {
    // Sincronizar estado en tiempo real con el panel de administración
    adminService.getCities().then((cities) => {
      const match = cities.find((c) => c.slug === city.slug || c.name.toLowerCase() === city.name.toLowerCase());
      if (match && match.status) {
        setCityStatus(match.status);
      }
    });
  }, [city.slug, city.name]);

  const isAdmin = user?.role === 'admin';
  const isInactive = cityStatus === 'inactive';

  // Si la ciudad está inhabilitada y el usuario NO es admin, mostrar pantalla de mantenimiento elegante
  if (isInactive && !isAdmin) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="relative max-w-lg w-full bg-slate-900/90 border border-amber-500/30 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/10 animate-pulse">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30 inline-block">
              Curaduría & Mantenimiento
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {city.name} en Actualización
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Estamos trabajando en la curaduría cultural, nuevas rutas interactivas y registro de emprendedores para esta Ciudad Creativa.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 text-left text-xs space-y-1.5 text-slate-300">
            <div className="flex items-center gap-2 font-bold text-white">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Próximamente disponible:</span>
            </div>
            <p className="text-[11px] text-slate-400 pl-6">
              • Nuevos circuitos con navegación 3D geolocalizada.
            </p>
            <p className="text-[11px] text-slate-400 pl-6">
              • Agenda de ferias, festivales y talleres vivenciales.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/ciudades-creativas"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar Otras Ciudades</span>
            </Link>

            <Link
              href="/auth"
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold text-xs border border-white/10 transition-all flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso Administrador</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-6 lg:pt-24 pb-36">
      
      {/* Banner Exclusivo de Vista Previa para Administradores */}
      {isInactive && isAdmin && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-800">
                  Modo Vista Previa de Administrador
                </h4>
                <p className="text-xs text-amber-700 font-medium">
                  Esta ciudad está en estado <strong>Inactivo / Mantenimiento</strong> y no es visible para los usuarios normales.
                </p>
              </div>
            </div>

            <Link
              href="/admin?tab=ciudades"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs self-start sm:self-auto flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Editar en Panel Admin</span>
            </Link>
          </div>
        </div>
      )}

      {/* MIGA DE PAN (Breadcrumb) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
        <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
          <Link href="/ciudades-creativas" className="hover:text-purple-700 transition-colors flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Ciudades Creativas</span>
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/circuitos" className="hover:text-purple-700 transition-colors">
            Circuitos
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-black">{city.name}</span>
        </div>
      </div>

      {/* HERO PRINCIPAL */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className={`relative rounded-[2.5rem] border ${city.theme.border} bg-white p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.06)] overflow-hidden`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-900 text-[11px] font-black uppercase tracking-wider border border-purple-200 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                  <span>Red Nacional de Ciudades Creativas</span>
                </span>
                <span className={`px-3 py-1 rounded-full ${city.theme.lightBg} ${city.theme.text} text-[11px] font-black uppercase tracking-wider`}>
                  {city.badge}
                </span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-none mb-3">
                  {city.name}
                </h1>
                <p className={`text-sm sm:text-base font-bold ${city.theme.text}`}>
                  {city.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {city.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                {city.specialties.map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-bold"
                  >
                    ✨ {spec}
                  </span>
                ))}
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  href="/ciudades-creativas"
                  className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md shadow-purple-900/20 transition-all inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Ver {city.name} en el Mapa 3D</span>
                </Link>

                <Link
                  href="/emprendedores"
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all inline-flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-purple-700" />
                  <span>Emprendedores de {city.name}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className={`w-full max-w-[280px] p-6 rounded-3xl bg-gradient-to-b ${city.theme.lightBg} border ${city.theme.border} shadow-sm flex flex-col items-center text-center`}>
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 drop-shadow-[0_12px_28px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-300">
                  <Image
                    src={city.logo}
                    alt={`Escudo oficial de ${city.name}`}
                    fill
                    sizes="(max-width: 640px) 160px, 192px"
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4">
                  Emblema Territorial
                </span>
                <span className="text-xs font-black text-slate-800 mt-0.5">
                  {city.name}, Nicaragua
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PESTAÑAS INTERACTIVAS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex rounded-2xl bg-white p-1.5 border border-slate-200 shadow-sm overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('patrimonio')}
            className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'patrimonio'
                ? 'bg-purple-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Patrimonio & Sitios</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('circuitos')}
            className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'circuitos'
                ? 'bg-purple-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Circuitos ({city.circuits.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gastronomia')}
            className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'gastronomia'
                ? 'bg-purple-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Gastronomía Típica</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('agenda')}
            className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'agenda'
                ? 'bg-purple-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda & Tradición</span>
          </button>
        </div>

        <div className="mt-8">
          {activeTab === 'patrimonio' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {city.attractions.map((att, aIdx) => (
                <div
                  key={aIdx}
                  className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {att.category && (
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10.5px] font-black uppercase tracking-wider mb-3">
                        {att.category}
                      </span>
                    )}
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                      {att.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {att.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Sitio Verificado
                    </span>
                    <Link
                      href="/ciudades-creativas"
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
                    >
                      <span>Ver en mapa</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'circuitos' && (
            <div className="space-y-4 animate-fadeIn">
              {city.circuits.map((circ, cIdx) => (
                <div
                  key={cIdx}
                  className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center">
                        {cIdx + 1}
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        {circ.name}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {circ.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                    <div className="flex flex-col text-left">
                      {circ.duration && (
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {circ.duration}
                        </span>
                      )}
                      {circ.distance && (
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                          <NavigationIcon className="w-3.5 h-3.5 text-slate-400" />
                          {circ.distance}
                        </span>
                      )}
                    </div>

                    <Link
                      href="/ciudades-creativas"
                      className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shrink-0"
                    >
                      Comenzar Ruta
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gastronomia' && (
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Sabores Autóctonos de {city.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Patrimonio culinario y recetas tradicionales
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-slate-800 leading-relaxed text-sm sm:text-base font-normal">
                {city.gastronomy}
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-semibold">
                  ¿Buscás restaurantes y comiderías típicas en {city.name}?
                </span>
                <Link
                  href="/emprendedores"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Ver Directorio Gastronómico →
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'agenda' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
              {city.agenda.map((item, agIdx) => (
                <div
                  key={agIdx}
                  className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-purple-100 text-purple-900 text-center shrink-0 min-w-[70px]">
                    <Calendar className="w-4 h-4 mx-auto mb-1 text-purple-700" />
                    <span className="text-[10px] font-black uppercase tracking-wider block">
                      {item.date}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 mb-1">
                      {item.event}
                    </h4>
                    {item.desc && (
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NAVEGACIÓN INFERIOR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevCity ? (
            <Link
              href={`/ciudades-creativas/${prevCity.slug}`}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs shadow-sm transition-all cursor-pointer w-full sm:w-auto justify-center sm:justify-start"
            >
              <ArrowLeft className="w-4 h-4 text-purple-700" />
              <span>Anterior: {prevCity.name}</span>
            </Link>
          ) : <div />}

          <Link
            href="/circuitos"
            className="px-5 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm w-full sm:w-auto justify-center"
          >
            <Compass className="w-4 h-4" />
            <span>Ver las 10 Ciudades Creativas</span>
          </Link>

          {nextCity ? (
            <Link
              href={`/ciudades-creativas/${nextCity.slug}`}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs shadow-sm transition-all cursor-pointer w-full sm:w-auto justify-center sm:justify-end"
            >
              <span>Siguiente: {nextCity.name}</span>
              <ArrowRight className="w-4 h-4 text-purple-700" />
            </Link>
          ) : <div />}
        </div>
      </section>

    </main>
  );
}
