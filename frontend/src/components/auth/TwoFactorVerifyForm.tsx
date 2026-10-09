'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  MailCheck,
  RotateCcw,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface TwoFactorVerifyFormProps {
  email?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function TwoFactorVerifyForm({
  email,
  onSuccess,
  onCancel,
  isModal = false,
}: TwoFactorVerifyFormProps) {
  const { pending2FA, verify2FACode, resend2FACode, cancel2FA } = useAuth();

  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(60); // Supabase exige 60s entre envíos
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos de validez

  const inputRef = useRef<HTMLInputElement>(null);
  const targetEmail = pending2FA?.email || email || 'tu correo electrónico';

  // Enfocar automáticamente el input de código
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Temporizador de expiración (5 minutos)
  useEffect(() => {
    if (!pending2FA?.expiresAt) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((pending2FA.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        setErrorMessage('El código ha expirado. Haz clic en "Reenviar código" para recibir uno nuevo en tu correo.');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [pending2FA?.expiresAt]);

  // Cooldown del botón de reenvío (60 segundos por política de seguridad de Supabase)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Formato mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Manejo de cambio en el input
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanNumbers = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
    setCode(cleanNumbers);
    setErrorMessage(null);

    // Si escribe 6 u 8 dígitos completos, auto-enviar
    if (cleanNumbers.length >= 6) {
      if (cleanNumbers.length === 6 || cleanNumbers.length === 8) {
        void submitVerification(cleanNumbers);
      }
    }
  };

  // Enviar verificación contra Supabase Auth
  const submitVerification = async (codeToVerify?: string) => {
    const token = (codeToVerify || code).trim();
    if (token.length < 6) {
      setErrorMessage('Por favor ingresa el código numérico recibido en tu correo.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await verify2FACode(token);
      setSuccessMessage('¡Código verificado exitosamente! Iniciando sesión...');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Error al verificar el código';
      setErrorMessage(msg);
      inputRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitVerification();
  };

  // Reenviar código mediante Supabase Auth
  const handleResend = async () => {
    if (resendCooldown > 0 || submitting) return;

    setErrorMessage(null);
    setSubmitting(true);
    try {
      await resend2FACode();
      setResendCooldown(60);
      setCode('');
      inputRef.current?.focus();
      setSuccessMessage('¡Se ha enviado un nuevo código a tu correo electrónico!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Error al reenviar el código';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Cancelar y volver
  const handleCancel = async () => {
    await cancel2FA();
    if (onCancel) onCancel();
  };

  return (
    <div className={`w-full flex flex-col items-center animate-fadeIn ${isModal ? 'max-w-md mx-auto py-2' : 'max-w-sm mx-auto'}`}>
      
      {/* Botón de Volver al Inicio de Sesión */}
      <button
        type="button"
        onClick={handleCancel}
        className="self-start inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white transition-colors cursor-pointer mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cambiar de cuenta</span>
      </button>

      {/* Ícono de Correo Seguro / Escudo */}
      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-tr from-[#00A8A7]/30 to-emerald-400/20 border-2 border-[#00A8A7]/50 flex items-center justify-center text-[#00A8A7] shadow-[0_10px_30px_rgba(0,168,167,0.35)] mb-3">
        <MailCheck className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-300 drop-shadow-[0_2px_10px_rgba(0,168,167,0.6)]" />
      </div>

      {/* Título y Subtítulo */}
      <h2 className="text-xl sm:text-2xl font-black text-center text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] tracking-tight mb-1">
        Verificación de Dos Pasos
      </h2>

      <p className="text-xs text-center text-slate-200 mb-2 leading-relaxed px-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
        Supabase ha enviado un código de seguridad de confirmación a:
      </p>

      {/* Correo de destino en píldora elegante */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs font-bold mb-2 shadow-sm">
        <KeyRound className="w-3.5 h-3.5 text-[#F4D44D]" />
        <span className="truncate max-w-[240px]">{targetEmail}</span>
      </div>

      <p className="text-[11px] text-white/85 text-center mb-4 leading-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
        Revisá tu <strong>bandeja de entrada</strong> o carpeta de <strong>spam / correo no deseado</strong>.
      </p>

      {/* Alerta de Error */}
      {errorMessage && (
        <div className="w-full p-3 mb-3 rounded-2xl bg-rose-900/85 backdrop-blur-md border border-rose-500/40 text-white text-xs font-semibold leading-relaxed flex items-start gap-2 shadow-lg animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-300" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Alerta de Éxito */}
      {successMessage && (
        <div className="w-full p-3 mb-3 rounded-2xl bg-[#0F3A2E]/90 backdrop-blur-md border border-emerald-400/50 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Formulario de Código del Correo */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
        
        {/* Input Numérico Formateado para Código de Correo */}
        <div className="w-full relative flex items-center justify-center">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={8}
            value={code}
            onChange={handleCodeChange}
            placeholder="• • • • • •"
            className="w-full py-4 px-6 text-center text-2xl sm:text-3xl font-black tracking-[0.35em] text-slate-900 bg-white rounded-2xl sm:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-2 border-transparent focus:border-[#00A8A7] focus:ring-4 focus:ring-[#00A8A7]/30 outline-none transition-all font-mono"
          />
        </div>

        {/* Temporizador de Expiración */}
        <div className="inline-flex items-center gap-1.5 text-xs text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-semibold">
          <Clock className="w-3.5 h-3.5 text-[#F4D44D]" />
          <span>
            {timeLeft > 0 ? (
              <>El código expira en <strong className="text-white font-mono">{formatTime(timeLeft)}</strong></>
            ) : (
              <span className="text-rose-300 font-bold">Código expirado</span>
            )}
          </span>
        </div>

        {/* Botón Principal: Verificar Código */}
        <button
          type="submit"
          disabled={submitting || code.length < 6}
          className="w-full py-3.5 px-6 rounded-2xl sm:rounded-3xl bg-[#0F3A2E] hover:bg-[#0A261E] active:scale-[0.98] text-white font-black text-sm shadow-[0_10px_30px_rgba(15,58,46,0.7)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-white/10"
        >
          <ShieldCheck className="w-4 h-4 text-[#00A8A7]" />
          <span>{submitting ? 'Verificando con Supabase...' : 'Confirmar e Iniciar Sesión'}</span>
        </button>

        {/* Sección Reenviar Correo */}
        <div className="w-full pt-2 flex items-center justify-between text-xs text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <span className="text-white/80">¿No te llegó el correo?</span>
          <button
            type="button"
            disabled={resendCooldown > 0 || submitting}
            onClick={handleResend}
            className="font-bold text-[#F4D44D] hover:underline flex items-center gap-1 disabled:text-white/40 disabled:no-underline cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${submitting ? 'animate-spin' : ''}`} />
            <span>
              {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar código'}
            </span>
          </button>
        </div>

      </form>

    </div>
  );
}
