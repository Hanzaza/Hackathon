'use client';

import React from 'react';
import {
  Users,
  Store,
  Clock,
  Compass,
  Landmark,
  Calendar,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Map,
} from 'lucide-react';
import { AdminStats } from '@/services/adminService';
import { AdminTab } from './AdminSidebar';

interface AdminStatsGridProps {
  stats: AdminStats;
  onNavigate: (tab: AdminTab) => void;
}

export const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ stats, onNavigate }) => {
  const cards = [
    {
      title: 'Departamentos & Regiones',
      value: stats.totalDepartments || 17,
      desc: '15 Departamentos y 2 Regiones Autónomas',
      icon: Map,
      gradient: 'from-purple-50 via-white to-indigo-50/40',
      borderColor: 'border-purple-200/80',
      iconBg: 'bg-purple-100 text-purple-800',
      textColor: 'text-purple-900',
      actionTab: 'departamentos' as AdminTab,
    },
    {
      title: 'Ciudades Creativas',
      value: stats.totalCities,
      desc: 'Red nacional de municipios',
      icon: Landmark,
      gradient: 'from-indigo-50 via-white to-blue-50/40',
      borderColor: 'border-indigo-200/80',
      iconBg: 'bg-indigo-100 text-indigo-800',
      textColor: 'text-indigo-900',
      actionTab: 'ciudades' as AdminTab,
    },
    {
      title: 'Circuitos y Rutas',
      value: stats.totalRoutes,
      desc: 'Experiencias culturales vivas',
      icon: Compass,
      gradient: 'from-teal-50 via-white to-emerald-50/40',
      borderColor: 'border-teal-200/80',
      iconBg: 'bg-teal-100 text-teal-800',
      textColor: 'text-teal-900',
      actionTab: 'rutas' as AdminTab,
    },
    {
      title: 'Solicitudes Pendientes',
      value: stats.pendingRequests,
      desc: 'Emprendedores esperando aprobación',
      icon: Clock,
      gradient: 'from-amber-50 via-white to-orange-50/40',
      borderColor: 'border-amber-200/80',
      iconBg: 'bg-amber-100 text-amber-900',
      textColor: 'text-amber-900',
      actionTab: 'solicitudes' as AdminTab,
      highlight: stats.pendingRequests > 0,
    },
    {
      title: 'Usuarios Registrados',
      value: stats.totalUsers,
      desc: 'Comunidad de exploradores',
      icon: Users,
      gradient: 'from-blue-50 via-white to-sky-50/40',
      borderColor: 'border-blue-200/80',
      iconBg: 'bg-blue-100 text-blue-800',
      textColor: 'text-blue-900',
      actionTab: 'usuarios' as AdminTab,
    },
    {
      title: 'Emprendimientos Activos',
      value: stats.totalEntrepreneurs,
      desc: 'Negocios locales certificados',
      icon: Store,
      gradient: 'from-emerald-50 via-white to-green-50/40',
      borderColor: 'border-emerald-200/80',
      iconBg: 'bg-emerald-100 text-emerald-800',
      textColor: 'text-emerald-900',
      actionTab: 'solicitudes' as AdminTab,
    },
    {
      title: 'Eventos en Agenda',
      value: stats.totalEvents,
      desc: 'Ferias y festivales activos',
      icon: Calendar,
      gradient: 'from-pink-50 via-white to-rose-50/40',
      borderColor: 'border-pink-200/80',
      iconBg: 'bg-pink-100 text-pink-800',
      textColor: 'text-pink-900',
      actionTab: 'eventos' as AdminTab,
    },
    {
      title: 'Reportes Pendientes',
      value: stats.pendingReports,
      desc: 'Atención a moderación',
      icon: ShieldAlert,
      gradient: 'from-rose-50 via-white to-red-50/40',
      borderColor: 'border-rose-200/80',
      iconBg: 'bg-rose-100 text-rose-800',
      textColor: 'text-rose-900',
      actionTab: 'reportes' as AdminTab,
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Banner de Bienvenida */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-purple-100 text-xs font-bold border border-white/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Centro de Control Administrativo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Red Nacional de Ciudades Creativas de Nicaragua
            </h2>
            <p className="text-sm text-purple-100/90 leading-relaxed font-normal">
              Monitoreo y administración integral de departamentos, circuitos turísticos, solicitudes de emprendimiento local, catálogo de reconocimientos y eventos culturales conectados a PostgreSQL en Supabase.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('departamentos')}
              className="px-4 py-2.5 rounded-2xl bg-white text-purple-950 hover:bg-purple-50 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Map className="w-4 h-4 text-purple-700" />
              <span>Ver Departamentos ({stats.totalDepartments || 17})</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('solicitudes')}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Clock className="w-4 h-4" />
              <span>Revisar Solicitudes ({stats.pendingRequests})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-700" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
              Indicadores Principales
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Actualizado en tiempo real</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <div
                key={idx}
                onClick={() => onNavigate(card.actionTab)}
                className={`relative overflow-hidden rounded-3xl border ${card.borderColor} bg-gradient-to-br ${card.gradient} p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02] cursor-pointer group`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-2xl ${card.iconBg} shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 transition-colors" />
                </div>

                <div className="mt-4 space-y-1">
                  <span className="text-xs font-bold text-slate-600">
                    {card.title}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-black ${card.textColor}`}>
                      {card.value}
                    </span>
                    {card.highlight && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Atención
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
