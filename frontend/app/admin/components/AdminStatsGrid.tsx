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
      title: 'Solicitudes Pendientes',
      value: stats.pendingRequests,
      desc: 'Emprendedores esperando aprobación',
      icon: Clock,
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-300',
      textColor: 'text-amber-400',
      actionTab: 'solicitudes' as AdminTab,
      highlight: stats.pendingRequests > 0,
    },
    {
      title: 'Usuarios Registrados',
      value: stats.totalUsers,
      desc: 'Comunidad de exploradores',
      icon: Users,
      gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
      borderColor: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20 text-blue-300',
      textColor: 'text-blue-400',
      actionTab: 'usuarios' as AdminTab,
    },
    {
      title: 'Emprendimientos Activos',
      value: stats.totalEntrepreneurs,
      desc: 'Negocios locales certificados',
      icon: Store,
      gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20 text-emerald-300',
      textColor: 'text-emerald-400',
      actionTab: 'solicitudes' as AdminTab,
    },
    {
      title: 'Circuitos y Rutas',
      value: stats.totalRoutes,
      desc: 'Experiencias culturales vivas',
      icon: Compass,
      gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/20',
      iconBg: 'bg-purple-500/20 text-purple-300',
      textColor: 'text-purple-400',
      actionTab: 'rutas' as AdminTab,
    },
    {
      title: 'Ciudades Creativas',
      value: stats.totalCities,
      desc: 'Red nacional de municipios',
      icon: Landmark,
      gradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
      borderColor: 'border-indigo-500/20',
      iconBg: 'bg-indigo-500/20 text-indigo-300',
      textColor: 'text-indigo-400',
      actionTab: 'ciudades' as AdminTab,
    },
    {
      title: 'Eventos en Agenda',
      value: stats.totalEvents,
      desc: 'Ferias y festivales activos',
      icon: Calendar,
      gradient: 'from-pink-500/20 via-pink-500/5 to-transparent',
      borderColor: 'border-pink-500/20',
      iconBg: 'bg-pink-500/20 text-pink-300',
      textColor: 'text-pink-400',
      actionTab: 'eventos' as AdminTab,
    },
    {
      title: 'Reportes Pendientes',
      value: stats.pendingReports,
      desc: 'Atención a moderación',
      icon: ShieldAlert,
      gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-500/20',
      iconBg: 'bg-rose-500/20 text-rose-300',
      textColor: 'text-rose-400',
      actionTab: 'reportes' as AdminTab,
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Banner de Bienvenida */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Centro de Control Administrativo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Red Nacional de Ciudades Creativas de Nicaragua
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Monitoreo y administración integral de circuitos turísticos, solicitudes de emprendimiento local, catálogo de reconocimientos y eventos culturales conectados a PostgreSQL en Supabase.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('solicitudes')}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Clock className="w-4 h-4" />
              <span>Revisar Solicitudes ({stats.pendingRequests})</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('rutas')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Crear Ruta</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">
              Indicadores Principales
            </h3>
          </div>
          <span className="text-xs text-slate-400">Actualizado en tiempo real</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <div
                key={idx}
                onClick={() => onNavigate(card.actionTab)}
                className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.gradient} bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer group`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>

                <div className="mt-4 space-y-1">
                  <span className="text-xs font-semibold text-slate-400">
                    {card.title}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-black ${card.textColor}`}>
                      {card.value}
                    </span>
                    {card.highlight && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Atención
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
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
