import axios from 'axios';
import { RouteStep, ManeuverType, LaneGuidance, VehicleType } from '../../types/navigation';

export interface OsrmRouteResponse {
  geometry: [number, number][];
  distanceMeters: number;
  durationSeconds: number;
  steps: RouteStep[];
}

export class OsrmRoutingEngine {
  private static OSRM_URL = 'https://router.project-osrm.org/route/v1';

  private static mapManeuverType(modifier?: string, type?: string): ManeuverType {
    if (type === 'arrive') return 'arrive';
    if (type === 'roundabout' || type === 'rotary') return 'roundabout';
    if (type === 'merge') return 'merge';
    if (type === 'fork' || type === 'on ramp' || type === 'off ramp') return 'fork';

    switch (modifier) {
      case 'sharp right':
        return 'turn-sharp-right';
      case 'right':
        return 'turn-right';
      case 'slight right':
        return 'turn-slight-right';
      case 'sharp left':
        return 'turn-sharp-left';
      case 'left':
        return 'turn-left';
      case 'slight left':
        return 'turn-slight-left';
      case 'uturn':
        return 'u-turn';
      case 'straight':
      default:
        return 'straight';
    }
  }

  public static async fetchRoute(
    origin: [number, number],
    destination: [number, number],
    vehicleType: VehicleType
  ): Promise<OsrmRouteResponse | null> {
    try {
      const mode = vehicleType === 'rescue_boat' ? 'foot' : 'driving';
      const url = `${this.OSRM_URL}/${mode}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson&steps=true&annotations=true`;

      const response = await axios.get(url, { timeout: 5000 });

      if (response.data.code !== 'Ok' || !response.data.routes || response.data.routes.length === 0) {
        return null;
      }

      const route = response.data.routes[0];
      const geometry: [number, number][] = route.geometry.coordinates;
      const leg = route.legs[0];

      const steps: RouteStep[] = leg.steps.map((s: any, idx: number) => {
        const lanes: LaneGuidance[] = [];
        if (s.intersections) {
          for (const intersection of s.intersections) {
            if (intersection.lanes) {
              const indications = intersection.lanes.map((l: any) => l.indications[0] || 'straight');
              const valid = intersection.lanes.some((l: any) => l.valid);
              lanes.push({ indications, valid });
            }
          }
        }

        const maneuverType = this.mapManeuverType(s.maneuver?.modifier, s.maneuver?.type);
        const name = s.name ? s.name : 'Emergency Route Segment';

        return {
          id: `osrm_step_${idx}`,
          maneuver: maneuverType,
          instruction: s.maneuver?.instruction || `${maneuverType.replace('-', ' ')} onto ${name}`,
          streetName: name,
          distanceMeters: Math.round(s.distance),
          durationSeconds: Math.round(s.duration),
          coordinates: s.maneuver?.location || geometry[0],
          bearingBefore: s.maneuver?.bearing_before || 0,
          bearingAfter: s.maneuver?.bearing_after || 0,
          lanes: lanes.length > 0 ? lanes : undefined,
        };
      });

      return {
        geometry,
        distanceMeters: Math.round(route.distance),
        durationSeconds: Math.round(route.duration),
        steps,
      };
    } catch (err) {
      console.warn('[OsrmRoutingEngine] Call failed:', err);
      return null;
    }
  }
}
