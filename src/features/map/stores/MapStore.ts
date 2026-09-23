import { create } from 'zustand';
import {
  BasemapStyleId,
  LayerId,
  MapViewState,
  SelectedFeature,
  SearchLocationResult,
  GisToolId,
  MeasurementPoint,
  DrawnShape,
  AccessibilityOptions,
} from '../types/map';

export interface MapStoreState {
  // Map Camera State
  viewState: MapViewState;
  setViewState: (viewState: Partial<MapViewState>) => void;

  // Active Basemap & Persistence
  basemapStyle: BasemapStyleId;
  setBasemapStyle: (style: BasemapStyleId) => void;

  // Layer Visibility Dict
  activeLayers: Record<LayerId, boolean>;
  toggleLayer: (layerId: LayerId) => void;
  setLayerVisible: (layerId: LayerId, visible: boolean) => void;

  // 3D & Terrain Flags
  isTerrainEnabled: boolean;
  setTerrainEnabled: (enabled: boolean) => void;
  is3dBuildingsEnabled: boolean;
  set3dBuildingsEnabled: (enabled: boolean) => void;

  // Interactive Selection
  selectedFeature: SelectedFeature | null;
  setSelectedFeature: (feature: SelectedFeature | null) => void;

  // Search State
  searchQuery: string;
  searchResults: SearchLocationResult[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchLocationResult[]) => void;
  setIsSearching: (isSearching: boolean) => void;

  // Phase 2.5 GIS Tools (Measurement, Drawing, Export)
  activeGisTool: GisToolId;
  setActiveGisTool: (tool: GisToolId) => void;
  measurementPoints: MeasurementPoint[];
  addMeasurementPoint: (point: MeasurementPoint) => void;
  clearMeasurementPoints: () => void;

  // Drawing Tools
  drawnShapes: DrawnShape[];
  addDrawnShape: (shape: DrawnShape) => void;
  clearDrawnShapes: () => void;

  // Accessibility Options
  accessibility: AccessibilityOptions;
  toggleHighContrast: () => void;
  toggleLargeLabels: () => void;

  // Loading & Map Instance Reference
  isMapLoaded: boolean;
  setIsMapLoaded: (loaded: boolean) => void;
  tileLoadingProgress: number;
  setTileLoadingProgress: (progress: number) => void;

  // Reset
  resetMapViewState: () => void;
}

export const initialViewState: MapViewState = {
  longitude: 77.5946,
  latitude: 12.9716,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

const STORAGE_KEY_BASEMAP = 'aegisx_gis_basemap';
const STORAGE_KEY_LAYERS = 'aegisx_gis_layers';

function getStoredBasemap(): BasemapStyleId {
  const saved = localStorage.getItem(STORAGE_KEY_BASEMAP);
  return (saved as BasemapStyleId) || 'google_light';
}

function getStoredLayers(): Record<LayerId, boolean> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LAYERS);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn('Failed to parse saved layers:', err);
  }
  return {
    roads: true,
    'buildings-3d': true,
    terrain: false,
    hydrology: true,
    forests: true,
    labels: true,
    boundaries: true,
    hospitals: true,
    police: true,
    fire: true,
    shelters: true,
    schools: false,
    railways: true,
    flood_zone: true,
    cyclone_track: true,
    fire_perimeter: false,
    earthquake_risk: false,
    risk_heatmap: true,
    rescue_nodes: true,
  };
}

export const useMapStore = create<MapStoreState>((set) => ({
  viewState: initialViewState,
  setViewState: (newViewState) =>
    set((state) => ({
      viewState: { ...state.viewState, ...newViewState },
    })),

  basemapStyle: getStoredBasemap(),
  setBasemapStyle: (style) => {
    localStorage.setItem(STORAGE_KEY_BASEMAP, style);
    set({ basemapStyle: style });
  },

  activeLayers: getStoredLayers(),
  toggleLayer: (layerId) =>
    set((state) => {
      const updated = {
        ...state.activeLayers,
        [layerId]: !state.activeLayers[layerId],
      };
      localStorage.setItem(STORAGE_KEY_LAYERS, JSON.stringify(updated));
      return { activeLayers: updated };
    }),
  setLayerVisible: (layerId, visible) =>
    set((state) => {
      const updated = {
        ...state.activeLayers,
        [layerId]: visible,
      };
      localStorage.setItem(STORAGE_KEY_LAYERS, JSON.stringify(updated));
      return { activeLayers: updated };
    }),

  isTerrainEnabled: false,
  setTerrainEnabled: (enabled) =>
    set((state) => ({
      isTerrainEnabled: enabled,
      activeLayers: { ...state.activeLayers, terrain: enabled },
    })),

  is3dBuildingsEnabled: true,
  set3dBuildingsEnabled: (enabled) =>
    set((state) => ({
      is3dBuildingsEnabled: enabled,
      activeLayers: { ...state.activeLayers, 'buildings-3d': enabled },
    })),

  selectedFeature: null,
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),

  searchQuery: '',
  searchResults: [],
  isSearching: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setIsSearching: (isSearching) => set({ isSearching }),

  activeGisTool: 'none',
  setActiveGisTool: (tool) => set({ activeGisTool: tool }),

  measurementPoints: [],
  addMeasurementPoint: (point) =>
    set((state) => ({ measurementPoints: [...state.measurementPoints, point] })),
  clearMeasurementPoints: () => set({ measurementPoints: [] }),

  drawnShapes: [],
  addDrawnShape: (shape) =>
    set((state) => ({ drawnShapes: [...state.drawnShapes, shape] })),
  clearDrawnShapes: () => set({ drawnShapes: [] }),

  accessibility: {
    highContrast: false,
    largeLabels: false,
  },
  toggleHighContrast: () =>
    set((state) => ({
      accessibility: { ...state.accessibility, highContrast: !state.accessibility.highContrast },
    })),
  toggleLargeLabels: () =>
    set((state) => ({
      accessibility: { ...state.accessibility, largeLabels: !state.accessibility.largeLabels },
    })),

  isMapLoaded: false,
  setIsMapLoaded: (loaded) => set({ isMapLoaded: loaded }),
  tileLoadingProgress: 100,
  setTileLoadingProgress: (progress) => set({ tileLoadingProgress: progress }),

  resetMapViewState: () =>
    set({
      viewState: initialViewState,
    }),
}));
