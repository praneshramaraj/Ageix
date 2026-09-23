import { LayerDef, LayerId } from '../types/map';
import { Map as MapLibreMap } from 'maplibre-gl';

export class LayerService {
  public static readonly LAYERS: LayerDef[] = [
    {
      id: 'flood_zone',
      name: 'Flood Inundation Zone',
      category: 'disaster',
      description: 'Active flood inundation areas, submerged roads, water levels',
      icon: 'Droplet',
      defaultVisible: true,
      color: '#00D4FF',
    },
    {
      id: 'fire_perimeter',
      name: 'Wildfire Perimeters',
      category: 'disaster',
      description: 'Active forest fire perimeters & heat intensity zones',
      icon: 'Flame',
      defaultVisible: false,
      color: '#FF4B55',
    },
    {
      id: 'cyclone_track',
      name: 'Cyclone Storm Track',
      category: 'disaster',
      description: 'Storm track trajectory & wind speed radial buffer',
      icon: 'Wind',
      defaultVisible: true,
      color: '#FFB000',
    },
    {
      id: 'earthquake_risk',
      name: 'Earthquake Isoseismals',
      category: 'disaster',
      description: 'Seismic fault line risk rings & epicenter zones',
      icon: 'Activity',
      defaultVisible: false,
      color: '#FF0055',
    },
    {
      id: 'risk_heatmap',
      name: 'Risk Density Heatmap',
      category: 'disaster',
      description: 'Kernel density interpolation of disaster risk intensity',
      icon: 'Flame',
      defaultVisible: true,
      color: '#FF0055',
    },
    {
      id: 'rescue_nodes',
      name: 'Live Rescue Markers',
      category: 'emergency',
      description: 'SOS alerts, trapped victims, road blockages, drones',
      icon: 'Radio',
      defaultVisible: true,
      color: '#3DDC84',
    },
    {
      id: 'roads',
      name: 'Road Network',
      category: 'infrastructure',
      description: 'Motorways, primary highways, secondary roads, footpaths',
      icon: 'Route',
      defaultVisible: true,
      color: '#00D4FF',
    },
    {
      id: 'buildings-3d',
      name: '3D Buildings',
      category: 'infrastructure',
      description: 'OSM building footprints extruded in 3D',
      icon: 'Building2',
      defaultVisible: true,
      color: '#3182ce',
    },
    {
      id: 'terrain',
      name: 'Terrain & Elevation',
      category: 'environmental',
      description: '3D DEM mesh, hillshade contouring, elevation model',
      icon: 'Mountain',
      defaultVisible: false,
      color: '#FFB000',
    },
    {
      id: 'hydrology',
      name: 'Hydrology & Rivers',
      category: 'environmental',
      description: 'Major rivers, canals, lakes, reservoirs, coastlines',
      icon: 'Droplets',
      defaultVisible: true,
      color: '#00D4FF',
    },
    {
      id: 'forests',
      name: 'Forests & Greenery',
      category: 'environmental',
      description: 'Reserve forests, national parks, protected green zones',
      icon: 'Trees',
      defaultVisible: true,
      color: '#3DDC84',
    },
    {
      id: 'labels',
      name: 'Place Labels',
      category: 'base',
      description: 'Multilevel city, district, village, and landmark labels',
      icon: 'Tag',
      defaultVisible: true,
      color: '#FFFFFF',
    },
    {
      id: 'boundaries',
      name: 'Admin Boundaries',
      category: 'base',
      description: 'State, district, taluk, and village administrative lines',
      icon: 'MapPin',
      defaultVisible: true,
      color: '#FFB000',
    },
    {
      id: 'hospitals',
      name: 'Hospitals & Medical',
      category: 'emergency',
      description: 'Emergency trauma centers, hospitals, medical facilities',
      icon: 'Cross',
      defaultVisible: true,
      color: '#FF4B55',
    },
    {
      id: 'police',
      name: 'Police Stations',
      category: 'emergency',
      description: 'Law enforcement stations and security outposts',
      icon: 'Shield',
      defaultVisible: true,
      color: '#3182ce',
    },
    {
      id: 'fire',
      name: 'Fire Stations',
      category: 'emergency',
      description: 'Fire stations, rescue depots, HAZMAT squads',
      icon: 'Flame',
      defaultVisible: true,
      color: '#FF4B55',
    },
    {
      id: 'shelters',
      name: 'Evacuation Shelters',
      category: 'emergency',
      description: 'High-capacity cyclone shelters, relief centers',
      icon: 'Home',
      defaultVisible: true,
      color: '#3DDC84',
    },
    {
      id: 'schools',
      name: 'Schools & Colleges',
      category: 'infrastructure',
      description: 'Educational institutes usable as secondary staging areas',
      icon: 'GraduationCap',
      defaultVisible: false,
      color: '#AAB6C3',
    },
    {
      id: 'railways',
      name: 'Railway Lines',
      category: 'infrastructure',
      description: 'Mainline tracks, freight lines, railway stations',
      icon: 'Train',
      defaultVisible: true,
      color: '#FFB000',
    },
  ];

  /**
   * Set MapLibre layer visibility based on store state
   */
  public static setLayerVisibility(map: MapLibreMap, layerId: LayerId, visible: boolean): void {
    if (!map) return;

    const layerMap: Record<LayerId, string[]> = {
      roads: ['osm-raster-layer'],
      'buildings-3d': ['buildings-3d-layer'],
      terrain: ['hillshade-layer'],
      hydrology: ['osm-raster-layer'],
      forests: ['osm-raster-layer'],
      labels: ['osm-raster-layer'],
      boundaries: ['osm-raster-layer'],
      hospitals: ['osm-raster-layer'],
      police: ['osm-raster-layer'],
      fire: ['osm-raster-layer'],
      shelters: ['osm-raster-layer'],
      schools: ['osm-raster-layer'],
      railways: ['osm-raster-layer'],
      flood_zone: ['flood_zone_fill', 'flood_zone_line'],
      fire_perimeter: ['fire_perimeter_fill', 'fire_perimeter_line'],
      cyclone_track: ['cyclone_track_line'],
      earthquake_risk: ['earthquake_risk_line'],
      risk_heatmap: ['risk_heatmap_layer'],
      rescue_nodes: [],
    };

    const targetLayerIds = layerMap[layerId] || [];
    targetLayerIds.forEach((targetId) => {
      if (map.getLayer(targetId)) {
        map.setLayoutProperty(targetId, 'visibility', visible ? 'visible' : 'none');
      }
    });
  }
}
