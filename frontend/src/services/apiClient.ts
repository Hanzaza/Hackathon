const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const base = API_BASE_URL.replace(/\/$/, '');
  const path = endpoint.replace(/^\//, '');
  const url = `${base}/${path}`;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`API Error [${res.status}] ${res.statusText}: ${errorBody}`);
  }

  return res.json() as Promise<T>;
}

const TOKEN_STORAGE_KEY = 'roots_auth_token';

export interface UserProfile {
  id: string;
  name: string;
  lastname: string;
  email: string;
  avatar?: string | null;
  role: 'user' | 'entrepreneur' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  points: number;
  level: number;
  bio?: string | null;
  country?: string | null;
  city?: string | null;
  favorite_categories?: string[];
  notifications_enabled: boolean;
  created_at?: string;
}

export interface RegisterPayload {
  name: string;
  lastname: string;
  email: string;
  password: string;
  role?: 'user' | 'entrepreneur' | 'admin';
  avatar?: string;
  city?: string;
  country?: string;
  favorite_categories?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user: UserProfile;
  token: string;
  expiresIn: string;
}

export const authStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};

export const apiClient = {
  getLocations: () => fetchFromApi('/api/locations'),
  getMapData: () => fetchFromApi('/api/map-data'),
  getHealth: () => fetchFromApi('/health'),
  
  // Métodos de Autenticación
  auth: {
    login: (payload: LoginPayload) =>
      fetchFromApi<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    register: (payload: RegisterPayload) =>
      fetchFromApi<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    getMe: (token?: string) => {
      const activeToken = token || authStorage.getToken();
      return fetchFromApi<{ success: boolean; user: UserProfile }>('/api/auth/me', {
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      });
    },

    logout: () => {
      authStorage.clearToken();
      return fetchFromApi<{ success: boolean; message: string }>('/api/auth/logout', {
        method: 'POST',
      });
    },
  },
};
