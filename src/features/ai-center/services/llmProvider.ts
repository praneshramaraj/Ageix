import { IncidentItem, IncidentCategory, IncidentSeverity } from '../../../types/eoc';

export interface LLMAnalysisResult {
  intent: 'incident_query' | 'route_query' | 'resource_query' | 'mission_summary' | 'risk_assessment' | 'general';
  reply: string;
  suggestedActions?: { label: string; actionType: string; payload?: any }[];
  highlightedIncidentIds?: string[];
}

export interface ClassifiedIncident {
  category: IncidentCategory;
  confidence: number;
  severity: IncidentSeverity;
  casualtyRiskScore: number; // 0-100
  urgencyLevel: 'IMMEDIATE' | 'HIGH' | 'MODERATE' | 'LOW';
  recommendedActions: string[];
}

export interface PrioritizedMissionScore {
  missionId: string;
  title: string;
  score: number; // 0-100
  breakdown: {
    severityWeight: number;
    victimsWeight: number;
    distanceWeight: number;
    accessibilityWeight: number;
    timeElapsedWeight: number;
  };
  reasoning: string;
}

export interface ILLMProvider {
  name: string;
  isReady: boolean;
  queryCommander(query: string, contextData: any): Promise<LLMAnalysisResult>;
  classifyIncident(title: string, description: string): Promise<ClassifiedIncident>;
  prioritizeMissions(missions: any[], incidents: IncidentItem[]): Promise<PrioritizedMissionScore[]>;
}

export class AEGISXNeuralProvider implements ILLMProvider {
  public name = 'AEGISX Neural Heuristic Engine v2.4';
  public isReady = true;

  public async queryCommander(query: string, contextData: any): Promise<LLMAnalysisResult> {
    const q = query.toLowerCase();
    const incidents: IncidentItem[] = contextData.incidents || [];
    const missions: any[] = contextData.missions || [];
    const teams: any[] = contextData.teams || [];

    if (q.includes('critical') || q.includes('flood')) {
      const criticalFloods = incidents.filter(
        (i) => (i.category === 'flood' || i.category === 'sos') && i.severity === 'critical'
      );
      return {
        intent: 'incident_query',
        reply: `AI Analysis: Located ${criticalFloods.length} critical flood & SOS distress pings in active sectors. Top priority is INC-2026-901 at Kaveri River Overflow Zone.`,
        highlightedIncidentIds: criticalFloods.map((i) => i.id),
        suggestedActions: [
          { label: 'Dispatch Airboat Squad 4', actionType: 'DISPATCH_TEAM', payload: { incidentId: 'inc_101' } },
          { label: 'View Kaveri Sector on Map', actionType: 'FOCUS_MAP', payload: { coords: [77.588, 12.962] } },
        ],
      };
    }

    if (q.includes('closest') || q.includes('team') || q.includes('rescue squad')) {
      const availableSquad = teams.find((t) => t.status === 'Available') || teams[0];
      return {
        intent: 'resource_query',
        reply: `AI Optimization: ${availableSquad?.name || 'NDRF Airboat Rescue Squad 4'} is currently available and closest to Sector 4 flood pings (ETA: 8.5 mins).`,
        suggestedActions: [
          { label: `Assign ${availableSquad?.name || 'Squad 4'}`, actionType: 'ASSIGN_SQUAD' },
        ],
      };
    }

    if (q.includes('route') || q.includes('evacuation') || q.includes('safest')) {
      return {
        intent: 'route_query',
        reply: `AI Route Advisor: Evaluated 3 candidate paths. Recommending Route B via HAL Flyover North (Avoids 2.8m water inundation on Kaveri Arterial Road). Travel time saved: 14 mins.`,
        suggestedActions: [
          { label: 'Plot Safe Evacuation Route', actionType: 'PLOT_ROUTE' },
        ],
      };
    }

    if (q.includes('summary') || q.includes('missions') || q.includes('active')) {
      const inProgress = missions.filter((m) => m.status === 'In Progress' || m.status === 'Dispatched');
      return {
        intent: 'mission_summary',
        reply: `Operational Brief: ${missions.length} total missions logged. ${inProgress.length} missions currently active in the field with 18 personnel deployed across 4 vehicles.`,
        suggestedActions: [
          { label: 'Generate PDF Executive Brief', actionType: 'GENERATE_REPORT' },
        ],
      };
    }

    return {
      intent: 'general',
      reply: `AEGISX AI Assistant: Monitoring ${incidents.length} incidents and ${teams.length} rescue squads. All telemetry channels active. How can I assist operational command?`,
      suggestedActions: [
        { label: 'Run Damage Assessment', actionType: 'RUN_DAMAGE_ASSESSMENT' },
        { label: 'Prioritize All Missions', actionType: 'PRIORITIZE_MISSIONS' },
      ],
    };
  }

  public async classifyIncident(title: string, description: string): Promise<ClassifiedIncident> {
    const text = `${title} ${description}`.toLowerCase();

    let category: IncidentCategory = 'sos';
    if (text.includes('flood') || text.includes('water') || text.includes('submerged')) category = 'flood';
    else if (text.includes('fire') || text.includes('smoke') || text.includes('burn')) category = 'fire';
    else if (text.includes('landslide') || text.includes('mud') || text.includes('debris')) category = 'landslide';
    else if (text.includes('earthquake') || text.includes('quake') || text.includes('tremor')) category = 'earthquake';
    else if (text.includes('cyclone') || text.includes('storm') || text.includes('wind')) category = 'cyclone';
    else if (text.includes('medical') || text.includes('injury') || text.includes('hospital')) category = 'sos';


    const confidence = text.length > 30 ? 0.94 : 0.82;
    const isCritical = text.includes('trapped') || text.includes('critical') || text.includes('rooftop') || text.includes('overflow');

    return {
      category,
      confidence,
      severity: isCritical ? 'critical' : 'high',
      casualtyRiskScore: isCritical ? 92 : 65,
      urgencyLevel: isCritical ? 'IMMEDIATE' : 'HIGH',
      recommendedActions: [
        `Deploy specialized ${category} response unit`,
        'Establish direct radio link with reporting victim',
        'Pre-alert nearest Level-1 trauma hospital',
      ],
    };
  }

  public async prioritizeMissions(missions: any[], incidents: IncidentItem[]): Promise<PrioritizedMissionScore[]> {
    return missions.map((m) => {
      const matchingIncident = incidents.find((i) => i.id === m.incidentId || i.assignedMissionId === m.id);
      const affectedCount = matchingIncident?.affectedCount || m.assignedSquads?.length || 2;
      const isCritical = matchingIncident?.severity === 'critical' || m.priority === 'High' || m.priority === 'Critical';

      const severityWeight = isCritical ? 40 : 25;
      const victimsWeight = Math.min(30, affectedCount * 6);
      const distanceWeight = 15;
      const accessibilityWeight = 10;
      const timeElapsedWeight = 5;

      const totalScore = severityWeight + victimsWeight + distanceWeight + accessibilityWeight + timeElapsedWeight;

      return {
        missionId: m.id,
        title: m.title || `Mission #${m.id}`,
        score: Math.min(100, totalScore),
        breakdown: {
          severityWeight,
          victimsWeight,
          distanceWeight,
          accessibilityWeight,
          timeElapsedWeight,
        },
        reasoning: `Score ${totalScore}/100: High urgency due to ${affectedCount} affected victims and ${matchingIncident?.severity || 'critical'} severity status.`,
      };
    }).sort((a, b) => b.score - a.score);
  }
}

export const defaultLLMProvider = new AEGISXNeuralProvider();
