import { create } from 'zustand';
import { MissionItem, MissionPriority, MissionStatus, MissionTimelineEvent, MissionAttachment } from '../types/eoc';

export interface MissionStoreState {
  missions: MissionItem[];

  createMission: (mission: Omit<MissionItem, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'timeline'>) => MissionItem;
  updateMission: (id: string, updates: Partial<MissionItem>) => void;
  cancelMission: (id: string, reason?: string) => void;
  updateMissionStatus: (id: string, status: MissionStatus) => void;
  assignTeamsAndVehicles: (id: string, teamIds: string[], vehicleIds: string[]) => void;
  addMissionNote: (id: string, author: string, note: string) => void;
  addMissionAttachment: (id: string, attachment: Omit<MissionAttachment, 'id' | 'timestamp'>) => void;
  deleteMission: (id: string) => void;
}

const INITIAL_MISSIONS: MissionItem[] = [
  {
    id: 'msn_101',
    code: 'MSN-2026-0401',
    title: 'Operation Blue Shield: River Rescue Triage',
    description: 'Evacuation of 6 civilians trapped near Kaveri River overflow boundary using heavy rescue boat.',
    priority: 'CRITICAL',
    status: 'In Progress',
    targetLocation: [77.588, 12.962],
    locationName: 'Sector 4 Kaveri Embankment',
    assignedTeamIds: ['team_01', 'team_03'],
    assignedVehicleIds: ['veh_boat_01', 'veh_amb_02'],
    progressPercent: 65,
    createdAt: '2026-09-15 08:30',
    updatedAt: '2026-09-15 10:15',
    timeline: [
      { id: 'tl_1', timestamp: '08:30', author: 'Commander Vance', action: 'Mission Created', details: 'Triggered by SOS #4012' },
      { id: 'tl_2', timestamp: '08:45', author: 'Dispatcher Lee', action: 'Teams Assigned', details: 'Alpha Water Rescue Unit dispatched' },
      { id: 'tl_3', timestamp: '09:20', author: 'Capt. Miller', action: 'On Scene', details: 'Rescue boat deployed into flooded zone' },
    ],
    notes: [
      'Water current velocity estimated at 4.2 knots. High caution advised.',
      'Victims located on rooftop of 2-story building.',
    ],
    attachments: [
      { id: 'att_1', name: 'drone_recon_thermal.jpg', type: 'image/jpeg', size: '2.4 MB', timestamp: '08:40' },
    ],
  },
  {
    id: 'msn_102',
    code: 'MSN-2026-0402',
    title: 'HAL Airport Road Debris & Tree Clearing',
    description: 'Clearing fallen high-voltage power cables and uprooted trees blocking emergency hospital corridor.',
    priority: 'HIGH',
    status: 'Assigned',
    targetLocation: [77.610, 12.975],
    locationName: 'HAL Main Junction',
    assignedTeamIds: ['team_02'],
    assignedVehicleIds: ['veh_truck_01'],
    progressPercent: 20,
    createdAt: '2026-09-15 09:10',
    updatedAt: '2026-09-15 09:45',
    timeline: [
      { id: 'tl_4', timestamp: '09:10', author: 'Dispatcher Lee', action: 'Mission Created', details: 'Traffic impediment reported' },
    ],
    notes: ['Power grid company notified to kill live wire voltage.'],
    attachments: [],
  },
  {
    id: 'msn_103',
    code: 'MSN-2026-0403',
    title: 'Sector 2 High School Shelter Medical Triage',
    description: 'Deploying trauma nurses and 500 thermal blankets to overcrowded evacuation shelter.',
    priority: 'MEDIUM',
    status: 'Pending',
    targetLocation: [77.595, 12.969],
    locationName: 'Sector 2 Evacuation Center',
    assignedTeamIds: [],
    assignedVehicleIds: [],
    progressPercent: 0,
    createdAt: '2026-09-15 09:50',
    updatedAt: '2026-09-15 09:50',
    timeline: [
      { id: 'tl_5', timestamp: '09:50', author: 'Medical Director Dr. Roy', action: 'Request Logged' },
    ],
    notes: ['Pending volunteer crew assignment.'],
    attachments: [],
  },
];

export const useMissionStore = create<MissionStoreState>((set) => ({
  missions: INITIAL_MISSIONS,

  createMission: (data) => {
    const id = `msn_${Date.now()}`;
    const code = `MSN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMission: MissionItem = {
      ...data,
      id,
      code,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `tl_${Date.now()}`,
          timestamp: now,
          author: 'EOC Dispatcher',
          action: 'Mission Created',
          details: data.description,
        },
      ],
      notes: data.notes || [],
      attachments: data.attachments || [],
    };

    set((state) => ({ missions: [newMission, ...state.missions] }));
    return newMission;
  },

  updateMission: (id, updates) =>
    set((state) => ({
      missions: state.missions.map((m) => {
        if (m.id !== id) return m;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          ...m,
          ...updates,
          updatedAt: now,
          timeline: [
            ...m.timeline,
            {
              id: `tl_${Date.now()}`,
              timestamp: now,
              author: 'EOC Commander',
              action: 'Mission Updated',
              details: `Updated parameters for ${m.code}`,
            },
          ],
        };
      }),
    })),

  cancelMission: (id, reason = 'Cancelled by EOC Command') =>
    set((state) => ({
      missions: state.missions.map((m) => {
        if (m.id !== id) return m;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          ...m,
          status: 'Cancelled',
          updatedAt: now,
          timeline: [
            ...m.timeline,
            {
              id: `tl_${Date.now()}`,
              timestamp: now,
              author: 'EOC Commander',
              action: 'Mission Cancelled',
              details: reason,
            },
          ],
        };
      }),
    })),

  updateMissionStatus: (id, status) =>
    set((state) => ({
      missions: state.missions.map((m) => {
        if (m.id !== id) return m;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          ...m,
          status,
          updatedAt: now,
          progressPercent: status === 'Completed' ? 100 : m.progressPercent,
          timeline: [
            ...m.timeline,
            {
              id: `tl_${Date.now()}`,
              timestamp: now,
              author: 'EOC Dispatcher',
              action: `Status set to ${status}`,
            },
          ],
        };
      }),
    })),

  assignTeamsAndVehicles: (id, teamIds, vehicleIds) =>
    set((state) => ({
      missions: state.missions.map((m) => {
        if (m.id !== id) return m;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          ...m,
          assignedTeamIds: teamIds,
          assignedVehicleIds: vehicleIds,
          status: m.status === 'Pending' ? 'Assigned' : m.status,
          updatedAt: now,
          timeline: [
            ...m.timeline,
            {
              id: `tl_${Date.now()}`,
              timestamp: now,
              author: 'EOC Dispatcher',
              action: 'Units Dispatched',
              details: `Assigned ${teamIds.length} Teams and ${vehicleIds.length} Vehicles`,
            },
          ],
        };
      }),
    })),

  addMissionNote: (id, author, note) =>
    set((state) => ({
      missions: state.missions.map((m) => {
        if (m.id !== id) return m;
        return {
          ...m,
          notes: [...(m.notes || []), `${author}: ${note}`],
        };
      }),
    })),

  addMissionAttachment: (id, attachment) =>
    set((state) => ({
      missions: state.missions.map((m) => {
        if (m.id !== id) return m;
        const newAtt: MissionAttachment = {
          ...attachment,
          id: `att_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        return {
          ...m,
          attachments: [...(m.attachments || []), newAtt],
        };
      }),
    })),

  deleteMission: (id) =>
    set((state) => ({
      missions: state.missions.filter((m) => m.id !== id),
    })),
}));
