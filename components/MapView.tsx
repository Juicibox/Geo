'use client';

import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, useMap, Popup, Marker } from 'react-leaflet';
import { Feature } from 'geojson';
import { Artista } from '@/types';
import { ArtistaPopup } from './ArtistaPopup';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet en Next.js
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  municipiosGeoJSON: GeoJSON.FeatureCollection;
  artistas: Artista[];
  onMunicipioClick: (municipioId: string) => void;
  selectedMunicipio: string | null;
}

// Componente para ajustar el mapa cuando cambian los datos
function MapBounds({ artistas }: { artistas: Artista[] }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (artistas.length > 0) {
      const bounds = L.latLngBounds(
        artistas.map(a => [a.coordenadas[1], a.coordenadas[0]] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [artistas, map]);

  return null;
}

export const MapView: React.FC<MapViewProps> = ({
  municipiosGeoJSON,
  artistas,
  onMunicipioClick,
  selectedMunicipio
}) => {
  const [hoveredMunicipio, setHoveredMunicipio] = useState<string | null>(null);
  const [grayscale, setGrayscale] = useState(false);

  // Estilo para los polígonos de municipios
  const getMunicipioStyle = (feature?: Feature) => {
    if (!feature) return {};
    const isSelected = feature.id === selectedMunicipio;
    const isHovered = feature.id === hoveredMunicipio;
    
    return {
      fillColor: isSelected ? '#3b82f6' : isHovered ? '#60a5fa' : '#93c5fd',
      weight: isSelected ? 3 : 2,
      opacity: 1,
      color: isSelected ? '#1e40af' : '#3b82f6',
      fillOpacity: 0.3, // Opacidad suave como se solicitó
      cursor: 'pointer'
    };
  };

  // Event handlers para los polígonos
  const onEachMunicipio = (feature: Feature, layer: L.Layer) => {
    if (layer instanceof L.Path) {
      layer.on({
        click: () => {
          if (feature.id) {
            onMunicipioClick(feature.id as string);
          }
        },
        mouseover: () => {
          setHoveredMunicipio(feature.id as string);
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        mouseout: () => {
          setHoveredMunicipio(null);
          layer.setStyle({
            fillOpacity: 0.3
          });
        }
      });
    }
  };

  // Agrupar artistas por coordenadas
  const artistasAgrupados = useMemo(() => {
    const grupos = new Map<string, Artista[]>();
    
    artistas.forEach(artista => {
      // Crear una clave única basada en las coordenadas (redondeadas para agrupar cercanos)
      const key = `${Math.round(artista.coordenadas[0] * 10000) / 10000},${Math.round(artista.coordenadas[1] * 10000) / 10000}`;
      
      if (!grupos.has(key)) {
        grupos.set(key, []);
      }
      grupos.get(key)!.push(artista);
    });
    
    return grupos;
  }, [artistas]);

  // Centro inicial del mapa (Boyacá)
  const center: [number, number] = [5.53988, -73.55539];
  const zoom = 8;

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        className={grayscale ? 'grayscale' : ''}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        
        {/* Renderizar polígonos de municipios */}
        <GeoJSON
          data={municipiosGeoJSON}
          style={getMunicipioStyle}
          onEachFeature={onEachMunicipio}
        />

        {/* Renderizar artistas agrupados por coordenadas */}
        {Array.from(artistasAgrupados.entries()).map(([key, artistasEnUbicacion]) => {
          const primerArtista = artistasEnUbicacion[0];
          const tieneMultiples = artistasEnUbicacion.length > 1;
          
          // Crear icono personalizado si hay múltiples artistas
          const customIcon = tieneMultiples
            ? L.divIcon({
                className: 'custom-marker-cluster',
                html: `
                  <div style="
                    background-color:rgb(35, 219, 59);
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 2px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 11px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  ">
                    ${artistasEnUbicacion.length}
                  </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })
            : undefined;
          
          return (
            <React.Fragment key={key}>
              {tieneMultiples ? (
                <Marker
                  position={[primerArtista.coordenadas[1], primerArtista.coordenadas[0]]}
                  icon={customIcon}
                >
                  <Popup>
                    <ArtistaPopup artistas={artistasEnUbicacion} />
                  </Popup>
                </Marker>
              ) : (
                <CircleMarker
                  center={[primerArtista.coordenadas[1], primerArtista.coordenadas[0]]}
                  radius={8}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#ef4444',
                    fillOpacity: 0.7,
                    weight: 2
                  }}
                >
                  <Popup>
                    <ArtistaPopup artistas={artistasEnUbicacion} />
                  </Popup>
                </CircleMarker>
              )}
            </React.Fragment>
          );
        })}

        <MapBounds artistas={artistas} />
      </MapContainer>

      {/* Controles y Leyenda */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-[1000]">
        {/* Control de escala de grises */}
        <div className="bg-white p-3 rounded-lg shadow-lg">
          <button
            onClick={() => setGrayscale(!grayscale)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            title={grayscale ? 'Activar color' : 'Escala de grises'}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <span className="text-xs font-medium">
              {grayscale ? 'Color' : 'Grises'}
            </span>
          </button>
        </div>

        {/* Leyenda */}
        <div className="bg-white p-4 rounded-lg shadow-lg text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Artistas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
