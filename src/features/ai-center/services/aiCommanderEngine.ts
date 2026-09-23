import { defaultLLMProvider, ClassifiedIncident, PrioritizedMissionScore, LLMAnalysisResult } from './llmProvider';
import { useIncidentBoardStore } from '../../../stores/IncidentBoardStore';
import { useMissionStore } from '../../../stores/MissionStore';
import { useTeamStore } from '../../../stores/TeamStore';
import { useVehicleStore } from '../../../stores/VehicleStore';
import { MOCK_HOSPITALS, MOCK_SHELTERS } from '../../../services/mockData';

export interface DamageAssessmentData {
  affectedPopulation: number;
  damagedInfrastructureCount: number;
  highRiskZoneCount: number;
  resourceDeficits: { item: string; current: number; required: number; unit: string }[];
  avgResponseTimeMin: number;
}

export interface PredictiveForecastData {
  timeframe: string; // e.g. "Next 24 Hours"
  floodInundationSurgePct: number;
  expectedNewIncidents: number;
  rescueWorkloadHours: number;
  shelterCapacityUsedPct: number;
  predictedRiskZones: string[];
}

export class AiCommanderEngine {
  public static async query(userQuery: string): Promise<LLMAnalysisResult> {
    const contextData = {
      incidents: useIncidentBoardStore.getState().incidents,
      missions: useMissionStore.getState().missions,
      teams: useTeamStore.getState().teams,
      vehicles: useVehicleStore.getState().vehicles,
      hospitals: MOCK_HOSPITALS,
      shelters: MOCK_SHELTERS,
    };

    return await defaultLLMProvider.queryCommander(userQuery, contextData);
  }

  public static async classifyIncident(title: string, description: string): Promise<ClassifiedIncident> {
    return await defaultLLMProvider.classifyIncident(title, description);
  }

  public static async getPrioritizedMissions(): Promise<PrioritizedMissionScore[]> {
    const missions = useMissionStore.getState().missions;
    const incidents = useIncidentBoardStore.getState().incidents;
    return await defaultLLMProvider.prioritizeMissions(missions, incidents);
  }

  public static getResourceRecommendations() {
    const teams = useTeamStore.getState().teams;
    const vehicles = useVehicleStore.getState().vehicles;
    const hospitals = MOCK_HOSPITALS;
    const shelters = MOCK_SHELTERS;
    const incidents = useIncidentBoardStore.getState().incidents;

    const criticalSos = incidents.find((i) => i.severity === 'critical') || incidents[0];
    const bestTeam = teams.find((t) => t.availability === 'Ready') || teams[0];
    const bestVehicle = vehicles.find((v) => v.status === 'Operational') || vehicles[0];
    const bestHospital = hospitals.find((h) => h.status === 'NORMAL' || h.status === 'HIGH OCCUPANCY') || hospitals[0];
    const nearestShelter = shelters.find((s) => s.status === 'OPEN') || shelters[0];

    return {
      targetIncident: criticalSos,
      recommendedTeam: bestTeam,
      recommendedVehicle: bestVehicle,
      recommendedHospital: bestHospital,
      recommendedShelter: nearestShelter,
      equipmentAllocation: [
        { item: 'High-Volume Water Pumps', qty: 4, to: 'Kaveri Flood Sector 4' },
        { item: 'Inflatable Rescue Boats', qty: 2, to: 'Airboat Squad Delta' },
        { item: 'Emergency Medical Oxygen Cylinders', qty: 15, to: 'Victoria Memorial Hospital' },
      ],
      fuelOptimization: 'Route via HAL Flyover saves 4.2L diesel per vehicle dispatch roundtrip.',
    };
  }


  public static getDamageAssessment(): DamageAssessmentData {
    const incidents = useIncidentBoardStore.getState().incidents;
    const totalAffected = incidents.reduce((acc, curr) => acc + (curr.affectedCount || 1), 0);

    return {
      affectedPopulation: totalAffected * 45 + 1280, // estimated multiplier based on sector density
      damagedInfrastructureCount: 14,
      highRiskZoneCount: 6,
      resourceDeficits: [
        { item: 'Inflatable Airboats', current: 3, required: 8, unit: 'boats' },
        { item: 'Emergency Drinking Water', current: 1200, required: 5000, unit: 'liters' },
        { item: 'Portable Generators', current: 8, required: 20, unit: 'units' },
        { item: 'ICU Ventilators', current: 12, required: 25, unit: 'beds' },
      ],
      avgResponseTimeMin: 11.4,
    };
  }

  public static getPredictiveForecast(): PredictiveForecastData {
    return {
      timeframe: 'Next 24 to 48 Hours',
      floodInundationSurgePct: 88.5,
      expectedNewIncidents: 24,
      rescueWorkloadHours: 142.0,
      shelterCapacityUsedPct: 78.4,
      predictedRiskZones: [
        'Kaveri River South Basin (Sector 4 & 5)',
        'West Ridge Low-Lying Embankment',
        'Old Airport Road Subway Underpass',
      ],
    };
  }
}
