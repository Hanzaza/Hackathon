'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, LoginPayload, RegisterPayload } from '../services/apiClient';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (payload: LoginPayload) => Promise<void>;
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
          points: profile.points ?? 0,
          level: profile.level ?? 1,
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
          await syncUserProfile(session.user, session.access_token);
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

    // 2. Suscribirse a cambios de estado de autenticación (Login, Logout, Token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await syncUserProfile(session.user, session.access_token);
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

  // Login nativo con Supabase Auth
  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      });

      if (error) {
        throw new Error(
          error.message === 'Invalid login credentials'
            ? 'Credenciales inválidas. Por favor verifica tu correo y contraseña.'
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
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignorar
    } finally {
      setUser(null);
      setToken(null);
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
        login,
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
