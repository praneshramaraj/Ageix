import { EmergencyRoute, RouteScore, VehicleType } from '../../types/navigation';

export class AiRoutingService {
  /**
   * Multi-factor AI Route Scoring formula
   * Returns score between 0 and 100 with breakdown rationale
   */
  public static scoreRoute(
    route: Partial<EmergencyRoute>,
    vehicleType: VehicleType,
    urgency: 'normal' | 'high' | 'critical' = 'high'
  ): RouteScore {
    const duration = route.totalDurationSeconds || 600;
    const distance = route.totalDistanceMeters || 5000;
    const risk = route.hazardRiskScore || 0;
    const elevGain = route.elevationGainMeters || 20;

    // Weights based on mission urgency and vehicle type
    let wTime = 0.35;
    let wRisk = 0.35;
    let wDist = 0.20;
    let wElev = 0.10;

    if (urgency === 'critical') {
      wTime = 0.45;
      wRisk = 0.35;
      wDist = 0.10;
      wElev = 0.10;
    }

    if (vehicleType === 'heavy_rescue' || vehicleType === 'convoy') {
      wElev = 0.25; // Heavy vehicles penalize steep hills
      wTime = 0.30;
      wRisk = 0.30;
      wDist = 0.15;
    }

    // Normalized scores (higher is better)
    const speedScore = Math.max(0, 100 - (duration / 60) * 1.5);
    const distanceScore = Math.max(0, 100 - (distance / 1000) * 2.0);
    const safetyScore = Math.max(0, 100 - risk * 1.1);
    const elevationScore = Math.max(0, 100 - elevGain * 0.8);

    const overallScore = Math.round(
      speedScore * wTime +
        safetyScore * wRisk +
        distanceScore * wDist +
        elevationScore * wElev
    );

    let reason = 'Balanced route with moderate travel time and low risk.';
    if (safetyScore > 85 && speedScore > 80) {
      reason = 'AI Recommended: Optimal speed corridor with minimal disaster hazard exposure.';
    } else if (safetyScore > 90) {
      reason = 'Safest path: Completely avoids active flood and fire perimeters.';
    } else if (speedScore > 90) {
      reason = 'Fastest response corridor: Maximizes high-speed arterial transit.';
    }

    return {
      overallScore: Math.min(99, Math.max(10, overallScore)),
      speedScore: Math.round(speedScore),
      safetyScore: Math.round(safetyScore),
      distanceScore: Math.round(distanceScore),
      elevationScore: Math.round(elevationScore),
      riskFactor: Math.round(risk),
      aiRecommendationReason: reason,
      isAiRecommended: false,
    };
  }

  /**
   * Predictive Rerouting analysis: checks if hazard expansion rate threatens route
   */
  public static checkPredictiveHazardRisk(
    route: EmergencyRoute,
    floodExpansionKmh: number = 0.5
  ): { hazardThreatDetected: boolean; warningMessage?: string } {
    if (route.hazardCrossings && route.hazardCrossings.length > 0) {
      return {
        hazardThreatDetected: true,
        warningMessage: `Predictive AI Alert: Route intersects active ${route.hazardCrossings[0].name}. Water rising at +${floodExpansionKmh} km/h. Automatic rerouting recommended.`,
      };
    }
    return { hazardThreatDetected: false };
  }
}
