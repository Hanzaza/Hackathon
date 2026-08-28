const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, '') : '';
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${base}${path}`;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errorMessage = `Error [${res.status}] ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
      const text = await res.text().catch(() => '');
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

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

export const apiClient = {
  getLocations: () => fetchFromApi('/api/locations'),
  getMapData: () => fetchFromApi('/api/map-data'),
  getHealth: () => fetchFromApi('/health'),
};
