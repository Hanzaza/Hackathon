'use client';

import React, { useState } from 'react';
import {
  Map,
  Sparkles,
  UserCheck,
  Edit2,
  Check,
  X,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { DepartmentItem, AdminUserItem, adminService } from '@/services/adminService';

interface DepartmentsManagerTabProps {
  departments: DepartmentItem[];
  users: AdminUserItem[];
  onRefresh: () => void;
}

export const DepartmentsManagerTab: React.FC<DepartmentsManagerTabProps> = ({
  departments,
  users,
  onRefresh,
}) => {
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    is_creative_region: false,
    manager_id: '',
  });
  const [saving, setSaving] = useState(false);

  const potentialManagers = users.filter(
    (u) => u.role === 'department_manager' || u.role === 'admin' || u.role === 'user'
  );

  const openEditModal = (dept: DepartmentItem) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code || '',
      description: dept.description || '',
      is_creative_region: dept.is_creative_region,
      manager_id: dept.manager_id || '',
    });
  };

  const handleToggleCreative = async (dept: DepartmentItem) => {
    const updated = !dept.is_creative_region;
    await adminService.updateDepartment(dept.id, { is_creative_region: updated });
    onRefresh();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;

    setSaving(true);
    try {
      await adminService.updateDepartment(editingDept.id, {
        code: formData.code,
        description: formData.description,
        is_creative_region: formData.is_creative_region,
        manager_id: formData.manager_id || undefined,
      });

      if (formData.manager_id !== editingDept.manager_id) {
        await adminService.assignDepartmentManager(
          editingDept.id,
          formData.manager_id || null
        );
      }

      setEditingDept(null);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Map className="w-5 h-5 text-purple-700" />
            Departamentos y Encargados Territoriales
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestiona los 15 departamentos y 2 regiones autónomas de Nicaragua, asigna sus encargados y declara regiones creativas.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold self-start sm:self-auto">
          <Building2 className="w-4 h-4 text-purple-700" />
          <span>{departments.filter((d) => d.is_creative_region).length} de {departments.length} Regiones Creativas</span>
        </div>
      </div>

      {/* Grid de Departamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className={`rounded-3xl border p-5 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md ${
              dept.is_creative_region
                ? 'bg-white border-purple-300 ring-1 ring-purple-100'
                : 'bg-white border-slate-200 opacity-95'
            }`}
          >
            <div className="space-y-3">
              {/* Header de tarjeta */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                    dept.is_creative_region
                      ? 'bg-purple-100 text-purple-900 border border-purple-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {dept.code || dept.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{dept.name}</h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Nicaragua • {dept.code || 'Territorio'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCreative(dept)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                    dept.is_creative_region
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                  }`}
                  title="Alternar estado de región creativa"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{dept.is_creative_region ? 'Creativo' : 'Tradicional'}</span>
                </button>
              </div>

              {/* Descripción */}
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {dept.description || 'Sin descripción territorial detallada.'}
              </p>

              {/* Encargado Departamental Asignado */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    dept.manager_id ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Encargado
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate block">
                      {dept.manager_name || 'Sin asignar'}
                    </span>
                  </div>
                </div>

                {dept.manager_id && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-200 shrink-0">
                    Activo
                  </span>
                )}
              </div>
            </div>

            {/* Footer / Acciones */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Estado: <strong className="text-emerald-700 capitalize font-bold">{dept.status}</strong>
              </span>

              <button
                type="button"
                onClick={() => openEditModal(dept)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-slate-200 hover:border-purple-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Configurar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición de Departamento */}
      {editingDept && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Editar Departamento: {editingDept.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configuración de delegación y estatus creativo
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingDept(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Código Territorial
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ej: LE, MY, GR, MN"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:bg-white outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Descripción & Vocación Cultural
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe la riqueza histórica, artesanal o literaria del departamento..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:bg-white outline-hidden transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Asignar Encargado / Delegado Departamental
                </label>
                <select
                  value={formData.manager_id}
                  onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:bg-white outline-hidden transition-all"
                >
                  <option value="">-- Sin encargado asignado --</option>
                  {potentialManagers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} {u.lastname || ''} ({u.email}) - Rol: {u.role}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  El usuario asignado podrá gestionar los circuitos y eventos correspondientes a este departamento.
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
                <input
                  type="checkbox"
                  id="is_creative_region"
                  checked={formData.is_creative_region}
                  onChange={(e) => setFormData({ ...formData, is_creative_region: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                />
                <label htmlFor="is_creative_region" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Declarar como Región Creativa Activa en el Mapa
                </label>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition-all shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <span>Guardando...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
