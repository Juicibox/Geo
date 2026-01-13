export interface Artista {
  id: string;
  nombre: string;
  municipio: string;
  edad: number;
  genero: 'M' | 'F' | 'Otro';
  categoria: string;
  coordenadas: [number, number]; // [longitude, latitude]
  descripcion?: string;
}

export interface Municipio {
  id: string;
  nombre: string;
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  propiedades?: Record<string, any>;
}

export interface KPIData {
  total: number;
  porEdad: {
    rango: string;
    cantidad: number;
  }[];
  porGenero: {
    genero: string;
    cantidad: number;
  }[];
  porCategoria: {
    categoria: string;
    cantidad: number;
  }[];
}
