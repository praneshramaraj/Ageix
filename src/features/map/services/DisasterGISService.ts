import { Map as MapLibreMap } from 'maplibre-gl';
import { LayerId } from '../types/map';

export class DisasterGISService {
  /**
   * Mock GeoJSON Data for Disaster GIS Layers (Phase 2.3)
   */
  public static getDisasterData(layerId: LayerId): GeoJSON.FeatureCollection {
    switch (layerId) {
      case 'flood_zone':
        return {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                name: 'Kaveri River Overflow Zone',
                severity: 'critical',
                depthMeters: 2.8,
                timestamp: '2026-09-14 12:00 UTC',
              },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [77.570, 12.955],
                    [77.585, 12.952],
                    [77.595, 12.960],
                    [77.580, 12.968],
                    [77.570, 12.955],
                  ],
                ],
              },
            },
            {
              type: 'Feature',
              properties: {
                name: 'East Lake Inundation Area',
                severity: 'high',
                depthMeters: 1.4,
                timestamp: '2026-09-14 11:30 UTC',
              },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [77.610, 12.970],
                    [77.625, 12.968],
                    [77.620, 12.980],
                    [77.605, 12.978],
                    [77.610, 12.970],
                  ],
                ],
              },
            },
          ],
        };

      case 'fire_perimeter':
        return {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                name: 'Forest Reserve Wildfire Wildzone Alpha',
                severity: 'critical',
                fireIntensity: 'Catastrophic',
                timestamp: '2026-09-14 13:15 UTC',
              },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [77.600, 12.985],
                    [77.615, 12.985],
                    [77.612, 12.998],
                    [77.598, 12.995],
                    [77.600, 12.985],
                  ],
                ],
              },
            },
          ],
        };

      case 'cyclone_track':
        return {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                name: 'Super Cyclone VARUNA Track',
                windSpeedKmh: 185,
                category: 'Category 4 Storm',
                timestamp: '2026-09-14 14:00 UTC',
              },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [77.520, 12.910],
                  [77.560, 12.940],
                  [77.594, 12.971],
                  [77.640, 13.010],
                  [77.690, 13.050],
                ],
              },
            },
          ],
        };

      case 'earthquake_risk':
        return {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                name: 'Fault Line Seismic Isoseismal Ring 1',
                magnitude: 6.4,
                severity: 'high',
                timestamp: '2026-09-14 08:22 UTC',
              },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [77.550, 12.930],
                    [77.630, 12.930],
                    [77.630, 13.010],
                    [77.550, 13.010],
                    [77.550, 12.930],
                  ],
                ],
              },
            },
          ],
        };

      case 'risk_heatmap':
        return {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', properties: { weight: 0.95 }, geometry: { type: 'Point', coordinates: [77.592, 12.971] } },
            { type: 'Feature', properties: { weight: 0.85 }, geometry: { type: 'Point', coordinates: [77.585, 12.965] } },
            { type: 'Feature', properties: { weight: 0.90 }, geometry: { type: 'Point', coordinates: [77.598, 12.973] } },
            { type: 'Feature', properties: { weight: 0.70 }, geometry: { type: 'Point', coordinates: [77.575, 12.955] } },
            { type: 'Feature', properties: { weight: 0.60 }, geometry: { type: 'Point', coordinates: [77.610, 12.980] } },
            { type: 'Feature', properties: { weight: 0.98 }, geometry: { type: 'Point', coordinates: [77.605, 12.988] } },
          ],
        };

      case 'rescue_nodes':
        return {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                name: 'SOS Alert #4012 - Trapped Civilians',
                type: 'SOS',
                priority: 'critical',
                victimsCount: 6,
                timestamp: '5 mins ago',
              },
              geometry: { type: 'Point', coordinates: [77.588, 12.962] },
            },
            {
              type: 'Feature',
              properties: {
                name: 'Road Blockade - Bridge Submerged',
                type: 'Blocked Road',
                priority: 'high',
                timestamp: '12 mins ago',
              },
              geometry: { type: 'Point', coordinates: [77.576, 12.956] },
            },
            {
              type: 'Feature',
              properties: {
                name: 'Search & Rescue Drone Unit 04',
                type: 'Drone Location',
                priority: 'medium',
                status: 'Patrolling',
                timestamp: 'Live',
              },
              geometry: { type: 'Point', coordinates: [77.602, 12.976] },
            },
          ],
        };

      default:
        return { type: 'FeatureCollection', features: [] };
    }
  }

  /**
   * Mount or Update Disaster GIS Vector Layers on MapLibre Canvas
   */
  public static addDisasterLayersToMap(map: MapLibreMap): void {
    if (!map) return;

    // 1. Flood Zone Layer
    if (!map.getSource('flood_zone_src')) {
      map.addSource('flood_zone_src', {
        type: 'geojson',
        data: this.getDisasterData('flood_zone'),
      });
      map.addLayer({
        id: 'flood_zone_fill',
        type: 'fill',
        source: 'flood_zone_src',
        paint: {
          'fill-color': '#00D4FF',
          'fill-opacity': 0.45,
        },
      });
      map.addLayer({
        id: 'flood_zone_line',
        type: 'line',
        source: 'flood_zone_src',
        paint: {
          'line-color': '#00D4FF',
          'line-width': 2,
        },
      });
    }

    // 2. Fire Perimeter Layer
    if (!map.getSource('fire_perimeter_src')) {
      map.addSource('fire_perimeter_src', {
        type: 'geojson',
        data: this.getDisasterData('fire_perimeter'),
      });
      map.addLayer({
        id: 'fire_perimeter_fill',
        type: 'fill',
        source: 'fire_perimeter_src',
        paint: {
          'fill-color': '#FF4B55',
          'fill-opacity': 0.5,
        },
      });
      map.addLayer({
        id: 'fire_perimeter_line',
        type: 'line',
        source: 'fire_perimeter_src',
        paint: {
          'line-color': '#FF4B55',
          'line-width': 2.5,
          'line-dasharray': [2, 2],
        },
      });
    }

    // 3. Cyclone Track Layer
    if (!map.getSource('cyclone_track_src')) {
      map.addSource('cyclone_track_src', {
        type: 'geojson',
        data: this.getDisasterData('cyclone_track'),
      });
      map.addLayer({
        id: 'cyclone_track_line',
        type: 'line',
        source: 'cyclone_track_src',
        paint: {
          'line-color': '#FFB000',
          'line-width': 4,
        },
      });
    }

    // 4. Earthquake Risk Layer
    if (!map.getSource('earthquake_risk_src')) {
      map.addSource('earthquake_risk_src', {
        type: 'geojson',
        data: this.getDisasterData('earthquake_risk'),
      });
      map.addLayer({
        id: 'earthquake_risk_line',
        type: 'line',
        source: 'earthquake_risk_src',
        paint: {
          'line-color': '#FF4B55',
          'line-width': 2,
          'line-dasharray': [4, 4],
        },
      });
    }

    // 5. Risk Heatmap Layer (MapLibre Kernel Density)
    if (!map.getSource('risk_heatmap_src')) {
      map.addSource('risk_heatmap_src', {
        type: 'geojson',
        data: this.getDisasterData('risk_heatmap'),
      });
      map.addLayer({
        id: 'risk_heatmap_layer',
        type: 'heatmap',
        source: 'risk_heatmap_src',
        paint: {
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': 1.5,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(0,0,0,0)',
            0.2,
            '#3DDC84',
            0.5,
            '#FFB000',
            0.8,
            '#FF4B55',
            1,
            '#FF0055',
          ],
          'heatmap-radius': 30,
          'heatmap-opacity': 0.75,
        },
      });
    }
  }
}
