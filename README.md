# Visualización Cultural Georreferenciada

Aplicación de visualización cultural georreferenciada construida con Next.js, TypeScript, React Leaflet y Turf.js.

## Características

- 🗺️ Visualización interactiva de mapas con React Leaflet
- 📊 KPIs dinámicos (Total, Edad, Género, Categoría)
- 🎯 Filtrado por municipio al hacer click
- 🎨 Estilos modernos con Tailwind CSS
- 📱 Diseño responsive
- 🔗 Configurado para ser embebido en iframes

## Tecnologías

- **Next.js 14** con TypeScript
- **React Leaflet** para visualización de mapas
- **Turf.js** para procesamiento geográfico
- **Tailwind CSS** para estilos
- **Leaflet** como librería base de mapas

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales
├── components/
│   ├── CulturalMap.tsx    # Componente principal del mapa
│   ├── MapView.tsx         # Vista del mapa con Leaflet
│   ├── KPICard.tsx         # Tarjeta individual de KPI
│   └── KPISection.tsx      # Sección de KPIs
├── data/
│   └── sampleData.ts       # Datos de ejemplo
├── types/
│   └── index.ts            # Tipos TypeScript
└── utils/
    └── kpiCalculator.ts    # Utilidades para calcular KPIs
```

## Configuración

### Iframe Embedding

La aplicación está configurada en `next.config.js` para permitir ser embebida en iframes desde cualquier dominio mediante los headers:
- `X-Frame-Options: ALLOWALL`
- `Content-Security-Policy: frame-ancestors *`

## Uso

1. El mapa muestra los municipios como polígonos con opacidad suave
2. Los artistas se muestran como CircleMarkers para mejor rendimiento
3. Al hacer click en un municipio, se filtran los artistas de ese territorio
4. Los KPIs se actualizan dinámicamente según el filtro aplicado
5. Click nuevamente en el mismo municipio para limpiar el filtro

## Personalización

Para usar tus propios datos:

1. Reemplaza los datos en `data/sampleData.ts`
2. Asegúrate de que el GeoJSON de municipios tenga la estructura correcta
3. Los artistas deben tener coordenadas `[longitude, latitude]` y un campo `municipio` que coincida con el nombre en el GeoJSON
