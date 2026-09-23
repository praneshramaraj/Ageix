import { create } from 'zustand';
import { EocDefconLevel } from '../types/eoc';

export interface EocNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
  isRead: boolean;
}

export interface CommandStoreState {
  defconLevel: EocDefconLevel;
  setDefconLevel: (level: EocDefconLevel) => void;

  weatherSummary: {
    condition: string;
    temperatureC: number;
    windSpeedKmh: number;
    precipitationMm: number;
    category: string;
  };

  systemHealth: {
    tileServerStatus: 'Online' | 'Degraded' | 'Offline';
    apiGatewayStatus: 'Online' | 'Degraded' | 'Offline';
    radioCommsUplink: '100% Encrypted' | 'Intermittent' | 'Offline';
    dbLatencyMs: number;
  };

  notifications: EocNotification[];
  addNotification: (notif: Omit<EocNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

export const useCommandStore = create<CommandStoreState>((set) => ({
  defconLevel: 'DEFCON 2',
  setDefconLevel: (defconLevel) => set({ defconLevel }),

  weatherSummary: {
    condition: 'Heavy Cyclone Rainfall',
    temperatureC: 24,
    windSpeedKmh: 85,
    precipitationMm: 120,
    category: 'Category 4 Cyclone VARUNA',
  },

  systemHealth: {
    tileServerStatus: 'Online',
    apiGatewayStatus: 'Online',
    radioCommsUplink: '100% Encrypted',
    dbLatencyMs: 14,
  },

  notifications: [
    {
      id: 'notif_1',
      title: 'CRITICAL SOS ALERT',
      message: 'SOS #4012 received from Kaveri River Overflow Zone - 6 Civilians Trapped.',
      type: 'danger',
      timestamp: '5 mins ago',
      isRead: false,
    },
    {
      id: 'notif_2',
      title: 'Low Supply Threshold',
      message: 'Trauma Medical Kits at Central Warehouse fallen below 20% minimum threshold.',
      type: 'warning',
      timestamp: '15 mins ago',
      isRead: false,
    },
    {
      id: 'notif_3',
      title: 'Mission Unit Deployed',
      message: 'Alpha Rescue Team dispatched to HAL Road Inundation Site.',
      type: 'info',
      timestamp: '25 mins ago',
      isRead: true,
    },
  ],

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        {
          ...notif,
          id: `notif_${Date.now()}`,
          timestamp: 'Just now',
          isRead: false,
        },
        ...state.notifications,
      ],
    })),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    })),

  clearAllNotifications: () => set({ notifications: [] }),

  isCommandPaletteOpen: false,
  setIsCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
}));
