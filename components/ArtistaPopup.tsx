'use client';

import React, { useState } from 'react';
import { Artista } from '@/types';

interface ArtistaPopupProps {
  artistas: Artista[];
}

export const ArtistaPopup: React.FC<ArtistaPopupProps> = ({ artistas }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const artista = artistas[currentIndex];
  const total = artistas.length;

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className="p-3 min-w-[250px]">
      {/* Navegación - Solo mostrar si hay más de un artista */}
      {total > 1 && (
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
          <button
            onClick={handlePrevious}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            title="Anterior"
            aria-label="Artista anterior"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          
          <span className="text-xs font-medium text-gray-600 px-3">
            {currentIndex + 1} de {total}
          </span>
          
          <button
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            title="Siguiente"
            aria-label="Siguiente artista"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Información del artista actual */}
      <div>
        <h3 className="font-bold text-sm mb-1.5 text-gray-900">{artista.nombre}</h3>
        <p className="text-xs text-gray-600 font-semibold mb-1.5">{artista.categoria}</p>
        {artista.descripcion && (
          <p className="text-xs text-gray-600 mb-2 leading-relaxed">{artista.descripcion}</p>
        )}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-xs text-gray-500">{artista.municipio}</p>
        </div>
      </div>
    </div>
  );
};
