import { create } from 'zustand';
import { ResourceItem, ResourceDistributionLog } from '../types/eoc';

export interface ResourceStoreState {
  resources: ResourceItem[];
  distributionLogs: ResourceDistributionLog[];

  updateStockLevel: (id: string, newStock: number) => void;
  dispatchSupply: (resourceId: string, quantity: number, destination: string, dispatchedBy: string, missionId?: string) => boolean;
  createResource: (res: Omit<ResourceItem, 'id' | 'status' | 'lastRestocked'>) => void;
}

const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res_med_01',
    name: 'Trauma & Burn Medical Kits (Level 3)',
    category: 'medical',
    currentStock: 120,
    minThreshold: 300,
    maxCapacity: 1500,
    unit: 'Kits',
    storageHub: 'Central EOC Logistics Hub Depot 1',
    status: 'LOW STOCK',
    lastRestocked: '2026-09-14 18:00',
  },
  {
    id: 'res_food_01',
    name: 'MRE High-Calorie Emergency Meal Packs',
    category: 'food',
    currentStock: 8500,
    minThreshold: 2000,
    maxCapacity: 20000,
    unit: 'Rations',
    storageHub: 'North Sector Warehouse B',
    status: 'OPTIMAL',
    lastRestocked: '2026-09-15 06:00',
  },
  {
    id: 'res_water_01',
    name: 'Purified Drinking Water Canisters (20L)',
    category: 'water',
    currentStock: 4200,
    minThreshold: 1000,
    maxCapacity: 10000,
    unit: 'Canisters',
    storageHub: 'South Relief Depot 3',
    status: 'OPTIMAL',
    lastRestocked: '2026-09-15 07:30',
  },
  {
    id: 'res_blanket_01',
    name: 'Fleece Thermal Evacuation Blankets',
    category: 'blankets',
    currentStock: 1800,
    minThreshold: 500,
    maxCapacity: 5000,
    unit: 'Units',
    storageHub: 'North Sector Warehouse B',
    status: 'OPTIMAL',
    lastRestocked: '2026-09-14 12:00',
  },
  {
    id: 'res_fuel_01',
    name: 'High-Octane Rescue Diesel Fuel',
    category: 'fuel',
    currentStock: 12500,
    minThreshold: 3000,
    maxCapacity: 30000,
    unit: 'Liters',
    storageHub: 'EOC Fuel Station Depot',
    status: 'OPTIMAL',
    lastRestocked: '2026-09-15 04:00',
  },
  {
    id: 'res_gen_01',
    name: 'Heavy-Duty 15kW Silent Diesel Generators',
    category: 'generators',
    currentStock: 14,
    minThreshold: 5,
    maxCapacity: 30,
    unit: 'Generators',
    storageHub: 'Central EOC Logistics Hub Depot 1',
    status: 'OPTIMAL',
    lastRestocked: '2026-09-13 14:00',
  },
  {
    id: 'res_shelter_01',
    name: 'Inflatable Weatherproof Relief Tents (10-Person)',
    category: 'shelters',
    currentStock: 85,
    minThreshold: 20,
    maxCapacity: 200,
    unit: 'Tents',
    storageHub: 'South Relief Depot 3',
    status: 'OPTIMAL',
    lastRestocked: '2026-09-14 09:00',
  },
];

const INITIAL_LOGS: ResourceDistributionLog[] = [
  {
    id: 'log_1',
    resourceId: 'res_blanket_01',
    resourceName: 'Fleece Thermal Evacuation Blankets',
    quantity: 500,
    unit: 'Units',
    destination: 'Sector 2 High School Evacuation Shelter',
    dispatchedBy: 'Logistics Officer Davis',
    timestamp: '09:30',
  },
  {
    id: 'log_2',
    resourceId: 'res_water_01',
    resourceName: 'Purified Drinking Water Canisters (20L)',
    quantity: 200,
    unit: 'Canisters',
    destination: 'Kaveri River Rescue Command Post',
    dispatchedBy: 'Logistics Officer Davis',
    timestamp: '08:45',
  },
];

export const useResourceStore = create<ResourceStoreState>((set, get) => ({
  resources: INITIAL_RESOURCES,
  distributionLogs: INITIAL_LOGS,

  updateStockLevel: (id, newStock) =>
    set((state) => ({
      resources: state.resources.map((r) => {
        if (r.id !== id) return r;
        const status =
          newStock <= 0
            ? 'CRITICAL EMPTY'
            : newStock <= r.minThreshold
            ? 'LOW STOCK'
            : 'OPTIMAL';
        return {
          ...r,
          currentStock: newStock,
          status,
          lastRestocked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }),
    })),

  dispatchSupply: (resourceId, quantity, destination, dispatchedBy, missionId) => {
    const { resources } = get();
    const res = resources.find((r) => r.id === resourceId);
    if (!res || res.currentStock < quantity) return false;

    const newStock = res.currentStock - quantity;
    const status =
      newStock <= 0
        ? 'CRITICAL EMPTY'
        : newStock <= res.minThreshold
        ? 'LOW STOCK'
        : 'OPTIMAL';

    const newLog: ResourceDistributionLog = {
      id: `log_${Date.now()}`,
      resourceId,
      resourceName: res.name,
      quantity,
      unit: res.unit,
      destination,
      missionId,
      dispatchedBy,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      resources: state.resources.map((r) =>
        r.id === resourceId ? { ...r, currentStock: newStock, status } : r
      ),
      distributionLogs: [newLog, ...state.distributionLogs],
    }));

    return true;
  },

  createResource: (resData) =>
    set((state) => ({
      resources: [
        ...state.resources,
        {
          ...resData,
          id: `res_${Date.now()}`,
          status: resData.currentStock <= resData.minThreshold ? 'LOW STOCK' : 'OPTIMAL',
          lastRestocked: 'Just Now',
        },
      ],
    })),
}));
