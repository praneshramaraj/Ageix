import { Map as MapLibreMap } from 'maplibre-gl';

export class BuildingService {
  /**
   * Enable 3D building extrusion layer and adjust camera pitch smoothly
   */
  public static enableBuildings(map: MapLibreMap): void {
    if (!map) return;

    if (map.getLayer('buildings-3d-layer')) {
      map.setLayoutProperty('buildings-3d-layer', 'visibility', 'visible');
    }

    if (map.getPitch() < 30) {
      map.easeTo({
        pitch: 60,
        bearing: 25,
        duration: 1000,
      });
    }
  }

  /**
   * Disable 3D building extrusion layer
   */
  public static disableBuildings(map: MapLibreMap): void {
    if (!map) return;

    if (map.getLayer('buildings-3d-layer')) {
      map.setLayoutProperty('buildings-3d-layer', 'visibility', 'none');
    }

    if (map.getPitch() > 40) {
      map.easeTo({
        pitch: 0,
        duration: 800,
      });
    }
  }
}
