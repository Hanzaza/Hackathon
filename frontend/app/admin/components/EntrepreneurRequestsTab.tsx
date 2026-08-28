'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle,
  XCircle,
  Clock,
  Store,
  MapPin,
  FileText,
  Eye,
  Mail,
  User,
  Search,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { EntrepreneurRequestItem, adminService } from '@/services/adminService';

interface EntrepreneurRequestsTabProps {
  requests: EntrepreneurRequestItem[];
  onRefresh: () => void;
}

export const EntrepreneurRequestsTab: React.FC<EntrepreneurRequestsTabProps> = ({
  requests,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<EntrepreneurRequestItem | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const filteredRequests = requests.filter((req) => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const term = search.toLowerCase();
    const matchesSearch =
      req.business_name.toLowerCase().includes(term) ||
      req.user_name.toLowerCase().includes(term) ||
      req.user_email.toLowerCase().includes(term) ||
      (req.city && req.city.toLowerCase().includes(term));
    return matchesFilter && matchesSearch;
  });

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await adminService.approveEntrepreneurRequest(id);
      setFeedbackMessage({ text: res.message, type: 'success' });
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status: 'approved' });
      }
      onRefresh();
    } catch {
      setFeedbackMessage({ text: 'Error al procesar la aprobación.', type: 'error' });
    } finally {
      setProcessingId(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await adminService.rejectEntrepreneurRequest(id);
      setFeedbackMessage({ text: res.message, type: 'success' });
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status: 'rejected' });
      }
      onRefresh();
    } catch {
      setFeedbackMessage({ text: 'Error al rechazar la solicitud.', type: 'error' });
    } finally {
      setProcessingId(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all animate-fadeIn ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedbackMessage.text}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-purple-400" />
            Solicitudes de Registro de Emprendedores
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Revisión y acreditación oficial para artesanos, negocios culturales y servicios turísticos.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar emprendimiento..."
            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'pending', label: 'Pendientes', count: requests.filter((r) => r.status === 'pending').length },
          { key: 'all', label: 'Todas', count: requests.length },
          { key: 'approved', label: 'Aprobadas', count: requests.filter((r) => r.status === 'approved').length },
          { key: 'rejected', label: 'Rechazadas', count: requests.filter((r) => r.status === 'rejected').length },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              filter === tab.key
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-white/5 bg-slate-900/40 text-slate-400">
            <Store className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="font-bold text-sm text-slate-300">No hay solicitudes en esta sección</p>
            <p className="text-xs mt-1">No se encontraron registros con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-3xl border border-white/10 bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-xl transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-lg"
            >
              {/* User and Business info */}
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-purple-950 border border-purple-500/30 shrink-0">
                  <Image
                    src={req.user_avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop'}
                    alt={req.user_name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black text-white">{req.business_name}</h3>
                    
                    {/* Status Badge */}
                    {req.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pendiente
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Aprobada
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Rechazada
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-slate-300 uppercase">
                      Tipo: {req.business_type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <User className="w-3.5 h-3.5 text-purple-400" /> {req.user_name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> {req.user_email}
                    </span>
                    {req.city && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {req.city}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 max-w-2xl pt-1">
                    &quot;{req.motivation}&quot;
                  </p>
                </div>
              </div>

              {/* Actions & Detail CTA */}
              <div className="flex flex-wrap items-center gap-2 self-end lg:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(req)}
                  className="px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Expediente</span>
                </button>

                {req.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      disabled={processingId === req.id}
                      onClick={() => handleApprove(req.id)}
                      className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{processingId === req.id ? 'Aprobando...' : 'Aprobar'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={processingId === req.id}
                      onClick={() => handleReject(req.id)}
                      className="px-3 py-2 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Rechazar</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Expediente Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-white shadow-2xl">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">
                  Expediente de Emprendedor
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedRequest.business_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                <span className="text-slate-500 font-semibold">Solicitante:</span>
                <p className="font-bold text-slate-200">{selectedRequest.user_name}</p>
                <p className="text-slate-400">{selectedRequest.user_email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                <span className="text-slate-500 font-semibold">Ubicación y Tipo:</span>
                <p className="font-bold text-slate-200">
                  {selectedRequest.city} ({selectedRequest.business_type})
                </p>
                <p className="text-slate-400">{selectedRequest.address || 'Sin dirección especificada'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-300">Motivación y Propuesta de Valor:</span>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-xs text-slate-300 leading-relaxed">
                {selectedRequest.motivation}
              </div>
            </div>

            {selectedRequest.documents && selectedRequest.documents.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-purple-300">Documentos y Licencias Adjuntas:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedRequest.documents.map((doc: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300"
                    >
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="truncate">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
              >
                Cerrar
              </button>

              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    type="button"
                    disabled={processingId === selectedRequest.id}
                    onClick={() => handleReject(selectedRequest.id)}
                    className="px-4 py-2.5 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs border border-rose-500/30"
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    disabled={processingId === selectedRequest.id}
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Aprobar y Certificar Emprendimiento</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
