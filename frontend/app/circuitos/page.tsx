'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  ArrowRight, 
  Landmark, 
  Award,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { adminService, CreativeRouteItem, MunicipalityItem } from '@/services/adminService';

interface CreativeCity {
  id: string;
  name: string;
  badge: string;
  slug: string;
  logo: string;
  tagline: string;
  description: string;
  specialties: string[];
  circuits: { name: string; desc: string; duration?: number; points?: number }[];
  highlight: string;
  theme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    cardBg: string;
    buttonBg: string;
    buttonHover: string;
    accentColor: string;
    gradient: string;
  };
}

const DEFAULT_THEMES = [
  {
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    border: 'border-amber-200/80',
    cardBg: 'bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50',
    buttonBg: 'bg-amber-600',
    buttonHover: 'hover:bg-amber-700',
    accentColor: 'text-amber-700',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-900',
    border: 'border-rose-200/80',
    cardBg: 'bg-gradient-to-br from-rose-50/70 via-white to-red-50/40',
    buttonBg: 'bg-rose-700',
    buttonHover: 'hover:bg-rose-800',
    accentColor: 'text-rose-700',
    gradient: 'from-rose-600 to-red-700'
  },
  {
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
    border: 'border-purple-200/80',
    cardBg: 'bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40',
    buttonBg: 'bg-purple-700',
    buttonHover: 'hover:bg-purple-800',
    accentColor: 'text-purple-700',
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    border: 'border-emerald-200/80',
    cardBg: 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40',
    buttonBg: 'bg-emerald-700',
    buttonHover: 'hover:bg-emerald-800',
    accentColor: 'text-emerald-700',
    gradient: 'from-emerald-600 to-teal-700'
  },
];

export default function CircuitosPage() {
  const [routes, setRoutes] = useState<CreativeRouteItem[]>([]);
  const [cities, setCities] = useState<MunicipalityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [routesData, citiesData] = await Promise.all([
          adminService.getRoutes(),
          adminService.getCities(),
        ]);
        setRoutes(routesData);
        setCities(citiesData);
      } catch (e) {
        console.error('Error loading circuits:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans pb-24 pt-28">
      
      {/* ================= 1. HERO Y ENCABEZADO DE CIRCUITOS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Red Nacional de Ciudades Creativas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            Circuitos Culturales y <br />
            <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 bg-clip-text text-transparent">
              Rutas Turísticas Vivas
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Explorá los recorridos geolocalizados que entrelazan la historia, el arte popular, la gastronomía y las tradiciones en cada uno de los municipios de la Red Creativa de Nicaragua.
          </p>
        </div>

        {/* Dynamic Routes Bar */}
        {routes.length > 0 && (
          <div className="mt-8 p-5 rounded-3xl bg-white border border-slate-200 shadow-xs max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-700" />
                <span>Rutas Temáticas Registradas ({routes.length})</span>
              </h3>
              <Link
                href="/ciudades-creativas"
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                <span>Ver en el Mapa Inmersivo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {routes.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span className="text-purple-700">{r.municipality_name}</span>
                      <span className="text-amber-600">+{r.points_award} pts</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900">{r.name}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 font-normal">{r.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200 text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-600" /> {r.estimated_duration || 120} min
                    </span>
                    <span className="font-bold text-slate-800">{r.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ================= 2. CIUDADES CREATIVAS Y SUS CIRCUITOS ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {cities.map((city, idx) => {
          const theme = DEFAULT_THEMES[idx % DEFAULT_THEMES.length];
          const cityRoutes = routes.filter(
            (r) => r.municipality_name && r.municipality_name.toLowerCase().includes(city.name.toLowerCase())
          );

          return (
            <section
              key={city.id}
              className={`rounded-[2.5rem] border ${theme.border} ${theme.cardBg} p-6 sm:p-10 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* LADO IZQUIERDO: LOGO, NOMBRE Y VOCACIÓN */}
                <div className="lg:col-span-5 flex flex-col items-center text-center p-6 sm:p-8 rounded-[2rem] bg-white/90 border border-slate-200/80 shadow-2xs">
                  
                  {city.logo_url && (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-white p-2 border border-slate-100 shadow-md mb-4 flex items-center justify-center">
                      <Image
                        src={city.logo_url}
                        alt={`Escudo ${city.name}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${theme.badgeBg} ${theme.badgeText}`}>
                    {city.is_creative ? '✨ Ciudad Creativa de la Red' : '🏛️ Municipio Tradicional'}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mt-2">
                    {city.name}
                  </h3>
                  <p className={`text-xs font-bold ${theme.accentColor} mt-1 mb-4 leading-tight`}>
                    {city.subtitle || 'Identidad Cultural & Tradición Viva'}
                  </p>

                  {/* Especialidades culturales */}
                  {city.specialties && city.specialties.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                      {city.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10.5px] font-bold"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* LADO DERECHO: RESUMEN, CIRCUITOS CREATIVOS Y BOTÓN DE VISITA */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                  
                  {/* Encabezado descriptivo */}
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                      <Compass className="w-4 h-4 text-purple-700" />
                      <span>Identidad Territorial & Circuitos</span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-4">
                      Descubrí el encanto creativo de {city.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {city.description || 'Municipio destacado por su riqueza patrimonial, talleres familiares de artesanía, gastronomía autóctona y vibrante vida cultural.'}
                    </p>
                  </div>

                  {/* Lista de Circuitos Creativos */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Circuitos y Recorridos Disponibles:</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {cityRoutes.length > 0 ? (
                        cityRoutes.map((circ) => (
                          <div
                            key={circ.id}
                            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-300 transition-colors flex flex-col justify-between"
                          >
                            <span className="text-xs font-black text-slate-900 mb-1 leading-tight">
                              {circ.name}
                            </span>
                            <span className="text-[11px] text-slate-500 leading-tight line-clamp-2">
                              {circ.description}
                            </span>
                            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
                              <span>⏱️ {circ.estimated_duration || 120} min</span>
                              <span className="text-amber-600">+{circ.points_award} pts</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs sm:col-span-2 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 font-black text-xs text-amber-950">
                            <span>🛠️ Próximamente / En Construcción</span>
                          </div>
                          <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                            Por el momento no hay rutas creativas publicadas para {city.name}. Están en diseño y estarán disponibles pronto, ¡pero ya podés ingresar a conocer todos los demás puntos y sitios emblemáticos de esta ciudad!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones y Botón de Navegación a la Página de la Ciudad */}
                  <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span>Página oficial del Municipio</span>
                    </div>

                    <Link
                      href={`/ciudades-creativas/${city.slug}`}
                      className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl ${theme.buttonBg} ${theme.buttonHover} active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer`}
                    >
                      <span>Visitar {city.name}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                </div>

              </div>
            </section>
          );
        })}
      </div>

      {/* ================= 3. SECCIÓN DE CIERRE E INVITACIÓN AL MAPA 3D ================= */}
      <div className="max-w-4xl mx-auto px-4 mt-16 text-center">
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black mb-3">
              ¿Querés explorar las ciudades en el Mapa Interactivo?
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto mb-6">
              Navegá por los puntos de interés cultural, infraestructura y circuitos geolocalizados en nuestra vista inmersiva 2D/3D con MapLibre GL.
            </p>
            <Link
              href="/ciudades-creativas"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-600 text-white font-black text-xs hover:bg-purple-700 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              <span>Abrir Mapa Interactivo →</span>
            </Link>
          </div>
        </div>
      </div>

    </main>
  );
}
