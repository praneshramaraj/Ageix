import { useCallback } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import { useMapStore } from '../stores/MapStore';
import { BuildingService } from '../services/BuildingService';

export function useBuildings(map: MapLibreMap | null) {
  const { is3dBuildingsEnabled, set3dBuildingsEnabled } = useMapStore();

  const toggleBuildings = useCallback(() => {
    if (!map) return;
    const nextState = !is3dBuildingsEnabled;
    set3dBuildingsEnabled(nextState);

    if (nextState) {
      BuildingService.enableBuildings(map);
    } else {
      BuildingService.disableBuildings(map);
    }
  }, [map, is3dBuildingsEnabled, set3dBuildingsEnabled]);

  return {
    is3dBuildingsEnabled,
    toggleBuildings,
  };
}
