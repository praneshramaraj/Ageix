import { create } from 'zustand';
import { EocUser, UserRole, AuditLogItem } from '../types/eoc';

export interface AdminStoreState {
  users: EocUser[];
  auditLogs: AuditLogItem[];
  currentUser: EocUser;

  updateUserRole: (id: string, role: UserRole) => void;
  updateUserStatus: (id: string, status: EocUser['status']) => void;
  createUser: (user: Omit<EocUser, 'id' | 'lastActive'>) => void;
  deleteUser: (id: string) => void;
  logAuditAction: (action: string, module: string, details: string) => void;
}

const INITIAL_USERS: EocUser[] = [
  {
    id: 'usr_1',
    name: 'Alexander Vance',
    email: 'vance@aegisx.eoc.gov',
    role: 'Super Admin',
    department: 'EOC Supreme Command',
    status: 'On Duty',
    phone: '+91 98000 11001',
    lastActive: 'Active Now',
  },
  {
    id: 'usr_2',
    name: 'Sarah Jenkins',
    email: 'jenkins@aegisx.eoc.gov',
    role: 'Rescue Commander',
    department: 'Field Rescue Operations',
    status: 'On Duty',
    phone: '+91 98000 11002',
    lastActive: 'Active Now',
  },
  {
    id: 'usr_3',
    name: 'David Lee',
    email: 'lee@aegisx.eoc.gov',
    role: 'Dispatcher',
    department: 'Emergency Dispatch Center',
    status: 'On Duty',
    phone: '+91 98000 11003',
    lastActive: '5 mins ago',
  },
  {
    id: 'usr_4',
    name: 'Dr. Anita Roy',
    email: 'roy@aegisx.eoc.gov',
    role: 'Team Leader',
    department: 'Medical Trauma Unit',
    status: 'Active',
    phone: '+91 98000 11004',
    lastActive: '12 mins ago',
  },
  {
    id: 'usr_5',
    name: 'Rahul Sharma',
    email: 'sharma@aegisx.eoc.gov',
    role: 'Field Rescuer',
    department: 'Fire & Heavy Rescue',
    status: 'On Duty',
    phone: '+91 98000 11005',
    lastActive: '18 mins ago',
  },
  {
    id: 'usr_6',
    name: 'Global Observer Node',
    email: 'observer@aegisx.eoc.gov',
    role: 'Observer',
    department: 'Civil Defense Press Office',
    status: 'Active',
    phone: '+91 98000 11006',
    lastActive: '1 hour ago',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud_1',
    timestamp: '2026-09-15 10:15:22',
    userId: 'usr_1',
    userName: 'Alexander Vance',
    userRole: 'Super Admin',
    action: 'DISPATCH_MISSION',
    targetModule: 'Mission Control',
    details: 'Dispatched MSN-2026-0401 (Alpha Water Rescue Squad)',
    ipAddress: '192.168.1.10',
  },
  {
    id: 'aud_2',
    timestamp: '2026-09-15 10:00:15',
    userId: 'usr_1',
    userName: 'Alexander Vance',
    userRole: 'Super Admin',
    action: 'BROADCAST_ALERT',
    targetModule: 'Comms Center',
    details: 'Issued RED ALERT evac warning for Kaveri Sector 4',
    ipAddress: '192.168.1.10',
  },
  {
    id: 'aud_3',
    timestamp: '2026-09-15 09:30:40',
    userId: 'usr_3',
    userName: 'David Lee',
    userRole: 'Dispatcher',
    action: 'UPDATE_RESOURCE',
    targetModule: 'Logistics',
    details: 'Dispatched 500 Fleece Blankets to Sector 2 Shelter',
    ipAddress: '192.168.1.44',
  },
];

export const useAdminStore = create<AdminStoreState>((set, get) => ({
  users: INITIAL_USERS,
  auditLogs: INITIAL_AUDIT_LOGS,
  currentUser: INITIAL_USERS[0],

  updateUserRole: (id, role) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, role } : u)),
    }));
    get().logAuditAction('UPDATE_ROLE', 'User Management', `Updated user ID ${id} role to ${role}`);
  },

  updateUserStatus: (id, status) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status } : u)),
    }));
  },

  createUser: (userData) => {
    const newUser: EocUser = {
      ...userData,
      id: `usr_${Date.now()}`,
      lastActive: 'Just Created',
    };
    set((state) => ({ users: [...state.users, newUser] }));
    get().logAuditAction('CREATE_USER', 'User Management', `Created user account for ${newUser.name}`);
  },

  deleteUser: (id) => {
    set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
    get().logAuditAction('DELETE_USER', 'User Management', `Deleted user ID ${id}`);
  },

  logAuditAction: (action, module, details) => {
    const { currentUser } = get();
    const newLog: AuditLogItem = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      targetModule: module,
      details,
      ipAddress: '192.168.1.10',
    };
    set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
  },
}));
