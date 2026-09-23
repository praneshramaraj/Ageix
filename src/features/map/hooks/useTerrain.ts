import { useCallback } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import { useMapStore } from '../stores/MapStore';
import { TerrainService } from '../services/TerrainService';

export function useTerrain(map: MapLibreMap | null) {
  const { isTerrainEnabled, setTerrainEnabled } = useMapStore();

  const toggleTerrain = useCallback(() => {
    if (!map) return;
    const nextState = !isTerrainEnabled;
    setTerrainEnabled(nextState);

    if (nextState) {
      TerrainService.enableTerrain(map);
    } else {
      TerrainService.disableTerrain(map);
    }
  }, [map, isTerrainEnabled, setTerrainEnabled]);

  return {
    isTerrainEnabled,
    toggleTerrain,
  };
}
