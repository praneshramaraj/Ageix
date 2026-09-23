import { useEffect } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import { useMapStore } from '../stores/MapStore';
import { LayerService } from '../services/LayerService';

export function useLayers(map: MapLibreMap | null) {
  const { activeLayers } = useMapStore();

  useEffect(() => {
    if (!map) return;

    Object.entries(activeLayers).forEach(([layerId, isVisible]) => {
      LayerService.setLayerVisibility(map, layerId as any, isVisible);
    });
  }, [map, activeLayers]);

  return {
    layers: LayerService.LAYERS,
    activeLayers,
  };
}
