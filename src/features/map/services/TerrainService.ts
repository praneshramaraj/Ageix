import { Map as MapLibreMap } from 'maplibre-gl';

export class TerrainService {
  /**
   * Enable 3D Terrain mesh on MapLibre instance
   */
  public static enableTerrain(map: MapLibreMap, exaggeration: number = 1.5): void {
    if (!map) return;

    try {
      if (!map.getSource('dem-terrain')) {
        map.addSource('dem-terrain', {
          type: 'raster-dem',
          tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
          tileSize: 256,
          encoding: 'terrarium',
          maxzoom: 15,
        });
      }

      map.setTerrain({
        source: 'dem-terrain',
        exaggeration: exaggeration,
      });

      if (map.getLayer('hillshade-layer')) {
        map.setLayoutProperty('hillshade-layer', 'visibility', 'visible');
      }
    } catch (err) {
      console.warn('Terrain activation note:', err);
    }
  }

  /**
   * Disable 3D Terrain mesh
   */
  public static disableTerrain(map: MapLibreMap): void {
    if (!map) return;
    try {
      map.setTerrain(null);
      if (map.getLayer('hillshade-layer')) {
        map.setLayoutProperty('hillshade-layer', 'visibility', 'none');
      }
    } catch (err) {
      console.warn('Terrain disable note:', err);
    }
  }
}
