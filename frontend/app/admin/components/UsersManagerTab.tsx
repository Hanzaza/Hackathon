'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Users,
  ShieldCheck,
  Store,
  User,
  Plus,
  Minus,
  Search,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { AdminUserItem, adminService } from '@/services/adminService';

interface UsersManagerTabProps {
  users: AdminUserItem[];
  onRefresh: () => void;
}

export const UsersManagerTab: React.FC<UsersManagerTabProps> = ({ users, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(term) ||
      u.lastname.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.city && u.city.toLowerCase().includes(term));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: 'user' | 'entrepreneur' | 'admin') => {
    await adminService.updateUserRole(userId, newRole);
    onRefresh();
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await adminService.updateUserStatus(userId, newStatus as any);
    onRefresh();
  };

  const handleAddPoints = async (userId: string, amount: number) => {
    await adminService.adjustUserPoints(userId, amount);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Gestión de Usuarios y Roles
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Asignación de privilegios administrativos, acreditación de emprendedores y gamificación.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Role Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Todos los Usuarios', count: users.length },
          { key: 'admin', label: 'Administradores', count: users.filter((u) => u.role === 'admin').length },
          { key: 'entrepreneur', label: 'Emprendedores', count: users.filter((u) => u.role === 'entrepreneur').length },
          { key: 'user', label: 'Exploradores / Turistas', count: users.filter((u) => u.role === 'user').length },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setRoleFilter(tab.key)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              roleFilter === tab.key
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
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

      {/* Table */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 overflow-hidden backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-4 px-5">Usuario</th>
                <th className="py-4 px-4">Rol en Sistema</th>
                <th className="py-4 px-4">Puntos & Nivel</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4 text-right">Acciones de Gamificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  
                  {/* Usuario */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-purple-950 border border-purple-500/30 shrink-0">
                        <Image
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'}
                          alt={u.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-white leading-tight">{u.name} {u.lastname}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Rol */}
                  <td className="py-4 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer ${
                        u.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : u.role === 'entrepreneur'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300 border-white/10'
                      }`}
                    >
                      <option value="user" className="bg-slate-900 text-white">Explorador (User)</option>
                      <option value="entrepreneur" className="bg-slate-900 text-white">Emprendedor</option>
                      <option value="admin" className="bg-slate-900 text-white">Administrador</option>
                    </select>
                  </td>

                  {/* Puntos y Nivel */}
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-amber-400">{u.points} pts</span>
                      <p className="text-[10px] text-slate-400 font-semibold">Nivel {u.level}</p>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-4">
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(u.id, u.status)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                        u.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                      }`}
                    >
                      {u.status === 'active' ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Activo
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Inactivo
                        </>
                      )}
                    </button>
                  </td>

                  {/* Acciones */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAddPoints(u.id, 50)}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold border border-purple-500/30 transition-all flex items-center gap-1"
                        title="Otorgar 50 Puntos"
                      >
                        <Plus className="w-3 h-3" /> 50 pts
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddPoints(u.id, -50)}
                        className="px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Deducir 50 Puntos"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
