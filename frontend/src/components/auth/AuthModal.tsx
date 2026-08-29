'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Mail,
  Lock,
  User,
  MapPin,
  Sparkles,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  Store,
  Compass,
  KeyRound,
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NICARAGUA_GEO_DATA, getMunicipalitiesByDepartment } from '@/data/nicaraguaGeo';

export default function AuthModal() {
  const {
    user,
    isAuthenticated,
    isAuthModalOpen,
    closeAuthModal,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
  } = useAuth();

  const [viewState, setViewState] = useState<'login' | 'register' | 'otp'>('login');
  
  // Estados formulario Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados formulario Registro (100% alineados con public.users y auth.users)
  const [regName, setRegName] = useState('');
  const [regLastname, setRegLastname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'user' | 'entrepreneur'>('user');
  const [regDepartment, setRegDepartment] = useState('León');
  const [regCity, setRegCity] = useState('León');

  // Estados OTP (Código de 6 dígitos)
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Estados de UI
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Temporizador para reenvío de OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  // 1. Manejo de Inicio de Sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      await login({
        email: loginEmail,
        password: loginPassword,
      });
      setSuccessMessage('¡Bienvenido de vuelta a Roots!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Manejo de Registro con Coherencia de BD y Envío de OTP
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      const result = await register({
        name: regName.trim(),
        lastname: regLastname.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        role: regRole,
        city: regCity,
      });

      if (result.needsVerification) {
        setOtpEmail(regEmail.trim().toLowerCase());
        setViewState('otp');
        setResendCooldown(60); // 60 segundos de cooldown
        setSuccessMessage(`Hemos enviado un enlace de confirmación a ${regEmail.trim().toLowerCase()}`);
      } else {
        setSuccessMessage('¡Cuenta creada e iniciada exitosamente!');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Reenviar Correo de Confirmación
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !otpEmail) return;

    setErrorMessage(null);
    setSubmitting(true);
    try {
      await resendOtp(otpEmail, 'signup');
      setResendCooldown(60);
      setSuccessMessage('¡Se ha reenviado el correo de confirmación!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error reenviando el correo';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-md rounded-[2.5rem] bg-white border border-slate-200/80 shadow-[0_25px_70px_rgba(0,0,0,0.35)] p-6 sm:p-8 flex flex-col overflow-hidden text-slate-800">
        
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all cursor-pointer z-20"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ================= VISTA: USUARIO YA AUTENTICADO ================= */}
        {isAuthenticated && user ? (
          <div className="flex flex-col items-center text-center py-2">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-purple-500 shadow-xl mb-4 bg-purple-50">
              <Image
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'}
                alt={user.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wider mb-2">
              {user.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span>Administrador</span>
                </>
              ) : user.role === 'entrepreneur' ? (
                <>
                  <Store className="w-3.5 h-3.5 text-purple-700" />
                  <span>Emprendedor Local</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5 text-purple-700" />
                  <span>Explorador Cultural</span>
                </>
              )}
            </div>

            <h3 className="text-2xl font-black text-slate-900 leading-tight">
              {user.name} {user.lastname}
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              {user.email} • {user.city || 'Nicaragua'}
            </p>

            <div className="grid grid-cols-2 gap-3 w-full mb-6">
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Puntos Roots</span>
                <span className="text-2xl font-black text-purple-900">{user.points} pts</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Nivel de Ruta</span>
                <span className="text-2xl font-black text-emerald-900">Nivel {user.level}</span>
              </div>
            </div>

            <Link
              href="/perfil"
              onClick={closeAuthModal}
              className="w-full py-3 px-4 mb-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/25"
            >
              <Compass className="w-4 h-4" />
              <span>Abrir Mi Pasaporte & Panel de Usuario →</span>
            </Link>

            {user.role === 'admin' && (
              <Link
                href="/admin"
                onClick={closeAuthModal}
                className="w-full py-2.5 px-4 mb-2.5 rounded-2xl bg-slate-950 text-purple-300 hover:text-white border border-purple-500/40 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Panel de Administración</span>
              </Link>
            )}

            <button
              type="button"
              onClick={logout}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : viewState === 'otp' ? (
          /* ================= VISTA: ESPERANDO CONFIRMACIÓN POR ENLACE ================= */
          <div className="flex flex-col text-center items-center animate-fadeIn py-2">
            
            <button
              type="button"
              onClick={() => { setViewState('register'); setErrorMessage(null); }}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 mb-4 cursor-pointer self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver o cambiar correo</span>
            </button>

            <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-purple-500/25 mb-4 animate-bounce">
              <Mail className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">
              ¡Revisa tu Correo!
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-1">
              Hemos enviado un enlace de confirmación a:
            </p>
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-900 font-black text-xs mb-5 break-all max-w-full">
              {otpEmail}
            </div>

            {errorMessage && (
              <div className="w-full p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold leading-relaxed flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="w-full p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5 mb-5 shadow-sm">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-xs text-slate-700 font-medium">
                  Abre tu bandeja de entrada o la carpeta de spam.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-xs text-slate-700 font-medium">
                  Haz clic en el botón <strong>&ldquo;Confirmar mi correo electrónico&rdquo;</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-xs text-slate-700 font-medium">
                  ¡Listo! Tu sesión se activará automáticamente aquí.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold mb-4 border border-purple-100">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Esperando que confirmes tu enlace...</span>
            </div>

            <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>¿No te llegó el correo?</span>
              <button
                type="button"
                disabled={resendCooldown > 0 || submitting}
                onClick={handleResendOtp}
                className="font-bold text-purple-700 hover:underline flex items-center gap-1 disabled:text-slate-400 disabled:no-underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar enlace'}</span>
              </button>
            </div>

          </div>
        ) : (
          /* ================= VISTA: FORMULARIOS DE LOGIN / REGISTRO ================= */
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-2xl bg-purple-100 p-2 shrink-0 border border-purple-200 shadow-sm">
                <Image src="/logos/Logo.png" alt="Roots" fill sizes="48px" className="object-contain p-1" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  Bienvenido a Roots
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Red de Ciudades Creativas de Nicaragua
                </p>
              </div>
            </div>

            <div className="flex rounded-2xl bg-slate-100 p-1 mb-5 border border-slate-200/60">
              <button
                type="button"
                onClick={() => { setViewState('login'); setErrorMessage(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  viewState === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => { setViewState('register'); setErrorMessage(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  viewState === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Crear Cuenta
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Formulario Login */}
            {viewState === 'login' ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-3.5 text-left">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Contraseña
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3 px-4 rounded-2xl bg-purple-700 hover:bg-purple-800 active:scale-[0.98] text-white font-black text-xs shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{submitting ? 'Iniciando sesión...' : 'Entrar a la Plataforma'}</span>
                </button>
              </form>
            ) : (
              /* Formulario Registro 100% Coherente con Schema Supabase */
              <form onSubmit={handleRegister} className="flex flex-col gap-3 text-left">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Nombre *
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Ej. Jonathan"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={regLastname}
                      onChange={(e) => setRegLastname(e.target.value)}
                      placeholder="Ej. González"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="usuario@correo.com"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Contraseña (mínimo 6 caracteres) *
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Tipo de Perfil
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as 'user' | 'entrepreneur')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="user">👤 Explorador Cultural / Turista</option>
                    <option value="entrepreneur">🛍️ Emprendedor Creativo / MiPyme</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Departamento
                    </label>
                    <select
                      value={regDepartment}
                      onChange={(e) => {
                        const newDept = e.target.value;
                        setRegDepartment(newDept);
                        const firstMun = getMunicipalitiesByDepartment(newDept)[0] || 'León';
                        setRegCity(firstMun);
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      {NICARAGUA_GEO_DATA.map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Municipio / Ciudad
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-2.5 w-3 h-3 text-slate-400" />
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full pl-7 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        {getMunicipalitiesByDepartment(regDepartment).map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 active:scale-[0.98] text-white font-black text-xs shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{submitting ? 'Creando cuenta...' : 'Crear Cuenta y Entrar'}</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
