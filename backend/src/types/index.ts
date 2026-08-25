export interface GeoJSONFeature<P = Record<string, unknown>> {
  type: 'Feature';
  properties: P;
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  } | null;
}

export interface GeoJSONFeatureCollection<P = Record<string, unknown>> {
  type: 'FeatureCollection';
  features: GeoJSONFeature<P>[];
}

export interface LocationProperties {
  id: string;
  name: string;
  tipo: string;
  status: string;
}

export interface DepartmentProperties {
  name: string | null;
  admin_level: string | number | null;
  departamento: string | null;
}

export interface MunicipalityProperties {
  nombre: string | null;
  departamento: string | null;
  tipo: string | null;
  descripcion: string | null;
  status: string | null;
}

export interface MapDataResponse {
  departamentos: GeoJSONFeatureCollection<DepartmentProperties>;
  ciudades: GeoJSONFeatureCollection<MunicipalityProperties>;
}

export type UserRole = 'user' | 'entrepreneur' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface UserEntity {
  id: string;
  name: string;
  lastname: string;
  email: string;
  password_hash: string;
  avatar?: string | null;
  role: UserRole;
  status: UserStatus;
  points: number;
  level: number;
  bio?: string | null;
  country?: string | null;
  city?: string | null;
  favorite_categories?: string[];
  notifications_enabled: boolean;
  created_at?: string;
}

export type UserProfile = Omit<UserEntity, 'password_hash'>;

export interface RegisterDTO {
  name: string;
  lastname: string;
  email: string;
  password: string;
  role?: UserRole;
  avatar?: string;
  city?: string;
  country?: string;
  favorite_categories?: string[];
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  expiresIn: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

