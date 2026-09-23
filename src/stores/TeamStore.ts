import { create } from 'zustand';
import { TeamItem, TeamAvailability, TeamType } from '../types/eoc';

export interface TeamStoreState {
  teams: TeamItem[];

  setTeamAvailability: (id: string, availability: TeamAvailability) => void;
  assignTeamToMission: (teamId: string, missionId?: string) => void;
  createTeam: (team: Omit<TeamItem, 'id'>) => void;
  updateTeam: (id: string, updates: Partial<TeamItem>) => void;
}

const INITIAL_TEAMS: TeamItem[] = [
  {
    id: 'team_01',
    name: 'Alpha Water Rescue Squad',
    type: 'rescue',
    leaderName: 'Capt. Marcus Vance',
    contactNumber: '+91 98765 12341',
    availability: 'Deployed',
    currentMissionId: 'msn_101',
    locationName: 'Kaveri River Sector 4',
    coordinates: [77.588, 12.962],
    avgResponseTimeMin: 8,
    skillSet: ['Swiftwater Rescue', 'Scuba Diving', 'Flood Navigation', 'Trauma Triage'],
    equipment: ['Amphibious Zodiac Boat', 'High-Output Submersible Pumps', 'Life Vests', 'Thermal Scanners'],
    members: [
      { id: 'm1', name: 'Marcus Vance', role: 'Team Commander', phone: '+91 98765 12341', callsign: 'Alpha-1' },
      { id: 'm2', name: 'Sarah Jenkins', role: 'Water Rescue Specialist', phone: '+91 98765 12342', callsign: 'Alpha-2' },
      { id: 'm3', name: 'David Chen', role: 'Emergency Paramedic', phone: '+91 98765 12343', callsign: 'Alpha-3' },
    ],
  },
  {
    id: 'team_02',
    name: 'Bravo Heavy Debris Unit',
    type: 'fire',
    leaderName: 'Lt. Rahul Sharma',
    contactNumber: '+91 98765 22341',
    availability: 'Deployed',
    currentMissionId: 'msn_102',
    locationName: 'HAL Main Junction Corridor',
    coordinates: [77.610, 12.975],
    avgResponseTimeMin: 12,
    skillSet: ['Structural Collapse', 'HAZMAT Containment', 'Heavy Rigging', 'Power Saw Operation'],
    equipment: ['Hydraulic Cutters', 'Heavy Excavator Rig', 'Chainsaws', 'Gas Leak Detectors'],
    members: [
      { id: 'm4', name: 'Rahul Sharma', role: 'Fire Captain', phone: '+91 98765 22341', callsign: 'Bravo-1' },
      { id: 'm5', name: 'Vikram Singh', role: 'HAZMAT Tech', phone: '+91 98765 22342', callsign: 'Bravo-2' },
    ],
  },
  {
    id: 'team_03',
    name: 'Charlie Medical Evac Unit',
    type: 'medical',
    leaderName: 'Dr. Anita Roy',
    contactNumber: '+91 98765 32341',
    availability: 'Ready',
    locationName: 'Victoria Hospital Base Camp',
    coordinates: [77.574, 12.963],
    avgResponseTimeMin: 6,
    skillSet: ['Advanced Cardiac Life Support', 'Field Surgery', 'Trauma Stabilization', 'Epidemic Prevention'],
    equipment: ['Portable Defibrillators', 'Blood Plasma Storage', 'Mobile Field Ventilators', 'Bandage Packs'],
    members: [
      { id: 'm6', name: 'Dr. Anita Roy', role: 'Trauma Lead', phone: '+91 98765 32341', callsign: 'Charlie-1' },
      { id: 'm7', name: 'Nikhil Kumar', role: 'ER Nurse', phone: '+91 98765 32342', callsign: 'Charlie-2' },
    ],
  },
  {
    id: 'team_04',
    name: 'Delta Tactical UAV Recon Unit',
    type: 'drone_operators',
    leaderName: 'Eng. Alex Mercer',
    contactNumber: '+91 98765 42341',
    availability: 'Ready',
    locationName: 'EOC Headquarters Roof Helipad',
    coordinates: [77.594, 12.971],
    avgResponseTimeMin: 4,
    skillSet: ['Thermal Aerial Mapping', 'LIDAR Scanning', 'Payload Drop', 'Night Vision Flight'],
    equipment: ['Matrice 300 RTK Drones', 'FLIR Thermal Cameras', 'Satellite Mesh Relays', 'Spare Batteries'],
    members: [
      { id: 'm8', name: 'Alex Mercer', role: 'Lead Drone Pilot', phone: '+91 98765 42341', callsign: 'Delta-1' },
      { id: 'm9', name: 'Priya Nair', role: 'GIS Analyst', phone: '+91 98765 42342', callsign: 'Delta-2' },
    ],
  },
  {
    id: 'team_05',
    name: 'Echo Police Security Contingent',
    type: 'police',
    leaderName: 'Insp. R. K. Verma',
    contactNumber: '+91 98765 52341',
    availability: 'Ready',
    locationName: 'Central Police Command Station',
    coordinates: [77.585, 12.978],
    avgResponseTimeMin: 7,
    skillSet: ['Perimeter Security', 'Traffic Diversion', 'Evacuation Enforcement', 'Crowd Management'],
    equipment: ['Riot Shields', 'Traffic Barricades', 'Megaphones', 'Tactical Radios'],
    members: [
      { id: 'm10', name: 'R. K. Verma', role: 'Inspector', phone: '+91 98765 52341', callsign: 'Echo-1' },
    ],
  },
];

export const useTeamStore = create<TeamStoreState>((set) => ({
  teams: INITIAL_TEAMS,

  setTeamAvailability: (id, availability) =>
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? { ...t, availability } : t)),
    })),

  assignTeamToMission: (teamId, missionId) =>
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              currentMissionId: missionId,
              availability: missionId ? 'Deployed' : 'Ready',
            }
          : t
      ),
    })),

  createTeam: (teamData) =>
    set((state) => ({
      teams: [...state.teams, { ...teamData, id: `team_${Date.now()}` }],
    })),

  updateTeam: (id, updates) =>
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
}));
