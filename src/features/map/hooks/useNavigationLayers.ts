import { useEffect } from 'react';
import { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
import { useNavigationStore } from '../stores/NavigationStore';

export function useNavigationLayers(map: MapLibreMap | null) {
  const {
    origin,
    destination,
    routes,
    selectedRouteId,
    telemetry,
    vehicleType,
    hazardZones,
  } = useNavigationStore();

  useEffect(() => {
    if (!map) return;

    // Helper to safely add standard GeoJSON source
    const ensureSource = (id: string, data: GeoJSON.FeatureCollection) => {
      const src = map.getSource(id) as GeoJSONSource;
      if (src) {
        src.setData(data);
      } else {
        map.addSource(id, {
          type: 'geojson',
          data,
        });
      }
    };

    // 1. Origin & Destination Markers Source
    const originDestData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (origin) {
      originDestData.features.push({
        type: 'Feature',
        properties: { type: 'origin', title: origin.label },
        geometry: { type: 'Point', coordinates: origin.coordinates },
      });
    }

    if (destination) {
      originDestData.features.push({
        type: 'Feature',
        properties: { type: 'destination', title: destination.label },
        geometry: { type: 'Point', coordinates: destination.coordinates },
      });
    }

    ensureSource('nav_waypoints_src', originDestData);

    if (!map.getLayer('nav_waypoints_layer')) {
      map.addLayer({
        id: 'nav_waypoints_layer',
        type: 'circle',
        source: 'nav_waypoints_src',
        paint: {
          'circle-radius': 9,
          'circle-color': [
            'match',
            ['get', 'type'],
            'origin',
            '#3DDC84',
            'destination',
            '#FF4B55',
            '#00D4FF',
          ],
          'circle-stroke-width': 3,
          'circle-stroke-color': '#FFFFFF',
        },
      });
    }

    // 2. Secondary Routes Line Source (Dashed Candidate Lines)
    const secondaryData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: routes
        .filter((r) => r.id !== selectedRouteId)
        .map((r) => ({
          type: 'Feature',
          properties: { id: r.id, name: r.name },
          geometry: { type: 'LineString', coordinates: r.geometry },
        })),
    };

    ensureSource('nav_secondary_routes_src', secondaryData);

    if (!map.getLayer('nav_secondary_routes_line')) {
      map.addLayer({
        id: 'nav_secondary_routes_line',
        type: 'line',
        source: 'nav_secondary_routes_src',
        paint: {
          'line-color': '#AAB6C3',
          'line-width': 4.5,
          'line-opacity': 0.65,
          'line-dasharray': [2, 2],
        },
      });
    }

    // 3. Primary Selected Route Line Source (Glowing Bold Polyline)
    const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
    const primaryData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: activeRoute
        ? [
            {
              type: 'Feature',
              properties: { id: activeRoute.id, name: activeRoute.name },
              geometry: { type: 'LineString', coordinates: activeRoute.geometry },
            },
          ]
        : [],
    };

    ensureSource('nav_primary_route_src', primaryData);

    if (!map.getLayer('nav_primary_route_casing')) {
      map.addLayer({
        id: 'nav_primary_route_casing',
        type: 'line',
        source: 'nav_primary_route_src',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#07161E',
          'line-width': 10,
          'line-opacity': 0.8,
        },
      });
    }

    if (!map.getLayer('nav_primary_route_line')) {
      map.addLayer({
        id: 'nav_primary_route_line',
        type: 'line',
        source: 'nav_primary_route_src',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#3DDC84',
            '#00D4FF',
          ],
          'line-width': 6.5,
          'line-opacity': 0.95,
        },
      });
    }

    // 4. Rescue Vehicle Live Location Marker
    const vehicleData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: telemetry
        ? [
            {
              type: 'Feature',
              properties: {
                bearing: telemetry.bearing,
                speed: telemetry.speedKmh,
                vehicleType: vehicleType,
              },
              geometry: { type: 'Point', coordinates: telemetry.coordinates },
            },
          ]
        : [],
    };

    ensureSource('nav_vehicle_src', vehicleData);

    if (!map.getLayer('nav_vehicle_beacon')) {
      map.addLayer({
        id: 'nav_vehicle_beacon',
        type: 'circle',
        source: 'nav_vehicle_src',
        paint: {
          'circle-radius': 18,
          'circle-color': '#00D4FF',
          'circle-opacity': 0.35,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#3DDC84',
        },
      });
    }

    if (!map.getLayer('nav_vehicle_symbol')) {
      map.addLayer({
        id: 'nav_vehicle_symbol',
        type: 'circle',
        source: 'nav_vehicle_src',
        paint: {
          'circle-radius': 9,
          'circle-color': '#FF4B55',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#FFFFFF',
        },
      });
    }

    // 5. Hazard Avoidance Zones & Road Closures
    const hazardData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: hazardZones.map((h) => ({
        type: 'Feature',
        properties: { name: h.name, type: h.type, severity: h.severity },
        geometry: h.geometry,
      })),
    };

    ensureSource('nav_hazard_zones_src', hazardData);

    if (!map.getLayer('nav_hazard_fill')) {
      map.addLayer({
        id: 'nav_hazard_fill',
        type: 'fill',
        source: 'nav_hazard_zones_src',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': '#FF4B55',
          'fill-opacity': 0.3,
        },
      });
    }
  }, [map, origin, destination, routes, selectedRouteId, telemetry, vehicleType, hazardZones]);
}
