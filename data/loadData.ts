import { Artista } from '@/types';
import fs from 'fs';
import path from 'path';

// Interfaz para los datos raw de artistas
interface ArtistaRaw {
  Nombre: string;
  Descripción?: string;
  Departamento: string;
  Municipio: string;
  Genero: 'M' | 'F' | 'Otro';
  Actividad: string;
  Coordenadas: [number, number]; // [longitude, latitude]
}

// Función para cargar y transformar los datos de artistas
export function loadArtistas(): Artista[] {
  const filePath = path.join(process.cwd(), 'data', 'artist', 'art.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const artistasRawData = JSON.parse(fileContents) as ArtistaRaw[];
  
  return artistasRawData.map((artista, index) => ({
    id: `artista-${index + 1}`,
    nombre: artista.Nombre,
    municipio: artista.Municipio,
    edad: 0, // No hay edad en los datos
    genero: artista.Genero,
    categoria: artista.Actividad,
    coordenadas: artista.Coordenadas,
    descripcion: artista.Descripción
  }));
}

// Función para cargar el GeoJSON de municipios
export function loadMunicipiosGeoJSON(): GeoJSON.FeatureCollection {
  const filePath = path.join(process.cwd(), 'data', 'Geo', 'boyaca_geojson_123_municipios.geojson');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const geoJSON = JSON.parse(fileContents) as GeoJSON.FeatureCollection;
  
  // Asegurar que cada feature tenga un ID único basado en el código del municipio
  geoJSON.features = geoJSON.features.map((feature, index) => {
    const municipioCode = feature.properties?.MPIO_CCDGO || `municipio-${index}`;
    return {
      ...feature,
      id: municipioCode
    };
  });
  
  return geoJSON;
}
