export type VehicleType = 
  | 'ambulance'
  | 'fire_truck'
  | 'police_car'
  | 'heavy_rescue'
  | 'rescue_boat'
  | 'convoy';

export type RouteProfile = 
  | 'fastest'
  | 'shortest'
  | 'safest'
  | 'emergency'
  | 'disaster_aware';

export type ManeuverType =
  | 'straight'
  | 'turn-slight-right'
  | 'turn-right'
  | 'turn-sharp-right'
  | 'u-turn'
  | 'turn-sharp-left'
  | 'turn-left'
  | 'turn-slight-left'
  | 'roundabout'
  | 'merge'
  | 'fork'
  | 'ramp'
  | 'arrive';

export interface LaneGuidance {
  indications: ('left' | 'slight_left' | 'straight' | 'slight_right' | 'right' | 'u_turn')[];
  valid: boolean;
  activeDirection?: string;
}

export interface RouteStep {
  id: string;
  maneuver: ManeuverType;
  instruction: string;
  streetName: string;
  distanceMeters: number;
  durationSeconds: number;
  coordinates: [number, number];
  bearingBefore: number;
  bearingAfter: number;
  lanes?: LaneGuidance[];
  hazardWarning?: string;
}

export interface HazardAvoidanceZone {
  id: string;
  name: string;
  type: 'flood' | 'fire' | 'landslide' | 'bridge_collapse' | 'road_block' | 'custom_avoid';
  geometry: GeoJSON.Polygon | GeoJSON.Point | GeoJSON.LineString;
  severity: 'low' | 'medium' | 'high' | 'critical';
  penaltyFactor: number;
  timestamp: string;
}

export interface RouteScore {
  overallScore: number; // 0 - 100
  speedScore: number;
  safetyScore: number;
  distanceScore: number;
  elevationScore: number;
  riskFactor: number; // 0 - 100
  aiRecommendationReason?: string;
  isAiRecommended?: boolean;
}

export interface EmergencyRoute {
  id: string;
  name: string;
  profile: RouteProfile;
  vehicleType: VehicleType;
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  trafficDelaySeconds: number;
  hazardRiskScore: number; // 0 - 100
  elevationGainMeters: number;
  elevationLossMeters: number;
  geometry: [number, number][]; // Array of [lng, lat]
  steps: RouteStep[];
  score: RouteScore;
  roadTypesSummary: {
    highway: number; // % of route
    primary: number;
    secondary: number;
    residential: number;
    unpaved: number;
  };
  hazardCrossings: {
    name: string;
    type: string;
    location: [number, number];
    delaySeconds: number;
  }[];
}

export type CameraFollowMode = 'follow' | 'north_up' | 'free';

export type NavigationStatus = 'idle' | 'calculating' | 'route_selected' | 'navigating' | 'rerouting' | 'arrived';

export interface VehicleTelemetry {
  coordinates: [number, number];
  bearing: number;
  speedKmh: number;
  currentStepIndex: number;
  distanceToNextManeuverMeters: number;
  remainingDistanceMeters: number;
  remainingDurationSeconds: number;
  progressPercentage: number;
  currentStreetName: string;
  isOffRoute: boolean;
}

export interface MissionLocationTarget {
  id: string;
  title: string;
  type: 'sos' | 'hospital' | 'shelter' | 'fire_station' | 'police_station' | 'relief_camp' | 'supply_depot' | 'safe_zone';
  coordinates: [number, number];
  description?: string;
  urgency?: 'normal' | 'high' | 'critical';
  victimsCount?: number;
  availableBeds?: number;
}
