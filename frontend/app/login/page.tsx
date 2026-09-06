'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PrecolombianPattern from '@/components/ui/PrecolombianPattern';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Si ya está autenticado, redirigir al inicio o perfil
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/perfil');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      await login({ email, password });
      router.push('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#0F3A2E] sm:bg-slate-950 sm:p-4 select-none relative overflow-hidden">
      
      {/* Halo ambiental en desktop */}
      <div 
        aria-hidden="true" 
        className="hidden sm:block pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00A8A7]/15 blur-[160px] rounded-full" 
      />

      {/* Botón Volver al Inicio en Desktop */}
      <Link
        href="/"
        className="hidden sm:inline-flex absolute top-6 left-6 z-30 items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/15 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a Inicio</span>
      </Link>

      {/* Contenedor del Celular / Pantalla de Login */}
      <div className="relative w-full h-screen sm:h-auto sm:max-w-md sm:min-h-[720px] sm:rounded-[3rem] overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.8)] flex flex-col justify-between border-0 sm:border border-white/10 bg-[#0F3A2E]">
        
        {/* Imagen de Fondo: Catedral de Granada */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/backgrounds/roots-login-bg.jpg"
            alt="Catedral de Granada, Nicaragua"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 500px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-[#0A261E]/90" />
        </div>

        {/* Botón de regreso en móvil */}
        <Link
          href="/"
          className="sm:hidden absolute top-5 left-5 z-30 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10"
          aria-label="Volver"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {/* Contenido Central: Logo, ROOTS y Formulario */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-8 pt-14 pb-4 w-full max-w-sm mx-auto">
          
          {/* Logo Circular ROOTS - Nuevo Logo Oficial */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 mb-2 drop-shadow-[0_20px_45px_rgba(0,0,0,0.8)]">
            <Image
              src="/logos/roots-emblem-white.png"
              alt="ROOTS Logo Oficial"
              fill
              priority
              sizes="160px"
              className="object-contain"
            />
          </div>

          {/* Título de Marca: ROOTS */}
          <h1 className="text-4xl sm:text-5xl font-black tracking-[0.2em] uppercase text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] mb-8 select-none">
            ROOTS
          </h1>

          {errorMessage && (
            <div className="w-full p-3 mb-3 rounded-2xl bg-rose-900/80 backdrop-blur-md border border-rose-500/40 text-white text-xs font-semibold leading-relaxed flex items-start gap-2 shadow-lg">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-300" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
            
            {/* Input: Correo electrónico */}
            <div className="relative flex items-center bg-white rounded-2xl sm:rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.25)] overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#00A8A7]">
              <div className="pl-4 pr-2 text-slate-500 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full py-3.5 pr-4 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Input: Contraseña */}
            <div className="relative flex items-center bg-white rounded-2xl sm:rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.25)] overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#00A8A7]">
              <div className="pl-4 pr-2 text-slate-500 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full py-3.5 pr-4 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Botón: Iniciar sesión (#0F3A2E Verde Oscuro oficial de ROOTS) */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-1 py-3.5 px-6 rounded-2xl sm:rounded-3xl bg-[#0F3A2E] hover:bg-[#0A261E] active:scale-[0.98] text-white font-black text-sm shadow-[0_10px_30px_rgba(15,58,46,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-white/10"
            >
              <span>{submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}</span>
            </button>

            {/* Enlace: ¿Olvidaste tu contraseña? */}
            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="text-xs sm:text-sm font-semibold text-white hover:text-amber-200 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] cursor-pointer">
                ¿Olvidaste tu contraseña?
              </span>
            </div>

          </form>

        </div>

        {/* Franja Inferior con Trama Precolombina en Escala Amplia (Idéntica a la Maqueta) */}
        <div className="relative z-10 w-full">
          <PrecolombianPattern
            strokeColor="#00A8A7"
            fillColor="#0A261E"
            opacity={0.75}
            height="180px"
            patternSize="clamp(900px, 220vw, 1300px) auto"
          />
        </div>

      </div>

    </main>
  );
}
