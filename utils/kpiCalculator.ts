import { Artista, KPIData } from '@/types';

export function calculateKPIs(artistas: Artista[]): KPIData {
  const total = artistas.length;

  // Calcular por género
  const porGenero = [
    { genero: 'M', cantidad: artistas.filter(a => a.genero === 'M').length },
    { genero: 'F', cantidad: artistas.filter(a => a.genero === 'F').length },
    { genero: 'Otro', cantidad: artistas.filter(a => a.genero === 'Otro').length }
  ].filter(item => item.cantidad > 0);

  // Calcular por edad (rangos) - solo si hay datos de edad
  const artistasConEdad = artistas.filter(a => a.edad > 0);
  let porEdad: { rango: string; cantidad: number }[] = [];
  
  if (artistasConEdad.length > 0) {
    const rangosEdad = [
      { rango: '18-25', min: 18, max: 25 },
      { rango: '26-35', min: 26, max: 35 },
      { rango: '36-45', min: 36, max: 45 },
      { rango: '46+', min: 46, max: 999 }
    ];

    porEdad = rangosEdad.map(rango => ({
      rango: rango.rango,
      cantidad: artistasConEdad.filter(a => a.edad >= rango.min && a.edad <= rango.max).length
    })).filter(item => item.cantidad > 0);
  }

  // Calcular por categoría
  const categorias = [...new Set(artistas.map(a => a.categoria))];
  const porCategoria = categorias.map(categoria => ({
    categoria,
    cantidad: artistas.filter(a => a.categoria === categoria).length
  })).sort((a, b) => b.cantidad - a.cantidad);

  return {
    total,
    porEdad,
    porGenero,
    porCategoria
  };
}
