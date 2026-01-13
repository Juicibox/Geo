'use client';

import dynamic from 'next/dynamic';
import React, { useState, useMemo } from 'react';
import { MapView } from './MapView';
import { KPISection } from './KPISection';
import { Artista } from '@/types';
import { calculateKPIs } from '@/utils/kpiCalculator';
import * as turf from '@turf/turf';

// Cargar el mapa dinámicamente con SSR deshabilitado
const DynamicMapView = dynamic(() => Promise.resolve(MapView), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  )
});

interface CulturalMapProps {
  artistas: Artista[];
  municipiosGeoJSON: GeoJSON.FeatureCollection;
}

export const CulturalMap: React.FC<CulturalMapProps> = ({ artistas: initialArtistas, municipiosGeoJSON }) => {
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);
  const [artistas, setArtistas] = useState<Artista[]>(initialArtistas);

  // Calcular KPIs basados en los artistas filtrados
  const kpiData = useMemo(() => {
    return calculateKPIs(artistas);
  }, [artistas]);

  const handleMunicipioClick = (municipioId: string) => {
    if (selectedMunicipio === municipioId) {
      // Si se hace click en el mismo municipio, deseleccionar
      setSelectedMunicipio(null);
      setArtistas(initialArtistas);
    } else {
      // Filtrar artistas geográficamente usando Turf.js
      setSelectedMunicipio(municipioId);
      const municipioFeature = municipiosGeoJSON.features.find(
        f => f.id === municipioId
      );

      if (municipioFeature) {
        const filtered = initialArtistas.filter(artista => {
          const point = turf.point(artista.coordenadas);
          const polygon = turf.feature(municipioFeature.geometry);
          return turf.booleanPointInPolygon(point, polygon);
        });
        setArtistas(filtered);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Visualización Cultural Georreferenciada</h1>
        {selectedMunicipio && (
          <p className="text-sm mt-1 opacity-90">
            Filtrando por: {municipiosGeoJSON.features.find(f => f.id === selectedMunicipio)?.properties?.MPIO_CNMBR || 'Municipio'}
            <button
              onClick={() => {
                setSelectedMunicipio(null);
                setArtistas(initialArtistas);
              }}
              className="ml-2 underline hover:no-underline"
            >
              (Limpiar filtro)
            </button>
          </p>
        )}
      </header>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Mapa */}
        <div className="flex-1 h-full lg:h-auto min-h-[400px]">
          <DynamicMapView
            municipiosGeoJSON={municipiosGeoJSON}
            artistas={artistas}
            onMunicipioClick={handleMunicipioClick}
            selectedMunicipio={selectedMunicipio}
          />
        </div>

        {/* Panel de KPIs */}
        <div className="w-full lg:w-96 overflow-y-auto bg-gray-50">
          <KPISection data={kpiData} />
        </div>
      </div>
    </div>
  );
};
