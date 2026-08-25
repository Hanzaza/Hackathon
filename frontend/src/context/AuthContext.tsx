'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient, authStorage, UserProfile, LoginPayload, RegisterPayload } from '../services/apiClient';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const refreshUser = useCallback(async () => {
    const savedToken = authStorage.getToken();
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiClient.auth.getMe(savedToken);
      if (res.success && res.user) {
        setUser(res.user);
        setToken(savedToken);
      } else {
        authStorage.clearToken();
        setUser(null);
        setToken(null);
      }
    } catch {
      authStorage.clearToken();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      const savedToken = authStorage.getToken();
      if (!savedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await apiClient.auth.getMe(savedToken);
        if (isMounted) {
          if (res.success && res.user) {
            setUser(res.user);
            setToken(savedToken);
          } else {
            authStorage.clearToken();
            setUser(null);
            setToken(null);
          }
        }
      } catch {
        if (isMounted) {
          authStorage.clearToken();
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await apiClient.auth.login(payload);
      if (res.success && res.token) {
        authStorage.setToken(res.token);
        setToken(res.token);
        setUser(res.user);
        closeAuthModal();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await apiClient.auth.register(payload);
      if (res.success && res.token) {
        authStorage.setToken(res.token);
        setToken(res.token);
        setUser(res.user);
        closeAuthModal();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.auth.logout().catch(() => {});
    } finally {
      authStorage.clearToken();
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
        logout,
        refreshUser,
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
