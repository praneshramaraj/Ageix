import { create } from 'zustand';
import { IncidentItem, IncidentCategory, IncidentSeverity, IncidentStatus } from '../types/eoc';

export interface IncidentBoardStoreState {
  incidents: IncidentItem[];
  searchQuery: string;
  selectedCategory: IncidentCategory | 'all';
  selectedSeverity: IncidentSeverity | 'all';
  selectedStatus: IncidentStatus | 'all';

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: IncidentCategory | 'all') => void;
  setSelectedSeverity: (sev: IncidentSeverity | 'all') => void;
  setSelectedStatus: (status: IncidentStatus | 'all') => void;

  assignIncidentToMission: (incidentId: string, missionId: string) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  createIncident: (incident: Omit<IncidentItem, 'id' | 'code' | 'timestamp'>) => void;
}

const INITIAL_INCIDENTS: IncidentItem[] = [
  {
    id: 'inc_101',
    code: 'INC-2026-901',
    title: 'SOS Alert #4012 - Trapped Civilians in Submerged Home',
    category: 'sos',
    severity: 'critical',
    status: 'In Progress',
    coordinates: [77.588, 12.962],
    locationName: 'Kaveri River Overflow Zone (Sector 4)',
    reportedBy: 'Civilian Emergency Ping',
    contactNumber: '+91 98112 33441',
    affectedCount: 6,
    assignedMissionId: 'msn_101',
    timestamp: '10 mins ago',
    description: 'Rooftop evacuation required due to rapid flood water rise (+2.8m depth).',
  },
  {
    id: 'inc_102',
    code: 'INC-2026-902',
    title: 'HAL Airport Road Tree & Powerline Blockade',
    category: 'road_closure',
    severity: 'high',
    status: 'Triaged',
    coordinates: [77.610, 12.975],
    locationName: 'HAL Main Junction',
    reportedBy: 'Police Patrol Unit Echo-1',
    contactNumber: '+91 98765 52341',
    affectedCount: 0,
    assignedMissionId: 'msn_102',
    timestamp: '25 mins ago',
    description: 'High voltage line down on major hospital arterial route.',
  },
  {
    id: 'inc_103',
    code: 'INC-2026-903',
    title: 'Forest Reserve Wildfire Wildzone Perimeter Expansion',
    category: 'fire',
    severity: 'critical',
    status: 'Open',
    coordinates: [77.605, 12.988],
    locationName: 'East Ridge Forest Reserve',
    reportedBy: 'UAV Aerial Recon Team Delta',
    contactNumber: '+91 98765 42341',
    affectedCount: 0,
    timestamp: '35 mins ago',
    description: 'Wildfire spreading south toward residential perimeter with 45 mph wind gusts.',
  },
  {
    id: 'inc_104',
    code: 'INC-2026-904',
    title: 'Missing Elderly Resident Triage Alert',
    category: 'missing_person',
    severity: 'medium',
    status: 'Open',
    coordinates: [77.570, 12.955],
    locationName: 'West Lake Evacuation Zone',
    reportedBy: 'Family Member Report',
    contactNumber: '+91 98223 44551',
    affectedCount: 1,
    timestamp: '50 mins ago',
    description: '82-year-old male last seen near flood embankment shelter entrance.',
  },
  {
    id: 'inc_105',
    code: 'INC-2026-905',
    title: 'Seismic Isoseismal Ring Wall Damage',
    category: 'earthquake',
    severity: 'high',
    status: 'Open',
    coordinates: [77.550, 12.930],
    locationName: 'Fault Line Zone 1 Bridge',
    reportedBy: 'Structural Safety Engineer',
    contactNumber: '+91 98334 55661',
    affectedCount: 0,
    timestamp: '1 hour ago',
    description: 'M6.4 earthquake tremor produced hairline cracks on highway flyover support pillar.',
  },
];

export const useIncidentBoardStore = create<IncidentBoardStoreState>((set) => ({
  incidents: INITIAL_INCIDENTS,
  searchQuery: '',
  selectedCategory: 'all',
  selectedSeverity: 'all',
  selectedStatus: 'all',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedSeverity: (selectedSeverity) => set({ selectedSeverity }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),

  assignIncidentToMission: (incidentId, missionId) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === incidentId
          ? { ...inc, assignedMissionId: missionId, status: 'In Progress' }
          : inc
      ),
    })),

  updateIncidentStatus: (incidentId, status) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === incidentId ? { ...inc, status } : inc
      ),
    })),

  createIncident: (incidentData) =>
    set((state) => ({
      incidents: [
        {
          ...incidentData,
          id: `inc_${Date.now()}`,
          code: `INC-2026-${Math.floor(900 + Math.random() * 90)}`,
          timestamp: 'Just now',
        },
        ...state.incidents,
      ],
    })),
}));
