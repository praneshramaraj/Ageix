export type IncidentPriority = 'P1 Critical' | 'P2 High' | 'P3 Moderate' | 'P4 Low';
export type IncidentStatus = 'New' | 'Dispatched' | 'In Progress' | 'Contained' | 'Resolved' | 'Closed';
export type IncidentType = 'Flood' | 'Wildfire' | 'Earthquake' | 'Hazmat Spill' | 'Structural Collapse' | 'Tsunami' | 'Storm Surge';

export interface Incident {
  id: string;
  code: string;
  type: IncidentType;
  title: string;
  location: string;
  sector: string;
  coordinates: [number, number];
  priority: IncidentPriority;
  status: IncidentStatus;
  affectedPopulation: number;
  reportedAt: string;
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedVehicleId?: string;
  assignedVehicleName?: string;
  description: string;
  history: {
    timestamp: string;
    action: string;
    operator: string;
  }[];
}
