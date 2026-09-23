import { create } from 'zustand';
import {
  VehicleType,
  RouteProfile,
  EmergencyRoute,
  NavigationStatus,
  VehicleTelemetry,
  CameraFollowMode,
  HazardAvoidanceZone,
  MissionLocationTarget,
} from '../types/navigation';

export interface NavigationStoreState {
  // Origin & Destination
  origin: { coordinates: [number, number]; label: string } | null;
  destination: { coordinates: [number, number]; label: string } | null;
  setOrigin: (origin: { coordinates: [number, number]; label: string } | null) => void;
  setDestination: (destination: { coordinates: [number, number]; label: string } | null) => void;
  swapOriginDestination: () => void;

  // Selected Modes
  vehicleType: VehicleType;
  setVehicleType: (type: VehicleType) => void;
  selectedProfile: RouteProfile;
  setSelectedProfile: (profile: RouteProfile) => void;

  // Routes & Selection
  routes: EmergencyRoute[];
  setRoutes: (routes: EmergencyRoute[]) => void;
  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;
  getSelectedRoute: () => EmergencyRoute | null;

  // Navigation Status & Telemetry
  navigationStatus: NavigationStatus;
  setNavigationStatus: (status: NavigationStatus) => void;
  telemetry: VehicleTelemetry | null;
  setTelemetry: (telemetry: VehicleTelemetry | null) => void;

  // Camera & Visual Controls
  cameraMode: CameraFollowMode;
  setCameraMode: (mode: CameraFollowMode) => void;

  // Voice Guidance Settings
  isVoiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  voiceVolume: number;
  setVoiceVolume: (volume: number) => void;
  lastSpokenInstructionId: string | null;
  setLastSpokenInstructionId: (id: string | null) => void;

  // Hazard Avoidance Zones
  hazardZones: HazardAvoidanceZone[];
  addHazardZone: (zone: HazardAvoidanceZone) => void;
  removeHazardZone: (id: string) => void;
  clearHazardZones: () => void;

  // Simulation Playback Controls
  isSimulationPlaying: boolean;
  simulationSpeed: number; // 1x, 2x, 4x, 8x
  setIsSimulationPlaying: (playing: boolean) => void;
  setSimulationSpeed: (speed: number) => void;

  // Active Mission Target
  activeMissionTarget: MissionLocationTarget | null;
  setActiveMissionTarget: (target: MissionLocationTarget | null) => void;

  // Comparison Modal Toggle
  isComparisonModalOpen: boolean;
  setIsComparisonModalOpen: (open: boolean) => void;

  // Reset & Clear
  clearRouting: () => void;
}

export const useNavigationStore = create<NavigationStoreState>((set, get) => ({
  origin: { coordinates: [77.5946, 12.9716], label: 'Command Center Headquarters (Bangalore)' },
  destination: null,
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  swapOriginDestination: () =>
    set((state) => ({
      origin: state.destination,
      destination: state.origin,
    })),

  vehicleType: 'ambulance',
  setVehicleType: (vehicleType) => set({ vehicleType }),

  selectedProfile: 'fastest',
  setSelectedProfile: (selectedProfile) => set({ selectedProfile }),

  routes: [],
  setRoutes: (routes) => set({ routes }),
  selectedRouteId: null,
  setSelectedRouteId: (selectedRouteId) => set({ selectedRouteId }),
  getSelectedRoute: () => {
    const { routes, selectedRouteId } = get();
    return routes.find((r) => r.id === selectedRouteId) || routes[0] || null;
  },

  navigationStatus: 'idle',
  setNavigationStatus: (navigationStatus) => set({ navigationStatus }),

  telemetry: null,
  setTelemetry: (telemetry) => set({ telemetry }),

  cameraMode: 'follow',
  setCameraMode: (cameraMode) => set({ cameraMode }),

  isVoiceEnabled: true,
  setVoiceEnabled: (isVoiceEnabled) => set({ isVoiceEnabled }),
  voiceVolume: 1.0,
  setVoiceVolume: (voiceVolume) => set({ voiceVolume }),
  lastSpokenInstructionId: null,
  setLastSpokenInstructionId: (lastSpokenInstructionId) => set({ lastSpokenInstructionId }),

  hazardZones: [],
  addHazardZone: (zone) =>
    set((state) => ({ hazardZones: [...state.hazardZones, zone] })),
  removeHazardZone: (id) =>
    set((state) => ({ hazardZones: state.hazardZones.filter((z) => z.id !== id) })),
  clearHazardZones: () => set({ hazardZones: [] }),

  isSimulationPlaying: false,
  simulationSpeed: 1,
  setIsSimulationPlaying: (isSimulationPlaying) => set({ isSimulationPlaying }),
  setSimulationSpeed: (simulationSpeed) => set({ simulationSpeed }),

  activeMissionTarget: null,
  setActiveMissionTarget: (activeMissionTarget) => set({ activeMissionTarget }),

  isComparisonModalOpen: false,
  setIsComparisonModalOpen: (open) => set({ isComparisonModalOpen: open }),

  clearRouting: () =>
    set({
      routes: [],
      selectedRouteId: null,
      navigationStatus: 'idle',
      telemetry: null,
      isSimulationPlaying: false,
      activeMissionTarget: null,
    }),
}));
