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
