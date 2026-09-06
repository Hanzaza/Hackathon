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
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NICARAGUA_GEO_DATA, getMunicipalitiesByDepartment } from '@/data/nicaraguaGeo';
import PrecolombianPattern from '../ui/PrecolombianPattern';

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

  const [viewState, setViewState] = useState<'login' | 'register' | 'otp' | 'forgot'>('login');
  
  // Estados formulario Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados formulario Registro
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
      setSuccessMessage('¡Bienvenido de vuelta a ROOTS!');
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
        setResendCooldown(60);
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
    <div className="fixed inset-0 z-[10001] flex items-center justify-center sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      
      {/* Contenedor Principal: En móvil ocupa pantalla completa y en desktop es una tarjeta elegante con esquinas redondeadas */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-md sm:rounded-[2.75rem] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.6)] flex flex-col justify-between border-0 sm:border border-white/10 bg-[#0F3A2E]">
        
        {/* ================= IMAGEN DE FONDO DE LA CATEDRAL DE GRANADA (DISEÑO OFICIAL ROOTS) ================= */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/backgrounds/roots-login-bg.jpg"
            alt="Catedral de Granada, Nicaragua"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 500px"
            className="object-cover object-center"
          />
          {/* Overlay suave para mantener luminosidad y máxima legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-[#0A261E]/90" />
        </div>

        {/* Botón Cerrar Flotante */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md transition-all cursor-pointer z-30 border border-white/10 shadow-lg"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ================= CONTENIDO DEL MODAL ================= */}
        <div className="relative z-10 flex flex-col justify-between min-h-full sm:min-h-[640px] pt-12 pb-6 px-6 sm:px-8">
          
          {/* ================= ESTADO 1: USUARIO AUTENTICADO ================= */}
          {isAuthenticated && user ? (
            <div className="flex flex-col items-center text-center my-auto py-6 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/40 text-slate-800">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#00A8A7] shadow-xl mb-4 bg-slate-100">
                <Image
                  src={user.avatar || '/icons/roots/profile-mask.png'}
                  alt={user.name}
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A8A7]/15 text-[#007F7E] text-xs font-black uppercase tracking-wider mb-2">
                {user.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#007F7E]" />
                    <span>Administrador</span>
                  </>
                ) : user.role === 'entrepreneur' ? (
                  <>
                    <Store className="w-3.5 h-3.5 text-[#007F7E]" />
                    <span>Emprendedor Local</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5 text-[#007F7E]" />
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
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#007F7E]">Puntos Roots</span>
                  <span className="text-2xl font-black text-[#0F3A2E]">{user.points} pts</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4A43B]">Nivel de Ruta</span>
                  <span className="text-2xl font-black text-slate-900">Nivel {user.level}</span>
                </div>
              </div>

              <Link
                href="/perfil"
                onClick={closeAuthModal}
                className="w-full py-3.5 px-4 mb-2.5 rounded-2xl bg-[#0F3A2E] hover:bg-[#0A261E] text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#0F3A2E]/30"
              >
                <Compass className="w-4 h-4 text-[#00A8A7]" />
                <span>Abrir Mi Pasaporte Cultural →</span>
              </Link>

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
            /* ================= ESTADO 2: ESPERANDO CONFIRMACIÓN ================= */
            <div className="flex flex-col text-center items-center my-auto py-6 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/40 text-slate-800 animate-fadeIn">
              <button
                type="button"
                onClick={() => { setViewState('login'); setErrorMessage(null); }}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 mb-4 cursor-pointer self-start"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al inicio de sesión</span>
              </button>

              <div className="w-14 h-14 rounded-2xl bg-[#00A8A7]/10 text-[#007F7E] flex items-center justify-center mb-3">
                <Mail className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">
                Verificá tu Correo
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Enviamos un enlace de confirmación a: <br />
                <strong className="text-slate-900">{otpEmail}</strong>
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00A8A7]/10 text-[#007F7E] text-xs font-bold mb-4 border border-[#00A8A7]/20">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Esperando confirmación...</span>
              </div>

              <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>¿No te llegó el correo?</span>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || submitting}
                  onClick={handleResendOtp}
                  className="font-bold text-[#007F7E] hover:underline flex items-center gap-1 disabled:text-slate-400 disabled:no-underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar enlace'}</span>
                </button>
              </div>
            </div>
          ) : viewState === 'forgot' ? (
            /* ================= ESTADO 3: OLVIDÉ MI CONTRASEÑA ================= */
            <div className="flex flex-col text-center items-center my-auto py-6 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/40 text-slate-800 animate-fadeIn">
              <button
                type="button"
                onClick={() => { setViewState('login'); setErrorMessage(null); }}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 mb-4 cursor-pointer self-start"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al inicio de sesión</span>
              </button>

              <h3 className="text-xl font-black text-slate-900 mb-1">
                Recuperar Contraseña
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Ingresá tu correo electrónico registrado para enviarte un enlace de restablecimiento.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); setSuccessMessage('Si el correo está registrado, recibirás un enlace de recuperación.'); }} className="w-full flex flex-col gap-3">
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-100 border-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#0F3A2E] hover:bg-[#0A261E] text-white font-bold text-sm shadow-lg shadow-[#0F3A2E]/30 transition-all cursor-pointer"
                >
                  Enviar enlace de recuperación
                </button>
              </form>
            </div>
          ) : viewState === 'register' ? (
            /* ================= ESTADO 4: REGISTRO DE CUENTA ================= */
            <div className="flex flex-col my-auto py-5 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/40 text-slate-800 animate-fadeIn max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => { setViewState('login'); setErrorMessage(null); }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Iniciar Sesión</span>
                </button>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#007F7E]">
                  Registro ROOTS
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">
                Creá tu Pasaporte Cultural
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Comenzá a acumular puntos y explorá los circuitos turísticos de Nicaragua.
              </p>

              {errorMessage && (
                <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold leading-relaxed flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Nombre"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border-0 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                  />
                  <input
                    type="text"
                    required
                    value={regLastname}
                    onChange={(e) => setRegLastname(e.target.value)}
                    placeholder="Apellido"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border-0 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                  />
                </div>

                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border-0 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                />

                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Contraseña (mínimo 6 carácteres)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border-0 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={regDepartment}
                    onChange={(e) => {
                      const newDept = e.target.value;
                      setRegDepartment(newDept);
                      const firstMun = getMunicipalitiesByDepartment(newDept)[0] || 'León';
                      setRegCity(firstMun);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border-0 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                  >
                    {NICARAGUA_GEO_DATA.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>

                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border-0 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                  >
                    {getMunicipalitiesByDepartment(regDepartment).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3 rounded-2xl bg-[#0F3A2E] hover:bg-[#0A261E] text-white font-bold text-xs shadow-lg shadow-[#0F3A2E]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#F4D44D]" />
                  <span>{submitting ? 'Creando cuenta...' : 'Crear Cuenta'}</span>
                </button>
              </form>
            </div>
          ) : (
            /* ================= ESTADO PRINCIPAL: LOGIN IDÉNTICO A LA MAQUETA ROOTS ================= */
            <div className="flex flex-col items-center justify-center flex-1 my-auto w-full max-w-sm mx-auto">
              
              {/* 1. Logo Circular ROOTS - Nuevo Logo Oficial */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 mb-2 drop-shadow-[0_20px_45px_rgba(0,0,0,0.8)]">
                <Image
                  src="/logos/roots-emblem-white.png"
                  alt="ROOTS Logo Oficial"
                  fill
                  priority
                  sizes="150px"
                  className="object-contain"
                />
              </div>

              {/* 2. Título de Marca: ROOTS */}
              <h2 className="text-4xl sm:text-5xl font-black tracking-[0.2em] uppercase text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] mb-8 select-none">
                ROOTS
              </h2>

              {errorMessage && (
                <div className="w-full p-3 mb-3 rounded-2xl bg-rose-900/80 backdrop-blur-md border border-rose-500/40 text-white text-xs font-semibold leading-relaxed flex items-start gap-2 shadow-lg">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-300" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="w-full p-3 mb-3 rounded-2xl bg-[#0F3A2E]/90 backdrop-blur-md border border-[#00A8A7]/40 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-[#00A8A7] shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* 3. Formulario con Tarjetas Blancas Redondeadas (Idénticas a la Maqueta) */}
              <form onSubmit={handleLogin} className="w-full flex flex-col gap-3.5">
                
                {/* Input 1: Correo electrónico */}
                <div className="relative flex items-center bg-white rounded-2xl sm:rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.25)] overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#00A8A7]">
                  <div className="pl-4 pr-2 text-slate-500 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="w-full py-3.5 pr-4 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-500 focus:outline-none"
                  />
                </div>

                {/* Input 2: Contraseña */}
                <div className="relative flex items-center bg-white rounded-2xl sm:rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.25)] overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#00A8A7]">
                  <div className="pl-4 pr-2 text-slate-500 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full py-3.5 pr-4 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-500 focus:outline-none"
                  />
                </div>

                {/* Botón: Iniciar sesión (Verde Oscuro oficial #0F3A2E) */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-1 py-3.5 px-6 rounded-2xl sm:rounded-3xl bg-[#0F3A2E] hover:bg-[#0A261E] active:scale-[0.98] text-white font-black text-sm shadow-[0_10px_30px_rgba(15,58,46,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-white/10"
                >
                  <span>{submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}</span>
                </button>

                {/* Enlace: ¿Olvidaste tu contraseña? */}
                <div className="flex flex-col items-center gap-2.5 mt-2">
                  <button
                    type="button"
                    onClick={() => { setViewState('forgot'); setErrorMessage(null); }}
                    className="text-xs sm:text-sm font-semibold text-white hover:text-amber-200 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>

                  <button
                    type="button"
                    onClick={() => { setViewState('register'); setErrorMessage(null); }}
                    className="text-xs font-semibold text-white/90 hover:text-white transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] cursor-pointer pt-1"
                  >
                    ¿No tienes cuenta? <span className="underline font-bold text-[#F4D44D]">Registrate gratis</span>
                  </button>
                </div>

              </form>

            </div>
          )}

        </div>

        {/* ================= FRANJA INFERIOR CON GRECAS PRECOLOMBINAS (IDÉNTICA A LA MAQUETA) ================= */}
        <div className="relative z-10 w-full">
          <PrecolombianPattern
            strokeColor="#00A8A7"
            fillColor="#0A261E"
            opacity={0.75}
            height="170px"
            patternSize="clamp(900px, 220vw, 1300px) auto"
          />
        </div>

      </div>

    </div>
  );
}
