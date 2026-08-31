'use client';

import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Compass,
  Landmark,
  Calendar,
  Users,
  Award,
  ShieldAlert,
  LogOut,
  Sparkles,
  Map,
} from 'lucide-react';
import Link from 'next/link';

export type AdminTab = 
  | 'resumen'
  | 'departamentos'
  | 'ciudades'
  | 'rutas'
  | 'solicitudes'
  | 'eventos'
  | 'usuarios'
  | 'logros'
  | 'reportes';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingRequestsCount: number;
  pendingReportsCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingRequestsCount,
  pendingReportsCount,
}) => {
  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'resumen', label: 'Vista General', icon: LayoutDashboard },
    { id: 'departamentos', label: 'Departamentos & Delegados', icon: Map },
    { id: 'ciudades', label: 'Ciudades Creativas', icon: Landmark },
    { id: 'rutas', label: 'Circuitos y Rutas', icon: Compass },
    { 
      id: 'solicitudes', 
      label: 'Solicitudes Emprendedor', 
      icon: ClipboardList,
      badge: pendingRequestsCount,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
    },
    { id: 'eventos', label: 'Agenda y Eventos', icon: Calendar },
    { id: 'usuarios', label: 'Usuarios y Roles', icon: Users },
    { id: 'logros', label: 'Logros y Gamificación', icon: Award },
    { 
      id: 'reportes', 
      label: 'Reportes y Moderación', 
      icon: ShieldAlert,
      badge: pendingReportsCount,
      badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300 font-bold'
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 shadow-xs">
      <div className="space-y-6">
        
        {/* Navigation Menu */}
        <div className="space-y-1">
          <div className="px-3 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Módulos del Sistema
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-purple-100 text-purple-900'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Info Box */}
        <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-3.5 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Base de Datos Activa</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Las modificaciones en rutas, ciudades y departamentos impactan las consultas de la aplicación pública en tiempo real.
          </p>
        </div>

      </div>

      {/* Footer / Quick Links */}
      <div className="pt-4 border-t border-slate-200 mt-6 space-y-2">
        <Link
          href="/"
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-slate-100 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>Salir al Portal</span>
        </Link>
      </div>
    </aside>
  );
};
