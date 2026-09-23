import { ValhallaRoutingEngine } from './ValhallaRoutingEngine';
import { OsrmRoutingEngine } from './OsrmRoutingEngine';
import { OsmRoutePlanner } from './OsmRoutePlanner';
import { AiRoutingService } from './AiRoutingService';
import {
  EmergencyRoute,
  VehicleType,
  RouteProfile,
  HazardAvoidanceZone,
} from '../../types/navigation';

export class UnifiedRoutingService {
  /**
   * Helper to build complete EmergencyRoute object from raw planner result
   */
  private static buildRouteObject(
    id: string,
    name: string,
    profile: RouteProfile,
    vehicleType: VehicleType,
    rawResult: {
      geometry: [number, number][];
      distanceMeters: number;
      durationSeconds: number;
      trafficDelaySeconds: number;
      hazardRiskScore: number;
      elevationGainMeters: number;
      elevationLossMeters: number;
      steps: any[];
      hazardCrossings: any[];
    }
  ): EmergencyRoute {
    const routeObj: Partial<EmergencyRoute> = {
      id,
      name,
      profile,
      vehicleType,
      totalDistanceMeters: rawResult.distanceMeters,
      totalDurationSeconds: rawResult.durationSeconds,
      trafficDelaySeconds: rawResult.trafficDelaySeconds,
      hazardRiskScore: rawResult.hazardRiskScore,
      elevationGainMeters: rawResult.elevationGainMeters,
      elevationLossMeters: rawResult.elevationLossMeters,
      geometry: rawResult.geometry,
      steps: rawResult.steps,
      roadTypesSummary: {
        highway: profile === 'fastest' ? 45 : 20,
        primary: 35,
        secondary: 15,
        residential: 5,
        unpaved: profile === 'safest' ? 0 : 5,
      },
      hazardCrossings: rawResult.hazardCrossings,
    };

    const score = AiRoutingService.scoreRoute(routeObj, vehicleType, 'critical');
    routeObj.score = score;

    return routeObj as EmergencyRoute;
  }

  /**
   * Main router entry point generating Primary, Secondary & Safest Candidate Routes
   */
  public static async calculateEmergencyRoutes(
    origin: [number, number],
    destination: [number, number],
    vehicleType: VehicleType,
    hazardZones: HazardAvoidanceZone[] = []
  ): Promise<EmergencyRoute[]> {
    const avoidCoords: [number, number][] = hazardZones.map((h) => {
      if (h.geometry.type === 'Point') return h.geometry.coordinates as [number, number];
      if (h.geometry.type === 'Polygon') return h.geometry.coordinates[0][0] as [number, number];
      return origin;
    });

    // 1. Try real online services (Valhalla & OSRM) first
    const valhallaRes = await ValhallaRoutingEngine.fetchRoute(origin, destination, vehicleType, avoidCoords);
    const osrmRes = await OsrmRoutingEngine.fetchRoute(origin, destination, vehicleType);

    // 2. Compute Google-Maps-Style OSM Route Planner solutions for Fastest, Shortest, and Safest
    const fastestOsm = OsmRoutePlanner.solveRoute(origin, destination, 'fastest', vehicleType, hazardZones, 0);
    const shortestOsm = OsmRoutePlanner.solveRoute(origin, destination, 'shortest', vehicleType, hazardZones, 1);
    const safestOsm = OsmRoutePlanner.solveRoute(origin, destination, 'disaster_aware', vehicleType, hazardZones, 2);

    // 3. Assemble candidate routes
    let primaryGeometry = fastestOsm.geometry;
    let primaryDist = fastestOsm.distanceMeters;
    let primaryDur = fastestOsm.durationSeconds;
    let primarySteps = fastestOsm.steps;

    // Enhance primary route with Valhalla or OSRM if available
    if (valhallaRes && valhallaRes.geometry.length > 5) {
      primaryGeometry = valhallaRes.geometry;
      primaryDist = valhallaRes.distanceMeters;
      primaryDur = valhallaRes.durationSeconds;
      primarySteps = valhallaRes.steps;
    } else if (osrmRes && osrmRes.geometry.length > 5) {
      primaryGeometry = osrmRes.geometry;
      primaryDist = osrmRes.distanceMeters;
      primaryDur = osrmRes.durationSeconds;
      primarySteps = osrmRes.steps;
    }

    const route1 = this.buildRouteObject('route_primary_fastest', 'Alpha Corridor (Fastest Response)', 'fastest', vehicleType, {
      geometry: primaryGeometry,
      distanceMeters: primaryDist,
      durationSeconds: primaryDur,
      trafficDelaySeconds: fastestOsm.trafficDelaySeconds,
      hazardRiskScore: fastestOsm.hazardRiskScore,
      elevationGainMeters: fastestOsm.elevationGainMeters,
      elevationLossMeters: fastestOsm.elevationLossMeters,
      steps: primarySteps,
      hazardCrossings: fastestOsm.hazardCrossings,
    });

    const route2 = this.buildRouteObject('route_secondary_shortest', 'Bravo Route (Shortest Distance)', 'shortest', vehicleType, {
      geometry: shortestOsm.geometry,
      distanceMeters: shortestOsm.distanceMeters,
      durationSeconds: shortestOsm.durationSeconds,
      trafficDelaySeconds: shortestOsm.trafficDelaySeconds,
      hazardRiskScore: shortestOsm.hazardRiskScore,
      elevationGainMeters: shortestOsm.elevationGainMeters,
      elevationLossMeters: shortestOsm.elevationLossMeters,
      steps: shortestOsm.steps,
      hazardCrossings: shortestOsm.hazardCrossings,
    });

    const route3 = this.buildRouteObject('route_tertiary_safest', 'Charlie Bypass (Disaster-Aware Safest)', 'disaster_aware', vehicleType, {
      geometry: safestOsm.geometry,
      distanceMeters: safestOsm.distanceMeters,
      durationSeconds: safestOsm.durationSeconds,
      trafficDelaySeconds: 0,
      hazardRiskScore: 4,
      elevationGainMeters: safestOsm.elevationGainMeters,
      elevationLossMeters: safestOsm.elevationLossMeters,
      steps: safestOsm.steps,
      hazardCrossings: [],
    });

    const routes = [route1, route2, route3];

    // Find highest scoring route and attach AI Recommendation tag
    let bestIndex = 0;
    let maxScore = -1;
    routes.forEach((r, i) => {
      if (r.score.overallScore > maxScore) {
        maxScore = r.score.overallScore;
        bestIndex = i;
      }
    });

    routes[bestIndex].score.isAiRecommended = true;

    return routes;
  }
}
