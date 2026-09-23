import { StyleSpecification } from 'maplibre-gl';
import { BasemapStyleId } from '../types/map';

export const MAPTILER_API_KEY = 'PTwnGqLq65ZRNpd6OCQQ';

export function getBasemapStyle(styleId: BasemapStyleId): StyleSpecification {
  const rasterSources: Record<string, string> = {
    standard: `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`,
    google_light: `https://api.maptiler.com/maps/voyager-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`,
    dark: `https://api.maptiler.com/maps/dataviz-dark/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`,
    light: `https://api.maptiler.com/maps/dataviz-light/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`,
    terrain: `https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`,
    satellite: `https://api.maptiler.com/maps/satellite/256/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}`,
  };

  const selectedTileUrl = rasterSources[styleId] || rasterSources.standard;

  return {
    version: 8,
    name: `AEGISX-${styleId.toUpperCase()}`,
    light: {
      anchor: 'viewport',
      color: '#ffffff',
      intensity: styleId === 'dark' ? 0.3 : 0.7,
      position: [1.1, 2.1, 30],
    },
    sources: {
      'osm-vector': {
        type: 'vector',
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_API_KEY}`,
      },
      'osm-raster': {
        type: 'raster',
        tiles: [selectedTileUrl, 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
      'dem-terrain': {
        type: 'raster-dem',
        tiles: [`https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=${MAPTILER_API_KEY}`],
        tileSize: 512,
        encoding: 'mapbox',
        maxzoom: 15,
      },

      'mock-buildings': {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { height: 55, min_height: 0, name: 'EOC Headquarters Alpha', category: 'Emergency Center' },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [77.590, 12.970],
                    [77.594, 12.970],
                    [77.594, 12.973],
                    [77.590, 12.973],
                    [77.590, 12.970],
                  ],
                ],
              },
            },
            {
              type: 'Feature',
              properties: { height: 40, min_height: 0, name: 'Metro General Hospital', category: 'Hospital' },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [77.596, 12.972],
                    [77.599, 12.972],
                    [77.599, 12.975],
                    [77.596, 12.975],
                    [77.596, 12.972],
                  ],
                ],
              },
            },
            {
              type: 'Feature',
              properties: { height: 30, min_height: 0, name: 'Central Emergency Shelter 1', category: 'Shelter' },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [77.585, 12.965],
                    [77.588, 12.965],
                    [77.588, 12.968],
                    [77.585, 12.968],
                    [77.585, 12.965],
                  ],
                ],
              },
            },
          ],
        },
      },
    },
    layers: [
      {
        id: 'osm-raster-layer',
        type: 'raster',
        source: 'osm-raster',
        minzoom: 0,
        maxzoom: 19,
        paint: {
          'raster-opacity': styleId === 'dark' ? 0.85 : 1,
        },
      },
      {
        id: 'hillshade-layer',
        type: 'hillshade',
        source: 'dem-terrain',
        minzoom: 0,
        maxzoom: 16,
        paint: {
          'hillshade-exaggeration': 0.6,
          'hillshade-highlight-color': styleId === 'dark' ? '#10232C' : '#ffffff',
          'hillshade-shadow-color': styleId === 'dark' ? '#000000' : '#4a5568',
        },
        layout: {
          visibility: 'none',
        },
      },
      {
        id: 'buildings-3d-layer',
        type: 'fill-extrusion',
        source: 'mock-buildings',
        minzoom: 12,
        paint: {
          'fill-extrusion-color':
            styleId === 'dark'
              ? '#00D4FF'
              : styleId === 'google_light'
              ? '#D9E2EC'
              : '#3182ce',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.85,
        },
        layout: {
          visibility: 'visible',
        },
      },
    ],
  };
}
