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

export const apiClient = {
  getLocations: () => fetchFromApi('/api/locations'),
  getMapData: () => fetchFromApi('/api/map-data'),
  getHealth: () => fetchFromApi('/health'),
};
