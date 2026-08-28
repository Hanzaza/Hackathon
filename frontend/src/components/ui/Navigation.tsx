'use client'; 

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  IoHome, 
  IoHomeOutline, 
  IoCompass, 
  IoCompassOutline, 
  IoCalendar, 
  IoCalendarOutline, 
  IoMap, 
  IoMapOutline, 
  IoStorefront, 
  IoStorefrontOutline,
} from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon } from 'lucide-react';

// Enlaces de la barra de navegación para escritorio
const DESKTOP_NAV_ITEMS = [
  { name: 'Inicio', href: '/' },
  { name: 'Circuitos Creativos', href: '/circuitos' },
  { name: 'Agenda', href: '/agenda' },
  { name: 'Experiencias', href: '/experiencias' },
  { name: 'Mapa', href: '/ciudades-creativas' },
  { name: 'Emprendedores', href: '/emprendedores' },
];

// Enlaces de la barra de navegación inferior para móviles con iconos emparejados (Sólido / Línea)
const MOBILE_NAV_ITEMS = [
  { name: 'Inicio', href: '/', iconActive: IoHome, iconInactive: IoHomeOutline },
  { name: 'Circuitos', href: '/circuitos', iconActive: IoCompass, iconInactive: IoCompassOutline },
  { name: 'Agenda', href: '/agenda', iconActive: IoCalendar, iconInactive: IoCalendarOutline },
  { name: 'Mapa', href: '/ciudades-creativas', iconActive: IoMap, iconInactive: IoMapOutline },
  { name: 'Emprendedores', href: '/emprendedores', iconActive: IoStorefront, iconInactive: IoStorefrontOutline },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  if (pathname === '/login' || pathname.startsWith('/admin')) return null;

  // El logo móvil sólo se muestra en las secciones principales (Home, Agenda, Emprendedores, Experiencias, etc.)
  // y desaparece en vistas interactivas del mapa o detalle para no superponerse con controles o modales.
  const isMapRoute = pathname.startsWith('/ciudades-creativas');
  const showMobileTopLogo = !isMapRoute;

  return (
    <>
      {/* ================= 0. LOGO CIRCULAR MÓVIL (Superior Derecho - Al tocar despliega Login Card / Registro) ================= */}
      {showMobileTopLogo && (
        <div className="lg:hidden fixed top-3 right-3.5 z-[9990] pointer-events-auto animate-fadeIn">
          <button
            type="button"
            onClick={openAuthModal}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] border-2 border-slate-100 flex items-center justify-center p-1 hover:scale-105 active:scale-95 transition-all overflow-hidden relative cursor-pointer group"
            aria-label="Abrir Perfil o Iniciar Sesión"
          >
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={isAuthenticated && user?.avatar ? user.avatar : '/logos/Logo.png'}
                alt={user?.name || 'Logo'}
                fill
                sizes="64px"
                className={`object-contain p-0.5 transition-transform group-hover:scale-110 ${
                  isAuthenticated && user?.avatar ? 'object-cover' : 'scale-110'
                }`}
              />
            </div>

            {/* Badge indicador de estado activo / autenticado */}
            {isAuthenticated ? (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm ring-1 ring-emerald-600/30" />
            ) : (
              <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-black text-white py-0.5 text-center leading-none tracking-tighter">
                LOGIN
              </span>
            )}
          </button>
        </div>
      )}

      {/* ================= 1. NAVBAR DE ESCRITORIO (Flotante Superior) ================= */}
      <nav className="hidden lg:block fixed top-4 left-1/2 z-[9999] w-[min(94vw,1400px)] -translate-x-1/2 pointer-events-auto">
        <div className="rounded-full border border-slate-200/80 bg-white/90 px-6 py-2.5 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="flex items-center justify-between h-[58px]">
            
            {/* LOGO E ISOTIPO INSTITUCIONAL */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src="/logos/Logo.png"
                    alt="The Stateless Logo"
                    fill
                    sizes="40px"
                    className="object-contain drop-shadow-sm"
                  />
                </div>
                <div className="flex flex-col leading-none border-l border-slate-200 pl-3">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-0.5">
                    Red Nacional de
                  </span>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    Ciudades Creativas
                  </span>
                </div>
              </Link>
            </div>

            {/* MENÚ DE ESCRITORIO (Centro) */}
            <div className="flex items-center space-x-7">
              {DESKTOP_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs font-semibold transition-all ${
                      isActive
                        ? 'text-purple-700 font-black border-b-2 border-purple-600 pb-1' 
                        : 'text-slate-700 hover:text-purple-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* ACCIONES (Derecha) */}
            <div className="flex items-center gap-3.5">
              
              {/* Botón de Perfil / Login */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="px-3 py-1.5 rounded-full bg-slate-950 text-purple-300 hover:text-white font-bold text-xs hover:bg-slate-900 transition-all border border-purple-500/40 flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-xs transition-all shadow-sm cursor-pointer"
                    title="Ver Mi Pasaporte Cultural y Panel de Usuario"
                  >
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-purple-200 border border-purple-300">
                      <Image
                        src={user.avatar || '/logos/Logo.png'}
                        alt={user.name}
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    </div>
                    <span className="truncate max-w-[100px]">{user.name}</span>
                    <span className="text-[10px] bg-purple-200/80 text-purple-800 px-1.5 py-0.5 rounded-full font-black">
                      {user.points} pts
                    </span>
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Ingresar</span>
                </button>
              )}

              {/* Botón Principal */}
              <Link
                href="/ciudades-creativas"
                className="px-5 py-2 bg-[#5ce1b4] text-black text-xs font-bold rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Planificá tu visita →
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* ================= 2. NAVBAR MÓVIL (Barra Inferior Estilo App PWA con Altura Cómoda y Safe Area) ================= */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-[9999] bg-black/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-12px_45px_rgba(0,0,0,0.9)] pb-safe pt-2.5">
        <div className="flex items-center justify-around min-h-[64px] max-w-md mx-auto px-3">
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = isActive ? item.iconActive : item.iconInactive;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'text-white font-black scale-105' 
                    : 'text-white/60 hover:text-white font-medium active:scale-95'
                }`}
              >
                <div className={`relative p-2 rounded-2xl transition-all duration-200 ${
                  isActive ? 'bg-white/15 shadow-[0_0_16px_rgba(255,255,255,0.15)]' : ''
                }`}>
                  <Icon 
                    className={`w-[24px] h-[24px] shrink-0 transition-all duration-200 ${
                      isActive 
                        ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                        : 'text-white/70'
                    }`} 
                  />
                  {isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
                  )}
                </div>
                <span className={`text-[10.5px] tracking-tight mt-1 leading-none transition-colors ${
                  isActive ? 'text-white font-black' : 'text-white/60 font-medium'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}