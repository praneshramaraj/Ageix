export type BasemapStyleId = 'standard' | 'google_light' | 'dark' | 'light' | 'terrain' | 'satellite';

export type LayerId =
  | 'roads'
  | 'buildings-3d'
  | 'terrain'
  | 'hydrology'
  | 'forests'
  | 'labels'
  | 'boundaries'
  | 'hospitals'
  | 'police'
  | 'fire'
  | 'shelters'
  | 'schools'
  | 'railways'
  // Disaster Overlays (Phase 2.3)
  | 'flood_zone'
  | 'cyclone_track'
  | 'fire_perimeter'
  | 'earthquake_risk'
  | 'risk_heatmap'
  | 'rescue_nodes';

export type LayerCategory = 'base' | 'environmental' | 'infrastructure' | 'emergency' | 'disaster';

export interface LayerDef {
  id: LayerId;
  name: string;
  category: LayerCategory;
  description: string;
  icon: string;
  defaultVisible: boolean;
  color: string;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface MapFeatureMetadata {
  name?: string;
  type?: string;
  category?: string;
  adminArea?: string;
  elevation?: number;
  population?: number;
  contact?: string;
  capacity?: number;
  status?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  address?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface SelectedFeature {
  id: string | number;
  name: string;
  type: string;
  category: string;
  coordinates: [number, number];
  properties: MapFeatureMetadata;
  layerId?: string;
}

export interface SearchLocationResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'city' | 'district' | 'hospital' | 'shelter' | 'police' | 'fire' | 'school' | 'airport';
  coordinates: [number, number];
  zoom?: number;
  properties?: Record<string, any>;
}

export interface LegendItemDef {
  id: string;
  label: string;
  color: string;
  type: 'line' | 'fill' | 'symbol' | 'circle';
  icon?: string;
}

export interface LegendGroupDef {
  title: string;
  items: LegendItemDef[];
}

// Phase 2.5 GIS Tools
export type GisToolId = 'none' | 'measure_distance' | 'measure_area' | 'draw_polygon' | 'draw_rectangle' | 'place_marker' | 'export';

export interface MeasurementPoint {
  coordinates: [number, number];
  label?: string;
}

export interface DrawnShape {
  id: string;
  type: 'polygon' | 'rectangle' | 'marker';
  coordinates: [number, number][] | [number, number];
  color: string;
  label?: string;
  properties?: Record<string, any>;
}

export interface AccessibilityOptions {
  highContrast: boolean;
  largeLabels: boolean;
}
