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
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          Bandeja de Moderación y Reportes Ciudadanos
        </h2>
        <p className="text-xs text-slate-500 mt-1">
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
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-slate-200 bg-white text-slate-500 shadow-xs">
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
            <p className="font-bold text-sm text-slate-800">Bandeja al día</p>
            <p className="text-xs mt-1 text-slate-500">No hay reportes pendientes de moderación.</p>
          </div>
        ) : (
          filteredReports.map((rep) => (
            <div
              key={rep.id}
              className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                    Tipo: {rep.target_type}
                  </span>
                  
                  {rep.status === 'pending' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-700" /> Pendiente
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-700" /> {rep.status === 'resolved' ? 'Resuelto' : 'Descartado'}
                    </span>
                  )}

                  <span className="text-xs font-bold text-slate-900">
                    Objetivo: {rep.target_name || rep.target_id}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  &quot;{rep.reason}&quot;
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <User className="w-3.5 h-3.5 text-purple-600" />
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
                    className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolver</span>
                  </button>
                  <button
                    type="button"
                    disabled={processingId === rep.id}
                    onClick={() => handleResolve(rep.id, 'dismissed')}
                    className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors cursor-pointer"
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
