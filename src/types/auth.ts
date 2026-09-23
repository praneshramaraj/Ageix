export type UserRole =
  | 'Administrator'
  | 'Disaster Commander'
  | 'Dispatcher'
  | 'Rescue Team Leader'
  | 'Field Officer'
  | 'Viewer';

export type Permission =
  | 'VIEW_DASHBOARD'
  | 'MANAGE_INCIDENTS'
  | 'CREATE_INCIDENT'
  | 'MANAGE_MISSIONS'
  | 'DISPATCH_UNITS'
  | 'MANAGE_RESOURCES'
  | 'TRANSFER_RESOURCES'
  | 'MANAGE_VEHICLES'
  | 'MANAGE_PERSONNEL'
  | 'MANAGE_HOSPITALS'
  | 'MANAGE_SHELTERS'
  | 'BROADCAST_COMMUNICATION'
  | 'VIEW_AI_CENTER'
  | 'VIEW_ANALYTICS'
  | 'EXPORT_REPORTS'
  | 'MANAGE_SETTINGS'
  | 'ADMIN_ACCESS';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  callsign: string;
  badgeNumber: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Administrator: [
    'VIEW_DASHBOARD',
    'MANAGE_INCIDENTS',
    'CREATE_INCIDENT',
    'MANAGE_MISSIONS',
    'DISPATCH_UNITS',
    'MANAGE_RESOURCES',
    'TRANSFER_RESOURCES',
    'MANAGE_VEHICLES',
    'MANAGE_PERSONNEL',
    'MANAGE_HOSPITALS',
    'MANAGE_SHELTERS',
    'BROADCAST_COMMUNICATION',
    'VIEW_AI_CENTER',
    'VIEW_ANALYTICS',
    'EXPORT_REPORTS',
    'MANAGE_SETTINGS',
    'ADMIN_ACCESS',
  ],
  'Disaster Commander': [
    'VIEW_DASHBOARD',
    'MANAGE_INCIDENTS',
    'CREATE_INCIDENT',
    'MANAGE_MISSIONS',
    'DISPATCH_UNITS',
    'MANAGE_RESOURCES',
    'TRANSFER_RESOURCES',
    'MANAGE_VEHICLES',
    'MANAGE_PERSONNEL',
    'MANAGE_HOSPITALS',
    'MANAGE_SHELTERS',
    'BROADCAST_COMMUNICATION',
    'VIEW_AI_CENTER',
    'VIEW_ANALYTICS',
    'EXPORT_REPORTS',
    'MANAGE_SETTINGS',
  ],
  Dispatcher: [
    'VIEW_DASHBOARD',
    'MANAGE_INCIDENTS',
    'CREATE_INCIDENT',
    'MANAGE_MISSIONS',
    'DISPATCH_UNITS',
    'MANAGE_RESOURCES',
    'MANAGE_VEHICLES',
    'MANAGE_PERSONNEL',
    'MANAGE_HOSPITALS',
    'MANAGE_SHELTERS',
    'BROADCAST_COMMUNICATION',
    'VIEW_ANALYTICS',
  ],
  'Rescue Team Leader': [
    'VIEW_DASHBOARD',
    'MANAGE_INCIDENTS',
    'MANAGE_MISSIONS',
    'MANAGE_RESOURCES',
    'MANAGE_VEHICLES',
    'MANAGE_PERSONNEL',
    'BROADCAST_COMMUNICATION',
    'VIEW_AI_CENTER',
  ],
  'Field Officer': [
    'VIEW_DASHBOARD',
    'MANAGE_INCIDENTS',
    'MANAGE_RESOURCES',
    'BROADCAST_COMMUNICATION',
  ],
  Viewer: ['VIEW_DASHBOARD', 'VIEW_AI_CENTER', 'VIEW_ANALYTICS'],
};
