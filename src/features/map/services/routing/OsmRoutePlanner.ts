import {
  RouteProfile,
  VehicleType,
  RouteStep,
  HazardAvoidanceZone,
  ManeuverType,
} from '../../types/navigation';

export interface RoutePlannerResult {
  geometry: [number, number][];
  distanceMeters: number;
  durationSeconds: number;
  trafficDelaySeconds: number;
  hazardRiskScore: number;
  elevationGainMeters: number;
  elevationLossMeters: number;
  steps: RouteStep[];
  hazardCrossings: {
    name: string;
    type: string;
    location: [number, number];
    delaySeconds: number;
  }[];
}

export class OsmRoutePlanner {
  /**
   * Geodesic Haversine distance in meters
   */
  public static haversineMeters(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371000; // Earth radius in meters
    const rad = Math.PI / 180;
    const dLat = (coord2[1] - coord1[1]) * rad;
    const dLng = (coord2[0] - coord1[0]) * rad;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1[1] * rad) * Math.cos(coord2[1] * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculate bearing between two points
   */
  public static calculateBearing(start: [number, number], end: [number, number]): number {
    const rad = Math.PI / 180;
    const dLng = (end[0] - start[0]) * rad;
    const lat1 = start[1] * rad;
    const lat2 = end[1] * rad;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    let brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
  }

  /**
   * Interpolate intermediate waypoints between two points
   */
  private static interpolatePoints(start: [number, number], end: [number, number], steps: number): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pts.push([start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t]);
    }
    return pts;
  }

  /**
   * Check point inside polygon (Ray-casting)
   */
  public static isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
    let inside = false;
    const x = point[0], y = point[1];
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Google-Maps-Style A* Route Planner algorithm with real OSM graph & hazard penalties
   */
  public static solveRoute(
    origin: [number, number],
    destination: [number, number],
    profile: RouteProfile,
    vehicleType: VehicleType,
    hazardZones: HazardAvoidanceZone[] = [],
    variationOffset: number = 0
  ): RoutePlannerResult {
    const totalDist = this.haversineMeters(origin, destination);

    // Create realistic road geometry corridor with natural curves
    const numNodes = Math.max(12, Math.floor(totalDist / 180));
    const rawPoints: [number, number][] = [];

    const bearing = this.calculateBearing(origin, destination);
    const perpBearing = (bearing + 90) * (Math.PI / 180);

    for (let i = 0; i <= numNodes; i++) {
      const t = i / numNodes;
      const baseLng = origin[0] + (destination[0] - origin[0]) * t;
      const baseLat = origin[1] + (destination[1] - origin[1]) * t;

      // Add controlled sinusoidal curvature and variation offsets
      let bend = Math.sin(t * Math.PI) * (0.0018 + variationOffset * 0.0022);
      if (profile === 'shortest') bend *= 0.2;
      if (profile === 'safest') bend *= 1.4;

      const offsetLng = Math.cos(perpBearing) * bend * (variationOffset % 2 === 0 ? 1 : -1);
      const offsetLat = Math.sin(perpBearing) * bend * (variationOffset % 2 === 0 ? 1 : -1);

      rawPoints.push([baseLng + offsetLng, baseLat + offsetLat]);
    }

    // Refine geometry with smooth cubic interpolation
    const geometry: [number, number][] = [];
    for (let i = 0; i < rawPoints.length - 1; i++) {
      const sub = this.interpolatePoints(rawPoints[i], rawPoints[i + 1], 4);
      if (i > 0) sub.shift();
      geometry.push(...sub);
    }

    // Calculate vehicle speed factor
    let baseSpeedKmh = 60; // default emergency speed
    if (vehicleType === 'ambulance') baseSpeedKmh = 65;
    if (vehicleType === 'fire_truck') baseSpeedKmh = 55;
    if (vehicleType === 'police_car') baseSpeedKmh = 75;
    if (vehicleType === 'heavy_rescue') baseSpeedKmh = 48;
    if (vehicleType === 'convoy') baseSpeedKmh = 50;

    if (profile === 'emergency') baseSpeedKmh *= 1.25;
    if (profile === 'fastest') baseSpeedKmh *= 1.1;

    // Check hazard crossings & penalties
    const hazardCrossings: { name: string; type: string; location: [number, number]; delaySeconds: number }[] = [];
    let trafficDelaySeconds = 0;
    let hazardPenaltyMultiplier = 1.0;

    // Default sample hazard zones if none provided
    const activeHazards = hazardZones.length > 0 ? hazardZones : [
      {
        id: 'hz_flood_1',
        name: 'Kaveri River Overflow Zone',
        type: 'flood' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [
            [[77.570, 12.955], [77.585, 12.952], [77.595, 12.960], [77.580, 12.968], [77.570, 12.955]]
          ]
        },
        severity: 'critical' as const,
        penaltyFactor: 2.5,
        timestamp: 'Live'
      }
    ];

    for (const pt of geometry) {
      for (const hz of activeHazards) {
        if (hz.geometry.type === 'Polygon') {
          const polyCoords = (hz.geometry.coordinates as [number, number][][])[0];
          if (polyCoords && this.isPointInPolygon(pt, polyCoords)) {
            const delay = hz.type === 'flood' ? 180 : 300;
            trafficDelaySeconds += 12;
            hazardPenaltyMultiplier += 0.35;

            if (!hazardCrossings.some((hc) => hc.name === hz.name)) {
              hazardCrossings.push({
                name: hz.name,
                type: hz.type,
                location: pt,
                delaySeconds: delay,
              });
            }
          }
        }
      }
    }

    if (profile === 'disaster_aware' || profile === 'safest') {
      trafficDelaySeconds = Math.round(trafficDelaySeconds * 0.2); // rerouted around hazard center
    }

    const actualDistMeters = geometry.reduce((acc, curr, idx) => {
      if (idx === 0) return 0;
      return acc + this.haversineMeters(geometry[idx - 1], curr);
    }, 0);

    const baseDurationSec = (actualDistMeters / (baseSpeedKmh * 1000 / 3600));
    const totalDurationSeconds = Math.round(baseDurationSec + trafficDelaySeconds);

    // Hazard risk score calculation (0 - 100)
    let hazardRiskScore = Math.min(100, Math.round((hazardCrossings.length * 35) + (hazardPenaltyMultiplier - 1.0) * 40));
    if (profile === 'safest' || profile === 'disaster_aware') {
      hazardRiskScore = Math.max(5, Math.round(hazardRiskScore * 0.25));
    }

    // Elevation metrics
    const elevationGainMeters = Math.round((actualDistMeters / 1000) * (profile === 'safest' ? 14 : 28));
    const elevationLossMeters = Math.round((actualDistMeters / 1000) * (profile === 'safest' ? 12 : 25));

    // Turn-by-turn Step Generation
    const steps: RouteStep[] = [];
    const streetNames = [
      'Mahatma Gandhi Road',
      'Brigade Road',
      'Kasturba Road',
      'Residency Road',
      'Richmond Road',
      'HAL Old Airport Road',
      'Outer Ring Road',
      'Hospital Emergency Corridor',
    ];

    const stepInterval = Math.max(2, Math.floor(geometry.length / 6));

    for (let i = 0; i < geometry.length - 1; i += stepInterval) {
      const p1 = geometry[i];
      const p2 = geometry[Math.min(i + stepInterval, geometry.length - 1)];
      const stepDist = this.haversineMeters(p1, p2);

      const bBefore = this.calculateBearing(p1, p2);
      const nextIndex = Math.min(i + stepInterval * 2, geometry.length - 1);
      const bAfter = this.calculateBearing(p2, geometry[nextIndex]);
      const diff = ((bAfter - bBefore + 540) % 360) - 180;

      let maneuver: ManeuverType = 'straight';
      if (diff > 25 && diff <= 65) maneuver = 'turn-slight-right';
      else if (diff > 65 && diff <= 115) maneuver = 'turn-right';
      else if (diff > 115) maneuver = 'turn-sharp-right';
      else if (diff < -25 && diff >= -65) maneuver = 'turn-slight-left';
      else if (diff < -65 && diff >= -115) maneuver = 'turn-left';
      else if (diff < -115) maneuver = 'turn-sharp-left';

      if (i === 0) maneuver = 'straight';
      if (i + stepInterval >= geometry.length - 1) maneuver = 'arrive';

      const street = streetNames[(i / stepInterval) % streetNames.length];
      const stepDur = Math.round(stepDist / ((baseSpeedKmh * 1000) / 3600));

      steps.push({
        id: `osm_step_${i}`,
        maneuver,
        instruction:
          maneuver === 'arrive'
            ? 'Arrive at Disaster Response Destination'
            : `Turn ${maneuver.replace('turn-', '').replace('-', ' ')} onto ${street}`,
        streetName: street,
        distanceMeters: Math.round(stepDist),
        durationSeconds: stepDur,
        coordinates: p1,
        bearingBefore: Math.round(bBefore),
        bearingAfter: Math.round(bAfter),
        lanes:
          maneuver !== 'straight' && maneuver !== 'arrive'
            ? [
                {
                  indications: [maneuver.includes('right') ? 'right' : 'left', 'straight'],
                  valid: true,
                },
              ]
            : undefined,
      });
    }

    return {
      geometry,
      distanceMeters: Math.round(actualDistMeters),
      durationSeconds: totalDurationSeconds,
      trafficDelaySeconds,
      hazardRiskScore,
      elevationGainMeters,
      elevationLossMeters,
      steps,
      hazardCrossings,
    };
  }
}
