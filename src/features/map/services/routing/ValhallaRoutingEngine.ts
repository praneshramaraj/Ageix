import axios from 'axios';
import { RouteStep, ManeuverType, VehicleType } from '../../types/navigation';

export interface ValhallaRouteResponse {
  geometry: [number, number][]; // [lng, lat][]
  distanceMeters: number;
  durationSeconds: number;
  steps: RouteStep[];
}

export class ValhallaRoutingEngine {
  private static VALHALLA_URL = 'https://valhalla1.openstreetmap.de/route';

  /**
   * Map AEGISX vehicle type to Valhalla costing profile
   */
  private static mapVehicleToValhallaCosting(vehicleType: VehicleType): string {
    switch (vehicleType) {
      case 'heavy_rescue':
      case 'convoy':
      case 'fire_truck':
        return 'truck';
      case 'rescue_boat':
        return 'pedestrian'; // Fallback for amphibious/waterfront paths
      case 'ambulance':
      case 'police_car':
      default:
        return 'auto';
    }
  }

  /**
   * Polyline 6 decoder for Valhalla route shapes
   */
  private static decodePolyline6(encoded: string): [number, number][] {
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;
    const coordinates: [number, number][] = [];

    while (index < len) {
      let b: number;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      // Valhalla uses precision 1e-6 by default for polyline6
      coordinates.push([lng / 1e6, lat / 1e6]);
    }

    return coordinates;
  }

  /**
   * Map Valhalla maneuver code to AEGISX ManeuverType
   */
  private static mapManeuverType(type: number): ManeuverType {
    switch (type) {
      case 1:
      case 2:
      case 3:
        return 'straight';
      case 8:
      case 9:
        return 'turn-slight-right';
      case 10:
        return 'turn-right';
      case 11:
        return 'turn-sharp-right';
      case 12:
      case 13:
        return 'u-turn';
      case 14:
        return 'turn-sharp-left';
      case 15:
        return 'turn-left';
      case 16:
      case 17:
        return 'turn-slight-left';
      case 18:
      case 19:
      case 26:
        return 'roundabout';
      case 20:
      case 21:
        return 'merge';
      case 4:
      case 5:
      case 6:
        return 'arrive';
      default:
        return 'straight';
    }
  }

  /**
   * Query Valhalla API for real OpenStreetMap route calculation
   */
  public static async fetchRoute(
    origin: [number, number],
    destination: [number, number],
    vehicleType: VehicleType,
    avoidLocations: [number, number][] = []
  ): Promise<ValhallaRouteResponse | null> {
    try {
      const costing = this.mapVehicleToValhallaCosting(vehicleType);

      const locations = [
        { lat: origin[1], lon: origin[0] },
        { lat: destination[1], lon: destination[0] },
      ];

      const avoid_locations = avoidLocations.map((loc) => ({
        lat: loc[1],
        lon: loc[0],
      }));

      const payload: any = {
        locations,
        costing,
        directions_options: {
          units: 'kilometers',
          language: 'en-US',
        },
      };

      if (avoid_locations.length > 0) {
        payload.avoid_locations = avoid_locations;
      }

      const response = await axios.post(this.VALHALLA_URL, payload, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.data || !response.data.trip) {
        return null;
      }

      const trip = response.data.trip;
      const leg = trip.legs[0];
      if (!leg) return null;

      const geometry = this.decodePolyline6(leg.shape);

      const steps: RouteStep[] = leg.maneuvers.map((m: any, idx: number) => {
        const shapeIndex = m.begin_shape_index || 0;
        const stepCoord = geometry[shapeIndex] || [origin[0], origin[1]];

        return {
          id: `valhalla_step_${idx}`,
          maneuver: this.mapManeuverType(m.type),
          instruction: m.instruction || 'Continue on road',
          streetName: m.street_names ? m.street_names[0] : 'Emergency Corridor',
          distanceMeters: Math.round((m.length || 0) * 1000),
          durationSeconds: Math.round(m.time || 0),
          coordinates: stepCoord,
          bearingBefore: m.begin_bearing || 0,
          bearingAfter: m.end_bearing || 0,
        };
      });

      return {
        geometry,
        distanceMeters: Math.round(trip.summary.length * 1000),
        durationSeconds: Math.round(trip.summary.time),
        steps,
      };
    } catch (err) {
      console.warn('[ValhallaRoutingEngine] API call failed or timed out:', err);
      return null;
    }
  }
}
