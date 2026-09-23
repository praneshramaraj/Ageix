import { BasemapStyleId } from '../types/map';
import { getBasemapStyle } from '../utils/styleBuilder';
import { StyleSpecification } from 'maplibre-gl';

export class TileService {
  /**
   * Get complete vector/raster style specification for given basemap ID
   */
  public static getStyle(styleId: BasemapStyleId): StyleSpecification {
    return getBasemapStyle(styleId);
  }

  /**
   * Preload tile URL endpoints for latency optimization
   */
  public static preloadBasemaps(): void {
    const urls = [
      'https://api.maptiler.com/',
      'https://tile.openstreetmap.org/',
      'https://a.basemaps.cartocdn.com/',
    ];
    urls.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }

}
