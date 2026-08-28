'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Check,
} from 'lucide-react';
import { ReportItem, adminService } from '@/services/adminService';

interface ReportsModerationTabProps {
  reports: ReportItem[];
  onRefresh: () => void;
}

export const ReportsModerationTab: React.FC<ReportsModerationTabProps> = ({
  reports,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return r.status === 'pending';
    return r.status === 'resolved' || r.status === 'dismissed';
  });

  const handleResolve = async (id: string, action: 'resolved' | 'dismissed') => {
    setProcessingId(id);
    try {
      await adminService.resolveReport(id, action);
      onRefresh();
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          Bandeja de Moderación y Reportes Ciudadanos
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Revisión de advertencias sobre puntos del mapa, horarios actualizados y moderación comunitaria.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        {[
          { key: 'pending', label: 'Pendientes de Revisión', count: reports.filter((r) => r.status === 'pending').length },
          { key: 'all', label: 'Todos los Reportes', count: reports.length },
          { key: 'resolved', label: 'Procesados', count: reports.filter((r) => r.status !== 'pending').length },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              filter === tab.key
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-white/5 bg-slate-900/40 text-slate-400">
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-500/50 mb-3" />
            <p className="font-bold text-sm text-slate-300">Bandeja al día</p>
            <p className="text-xs mt-1">No hay reportes pendientes de moderación.</p>
          </div>
        ) : (
          filteredReports.map((rep) => (
            <div
              key={rep.id}
              className="p-5 rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/10 text-slate-300">
                    Tipo: {rep.target_type}
                  </span>
                  
                  {rep.status === 'pending' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pendiente
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {rep.status === 'resolved' ? 'Resuelto' : 'Descartado'}
                    </span>
                  )}

                  <span className="text-xs font-bold text-white">
                    Objetivo: {rep.target_name || rep.target_id}
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                  &quot;{rep.reason}&quot;
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    {rep.reported_by_name} ({rep.reported_by_email})
                  </span>
                  <span>•</span>
                  <span>{new Date(rep.created_at).toLocaleDateString('es-NI')}</span>
                </div>
              </div>

              {rep.status === 'pending' && (
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    disabled={processingId === rep.id}
                    onClick={() => handleResolve(rep.id, 'resolved')}
                    className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolver</span>
                  </button>
                  <button
                    type="button"
                    disabled={processingId === rep.id}
                    onClick={() => handleResolve(rep.id, 'dismissed')}
                    className="px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold text-xs transition-colors"
                  >
                    Descartar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
