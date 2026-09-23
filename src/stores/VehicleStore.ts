import { create } from 'zustand';
import { VehicleItem, VehicleStatus } from '../types/eoc';

export interface VehicleStoreState {
  vehicles: VehicleItem[];

  updateVehicleStatus: (id: string, status: VehicleStatus) => void;
  updateVehicleFuel: (id: string, fuelPercent: number) => void;
  assignVehicleToMission: (vehicleId: string, missionId?: string) => void;
  createVehicle: (vehicle: Omit<VehicleItem, 'id' | 'lastPingTime'>) => void;
}

const INITIAL_VEHICLES: VehicleItem[] = [
  {
    id: 'veh_amb_01',
    callsign: 'AMB-ALPHA-01',
    category: 'ambulance',
    model: 'Mercedes-Benz Sprinter Trauma ICU',
    licensePlate: 'KA-01-EQ-4011',
    fuelPercent: 88,
    capacity: 4,
    driverName: 'Officer Daniel Ross',
    driverPhone: '+91 99887 11001',
    status: 'Operational',
    coordinates: [77.574, 12.963],
    lastPingTime: 'Live (10s ago)',
  },
  {
    id: 'veh_amb_02',
    callsign: 'AMB-ALPHA-02',
    category: 'ambulance',
    model: 'Force Traveler Advanced Life Support',
    licensePlate: 'KA-01-EQ-4012',
    fuelPercent: 95,
    capacity: 4,
    driverName: 'Officer Samuel Wright',
    driverPhone: '+91 99887 11002',
    assignedMissionId: 'msn_101',
    status: 'Dispatched',
    coordinates: [77.588, 12.962],
    lastPingTime: 'Live (5s ago)',
  },
  {
    id: 'veh_boat_01',
    callsign: 'BOAT-ZODIAC-01',
    category: 'rescue_boat',
    model: 'Zodiac Milpro Heavy Inflatable 4.7m',
    licensePlate: 'WATER-RES-01',
    fuelPercent: 74,
    capacity: 8,
    driverName: 'Coxswain Timothy Bell',
    driverPhone: '+91 99887 22001',
    assignedMissionId: 'msn_101',
    status: 'Dispatched',
    coordinates: [77.586, 12.964],
    lastPingTime: 'Live (2s ago)',
  },
  {
    id: 'veh_truck_01',
    callsign: 'FIRE-TENDER-04',
    category: 'fire_truck',
    model: 'MAN Heavy Rescue Ladder Truck',
    licensePlate: 'KA-01-F-9022',
    fuelPercent: 62,
    capacity: 6,
    driverName: 'Driver Chief Suresh Kumar',
    driverPhone: '+91 99887 33001',
    assignedMissionId: 'msn_102',
    status: 'Dispatched',
    coordinates: [77.610, 12.975],
    lastPingTime: 'Live (15s ago)',
  },
  {
    id: 'veh_uav_01',
    callsign: 'DRONE-RECON-01',
    category: 'uav_drone',
    model: 'DJI Matrice 300 RTK Thermal System',
    licensePlate: 'UAV-FAA-9011',
    fuelPercent: 92, // Battery %
    capacity: 0,
    driverName: 'Pilot Alex Mercer',
    driverPhone: '+91 98765 42341',
    status: 'Operational',
    coordinates: [77.602, 12.976],
    lastPingTime: 'Live Telemetry',
  },
  {
    id: 'veh_heli_01',
    callsign: 'HELI-AIR-MED-01',
    category: 'helicopter',
    model: 'Eurocopter EC135 Medevac',
    licensePlate: 'VT-RES-01',
    fuelPercent: 81,
    capacity: 2,
    driverName: 'Capt. Jonathan Vance',
    driverPhone: '+91 99887 55001',
    status: 'Operational',
    coordinates: [77.605, 12.982],
    lastPingTime: 'Standby at Helipad',
  },
];

export const useVehicleStore = create<VehicleStoreState>((set) => ({
  vehicles: INITIAL_VEHICLES,

  updateVehicleStatus: (id, status) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, status } : v)),
    })),

  updateVehicleFuel: (id, fuelPercent) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, fuelPercent } : v)),
    })),

  assignVehicleToMission: (vehicleId, missionId) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              assignedMissionId: missionId,
              status: missionId ? 'Dispatched' : 'Operational',
            }
          : v
      ),
    })),

  createVehicle: (vehicleData) =>
    set((state) => ({
      vehicles: [
        ...state.vehicles,
        {
          ...vehicleData,
          id: `veh_${Date.now()}`,
          lastPingTime: 'Just Now',
        },
      ],
    })),
}));
