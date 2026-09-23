import { SearchLocationResult } from '../types/map';

export class SearchService {
  private static readonly PRESET_LOCATIONS: SearchLocationResult[] = [
    {
      id: 'eoc-alpha',
      title: 'EOC Headquarters Alpha',
      subtitle: 'Central Rescue Command Node • Sector 1',
      category: 'district',
      coordinates: [77.592, 12.9715],
      zoom: 16,
      properties: {
        adminArea: 'Bengaluru Urban',
        status: 'Operational',
        contact: '+91 80 2222 1000',
      },
    },
    {
      id: 'hosp-metro-gen',
      title: 'Metro General Hospital',
      subtitle: 'Level 1 Trauma Center • 450 Beds',
      category: 'hospital',
      coordinates: [77.5975, 12.9735],
      zoom: 17,
      properties: {
        capacity: 450,
        icuBeds: 60,
        status: 'Active',
        contact: 'Emergency 108',
      },
    },
    {
      id: 'shelter-central-1',
      title: 'Central Evacuation Shelter 1',
      subtitle: 'Cyclone & Flood Staging Ground • Cap: 1200',
      category: 'shelter',
      coordinates: [77.5865, 12.9665],
      zoom: 16,
      properties: {
        capacity: 1200,
        currentOccupancy: 340,
        suppliesDays: 14,
        status: 'Open',
      },
    },
    {
      id: 'police-central-stn',
      title: 'Central Police Station',
      subtitle: 'Emergency Dispatch & Law Enforcement',
      category: 'police',
      coordinates: [77.591, 12.968],
      zoom: 16,
      properties: {
        personnelCount: 85,
        vehicles: 12,
        status: 'On Standby',
      },
    },
    {
      id: 'fire-central-hq',
      title: 'Fire Station 01 - Rescue Central',
      subtitle: 'HAZMAT & Heavy Extraction Unit',
      category: 'fire',
      coordinates: [77.589, 12.976],
      zoom: 17,
      properties: {
        trucks: 8,
        hazmatSquads: 2,
        status: 'Ready',
      },
    },
    {
      id: 'city-bengaluru',
      title: 'Bengaluru Metropolitan Area',
      subtitle: 'State Capital • Population: 12.5M',
      category: 'city',
      coordinates: [77.5946, 12.9716],
      zoom: 12,
      properties: {
        elevation: 920,
        adminArea: 'Karnataka',
      },
    },
    {
      id: 'airport-kempegowda',
      title: 'Kempegowda Int. Airport (BLR)',
      subtitle: 'Airlift & Cargo Staging Terminal',
      category: 'airport',
      coordinates: [77.7063, 13.1986],
      zoom: 14,
      properties: {
        runways: 2,
        status: 'Operational',
      },
    },
  ];

  /**
   * Search locations by query string
   */
  public static async search(query: string): Promise<SearchLocationResult[]> {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const localMatches = this.PRESET_LOCATIONS.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.subtitle.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    );

    // If query looks like coordinates: "12.9716, 77.5946"
    const coordMatch = query.match(/^([-+]?\d+\.\d+),\s*([-+]?\d+\.\d+)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        localMatches.unshift({
          id: `custom-coord-${Date.now()}`,
          title: `Coordinate Pin`,
          subtitle: `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`,
          category: 'district',
          coordinates: [lng, lat],
          zoom: 15,
        });
      }
    }

    return localMatches;
  }
}
