import { useEffect } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import { useMapStore } from '../stores/MapStore';
import { DisasterGISService } from '../services/DisasterGISService';

export function useDisasterLayers(map: MapLibreMap | null) {
  const { activeLayers } = useMapStore();

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

    return () => {
      map.off('style.load', handleStyleLoad);
    };
  }, [map]);

  // Synchronize Disaster Layer Visibilities
  useEffect(() => {
    if (!map) return;

    const disasterLayerMappings: Record<string, string[]> = {
      flood_zone: ['flood_zone_fill', 'flood_zone_line'],
      fire_perimeter: ['fire_perimeter_fill', 'fire_perimeter_line'],
      cyclone_track: ['cyclone_track_line'],
      earthquake_risk: ['earthquake_risk_line'],
      risk_heatmap: ['risk_heatmap_layer'],
    };

    Object.entries(disasterLayerMappings).forEach(([key, layerIds]) => {
      const isVisible = activeLayers[key as keyof typeof activeLayers];
      layerIds.forEach((id) => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', isVisible ? 'visible' : 'none');
        }
      });
    });
  }, [map, activeLayers]);
}
