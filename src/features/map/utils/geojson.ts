import * as turf from '@turf/turf';
import { SearchLocationResult, MeasurementPoint } from '../types/map';

/**
 * Format coordinates nicely for HUD display
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(5)}° ${latDir}, ${Math.abs(lng).toFixed(5)}° ${lngDir}`;
}

/**
 * Calculate scale bar distance representation at given zoom and latitude
 */
export function calculateScaleDistance(zoom: number, latitude: number): { distance: number; unit: string; widthPx: number } {
  const metersPerPx = (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);
  const targetPxWidth = 100;
  const rawMeters = metersPerPx * targetPxWidth;

  let distance: number;
  let unit = 'm';

  if (rawMeters >= 1000) {
    distance = Math.round(rawMeters / 1000);
    if (distance === 0) distance = 1;
    unit = 'km';
  } else {
    const niceNumbers = [10, 20, 50, 100, 200, 500];
    distance = niceNumbers.reduce((prev, curr) => (Math.abs(curr - rawMeters) < Math.abs(prev - rawMeters) ? curr : prev));
  }

  const actualMeters = unit === 'km' ? distance * 1000 : distance;
  const widthPx = Math.max(40, Math.min(160, actualMeters / metersPerPx));

  return { distance, unit, widthPx };
}

/**
 * Calculate total line distance in meters/kilometers using Turf.js
 */
export function calculateTotalDistance(points: MeasurementPoint[]): { distance: number; formatted: string } {
  if (points.length < 2) return { distance: 0, formatted: '0 m' };

  let totalMeters = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = turf.point(points[i].coordinates);
    const p2 = turf.point(points[i + 1].coordinates);
    totalMeters += turf.distance(p1, p2, { units: 'meters' });
  }

  if (totalMeters >= 1000) {
    return { distance: totalMeters, formatted: `${(totalMeters / 1000).toFixed(2)} km` };
  }
  return { distance: totalMeters, formatted: `${Math.round(totalMeters)} m` };
}

/**
 * Calculate polygon area in square meters / square kilometers using Turf.js
 */
export function calculatePolygonArea(coords: [number, number][]): { areaSqMeters: number; formatted: string } {
  if (coords.length < 3) return { areaSqMeters: 0, formatted: '0 m²' };

  const closedCoords = [...coords];
  if (
    closedCoords[0][0] !== closedCoords[closedCoords.length - 1][0] ||
    closedCoords[0][1] !== closedCoords[closedCoords.length - 1][1]
  ) {
    closedCoords.push(closedCoords[0]);
  }

  const poly = turf.polygon([closedCoords]);
  const areaM2 = turf.area(poly);

  if (areaM2 >= 1000000) {
    return { areaSqMeters: areaM2, formatted: `${(areaM2 / 1000000).toFixed(2)} km²` };
  }
  if (areaM2 >= 10000) {
    return { areaSqMeters: areaM2, formatted: `${(areaM2 / 10000).toFixed(2)} hectares` };
  }
  return { areaSqMeters: areaM2, formatted: `${Math.round(areaM2)} m²` };
}

/**
 * Convert SearchLocationResult to GeoJSON Feature
 */
export function searchResultToGeoJSON(result: SearchLocationResult): GeoJSON.Feature<GeoJSON.Point> {
  return turf.point(result.coordinates, {
    id: result.id,
    title: result.title,
    subtitle: result.subtitle,
    category: result.category,
    ...result.properties,
  });
}
