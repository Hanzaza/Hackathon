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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-700" />
            Catálogo de Logros e Insignias de Gamificación
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configuración de retos, medallas y bonificaciones de puntos para incentivar el turismo cultural.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition-all shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto"
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
            className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-2xl">
                  {ach.icon}
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                  +{ach.points_reward} pts
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700">
                  Tipo: {ach.achievement_type}
                </span>
                <h3 className="text-sm font-black text-slate-950">{ach.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Requisito:</span>
              <span className="text-slate-900 font-bold">{ach.required_count} actividad(es)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear Logro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-5 text-slate-900 shadow-2xl">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-700" />
                <h3 className="text-lg font-black text-slate-950">Nuevo Logro</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre del Reconocimiento *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Caminante Muralista"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Icono / Emoji</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🏺"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-center text-lg text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tipo de Actividad</label>
                  <select
                    value={formData.achievement_type}
                    onChange={(e) => setFormData({ ...formData, achievement_type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  >
                    <option value="ruta">Completar Ruta</option>
                    <option value="visita">Visita de Lugares</option>
                    <option value="evento">Asistencia a Evento</option>
                    <option value="especial">Especial / Comunidad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Descripción del Desafío</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explica cómo el usuario puede desbloquear este logro..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Puntos Recompensa</label>
                  <input
                    type="number"
                    value={formData.points_reward}
                    onChange={(e) => setFormData({ ...formData, points_reward: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Cantidad Requerida</label>
                  <input
                    type="number"
                    value={formData.required_count}
                    onChange={(e) => setFormData({ ...formData, required_count: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
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
