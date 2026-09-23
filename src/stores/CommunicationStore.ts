import { create } from 'zustand';
import { ChatMessage, EmergencyBroadcast } from '../types/eoc';

export interface CommunicationStoreState {
  chatMessages: ChatMessage[];
  broadcasts: EmergencyBroadcast[];
  activeChannel: 'general' | 'mission' | 'command' | 'emergency';
  isVoiceCallActive: boolean;
  activeVoiceCallRecipient: string | null;

  setActiveChannel: (channel: 'general' | 'mission' | 'command' | 'emergency') => void;
  sendChatMessage: (text: string, isUrgent?: boolean) => void;
  sendBroadcast: (broadcast: Omit<EmergencyBroadcast, 'id' | 'timestamp' | 'isAcknowledged'>) => void;
  acknowledgeBroadcast: (id: string) => void;
  startVoiceCall: (recipientName: string) => void;
  endVoiceCall: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderName: 'Capt. Marcus Vance',
    senderRole: 'Alpha Rescue Leader',
    channel: 'mission',
    text: 'Zodiac rescue boat in water at Sector 4 embankment. 3 adults and 3 children spotted on roof.',
    timestamp: '10:14 UTC',
  },
  {
    id: 'msg_2',
    senderName: 'Commander EOC',
    senderRole: 'EOC Dispatcher',
    channel: 'mission',
    text: 'Copy Alpha-1. Charlie Medical Evac Unit is standing by at Victoria Hospital for victim intake.',
    timestamp: '10:15 UTC',
  },
  {
    id: 'msg_3',
    senderName: 'Eng. Alex Mercer',
    senderRole: 'UAV Pilot',
    channel: 'general',
    text: 'Matrice 300 thermal drone flight path clear over HAL Airport Road.',
    timestamp: '10:18 UTC',
  },
];

const INITIAL_BROADCASTS: EmergencyBroadcast[] = [
  {
    id: 'bc_1',
    sender: 'EOC Supreme Command',
    title: 'RED ALERT: Kaveri River Water Level Rise',
    message: 'Kaveri river overflow cresting at +2.8 meters. Mandatory immediate evacuation for Sector 4 and Sector 7 residents.',
    severity: 'critical',
    targetAudience: 'All Tactical Field Units & Citizens',
    timestamp: '10:00 UTC',
    isAcknowledged: true,
  },
  {
    id: 'bc_2',
    sender: 'Logistics Control Hub',
    title: 'Supply Route Alteration',
    message: 'HAL Airport Main Junction closed due to downed live power cable. Reroute all supply trucks via Outer Ring Road Corridor.',
    severity: 'warning',
    targetAudience: 'Supply Drivers & Convoy Leads',
    timestamp: '09:45 UTC',
    isAcknowledged: false,
  },
];

export const useCommunicationStore = create<CommunicationStoreState>((set, get) => ({
  chatMessages: INITIAL_MESSAGES,
  broadcasts: INITIAL_BROADCASTS,
  activeChannel: 'general',
  isVoiceCallActive: false,
  activeVoiceCallRecipient: null,

  setActiveChannel: (activeChannel) => set({ activeChannel }),

  sendChatMessage: (text, isUrgent = false) => {
    const channel = get().activeChannel;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderName: 'Commander EOC',
      senderRole: 'EOC Command Unit',
      channel,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUrgent,
    };
    set((state) => ({ chatMessages: [...state.chatMessages, newMsg] }));
  },

  sendBroadcast: (bcastData) => {
    const newBcast: EmergencyBroadcast = {
      ...bcastData,
      id: `bc_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAcknowledged: false,
    };
    set((state) => ({ broadcasts: [newBcast, ...state.broadcasts] }));
  },

  acknowledgeBroadcast: (id) =>
    set((state) => ({
      broadcasts: state.broadcasts.map((b) => (b.id === id ? { ...b, isAcknowledged: true } : b)),
    })),

  startVoiceCall: (recipientName) =>
    set({ isVoiceCallActive: true, activeVoiceCallRecipient: recipientName }),

  endVoiceCall: () => set({ isVoiceCallActive: false, activeVoiceCallRecipient: null }),
}));
