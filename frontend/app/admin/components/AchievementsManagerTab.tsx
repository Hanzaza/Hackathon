'use client';

import React, { useState } from 'react';
import {
  Award,
  Plus,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import { AchievementItem, adminService } from '@/services/adminService';

interface AchievementsManagerTabProps {
  achievements: AchievementItem[];
  onRefresh: () => void;
}

export const AchievementsManagerTab: React.FC<AchievementsManagerTabProps> = ({
  achievements,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    achievement_type: 'ruta' | 'evento' | 'visita' | 'especial';
    icon: string;
    points_reward: number;
    required_count: number;
  }>({
    name: '',
    description: '',
    achievement_type: 'ruta',
    icon: '🏅',
    points_reward: 150,
    required_count: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    await adminService.createAchievement({
      ...formData,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });

    setIsModalOpen(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Catálogo de Logros e Insignias de Gamificación
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configuración de retos, medallas y bonificaciones de puntos para incentivar el turismo cultural.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Logro</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-5 rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all hover:scale-[1.02]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl shadow-inner">
                  {ach.icon}
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  +{ach.points_reward} pts
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-purple-400">
                  Tipo: {ach.achievement_type}
                </span>
                <h3 className="text-sm font-black text-white">{ach.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Requisito:</span>
              <span className="text-white font-bold">{ach.required_count} actividad(es)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear Logro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 space-y-5 text-white shadow-2xl">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-black text-white">Nuevo Logro</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nombre del Reconocimiento *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Caminante Muralista"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Icono / Emoji</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🏺"
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-2.5 text-center text-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tipo de Actividad</label>
                  <select
                    value={formData.achievement_type}
                    onChange={(e) => setFormData({ ...formData, achievement_type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="ruta">Completar Ruta</option>
                    <option value="visita">Visita de Lugares</option>
                    <option value="evento">Asistencia a Evento</option>
                    <option value="especial">Especial / Comunidad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Descripción del Desafío</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explica cómo el usuario puede desbloquear este logro..."
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Puntos Recompensa</label>
                  <input
                    type="number"
                    value={formData.points_reward}
                    onChange={(e) => setFormData({ ...formData, points_reward: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cantidad Requerida</label>
                  <input
                    type="number"
                    value={formData.required_count}
                    onChange={(e) => setFormData({ ...formData, required_count: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Logro</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
