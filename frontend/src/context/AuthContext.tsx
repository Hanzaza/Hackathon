'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, LoginPayload, RegisterPayload } from '../services/apiClient';

export interface Pending2FAInfo {
  email: string;
  expiresAt: number;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  pending2FA: Pending2FAInfo | null;
  login: (payload: LoginPayload) => Promise<{ requires2FA: boolean; email: string }>;
  verify2FACode: (code: string) => Promise<boolean>;
  resend2FACode: () => Promise<void>;
  cancel2FA: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<{ needsVerification: boolean }>;
  verifyOtp: (email: string, token: string, type?: 'signup' | 'email' | 'recovery') => Promise<void>;
  resendOtp: (email: string, type?: 'signup' | 'email_change') => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [pending2FA, setPending2FA] = useState<Pending2FAInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  // Función para cargar y sincronizar el perfil de usuario desde Supabase
  const syncUserProfile = useCallback(async (authUser: any, accessToken: string | null) => {
    if (!authUser) {
      setUser(null);
      setToken(null);
      return;
    }

    const metadata = authUser.user_metadata || {};

    try {
      // 1. Consultar tabla de usuarios/perfiles en Supabase
      const { data: profile, error } = await supabase
        .from('users')
        .select('id, name, lastname, email, avatar, role, status, points, level, bio, country, city, favorite_categories, notifications_enabled, created_at')
        .eq('id', authUser.id)
        .maybeSingle();

      // El rol se obtiene estrictamente de la base de datos de Supabase (sin hardcodes ni auto-elevación)
      const determinedRole: 'user' | 'entrepreneur' | 'admin' | 'department_manager' =
        profile?.role === 'admin'
          ? 'admin'
          : profile?.role === 'department_manager'
          ? 'department_manager'
          : profile?.role === 'entrepreneur'
          ? 'entrepreneur'
          : 'user';

      if (profile && !error) {
        setUser({
          id: profile.id,
          name: profile.name || metadata.name || authUser.email?.split('@')[0] || 'Usuario',
          lastname: profile.lastname || metadata.lastname || '',
          email: profile.email || authUser.email || '',
          avatar: profile.avatar || metadata.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
          role: determinedRole,
          status: profile.status || 'active',
          points: determinedRole === 'admin' ? 0 : (profile.points ?? 0),
          level: determinedRole === 'admin' ? 0 : (profile.level ?? 1),
          bio: profile.bio || '',
          country: profile.country || 'Nicaragua',
          city: profile.city || metadata.city || 'León',
          favorite_categories: profile.favorite_categories || [],
          notifications_enabled: profile.notifications_enabled ?? true,
          created_at: profile.created_at || authUser.created_at,
        });
      } else {
        // 2. Si es un usuario nuevo recién registrado, se crea su perfil con rol 'user' estándar
        const newProfile: UserProfile = {
          id: authUser.id,
          name: metadata.name || authUser.email?.split('@')[0] || 'Usuario',
          lastname: metadata.lastname || '',
          email: authUser.email || '',
          avatar: metadata.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
          role: 'user', // Siempre 'user' por defecto. El admin se asigna en la base de datos.
          status: 'active',
          points: 50,
          level: 1,
          bio: '',
          country: 'Nicaragua',
          city: metadata.city || 'León',
          favorite_categories: [],
          notifications_enabled: true,
          created_at: new Date().toISOString(),
        };

        try {
          const { error: upsertErr } = await supabase.from('users').upsert([
            {
              id: newProfile.id,
              name: newProfile.name,
              lastname: newProfile.lastname,
              email: newProfile.email,
              password_hash: '',
              avatar: newProfile.avatar,
              role: 'user',
              status: newProfile.status,
              points: newProfile.points,
              level: newProfile.level,
              country: newProfile.country,
              city: newProfile.city,
            },
          ]);
          if (upsertErr) {
            console.warn('Advertencia guardando perfil en public.users:', upsertErr.message);
          }
        } catch (dbErr) {
          console.warn('Error en upsert de usuario:', dbErr);
        }

        setUser(newProfile);
      }

      setToken(accessToken);
    } catch {
      // Fallback seguro sin privilegios
      setUser({
        id: authUser.id,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuario',
        lastname: authUser.user_metadata?.lastname || '',
        email: authUser.email || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
        role: 'user',
        status: 'active',
        points: 0,
        level: 1,
        city: 'León',
        country: 'Nicaragua',
        notifications_enabled: true,
      });
      setToken(accessToken);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await syncUserProfile(session.user, session.access_token);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, [syncUserProfile]);

  useEffect(() => {
    // 1. Obtener sesión inicial directamente de Supabase Auth
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const isVerified = typeof window !== 'undefined' && (
            sessionStorage.getItem(`roots_2fa_verified_${session.user.id}`) === 'true' ||
            localStorage.getItem(`roots_2fa_verified_${session.user.id}`) === 'true'
          );

          if (isVerified) {
            await syncUserProfile(session.user, session.access_token);
          } else {
            // Verificar si hay una verificación 2FA pendiente no expirada
            const storedPending = typeof window !== 'undefined' ? sessionStorage.getItem('roots_pending_2fa') : null;
            if (storedPending) {
              try {
                const parsed = JSON.parse(storedPending);
                if (parsed.email && parsed.expiresAt > Date.now()) {
                  setPending2FA({
                    email: parsed.email,
                    expiresAt: parsed.expiresAt,
                  });
                } else {
                  sessionStorage.removeItem('roots_pending_2fa');
                  await supabase.auth.signOut();
                }
              } catch {
                sessionStorage.removeItem('roots_pending_2fa');
                await supabase.auth.signOut();
              }
            } else {
              await supabase.auth.signOut();
            }
            setUser(null);
            setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn('Error inicializando sesión Supabase Auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void initSession();

    // 2. Suscribirse a cambios de estado de autenticación (Login, Logout, Token refresh, Magic Link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const isVerified = typeof window !== 'undefined' && (
            sessionStorage.getItem(`roots_2fa_verified_${session.user.id}`) === 'true' ||
            localStorage.getItem(`roots_2fa_verified_${session.user.id}`) === 'true'
          );

          // Si el usuario viene de hacer clic en el Magic Link del correo o completó verifyOtp
          if (event === 'SIGNED_IN' || isVerified) {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem(`roots_2fa_verified_${session.user.id}`, 'true');
              localStorage.setItem(`roots_2fa_verified_${session.user.id}`, 'true');
              sessionStorage.removeItem('roots_pending_2fa');
            }
            setPending2FA(null);
            await syncUserProfile(session.user, session.access_token);
          } else {
            setUser(null);
            setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [syncUserProfile]);

  // Login nativo con Supabase Auth + Verificación de Dos Pasos (2FA vía Correo Electrónico)
  const login = async (payload: LoginPayload): Promise<{ requires2FA: boolean; email: string }> => {
    setIsLoading(true);
    try {
      const email = payload.email.trim().toLowerCase();

      // PASO 1: Validar contraseña en Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: payload.password,
      });

      if (error) {
        throw new Error(
          error.message === 'Invalid login credentials'
            ? 'Credenciales inválidas. Por favor verifica tu correo y contraseña.'
            : error.message
        );
      }

      if (!data.session?.user) {
        throw new Error('No se pudo iniciar la sesión. Por favor verifica tus credenciales.');
      }

      // Cerrar sesión preliminar de contraseña para exigir el segundo factor
      await supabase.auth.signOut();

      // PASO 2: Supabase genera el código en sus servidores y lo envía al correo real del usuario
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/perfil` : undefined;
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectUrl,
        },
      });

      if (otpError && !otpError.message.includes('rate limit')) {
        throw new Error(otpError.message);
      }

      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutos de validez
      const pendingInfo: Pending2FAInfo = {
        email,
        expiresAt,
      };

      setPending2FA(pendingInfo);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('roots_pending_2fa', JSON.stringify({
          email,
          expiresAt,
        }));
      }

      return { requires2FA: true, email };
    } finally {
      setIsLoading(false);
    }
  };

  // Validar código de verificación de 2 pasos recibido en el correo con Supabase Auth
  const verify2FACode = async (inputCode: string): Promise<boolean> => {
    if (!pending2FA) {
      throw new Error('No hay ninguna verificación de dos pasos pendiente.');
    }

    if (Date.now() > pending2FA.expiresAt) {
      throw new Error('El código de verificación ha expirado. Por favor solicita uno nuevo a tu correo.');
    }

    setIsLoading(true);
    try {
      // Supabase Auth valida criptográficamente el token recibido en el correo
      const { data, error } = await supabase.auth.verifyOtp({
        email: pending2FA.email,
        token: inputCode.trim(),
        type: 'email',
      });

      if (error) {
        throw new Error(
          error.message.includes('expired') || error.message.includes('invalid')
            ? 'El código recibido en tu correo es incorrecto o ha expirado. Por favor verifica tu bandeja o solicita uno nuevo.'
            : error.message
        );
      }

      if (data.session?.user) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`roots_2fa_verified_${data.session.user.id}`, 'true');
          localStorage.setItem(`roots_2fa_verified_${data.session.user.id}`, 'true');
          sessionStorage.removeItem('roots_pending_2fa');
        }

        await syncUserProfile(data.session.user, data.session.access_token);
        setPending2FA(null);
        closeAuthModal();
        return true;
      }

      throw new Error('No se pudo establecer la sesión con el código proporcionado.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar un nuevo código al correo vía Supabase Auth
  const resend2FACode = async (): Promise<void> => {
    if (!pending2FA) {
      throw new Error('No hay verificación de dos pasos activa.');
    }

    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/perfil` : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email: pending2FA.email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      if (error.message.includes('rate limit')) {
        throw new Error('Por seguridad, debes esperar un momento antes de solicitar otro código a tu correo.');
      }
      throw new Error(error.message);
    }

    const updated: Pending2FAInfo = {
      email: pending2FA.email,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    setPending2FA(updated);
  };

  // Cancelar la verificación de dos pasos y volver al login
  const cancel2FA = async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('roots_pending_2fa');
    }
    setPending2FA(null);
    setUser(null);
    setToken(null);
    try {
      await supabase.auth.signOut();
    } catch {}
  };

  // Registro nativo con Supabase Auth
  const register = async (payload: RegisterPayload): Promise<{ needsVerification: boolean }> => {
    setIsLoading(true);
    try {
      const email = payload.email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email,
        password: payload.password,
        options: {
          data: {
            name: payload.name.trim(),
            lastname: payload.lastname.trim(),
            role: 'user', // Forzado por seguridad. No se permite auto-asignación de roles privilegiados.
            city: payload.city || 'León',
            avatar: payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session?.user) {
        await syncUserProfile(data.session.user, data.session.access_token);
        closeAuthModal();
        return { needsVerification: false };
      }

      // Fallback: Intentar iniciar sesión automáticamente con las credenciales dadas
      const loginAttempt = await supabase.auth.signInWithPassword({
        email,
        password: payload.password,
      });

      if (loginAttempt.data?.session?.user) {
        await syncUserProfile(loginAttempt.data.session.user, loginAttempt.data.session.access_token);
        closeAuthModal();
        return { needsVerification: false };
      }

      // Si el usuario ya estaba registrado en Supabase
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new Error('Este correo ya está registrado. Por favor selecciona "Iniciar Sesión".');
      }

      return { needsVerification: true };
    } finally {
      setIsLoading(false);
    }
  };

  // Verificación de código OTP (6 dígitos) enviado por correo
  const verifyOtp = async (email: string, token: string, type: 'signup' | 'email' | 'recovery' = 'signup') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type,
      });

      if (error) {
        throw new Error(
          error.message.includes('expired') || error.message.includes('invalid')
            ? 'El código OTP es inválido o ha expirado. Por favor solicita uno nuevo.'
            : error.message
        );
      }

      if (data.session?.user) {
        await syncUserProfile(data.session.user, data.session.access_token);
        closeAuthModal();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar código OTP al correo
  const resendOtp = async (email: string, type: 'signup' | 'email_change' = 'signup') => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type,
        email: email.trim().toLowerCase(),
      });

      if (error) {
        throw new Error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar perfil de usuario en Supabase y localmente
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user?.id) return false;
    setIsLoading(true);

    try {
      if (supabase) {
        const { error } = await supabase
          .from('users')
          .update({
            name: updates.name ?? user.name,
            lastname: updates.lastname ?? user.lastname,
            avatar: updates.avatar ?? user.avatar,
            city: updates.city ?? user.city,
            bio: updates.bio ?? user.bio,
            country: updates.country ?? user.country,
            favorite_categories: updates.favorite_categories ?? user.favorite_categories,
            notifications_enabled: updates.notifications_enabled ?? user.notifications_enabled,
          })
          .eq('id', user.id);

        if (error) {
          console.warn('Error actualizando perfil en Supabase:', error.message);
        }
      }

      setUser((prev) => (prev ? { ...prev, ...updates } : null));
      return true;
    } catch (err) {
      console.warn('Error en updateProfile:', err);
      setUser((prev) => (prev ? { ...prev, ...updates } : null));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout nativo con Supabase Auth
  const logout = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        if (user?.id) {
          sessionStorage.removeItem(`roots_2fa_verified_${user.id}`);
          localStorage.removeItem(`roots_2fa_verified_${user.id}`);
        }
        sessionStorage.removeItem('roots_pending_2fa');
      }
      setPending2FA(null);
      setUser(null);
      setToken(null);
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Error en logout:', err);
    } finally {
      setIsLoading(false);
      closeAuthModal();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        pending2FA,
        login,
        verify2FACode,
        resend2FACode,
        cancel2FA,
        register,
        verifyOtp,
        resendOtp,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
