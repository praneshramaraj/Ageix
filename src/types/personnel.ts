export type TeamCategory = 'Tactical Rescue' | 'Fire Combat' | 'Medical Trauma' | 'Police & Security' | 'NGO Corps' | 'Volunteer Unit';
export type PersonnelStatus = 'ON DUTY - STAGING' | 'ON MISSION' | 'OFF DUTY' | 'REST PROTOCOL';

export interface PersonnelTeam {
  id: string;
  code: string;
  name: string;
  category: TeamCategory;
  leaderName: string;
  memberCount: number;
  specialization: string;
  currentMission?: string;
  status: PersonnelStatus;
  baseStation: string;
}
