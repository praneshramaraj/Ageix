import { useEffect } from 'react';
import { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
import { useMapStore } from '../stores/MapStore';
import { DisasterGISService } from '../services/DisasterGISService';
import { useIncidentBoardStore } from '../../../stores/IncidentBoardStore';

export function useDisasterLayers(map: MapLibreMap | null) {
  const { activeLayers } = useMapStore();
  const { incidents } = useIncidentBoardStore();

  useEffect(() => {
    if (!map) return;

    // Initialize disaster GeoJSON sources & layers on style load
    const handleStyleLoad = () => {
      DisasterGISService.addDisasterLayersToMap(map);
    };

    if (map.isStyleLoaded()) {
      handleStyleLoad();
    }
    map.on('style.load', handleStyleLoad);
    map.on('load', handleStyleLoad);

    return () => {
      try {
        map.off('style.load', handleStyleLoad);
        map.off('load', handleStyleLoad);
      } catch (_) {}
    };
  }, [map]);

  // Synchronize dynamic incident & SOS points on map
  useEffect(() => {
    if (!map) return;

    const syncIncidents = () => {
      try {
        const source = map.getSource('rescue_nodes_src') as GeoJSONSource;
        if (source) {
          const incidentFeatures: GeoJSON.Feature[] = incidents.map((inc) => ({
            type: 'Feature',
            properties: {
              id: inc.id,
              name: inc.title,
              type: inc.category.toUpperCase(),
              priority: inc.severity,
              reportedBy: inc.reportedBy,
              timestamp: inc.timestamp,
            },
            geometry: {
              type: 'Point',
              coordinates: inc.coordinates,
            },
          }));

          source.setData({
            type: 'FeatureCollection',
            features: incidentFeatures,
          });
        }
      } catch (_) {}
    };

    syncIncidents();
  }, [map, incidents]);

  // Synchronize Disaster Layer Visibilities
  useEffect(() => {
    if (!map) return;

    const disasterLayerMappings: Record<string, string[]> = {
      flood_zone: ['flood_zone_fill', 'flood_zone_line'],
      fire_perimeter: ['fire_perimeter_fill', 'fire_perimeter_line'],
      cyclone_track: ['cyclone_track_line'],
      earthquake_risk: ['earthquake_risk_line'],
      risk_heatmap: ['risk_heatmap_layer'],
      rescue_nodes: ['rescue_nodes_layer'],
    };

    Object.entries(disasterLayerMappings).forEach(([key, layerIds]) => {
      const isVisible = activeLayers[key as keyof typeof activeLayers];
      layerIds.forEach((id) => {
        try {
          if (map.getLayer(id)) {
            map.setLayoutProperty(id, 'visibility', isVisible !== false ? 'visible' : 'none');
          }
        } catch (_) {}
      });
    });
  }, [map, activeLayers]);
}
