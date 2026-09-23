export type MissionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type MissionStatus = 'STAGING' | 'DEPLOYED' | 'ENGAGED' | 'EXTRACTING' | 'COMPLETED' | 'ABORTED';

export interface Mission {
  id: string;
  code: string;
  title: string;
  incidentCode: string;
  priority: MissionPriority;
  status: MissionStatus;
  commanderName: string;
  commanderRole: string;
  membersCount: number;
  members: string[];
  progressPercent: number;
  sector: string;
  startedAt: string;
  estimatedCompletion: string;
  notes: string;
  reportsCount: number;
}
