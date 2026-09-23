import { Map as MapLibreMap } from 'maplibre-gl';
import { DrawnShape } from '../types/map';

export class ExportService {
  /**
   * Export current MapLibre canvas view to PNG or JPEG image download
   */
  public static exportMapImage(map: MapLibreMap, format: 'png' | 'jpeg' = 'png', filename: string = 'aegisx-map-snapshot'): void {
    if (!map) return;

    try {
      const canvas = map.getCanvas();
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const dataUrl = canvas.toDataURL(mimeType);

      const link = document.createElement('a');
      link.download = `${filename}.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export map image:', err);
    }
  }

  /**
   * Export drawn shapes & GIS features to formatted GeoJSON file download
   */
  public static exportGeoJSON(shapes: DrawnShape[], filename: string = 'aegisx-drawn-shapes'): void {
    const geojson = {
      type: 'FeatureCollection',
      features: shapes.map((shape) => {
        if (shape.type === 'marker') {
          return {
            type: 'Feature',
            properties: { id: shape.id, label: shape.label || 'Marker', color: shape.color },
            geometry: { type: 'Point', coordinates: shape.coordinates as [number, number] },
          };
        }
        return {
          type: 'Feature',
          properties: { id: shape.id, label: shape.label || 'Polygon', color: shape.color },
          geometry: {
            type: 'Polygon',
            coordinates: [shape.coordinates as [number, number][]],
          },
        };
      }),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojson, null, 2));
    const link = document.createElement('a');
    link.download = `${filename}.geojson`;
    link.href = dataStr;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
