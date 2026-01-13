'use client';

import React from 'react';
import { KPICard } from './KPICard';
import { KPIData } from '@/types';

interface KPISectionProps {
  data: KPIData;
}

export const KPISection: React.FC<KPISectionProps> = ({ data }) => {
  return (
    <div className="w-full bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Indicadores</h2>
      
      {/* KPI Principal - Total */}
      <div className="mb-6">
        <KPICard
          title="Total de Artistas"
          value={data.total}
          subtitle="Artistas registrados"
        />
      </div>

      {/* KPIs por Género */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Por Género</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.porGenero.map((item) => (
            <KPICard
              key={item.genero}
              title={item.genero === 'M' ? 'Masculino' : item.genero === 'F' ? 'Femenino' : 'Otro'}
              value={item.cantidad}
              subtitle={`${((item.cantidad / data.total) * 100).toFixed(1)}%`}
            />
          ))}
        </div>
      </div>

      {/* KPIs por Edad - Solo mostrar si hay datos */}
      {data.porEdad.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Por Rango de Edad</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.porEdad.map((item) => (
              <KPICard
                key={item.rango}
                title={item.rango}
                value={item.cantidad}
                subtitle={`${((item.cantidad / data.total) * 100).toFixed(1)}%`}
              />
            ))}
          </div>
        </div>
      )}

      {/* KPIs por Categoría */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Por Categoría</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.porCategoria.map((item) => (
            <KPICard
              key={item.categoria}
              title={item.categoria}
              value={item.cantidad}
              subtitle={`${((item.cantidad / data.total) * 100).toFixed(1)}%`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
